import { useEffect, useState } from "react";
import {
  Crown,
  CheckCircle,
  Calendar,
  CreditCard,
  Sparkles,
} from "lucide-react";
import api from "../services/api";

const plans = [
  {
    name: "FREE",
    title: "Free Plan",
    price: "₹0",
    description: "Basic access for fresh candidates.",
    features: [
      "View jobs",
      "Basic profile",
      "Upload resume",
      "Limited applications",
    ],
  },
  {
    name: "JOB_SEEKER_PRO",
    title: "Job Seeker Pro",
    price: "₹299 / Month",
    description: "Best for active job seekers.",
    features: [
      "Unlimited job applications",
      "Priority application",
      "AI Job Match",
      "Application tracking",
    ],
  },
  {
    name: "JOB_SEEKER_PREMIUM",
    title: "Job Seeker Premium",
    price: "₹599 / Month",
    description: "Everything in PRO + premium features.",
    features: [
      "Unlimited applications",
      "Highest priority profile",
      "AI Resume Review",
      "Career insights",
      "Premium badge",
    ],
  },
];

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState("");

  // Load current subscription
  const fetchSubscription = async () => {
    try {
      const res = await api.get("/subscriptions/me");
      setSubscription(res.data.subscription);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  // FREE Plan
  const activateFreePlan = async () => {
    try {
      setProcessing("FREE");

      const res = await api.post("/subscriptions/candidate/activate", {
        plan: "FREE",
      });
      alert(res.data.message);
      fetchSubscription();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setProcessing("");
    }
  };

  // Paid Plans (Razorpay next step)
  const choosePaidPlan = async (plan) => {
    try {
      setProcessing(plan);

      // 1. Create Razorpay order from backend
      const res = await api.post("/subscriptions/candidate/payment/order", {
        plan,
      });

      const { order, paymentId, subscriptionId, key } = res.data;

      // 2. Load Razorpay Checkout
      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        const options = {
          key: key,

          amount: order.amount,

          currency: order.currency,

          name: "TalentBridge AI",

          description:
            plan === "JOB_SEEKER_PRO"
              ? "Job Seeker Pro Subscription"
              : "Job Seeker Premium Subscription",

          order_id: order.id,

          handler: async function (response) {
            try {
              setProcessing(plan);

              // 3. Verify payment on backend
              const verifyRes = await api.post(
                "/subscriptions/candidate/payment/verify",
                {
                  paymentId: paymentId,
                  subscriptionId: subscriptionId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
              );

              alert(
                verifyRes.data.message ||
                  "Payment successful! Subscription activated.",
              );

              // 4. Refresh current subscription
              await fetchSubscription();
            } catch (error) {
              alert(
                error.response?.data?.message || "Payment verification failed",
              );
            } finally {
              setProcessing("");
            }
          },

          prefill: {
            name: "",
            email: "",
          },

          theme: {
            color: "#2563eb",
          },

          modal: {
            ondismiss: function () {
              setProcessing("");
            },
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", function (response) {
          console.log("Payment failed:", response.error);

          alert(response.error?.description || "Payment failed");

          setProcessing("");
        });

        razorpay.open();
      };

      script.onerror = () => {
        alert(
          "Unable to load Razorpay. Please check your internet connection.",
        );
        setProcessing("");
      };

      document.body.appendChild(script);
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to create payment order");

      setProcessing("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        Loading subscription...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Candidate Subscription
        </h1>

        <p className="text-slate-500 mt-2">
          Upgrade your plan to unlock premium hiring features.
        </p>
      </div>

      {/* Current Subscription */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <Crown size={28} />
          <h2 className="text-2xl font-semibold">Current Plan</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div>
            <p className="text-blue-100 text-sm">Plan</p>

            <h3 className="text-xl font-bold">{subscription?.plan}</h3>
          </div>

          <div>
            <p className="text-blue-100 text-sm">Status</p>

            <h3 className="text-xl font-bold">{subscription?.status}</h3>
          </div>

          <div>
            <p className="text-blue-100 text-sm">Billing Cycle</p>

            <h3 className="text-xl font-bold">{subscription?.billingCycle}</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3">
            <Calendar />
            <div>
              <p className="text-sm text-blue-100">Start Date</p>

              <p>
                {subscription?.startDate
                  ? new Date(subscription.startDate).toLocaleDateString("en-GB")
                  : "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar />
            <div>
              <p className="text-sm text-blue-100">End Date</p>

              <p>
                {subscription?.endDate
                  ? new Date(subscription.endDate).toLocaleDateString("en-GB")
                  : "Unlimited"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}

      <div>
        <h2 className="text-2xl font-bold mb-5">Available Plans</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const current = subscription?.plan === plan.name;

            return (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 shadow-sm ${
                  current ? "border-green-500 bg-green-50" : "border-slate-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{plan.title}</h3>

                  {current && <CheckCircle className="text-green-600" />}
                </div>

                <p className="text-3xl font-bold text-blue-600 mt-4">
                  {plan.price}
                </p>

                <p className="text-slate-500 mt-2">{plan.description}</p>

                <ul className="space-y-2 mt-5">
                  {plan.features.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={18} className="text-green-600" />

                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() =>
                    plan.name === "FREE"
                      ? activateFreePlan()
                      : choosePaidPlan(plan.name)
                  }
                  disabled={current || processing === plan.name}
                  className={`w-full mt-6 py-3 rounded-xl font-semibold ${
                    current
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {current
                    ? "Current Plan"
                    : processing === plan.name
                      ? "Processing..."
                      : plan.name === "FREE"
                        ? "Activate Free"
                        : "Choose Plan"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Banner */}

      <div className="rounded-2xl bg-purple-50 border border-purple-200 p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-purple-600" />

          <h2 className="text-xl font-semibold text-purple-700">
            Why upgrade?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-5">
          {[
            "AI-based Job Match Score",
            "Unlimited Job Applications",
            "Priority Recruiter Visibility",
            "Application Status Tracking",
            "Resume Insights",
            "Premium Candidate Badge",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={18} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Info */}

      <div className="rounded-xl border border-slate-200 p-5 bg-slate-50">
        <div className="flex items-center gap-3 mb-3">
          <CreditCard className="text-blue-600" />

          <h3 className="font-semibold">Secure Payment</h3>
        </div>

        <p className="text-slate-600 text-sm">
          Premium subscriptions are processed securely using Razorpay. After
          payment verification your subscription becomes ACTIVE automatically.
        </p>
      </div>
    </div>
  );
};

export default Subscription;
