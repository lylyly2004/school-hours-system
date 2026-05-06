function canDeleteClassType(typeName) {
  return !classes.some((item) => item.type === typeName);
}

function getClassTypeDeleteReason(typeName) {
  if (!canDeleteClassType(typeName)) {
    return "该授课形式已有班级使用";
  }
  return "";
}

function renderManagementEditorList() {
  if (!refs.managementEditorList) return;

  if (managementEditorMode !== "class-type-create") {
    refs.managementEditorList.classList.add("hidden");
    refs.managementEditorList.innerHTML = "";
    return;
  }

  refs.managementEditorList.classList.remove("hidden");

  if (!Array.isArray(classTypeOptions) || classTypeOptions.length === 0) {
    refs.managementEditorList.innerHTML = `
      <div class="management-editor-empty">当前还没有授课形式，可直接新增。</div>
    `;
    return;
  }

  refs.managementEditorList.innerHTML = `
    <div class="management-editor-list-head">已有授课形式</div>
    <div class="management-editor-items">
      ${classTypeOptions.map((item) => {
        const deletable = canDeleteClassType(item);
        const reason = getClassTypeDeleteReason(item);
        return `
          <div class="management-editor-item">
            <span>${item}</span>
            <button
              class="table-refund-btn ${deletable ? "" : "disabled-btn"}"
              type="button"
              data-delete-class-type="${item}"
              data-delete-class-type-allowed="${deletable ? "true" : "false"}"
              data-delete-class-type-reason="${reason}"
            >删除</button>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function openManagementEditor(mode, payload = {}) {
  managementEditorMode = mode;
  editingCourseId = payload.courseId || null;
  refs.managementEditorInput.value = payload.value || "";

  if (mode === "course-create") {
    refs.managementEditorTitle.textContent = "\u65B0\u5EFA\u5B66\u79D1\u7C7B\u522B";
    refs.managementEditorHint.textContent = "\u8F93\u5165\u5B66\u79D1\u7C7B\u522B\u540D\u79F0\u540E\u70B9\u51FB\u4FDD\u5B58\uFF0C\u7CFB\u7EDF\u4F1A\u540C\u6B65\u5230\u65B0\u751F\u62A5\u540D\u7684\u5B66\u79D1\u7C7B\u522B\u4E0B\u62C9\u83DC\u5355\u3002";
    refs.managementEditorLabel.textContent = "\u5B66\u79D1\u7C7B\u522B\u540D\u79F0";
    refs.managementEditorInput.value = "";
  } else if (mode === "course-edit") {
    refs.managementEditorTitle.textContent = "\u4FEE\u6539\u5B66\u79D1\u7C7B\u522B";
    refs.managementEditorHint.textContent = "\u4FEE\u6539\u540E\u4F1A\u540C\u6B65\u66F4\u65B0\u5B66\u79D1\u7C7B\u522B\u7BA1\u7406\u3001\u65B0\u751F\u62A5\u540D\u4EE5\u53CA\u76F8\u5173\u4E1A\u52A1\u8BB0\u5F55\u4E2D\u7684\u5B66\u79D1\u7C7B\u522B\u540D\u79F0\u3002";
    refs.managementEditorLabel.textContent = "\u5B66\u79D1\u7C7B\u522B\u540D\u79F0";
    refs.managementEditorInput.value = payload.courseName || "";
  } else {
    refs.managementEditorTitle.textContent = "\u65B0\u5EFA\u6388\u8BFE\u5F62\u5F0F";
    refs.managementEditorHint.textContent = "\u4FDD\u5B58\u540E\u4F1A\u540C\u6B65\u5230\u6388\u8BFE\u5F62\u5F0F\u4E0B\u62C9\u83DC\u5355\uFF0C\u53EF\u7528\u4E8E\u65B0\u5EFA\u73ED\u7EA7\u3002";
    refs.managementEditorLabel.textContent = "\u6388\u8BFE\u5F62\u5F0F";
    refs.managementEditorInput.value = "";
  }

  renderManagementEditorList();
  openModal(refs.managementEditorModal);
}

function closeManagementEditor() {
  managementEditorMode = "";
  editingCourseId = null;
  if (refs.managementEditorList) {
    refs.managementEditorList.classList.add("hidden");
    refs.managementEditorList.innerHTML = "";
  }
  closeModal(refs.managementEditorModal);
}

function saveManagementEditor() {
  const value = refs.managementEditorInput.value.trim();
  if (!value) {
    showToast("\u8BF7\u5148\u586B\u5199\u540D\u79F0");
    return;
  }

  if (managementEditorMode === "course-create") {
    if (courses.some((item) => item.name === value)) {
      showToast("\u8BE5\u5B66\u79D1\u7C7B\u522B\u5DF2\u5B58\u5728");
      return;
    }
    courses.unshift({ id: uid(), name: value, status: "active" });
    populateCourseOptions(value);
    renderCourseManagementList();
    renderTransactions();
    closeManagementEditor();
    showToast("\u5B66\u79D1\u7C7B\u522B\u5DF2\u521B\u5EFA\uFF0C\u53EF\u5728\u65B0\u751F\u62A5\u540D\u4E2D\u76F4\u63A5\u9009\u62E9");
    return;
  }

  if (managementEditorMode === "course-edit") {
    const target = courses.find((item) => item.id === editingCourseId);
    if (!target) return;
    if (courses.some((item) => item.name === value && item.id !== editingCourseId)) {
      showToast("\u8BE5\u5B66\u79D1\u7C7B\u522B\u5DF2\u5B58\u5728");
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
    showToast("\u5B66\u79D1\u7C7B\u522B\u540D\u79F0\u5DF2\u66F4\u65B0");
    return;
  }

  if (classTypeOptions.includes(value)) {
    showToast("\u8BE5\u6388\u8BFE\u5F62\u5F0F\u5DF2\u5B58\u5728");
    return;
  }
  classTypeOptions.push(value);
  populateClassTypeOptions(value);
  populateClassOptions(refs.classSelect?.value || "");
  renderClasses(refs.classSearch?.value || "");
  renderManagementEditorList();
  closeManagementEditor();
  showToast("\u6388\u8BFE\u5F62\u5F0F\u5DF2\u6DFB\u52A0");
}

function deleteClassType(typeName) {
  if (!canDeleteClassType(typeName)) {
    showToast(getClassTypeDeleteReason(typeName) || "当前授课形式不满足删除条件");
    return;
  }

  if (!window.confirm(`确认删除授课形式“${typeName}”吗？`)) {
    return;
  }

  classTypeOptions = classTypeOptions.filter((item) => item !== typeName);
  populateClassTypeOptions(refs.classTypeSelect?.value === typeName ? (classTypeOptions[0] || "") : (refs.classTypeSelect?.value || ""));
  renderManagementEditorList();
  showToast("授课形式已删除");
}
