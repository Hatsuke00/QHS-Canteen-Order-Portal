document.addEventListener("DOMContentLoaded", () => {
  const userEl = document.getElementById("student-user");
  const logoutBtn = document.getElementById("student-logout-btn");
  const menuGrid = document.getElementById("menu-grid");
  const menuSearch = document.getElementById("menu-search");
  const menuMessage = document.getElementById("menu-message");
  const cartMessage = document.getElementById("cart-message");
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const studentOrders = document.getElementById("student-orders");
  const refreshOrdersBtn = document.getElementById("refresh-orders-btn");

  const state = {
    user: null,
    menuItems: [],
    filteredItems: [],
    cart: new Map(),
  };

  function setMessage(target, message, isError = false) {
    target.textContent = message;
    target.classList.toggle("error", isError);
    target.classList.toggle("success", !isError && message.length > 0);
  }

  function getCartQuantity(itemId) {
    return state.cart.has(itemId) ? state.cart.get(itemId).quantity : 0;
  }

  function setCartItem(item, quantity) {
    const safeQuantity = Math.max(0, Math.floor(quantity));

    if (safeQuantity <= 0) {
      state.cart.delete(item.id);
      return;
    }

    state.cart.set(item.id, {
      item,
      quantity: Math.min(safeQuantity, 99),
    });
  }

  function renderMenu() {
    if (state.filteredItems.length === 0) {
      menuGrid.innerHTML = '<p class="muted-text">No menu items found.</p>';
      return;
    }

    menuGrid.innerHTML = state.filteredItems
      .map((item) => {
        const safeName = window.CanteenAPI.escapeHtml(item.name);
        const safeCategory = window.CanteenAPI.escapeHtml(item.category);
        const imagePath = encodeURI(item.image_path);
        const defaultQty = Math.max(getCartQuantity(item.id), 1);

        return `
          <article class="menu-card">
            <img src="${imagePath}" alt="${safeName}">
            <div class="menu-card-body">
              <p class="chip">${safeCategory}</p>
              <h3>${safeName}</h3>
              <p class="item-price">${window.CanteenAPI.money(item.price)}</p>
              <div class="inline-control">
                <input type="number" min="1" max="20" value="${defaultQty}" data-qty-input="${item.id}">
                <button type="button" data-add-item="${item.id}">Add</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderCart() {
    const entries = Array.from(state.cart.values());

    if (entries.length === 0) {
      cartList.innerHTML = '<p class="muted-text">Your cart is empty.</p>';
      cartTotal.textContent = window.CanteenAPI.money(0);
      checkoutBtn.disabled = true;
      return;
    }

    let total = 0;
    cartList.innerHTML = entries
      .map((entry) => {
        const lineTotal = entry.item.price * entry.quantity;
        total += lineTotal;

        return `
          <div class="cart-item">
            <div>
              <p class="cart-name">${window.CanteenAPI.escapeHtml(entry.item.name)}</p>
              <p class="muted-text">${window.CanteenAPI.money(entry.item.price)} each</p>
            </div>
            <div class="cart-actions">
              <button type="button" class="mini-btn" data-cart-adjust="${entry.item.id}" data-cart-delta="-1">-</button>
              <span>${entry.quantity}</span>
              <button type="button" class="mini-btn" data-cart-adjust="${entry.item.id}" data-cart-delta="1">+</button>
              <button type="button" class="mini-btn danger" data-cart-remove="${entry.item.id}">x</button>
            </div>
            <p class="cart-line">${window.CanteenAPI.money(lineTotal)}</p>
          </div>
        `;
      })
      .join("");

    cartTotal.textContent = window.CanteenAPI.money(total);
    checkoutBtn.disabled = false;
  }

  function applySearch() {
    const query = menuSearch.value.trim().toLowerCase();
    state.filteredItems = state.menuItems.filter((item) => {
      const haystack = `${item.name} ${item.category}`.toLowerCase();
      return haystack.includes(query);
    });
    renderMenu();
  }

  async function loadMenu() {
    const result = await window.CanteenAPI.request("menu/list.php");
    state.menuItems = result.items || [];
    state.filteredItems = state.menuItems.slice();
    renderMenu();
  }

  function statusBadge(status) {
    const safeStatus = window.CanteenAPI.escapeHtml(status);
    const className = `status ${status.toLowerCase()}`;
    return `<span class="${className}">${safeStatus}</span>`;
  }

  async function loadOrders() {
    const result = await window.CanteenAPI.request("orders/student_list.php");
    const orders = result.orders || [];

    if (orders.length === 0) {
      studentOrders.innerHTML = '<p class="muted-text">No orders yet.</p>';
      return;
    }

    studentOrders.innerHTML = orders
      .map((order) => {
        const items = order.items
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
                <p class="muted-text">${window.CanteenAPI.escapeHtml(window.CanteenAPI.formatDateTime(order.created_at))}</p>
              </div>
              ${statusBadge(order.status)}
            </div>
            <ul class="order-items">${items}</ul>
            <p class="order-total">Total: ${window.CanteenAPI.money(order.total_price)}</p>
          </article>
        `;
      })
      .join("");
  }

  async function checkout() {
    const items = Array.from(state.cart.values()).map((entry) => ({
      menu_item_id: entry.item.id,
      quantity: entry.quantity,
    }));

    if (items.length === 0) {
      setMessage(cartMessage, "Cart is empty.", true);
      return;
    }

    checkoutBtn.disabled = true;
    try {
      const result = await window.CanteenAPI.request("orders/create.php", {
        method: "POST",
        body: { items },
      });

      state.cart.clear();
      renderCart();
      setMessage(cartMessage, `Order #${result.order.id} placed. Status: Pending.`);
      await loadOrders();
    } catch (error) {
      setMessage(cartMessage, error.message, true);
    } finally {
      checkoutBtn.disabled = false;
    }
  }

  async function logout() {
    await window.CanteenAPI.request("auth/logout.php", { method: "POST" });
    window.location.href = "index.html";
  }

  menuGrid.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-item]");
    if (addButton) {
      const itemId = Number(addButton.getAttribute("data-add-item"));
      const qtyInput = menuGrid.querySelector(`[data-qty-input="${itemId}"]`);
      const quantity = Math.floor(Number(qtyInput ? qtyInput.value : "1"));
      const item = state.menuItems.find((entry) => entry.id === itemId);

      if (!item || !Number.isFinite(quantity) || quantity <= 0) {
        setMessage(menuMessage, "Invalid item quantity.", true);
        return;
      }

      setCartItem(item, getCartQuantity(itemId) + Math.min(quantity, 20));
      renderCart();
      setMessage(menuMessage, `${item.name} added to cart.`);
    }
  });

  cartList.addEventListener("click", (event) => {
    const adjustButton = event.target.closest("[data-cart-adjust]");
    if (adjustButton) {
      const itemId = Number(adjustButton.getAttribute("data-cart-adjust"));
      const delta = Number(adjustButton.getAttribute("data-cart-delta"));
      const record = state.cart.get(itemId);
      if (!record) {
        return;
      }

      setCartItem(record.item, record.quantity + delta);
      renderCart();
      return;
    }

    const removeButton = event.target.closest("[data-cart-remove]");
    if (removeButton) {
      const itemId = Number(removeButton.getAttribute("data-cart-remove"));
      state.cart.delete(itemId);
      renderCart();
    }
  });

  menuSearch.addEventListener("input", applySearch);
  checkoutBtn.addEventListener("click", checkout);
  logoutBtn.addEventListener("click", () => {
    logout().catch((error) => setMessage(cartMessage, error.message, true));
  });
  refreshOrdersBtn.addEventListener("click", () => {
    loadOrders().catch((error) => setMessage(cartMessage, error.message, true));
  });

  (async () => {
    try {
      const me = await window.CanteenAPI.request("auth/me.php");
      if (!me.authenticated || !me.user) {
        window.location.href = "index.html";
        return;
      }

      if (me.user.role !== "student") {
        window.location.href = window.CanteenAPI.rolePage(me.user.role);
        return;
      }

      state.user = me.user;
      userEl.textContent = `${me.user.full_name} (${me.user.role})`;

      await loadMenu();
      renderCart();
      await loadOrders();
    } catch (error) {
      setMessage(menuMessage, error.message, true);
    }
  })();
});
