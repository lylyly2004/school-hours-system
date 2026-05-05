const TRANSACTION_PAGE_SIZE = 10;
let currentTransactionPage = 1;

function getCampusChoices() {
  return campusOptions.filter((item) => item !== "\u5168\u90E8\u6821\u533A");
}

function getTransactionTypeOptions() {
  return [
    "\u5168\u90E8\u7C7B\u578B",
    "\u62A5\u540D",
    "\u7EED\u8D39",
    "\u9000\u8D39",
    "\u6559\u6750\u96F6\u552E"
  ];
}

function syncCampusOptionViews(preferredCampus = "") {
  const availableCampuses = getCampusChoices();
  const enrollmentCampus = preferredCampus || refs.campusSelect?.value || availableCampuses[0] || "";
  const retailCampus = refs.retailCampusInput?.value || availableCampuses[0] || "";
  const transactionCampus = refs.transactionCampusFilter?.value || "\u5168\u90E8\u6821\u533A";

  if (typeof populateCampusOptions === "function") {
    populateCampusOptions(enrollmentCampus);
  }

  if (refs.retailCampusInput) {
    refs.retailCampusInput.innerHTML = availableCampuses
      .map((item) => `<option value="${item}" ${item === retailCampus ? "selected" : ""}>${item}</option>`)
      .join("");
  }

  if (refs.transactionCampusFilter) {
    const transactionOptions = ["\u5168\u90E8\u6821\u533A", ...availableCampuses];
    refs.transactionCampusFilter.innerHTML = transactionOptions
      .map((item) => `<option value="${item}" ${item === transactionCampus ? "selected" : ""}>${item}</option>`)
      .join("");
  }
}

function getCampusUsageSummary(campusName) {
  const studentCount = enrollmentRecords.filter((record) => (record.campus || "\u603B\u90E8\u6821\u533A") === campusName).length;
  const retailCount = retailRecords.filter((record) => (record.campus || "\u603B\u90E8\u6821\u533A") === campusName).length;
  const transactionCount = transactions.filter((record) => (record.campus || "\u603B\u90E8\u6821\u533A") === campusName).length;
  return { studentCount, retailCount, transactionCount };
}

function canDeleteCampus(campusName) {
  const usage = getCampusUsageSummary(campusName);
  return usage.studentCount === 0 && usage.retailCount === 0 && usage.transactionCount === 0;
}

function getCampusDeleteBlockReason(campusName) {
  return canDeleteCampus(campusName) ? "" : "\u8BE5\u6821\u533A\u5DF2\u6709\u5B66\u5458\u6216\u6D41\u6C34\u8BB0\u5F55";
}

function closeCampusModal() {
  document.getElementById("campusModal")?.classList.add("hidden");
}

function openCampusModal() {
  ensureCampusManagerUi();
  renderCampusList();
  document.getElementById("campusModal")?.classList.remove("hidden");
}

function renderCampusList() {
  const campusList = document.getElementById("campusList");
  if (!campusList) return;

  const items = getCampusChoices();
  if (items.length === 0) {
    campusList.innerHTML = `
      <div class="teacher-empty-state">
        <h4>\u5F53\u524D\u8FD8\u6CA1\u6709\u6821\u533A</h4>
        <p>\u8BF7\u5148\u65B0\u589E\u6821\u533A\u540E\u518D\u4F7F\u7528\u3002</p>
      </div>
    `;
    return;
  }

  campusList.innerHTML = items.map((campusName) => {
    const usage = getCampusUsageSummary(campusName);
    const canDelete = canDeleteCampus(campusName);
    const usageText = canDelete
      ? "\u5F53\u524D\u53EF\u5220\u9664"
      : `\u5B66\u5458 ${usage.studentCount} \u4EBA / \u6D41\u6C34 ${usage.transactionCount + usage.retailCount} \u6761`;

    return `
      <article class="renewal-item">
        <div>
          <h4>${campusName}</h4>
          <p class="renewal-meta">${usageText}</p>
        </div>
        <div class="renewal-card-actions">
          <button
            class="table-refund-btn ${canDelete ? "" : "disabled-btn"}"
            type="button"
            data-delete-campus-name="${campusName}"
            data-delete-campus-allowed="${canDelete ? "true" : "false"}"
            data-delete-campus-reason="${getCampusDeleteBlockReason(campusName)}"
          >\u5220\u9664</button>
        </div>
      </article>
    `;
  }).join("");
}

