document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const messageEl = document.getElementById("auth-message");
  const tabButtons = document.querySelectorAll("[data-auth-tab]");

  const registerRoleInput = document.getElementById("register-role");
  const roleButtons = document.querySelectorAll("[data-register-role-btn]");
  const studentFields = document.getElementById("student-register-fields");
  const staffFields = document.getElementById("staff-register-fields");

  const registerLrn = document.getElementById("register-lrn");
  const registerGrade = document.getElementById("register-grade");
  const registerSection = document.getElementById("register-section");
  const registerEmail = document.getElementById("register-email");
  const registerStaffNumber = document.getElementById("register-staff-number");

  function setMessage(message, isError = false) {
    messageEl.textContent = message;
    messageEl.classList.toggle("error", isError);
    messageEl.classList.toggle("success", !isError && message.length > 0);
  }

  function applyRoleFields() {
    const role = String(registerRoleInput.value || "student").trim().toLowerCase();
    const isStudent = role === "student";

    roleButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.registerRoleBtn === role);
    });

    studentFields.classList.toggle("hidden", !isStudent);
    staffFields.classList.toggle("hidden", isStudent);

    registerLrn.required = isStudent;
    registerGrade.required = isStudent;
    registerSection.required = isStudent;
    registerEmail.required = isStudent;

    registerStaffNumber.required = !isStudent;

    if (isStudent) {
      registerStaffNumber.value = "";
    } else {
      registerLrn.value = "";
      registerGrade.value = "";
      registerSection.value = "";
      registerEmail.value = "";
    }
  }

  function setRegisterRole(role) {
    registerRoleInput.value = role;
    applyRoleFields();
  }

  function showTab(tabName) {
    const showLogin = tabName === "login";
    loginForm.classList.toggle("hidden", !showLogin);
    registerForm.classList.toggle("hidden", showLogin);

    tabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.authTab === tabName);
    });

    if (!showLogin) {
      applyRoleFields();
    }

    setMessage("");
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.authTab));
  });

  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setRegisterRole(String(button.dataset.registerRoleBtn || "student"));
    });
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
          full_name: String(formData.get("full_name") || "").trim(),
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
      const role = String(formData.get("role") || "").trim().toLowerCase();
      const body = {
        full_name: String(formData.get("full_name") || "").trim(),
        password: String(formData.get("password") || ""),
        role,
      };

      if (role === "student") {
        body.lrn = String(formData.get("lrn") || "").trim();
        body.grade = String(formData.get("grade") || "").trim();
        body.section = String(formData.get("section") || "").trim();
        body.email = String(formData.get("email") || "").trim();
      } else {
        body.staff_number = String(formData.get("staff_number") || "").trim();
      }

      const result = await window.CanteenAPI.request("auth/register.php", {
        method: "POST",
        body,
      });

      window.location.href = window.CanteenAPI.rolePage(result.user.role);
    } catch (error) {
      setMessage(error.message, true);
    }
  });

  setRegisterRole("student");
});