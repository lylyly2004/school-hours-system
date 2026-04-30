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

function renderSessionTeacherPicker() {
  if (teachers.length === 0) {
    refs.sessionTeacherList.innerHTML = `
      <div class="teacher-empty-state">
        <h4>当前没有教师信息</h4>
        <p>请先在教师管理中添加教师。</p>
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
            教授科目：${teacher.subject || "-"}<br>
            联系电话：${teacher.phone || "-"}<br>
            在读学员：${studentCount} 人 / 可上课班级：${classCount} 个
          </p>
        </div>
        <div class="renewal-card-actions">
          <button class="primary-btn" type="button" data-pick-session-teacher="${teacher.name}">选择</button>
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
    renderSessionStudents();
    return;
  }

  if (!selectedSessionClassName || !classesForTeacher.includes(selectedSessionClassName)) {
    selectedSessionClassName = classesForTeacher[0];
  }

  refs.sessionClassTabs.innerHTML = classesForTeacher.map((className) => `
    <button class="session-class-tab ${className === selectedSessionClassName ? "active" : ""}" type="button" data-session-class="${className}">${className}</button>
  `).join("");
}

function renderSessionStudents() {
  const candidates = getSessionSelectableStudents();
  const candidateIds = candidates.map((record) => Number(record.id));
  selectedSessionStudentIds = selectedSessionStudentIds.filter((id) => candidateIds.includes(Number(id)));

  if (candidates.length === 0) {
    refs.sessionStudentList.innerHTML = `<p class="session-empty-note">当前教师或班级下暂无可记录课时的在读学员。</p>`;
    refs.sessionPendingStudentCount.textContent = "0 / 0";
    return;
  }

  refs.sessionPendingStudentCount.textContent = `${selectedSessionStudentIds.length} / ${candidates.length}`;
  refs.sessionStudentList.innerHTML = candidates.map((record) => `
    <article class="session-student-card">
      <label>
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
      </label>
      <div class="session-student-side">
        <strong>剩余 ${getEnrollmentRemainingHours(record)} 课时</strong>
        <span>总课时 ${getEnrollmentTotalHours(record)}</span>
      </div>
    </article>
  `).join("");
}

function getSessionStudentNames(record) {
  const students = Array.isArray(record.students) ? record.students : [];
  return students
    .map((item) => enrollmentRecords.find((row) => Number(row.id) === Number(item.enrollmentId))?.studentName)
    .filter(Boolean)
    .join("、");
}

function renderSessionRecords() {
  const filtered = selectedSessionTeacherName
    ? sessionRecords.filter((record) => record.teacherName === selectedSessionTeacherName)
    : [];

  refs.sessionRecordCount.textContent = `${filtered.length} 条记录`;
  if (filtered.length === 0) {
    refs.sessionTableBody.innerHTML = `<tr><td colspan="6">当前教师还没有上课记录。</td></tr>`;
    return;
  }

  refs.sessionTableBody.innerHTML = filtered.map((record) => `
    <tr>
      <td>${record.date}</td>
      <td>${record.teacherName}</td>
      <td>${record.className}</td>
      <td>${record.attendance}</td>
      <td>${getSessionStudentNames(record) || "-"}</td>
      <td><button class="table-action-btn" type="button" data-delete-session-id="${record.id}">删除</button></td>
    </tr>
  `).join("");
}

function resetSessionSelection() {
  selectedSessionStudentIds = [];
  renderSessionStudents();
}

function renderSessionWorkspace() {
  refs.sessionTeacherDisplay.textContent = selectedSessionTeacherName || "未选择";
  renderSessionTeacherPicker();
  renderSessionClassTabs();
  renderSessionStudents();
  renderSessionRecords();
}

function selectSessionTeacher(teacherName) {
  selectedSessionTeacherName = teacherName;
  selectedSessionClassName = "";
  selectedSessionStudentIds = [];
  closeModal(refs.sessionTeacherModal);
  renderSessionWorkspace();
}

function saveSessionRecord() {
  const candidates = getSessionSelectableStudents();
  const candidateIds = candidates.map((record) => Number(record.id));
  const validSelectedIds = selectedSessionStudentIds.filter((id) => candidateIds.includes(Number(id)));

  if (!selectedSessionTeacherName || !selectedSessionClassName || validSelectedIds.length === 0) {
    showToast("请先选择教师、班级并勾选学员。");
    return;
  }

  const session = {
    id: uid(),
    date: getTodayString(),
    teacherName: selectedSessionTeacherName,
    className: selectedSessionClassName,
    attendance: validSelectedIds.length,
    hours: 1,
    students: validSelectedIds.map((id) => ({ enrollmentId: id, deductedHours: 1 }))
  };

  sessionRecords.unshift(session);
  selectedSessionStudentIds = [];
  renderSessionWorkspace();
  renderTeachers();
  renderStudents(refs.studentSearch.value || "");
  renderRenewalList();
  showToast("上课记录已保存。");
}

function deleteSessionRecord(sessionId) {
  sessionRecords = sessionRecords.filter((item) => Number(item.id) !== Number(sessionId));
  renderSessionWorkspace();
  renderTeachers();
  renderStudents(refs.studentSearch.value || "");
  renderRenewalList();
  showToast("上课记录已删除，对应课时已自动恢复。");
}
