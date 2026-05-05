let currentStudentDetailId = null;
let currentStudentDetailPage = 1;
let currentStudentDetailSection = "session";
const STUDENT_DETAIL_SESSION_PAGE_SIZE = 10;

function getStudentChangeLogs(record, type) {
  const logs = Array.isArray(record?.changeLogs) ? record.changeLogs : [];
  return type ? logs.filter((item) => item.changeType === type) : logs;
}

function getStudentLifecycleLogs(record, status) {
  const logs = Array.isArray(record?.lifecycleLogs) ? record.lifecycleLogs : [];
  return status ? logs.filter((item) => item.status === status) : logs;
}

function getStudentRenewalLogs(record) {
  return Array.isArray(record?.renewalLogs) ? record.renewalLogs : [];
}

function getStudentPaymentLogs(record) {
  if (!record) return [];

  const enrollmentPayment = {
    type: "\u62A5\u540D",
    packageName: record.enrollmentPackageName || record.packageName || "-",
    amount: Number(record.enrollmentPaidAmount ?? getPackagePrice(record.enrollmentPackageName || record.packageName || "")),
    giftHours: Number(record.giftHoursTotal || 0),
    date: record.enrollmentPaidDate || record.enrollDate || "-"
  };

  const renewalPayments = getStudentRenewalLogs(record).map((log) => ({
    type: "\u7EED\u8D39",
    packageName: log.packageName || "-",
    amount: Number(log.receivedAmount || 0),
    giftHours: Number(log.giftHours || 0),
    date: log.date || "-"
  }));

  return [enrollmentPayment, ...renewalPayments].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function getStudentAllSessions(record) {
  if (!record) return [];
  const totalHours = getEnrollmentTotalHours(record);
  const chronologicalRecords = sessionRecords
    .filter((session) => {
      const students = Array.isArray(session.students) ? session.students : [];
      return students.some((item) => Number(item.enrollmentId) === Number(record.id));
    })
    .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));

  let consumedHours = 0;
  const mapped = chronologicalRecords.map((session) => {
    const students = Array.isArray(session.students) ? session.students : [];
    const matched = students.find((item) => Number(item.enrollmentId) === Number(record.id));
    const deductedHours = Number(matched?.deductedHours || 0);
    consumedHours += deductedHours;
    return {
      date: session.date || "",
      teacherName: session.teacherName || "",
      className: session.className || "",
      courseName: record.courseName || "",
      deductedHours,
      remainingHours: Math.max(0, totalHours - consumedHours)
    };
  });

  return mapped.reverse();
}

function formatCurrency(amount) {
  const num = Number(amount);
  if (!Number.isFinite(num)) return "-";
  const fixed = num.toFixed(2).replace(/\.00$/, "");
  return `\uFFE5${fixed}`;
}

function getStudentStatusMeta(record) {
  if (record?.studentStatus === "paused") {
    return { label: "\u505C\u8BFE\u4E2D", className: "status-warning" };
  }
  if (record?.studentStatus === "refunded") {
    return { label: "\u5DF2\u9000\u8D39", className: "status-warning" };
  }
  return { label: "\u5728\u8BFB", className: "status-normal" };
}

function renderStudentStatusFilters() {
  refs.studentStatusFilters.innerHTML = `
    <button class="secondary-btn ${studentStatusFilter === "all" ? "active" : ""}" type="button" data-student-filter="all">\u5168\u90E8\u5B66\u5458</button>
    <button class="secondary-btn ${studentStatusFilter === "active" ? "active" : ""}" type="button" data-student-filter="active">\u5728\u8BFB\u5B66\u5458</button>
    <button class="secondary-btn ${studentStatusFilter === "paused" ? "active" : ""}" type="button" data-student-filter="paused">\u505C\u8BFE\u5B66\u5458</button>
    <button class="secondary-btn ${studentStatusFilter === "refunded" ? "active" : ""}" type="button" data-student-filter="refunded">\u9000\u8D39\u5B66\u5458</button>
  `;
}

