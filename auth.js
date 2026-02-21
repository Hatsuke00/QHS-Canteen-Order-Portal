(() => {
    "use strict";

    const STORAGE_KEYS = {
        users: "users",
        currentUser: "currentUser",
        orders: "orders"
    };

    const LEGACY_STORAGE_KEYS = {
        users: "qhs_users",
        currentUser: "qhs_current_user",
        orders: "qhs_orders"
    };

    const ROLE_STUDENT = "student";
    const ROLE_STAFF = "staff";

    const LOGIN_PAGE = "Login.html";
    const STUDENT_PAGE = "Student-dashboard.html";
    const STAFF_PAGE = "Staff-dashboard.html";

    const tabButtons = Array.from(document.querySelectorAll(".auth-tab-btn"));
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const authMessage = document.getElementById("auth-message");
    const roleSelect = document.getElementById("reg-role");
    const regIdGroup = document.getElementById("reg-id-group");
    const regClassGroup = document.getElementById("reg-class-group");
    const regIdLabel = document.querySelector("label[for='reg-id-number']");
    const regClassLabel = document.querySelector("label[for='reg-class-dept']");
    const regIdInput = document.getElementById("reg-id-number");
    const regClassInput = document.getElementById("reg-class-dept");

    bootstrapStorage();
    redirectIfAlreadyLoggedIn();
    bindTabSwitching();
    bindPasswordToggles();
    bindRoleDependentFields();
    bindRegistration();
    bindLogin();

    function bootstrapStorage() {
        migrateLegacyStorage();

        const users = getUsers();
        if (!Array.isArray(users)) {
            saveUsers([]);
        }

        const orders = readJson(STORAGE_KEYS.orders, []);
        if (!Array.isArray(orders)) {
            writeJson(STORAGE_KEYS.orders, []);
        }
    }

    function migrateLegacyStorage() {
        Object.keys(STORAGE_KEYS).forEach((storageName) => {
            const activeKey = STORAGE_KEYS[storageName];
            const legacyKey = LEGACY_STORAGE_KEYS[storageName];
            const activeValue = window.localStorage.getItem(activeKey);
            const legacyValue = window.localStorage.getItem(legacyKey);

            if ((activeValue === null || activeValue === "") && legacyValue !== null) {
                window.localStorage.setItem(activeKey, legacyValue);
            }
        });
    }

    function redirectIfAlreadyLoggedIn() {
        const currentUser = getCurrentUser();
        if (!currentUser || !isSupportedRole(currentUser.role)) {
            return;
        }

        redirectByRole(currentUser.role);
    }

    function bindTabSwitching() {
        if (!tabButtons.length) {
            return;
        }

        tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const tab = button.dataset.authTab;
                if (!tab) {
                    return;
                }
                setActiveTab(tab);
                clearMessage();
            });
        });
    }

    function setActiveTab(tabName) {
        tabButtons.forEach((button) => {
            const active = button.dataset.authTab === tabName;
            button.classList.toggle("active", active);
        });

        if (loginForm) {
            loginForm.classList.toggle("active", tabName === "login");
        }

        if (registerForm) {
            registerForm.classList.toggle("active", tabName === "register");
        }
    }

    function bindPasswordToggles() {
        const toggleButtons = Array.from(document.querySelectorAll(".password-toggle-btn"));
        toggleButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const targetId = button.getAttribute("data-target");
                if (!targetId) {
                    return;
                }

                const input = document.getElementById(targetId);
                if (!input) {
                    return;
                }

                const show = input.type === "password";
                input.type = show ? "text" : "password";
                button.textContent = show ? "Hide" : "Show";
            });
        });
    }

    function bindRoleDependentFields() {
        if (!roleSelect) {
            return;
        }

        const syncRoleFields = () => {
            const role = normalizeRole(roleSelect.value);

            if (role === ROLE_STAFF) {
                if (regIdLabel) {
                    regIdLabel.textContent = "Employee ID";
                }
                if (regClassLabel) {
                    regClassLabel.textContent = "Department";
                }
                if (regIdInput) {
                    regIdInput.placeholder = "Enter employee ID";
                }
                if (regClassInput) {
                    regClassInput.placeholder = "Enter department";
                }
            } else {
                if (regIdLabel) {
                    regIdLabel.textContent = "LRN";
                }
                if (regClassLabel) {
                    regClassLabel.textContent = "Grade and Section";
                }
                if (regIdInput) {
                    regIdInput.placeholder = "123456789012";
                }
                if (regClassInput) {
                    regClassInput.placeholder = "Grade 10 - Section Newton";
                }
            }

            if (regIdGroup) {
                regIdGroup.classList.remove("hidden");
            }

            if (regClassGroup) {
                regClassGroup.classList.remove("hidden");
            }
        };

        syncRoleFields();
        roleSelect.addEventListener("change", syncRoleFields);
    }

    function bindRegistration() {
        if (!registerForm) {
            return;
        }

        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            clearMessage();

            const formData = new FormData(registerForm);
            const role = normalizeRole(formData.get("role"));
            const fullName = cleanText(formData.get("fullName"));
            const idNumber = cleanText(formData.get("idNumber"));
            const classDepartment = cleanText(formData.get("classDepartment"));
            const email = normalizeEmail(formData.get("email"));
            const password = String(formData.get("password") || "");
            const confirmPassword = String(formData.get("confirmPassword") || "");

            if (!isSupportedRole(role)) {
                showMessage("Please select a valid role.", "error");
                return;
            }

            if (!fullName) {
                showMessage("Full name is required.", "error");
                return;
            }

            if (!idNumber || !classDepartment) {
                showMessage("Please complete all account details.", "error");
                return;
            }

            if (!email) {
                showMessage("Please provide a valid email.", "error");
                return;
            }

            if (password.length < 6) {
                showMessage("Password must be at least 6 characters.", "error");
                return;
            }

            if (password !== confirmPassword) {
                showMessage("Password and confirm password do not match.", "error");
                return;
            }

            const users = getUsers();
            const exists = users.some((user) => normalizeEmail(user.email) === email);
            if (exists) {
                showMessage("An account with this email already exists.", "error");
                return;
            }

            const user = {
                id: buildUserId(role),
                role,
                fullName,
                idNumber,
                classDepartment,
                email,
                password,
                createdAt: new Date().toISOString()
            };

            users.push(user);
            saveUsers(users);
            setCurrentUser(toSessionUser(user));

            showMessage("Registration successful. Redirecting...", "success");
            window.setTimeout(() => {
                redirectByRole(role);
            }, 300);
        });
    }

    function bindLogin() {
        if (!loginForm) {
            return;
        }

        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            clearMessage();

            const formData = new FormData(loginForm);
            const requestedRole = normalizeRole(formData.get("login-role"));
            const email = normalizeEmail(formData.get("email"));
            const password = String(formData.get("password") || "");

            if (!isSupportedRole(requestedRole)) {
                showMessage("Please choose Student or Staff before logging in.", "error");
                return;
            }

            if (!email || !password) {
                showMessage("Email and password are required.", "error");
                return;
            }

            const users = getUsers();
            const user = users.find((entry) => normalizeEmail(entry.email) === email);
            if (!user) {
                showMessage("Account not found. Please register first.", "error");
                return;
            }

            if (String(user.password) !== password) {
                showMessage("Incorrect password.", "error");
                return;
            }

            if (normalizeRole(user.role) !== requestedRole) {
                showMessage("Selected role does not match this account.", "error");
                return;
            }

            setCurrentUser(toSessionUser(user));
            showMessage("Login successful. Redirecting...", "success");

            window.setTimeout(() => {
                redirectByRole(user.role);
            }, 250);
        });
    }

    function toSessionUser(user) {
        return {
            id: user.id,
            role: normalizeRole(user.role),
            fullName: cleanText(user.fullName),
            idNumber: cleanText(user.idNumber),
            classDepartment: cleanText(user.classDepartment),
            email: normalizeEmail(user.email)
        };
    }

    function redirectByRole(role) {
        const safeRole = normalizeRole(role);
        if (safeRole === ROLE_STUDENT) {
            window.location.replace(STUDENT_PAGE);
            return;
        }
        if (safeRole === ROLE_STAFF) {
            window.location.replace(STAFF_PAGE);
            return;
        }
        window.location.replace(LOGIN_PAGE);
    }

    function showMessage(text, type) {
        if (!authMessage) {
            return;
        }

        authMessage.textContent = text || "";
        authMessage.classList.remove("success", "error");
        if (type === "success" || type === "error") {
            authMessage.classList.add(type);
        }
    }

    function clearMessage() {
        showMessage("", "");
    }

    function getUsers() {
        const users = readJson(STORAGE_KEYS.users, []);
        return Array.isArray(users) ? users : [];
    }

    function saveUsers(users) {
        writeJson(STORAGE_KEYS.users, Array.isArray(users) ? users : []);
    }

    function getCurrentUser() {
        return readJson(STORAGE_KEYS.currentUser, null);
    }

    function setCurrentUser(user) {
        writeJson(STORAGE_KEYS.currentUser, user || null);
    }

    function readJson(key, fallbackValue) {
        try {
            const raw = window.localStorage.getItem(key);
            if (raw === null || raw === "") {
                return fallbackValue;
            }
            return JSON.parse(raw);
        } catch (error) {
            return fallbackValue;
        }
    }

    function writeJson(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    function cleanText(value) {
        return String(value || "").trim();
    }

    function normalizeEmail(value) {
        return cleanText(value).toLowerCase();
    }

    function normalizeRole(value) {
        const role = cleanText(value).toLowerCase();
        return role === ROLE_STAFF ? ROLE_STAFF : role === ROLE_STUDENT ? ROLE_STUDENT : "";
    }

    function isSupportedRole(role) {
        return role === ROLE_STUDENT || role === ROLE_STAFF;
    }

    function buildUserId(role) {
        const rolePrefix = role === ROLE_STAFF ? "STF" : "STD";
        const timestamp = Date.now().toString(36).toUpperCase();
        const randomBlock = Math.floor(Math.random() * 900 + 100).toString();
        return `${rolePrefix}-${timestamp}-${randomBlock}`;
    }
})();
