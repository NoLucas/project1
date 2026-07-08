// ===== 장바구니 요약 =====
function renderCartSummary() {
  const totalCount = getCartTotalCount();
  const totalPrice = getCartTotalPrice(getMenuById);

  document.getElementById("cartCount").textContent = `${totalCount}개`;
  document.getElementById("cartPrice").textContent = formatPrice(totalPrice);
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

function init() {
  renderCartSummary();
  updateCartBadge();
}

init();