function ensureStudentDetailView() {
  const panel = document.getElementById("panel-student");
  if (!panel) return null;

  let detailView = document.getElementById("studentDetailView");
  if (!detailView) {
    detailView = document.createElement("section");
    detailView.id = "studentDetailView";
    detailView.className = "student-detail-view hidden";
    detailView.innerHTML = `
      <article class="panel-card wide-card student-detail-page">
        <div class="detail-page-head">
          <div>
            <p class="card-tag" id="studentDetailTag">\u5B66\u5458\u6863\u6848</p>
            <h3 id="studentDetailTitle">\u5B66\u5458\u8BE6\u60C5</h3>
            <p class="form-helper" id="studentDetailSubtitle"></p>
          </div>
          <button class="secondary-btn" type="button" id="studentDetailBackBtn">\u8FD4\u56DE\u5B66\u5458\u5217\u8868</button>
        </div>
        <div id="studentDetailBody"></div>
      </article>
    `;
      panel.appendChild(detailView);
      detailView.querySelector("#studentDetailBackBtn")?.addEventListener("click", () => closeStudentDetail());
      detailView.addEventListener("click", (event) => {
        const sectionBtn = event.target.closest("[data-student-detail-section]");
        if (sectionBtn) {
          changeStudentDetailSection(sectionBtn.dataset.studentDetailSection);
          return;
        }
        const pageBtn = event.target.closest("[data-student-session-page]");
        if (!pageBtn) return;
        changeStudentDetailPage(Number(pageBtn.dataset.studentSessionPage));
      });
    }

  return detailView;
}

function getStudentDetailLogList(logs, emptyText, renderer) {
  if (!logs || logs.length === 0) {
    return `<div class="detail-log-empty">${emptyText}</div>`;
  }

  return `
    <div class="change-log-list">
      ${logs.map(renderer).join("")}
    </div>
  `;
}

