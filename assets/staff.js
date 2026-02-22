document.addEventListener("DOMContentLoaded", () => {
  const userEl = document.getElementById("staff-user");
  const logoutBtn = document.getElementById("staff-logout-btn");
  const messageEl = document.getElementById("staff-message");
  const ordersEl = document.getElementById("staff-orders");
  const pollStatusEl = document.getElementById("staff-poll-status");
  const menuManageMessage = document.getElementById("menu-manage-message");
  const menuManageList = document.getElementById("menu-manage-list");

  let pollHandle = null;

  function setMessage(message, isError = false) {
    messageEl.textContent = message;
    messageEl.classList.toggle("error", isError);
    messageEl.classList.toggle("success", !isError && message.length > 0);
  }

  function statusBadge(status) {
    const safeStatus = window.CanteenAPI.escapeHtml(status);
    return `<span class="status ${status.toLowerCase()}">${safeStatus}</span>`;
  }

  function setManageMessage(message, isError = false) {
    menuManageMessage.textContent = message;
    menuManageMessage.classList.toggle("error", isError);
    menuManageMessage.classList.toggle("success", !isError && message.length > 0);
  }

  function renderOrders(orders) {
    if (!orders || orders.length === 0) {
      ordersEl.innerHTML = '<p class="muted-text">No student orders yet.</p>';
      return;
    }

    ordersEl.innerHTML = orders
      .map((order) => {
        const itemMarkup = order.items
          .map((item) => {
            return `
              <li>
                ${window.CanteenAPI.escapeHtml(item.item_name)} x${item.quantity}
                <span>${window.CanteenAPI.money(item.line_total)}</span>
              </li>
            `;
          })
          .join("");

        return `
          <article class="order-card">
            <div class="order-head">
              <div>
                <h3>Order #${order.id}</h3>
                <p class="muted-text">Student: ${window.CanteenAPI.escapeHtml(order.student_name)}</p>
                <p class="muted-text">${window.CanteenAPI.escapeHtml(window.CanteenAPI.formatDateTime(order.created_at))}</p>
              </div>
              ${statusBadge(order.status)}
            </div>

            <ul class="order-items">${itemMarkup}</ul>
            <p class="order-total">Total: ${window.CanteenAPI.money(order.total_price)}</p>

            <div class="status-row">
              <select data-status-order="${order.id}">
                <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                <option value="Preparing" ${order.status === "Preparing" ? "selected" : ""}>Preparing</option>
                <option value="Completed" ${order.status === "Completed" ? "selected" : ""}>Completed</option>
              </select>
              <button type="button" data-save-order="${order.id}">Update Status</button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  async function fetchOrders() {
    const result = await window.CanteenAPI.request("orders/staff_list.php");
    renderOrders(result.orders || []);
    pollStatusEl.textContent = `Last updated: ${new Date().toLocaleTimeString()} (auto every 5s)`;
  }

  function renderMenuManagement(items) {
    if (!items || items.length === 0) {
      menuManageList.innerHTML = '<p class="muted-text">No menu items available.</p>';
      return;
    }

    menuManageList.innerHTML = items
      .map((item) => {
        const safeName = window.CanteenAPI.escapeHtml(item.name);
        const safeCategory = window.CanteenAPI.escapeHtml(item.category);
        const safeImage = encodeURI(item.image_path);

        return `
          <article class="manage-card">
            <img src="${safeImage}" alt="${safeName}">
            <div class="manage-body">
              <h3>${safeName}</h3>
              <p class="muted-text">${safeCategory}</p>

              <label for="manage-price-${item.id}">Price</label>
              <input id="manage-price-${item.id}" type="number" min="1" step="0.01" value="${item.price}" data-manage-price="${item.id}">

              <label for="manage-available-${item.id}">Availability</label>
              <select id="manage-available-${item.id}" data-manage-available="${item.id}">
                <option value="1" ${item.is_available ? "selected" : ""}>Available</option>
                <option value="0" ${!item.is_available ? "selected" : ""}>Unavailable</option>
              </select>

              <button type="button" data-manage-save="${item.id}">Save Item</button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  async function fetchMenuManagement() {
    const result = await window.CanteenAPI.request("menu/staff_list.php");
    renderMenuManagement(result.items || []);
  }

  async function saveMenuItem(menuItemId) {
    const priceEl = menuManageList.querySelector(`[data-manage-price="${menuItemId}"]`);
    const availabilityEl = menuManageList.querySelector(`[data-manage-available="${menuItemId}"]`);

    const price = Number(priceEl ? priceEl.value : "");
    const isAvailable = Number(availabilityEl ? availabilityEl.value : "");

    if (!Number.isFinite(price) || price <= 0) {
      setManageMessage("Price must be greater than 0.", true);
      return;
    }

    if (![0, 1].includes(isAvailable)) {
      setManageMessage("Availability is invalid.", true);
      return;
    }

    await window.CanteenAPI.request("menu/update.php", {
      method: "POST",
      body: {
        menu_item_id: Number(menuItemId),
        price: price,
        is_available: isAvailable,
      },
    });

    setManageMessage("Menu item updated.");
    await fetchMenuManagement();
  }

  async function updateStatus(orderId) {
    const selector = ordersEl.querySelector(`[data-status-order="${orderId}"]`);
    const status = selector ? selector.value : "";

    if (!status) {
      setMessage("Select a status first.", true);
      return;
    }

    await window.CanteenAPI.request("orders/update_status.php", {
      method: "POST",
      body: {
        order_id: Number(orderId),
        status,
      },
    });

    setMessage(`Order #${orderId} updated to ${status}.`);
    await fetchOrders();
  }

  async function logout() {
    await window.CanteenAPI.request("auth/logout.php", { method: "POST" });
    window.location.href = "index.html";
  }

  ordersEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-save-order]");
    if (!button) {
      return;
    }

    const orderId = Number(button.getAttribute("data-save-order"));
    updateStatus(orderId).catch((error) => setMessage(error.message, true));
  });

  logoutBtn.addEventListener("click", () => {
    logout().catch((error) => setMessage(error.message, true));
  });

  menuManageList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-manage-save]");
    if (!button) {
      return;
    }

    const menuItemId = Number(button.getAttribute("data-manage-save"));
    saveMenuItem(menuItemId).catch((error) => setManageMessage(error.message, true));
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

      userEl.textContent = `${me.user.full_name} (${me.user.role})`;

      await fetchOrders();
      await fetchMenuManagement();
      pollHandle = window.setInterval(() => {
        fetchOrders().catch((error) => setMessage(error.message, true));
      }, 5000);
    } catch (error) {
      setMessage(error.message, true);
    }
  })();

  window.addEventListener("beforeunload", () => {
    if (pollHandle !== null) {
      window.clearInterval(pollHandle);
    }
  });
});