function saveCampus() {
  const input = document.getElementById("campusNameInput");
  const nextName = String(input?.value || "").trim();
  if (!nextName) {
    showToast("\u8BF7\u5148\u586B\u5199\u6821\u533A\u540D\u79F0");
    return;
  }
  if (campusOptions.includes(nextName)) {
    showToast("\u8BE5\u6821\u533A\u5DF2\u5B58\u5728");
    return;
  }

  campusOptions.push(nextName);
  syncCampusOptionViews(nextName);
  renderCampusList();
  if (input) input.value = "";
  showToast("\u6821\u533A\u5DF2\u65B0\u589E");
}

function deleteCampus(campusName) {
  if (!canDeleteCampus(campusName)) {
    showToast(getCampusDeleteBlockReason(campusName));
    return;
  }
  if (!window.confirm(`\u786E\u8BA4\u5220\u9664\u6821\u533A\u201C${campusName}\u201D\u5417\uFF1F`)) {
    return;
  }

  const index = campusOptions.indexOf(campusName);
  if (index >= 0) {
    campusOptions.splice(index, 1);
  }

  syncCampusOptionViews(getCampusChoices()[0] || "");
  renderCampusList();
  renderTransactions();
  showToast("\u6821\u533A\u5DF2\u5220\u9664");
}

