document.addEventListener("DOMContentLoaded", () => {
  const userEl = document.getElementById("staff-user");
  const logoutBtn = document.getElementById("staff-logout-btn");
  const staffMessageEl = document.getElementById("staff-message");
  const activeOrdersEl = document.getElementById("staff-active-orders");
  const historyOrdersEl = document.getElementById("staff-history-orders");
  const pollStatusEl = document.getElementById("staff-poll-status");

  const addToggleBtn = document.getElementById("menu-add-toggle-btn");
  const addModal = document.getElementById("menu-add-alert-modal");
  const addForm = document.getElementById("menu-add-form");
  const addCancelBtn = document.getElementById("menu-add-cancel-btn");
  const addSubmitBtn = document.getElementById("add-item-submit-btn");
  const addNameEl = document.getElementById("add-item-name");
  const addCategoryEl = document.getElementById("add-item-category");
  const addPriceEl = document.getElementById("add-item-price");
  const addDescriptionEl = document.getElementById("add-item-description");
  const addNutritionEl = document.getElementById("add-item-nutrition");
  const addImageEl = document.getElementById("add-item-image");
  const addHalalEl = document.getElementById("add-item-halal");

  const menuMessageEl = document.getElementById("menu-manage-message");
  const menuListEl = document.getElementById("menu-manage-list");

  const CATEGORY_ORDER = ["Food", "Drink", "Snack", "Kakanin"];
  const CATEGORY_LABEL = {
    Food: "Food",
    Drink: "Drinks",
    Snack: "Snack",
    Kakanin: "Kakanin",
  };

  const state = {
    pollHandle: null,
  };

  function setMessage(target, message, isError = false) {
    target.textContent = message;
    target.classList.toggle("error", isError);
    target.classList.toggle("success", !isError && message.length > 0);
  }

  function statusBadge(status) {
    const safeStatus = window.CanteenAPI.escapeHtml(status);
    return `<span class="status ${status.toLowerCase()}">${safeStatus}</span>`;
  }

  function getNextStatus(currentStatus) {
    if (currentStatus === "Pending") {
      return "Preparing";
    }

    if (currentStatus === "Preparing") {
      return "Completed";
    }

    return null;
  }

  function actionLabel(nextStatus) {
    if (nextStatus === "Preparing") {
      return "Set to Preparing";
    }

    if (nextStatus === "Completed") {
      return "Set to Completed";
    }

    return "Update Status";
  }

  function showAddForm() {
    addModal.classList.remove("hidden");
    addModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    addNameEl.focus();
  }

  function hideAddForm() {
    addForm.reset();
    addHalalEl.checked = true;
    addModal.classList.add("hidden");
    addModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function buildOrderCard(order, includeStatusControls) {
    const orderCode = `ORD-${order.id}`;
    const itemMarkup = (order.items || [])
      .map((item) => {
        return `
          <li>
            ${window.CanteenAPI.escapeHtml(item.item_name)} x ${item.quantity} -
            <span>${window.CanteenAPI.money(item.line_total)}</span>
          </li>
        `;
      })
      .join("");

    const nextStatus = getNextStatus(String(order.status));
    const controlsMarkup = includeStatusControls && nextStatus
      ? `
          <div class="status-row">
            <button type="button" data-progress-order="${order.id}" data-next-status="${nextStatus}">${actionLabel(nextStatus)}</button>
          </div>
        `
      : '<p class="muted-text">This order is completed and archived in history.</p>';

    return `
      <article class="order-card staff-order-card">
        <div class="order-head">
          <div>
            <h3>${orderCode}</h3>
            <p class="muted-text">Student: ${window.CanteenAPI.escapeHtml(order.student_name)}</p>
          </div>
          ${statusBadge(order.status)}
        </div>

        <ul class="order-items">${itemMarkup}</ul>
        <p class="order-total">Total: ${window.CanteenAPI.money(order.total_price)}</p>

        ${controlsMarkup}
      </article>
    `;
  }

  function renderOrders(orders) {
    const allOrders = orders || [];
    const activeOrders = allOrders.filter((order) => String(order.status).toLowerCase() !== "completed");
    const completedOrders = allOrders.filter((order) => String(order.status).toLowerCase() === "completed");

    if (activeOrders.length === 0) {
      activeOrdersEl.innerHTML = '<p class="muted-text">No active student orders.</p>';
    } else {
      activeOrdersEl.innerHTML = activeOrders.map((order) => buildOrderCard(order, true)).join("");
    }

    if (completedOrders.length === 0) {
      historyOrdersEl.innerHTML = '<p class="muted-text">No completed orders yet.</p>';
    } else {
      historyOrdersEl.innerHTML = completedOrders.map((order) => buildOrderCard(order, false)).join("");
    }
  }

  function groupedMenuItems(items) {
    const grouped = new Map(CATEGORY_ORDER.map((category) => [category, []]));

    (items || []).forEach((item) => {
      if (!grouped.has(item.category)) {
        grouped.set(item.category, []);
      }
      grouped.get(item.category).push(item);
    });

    return grouped;
  }

  function renderMenuManagement(items) {
    if (!items || items.length === 0) {
      menuListEl.innerHTML = '<p class="muted-text">No menu items available.</p>';
      return;
    }

    const grouped = groupedMenuItems(items);
    const sections = [];

    grouped.forEach((menuItems, category) => {
      if (!menuItems || menuItems.length === 0) {
        return;
      }

      const cards = menuItems
        .map((item) => {
          const safeName = window.CanteenAPI.escapeHtml(item.name);
          const safeCategory = window.CanteenAPI.escapeHtml(item.category);
          const safeDescription = window.CanteenAPI.escapeHtml(item.description || "No description.");
          const safeNutrition = window.CanteenAPI.escapeHtml(item.nutritional_values || "No nutritional values provided.");
          const safeImagePath = window.CanteenAPI.escapeHtml(item.image_path);
          const halalLabel = item.is_halal ? "Halal" : "Not Halal";
          const halalClass = item.is_halal ? "yes" : "no";

          return `
            <article class="manage-item-card">
              <img src="${encodeURI(item.image_path)}" alt="${safeName}">
              <div class="manage-item-info">
                <h3>${safeName}</h3>
                <p class="muted-text">${safeCategory}</p>
                <p class="manage-item-price">${window.CanteenAPI.money(item.price)}</p>
                <p class="manage-item-description">${safeDescription}</p>
                <p class="manage-item-nutrition"><strong>Nutritional Values:</strong> ${safeNutrition}</p>
                <p class="manage-item-halal ${halalClass}">${halalLabel}</p>
                <p class="manage-item-path">${safeImagePath}</p>
              </div>
            </article>
          `;
        })
        .join("");

      sections.push(`
        <section class="menu-category-group">
          <h3 class="menu-category-title">${CATEGORY_LABEL[category] || window.CanteenAPI.escapeHtml(category)}</h3>
          <div class="menu-category-items">${cards}</div>
        </section>
      `);
    });

    menuListEl.innerHTML = sections.join("");
  }

  async function fetchOrders() {
    const result = await window.CanteenAPI.request("orders/staff_list.php");
    renderOrders(result.orders || []);
    pollStatusEl.textContent = `Auto-checking for new orders every 5 seconds. Last check: ${new Date().toLocaleTimeString()}`;
  }

  async function fetchMenuManagement() {
    const result = await window.CanteenAPI.request("menu/staff_list.php");
    renderMenuManagement(result.items || []);
  }

  async function createMenuItem() {
    const name = addNameEl.value.trim();
    const category = addCategoryEl.value.trim();
    const price = Number(addPriceEl.value);
    const description = addDescriptionEl.value.trim();
    const nutritionalValues = addNutritionEl.value.trim();
    const imagePath = addImageEl.value.trim();
    const isHalal = addHalalEl.checked ? 1 : 0;

    if (!name || !category || !description || !nutritionalValues || !imagePath) {
      setMessage(menuMessageEl, "Name, category, price, description, nutrition, and image path are required.", true);
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setMessage(menuMessageEl, "Price must be greater than 0.", true);
      return;
    }

    addSubmitBtn.disabled = true;
    try {
      await window.CanteenAPI.request("menu/create.php", {
        method: "POST",
        body: {
          name,
          category,
          price,
          description,
          nutritional_values: nutritionalValues,
          image_path: imagePath,
          is_halal: isHalal,
        },
      });

      hideAddForm();
      await fetchMenuManagement();
      setMessage(menuMessageEl, `${name} added successfully.`);
    } catch (error) {
      setMessage(menuMessageEl, error.message, true);
    } finally {
      addSubmitBtn.disabled = false;
    }
  }

  async function updateStatus(orderId, status) {
    if (!status) {
      setMessage(staffMessageEl, "No next status available.", true);
      return;
    }

    await window.CanteenAPI.request("orders/update_status.php", {
      method: "POST",
      body: {
        order_id: Number(orderId),
        status,
      },
    });

    setMessage(staffMessageEl, `Order #${orderId} updated to ${status}.`);
    await fetchOrders();
  }

  async function logout() {
    await window.CanteenAPI.request("auth/logout.php", { method: "POST" });
    window.location.href = "index.html";
  }

  addToggleBtn.addEventListener("click", showAddForm);

  addCancelBtn.addEventListener("click", () => {
    hideAddForm();
    setMessage(menuMessageEl, "Add item canceled.");
  });

  addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createMenuItem().catch((error) => setMessage(menuMessageEl, error.message, true));
  });

  if (addModal) {
    addModal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-add-modal]")) {
        hideAddForm();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && addModal && !addModal.classList.contains("hidden")) {
      hideAddForm();
    }
  });

  activeOrdersEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-progress-order]");
    if (!button) {
      return;
    }

    const orderId = Number(button.getAttribute("data-progress-order"));
    const nextStatus = String(button.getAttribute("data-next-status") || "");
    updateStatus(orderId, nextStatus).catch((error) => setMessage(staffMessageEl, error.message, true));
  });

  logoutBtn.addEventListener("click", () => {
    logout().catch((error) => setMessage(staffMessageEl, error.message, true));
  });

  (async () => {
    try {
      const me = await window.CanteenAPI.request("auth/me.php");
      if (!me.authenticated || !me.user) {
        window.location.href = "index.html";
        return;
      }

      if (me.user.role !== "staff") {
        window.location.href = window.CanteenAPI.rolePage(me.user.role);
        return;
      }

      userEl.textContent = `Welcome, ${me.user.full_name} (${me.user.role})`;

      addHalalEl.checked = true;
      await fetchMenuManagement();
      await fetchOrders();
      pollStatusEl.textContent = "Auto-checking for new orders every 5 seconds.";

      state.pollHandle = window.setInterval(() => {
        fetchOrders().catch((error) => setMessage(staffMessageEl, error.message, true));
      }, 5000);
    } catch (error) {
      setMessage(staffMessageEl, error.message, true);
    }
  })();

  window.addEventListener("beforeunload", () => {
    if (state.pollHandle !== null) {
      window.clearInterval(state.pollHandle);
    }
  });
});
