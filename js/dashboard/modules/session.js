const SESSION_PAGE_SIZE = 10;
let sessionRecordPage = 1;
let currentSessionView = "editor";
let shouldAutoSelectSessionStudents = true;

function getSessionSelectableStudents(teacherName = selectedSessionTeacherName, className = selectedSessionClassName) {
  if (!teacherName || !className) return [];
  return enrollmentRecords.filter((record) => {
    return isStudentActive(record)
      && record.teacherName === teacherName
      && record.className === className
      && getEnrollmentRemainingHours(record) > 0;
  });
}

function getTeacherSessionStudentCount(teacherName) {
  return enrollmentRecords.filter((record) => {
    return isStudentActive(record)
      && record.teacherName === teacherName
      && getEnrollmentRemainingHours(record) > 0;
  }).length;
}

function getTeacherAvailableClasses(teacherName) {
  return Array.from(new Set(
    enrollmentRecords
      .filter((record) => {
        return isStudentActive(record)
          && record.teacherName === teacherName
          && getEnrollmentRemainingHours(record) > 0;
      })
      .map((record) => record.className)
      .filter(Boolean)
  ));
}

function getFilteredSessionRecords() {
  const dateValue = refs.sessionDateFilter?.value || "";
  const teacherValue = refs.sessionTeacherFilter?.value || "\u5168\u90E8\u6559\u5E08";
  const classValue = refs.sessionClassFilter?.value || "\u5168\u90E8\u73ED\u7EA7";

  return sessionRecords
    .filter((record) => {
      if (dateValue && record.date !== dateValue) return false;
      if (teacherValue !== "\u5168\u90E8\u6559\u5E08" && record.teacherName !== teacherValue) return false;
      if (classValue !== "\u5168\u90E8\u73ED\u7EA7" && record.className !== classValue) return false;
      return true;
    })
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function syncSessionStaticLabels() {
  const title = refs.sessionTableBody?.closest(".panel-card")?.querySelector(".section-head.top-space h3");
  if (title) title.textContent = "\u4e0a\u8bfe\u8bb0\u5f55";
  if (refs.sessionPrevPageBtn) refs.sessionPrevPageBtn.textContent = "\u4e0a\u4e00\u9875";
  if (refs.sessionNextPageBtn) refs.sessionNextPageBtn.textContent = "\u4e0b\u4e00\u9875";
}

function ensureSessionTeacherSelection() {
  if (!Array.isArray(teachers) || teachers.length === 0) {
    selectedSessionTeacherName = "";
    selectedSessionClassName = "";
    return;
  }

  const hasCurrentTeacher = teachers.some((teacher) => teacher.name === selectedSessionTeacherName);
  if (!selectedSessionTeacherName || !hasCurrentTeacher) {
    selectedSessionTeacherName = teachers[0]?.name || "";
  }
}

function renderSessionView() {
  if (!refs.sessionEditorPanel || !refs.sessionHistoryPanel || !refs.sessionViewTabs) return;
  refs.sessionEditorPanel.classList.toggle("hidden", currentSessionView !== "editor");
  refs.sessionHistoryPanel.classList.toggle("hidden", currentSessionView !== "history");
  refs.sessionViewTabs.querySelectorAll("[data-session-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sessionView === currentSessionView);
  });
}

function populateSessionRecordFilters() {
  if (!refs.sessionTeacherFilter || !refs.sessionClassFilter) return;

  const teacherOptions = ["\u5168\u90E8\u6559\u5E08", ...teachers.map((teacher) => teacher.name)];
  const classOptions = ["\u5168\u90E8\u73ED\u7EA7", ...classes.map((item) => item.name)];

  const currentTeacher = refs.sessionTeacherFilter.value || "\u5168\u90E8\u6559\u5E08";
  const currentClass = refs.sessionClassFilter.value || "\u5168\u90E8\u73ED\u7EA7";

  refs.sessionTeacherFilter.innerHTML = teacherOptions
    .map((item) => `<option value="${item}" ${item === currentTeacher ? "selected" : ""}>${item}</option>`)
    .join("");

  refs.sessionClassFilter.innerHTML = classOptions
    .map((item) => `<option value="${item}" ${item === currentClass ? "selected" : ""}>${item}</option>`)
    .join("");
}

