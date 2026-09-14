import Subscription from "../models/Subscription.js";
import razorpay from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import crypto from "crypto";

// Get current candidate subscription
const getMySubscription = async (req, res) => {
    try {
        const userId = req.user.userId;

        let subscription = await Subscription.findOne({
            userId,
            userType: "CANDIDATE",
            status: "ACTIVE"
        }).sort({ createdAt: -1 });

        // If no active subscription exists,
        // create a FREE subscription.
        if (!subscription) {
            subscription = await Subscription.create({
                userId,
                userType: "CANDIDATE",
                plan: "FREE",
                billingCycle: "NONE",
                status: "ACTIVE",
                startDate: new Date(),
                credits: 0
            });
        }

        return res.status(200).json({
            success: true,
            subscription
        });

    } catch (error) {
        console.error("Get subscription error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Select / activate candidate plan
const activateCandidatePlan = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { plan } = req.body;

        const allowedPlans = [
            "FREE",
            "JOB_SEEKER_PRO",
            "JOB_SEEKER_PREMIUM"
        ];

        if (!allowedPlans.includes(plan)) {
            return res.status(400).json({
                success: false,
                message: "Invalid candidate plan"
            });
        }

        // FREE plan
        if (plan === "FREE") {
            const activeSubscription =
                await Subscription.findOne({
                    userId,
                    userType: "CANDIDATE",
                    status: "ACTIVE"
                });

            if (activeSubscription) {
                return res.status(409).json({
                    success: false,
                    message: "An active subscription already exists"
                });
            }

            const subscription = await Subscription.create({
                userId,
                userType: "CANDIDATE",
                plan: "FREE",
                billingCycle: "NONE",
                status: "ACTIVE",
                startDate: new Date(),
                credits: 0
            });

            return res.status(201).json({
                success: true,
                message: "Free plan activated successfully",
                subscription
            });
        }

        // Paid plans are not actually charged here.
        // Payment gateway will be integrated later.
        return res.status(200).json({
            success: true,
            message: "Plan selected. Payment is required to activate it.",
            plan,
            paymentRequired: true
        });

    } catch (error) {
        console.error("Activate candidate plan error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const createCandidatePaymentOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { plan } = req.body;

        const candidatePlans = {
            JOB_SEEKER_PRO: {
                amount: 29900,
                billingCycle: "MONTHLY"
            },

            JOB_SEEKER_PREMIUM: {
                amount: 59900,
                billingCycle: "MONTHLY"
            }
        };

        if (!candidatePlans[plan]) {
            return res.status(400).json({
                success: false,
                message: "Invalid paid candidate plan"
            });
        }

        const planDetails = candidatePlans[plan];

        const order = await razorpay.orders.create({
            amount: planDetails.amount,
            currency: "INR",
            receipt: `candidate_${userId}_${Date.now()}`,
            notes: {
                userId: userId.toString(),
                plan
            }
        });

        const subscription = await Subscription.create({
            userId,
            userType: "CANDIDATE",
            plan,
            billingCycle: planDetails.billingCycle,
            status: "CANCELLED",
            startDate: new Date(),
            credits: 0,
            razorpayOrderId: order.id
        });

        const payment = await Payment.create({
            userId,
            subscriptionId: subscription._id,
            plan,
            amount: planDetails.amount,
            currency: "INR",
            status: "CREATED",
            razorpayOrderId: order.id
        });

        return res.status(201).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            },
            paymentId: payment._id,
            subscriptionId: subscription._id,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Create Razorpay order error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create payment order"
        });
    }
};



const verifyCandidatePayment = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            razorpay_payment_id,
            razorpay_signature,
            paymentId
        } = req.body;

        if (
            !razorpay_payment_id ||
            !razorpay_signature ||
            !paymentId
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification data is required"
            });
        }

        // Get payment from our database
        const payment = await Payment.findOne({
            _id: paymentId,
            userId
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found"
            });
        }

        // Prevent duplicate verification
        if (payment.status === "PAID") {
            return res.status(409).json({
                success: false,
                message: "Payment is already verified"
            });
        }

        // Get subscription
        const subscription = await Subscription.findOne({
            _id: payment.subscriptionId,
            userId,
            userType: "CANDIDATE"
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        // Razorpay order ID comes from our DB
        const orderId = payment.razorpayOrderId;

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${orderId}|${razorpay_payment_id}`
            )
            .digest("hex");

        const signatureBuffer =
            Buffer.from(generatedSignature, "utf8");

        const receivedBuffer =
            Buffer.from(razorpay_signature, "utf8");

        const signatureValid =
            signatureBuffer.length ===
            receivedBuffer.length &&
            crypto.timingSafeEqual(
                signatureBuffer,
                receivedBuffer
            );

        if (!signatureValid) {
            payment.status = "FAILED";
            await payment.save();

            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Payment verified
        payment.status = "PAID";
        payment.razorpayPaymentId =
            razorpay_payment_id;
        payment.razorpaySignature =
            razorpay_signature;

        await payment.save();

        // Activate subscription
        subscription.status = "ACTIVE";
        subscription.startDate = new Date();

        const endDate = new Date();
        endDate.setMonth(
            endDate.getMonth() + 1
        );

        subscription.endDate = endDate;

        subscription.razorpayOrderId =
            payment.razorpayOrderId;

        subscription.razorpayPaymentId =
            razorpay_payment_id;

        await subscription.save();

        return res.status(200).json({
            success: true,
            message:
                "Payment verified and subscription activated",
            subscription
        });

    } catch (error) {
        console.error(
            "Payment verification error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};


export {
    getMySubscription,
    activateCandidatePlan,
    createCandidatePaymentOrder,
    verifyCandidatePayment
};