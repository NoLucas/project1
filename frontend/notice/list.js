const NOTICE_DATA_URL = "../admin/data/notice.json";

let openNoticeId = null;

// ===== 초기화 =====
async function init() {
  updateCartBadge();

  try {
    const response = await fetch(NOTICE_DATA_URL);
    if (!response.ok) throw new Error("공지사항을 불러오지 못했습니다.");
    const data = await response.json();
    renderNoticeList(data.notices || []);
  } catch {
    document.getElementById("noticeList").innerHTML =
      `<p class="empty-state">공지사항을 불러오지 못했습니다.</p>`;
  }
}

// ===== 공지사항 목록 =====
function renderNoticeList(notices) {
  const listEl = document.getElementById("noticeList");

  if (notices.length === 0) {
    listEl.innerHTML = `<p class="empty-state">등록된 공지사항이 없습니다.</p>`;
    return;
  }

  listEl.innerHTML = notices
    .map(
      (notice) => `
        <article class="notice-item glass${notice.id === openNoticeId ? " open" : ""}" data-id="${notice.id}">
          <button class="notice-item-header" type="button" data-toggle="${notice.id}">
            <div class="notice-item-title-group">
              <p class="notice-item-title">
                <span class="title-text">${notice.title}</span>
                ${notice.isNew ? `<span class="new-badge">NEW</span>` : ""}
              </p>
              <p class="notice-item-date">${notice.date}</p>
            </div>
            <span class="notice-item-arrow">›</span>
          </button>
          <div class="notice-item-content" ${notice.id === openNoticeId ? "" : "hidden"}>${notice.content}</div>
        </article>
      `
    )
    .join("");

  listEl.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.toggle;
      openNoticeId = openNoticeId === id ? null : id;
      renderNoticeList(notices);
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