function renderSessionTeacherPicker() {
  if (teachers.length === 0) {
    refs.sessionTeacherList.innerHTML = `
      <div class="teacher-empty-state">
        <h4>\u5f53\u524d\u6ca1\u6709\u6559\u5e08\u4fe1\u606f</h4>
        <p>\u8bf7\u5148\u5728\u6559\u5e08\u7ba1\u7406\u4e2d\u6dfb\u52a0\u6559\u5e08\u3002</p>
      </div>
    `;
    return;
  }

  refs.sessionTeacherList.innerHTML = teachers.map((teacher) => {
    const studentCount = getTeacherSessionStudentCount(teacher.name);
    const classCount = getTeacherAvailableClasses(teacher.name).length;
    return `
      <article class="renewal-item">
        <div>
          <h4>${teacher.name}</h4>
          <p class="renewal-meta">
            \u6559\u6388\u79d1\u76ee\uff1a${teacher.subject || "-"}<br>
            \u8054\u7cfb\u7535\u8bdd\uff1a${teacher.phone || "-"}<br>
            \u5728\u8bfb\u5b66\u5458\uff1a${studentCount} \u4eba / \u53ef\u4e0a\u8bfe\u73ed\u7ea7\uff1a${classCount} \u4e2a
          </p>
        </div>
        <div class="renewal-card-actions">
          <button class="primary-btn" type="button" data-pick-session-teacher="${teacher.name}">\u9009\u62e9</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderSessionClassTabs() {
  const classesForTeacher = selectedSessionTeacherName ? getTeacherAvailableClasses(selectedSessionTeacherName) : [];
  refs.sessionAvailableClassCount.textContent = String(classesForTeacher.length);

  if (classesForTeacher.length === 0) {
    refs.sessionClassTabs.innerHTML = "";
    selectedSessionClassName = "";
    selectedSessionStudentIds = [];
    shouldAutoSelectSessionStudents = true;
    renderSessionStudents();
    return;
  }

  if (!selectedSessionClassName || !classesForTeacher.includes(selectedSessionClassName)) {
    selectedSessionClassName = classesForTeacher[0];
    shouldAutoSelectSessionStudents = true;
  }

  refs.sessionClassTabs.innerHTML = classesForTeacher.map((className) => `
    <button class="session-class-tab ${className === selectedSessionClassName ? "active" : ""}" type="button" data-session-class="${className}">${className}</button>
  `).join("");
}

function renderSessionStudents() {
  const candidates = getSessionSelectableStudents();
  const candidateIds = candidates.map((record) => Number(record.id));
  selectedSessionStudentIds = selectedSessionStudentIds.filter((id) => candidateIds.includes(Number(id)));

  if (shouldAutoSelectSessionStudents && candidates.length > 0 && selectedSessionStudentIds.length === 0) {
    selectedSessionStudentIds = [...candidateIds];
    shouldAutoSelectSessionStudents = false;
  }

  if (candidates.length === 0) {
    refs.sessionStudentList.innerHTML = `<p class="session-empty-note">\u5f53\u524d\u6559\u5e08\u6216\u73ed\u7ea7\u4e0b\u6682\u65e0\u53ef\u8bb0\u5f55\u8bfe\u65f6\u7684\u5728\u8bfb\u5b66\u5458\u3002</p>`;
    refs.sessionPendingStudentCount.textContent = "0 / 0";
    return;
  }

  refs.sessionPendingStudentCount.textContent = `${selectedSessionStudentIds.length} / ${candidates.length}`;
  refs.sessionStudentList.innerHTML = candidates.map((record) => `
    <article class="session-student-card">
      <label class="session-student-toggle">
        <input
          class="session-student-checkbox"
          type="checkbox"
          value="${record.id}"
          ${selectedSessionStudentIds.includes(Number(record.id)) ? "checked" : ""}
        >
        <div class="session-student-main">
          <strong>${record.studentName}</strong>
          <span>${record.courseName} / ${record.className}</span>
        </div>
        <div class="session-student-side">
          <strong>\u5269\u4f59 ${getEnrollmentRemainingHours(record)} \u8bfe\u65f6</strong>
          <span>\u603b\u8bfe\u65f6 ${getEnrollmentTotalHours(record)}</span>
        </div>
      </label>
    </article>
  `).join("");
}

function getSessionStudentNames(record) {
  const students = Array.isArray(record.students) ? record.students : [];
  return students
    .map((item) => enrollmentRecords.find((row) => Number(row.id) === Number(item.enrollmentId))?.studentName)
    .filter(Boolean)
    .join("\u3001");
}

function getSessionStudentDetails(record) {
  const students = Array.isArray(record.students) ? record.students : [];
  return students
    .map((item) => {
      const matched = enrollmentRecords.find((row) => Number(row.id) === Number(item.enrollmentId));
      return {
        name: matched?.studentName || "-",
        deductedHours: Number(item.deductedHours || 0)
      };
    })
    .filter((item) => item.name);
}

function getSessionDetailHtml(record) {
  const details = getSessionStudentDetails(record);
  if (details.length === 0) {
    return `<div class="record-detail-box"><div>\u6682\u65E0\u5230\u8BFE\u5B66\u5458\u660E\u7EC6</div></div>`;
  }

  return `
    <div class="record-detail-box">
      ${details.map((item, index) => `
        <div><strong>\u5E8F\u53F7 ${index + 1}\uFF1A</strong>${item.name}</div>
        <div><strong>\u672C\u6B21\u6263\u51CF\u8BFE\u65F6\uFF1A</strong>${item.deductedHours}</div>
      `).join("")}
    </div>
  `;
}

function renderSessionPagination(totalRecords) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / SESSION_PAGE_SIZE));
  if (sessionRecordPage > totalPages) sessionRecordPage = totalPages;
  if (sessionRecordPage < 1) sessionRecordPage = 1;

  if (refs.sessionPageInfo) {
    refs.sessionPageInfo.textContent = `\u7b2c ${sessionRecordPage} \u9875 / \u5171 ${totalPages} \u9875`;
  }
  if (refs.sessionPrevPageBtn) refs.sessionPrevPageBtn.disabled = sessionRecordPage <= 1;
  if (refs.sessionNextPageBtn) refs.sessionNextPageBtn.disabled = sessionRecordPage >= totalPages;
}

function renderSessionRecords() {
  const filtered = getFilteredSessionRecords();
  refs.sessionRecordCount.textContent = `${filtered.length} \u6761\u8bb0\u5f55`;

  if (filtered.length === 0) {
    sessionRecordPage = 1;
    refs.sessionTableBody.innerHTML = `<tr><td colspan="6">\u5f53\u524d\u6559\u5e08\u8fd8\u6ca1\u6709\u4e0a\u8bfe\u8bb0\u5f55\u3002</td></tr>`;
    renderSessionPagination(0);
    return;
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / SESSION_PAGE_SIZE));
  if (sessionRecordPage > totalPages) sessionRecordPage = totalPages;
  const start = (sessionRecordPage - 1) * SESSION_PAGE_SIZE;
  const pagedRecords = filtered.slice(start, start + SESSION_PAGE_SIZE);

  refs.sessionTableBody.innerHTML = pagedRecords.map((record) => `
    <tr>
      <td>${record.date}</td>
      <td>${record.teacherName}</td>
      <td>${record.className}</td>
      <td>${record.attendance}</td>
      <td>
        <button class="table-detail-btn" type="button" data-detail-session-id="${record.id}">\u67E5\u770B\u8BE6\u60C5</button>
      </td>
      <td><button class="table-action-btn" type="button" data-delete-session-id="${record.id}">\u5220\u9664</button></td>
    </tr>
    <tr class="detail-row hidden" id="session-detail-row-${record.id}">
      <td colspan="6">
        ${getSessionDetailHtml(record)}
      </td>
    </tr>
  `).join("");

  renderSessionPagination(filtered.length);
}

function resetSessionSelection() {
  shouldAutoSelectSessionStudents = false;
  selectedSessionStudentIds = [];
  renderSessionStudents();
}

function renderSessionWorkspace() {
  syncSessionStaticLabels();
  ensureSessionTeacherSelection();
  populateSessionRecordFilters();
  renderSessionView();
  if (refs.sessionLessonDateInput && !refs.sessionLessonDateInput.value) {
    refs.sessionLessonDateInput.value = getTodayString();
  }
  refs.sessionTeacherDisplay.textContent = selectedSessionTeacherName || "\u672a\u9009\u62e9";
  renderSessionTeacherPicker();
  renderSessionClassTabs();
  renderSessionStudents();
  renderSessionRecords();
}

function selectSessionTeacher(teacherName) {
  selectedSessionTeacherName = teacherName;
  selectedSessionClassName = "";
  selectedSessionStudentIds = [];
  shouldAutoSelectSessionStudents = true;
  sessionRecordPage = 1;
  persistAppData();
  closeModal(refs.sessionTeacherModal);
  renderSessionWorkspace();
}

function changeSessionRecordPage(direction) {
  const filtered = getFilteredSessionRecords();
  const totalPages = Math.max(1, Math.ceil(filtered.length / SESSION_PAGE_SIZE));
  sessionRecordPage += direction;
  if (sessionRecordPage < 1) sessionRecordPage = 1;
  if (sessionRecordPage > totalPages) sessionRecordPage = totalPages;
  renderSessionRecords();
}

function applySessionRecordFilters() {
  sessionRecordPage = 1;
  renderSessionRecords();
}

function resetSessionRecordFilters() {
  if (refs.sessionDateFilter) refs.sessionDateFilter.value = "";
  if (refs.sessionTeacherFilter) refs.sessionTeacherFilter.value = "\u5168\u90E8\u6559\u5E08";
  if (refs.sessionClassFilter) refs.sessionClassFilter.value = "\u5168\u90E8\u73ED\u7EA7";
  applySessionRecordFilters();
}

function switchSessionView(viewName) {
  currentSessionView = viewName === "history" ? "history" : "editor";
  renderSessionView();
}

function saveSessionRecord() {
  const candidates = getSessionSelectableStudents();
  const candidateIds = candidates.map((record) => Number(record.id));
  const validSelectedIds = selectedSessionStudentIds.filter((id) => candidateIds.includes(Number(id)));
  const lessonDate = refs.sessionLessonDateInput?.value || "";

  if (!lessonDate || !selectedSessionTeacherName || !selectedSessionClassName || validSelectedIds.length === 0) {
    showToast("\u8bf7\u5148\u9009\u62e9\u4E0A\u8BFE\u65E5\u671F\u3001\u6559\u5E08\u3001\u73ED\u7EA7\u5E76\u52FE\u9009\u5B66\u5458\u3002");
    return;
  }

  const session = {
    id: uid(),
    date: lessonDate,
    teacherName: selectedSessionTeacherName,
    className: selectedSessionClassName,
    attendance: validSelectedIds.length,
    hours: 1,
    students: validSelectedIds.map((id) => ({ enrollmentId: id, deductedHours: 1 }))
  };

  sessionRecords.unshift(session);
  shouldAutoSelectSessionStudents = true;
  selectedSessionStudentIds = [];
  sessionRecordPage = 1;
  renderSessionWorkspace();
  renderTeachers();
  renderStudents(refs.studentSearch.value || "");
  renderRenewalList();
  showToast(`${lessonDate} ${selectedSessionTeacherName} / ${selectedSessionClassName} \u5df2\u8bb0\u5f55 ${validSelectedIds.length} \u4f4d\u5b66\u5458\u4e0a\u8bfe\u3002`);
}

function deleteSessionRecord(sessionId) {
  sessionRecords = sessionRecords.filter((item) => Number(item.id) !== Number(sessionId));
  renderSessionWorkspace();
  renderTeachers();
  renderStudents(refs.studentSearch.value || "");
  renderRenewalList();
  showToast("\u4e0a\u8bfe\u8bb0\u5f55\u5df2\u5220\u9664\uff0c\u5bf9\u5e94\u8bfe\u65f6\u5df2\u81ea\u52a8\u6062\u590d\u3002");
}