function ensureCampusManagerUi() {
  const panel = document.getElementById("panel-transaction");
  if (!panel) return;

  const sectionHead = panel.querySelector(".section-head");
  if (sectionHead && !document.getElementById("manageCampusBtn")) {
    const actions = document.createElement("div");
    actions.className = "inline-actions";
    actions.innerHTML = `<button class="secondary-btn" type="button" id="manageCampusBtn">\u6821\u533A\u7BA1\u7406</button>`;
    sectionHead.appendChild(actions);
    actions.querySelector("#manageCampusBtn")?.addEventListener("click", openCampusModal);
  }

  if (!document.getElementById("campusModal")) {
    const modal = document.createElement("div");
    modal.className = "modal hidden";
    modal.id = "campusModal";
    modal.innerHTML = `
      <div class="modal-mask" id="campusModalMask"></div>
      <div class="modal-card">
        <div class="modal-head">
          <div>
            <h3>\u6821\u533A\u7BA1\u7406</h3>
          </div>
          <button class="close-btn" type="button" id="closeCampusModalBtn">\u5173\u95ED</button>
        </div>
        <div class="form-grid">
          <div class="form-field">
            <label>\u65B0\u589E\u6821\u533A</label>
            <input type="text" id="campusNameInput" autocomplete="off">
          </div>
        </div>
        <div class="enrollment-actions top-space">
          <button class="primary-btn" type="button" id="saveCampusBtn">\u4FDD\u5B58\u6821\u533A</button>
          <button class="secondary-btn" type="button" id="cancelCampusBtn">\u53D6\u6D88</button>
        </div>
        <div class="section-head top-space">
          <div>
            <h3>\u5DF2\u6709\u6821\u533A</h3>
          </div>
        </div>
        <div class="modal-list" id="campusList"></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#closeCampusModalBtn")?.addEventListener("click", closeCampusModal);
    modal.querySelector("#cancelCampusBtn")?.addEventListener("click", closeCampusModal);
    modal.querySelector("#campusModalMask")?.addEventListener("click", closeCampusModal);
    modal.querySelector("#saveCampusBtn")?.addEventListener("click", saveCampus);
    modal.querySelector("#campusList")?.addEventListener("click", (event) => {
      const deleteBtn = event.target.closest("[data-delete-campus-name]");
      if (!deleteBtn) return;
      if (deleteBtn.dataset.deleteCampusAllowed !== "true") {
        showToast(deleteBtn.dataset.deleteCampusReason || "\u5F53\u524D\u6821\u533A\u4E0D\u6EE1\u8DB3\u5220\u9664\u6761\u4EF6");
        return;
      }
      deleteCampus(deleteBtn.dataset.deleteCampusName);
    });
  }
}

function syncTransactionTypeOptions(selectedType = "") {
  if (!refs.transactionTypeFilter) return;
  const currentValue = selectedType || refs.transactionTypeFilter.value || "\u5168\u90E8\u7C7B\u578B";
  refs.transactionTypeFilter.innerHTML = getTransactionTypeOptions()
    .map((item) => `<option value="${item}" ${item === currentValue ? "selected" : ""}>${item}</option>`)
    .join("");
}

function getFilteredTransactions() {
  return transactions
    .filter((record) => {
      const from = refs.transactionDateFrom.value;
      const to = refs.transactionDateTo.value;
      const campus = refs.transactionCampusFilter.value;
      const course = refs.transactionCourseFilter.value;
      const category = refs.transactionCategoryFilter.value;
      const type = refs.transactionTypeFilter?.value || "\u5168\u90E8\u7C7B\u578B";
      const studentKeyword = refs.transactionStudentKeyword.value.trim();
      const itemKeyword = refs.transactionItemKeyword.value.trim();

      if (from && record.date < from) return false;
      if (to && record.date > to) return false;
      if (campus && campus !== "\u5168\u90E8\u6821\u533A" && record.campus !== campus) return false;
      if (course && course !== "\u5168\u90E8\u8BFE\u7A0B" && record.course !== course) return false;
      if (category && category !== "\u5168\u90E8\u5206\u7C7B" && record.category !== category) return false;
      if (type && type !== "\u5168\u90E8\u7C7B\u578B" && record.type !== type) return false;
      if (studentKeyword && !String(record.studentName || "").includes(studentKeyword)) return false;
      if (itemKeyword && !String(record.itemName || "").includes(itemKeyword)) return false;
      return true;
    })
    .slice()
    .sort((left, right) => String(right.date || "").localeCompare(String(left.date || "")));
}

function setTransactionPage(page) {
  currentTransactionPage = Math.max(1, Number(page || 1));
}

function getTransactionTypeMeta(record) {
  const type = String(record.type || "");
  if (type === "\u9000\u8D39") {
    return { label: "\u9000\u8D39", className: "status-warning" };
  }
  if (type === "\u6559\u6750\u96F6\u552E") {
    return { label: "\u6559\u6750\u96F6\u552E", className: "transaction-type-retail" };
  }
  if (type === "\u62A5\u540D") {
    return { label: "\u62A5\u540D", className: "status-normal" };
  }
  if (type === "\u7EED\u8D39") {
    return { label: "\u7EED\u8D39", className: "transaction-type-renewal" };
  }
  return { label: type || "-", className: "transaction-type-default" };
}

function getTransactionAmountHtml(record) {
  const amount = Number(record.amount || 0);
  const isExpense = amount < 0;
  const amountClass = isExpense ? "transaction-amount-expense" : "transaction-amount-income";
  const amountText = `${isExpense ? "-" : "+"}${formatMoney(Math.abs(amount))}`;
  return `<span class="${amountClass}">${amountText}</span>`;
}

function syncTransactionStaticLabels() {
  if (refs.transactionPrevPageBtn) refs.transactionPrevPageBtn.textContent = "\u4E0A\u4E00\u9875";
  if (refs.transactionNextPageBtn) refs.transactionNextPageBtn.textContent = "\u4E0B\u4E00\u9875";
  const typeLabel = refs.transactionTypeFilter?.closest(".form-field")?.querySelector("label");
  if (typeLabel) typeLabel.textContent = "\u529E\u7406\u7C7B\u578B";
  const headRow = refs.transactionTableBody?.closest("table")?.querySelector("thead tr");
  if (!headRow) return;
  let actionHead = document.getElementById("transactionActionHead");
  if (!actionHead) {
    actionHead = document.createElement("th");
    actionHead.id = "transactionActionHead";
    headRow.appendChild(actionHead);
  }
  actionHead.textContent = "\u64CD\u4F5C";
}

function getTransactionDetailHtml(record) {
  return `
    <div class="record-detail-box">
      <div><strong>\u6D41\u6C34\u65E5\u671F\uFF1A</strong>${record.date || "-"}</div>
      <div><strong>\u59D3\u540D\uFF1A</strong>${record.studentName || "-"}</div>
      <div><strong>\u529E\u7406\u7C7B\u578B\uFF1A</strong>${record.type || "-"}</div>
      <div><strong>\u91D1\u989D\uFF1A</strong>${formatMoney(record.amount)}</div>
      <div><strong>\u6821\u533A\uFF1A</strong>${record.campus || "-"}</div>
      <div><strong>\u5B66\u79D1\uFF1A</strong>${record.course || "-"}</div>
      <div><strong>\u5546\u54C1\u5206\u7C7B\uFF1A</strong>${record.category || "-"}</div>
      <div><strong>\u5546\u54C1\u540D\u79F0\uFF1A</strong>${record.itemName || "-"}</div>
      <div><strong>\u5907\u6CE8\u8BF4\u660E\uFF1A</strong>${record.note || "-"}</div>
    </div>
  `;
}

function renderTransactions() {
  ensureCampusManagerUi();
  syncTransactionTypeOptions();
  syncTransactionStaticLabels();

  const filtered = getFilteredTransactions();
  const total = filtered.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const tuition = filtered
    .filter((item) => item.category === "\u5B66\u8D39")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const retail = filtered
    .filter((item) => item.type === "\u6559\u6750\u96F6\u552E")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const other = total - tuition - retail;

  refs.transactionTotalAmount.textContent = formatMoney(total);
  refs.transactionTuitionAmount.textContent = formatMoney(tuition);
  refs.transactionRetailAmount.textContent = formatMoney(retail);
  refs.transactionOtherAmount.textContent = formatMoney(other);

  const totalPages = Math.max(1, Math.ceil(filtered.length / TRANSACTION_PAGE_SIZE));
  if (currentTransactionPage > totalPages) {
    currentTransactionPage = totalPages;
  }
  const startIndex = (currentTransactionPage - 1) * TRANSACTION_PAGE_SIZE;
  const paged = filtered.slice(startIndex, startIndex + TRANSACTION_PAGE_SIZE);

  refs.transactionPageInfo.textContent = `\u7B2C ${currentTransactionPage} / ${totalPages} \u9875`;
  refs.transactionPrevPageBtn.disabled = currentTransactionPage === 1;
  refs.transactionNextPageBtn.disabled = currentTransactionPage === totalPages;

  if (filtered.length === 0) {
    refs.transactionTableBody.innerHTML = `<tr><td colspan="10">\u5F53\u524D\u6CA1\u6709\u5339\u914D\u7684\u6D41\u6C34\u8BB0\u5F55</td></tr>`;
    return;
  }

  refs.transactionTableBody.innerHTML = paged.map((record) => `
    <tr>
      <td>${record.date || "-"}</td>
      <td>${record.studentName || "-"}</td>
      <td><span class="status-pill ${getTransactionTypeMeta(record).className}">${getTransactionTypeMeta(record).label}</span></td>
      <td>${getTransactionAmountHtml(record)}</td>
      <td>${record.campus || "-"}</td>
      <td>${record.course || "-"}</td>
      <td>${record.category || "-"}</td>
      <td>${record.itemName || "-"}</td>
      <td>${record.note || "-"}</td>
      <td><button class="table-detail-btn" type="button" data-detail-transaction-id="${record.id}">\u8BE6\u60C5</button></td>
    </tr>
    <tr class="detail-row hidden" id="transaction-detail-row-${record.id}">
      <td colspan="10">
        ${getTransactionDetailHtml(record)}
      </td>
    </tr>
  `).join("");
}

function renderTodayRecords() {
  const filtered = getFilteredTodayRecords();

  if (filtered.length === 0) {
    refs.todayTableBody.innerHTML = `<tr><td colspan="6">\u5F53\u524D\u6CA1\u6709\u5339\u914D\u7684\u529E\u7406\u8BB0\u5F55</td></tr>`;
    return;
  }

  refs.todayTableBody.innerHTML = filtered.map((record) => `
    <tr>
      <td>${record.date}</td>
      <td>${record.time}</td>
      <td>${record.item}</td>
      <td>${record.target}</td>
      <td>${record.course}</td>
      <td>${record.status}</td>
    </tr>
  `).join("");
}

function getFilteredTodayRecords() {
  const dateValue = refs.todayDateFilter.value;
  const courseValue = refs.todayCourseFilter.value;
  return todayRecords.filter((record) => {
    if (dateValue && record.date !== dateValue) return false;
    if (courseValue && courseValue !== "\u5168\u90E8\u8BFE\u7A0B" && record.course !== courseValue) return false;
    return true;
  });
}
