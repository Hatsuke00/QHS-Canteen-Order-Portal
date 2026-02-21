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

    const PAGE_LOGIN = "Login.html";
    const PAGE_STUDENT = "Student-dashboard.html";
    const PAGE_STAFF = "Staff-dashboard.html";

    const ROLE_STUDENT = "student";
    const ROLE_STAFF = "staff";

    const STATUS_PENDING = "Pending";
    const STATUS_PREPARING = "Preparing";
    const STATUS_COMPLETED = "Completed";

    const CATEGORY_META = [
        { key: "all", label: "All" },
        { key: "drinks", label: "Drinks" },
        { key: "food", label: "Food" },
        { key: "snack", label: "Snacks" },
        { key: "kakanin", label: "Kakanin" }
    ];

    const MENU_ITEMS = [
        { id: "drink-water", name: "Water", category: "drinks", price: 15, imageUrl: "pictures/Drink/Water.jpg", nutrition: "Hydrating, zero sugar", available: true },
        { id: "drink-selecta", name: "Selecta", category: "drinks", price: 20, imageUrl: "pictures/Drink/Selecta.jpg", nutrition: "Sweet dairy drink", available: true },
        { id: "drink-milo", name: "Milo", category: "drinks", price: 25, imageUrl: "pictures/Drink/Milo.jpg", nutrition: "Chocolate energy drink", available: true },
        { id: "drink-mango-shake", name: "Mango Shake", category: "drinks", price: 35, imageUrl: "pictures/Drink/Mango Shake.jpg", nutrition: "Fruit blended drink", available: true },
        { id: "drink-dragon-fruit-shake", name: "Dragon Fruit Shake", category: "drinks", price: 40, imageUrl: "pictures/Drink/Dragon Fruit Shake.jpg", nutrition: "Fruit shake, rich color", available: true },
        { id: "drink-delight", name: "Delight", category: "drinks", price: 20, imageUrl: "pictures/Drink/Delight.jpg", nutrition: "Cultured milk drink", available: true },
        { id: "drink-cucumber-shake", name: "Cucumber Shake", category: "drinks", price: 30, imageUrl: "pictures/Drink/Cucumber Shake.jpg", nutrition: "Refreshing cucumber blend", available: true },
        { id: "drink-chuckie", name: "Chuckie", category: "drinks", price: 25, imageUrl: "pictures/Drink/Chuckie.jpg", nutrition: "Chocolate milk drink", available: true },
        { id: "drink-choco-shake", name: "Choco Shake", category: "drinks", price: 35, imageUrl: "pictures/Drink/Choco Shake.jpg", nutrition: "Creamy chocolate shake", available: true },
        { id: "drink-buko-juice", name: "Buko Juice", category: "drinks", price: 30, imageUrl: "pictures/Drink/Buko Juice.jpg", nutrition: "Coconut based beverage", available: true },
        { id: "drink-bear-brand", name: "Bear Brand", category: "drinks", price: 25, imageUrl: "pictures/Drink/Bear Brand.jpg", nutrition: "Fortified milk drink", available: true },

        { id: "food-skinless-rice", name: "Skinless with Rice", category: "food", price: 45, imageUrl: "pictures/Food/Skinless with rice.jpg", nutrition: "Protein meal serving", available: true },
        { id: "food-sisig", name: "Sisig", category: "food", price: 50, imageUrl: "pictures/Food/Sisig.jpg", nutrition: "Savory sizzling dish", available: true },
        { id: "food-siopao", name: "Siopao", category: "food", price: 30, imageUrl: "pictures/Food/Siopao.jpg", nutrition: "Steamed bun snack meal", available: true },
        { id: "food-siomai", name: "Siomai", category: "food", price: 35, imageUrl: "pictures/Food/Siomai.jpg", nutrition: "Dumpling serving", available: true },
        { id: "food-pizza", name: "Pizza", category: "food", price: 40, imageUrl: "pictures/Food/Pizza.jpg", nutrition: "Cheesy baked slice", available: true },
        { id: "food-pastil-rice", name: "Pastil with Rice", category: "food", price: 40, imageUrl: "pictures/Food/Pastil with rice.jpg", nutrition: "Rice meal serving", available: true },
        { id: "food-pancit", name: "Pancit", category: "food", price: 35, imageUrl: "pictures/Food/Pancit.jpg", nutrition: "Noodle dish serving", available: true },
        { id: "food-palabok", name: "Palabok", category: "food", price: 45, imageUrl: "pictures/Food/Palabok.jpg", nutrition: "Noodle dish with sauce", available: true },
        { id: "food-maha", name: "Maha", category: "food", price: 30, imageUrl: "pictures/Food/Maha.jpg", nutrition: "Creamy dessert cup", available: true },
        { id: "food-macaroni", name: "Macaroni", category: "food", price: 35, imageUrl: "pictures/Food/Macaroni.jpg", nutrition: "Pasta salad serving", available: true },
        { id: "food-longanisa-rice", name: "Longanisa with Rice", category: "food", price: 45, imageUrl: "pictures/Food/Longanisa with rice.jpg", nutrition: "Rice meal with sausage", available: true },
        { id: "food-creamy-steak", name: "Creamy Steak", category: "food", price: 55, imageUrl: "pictures/Food/Creamy steak.jpg", nutrition: "Rich main dish", available: true },
        { id: "food-fried-chicken", name: "Fried Chicken", category: "food", price: 50, imageUrl: "pictures/Food/Fried chicken.jpg", nutrition: "Crispy chicken serving", available: true },
        { id: "food-corn-dog", name: "Corn Dog", category: "food", price: 35, imageUrl: "pictures/Food/Corn dog.jpg", nutrition: "Breaded sausage snack", available: true },
        { id: "food-egg-rice", name: "Egg with Rice", category: "food", price: 35, imageUrl: "pictures/Food/Egg with rice.jpg", nutrition: "Simple rice meal", available: true },

        { id: "snack-turon", name: "Turon", category: "snack", price: 20, imageUrl: "pictures/Snack/Turon.jpg", nutrition: "Banana caramel snack", available: true },
        { id: "snack-mamon", name: "Mamon", category: "snack", price: 18, imageUrl: "pictures/Snack/Mamon.jpg", nutrition: "Soft bread snack", available: true },
        { id: "snack-lintiao", name: "Lintiao", category: "snack", price: 15, imageUrl: "pictures/Snack/Lintiao.jpg", nutrition: "Crunchy snack serving", available: true },
        { id: "snack-kringkols", name: "Kringkols", category: "snack", price: 15, imageUrl: "pictures/Snack/Kringkols.jpg", nutrition: "Savory snack bite", available: true },
        { id: "snack-eggnog", name: "EggNog", category: "snack", price: 15, imageUrl: "pictures/Snack/EggNog.jpg", nutrition: "Sweet biscuit snack", available: true },
        { id: "snack-egg-sandwich", name: "Egg Sandwich", category: "snack", price: 25, imageUrl: "pictures/Snack/Egg sandwich.jpg", nutrition: "Sandwich serving", available: true },
        { id: "snack-egg-pie", name: "Egg Pie", category: "snack", price: 25, imageUrl: "pictures/Snack/Egg Pie.jpg", nutrition: "Custard pie slice", available: true },
        { id: "snack-bread-sticks", name: "Bread Sticks", category: "snack", price: 15, imageUrl: "pictures/Snack/Bread Sticks.jpg", nutrition: "Light baked snack", available: true },
        { id: "snack-banana-chips", name: "Banana Chips", category: "snack", price: 20, imageUrl: "pictures/Snack/Banana Chips.jpg", nutrition: "Crispy fruit snack", available: true },

        { id: "kakanin-suman", name: "Suman", category: "kakanin", price: 20, imageUrl: "pictures/Kakanin/Suman.jpg", nutrition: "Rice cake serving", available: true },
        { id: "kakanin-palitaw", name: "Palitaw", category: "kakanin", price: 20, imageUrl: "pictures/Kakanin/Palitaw.jpg", nutrition: "Rice cake with coconut", available: true },
        { id: "kakanin-sapin-sapin", name: "Sapin Sapin", category: "kakanin", price: 20, imageUrl: "pictures/Kakanin/Sapin sapin.jpg", nutrition: "Layered rice delicacy", available: true },
        { id: "kakanin-kuchinta", name: "Kuchinta", category: "kakanin", price: 15, imageUrl: "pictures/Kakanin/Kuchinta.jpg", nutrition: "Steamed rice cake", available: true },
        { id: "kakanin-biko", name: "Biko", category: "kakanin", price: 20, imageUrl: "pictures/Kakanin/Biko.jpg", nutrition: "Sweet sticky rice cake", available: true },
        { id: "kakanin-pichi-pichi", name: "Pichi Pichi", category: "kakanin", price: 20, imageUrl: "pictures/Kakanin/Pichi pichi.jpg", nutrition: "Cassava coconut delicacy", available: true }
    ];

    migrateLegacyStorage();

    const pageRole = normalizeRole(document.body && document.body.dataset ? document.body.dataset.pageRole : "");
    if (!isSupportedRole(pageRole)) {
        return;
    }

    const currentUser = protectPageRole(pageRole);
    if (!currentUser) {
        return;
    }

    setupNavigation();
    setupCommonUI(currentUser);

    if (pageRole === ROLE_STUDENT) {
        initStudentDashboard(currentUser);
    } else if (pageRole === ROLE_STAFF) {
        initStaffDashboard(currentUser);
    }

    function initStudentDashboard(user) {
        const state = {
            activeCategory: "all",
            searchTerm: "",
            cart: new Map()
        };

        const refs = {
            mealList: document.getElementById("meal-list"),
            categoryTabs: document.getElementById("menu-category-tabs"),
            searchInput: document.getElementById("menu-search-input"),
            cartCount: document.getElementById("current-orders-count"),
            cartEmpty: document.getElementById("current-orders-empty"),
            cartList: document.getElementById("current-orders-list"),
            cartTotal: document.getElementById("current-orders-total"),
            paymentMethod: document.getElementById("current-payment-method"),
            gcashPanel: document.getElementById("current-gcash-qr-panel"),
            checkoutBtn: document.getElementById("current-checkout-btn"),
            clearBtn: document.getElementById("current-clear-btn"),
            orderMessage: document.getElementById("order-message"),
            ordersEmpty: document.getElementById("orders-empty"),
            ordersList: document.getElementById("orders-list"),
            ordersCompletedEmpty: document.getElementById("orders-completed-empty"),
            ordersCompletedList: document.getElementById("orders-completed-list")
        };

        renderCategoryTabs(refs, state);
        renderMenuList(refs, state);
        renderCart(refs, state);
        renderStudentHistory(refs, user);
        bindStudentEvents(refs, state, user);
    }

    function bindStudentEvents(refs, state, user) {
        if (refs.categoryTabs) {
            refs.categoryTabs.addEventListener("click", (event) => {
                const button = event.target.closest(".menu-filter-btn");
                if (!button) {
                    return;
                }

                const category = String(button.dataset.category || "all");
                state.activeCategory = category;
                renderCategoryTabs(refs, state);
                renderMenuList(refs, state);
            });
        }

        if (refs.searchInput) {
            refs.searchInput.addEventListener("input", () => {
                state.searchTerm = String(refs.searchInput.value || "").trim().toLowerCase();
                renderMenuList(refs, state);
            });
        }

        if (refs.mealList) {
            refs.mealList.addEventListener("click", (event) => {
                const addButton = event.target.closest(".meal-add-btn");
                if (!addButton) {
                    return;
                }

                const itemId = String(addButton.dataset.itemId || "");
                const item = findMenuItem(itemId);
                if (!item || !item.available) {
                    setInlineMessage(refs.orderMessage, "Item is not available.", "error");
                    return;
                }

                addToCart(state, item);
                renderCart(refs, state);
                setInlineMessage(refs.orderMessage, `${item.name} added to cart.`, "success");
            });
        }

        if (refs.cartList) {
            refs.cartList.addEventListener("click", (event) => {
                const qtyButton = event.target.closest(".qty-btn");
                if (!qtyButton) {
                    return;
                }

                const itemId = String(qtyButton.dataset.itemId || "");
                const action = String(qtyButton.dataset.action || "");
                if (!itemId || !action) {
                    return;
                }

                if (!state.cart.has(itemId)) {
                    return;
                }

                if (action === "increase") {
                    adjustCartQuantity(state, itemId, 1);
                } else if (action === "decrease") {
                    adjustCartQuantity(state, itemId, -1);
                }

                renderCart(refs, state);
            });
        }

        if (refs.clearBtn) {
            refs.clearBtn.addEventListener("click", () => {
                state.cart.clear();
                renderCart(refs, state);
                setInlineMessage(refs.orderMessage, "Cart cleared.", "success");
            });
        }

        if (refs.checkoutBtn) {
            refs.checkoutBtn.addEventListener("click", () => {
                if (state.cart.size === 0) {
                    setInlineMessage(refs.orderMessage, "Your cart is empty.", "error");
                    return;
                }

                const order = buildOrderFromCart(state, user, refs.paymentMethod);
                const orders = getOrders();
                orders.push(order);
                saveOrders(orders);

                state.cart.clear();
                renderCart(refs, state);
                renderStudentHistory(refs, user);

                setInlineMessage(refs.orderMessage, `Order ${order.orderId} submitted.`, "success");
                setSystemMessage("Reservation checkout complete. Status: Pending.", "success");
            });
        }

        if (refs.paymentMethod) {
            refs.paymentMethod.addEventListener("change", () => {
                const useGcash = refs.paymentMethod.value === "GCash";
                if (refs.gcashPanel) {
                    refs.gcashPanel.classList.toggle("hidden", !useGcash);
                }
            });
        }
    }

    function renderCategoryTabs(refs, state) {
        if (!refs.categoryTabs) {
            return;
        }

        refs.categoryTabs.innerHTML = CATEGORY_META.map((category) => {
            const activeClass = category.key === state.activeCategory ? "active" : "";
            return `<button type="button" class="menu-filter-btn ${activeClass}" data-category="${category.key}">${escapeHtml(category.label)}</button>`;
        }).join("");
    }

    function renderMenuList(refs, state) {
        if (!refs.mealList) {
            return;
        }

        const filtered = MENU_ITEMS.filter((item) => {
            if (state.activeCategory !== "all" && item.category !== state.activeCategory) {
                return false;
            }
            if (!state.searchTerm) {
                return true;
            }

            const haystack = `${item.name} ${item.category} ${item.nutrition}`.toLowerCase();
            return haystack.includes(state.searchTerm);
        });

        if (filtered.length === 0) {
            refs.mealList.innerHTML = `<p class="muted-msg">No menu items match your search.</p>`;
            return;
        }

        const categoriesToRender = state.activeCategory === "all"
            ? CATEGORY_META.filter((category) => category.key !== "all").map((category) => category.key)
            : [state.activeCategory];

        refs.mealList.innerHTML = categoriesToRender.map((categoryKey) => {
            const items = filtered.filter((item) => item.category === categoryKey);
            if (!items.length) {
                return "";
            }

            const label = getCategoryLabel(categoryKey);
            const cards = items.map((item) => renderMealCard(item)).join("");
            return `
                <section>
                    <h3 class="meal-category-title">${escapeHtml(label)}</h3>
                    <div class="meal-grid">${cards}</div>
                </section>
            `;
        }).join("");
    }

    function renderMealCard(item) {
        const safeName = escapeHtml(item.name);
        const availabilityClass = item.available ? "availability-available" : "availability-out";
        const availabilityText = item.available ? "Available" : "Unavailable";
        const cardClass = item.available ? "meal-card" : "meal-card meal-card-out";
        const buttonClass = item.available ? "btn btn-secondary small-btn meal-add-btn" : "btn btn-secondary small-btn meal-add-btn meal-add-out-btn";
        const buttonDisabled = item.available ? "" : "disabled";
        const buttonText = item.available ? "Add to Cart" : "Unavailable";

        return `
            <article class="${cardClass}">
                <div class="meal-image-wrap">
                    <img class="meal-image" src="${escapeHtml(item.imageUrl)}" alt="${safeName}" loading="lazy">
                </div>
                <h4>${safeName}</h4>
                <div class="meal-meta-row">
                    <span class="meal-price">${formatCurrency(item.price)}</span>
                    <span class="availability-badge ${availabilityClass}">${availabilityText}</span>
                </div>
                <p class="meal-nutrition">${escapeHtml(item.nutrition)}</p>
                <div class="card-actions">
                    <button type="button" class="${buttonClass}" data-item-id="${escapeHtml(item.id)}" ${buttonDisabled}>${buttonText}</button>
                </div>
            </article>
        `;
    }

    function addToCart(state, item) {
        const existing = state.cart.get(item.id);
        if (existing) {
            existing.quantity += 1;
            return;
        }

        state.cart.set(item.id, {
            itemId: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: 1
        });
    }

    function adjustCartQuantity(state, itemId, change) {
        const row = state.cart.get(itemId);
        if (!row) {
            return;
        }

        const nextQty = row.quantity + change;
        if (nextQty <= 0) {
            state.cart.delete(itemId);
            return;
        }

        row.quantity = nextQty;
    }

    function renderCart(refs, state) {
        if (!refs.cartList || !refs.cartEmpty || !refs.cartCount || !refs.cartTotal) {
            return;
        }

        const cartRows = Array.from(state.cart.values());
        const totalItems = cartRows.reduce((sum, row) => sum + row.quantity, 0);
        const totalPrice = cartRows.reduce((sum, row) => sum + (row.price * row.quantity), 0);

        refs.cartCount.textContent = String(totalItems);
        refs.cartTotal.textContent = formatCurrency(totalPrice);

        refs.cartEmpty.classList.toggle("hidden", cartRows.length > 0);
        if (refs.checkoutBtn) {
            refs.checkoutBtn.disabled = cartRows.length === 0;
        }
        if (refs.clearBtn) {
            refs.clearBtn.disabled = cartRows.length === 0;
        }

        if (cartRows.length === 0) {
            refs.cartList.innerHTML = "";
            return;
        }

        refs.cartList.innerHTML = cartRows.map((row) => {
            const lineTotal = row.price * row.quantity;
            return `
                <div class="current-order-card">
                    <div class="current-order-top">
                        <div>
                            <p class="current-order-name">${escapeHtml(row.name)}</p>
                            <p class="current-order-sub">${formatCurrency(row.price)} each</p>
                        </div>
                        <div class="current-order-qty-controls">
                            <button type="button" class="qty-btn qty-btn-minus" data-action="decrease" data-item-id="${escapeHtml(row.itemId)}">-</button>
                            <span class="current-order-qty">${row.quantity}</span>
                            <button type="button" class="qty-btn qty-btn-plus" data-action="increase" data-item-id="${escapeHtml(row.itemId)}">+</button>
                        </div>
                        <div class="current-order-line-total">${formatCurrency(lineTotal)}</div>
                    </div>
                </div>
            `;
        }).join("");
    }

    function buildOrderFromCart(state, user, paymentMethodSelect) {
        const items = Array.from(state.cart.values()).map((row) => {
            const lineTotal = row.price * row.quantity;
            return {
                itemId: row.itemId,
                name: row.name,
                price: Number(row.price),
                quantity: Number(row.quantity),
                lineTotal: Number(lineTotal.toFixed(2))
            };
        });

        const totalPrice = items.reduce((sum, item) => sum + item.lineTotal, 0);

        return {
            orderId: buildOrderId(),
            studentId: cleanText(user.id),
            studentName: cleanText(user.fullName) || cleanText(user.email) || "Student",
            items,
            totalPrice: Number(totalPrice.toFixed(2)),
            status: STATUS_PENDING,
            paymentMethod: paymentMethodSelect ? String(paymentMethodSelect.value || "On-site") : "On-site",
            createdAt: new Date().toISOString()
        };
    }

    function renderStudentHistory(refs, user) {
        if (!refs.ordersList || !refs.ordersCompletedList || !refs.ordersEmpty || !refs.ordersCompletedEmpty) {
            return;
        }

        const myOrders = getOrders()
            .filter((order) => isOrderOwnedByUser(order, user))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const activeOrders = myOrders.filter((order) => normalizeStatus(order.status) !== STATUS_COMPLETED);
        const completedOrders = myOrders.filter((order) => normalizeStatus(order.status) === STATUS_COMPLETED);

        refs.ordersEmpty.classList.toggle("hidden", activeOrders.length > 0);
        refs.ordersCompletedEmpty.classList.toggle("hidden", completedOrders.length > 0);

        refs.ordersList.innerHTML = activeOrders.map((order) => renderOrderCard(order, false)).join("");
        refs.ordersCompletedList.innerHTML = completedOrders.map((order) => renderOrderCard(order, false)).join("");
    }

    function initStaffDashboard(user) {
        const refs = {
            searchInput: document.getElementById("staff-orders-search"),
            filterSelect: document.getElementById("staff-orders-filter"),
            ordersEmpty: document.getElementById("orders-empty"),
            ordersList: document.getElementById("orders-list"),
            ordersCompletedEmpty: document.getElementById("orders-completed-empty"),
            ordersCompletedList: document.getElementById("orders-completed-list")
        };

        const state = {
            knownOrderIds: new Set(getOrders().map((order) => cleanText(order.orderId))),
            pollTimerId: null
        };

        renderStaffOrders(refs);
        bindStaffEvents(refs, state, user);
        startStaffPolling(refs, state);
    }

    function bindStaffEvents(refs, state, user) {
        if (refs.searchInput) {
            refs.searchInput.addEventListener("input", () => {
                renderStaffOrders(refs);
            });
        }

        if (refs.filterSelect) {
            refs.filterSelect.addEventListener("change", () => {
                renderStaffOrders(refs);
            });
        }

        if (refs.ordersList) {
            refs.ordersList.addEventListener("click", (event) => {
                const button = event.target.closest(".staff-status-btn");
                if (!button) {
                    return;
                }
                handleStaffStatusUpdate(button, refs);
            });
        }

        if (refs.ordersCompletedList) {
            refs.ordersCompletedList.addEventListener("click", (event) => {
                const button = event.target.closest(".staff-status-btn");
                if (!button) {
                    return;
                }
                handleStaffStatusUpdate(button, refs);
            });
        }

        window.addEventListener("storage", (event) => {
            if (event.key !== STORAGE_KEYS.orders) {
                return;
            }
            renderStaffOrders(refs);
        });

        window.addEventListener("beforeunload", () => {
            if (state.pollTimerId) {
                window.clearInterval(state.pollTimerId);
                state.pollTimerId = null;
            }
        });

        if (normalizeRole(user.role) !== ROLE_STAFF) {
            window.location.replace(PAGE_LOGIN);
        }
    }

    function handleStaffStatusUpdate(button, refs) {
        const orderId = cleanText(button.dataset.orderId);
        const nextStatus = normalizeStatus(button.dataset.status);
        if (!orderId || !nextStatus) {
            return;
        }

        const orders = getOrders();
        const index = orders.findIndex((order) => cleanText(order.orderId) === orderId);
        if (index < 0) {
            setSystemMessage("Order not found.", "error");
            return;
        }

        orders[index].status = nextStatus;
        saveOrders(orders);
        renderStaffOrders(refs);
        setSystemMessage(`Order ${orderId} updated to ${nextStatus}.`, "success");
    }

    function startStaffPolling(refs, state) {
        state.pollTimerId = window.setInterval(() => {
            const latestOrders = getOrders();
            const newOrders = latestOrders.filter((order) => {
                const orderId = cleanText(order.orderId);
                return orderId && !state.knownOrderIds.has(orderId);
            });

            if (newOrders.length > 0) {
                const word = newOrders.length === 1 ? "order" : "orders";
                setSystemMessage(`${newOrders.length} new ${word} received.`, "success");
            }

            state.knownOrderIds = new Set(latestOrders.map((order) => cleanText(order.orderId)));
            renderStaffOrders(refs);
        }, 5000);
    }

    function renderStaffOrders(refs) {
        if (!refs.ordersList || !refs.ordersCompletedList || !refs.ordersEmpty || !refs.ordersCompletedEmpty) {
            return;
        }

        const searchTerm = refs.searchInput ? String(refs.searchInput.value || "").trim().toLowerCase() : "";
        const statusFilter = refs.filterSelect ? String(refs.filterSelect.value || "all").toLowerCase() : "all";

        const allOrders = getOrders()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const filtered = allOrders.filter((order) => {
            const normalizedStatus = normalizeStatus(order.status).toLowerCase();
            if (statusFilter !== "all" && normalizedStatus !== statusFilter) {
                return false;
            }

            if (!searchTerm) {
                return true;
            }

            const itemNames = Array.isArray(order.items)
                ? order.items.map((item) => cleanText(item.name)).join(" ")
                : "";

            const haystack = `${cleanText(order.orderId)} ${cleanText(order.studentName)} ${formatDateTime(order.createdAt)} ${itemNames}`.toLowerCase();
            return haystack.includes(searchTerm);
        });

        const activeOrders = filtered.filter((order) => normalizeStatus(order.status) !== STATUS_COMPLETED);
        const completedOrders = filtered.filter((order) => normalizeStatus(order.status) === STATUS_COMPLETED);

        refs.ordersEmpty.classList.toggle("hidden", activeOrders.length > 0);
        refs.ordersCompletedEmpty.classList.toggle("hidden", completedOrders.length > 0);

        refs.ordersList.innerHTML = activeOrders.map((order) => renderOrderCard(order, true)).join("");
        refs.ordersCompletedList.innerHTML = completedOrders.map((order) => renderOrderCard(order, true)).join("");
    }

    function renderOrderCard(order, allowStatusActions) {
        const status = normalizeStatus(order.status);
        const orderId = cleanText(order.orderId);
        const studentName = cleanText(order.studentName) || "Student";
        const itemsSummary = renderItemsSummary(order.items);
        const statusClass = status === STATUS_COMPLETED ? "status-completed" : "status-pending";

        const actions = allowStatusActions
            ? renderStatusButtons(orderId, status)
            : "";

        return `
            <article class="order-card">
                <div class="order-header">
                    <h4>${escapeHtml(orderId || "Order")}</h4>
                    <span class="status-pill ${statusClass}">${escapeHtml(status)}</span>
                </div>
                <p><strong>Student:</strong> ${escapeHtml(studentName)}</p>
                <p class="muted-msg">${escapeHtml(formatDateTime(order.createdAt))}</p>
                <p>${itemsSummary}</p>
                <p><strong>Total:</strong> ${formatCurrency(order.totalPrice)}</p>
                ${actions}
            </article>
        `;
    }

    function renderStatusButtons(orderId, currentStatus) {
        const statuses = [STATUS_PENDING, STATUS_PREPARING, STATUS_COMPLETED];
        const buttons = statuses.map((status) => {
            const disabled = currentStatus === status ? "disabled" : "";
            return `<button type="button" class="btn btn-secondary small-btn staff-status-btn" data-order-id="${escapeHtml(orderId)}" data-status="${status}" ${disabled}>${status}</button>`;
        }).join("");

        return `<div class="order-actions">${buttons}</div>`;
    }

    function renderItemsSummary(items) {
        if (!Array.isArray(items) || items.length === 0) {
            return "<strong>Items:</strong> None";
        }

        const lines = items.map((item) => {
            const name = escapeHtml(cleanText(item.name) || "Item");
            const qty = Number(item.quantity || 0);
            const lineTotal = formatCurrency(item.lineTotal != null ? item.lineTotal : (Number(item.price || 0) * qty));
            return `${name} x${qty} (${lineTotal})`;
        }).join("<br>");

        return `<strong>Items:</strong><br>${lines}`;
    }

    function setupNavigation() {
        const navButtons = Array.from(document.querySelectorAll(".nav-btn[data-section]"));
        if (!navButtons.length) {
            return;
        }

        const sections = Array.from(document.querySelectorAll(".app-section"));

        const showSection = (sectionKey) => {
            navButtons.forEach((button) => {
                const active = button.dataset.section === sectionKey;
                button.classList.toggle("active", active);
            });

            sections.forEach((section) => {
                const visible = section.id === `${sectionKey}-section`;
                section.classList.toggle("hidden", !visible);
                section.classList.toggle("active", visible);
                if (visible) {
                    section.classList.add("section-enter");
                    window.setTimeout(() => {
                        section.classList.remove("section-enter");
                    }, 420);
                }
            });
        };

        navButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const sectionKey = String(button.dataset.section || "");
                if (sectionKey) {
                    showSection(sectionKey);
                }
            });
        });

        const initiallyActive = navButtons.find((button) => button.classList.contains("active"));
        if (initiallyActive && initiallyActive.dataset.section) {
            showSection(initiallyActive.dataset.section);
        }
    }

    function setupCommonUI(user) {
        const welcomeText = document.getElementById("welcome-text");
        if (welcomeText) {
            welcomeText.textContent = `Welcome, ${cleanText(user.fullName) || "User"} (${normalizeRole(user.role)})`;
        }

        renderProfile(user);

        const logoutButton = document.getElementById("logout-btn");
        if (logoutButton) {
            logoutButton.addEventListener("click", () => {
                clearCurrentUser();
                window.location.replace(PAGE_LOGIN);
            });
        }
    }

    function renderProfile(user) {
        const profileDisplay = document.getElementById("profile-display");
        if (!profileDisplay) {
            return;
        }

        const role = normalizeRole(user.role);
        const idLabel = role === ROLE_STAFF ? "Employee ID" : "LRN";
        const classLabel = role === ROLE_STAFF ? "Department" : "Grade and Section";

        const profileRows = [
            { label: "Full Name", value: cleanText(user.fullName) || "-" },
            { label: "Role", value: role === ROLE_STAFF ? "Staff" : "Student" },
            { label: "Email", value: cleanText(user.email) || "-" },
            { label: idLabel, value: cleanText(user.idNumber) || "-" },
            { label: classLabel, value: cleanText(user.classDepartment) || "-" }
        ];

        profileDisplay.innerHTML = profileRows.map((row) => `
            <article class="profile-item">
                <span>${escapeHtml(row.label)}</span>
                <strong>${escapeHtml(row.value)}</strong>
            </article>
        `).join("");
    }

    function protectPageRole(expectedRole) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            window.location.replace(PAGE_LOGIN);
            return null;
        }

        const userRole = normalizeRole(currentUser.role);
        if (!isSupportedRole(userRole)) {
            clearCurrentUser();
            window.location.replace(PAGE_LOGIN);
            return null;
        }

        if (userRole !== expectedRole) {
            if (userRole === ROLE_STUDENT) {
                window.location.replace(PAGE_STUDENT);
            } else if (userRole === ROLE_STAFF) {
                window.location.replace(PAGE_STAFF);
            } else {
                window.location.replace(PAGE_LOGIN);
            }
            return null;
        }

        return {
            id: cleanText(currentUser.id),
            role: userRole,
            fullName: cleanText(currentUser.fullName),
            idNumber: cleanText(currentUser.idNumber),
            classDepartment: cleanText(currentUser.classDepartment),
            email: cleanText(currentUser.email)
        };
    }

    function isOrderOwnedByUser(order, user) {
        const orderStudentId = cleanText(order.studentId);
        const userId = cleanText(user.id);
        if (orderStudentId && userId) {
            return orderStudentId === userId;
        }

        return cleanText(order.studentName).toLowerCase() === cleanText(user.fullName).toLowerCase();
    }

    function findMenuItem(itemId) {
        return MENU_ITEMS.find((item) => item.id === itemId) || null;
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

    function getOrders() {
        const orders = readJson(STORAGE_KEYS.orders, []);
        return Array.isArray(orders) ? orders : [];
    }

    function saveOrders(orders) {
        writeJson(STORAGE_KEYS.orders, Array.isArray(orders) ? orders : []);
    }

    function getCurrentUser() {
        return readJson(STORAGE_KEYS.currentUser, null);
    }

    function clearCurrentUser() {
        window.localStorage.removeItem(STORAGE_KEYS.currentUser);
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

    function setSystemMessage(text, type) {
        const systemMessage = document.getElementById("system-message");
        setInlineMessage(systemMessage, text, type);
    }

    function setInlineMessage(element, text, type) {
        if (!element) {
            return;
        }

        element.textContent = String(text || "");
        element.classList.remove("success", "error");
        if (type === "success" || type === "error") {
            element.classList.add(type);
        }
    }

    function formatCurrency(value) {
        const amount = Number(value || 0);
        return `P ${amount.toFixed(2)}`;
    }

    function formatDateTime(dateValue) {
        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }
        return date.toLocaleString("en-PH", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function buildOrderId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const randomBlock = Math.floor(Math.random() * 900 + 100).toString();
        return `ORD-${timestamp}-${randomBlock}`;
    }

    function getCategoryLabel(categoryKey) {
        const match = CATEGORY_META.find((category) => category.key === categoryKey);
        return match ? match.label : categoryKey;
    }

    function normalizeStatus(statusValue) {
        const value = cleanText(statusValue).toLowerCase();
        if (value === "completed") {
            return STATUS_COMPLETED;
        }
        if (value === "preparing") {
            return STATUS_PREPARING;
        }
        return STATUS_PENDING;
    }

    function normalizeRole(roleValue) {
        const value = cleanText(roleValue).toLowerCase();
        if (value === ROLE_STUDENT) {
            return ROLE_STUDENT;
        }
        if (value === ROLE_STAFF) {
            return ROLE_STAFF;
        }
        return "";
    }

    function isSupportedRole(role) {
        return role === ROLE_STUDENT || role === ROLE_STAFF;
    }

    function cleanText(value) {
        return String(value || "").trim();
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
})();
