// ===== 주문 저장소 (localStorage 기반) =====
const ORDERS_STORAGE_KEY = "cafe-app:orders";

const ORDER_SEED = [
  {
    id: "ORD-20260701-001",
    createdAt: "2026-07-01T10:23:00",
    status: "완료",
    items: [
      { menuId: "americano", quantity: 2 },
      { menuId: "cheesecake", quantity: 1 },
    ],
  },
  {
    id: "ORD-20260703-002",
    createdAt: "2026-07-03T14:05:00",
    status: "준비중",
    items: [{ menuId: "vanilla-latte", quantity: 1 }],
  },
  {
    id: "ORD-20260705-003",
    createdAt: "2026-07-05T09:40:00",
    status: "주문접수",
    items: [
      { menuId: "lemon-ade", quantity: 2 },
      { menuId: "croissant", quantity: 2 },
    ],
  },
];

function seedOrdersIfEmpty() {
  if (localStorage.getItem(ORDERS_STORAGE_KEY) === null) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ORDER_SEED));
  }
}

function getOrders() {
  const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function getOrderTotalPrice(order) {
  return order.items.reduce((total, item) => {
    const menu = getMenuById(item.menuId);
    if (!menu) return total;
    return total + menu.price * item.quantity;
  }, 0);
}

function getOrderSummaryText(order) {
  const firstMenu = getMenuById(order.items[0].menuId);
  const firstName = firstMenu ? firstMenu.name : "알 수 없는 메뉴";
  if (order.items.length > 1) {
    return `${firstName} 외 ${order.items.length - 1}건`;
  }
  return firstName;
}

function getStatusClass(status) {
  if (status === "완료") return "status-done";
  if (status === "준비중") return "status-preparing";
  return "status-received";
}

// ===== 초기화 =====
function init() {
  seedOrdersIfEmpty();
  renderOrderList();
  updateCartBadge();
}

// ===== 주문 목록 렌더링 =====
function renderOrderList() {
  const listEl = document.getElementById("orderList");
  const orders = getOrders().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (orders.length === 0) {
    listEl.innerHTML = `<p class="empty-state">주문 내역이 없습니다.</p>`;
    return;
  }

  listEl.innerHTML = orders
    .map(
      (order) => `
        <a class="order-card glass" href="detail.html?id=${encodeURIComponent(order.id)}">
          <div class="order-card-top">
            <span class="order-card-id">${order.id}</span>
            <span class="order-status ${getStatusClass(order.status)}">${order.status}</span>
          </div>
          <span class="order-card-date">${formatDate(order.createdAt)}</span>
          <span class="order-card-summary">${getOrderSummaryText(order)}</span>
          <div class="order-card-bottom">
            <span class="order-card-total">${formatPrice(getOrderTotalPrice(order))}</span>
          </div>
        </a>
      `
    )
    .join("");
}

// ===== 장바구니 배지 =====
function updateCartBadge() {
  const badgeEl = document.getElementById("cartBadge");
  const count = getCartTotalCount();

  if (count > 0) {
    badgeEl.textContent = count > 99 ? "99+" : String(count);
    badgeEl.hidden = false;
  } else {
    badgeEl.hidden = true;
  }
}

init();
