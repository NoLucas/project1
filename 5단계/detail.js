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

function getOrderById(orderId) {
  return getOrders().find((order) => order.id === orderId) || null;
}

function getStatusClass(status) {
  if (status === "완료") return "status-done";
  if (status === "준비중") return "status-preparing";
  return "status-received";
}

// ===== 상태 =====
let currentOrder = null;

// ===== 초기화 =====
function init() {
  seedOrdersIfEmpty();

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");
  currentOrder = orderId ? getOrderById(orderId) : null;

  renderOrderDetail();
  updateCartBadge();
}

// ===== 주문 상세 렌더링 =====
function renderOrderDetail() {
  const detailEl = document.getElementById("orderDetail");

  if (!currentOrder) {
    detailEl.innerHTML = `<p class="not-found">주문을 찾을 수 없습니다.</p>`;
    return;
  }

  const itemRows = currentOrder.items
    .map((item) => {
      const menu = getMenuById(item.menuId);
      const name = menu ? menu.name : "알 수 없는 메뉴";
      const subtotal = menu ? menu.price * item.quantity : 0;
      return `
        <div class="order-item-row">
          <div>
            <div class="order-item-name">${name}</div>
            <div class="order-item-qty">${item.quantity}개</div>
          </div>
          <span class="order-item-subtotal">${formatPrice(subtotal)}</span>
        </div>
      `;
    })
    .join("");

  const totalPrice = currentOrder.items.reduce((total, item) => {
    const menu = getMenuById(item.menuId);
    return menu ? total + menu.price * item.quantity : total;
  }, 0);

  detailEl.innerHTML = `
    <div class="order-detail-top">
      <span class="order-detail-id">${currentOrder.id}</span>
      <span class="order-status ${getStatusClass(currentOrder.status)}">${currentOrder.status}</span>
    </div>
    <p class="order-detail-date">${formatDate(currentOrder.createdAt)}</p>

    <div class="order-item-list glass">
      ${itemRows}
    </div>

    <div class="order-total-row glass">
      <span class="order-total-label">총 결제 금액</span>
      <span class="order-total-value">${formatPrice(totalPrice)}</span>
    </div>
  `;
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
