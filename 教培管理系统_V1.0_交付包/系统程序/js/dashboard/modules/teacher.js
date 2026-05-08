const TEACHER_DETAIL_SESSION_PAGE_SIZE = 10;
let currentTeacherDetailPages = {};

function getTeacherActiveStudents(teacherName) {
  return enrollmentRecords.filter((record) => isStudentActive(record) && record.teacherName === teacherName);
}

function getTeacherCurrentClasses(teacherName) {
  return Array.from(
    new Set(
      getTeacherActiveStudents(teacherName)
        .map((record) => record.className)
        .filter(Boolean)
    )
  );
}

function getTeacherSessionHistory(teacherName) {
  return sessionRecords
    .filter((record) => record.teacherName === teacherName)
    .slice()
    .sort((left, right) => String(right.date || "").localeCompare(String(left.date || "")));
}

function getTeacherTotalHours(teacherName) {
  return sessionRecords.reduce((total, record) => {
    if (record.teacherName !== teacherName) return total;
    return total + Number(record.hours || 0);
  }, 0);
}

function getTeacherDetailPage(teacherId) {
  return Math.max(1, Number(currentTeacherDetailPages[teacherId] || 1));
}

function setTeacherDetailPage(teacherId, page) {
  currentTeacherDetailPages[teacherId] = Math.max(1, Number(page || 1));
}

