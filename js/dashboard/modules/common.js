function updateHeader() {
  const meta = pageMeta[currentPage] || pageMeta.student;
  refs.pageTag.textContent = meta.tag;
  refs.pageTitle.textContent = meta.title;
  const isStudentPage = currentPage === "student";
  refs.topSearchBox.classList.toggle("hidden", !isStudentPage);
  if (!isStudentPage) {
    refs.studentSearch.value = "";
  }
}

function applyTeachingTerminology() {
  const courseMenu = document.querySelector('.menu-item[data-page="course"]');
  if (courseMenu) courseMenu.textContent = "\u5B66\u79D1\u7BA1\u7406";
  if (currentPage === "course") {
    refs.pageTitle.textContent = "\u5B66\u79D1\u7BA1\u7406";
  }

  const enrollmentCourseField = refs.courseSelect?.closest(".form-field");
  const enrollmentCourseLabel = enrollmentCourseField?.querySelector("label");
  if (enrollmentCourseLabel) {
    enrollmentCourseLabel.innerHTML = `\u62A5\u540D\u5B66\u79D1\u7C7B\u522B <span class="required-mark">*</span>`;
  }
  const enrollmentCampusField = refs.campusSelect?.closest(".form-field");
  const enrollmentCampusLabel = enrollmentCampusField?.querySelector("label");
  if (enrollmentCampusLabel) {
    enrollmentCampusLabel.innerHTML = `\u6821\u533A <span class="required-mark">*</span>`;
  }

  const coursePanel = document.getElementById("panel-course");
  if (coursePanel) {
    const cardTag = coursePanel.querySelector(".card-tag");
    const title = coursePanel.querySelector(".section-head h3");
    const helper = coursePanel.querySelector(".form-helper");
    const addBtn = coursePanel.querySelector("#courseQuickAddBtn");
    const firstHeader = coursePanel.querySelector("thead th");
    if (cardTag) cardTag.textContent = "\u5B66\u79D1\u7BA1\u7406";
    if (title) title.textContent = "\u5B66\u79D1\u7C7B\u522B\u7EF4\u62A4";
    if (helper) helper.textContent = "\u5B66\u79D1\u7C7B\u522B\u5355\u72EC\u7EF4\u62A4\uFF0C\u65B0\u751F\u62A5\u540D\u548C\u6559\u6750\u96F6\u552E\u4F1A\u540C\u6B65\u8BFB\u53D6\u8FD9\u91CC\u7684\u5B66\u79D1\u7C7B\u522B\u6570\u636E\u3002";
    if (addBtn) addBtn.textContent = "\u65B0\u5EFA\u5B66\u79D1\u7C7B\u522B";
    if (firstHeader) firstHeader.textContent = "\u5B66\u79D1\u7C7B\u522B";
  }

  const classPanel = document.getElementById("panel-class");
  if (classPanel) {
    const addClassTypeBtn = classPanel.querySelector("#addClassTypeBtn");
    const compactHelper = classPanel.querySelector(".compact-head .form-helper");
    const classTypeField = refs.classTypeSelect?.closest(".form-field");
    const classTypeLabel = classTypeField?.querySelector("label");
    const secondHeader = classPanel.querySelector("thead th:nth-child(2)");
    if (addClassTypeBtn) addClassTypeBtn.textContent = "\u65B0\u5EFA\u6388\u8BFE\u5F62\u5F0F";
    if (compactHelper) compactHelper.textContent = "\u4EE5\u73ED\u7EA7\u540D\u79F0\u4E3A\u4E3B\u8FDB\u884C\u7BA1\u7406\u3002\u6388\u8BFE\u5F62\u5F0F\u5C5E\u4E8E\u8F85\u52A9\u8BF4\u660E\uFF0C\u65B0\u751F\u62A5\u540D\u3001\u5B66\u5458\u8F6C\u73ED\u548C\u4E0A\u8BFE\u7BA1\u7406\u4F1A\u540C\u6B65\u8BFB\u53D6\u8FD9\u91CC\u7684\u73ED\u7EA7\u6570\u636E\u3002";
    if (classTypeLabel) classTypeLabel.textContent = "\u6388\u8BFE\u5F62\u5F0F\uFF08\u8F85\u52A9\uFF09";
    if (secondHeader) secondHeader.textContent = "\u6388\u8BFE\u5F62\u5F0F";
  }
}

