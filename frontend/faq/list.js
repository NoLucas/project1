const FAQ_DATA_URL = "../admin/data/faq.json";

let categories = [];
let faqs = [];
let selectedCategoryId = "all";
let openFaqId = null;

// ===== 초기화 =====
async function init() {
  updateCartBadge();

  try {
    const response = await fetch(FAQ_DATA_URL);
    if (!response.ok) throw new Error("FAQ를 불러오지 못했습니다.");
    const data = await response.json();
    categories = data.categories || [];
    faqs = data.faqs || [];
    renderCategoryTabs();
    renderFaqList();
  } catch {
    document.getElementById("faqList").innerHTML =
      `<p class="empty-state">자주 묻는 질문을 불러오지 못했습니다.</p>`;
  }
}

// ===== 카테고리 탭 =====
function renderCategoryTabs() {
  const tabsEl = document.getElementById("categoryTabs");
  const allTabs = [{ id: "all", name: "전체" }, ...categories];

  tabsEl.innerHTML = allTabs
    .map(
      (category) => `
        <button
          class="category-tab${category.id === selectedCategoryId ? " active" : ""}"
          data-category-id="${category.id}"
        >${category.name}</button>
      `
    )
    .join("");

  tabsEl.querySelectorAll(".category-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      selectedCategoryId = tab.dataset.categoryId;
      renderCategoryTabs();
      renderFaqList();
    });
  });
}

// ===== FAQ 목록 =====
function renderFaqList() {
  const listEl = document.getElementById("faqList");
  const filtered =
    selectedCategoryId === "all"
      ? faqs
      : faqs.filter((faq) => faq.categoryId === selectedCategoryId);

  if (filtered.length === 0) {
    listEl.innerHTML = `<p class="empty-state">해당 카테고리에 질문이 없습니다.</p>`;
    return;
  }

  listEl.innerHTML = filtered
    .map(
      (faq) => `
        <article class="faq-item glass${faq.id === openFaqId ? " open" : ""}" data-id="${faq.id}">
          <button class="faq-item-header" type="button" data-toggle="${faq.id}">
            <p class="faq-question"><span class="qmark">Q</span>${faq.question}</p>
            <span class="faq-item-arrow">›</span>
          </button>
          <div class="faq-item-content" ${faq.id === openFaqId ? "" : "hidden"}>
            <span class="amark">A</span>
            <span>${faq.answer}</span>
          </div>
        </article>
      `
    )
    .join("");

  listEl.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.toggle;
      openFaqId = openFaqId === id ? null : id;
      renderFaqList();
    });
  });
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
