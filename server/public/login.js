const loginButton =
    document.getElementById("loginButton");

const message =
    document.getElementById("message");

loginButton.addEventListener("click", async () => {

    try {

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const response = await fetch(
            "/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        console.log("Login response:", data);

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Login failed"
            );
        }

        message.textContent =
            "✅ Login successful";

        setTimeout(() => {
            window.location.href =
                "/payment.html";
        }, 500);

    } catch (error) {

        console.error(error);

        message.textContent =
            "❌ " + error.message;
    }

});