function switchPage(pageName) {
  if (pageName !== "student" && typeof closeStudentDetail === "function") {
    closeStudentDetail(true);
  }
  currentPage = pageName;
  refs.menuItems.forEach((button) => button.classList.toggle("active", button.dataset.page === pageName));
  refs.contentPanels.forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${pageName}`));
  updateHeader();
  applyTeachingTerminology();
  if (pageName === "student") {
    renderStudents(refs.studentSearch.value || "");
  }
  if (pageName === "session") {
    renderSessionWorkspace();
  }
}

function setGroupExpanded(groupName, expanded) {
  const group = document.querySelector(`.menu-group[data-group="${groupName}"]`);
  if (!group) return;
  group.classList.toggle("collapsed", !expanded);
  const button = group.querySelector(".menu-parent");
  button?.classList.toggle("expanded", expanded);
}

function switchBusinessTab(tabName) {
  currentBusinessTab = tabName;
  const titleMap = {
    registration: "新生报名管理",
    retail: "教材零售",
    birthday: "学员生日",
    today: "今日办理"
  };
  refs.businessTabs.forEach((button) => button.classList.toggle("active", button.dataset.businessTab === tabName));
  refs.businessPanels.forEach((panel) => panel.classList.toggle("active", panel.id === `business-${tabName}`));
  refs.enrollmentSectionTitle.textContent = titleMap[tabName] || "新生报名管理";
}

function populateTeacherOptions(selectedTeacher = "") {
  const options = teachers.length > 0
    ? teachers.map((teacher) => `<option value="${teacher.name}" ${teacher.name === selectedTeacher ? "selected" : ""}>${teacher.name}</option>`).join("")
    : `<option value="">请先添加教师</option>`;
  refs.teacherSelect.innerHTML = options;
  refs.adjustTeacherSelect.innerHTML = options;
}

function populateCampusOptions(selectedCampus = "") {
  if (!refs.campusSelect) return;
  refs.campusSelect.innerHTML = campusOptions
    .filter((item) => item !== "鍏ㄩ儴鏍″尯")
    .map((item) => `<option value="${item}" ${item === selectedCampus ? "selected" : ""}>${item}</option>`)
    .join("");
}

function populateCourseOptions(selectedCourse = "") {
  const activeCourses = courses.filter((course) => isCourseEnabled(course));
  const selectedInactiveCourse = selectedCourse
    ? courses.find((course) => course.name === selectedCourse && !isCourseEnabled(course))
    : null;
  const selectableCourses = selectedInactiveCourse ? [...activeCourses, selectedInactiveCourse] : activeCourses;
  const options = selectableCourses.length > 0
    ? selectableCourses.map((course) => {
      const inactiveLabel = isCourseEnabled(course) ? "" : "（已停用）";
      return `<option value="${course.name}" ${course.name === selectedCourse ? "selected" : ""}>${course.name}${inactiveLabel}</option>`;
    }).join("")
    : `<option value="">请先创建课程类型</option>`;
  refs.courseSelect.innerHTML = options;
  refs.retailCourseInput.innerHTML = options;
  refs.todayCourseFilter.innerHTML = ["全部课程", ...courses.map((course) => course.name)].map((item) => `<option value="${item}">${item}</option>`).join("");
  refs.transactionCourseFilter.innerHTML = ["全部课程", ...courses.map((course) => course.name)].map((item) => `<option value="${item}">${item}</option>`).join("");
  refs.adjustCourseSelect.innerHTML = options;
}

function populateClassTypeOptions(selectedType = "") {
  refs.classTypeSelect.innerHTML = classTypeOptions.map((item) => `<option value="${item}" ${item === selectedType ? "selected" : ""}>${item}</option>`).join("");
}

function populateClassOptions(selectedClass = "") {
  const activeClasses = classes.filter((item) => isClassEnabled(item));
  const selectedInactiveClass = selectedClass
    ? classes.find((item) => item.name === selectedClass && !isClassEnabled(item))
    : null;
  const selectableClasses = selectedInactiveClass ? [...activeClasses, selectedInactiveClass] : activeClasses;
  const options = selectableClasses.length > 0
    ? selectableClasses.map((item) => {
      const inactiveLabel = isClassEnabled(item) ? "" : "（已停用）";
      return `<option value="${item.name}" ${item.name === selectedClass ? "selected" : ""}>${item.name} / ${item.type}${inactiveLabel}</option>`;
    }).join("")
    : `<option value="">请先创建班级</option>`;
  refs.classSelect.innerHTML = options;
  refs.adjustClassSelect.innerHTML = options;
}

function populatePackageOptions(selectedPackage = "") {
  refs.packageSelect.innerHTML = chargePackages.map((pkg) => `
    <option value="${pkg.name}" ${pkg.name === selectedPackage ? "selected" : ""}>${pkg.name} - ${pkg.hours}课时 - ${pkg.price}</option>
  `).join("");
  refs.renewalPackageSelect.innerHTML = chargePackages.map((pkg) => `
    <option value="${pkg.name}" ${pkg.name === selectedPackage ? "selected" : ""}>${pkg.name} - ${pkg.hours}课时 - ${pkg.price}</option>
  `).join("");
}

function populateRetailBaseOptions() {
  refs.retailCampusInput.innerHTML = campusOptions.filter((item) => item !== "全部校区").map((item) => `<option value="${item}">${item}</option>`).join("");
  refs.retailCategoryInput.innerHTML = retailCategoryOptions.map((item) => `<option value="${item}">${item}</option>`).join("");
  refs.transactionCampusFilter.innerHTML = campusOptions.map((item) => `<option value="${item}">${item}</option>`).join("");
  refs.transactionCategoryFilter.innerHTML = ["全部分类", "学费", ...retailCategoryOptions].map((item) => `<option value="${item}">${item}</option>`).join("");
}
