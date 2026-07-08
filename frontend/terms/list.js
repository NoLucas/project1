const TERMS_DATA_URL = "../admin/data/terms.json";

let documents = [];
let selectedDocId = null;

// ===== 초기화 =====
async function init() {
  updateCartBadge();

  try {
    const response = await fetch(TERMS_DATA_URL);
    if (!response.ok) throw new Error("문서를 불러오지 못했습니다.");
    const data = await response.json();
    documents = data.documents || [];
    selectedDocId = documents[0] ? documents[0].id : null;
    renderDocTabs();
    renderTermsDoc();
  } catch {
    document.getElementById("termsDoc").innerHTML =
      `<p class="empty-state">이용약관 및 정책을 불러오지 못했습니다.</p>`;
  }
}

// ===== 문서 탭 =====
function renderDocTabs() {
  const tabsEl = document.getElementById("docTabs");

  tabsEl.innerHTML = documents
    .map(
      (doc) => `
        <button
          class="category-tab${doc.id === selectedDocId ? " active" : ""}"
          data-doc-id="${doc.id}"
        >${doc.title}</button>
      `
    )
    .join("");

  tabsEl.querySelectorAll(".category-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      selectedDocId = tab.dataset.docId;
      renderDocTabs();
      renderTermsDoc();
    });
  });
}

// ===== 문서 내용 =====
function renderTermsDoc() {
  const docEl = document.getElementById("termsDoc");
  const doc = documents.find((item) => item.id === selectedDocId);

  if (!doc) {
    docEl.innerHTML = `<p class="empty-state">등록된 문서가 없습니다.</p>`;
    return;
  }

  const sectionsHtml = (doc.sections || [])
    .map(
      (section) => `
        <div class="terms-section">
          <p class="terms-section-heading">${section.heading}</p>
          <p class="terms-section-body">${section.body}</p>
        </div>
      `
    )
    .join("");

  docEl.innerHTML = `
    <h2 class="terms-doc-title">${doc.title}</h2>
    <p class="terms-doc-updated">최종 수정일 ${doc.updatedAt}</p>
    ${sectionsHtml}
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
