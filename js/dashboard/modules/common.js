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

function switchPage(pageName) {
  if (pageName !== "student" && typeof closeStudentDetail === "function") {
    closeStudentDetail(true);
  }
  currentPage = pageName;
  refs.menuItems.forEach((button) => button.classList.toggle("active", button.dataset.page === pageName));
  refs.contentPanels.forEach((panel) => panel.classList.toggle("active", panel.id === `panel-${pageName}`));
  updateHeader();
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
