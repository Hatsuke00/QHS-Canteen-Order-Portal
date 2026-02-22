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
  const studentActiveOrders = document.getElementById("student-active-orders");
  const studentHistoryOrders = document.getElementById("student-history-orders");
  const refreshOrdersBtn = document.getElementById("refresh-orders-btn");

  const tabMenuBtn = document.getElementById("student-tab-menu");
  const tabOrdersBtn = document.getElementById("student-tab-orders");
  const menuView = document.getElementById("student-menu-view");
  const ordersView = document.getElementById("student-orders-view");

  const filterCategory = document.getElementById("filter-category");
  const filterHalal = document.getElementById("filter-halal");
  const filterSort = document.getElementById("filter-sort");
  const clearFiltersBtn = document.getElementById("clear-filters-btn");

  const imageModal = document.getElementById("image-modal");
  const imageModalImg = document.getElementById("image-modal-img");
  const imageModalCaption = document.getElementById("image-modal-caption");

  const itemInfoModal = document.getElementById("item-info-modal");
  const itemInfoImage = document.getElementById("item-info-image");
  const itemInfoTitle = document.getElementById("item-info-title");
  const itemInfoPrice = document.getElementById("item-info-price");
  const itemInfoHalal = document.getElementById("item-info-halal");
  const itemInfoCategory = document.getElementById("item-info-category");
  const itemInfoDescription = document.getElementById("item-info-description");
  const itemInfoNutrition = document.getElementById("item-info-nutrition");

  const CATEGORY_ORDER = ["Food", "Drink", "Snack", "Kakanin"];
  const CATEGORY_LABEL = {
    Food: "Food",
    Drink: "Drinks",
    Snack: "Snacks",
    Kakanin: "Kakanin",
  };

  const state = {
    user: null,
    menuItems: [],
    filteredItems: [],
    cart: new Map(),
    pollHandle: null,
  };

  function setMessage(target, message, isError = false) {
    target.textContent = message;
    target.classList.toggle("error", isError);
    target.classList.toggle("success", !isError && message.length > 0);
  }

  function setStudentTab(tab) {
    const showMenu = tab === "menu";

    menuView.classList.toggle("hidden", !showMenu);
    ordersView.classList.toggle("hidden", showMenu);

    tabMenuBtn.classList.toggle("active", showMenu);
    tabOrdersBtn.classList.toggle("active", !showMenu);
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

  function compareItems(a, b, sortType) {
    switch (sortType) {
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return Number(a.price) - Number(b.price);
      case "price-desc":
        return Number(b.price) - Number(a.price);
      case "name-asc":
      default:
        return a.name.localeCompare(b.name);
    }
  }

  function renderMenu() {
    if (state.filteredItems.length === 0) {
      menuGrid.innerHTML = '<p class="muted-text">No menu items found.</p>';
      return;
    }

    const grouped = groupedMenuItems(state.filteredItems);
    const sections = [];

    grouped.forEach((items, category) => {
      if (!items || items.length === 0) {
        return;
      }

      const cards = items
        .map((item) => {
          const safeName = window.CanteenAPI.escapeHtml(item.name);
          const safeCategory = window.CanteenAPI.escapeHtml(item.category);
          const imagePath = encodeURI(item.image_path);

          return `
            <article class="student-menu-card">
              <img src="${imagePath}" alt="${safeName}" class="student-menu-image">
              <div class="student-menu-body">
                <h3>${safeName}</h3>
                <p class="student-item-category">${safeCategory}</p>
                <p class="student-item-price">${window.CanteenAPI.money(item.price)}</p>
                <button type="button" class="student-add-btn" data-add-item="${item.id}">Add to Cart</button>
                <div class="student-item-extra-actions">
                  <button type="button" class="secondary-btn student-inline-btn" data-zoom-item="${item.id}">Zoom</button>
                  <button type="button" class="secondary-btn student-inline-btn" data-info-item="${item.id}">View Info</button>
                </div>
              </div>
            </article>
          `;
        })
        .join("");

      sections.push(`
        <section class="student-category-group">
          <h3 class="student-category-title">${CATEGORY_LABEL[category] || window.CanteenAPI.escapeHtml(category)}</h3>
          <div class="student-menu-grid">${cards}</div>
        </section>
      `);
    });

    menuGrid.innerHTML = sections.join("");
  }

  function renderCart() {
    const entries = Array.from(state.cart.values());

    if (entries.length === 0) {
      cartList.innerHTML = '<p class="muted-text">No items in cart.</p>';
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

  function applyFilters() {
    const query = menuSearch.value.trim().toLowerCase();
    const categoryValue = (filterCategory.value || "").trim();
    const halalValue = (filterHalal.value || "").trim();
    const sortValue = (filterSort.value || "name-asc").trim();

    const filtered = state.menuItems.filter((item) => {
      const haystack = `${item.name} ${item.category} ${item.description || ""} ${item.nutritional_values || ""}`.toLowerCase();
      const matchesQuery = haystack.includes(query);
      const matchesCategory = !categoryValue || item.category === categoryValue;
      const matchesHalal =
        !halalValue ||
        (halalValue === "halal" && Boolean(item.is_halal)) ||
        (halalValue === "non-halal" && !Boolean(item.is_halal));

      return matchesQuery && matchesCategory && matchesHalal;
    });

    filtered.sort((a, b) => compareItems(a, b, sortValue));
    state.filteredItems = filtered;
    renderMenu();
  }

  function resetFilters() {
    menuSearch.value = "";
    filterCategory.value = "";
    filterHalal.value = "";
    filterSort.value = "name-asc";
    applyFilters();
  }

  async function loadMenu() {
    const result = await window.CanteenAPI.request("menu/list.php");
    state.menuItems = result.items || [];
    state.filteredItems = state.menuItems.slice();
    applyFilters();
  }

  function statusBadge(status) {
    const safeStatus = window.CanteenAPI.escapeHtml(status);
    const className = `status ${status.toLowerCase()}`;
    return `<span class="${className}">${safeStatus}</span>`;
  }

  function buildStudentOrderCard(order) {
    const items = (order.items || [])
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
  }

  async function loadOrders() {
    const result = await window.CanteenAPI.request("orders/student_list.php");
    const orders = result.orders || [];

    const activeOrders = orders.filter((order) => String(order.status).toLowerCase() !== "completed");
    const completedOrders = orders.filter((order) => String(order.status).toLowerCase() === "completed");

    if (activeOrders.length === 0) {
      studentActiveOrders.innerHTML = '<p class="muted-text">No active orders.</p>';
    } else {
      studentActiveOrders.innerHTML = activeOrders.map((order) => buildStudentOrderCard(order)).join("");
    }

    if (completedOrders.length === 0) {
      studentHistoryOrders.innerHTML = '<p class="muted-text">No completed orders yet.</p>';
    } else {
      studentHistoryOrders.innerHTML = completedOrders.map((order) => buildStudentOrderCard(order)).join("");
    }
  }

  function openImageModal(item) {
    if (!imageModal || !imageModalImg || !imageModalCaption) {
      return;
    }

    imageModalImg.src = encodeURI(item.image_path);
    imageModalImg.alt = item.name;
    imageModalCaption.textContent = `${item.name} - ${window.CanteenAPI.money(item.price)}`;

    imageModal.classList.remove("hidden");
    imageModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeImageModal() {
    if (!imageModal || !imageModalImg || !imageModalCaption) {
      return;
    }

    imageModal.classList.add("hidden");
    imageModal.setAttribute("aria-hidden", "true");
    imageModalImg.src = "";
    imageModalImg.alt = "";
    imageModalCaption.textContent = "";
    if (!itemInfoModal || itemInfoModal.classList.contains("hidden")) {
      document.body.classList.remove("modal-open");
    }
  }

  function openItemInfoModal(item) {
    if (!itemInfoModal) {
      return;
    }

    const halalText = item.is_halal ? "Halal" : "Not Halal";

    itemInfoImage.src = encodeURI(item.image_path);
    itemInfoImage.alt = item.name;
    itemInfoTitle.textContent = item.name;
    itemInfoPrice.textContent = window.CanteenAPI.money(item.price);
    itemInfoHalal.textContent = halalText;
    itemInfoHalal.className = `item-info-halal ${item.is_halal ? "yes" : "no"}`;
    itemInfoCategory.textContent = item.category || "N/A";
    itemInfoDescription.textContent = item.description || "No description.";
    itemInfoNutrition.textContent = item.nutritional_values || "No nutritional values provided.";

    itemInfoModal.classList.remove("hidden");
    itemInfoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeItemInfoModal() {
    if (!itemInfoModal) {
      return;
    }

    itemInfoModal.classList.add("hidden");
    itemInfoModal.setAttribute("aria-hidden", "true");
    itemInfoImage.src = "";
    itemInfoImage.alt = "";
    itemInfoTitle.textContent = "";
    itemInfoPrice.textContent = "";
    itemInfoHalal.textContent = "";
    itemInfoCategory.textContent = "";
    itemInfoDescription.textContent = "";
    itemInfoNutrition.textContent = "";
    if (!imageModal || imageModal.classList.contains("hidden")) {
      document.body.classList.remove("modal-open");
    }
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
      setStudentTab("orders");
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
      const item = state.menuItems.find((entry) => entry.id === itemId);

      if (!item) {
        setMessage(menuMessage, "Item not found.", true);
        return;
      }

      setCartItem(item, getCartQuantity(itemId) + 1);
      renderCart();
      setMessage(menuMessage, `${item.name} added to cart.`);
      return;
    }

    const zoomButton = event.target.closest("[data-zoom-item]");
    if (zoomButton) {
      const itemId = Number(zoomButton.getAttribute("data-zoom-item"));
      const item = state.menuItems.find((entry) => entry.id === itemId);
      if (item) {
        openImageModal(item);
      }
      return;
    }

    const infoButton = event.target.closest("[data-info-item]");
    if (infoButton) {
      const itemId = Number(infoButton.getAttribute("data-info-item"));
      const item = state.menuItems.find((entry) => entry.id === itemId);
      if (item) {
        openItemInfoModal(item);
      }
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

  if (imageModal) {
    imageModal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-image-modal]")) {
        closeImageModal();
      }
    });
  }

  if (itemInfoModal) {
    itemInfoModal.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-item-info]")) {
        closeItemInfoModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (imageModal && !imageModal.classList.contains("hidden")) {
      closeImageModal();
    }

    if (itemInfoModal && !itemInfoModal.classList.contains("hidden")) {
      closeItemInfoModal();
    }
  });

  tabMenuBtn.addEventListener("click", () => setStudentTab("menu"));
  tabOrdersBtn.addEventListener("click", () => setStudentTab("orders"));

  menuSearch.addEventListener("input", applyFilters);
  filterCategory.addEventListener("change", applyFilters);
  filterHalal.addEventListener("change", applyFilters);
  filterSort.addEventListener("change", applyFilters);
  clearFiltersBtn.addEventListener("click", resetFilters);

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
      userEl.textContent = `Welcome, ${me.user.full_name} (${me.user.role})`;

      await loadMenu();
      renderCart();
      await loadOrders();
      setStudentTab("menu");

      state.pollHandle = window.setInterval(() => {
        loadOrders().catch((error) => setMessage(cartMessage, error.message, true));
      }, 5000);
    } catch (error) {
      setMessage(menuMessage, error.message, true);
    }
  })();

  window.addEventListener("beforeunload", () => {
    if (state.pollHandle !== null) {
      window.clearInterval(state.pollHandle);
    }
  });
});
