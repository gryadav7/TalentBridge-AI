import Subscription from "../models/Subscription.js";

const requireCandidatePlan = (...allowedPlans) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.userId;

            const subscription = await Subscription.findOne({
                userId,
                userType: "CANDIDATE",
                status: "ACTIVE"
            }).sort({
                createdAt: -1
            });

            if (!subscription) {
                return res.status(403).json({
                    success: false,
                    message: "Active subscription required"
                });
            }

            if (!allowedPlans.includes(subscription.plan)) {
                return res.status(403).json({
                    success: false,
                    message: "This feature requires an eligible subscription"
                });
            }

            req.subscription = subscription;

            next();

        } catch (error) {
            console.error(
                "Subscription middleware error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };
};

export {
    requireCandidatePlan
};