const payButton = document.getElementById("payButton");
const message = document.getElementById("message");

payButton.addEventListener("click", async () => {
  try {
    message.textContent = "Creating order...";

    const response = await fetch("/api/subscriptions/candidate/payment/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        plan: "JOB_SEEKER_PRO",
      }),
    });

    const data = await response.json();

    console.log("ORDER:", data);

    if (!response.ok || !data.success) {
      throw new Error(data.message);
    }

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "",
      description: "Test Transaction",
      order_id: data.order.id,

      prefill: {
        name: "Test Candidate",
        email: "candidate@test.com",
        contact: "+919876543210",
      },

      handler: async function (response) {
        console.log("PAYMENT SUCCESS:", response);

        message.textContent = "Payment successful. Verifying...";

        try {
          const verifyResponse = await fetch(
            "/api/subscriptions/candidate/payment/verify",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              credentials: "include",

              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,

                razorpay_signature: response.razorpay_signature,

                paymentId: data.paymentId,
              }),
            },
          );

          const verifyData = await verifyResponse.json();

          console.log("VERIFICATION RESPONSE:", verifyData);

          if (!verifyResponse.ok || !verifyData.success) {
            throw new Error(
              verifyData.message || "Payment verification failed",
            );
          }

          message.textContent =
            "✅ Payment verified!\n" +
            "✅ Subscription activated!\n\n" +
            "Plan: " +
            verifyData.subscription.plan;
        } catch (error) {
          console.error("Verification error:", error);

          message.textContent = "❌ " + error.message;
        }
      },
    };

    const rzp = new Razorpay(options);

    rzp.once("ready", function (response) {
      console.log("RAZORPAY READY:", response);
    });

    rzp.on("payment.failed", function (response) {
      console.error("PAYMENT FAILED:", response.error);
    });

    console.log("Opening checkout...");
    rzp.open();
  } catch (error) {
    console.error("ERROR:", error);
    message.textContent = error.message;
  }
});
