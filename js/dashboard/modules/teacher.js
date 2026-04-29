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
    refs.teacherEmptyState.innerHTML = `<h4>当前还没有教师信息</h4><p>点击右上角“添加教师”后，这里会显示已有教师的基本信息卡片。</p>`;
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
        <button class="table-edit-btn" type="button" data-edit-teacher-id="${teacher.id}">编辑</button>
        <button class="table-action-btn" type="button" data-delete-teacher-id="${teacher.id}">删除</button>
      </div>
    </article>
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
    teachers = teachers.map((teacher) => teacher.id === editingTeacherId ? { ...teacher, ...payload } : teacher);
  } else {
    teachers.unshift({ id: uid(), ...payload });
  }

  resetTeacherForm();
  closeModal(refs.teacherModal);
  populateTeacherOptions();
  renderTeachers();
  renderClasses();
  renderSessionTeacherPicker();
  showToast(isEditing ? "教师信息已更新" : "教师已添加");
}