function getTeacherDetailHtml(teacher) {
  const activeStudents = getTeacherActiveStudents(teacher.name);
  const currentClasses = getTeacherCurrentClasses(teacher.name);
  const sessionHistory = getTeacherSessionHistory(teacher.name);
  const studentTags = activeStudents.length > 0
    ? activeStudents.map((record) => `<span class="teacher-student-tag">${record.studentName}</span>`).join("")
    : `<span class="teacher-empty-text">暂无在读学员</span>`;

  const totalPages = Math.max(1, Math.ceil(sessionHistory.length / TEACHER_DETAIL_SESSION_PAGE_SIZE));
  const currentPage = Math.min(getTeacherDetailPage(teacher.id), totalPages);
  const startIndex = (currentPage - 1) * TEACHER_DETAIL_SESSION_PAGE_SIZE;
  const pagedHistory = sessionHistory.slice(startIndex, startIndex + TEACHER_DETAIL_SESSION_PAGE_SIZE);

  return `
    <div class="teacher-detail-box">
      <div class="teacher-detail-grid">
        <div class="teacher-detail-item">
          <span>当前班级</span>
          <strong>${currentClasses.length > 0 ? currentClasses.join("、") : "暂无班级"}</strong>
        </div>
        <div class="teacher-detail-item">
          <span>在读学员</span>
          <strong>${activeStudents.length} 位</strong>
        </div>
        <div class="teacher-detail-item">
          <span>本月课时</span>
          <strong>${getTeacherMonthlyHours(teacher.name)} 课时</strong>
        </div>
        <div class="teacher-detail-item">
          <span>累计课时</span>
          <strong>${getTeacherTotalHours(teacher.name)} 课时</strong>
        </div>
      </div>

      <div class="teacher-detail-section">
        <div class="teacher-detail-section-head">
          <h5>当前在读学员</h5>
          <span class="teacher-detail-meta">${activeStudents.length} 位</span>
        </div>
        <div class="teacher-student-tags">
          ${studentTags}
        </div>
      </div>

      <div class="teacher-detail-section">
        <div class="teacher-detail-section-head">
          <h5>上课记录</h5>
          <span class="teacher-detail-meta">${sessionHistory.length} 条</span>
        </div>
        ${sessionHistory.length > 0 ? `
          <div class="teacher-detail-table">
            <table>
              <thead>
                <tr>
                  <th>上课日期</th>
                  <th>班级名称</th>
                  <th>到课人数</th>
                  <th>记录课时</th>
                </tr>
              </thead>
              <tbody>
                ${pagedHistory.map((record) => `
                  <tr>
                    <td>${record.date || "-"}</td>
                    <td>${record.className || "-"}</td>
                    <td>${Number(record.attendance || 0)}</td>
                    <td>${Number(record.hours || 0)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
          ${totalPages > 1 ? `
            <div class="detail-table-pagination">
              <button class="secondary-btn" type="button" data-teacher-history-page="${teacher.id}" data-page-direction="prev" ${currentPage === 1 ? "disabled" : ""}>上一页</button>
              <span class="pagination-info">第 ${currentPage} / ${totalPages} 页</span>
              <button class="secondary-btn" type="button" data-teacher-history-page="${teacher.id}" data-page-direction="next" ${currentPage === totalPages ? "disabled" : ""}>下一页</button>
            </div>
          ` : ""}
        ` : `<p class="teacher-empty-text">暂无上课记录</p>`}
      </div>
    </div>
  `;
}

function renderTeachers() {
  const keyword = (refs.teacherSearch.value || "").trim();
  const filtered = teachers.filter((teacher) => {
    if (!keyword) return true;
    return teacher.name.includes(keyword) || teacher.phone.includes(keyword);
  });

  refs.teacherListHead.classList.toggle("hidden", teachers.length === 0);
  refs.teacherCardList.classList.toggle("hidden", filtered.length === 0);
  refs.teacherEmptyState.classList.toggle("hidden", filtered.length > 0);
  refs.teacherCount.textContent = `${filtered.length} 位教师`;

  if (teachers.length === 0) {
    refs.teacherEmptyState.innerHTML = `<h4>当前还没有教师信息</h4><p>点击右上角“添加教师”后，这里会显示已有教师的基础信息卡片。</p>`;
    refs.teacherCardList.innerHTML = "";
    return;
  }

  if (filtered.length === 0) {
    refs.teacherEmptyState.innerHTML = `<h4>没有找到匹配的教师</h4><p>可以尝试按教师姓名或联系电话重新搜索。</p>`;
    refs.teacherCardList.innerHTML = "";
    return;
  }

  refs.teacherCardList.innerHTML = filtered.map((teacher) => `
    <article class="teacher-card">
      <div class="teacher-card-header">
        <div>
          <h4>${teacher.name}</h4>
          <p>${teacher.nickname || "未填写昵称"}</p>
        </div>
        <span class="status-pill status-normal">本月 ${getTeacherMonthlyHours(teacher.name)} 课时</span>
      </div>
      <div class="teacher-info-list">
        <div class="teacher-info-item">
          <span>联系电话</span>
          <strong>${teacher.phone}</strong>
        </div>
        <div class="teacher-info-item">
          <span>教授科目</span>
          <strong>${teacher.subject || "-"}</strong>
        </div>
      </div>
      <div class="inline-actions">
        <button class="table-detail-btn" type="button" data-detail-teacher-id="${teacher.id}">详情</button>
        <button class="table-edit-btn" type="button" data-edit-teacher-id="${teacher.id}">编辑</button>
        <button class="table-action-btn" type="button" data-delete-teacher-id="${teacher.id}">删除</button>
      </div>
    </article>
    <div class="teacher-detail-row hidden" id="teacher-detail-row-${teacher.id}">
      <div class="teacher-detail-wrap">
        ${getTeacherDetailHtml(teacher)}
      </div>
    </div>
  `).join("");
}

function resetTeacherForm() {
  editingTeacherId = null;
  refs.teacherFormTitle.textContent = "添加教师";
  refs.saveTeacherBtn.textContent = "保存教师";
  refs.teacherName.value = "";
  refs.teacherNickname.value = "";
  refs.teacherSubject.value = "";
  refs.teacherPhone.value = "";
}

function openTeacherModal(teacherId = null) {
  resetTeacherForm();
  if (teacherId) {
    const teacher = teachers.find((item) => item.id === teacherId);
    if (!teacher) return;
    editingTeacherId = teacher.id;
    refs.teacherFormTitle.textContent = `编辑教师：${teacher.name}`;
    refs.saveTeacherBtn.textContent = "保存修改";
    refs.teacherName.value = teacher.name;
    refs.teacherNickname.value = teacher.nickname || "";
    refs.teacherSubject.value = teacher.subject || "";
    refs.teacherPhone.value = teacher.phone || "";
  }
  openModal(refs.teacherModal);
}

function renameTeacherAcrossSystem(oldName, newName) {
  if (!oldName || oldName === newName) return;
  enrollmentRecords = enrollmentRecords.map((record) => (
    record.teacherName === oldName ? { ...record, teacherName: newName } : record
  ));
  sessionRecords = sessionRecords.map((record) => (
    record.teacherName === oldName ? { ...record, teacherName: newName } : record
  ));
  if (selectedSessionTeacherName === oldName) {
    selectedSessionTeacherName = newName;
  }
}

function saveTeacher() {
  const isEditing = Boolean(editingTeacherId);
  const payload = {
    name: refs.teacherName.value.trim(),
    nickname: refs.teacherNickname.value.trim(),
    subject: refs.teacherSubject.value.trim(),
    phone: refs.teacherPhone.value.trim()
  };

  if (!payload.name || !payload.subject || !payload.phone) {
    showToast("请完整填写教师信息");
    return;
  }

  if (isEditing) {
    const previousTeacher = teachers.find((teacher) => teacher.id === editingTeacherId);
    teachers = teachers.map((teacher) => teacher.id === editingTeacherId ? { ...teacher, ...payload } : teacher);
    renameTeacherAcrossSystem(previousTeacher?.name || "", payload.name);
  } else {
    teachers.unshift({ id: uid(), ...payload });
  }

  resetTeacherForm();
  closeModal(refs.teacherModal);
  populateTeacherOptions();
  renderTeachers();
  renderClasses();
  renderStudents(refs.studentSearch?.value || "");
  renderSessionTeacherPicker();
  renderSessionWorkspace();
  showToast(isEditing ? "教师信息已更新" : "教师已添加");
}
