function openManagementEditor(mode, payload = {}) {
  managementEditorMode = mode;
  editingCourseId = payload.courseId || null;
  refs.managementEditorInput.value = payload.value || "";

  if (mode === "course-create") {
    refs.managementEditorTitle.textContent = "新建课程";
    refs.managementEditorHint.textContent = "输入课程名称后点击保存，系统会同步到新生报名课程下拉菜单。";
    refs.managementEditorLabel.textContent = "课程名称";
    refs.managementEditorInput.value = "";
  } else if (mode === "course-edit") {
    refs.managementEditorTitle.textContent = "修改课程名称";
    refs.managementEditorHint.textContent = "修改后会同步更新课程管理、新生报名以及相关业务记录中的课程名称。";
    refs.managementEditorLabel.textContent = "课程名称";
    refs.managementEditorInput.value = payload.courseName || "";
  } else {
    refs.managementEditorTitle.textContent = "新建班级类型";
    refs.managementEditorHint.textContent = "保存后会同步到班级类型下拉菜单，可用于新增班级。";
    refs.managementEditorLabel.textContent = "班级类型";
    refs.managementEditorInput.value = "";
  }

  openModal(refs.managementEditorModal);
}

function closeManagementEditor() {
  managementEditorMode = "";
  editingCourseId = null;
  closeModal(refs.managementEditorModal);
}

function saveManagementEditor() {
  const value = refs.managementEditorInput.value.trim();
  if (!value) {
    showToast("请先填写名称");
    return;
  }

  if (managementEditorMode === "course-create") {
    if (courses.some((item) => item.name === value)) {
      showToast("该课程类型已存在");
      return;
    }
    courses.unshift({ id: uid(), name: value, status: "active" });
    populateCourseOptions(value);
    renderCourseManagementList();
    renderTransactions();
    closeManagementEditor();
    showToast("课程已创建，可在新生报名中直接选择");
    return;
  }

  if (managementEditorMode === "course-edit") {
    const target = courses.find((item) => item.id === editingCourseId);
    if (!target) return;
    if (courses.some((item) => item.name === value && item.id !== editingCourseId)) {
      showToast("该课程类型已存在");
      return;
    }
    courses = courses.map((item) => item.id === editingCourseId
      ? { ...item, name: value, status: item.status || "active" }
      : { ...item, status: item.status || "active" });
    renameCourseAcrossSystem(target.name, value);
    populateCourseOptions(value);
    renderCourseManagementList();
    renderEnrollmentRecords();
    renderStudents(refs.studentSearch.value || "");
    renderRetailRecords();
    renderTodayRecords();
    renderTransactions();
    closeManagementEditor();
    showToast("课程名称已更新");
    return;
  }

  if (classTypeOptions.includes(value)) {
    showToast("该班级类型已存在");
    return;
  }
  classTypeOptions.push(value);
  populateClassTypeOptions(value);
  populateClassOptions(refs.classSelect?.value || "");
  renderClasses(refs.classSearch?.value || "");
  closeManagementEditor();
  showToast("班级类型已添加");
}