function getStudentSessionHistoryTable(record) {
  const logs = getStudentAllSessions(record);
  if (logs.length === 0) {
    return `<div class="detail-log-empty">\u6682\u65E0\u4E0A\u8BFE\u8BB0\u5F55</div>`;
  }

  const totalPages = Math.max(1, Math.ceil(logs.length / STUDENT_DETAIL_SESSION_PAGE_SIZE));
  const safePage = Math.min(Math.max(currentStudentDetailPage, 1), totalPages);
  currentStudentDetailPage = safePage;
  const start = (safePage - 1) * STUDENT_DETAIL_SESSION_PAGE_SIZE;
  const pagedLogs = logs.slice(start, start + STUDENT_DETAIL_SESSION_PAGE_SIZE);

  return `
    <div class="detail-history-table-wrap">
      <table class="detail-history-table">
        <thead>
          <tr>
            <th>\u5E8F\u53F7</th>
            <th>\u5B66\u5458\u59D3\u540D</th>
            <th>\u8BFE\u7A0B/\u73ED\u7EA7</th>
            <th>\u4E0A\u8BFE\u8001\u5E08</th>
            <th>\u8BFE\u65F6\u6D88\u8017</th>
            <th>\u5269\u4F59\u8BFE\u65F6</th>
            <th>\u4E0A\u8BFE\u65F6\u95F4</th>
          </tr>
        </thead>
        <tbody>
          ${pagedLogs.map((log, index) => `
            <tr>
              <td>${start + index + 1}</td>
              <td>${record.studentName || "-"}</td>
              <td>${log.courseName || "-"} / ${log.className || "-"}</td>
              <td>${log.teacherName || "-"}</td>
              <td>${Number(log.deductedHours || 0)}</td>
              <td>${Number(log.remainingHours || 0)}</td>
              <td>${log.date || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    <div class="detail-table-pagination">
      <button class="secondary-btn" type="button" data-student-session-page="${safePage - 1}" ${safePage <= 1 ? "disabled" : ""}>\u4E0A\u4E00\u9875</button>
      <span class="pagination-info">\u7B2C ${safePage} / ${totalPages} \u9875</span>
      <button class="secondary-btn" type="button" data-student-session-page="${safePage + 1}" ${safePage >= totalPages ? "disabled" : ""}>\u4E0B\u4E00\u9875</button>
    </div>
  `;
}

function getStudentBasicInfoTable(record) {
  const rows = [
    ["\u62A5\u540D\u65E5\u671F", record.enrollDate || "-"],
    ["\u5B66\u5458\u59D3\u540D", record.studentName || "-"],
    ["\u5BB6\u957F\u59D3\u540D", record.parentName || "-"],
    ["\u8054\u7CFB\u7535\u8BDD", record.parentPhone || "-"],
    ["\u5B66\u5458\u5E74\u9F84", record.studentAge || "-"],
    ["\u51FA\u751F\u65E5\u671F", record.birthMonth || "-"],
    ["\u6821\u533A", record.campus || "\u603B\u90E8\u6821\u533A"],
    ["\u62A5\u540D\u8BFE\u7A0B", record.courseName || "-"],
    ["\u62A5\u540D\u73ED\u7EA7", record.className || "-"],
    ["\u6388\u8BFE\u8001\u5E08", record.teacherName || "-"],
    ["\u8BFE\u65F6\u5305", record.packageName || "-"],
    ["\u8D60\u9001\u8BFE\u65F6", Number(record.giftHoursTotal || 0)]
  ];

  const tableRows = [];
  for (let index = 0; index < rows.length; index += 2) {
    const left = rows[index];
    const right = rows[index + 1];
    tableRows.push({ left, right });
  }

  return `
    <div class="detail-basic-table-wrap">
      <table class="detail-basic-table">
        <tbody>
          ${tableRows.map(({ left, right }) => `
            <tr>
              <th>${left[0]}</th>
              <td>${left[1]}</td>
              ${right ? `
                <th>${right[0]}</th>
                <td>${right[1]}</td>
              ` : `
                <th></th>
                <td></td>
              `}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function getStudentPaymentTable(record) {
  const logs = getStudentPaymentLogs(record);
  if (logs.length === 0) {
    return `<div class="detail-log-empty">\u6682\u65E0\u7F34\u8D39\u8BB0\u5F55</div>`;
  }

  return `
    <div class="detail-history-table-wrap">
      <table class="detail-history-table">
        <thead>
          <tr>
            <th>\u5E8F\u53F7</th>
            <th>\u529E\u7406\u7C7B\u578B</th>
            <th>\u7F34\u8D39\u7C7B\u578B</th>
            <th>\u8D60\u9001\u8BFE\u65F6</th>
            <th>\u91D1\u989D</th>
            <th>\u529E\u7406\u65E5\u671F</th>
          </tr>
        </thead>
        <tbody>
          ${logs.map((log, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${log.type || "-"}</td>
              <td>${log.packageName || "-"}</td>
              <td>\u8D60\u9001\u8BFE\u65F6+${Number(log.giftHours || 0)}</td>
              <td>${formatCurrency(log.amount)}</td>
              <td>${log.date || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function getStudentDetailTabs() {
  const tabs = [
    { key: "session", label: "\u8BFE\u65F6\u8BB0\u5F55" },
    { key: "payment", label: "\u7F34\u8D39\u8BB0\u5F55" },
    { key: "basic", label: "\u57FA\u7840\u4FE1\u606F" }
  ];

  return `
    <div class="detail-tab-bar">
      ${tabs.map((tab) => `
        <button
          class="secondary-btn ${currentStudentDetailSection === tab.key ? "active" : ""}"
          type="button"
          data-student-detail-section="${tab.key}"
        >${tab.label}</button>
      `).join("")}
    </div>
  `;
}

function buildStudentDetailSection(record) {
  const remarkRow = record.remark
    ? `<div class="detail-remark-row"><strong>\u5907\u6CE8\u4E8B\u9879\uFF1A</strong>${record.remark}</div>`
    : "";

  if (currentStudentDetailSection === "session") {
    return `
      <section class="detail-section detail-block detail-block-single">
        <h4 class="detail-section-title">\u8BFE\u65F6\u8BB0\u5F55</h4>
        <p class="form-helper">\u4EE5\u4E0B\u4E3A\u8BE5\u5B66\u5458\u6240\u6709\u4E0A\u8BFE\u8BB0\u5F55\uFF0C\u53EF\u76F4\u63A5\u622A\u56FE\u4F5C\u4E3A\u8BFE\u65F6\u660E\u7EC6\u3002</p>
        <div class="detail-record-count">\u5171 ${getStudentAllSessions(record).length} \u6B21\u4E0A\u8BFE</div>
        ${getStudentSessionHistoryTable(record)}
      </section>
    `;
  }

  if (currentStudentDetailSection === "payment") {
    return `
      <section class="detail-section detail-block detail-block-single">
        <h4 class="detail-section-title">\u7F34\u8D39\u8BB0\u5F55</h4>
        <p class="form-helper">\u8FD9\u91CC\u4F1A\u663E\u793A\u8BE5\u5B66\u5458\u7684\u62A5\u540D\u4E0E\u7EED\u8D39\u8BB0\u5F55\u3002</p>
        ${getStudentPaymentTable(record)}
      </section>
    `;
  }

  return `
    <section class="detail-section detail-block detail-block-single">
      <h4 class="detail-section-title">\u57FA\u7840\u4FE1\u606F</h4>
      ${getStudentBasicInfoTable(record)}
      ${remarkRow}
    </section>
  `;
}

function getStudentRenewalHtml(record) {
  return getStudentDetailLogList(
    getStudentRenewalLogs(record),
    "\u6682\u65E0\u7EED\u8D39\u8BB0\u5F55",
    (log) => `
      <div class="change-log-item">
        <strong>${log.date || "-"}</strong><br>
        <span>\u8BFE\u65F6\u5305\uFF1A${log.packageName || "-"}</span><br>
        <span>\u7EED\u8D39\u8BFE\u65F6\uFF1A${Number(log.packageHours || 0)}</span><br>
        <span>\u8D60\u9001\u8BFE\u65F6\uFF1A${Number(log.giftHours || 0)}</span><br>
        <span>\u5B9E\u6536\u91D1\u989D\uFF1A${formatCurrency(log.receivedAmount)}</span>
        ${log.note ? `<br><span>\u5907\u6CE8\uFF1A${log.note}</span>` : ""}
      </div>
    `
  );
}

function getStudentChangeLogHtml(record, type) {
  const titleMap = {
    transfer: "\u6682\u65E0\u8F6C\u73ED\u8BB0\u5F55",
    teacher_change: "\u6682\u65E0\u6362\u8001\u5E08\u8BB0\u5F55"
  };

  return getStudentDetailLogList(
    getStudentChangeLogs(record, type),
    titleMap[type] || "\u6682\u65E0\u53D8\u66F4\u8BB0\u5F55",
    (log) => `
      <div class="change-log-item">
        <strong>${log.effectiveDate || log.date || "-"}</strong><br>
        ${type === "transfer" ? `<span>\u73ED\u7EA7\uFF1A${log.fromClass || "-"} \u2192 ${log.toClass || "-"}</span><br>` : ""}
        ${type === "teacher_change" ? `<span>\u6559\u5E08\uFF1A${log.fromTeacher || "-"} \u2192 ${log.toTeacher || "-"}</span><br>` : ""}
        <span>\u5907\u6CE8\uFF1A${log.note || "-"}</span>
      </div>
    `
  );
}

function getStudentLifecycleHtml(record, status) {
  const emptyMap = {
    paused: "\u6682\u65E0\u505C\u8BFE\u8BB0\u5F55",
    refunded: "\u6682\u65E0\u9000\u8D39\u8BB0\u5F55"
  };

  return getStudentDetailLogList(
    getStudentLifecycleLogs(record, status),
    emptyMap[status] || "\u6682\u65E0\u72B6\u6001\u8BB0\u5F55",
    (log) => `
      <div class="change-log-item">
        <strong>${log.date || "-"}</strong><br>
        ${status === "refunded" ? `<span>\u9000\u8D39\u91D1\u989D\uFF1A${formatCurrency(log.amount)}</span><br>` : ""}
        ${status === "refunded" ? `<span>\u9000\u8D39\u524D\u5269\u4F59\u8BFE\u65F6\uFF1A${Number(log.remainingBeforeRefund || 0)}</span><br>` : ""}
        <span>\u5907\u6CE8\uFF1A${log.note || "-"}</span>
      </div>
    `
  );
}

function renderStudentDetailPage() {
  const detailView = ensureStudentDetailView();
  if (!detailView || currentStudentDetailId === null) return;

  const record = enrollmentRecords.find((item) => Number(item.id) === Number(currentStudentDetailId));
  if (!record) {
    closeStudentDetail();
    return;
  }

  const title = detailView.querySelector("#studentDetailTitle");
  const subtitle = detailView.querySelector("#studentDetailSubtitle");
  const body = detailView.querySelector("#studentDetailBody");
  const statusMeta = getStudentStatusMeta(record);
  const totalHours = getEnrollmentTotalHours(record);
  const usedHours = getEnrollmentUsedHours(record);
  const remainingHours = getEnrollmentRemainingHours(record);

  if (title) {
    title.textContent = `${record.studentName || "\u5B66\u5458"} \u8BE6\u60C5`;
  }

  if (subtitle) {
    subtitle.textContent = `${record.courseName || "-"} / ${record.className || "-"} / ${record.teacherName || "-"}`;
  }

  if (!body) return;
  body.className = "student-detail-body";

  body.innerHTML = `
    <div class="detail-summary-grid">
      <div class="detail-stat-card">
        <span>\u603B\u8BFE\u65F6</span>
        <strong>${totalHours}</strong>
      </div>
      <div class="detail-stat-card">
        <span>\u5DF2\u4E0A\u8BFE\u65F6</span>
        <strong>${usedHours}</strong>
      </div>
      <div class="detail-stat-card">
        <span>\u5269\u4F59\u8BFE\u65F6</span>
        <strong>${remainingHours}</strong>
      </div>
      <div class="detail-stat-card">
        <span>\u5F53\u524D\u72B6\u6001</span>
        <strong><span class="status-pill ${statusMeta.className}">${statusMeta.label}</span></strong>
      </div>
    </div>
    ${getStudentDetailTabs()}
    ${buildStudentDetailSection(record)}
  `;
}

function openStudentDetail(recordId) {
  currentStudentDetailId = Number(recordId);
  currentStudentDetailPage = 1;
  currentStudentDetailSection = "session";
  const detailView = ensureStudentDetailView();
  const contentGrid = document.querySelector("#panel-student .content-grid");
  if (!detailView || !contentGrid) return;

  contentGrid.classList.add("hidden");
  detailView.classList.remove("hidden");
  refs.topSearchBox.classList.add("hidden");
  refs.pageTag.textContent = "\u6559\u5B66\u7BA1\u7406";
  refs.pageTitle.textContent = "\u5B66\u5458\u8BE6\u60C5";
  renderStudentDetailPage();
}

function closeStudentDetail(skipHeaderReset = false) {
  currentStudentDetailId = null;
  currentStudentDetailPage = 1;
  currentStudentDetailSection = "session";
  const detailView = document.getElementById("studentDetailView");
  const contentGrid = document.querySelector("#panel-student .content-grid");

  contentGrid?.classList.remove("hidden");
  detailView?.classList.add("hidden");

  if (!skipHeaderReset) {
    updateHeader();
  }
}

function changeStudentDetailPage(nextPage) {
  if (!currentStudentDetailId) return;
  currentStudentDetailPage = nextPage;
  renderStudentDetailPage();
}

function changeStudentDetailSection(section) {
  if (!currentStudentDetailId) return;
  currentStudentDetailSection = section || "session";
  currentStudentDetailPage = 1;
  renderStudentDetailPage();
}

function renderStudents(keyword = "") {
  const normalized = keyword.trim();
  const filtered = enrollmentRecords.filter((record) => {
    if (studentStatusFilter === "active" && !isStudentActive(record)) return false;
    if (studentStatusFilter === "paused" && record.studentStatus !== "paused") return false;
    if (studentStatusFilter === "refunded" && record.studentStatus !== "refunded") return false;
    if (!normalized) return true;
    return [
      record.studentName,
      record.parentPhone,
      record.courseName,
      record.className,
      record.teacherName
    ].some((item) => String(item || "").includes(normalized));
  });

  const activeStudents = enrollmentRecords.filter((record) => isStudentActive(record));
  const activeClasses = Array.from(new Set(activeStudents.map((record) => record.className).filter(Boolean)));
  const birthdayCount = enrollmentRecords.filter((record) => isStudentActive(record) && getUpcomingBirthdayInfo(record.birthMonth) !== null).length;

  refs.studentTotalCount.textContent = String(activeStudents.length);
  refs.studentClassCount.textContent = String(activeClasses.length);
  refs.studentBirthdayCount.textContent = String(birthdayCount);
  refs.resultCount.textContent = `${filtered.length} \u4F4D\u5B66\u5458`;
  renderStudentStatusFilters();

  if (filtered.length === 0) {
    refs.studentTableBody.innerHTML = `<tr><td colspan="9">\u5F53\u524D\u6CA1\u6709\u5339\u914D\u7684\u5B66\u5458\u6863\u6848</td></tr>`;
    if (currentStudentDetailId !== null) {
      renderStudentDetailPage();
    }
    return;
  }

  refs.studentTableBody.innerHTML = filtered.map((record) => {
    const totalHours = getEnrollmentTotalHours(record);
    const remaining = getEnrollmentRemainingHours(record);
    const statusMeta = getStudentStatusMeta(record);

    return `
      <tr>
        <td>${record.studentName}</td>
        <td>${record.parentPhone || "-"}</td>
        <td>${record.courseName || "-"}</td>
        <td>${record.className || "-"}</td>
        <td>${record.teacherName || "-"}</td>
        <td>${totalHours}</td>
        <td>${remaining}</td>
        <td><span class="status-pill ${statusMeta.className}">${statusMeta.label}</span></td>
        <td>
          <button class="table-detail-btn" type="button" data-detail-student-id="${record.id}">\u8BE6\u60C5</button>
          <button class="table-shift-btn" type="button" data-transfer-student-id="${record.id}">\u8F6C\u73ED</button>
          <button class="table-edit-btn" type="button" data-change-teacher-student-id="${record.id}">\u6362\u8001\u5E08</button>
          ${record.studentStatus === "paused"
            ? `<button class="table-pause-btn" type="button" data-resume-student-id="${record.id}">\u505C\u8BFE\u6062\u590D</button>`
            : record.studentStatus === "active"
              ? `<button class="table-pause-btn" type="button" data-pause-student-id="${record.id}">\u505C\u8BFE</button>`
              : ""}
          ${record.studentStatus !== "refunded" ? `<button class="table-refund-btn" type="button" data-refund-student-id="${record.id}">\u9000\u8D39</button>` : ""}
        </td>
      </tr>
    `;
  }).join("");

  if (currentStudentDetailId !== null) {
    renderStudentDetailPage();
  }
}

function openStudentAdjustModal(recordId, mode) {
  const record = enrollmentRecords.find((item) => Number(item.id) === Number(recordId));
  if (!record) return;

  adjustingStudentId = recordId;
  studentAdjustMode = mode;
  refs.adjustStudentName.textContent = `${record.studentName} / ${record.className} / ${record.teacherName}`;
  refs.adjustEffectiveDate.value = getTodayString();
  refs.adjustNoteInput.value = "";

  populateCourseOptions(record.courseName);
  populateClassOptions(record.className);
  populateTeacherOptions(record.teacherName);

  refs.adjustCourseField.classList.add("hidden");
  refs.adjustClassField.classList.toggle("hidden", mode === "teacher");
  refs.adjustTeacherField.classList.toggle("hidden", mode === "class");
  refs.studentAdjustTitle.textContent = mode === "class" ? "\u5B66\u5458\u8F6C\u73ED" : "\u5B66\u5458\u6362\u8001\u5E08";
  openModal(refs.studentAdjustModal);
}

function saveStudentAdjust() {
  const target = enrollmentRecords.find((item) => Number(item.id) === Number(adjustingStudentId));
  if (!target) return;

  const effectiveDate = refs.adjustEffectiveDate.value;
  const nextClass = studentAdjustMode === "class" ? refs.adjustClassSelect.value : target.className;
  const nextTeacher = studentAdjustMode === "teacher" ? refs.adjustTeacherSelect.value : target.teacherName;
  const note = refs.adjustNoteInput.value.trim();

  if (!effectiveDate || !nextClass || !nextTeacher) {
    showToast("\u8BF7\u5B8C\u6574\u586B\u5199\u8C03\u6574\u4FE1\u606F\u3002");
    return;
  }

  if (nextClass === target.className && nextTeacher === target.teacherName && !note) {
    showToast("\u5F53\u524D\u6CA1\u6709\u68C0\u6D4B\u5230\u8C03\u6574\u53D8\u5316\u3002");
    return;
  }

  const changeType = studentAdjustMode === "teacher" ? "teacher_change" : "transfer";
  const actionLabel = changeType === "teacher_change" ? "\u6362\u8001\u5E08" : "\u8F6C\u73ED";

  const changeLog = {
    effectiveDate,
    changeType,
    fromClass: target.className,
    toClass: nextClass,
    fromTeacher: target.teacherName,
    toTeacher: nextTeacher,
    note
  };

  enrollmentRecords = enrollmentRecords.map((record) => {
    if (Number(record.id) !== Number(adjustingStudentId)) return record;
    return {
      ...record,
      className: nextClass,
      teacherName: nextTeacher,
      changeLogs: [...(Array.isArray(record.changeLogs) ? record.changeLogs : []), changeLog],
      remark: note
        ? [record.remark, `${effectiveDate}${actionLabel}\uFF1A${note}`].filter(Boolean).join("\uFF1B")
        : record.remark
    };
  });

  closeModal(refs.studentAdjustModal);
  renderStudents(refs.studentSearch.value || "");
  renderEnrollmentRecords();
  renderClasses(refs.classSearch?.value || "");
  renderRenewalList();
  renderSessionWorkspace();
  renderTodayRecords();
  showToast(changeType === "teacher_change" ? "\u5B66\u5458\u6362\u8001\u5E08\u5DF2\u4FDD\u5B58\u3002" : "\u5B66\u5458\u8F6C\u73ED\u5DF2\u4FDD\u5B58\u3002");
}

function updateStudentLifecycle(recordId, nextStatus) {
  const target = enrollmentRecords.find((item) => Number(item.id) === Number(recordId));
  if (!target) return;

  if (target.studentStatus === nextStatus) {
    showToast(nextStatus === "paused" ? "\u8BE5\u5B66\u5458\u5F53\u524D\u5DF2\u7ECF\u662F\u505C\u8BFE\u72B6\u6001\u3002" : "\u5F53\u524D\u72B6\u6001\u672A\u53D1\u751F\u53D8\u5316\u3002");
    return;
  }

  const actionMap = {
    active: "\u505C\u8BFE\u6062\u590D",
    paused: "\u505C\u8BFE",
    refunded: "\u9000\u8D39"
  };
  const actionLabel = actionMap[nextStatus] || "\u72B6\u6001\u8C03\u6574";

  if (!window.confirm(`\u786E\u8BA4\u5BF9 ${target.studentName} \u6267\u884C${actionLabel}\u5417\uFF1F\u5386\u53F2\u4E0A\u8BFE\u8BB0\u5F55\u4F1A\u4FDD\u7559\u3002`)) {
    return;
  }

  let refundAmount = 0;
  const remainingBeforeRefund = getEnrollmentRemainingHours(target);
  if (nextStatus === "refunded") {
    const input = window.prompt("\u8BF7\u8F93\u5165\u672C\u6B21\u9000\u8D39\u91D1\u989D", "");
    if (input === null) return;
    refundAmount = Number(input);
    if (!Number.isFinite(refundAmount) || refundAmount < 0) {
      showToast("\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u9000\u8D39\u91D1\u989D\u3002");
      return;
    }
  }

  const note = window.prompt(`\u53EF\u9009\uFF1A\u586B\u5199${actionLabel}\u5907\u6CE8`, "") || "";

  enrollmentRecords = enrollmentRecords.map((record) => {
    if (Number(record.id) !== Number(recordId)) return record;
    return {
      ...record,
      studentStatus: nextStatus,
      lifecycleLogs: [
        ...(Array.isArray(record.lifecycleLogs) ? record.lifecycleLogs : []),
        {
          date: getTodayString(),
          status: nextStatus,
          note,
          amount: nextStatus === "refunded" ? refundAmount : undefined,
          remainingBeforeRefund: nextStatus === "refunded" ? remainingBeforeRefund : undefined
        }
      ],
      remark: note ? [record.remark, `${getTodayString()}${actionLabel}\uFF1A${note}`].filter(Boolean).join("\uFF1B") : record.remark
    };
  });

  if (nextStatus === "refunded") {
    transactions.unshift({
      id: uid(),
      date: getTodayString(),
      studentName: target.studentName,
      type: "\u9000\u8D39",
      amount: -Math.abs(refundAmount),
      note: note || `\u5B66\u5458\u9000\u8D39\uFF0C\u5269\u4F59\u8BFE\u65F6 ${remainingBeforeRefund}`,
      campus: "\u603B\u90E8\u6821\u533A",
        campus: target.campus || "\u603B\u90E8\u6821\u533A",
        course: target.courseName || "",
      category: "\u5B66\u8D39",
      itemName: "",
      sourceType: "refund",
      sourceId: recordId
    });
  }

  renderStudents(refs.studentSearch.value || "");
  renderEnrollmentRecords();
  renderBirthdayRecords();
  renderRenewalList();
  renderTransactions();
  renderSessionWorkspace();

  if (nextStatus === "paused") {
    showToast("\u5B66\u5458\u5DF2\u505C\u8BFE\uFF0C\u8BFE\u65F6\u5DF2\u51BB\u7ED3\uFF0C\u6682\u65F6\u4E0D\u80FD\u8BB0\u5F55\u4E0A\u8BFE\u3002");
  } else if (nextStatus === "active") {
    showToast("\u5B66\u5458\u5DF2\u6062\u590D\u4E0A\u8BFE\uFF0C\u53EF\u4EE5\u7EE7\u7EED\u6B63\u5E38\u8BB0\u5F55\u8BFE\u65F6\u3002");
  } else {
    showToast("\u5B66\u5458\u5DF2\u9000\u8D39\uFF0C\u5269\u4F59\u8BFE\u65F6\u5DF2\u6E05\u96F6\uFF0C\u6D41\u6C34\u5DF2\u540C\u6B65\u3002");
  }
}
