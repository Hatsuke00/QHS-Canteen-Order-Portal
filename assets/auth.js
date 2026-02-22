document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const messageEl = document.getElementById("auth-message");
  const tabButtons = document.querySelectorAll("[data-auth-tab]");

  function setMessage(message, isError = false) {
    messageEl.textContent = message;
    messageEl.classList.toggle("error", isError);
    messageEl.classList.toggle("success", !isError && message.length > 0);
  }

  function showTab(tabName) {
    const showLogin = tabName === "login";
    loginForm.classList.toggle("hidden", !showLogin);
    registerForm.classList.toggle("hidden", showLogin);

    tabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.authTab === tabName);
    });

    setMessage("");
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.authTab));
  });

  (async () => {
    try {
      const me = await window.CanteenAPI.request("auth/me.php");
      if (me.authenticated && me.user) {
        window.location.href = window.CanteenAPI.rolePage(me.user.role);
      }
    } catch (error) {
      setMessage(error.message, true);
    }
  })();

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(loginForm);

    try {
      const result = await window.CanteenAPI.request("auth/login.php", {
        method: "POST",
        body: {
          username: String(formData.get("username") || "").trim(),
          password: String(formData.get("password") || ""),
        },
      });

      window.location.href = window.CanteenAPI.rolePage(result.user.role);
    } catch (error) {
      setMessage(error.message, true);
    }
  });

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(registerForm);

    try {
      const result = await window.CanteenAPI.request("auth/register.php", {
        method: "POST",
        body: {
          full_name: String(formData.get("full_name") || "").trim(),
          username: String(formData.get("username") || "").trim(),
          password: String(formData.get("password") || ""),
          role: String(formData.get("role") || "").trim().toLowerCase(),
        },
      });

      window.location.href = window.CanteenAPI.rolePage(result.user.role);
    } catch (error) {
      setMessage(error.message, true);
    }
  });
});
