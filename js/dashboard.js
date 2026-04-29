/*
  Deprecated / frozen file.

  This file is no longer loaded by:
  C:\Users\LY\Documents\Codex\2026-04-24\html5-css3\pages\dashboard.html

  Active dashboard scripts now live in:
  C:\Users\LY\Documents\Codex\2026-04-24\html5-css3\js\dashboard\

  Maintenance rule:
  1. Do not continue feature development in this file.
  2. Only edit files under js/dashboard/core and js/dashboard/modules.
  3. Keep this file temporarily as a rollback reference until the new structure is fully stable.
*/

if (sessionStorage.getItem("school-admin-auth") !== "true") {
  window.location.href = "./login.html";
}

const pageMeta = {
  enrollment: { tag: "前台业务", title: "新生报名管理" },
  teacher: { tag: "教学管理", title: "教师管理" },
  course: { tag: "教学管理", title: "课程管理" },
  class: { tag: "教学管理", title: "班级管理" },
  student: { tag: "教学管理", title: "学员管理" },
  session: { tag: "教学管理", title: "上课管理" },
  charge: { tag: "教学管理", title: "收费模式" },
  transaction: { tag: "财务管理", title: "流水管理" }
};

const campusOptions = ["全部校区", "总部校区", "东城校区", "西城校区"];
const retailCategoryOptions = ["教材", "配件", "乐器", "学习用品"];

let chargePackages = [
  { id: 1, name: "课时包 24 节", hours: 24, price: 2880 },
  { id: 2, name: "课时包 48 节", hours: 48, price: 5280 },
  { id: 3, name: "季度班", hours: 36, price: 3600 }
];

let courses = [
  { id: 1, name: "古筝" },
  { id: 2, name: "琵琶" },
  { id: 3, name: "素描" },
  { id: 4, name: "声乐" }
];

let classTypeOptions = ["成人班", "少儿班", "1对1"];

let teachers = [
  { id: 1, name: "刘老师", nickname: "刘老师", subject: "古筝", phone: "13800010001" },
  { id: 2, name: "王老师", nickname: "王老师", subject: "琵琶", phone: "13800010002" },
  { id: 3, name: "陈老师", nickname: "陈老师", subject: "素描", phone: "13800010003" }
];

let classes = [
  { id: 1, name: "古筝成人班", type: "成人班" },
  { id: 2, name: "琵琶少儿班", type: "少儿班" },
  { id: 3, name: "素描 1对1", type: "1对1" }
];

let enrollmentRecords = [
  {
    id: 101,
    enrollDate: "2026-04-20",
    studentName: "许安然",
    parentName: "许妈妈",
    parentPhone: "13800000011",
    studentAge: "9",
    birthMonth: "2017-05-02",
    courseName: "古筝",
    className: "古筝成人班",
    teacherName: "刘老师",
    packageName: "课时包 24 节",
    paidHours: 24,
    giftHoursTotal: 2,
    packageNote: "开班活动赠送 2 课时",
    remark: "家长比较关注上课时间安排",
    studentStatus: "active",
    changeLogs: [],
    lifecycleLogs: [],
    renewalLogs: []
  },
  {
    id: 102,
    enrollDate: "2026-04-22",
    studentName: "沈佳怡",
    parentName: "沈爸爸",
    parentPhone: "13800000012",
    studentAge: "12",
    birthMonth: "2014-05-03",
    courseName: "琵琶",
    className: "琵琶少儿班",
    teacherName: "王老师",
    packageName: "季度班",
    paidHours: 36,
    giftHoursTotal: 0,
    packageNote: "",
    remark: "",
    studentStatus: "active",
    changeLogs: [],
    lifecycleLogs: [],
    renewalLogs: []
  },
  {
    id: 103,
    enrollDate: "2026-04-15",
    studentName: "李思彤",
    parentName: "李妈妈",
    parentPhone: "13800000013",
    studentAge: "10",
    birthMonth: "2016-05-01",
    courseName: "素描",
    className: "素描 1对1",
    teacherName: "陈老师",
    packageName: "课时包 24 节",
    paidHours: 24,
    giftHoursTotal: 0,
    packageNote: "",
    remark: "需要续费跟进",
    studentStatus: "active",
    changeLogs: [],
    lifecycleLogs: [],
    renewalLogs: []
  }
];

let retailRecords = [
  {
    id: 201,
    date: "2026-04-28",
    itemName: "古筝教材基础册",
    category: "教材",
    campus: "总部校区",
    course: "古筝",
    quantity: 2,
    unitPrice: 68,
    amount: 136,
    buyer: "许妈妈",
    paymentMethod: "微信",
    operator: "前台A",
    remark: "配套报名教材"
  },
  {
    id: 202,
    date: "2026-04-28",
    itemName: "琵琶指甲套装",
    category: "配件",
    campus: "东城校区",
    course: "琵琶",
    quantity: 1,
    unitPrice: 45,
    amount: 45,
    buyer: "沈爸爸",
    paymentMethod: "支付宝",
    operator: "前台B",
    remark: "课堂用品"
  }
];

let birthdayNotes = {
  "许安然": "准备生日卡片",
  "沈佳怡": "课堂祝福"
};

let todayRecords = [
  { id: 301, date: "2026-04-28", time: "09:30", item: "新生报名", target: "许安然", course: "古筝", status: "已完成" },
  { id: 302, date: "2026-04-28", time: "11:10", item: "教材购买", target: "李思彤", course: "素描", status: "已完成" },
  { id: 303, date: "2026-04-28", time: "15:00", item: "转班申请", target: "沈佳怡", course: "琵琶", status: "待确认" }
];

let sessionRecords = [
  {
    id: 401,
    date: "2026-04-24",
    teacherName: "刘老师",
    className: "古筝成人班",
    attendance: 1,
    hours: 1,
    students: [{ enrollmentId: 101, deductedHours: 1 }]
  },
  {
    id: 402,
    date: "2026-04-24",
    teacherName: "王老师",
    className: "琵琶少儿班",
    attendance: 1,
    hours: 1,
    students: [{ enrollmentId: 102, deductedHours: 1 }]
  },
  {
    id: 403,
    date: "2026-04-25",
    teacherName: "陈老师",
    className: "素描 1对1",
    attendance: 1,
    hours: 1,
    students: [{ enrollmentId: 103, deductedHours: 20 }]
  }
];

let transactions = [
  { id: 501, date: "2026-04-24", studentName: "李思彤", type: "续费", amount: 2880, note: "续费课时包 24 节", campus: "总部校区", course: "素描", category: "学费", itemName: "", sourceType: "renewal", sourceId: 103 },
  { id: 502, date: "2026-04-23", studentName: "沈佳怡", type: "报名", amount: 1280, note: "新生报名首期费用", campus: "东城校区", course: "琵琶", category: "学费", itemName: "", sourceType: "enrollment", sourceId: 102 },
  { id: 503, date: "2026-04-22", studentName: "许安然", type: "补课费", amount: 300, note: "单次补课费用", campus: "总部校区", course: "古筝", category: "学费", itemName: "", sourceType: "tuition", sourceId: 101 },
  { id: 504, date: "2026-04-28", studentName: "许妈妈", type: "教材零售", amount: 136, note: "古筝教材基础册，数量 2，收款方式：微信", campus: "总部校区", course: "古筝", category: "教材", itemName: "古筝教材基础册", sourceType: "retail", sourceId: 201 },
  { id: 505, date: "2026-04-28", studentName: "沈爸爸", type: "教材零售", amount: 45, note: "琵琶指甲套装，数量 1，收款方式：支付宝", campus: "东城校区", course: "琵琶", category: "配件", itemName: "琵琶指甲套装", sourceType: "retail", sourceId: 202 }
];

let currentPage = "student";
let currentBusinessTab = "registration";
let studentStatusFilter = "all";
let editingEnrollmentId = null;
let editingTeacherId = null;
let editingRetailId = null;
let editingCourseId = null;
let managementEditorMode = "";
let adjustingStudentId = null;
let studentAdjustMode = "class";
let renewingStudentId = null;
let selectedSessionTeacherName = "";
let selectedSessionClassName = "";
let selectedSessionStudentIds = [];

const refs = {
  pageTag: document.getElementById("pageTag"),
  pageTitle: document.getElementById("pageTitle"),
  topSearchBox: document.getElementById("topSearchBox"),
  studentSearch: document.getElementById("studentSearch"),
  logoutBtn: document.getElementById("logoutBtn"),
  toast: document.getElementById("toast"),
  menuParents: Array.from(document.querySelectorAll(".menu-parent")),
  menuItems: Array.from(document.querySelectorAll(".menu-item")),
  businessTabs: Array.from(document.querySelectorAll("[data-business-tab]")),
  businessPanels: Array.from(document.querySelectorAll(".business-panel")),
  contentPanels: Array.from(document.querySelectorAll(".content-panel")),
  studentTableBody: document.getElementById("studentTableBody"),
  resultCount: document.getElementById("resultCount"),
  studentTotalCount: document.getElementById("studentTotalCount"),
  studentClassCount: document.getElementById("studentClassCount"),
  studentBirthdayCount: document.getElementById("studentBirthdayCount"),
  studentStatusFilters: document.getElementById("studentStatusFilters"),
  viewRenewalBtn: document.getElementById("viewRenewalBtn"),
  openSessionManageBtn: document.getElementById("openSessionManageBtn"),
  renewalModal: document.getElementById("renewalModal"),
  renewalList: document.getElementById("renewalList"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  modalMask: document.getElementById("modalMask"),
  renewalFormModal: document.getElementById("renewalFormModal"),
  renewalFormModalMask: document.getElementById("renewalFormModalMask"),
  closeRenewalFormBtn: document.getElementById("closeRenewalFormBtn"),
  renewalFormTitle: document.getElementById("renewalFormTitle"),
  renewalStudentName: document.getElementById("renewalStudentName"),
  renewalCourseName: document.getElementById("renewalCourseName"),
  renewalPackageSelect: document.getElementById("renewalPackageSelect"),
  renewalGiftHoursInput: document.getElementById("renewalGiftHoursInput"),
  renewalReceivableInput: document.getElementById("renewalReceivableInput"),
  renewalDiscountMode: document.getElementById("renewalDiscountMode"),
  renewalDiscountRate: document.getElementById("renewalDiscountRate"),
  renewalDiscountAmount: document.getElementById("renewalDiscountAmount"),
  renewalDiscountRateField: document.getElementById("renewalDiscountRateField"),
  renewalDiscountAmountField: document.getElementById("renewalDiscountAmountField"),
  renewalReceivedInput: document.getElementById("renewalReceivedInput"),
  renewalNoteInput: document.getElementById("renewalNoteInput"),
  saveRenewalBtn: document.getElementById("saveRenewalBtn"),
  cancelRenewalBtn: document.getElementById("cancelRenewalBtn"),
  enrollmentSectionTitle: document.getElementById("enrollmentSectionTitle"),
  enrollDateInput: document.getElementById("enrollDateInput"),
  studentNameInput: document.getElementById("studentNameInput"),
  parentNameInput: document.getElementById("parentNameInput"),
  parentPhoneInput: document.getElementById("parentPhoneInput"),
  studentAgeInput: document.getElementById("studentAgeInput"),
  birthMonthInput: document.getElementById("birthMonthInput"),
  courseSelect: document.getElementById("courseSelect"),
  classSelect: document.getElementById("classSelect"),
  teacherSelect: document.getElementById("teacherSelect"),
  packageSelect: document.getElementById("packageSelect"),
  giftHoursInput: document.getElementById("giftHoursInput"),
  packageNoteInput: document.getElementById("packageNoteInput"),
  remarkInput: document.getElementById("remarkInput"),
  enrollmentEditHint: document.getElementById("enrollmentEditHint"),
  saveEnrollmentBtn: document.getElementById("saveEnrollmentBtn"),
  resetEnrollmentBtn: document.getElementById("resetEnrollmentBtn"),
  enrollmentCount: document.getElementById("enrollmentCount"),
  enrollmentTableBody: document.getElementById("enrollmentTableBody"),
  birthdayTableBody: document.getElementById("birthdayTableBody"),
  todayDateFilter: document.getElementById("todayDateFilter"),
  todayCourseFilter: document.getElementById("todayCourseFilter"),
  filterTodayBtn: document.getElementById("filterTodayBtn"),
  resetTodayBtn: document.getElementById("resetTodayBtn"),
  todayTableBody: document.getElementById("todayTableBody"),
  addRetailBtn: document.getElementById("addRetailBtn"),
  retailTableBody: document.getElementById("retailTableBody"),
  teacherSearch: document.getElementById("teacherSearch"),
  addTeacherBtn: document.getElementById("addTeacherBtn"),
  teacherListHead: document.getElementById("teacherListHead"),
  teacherCount: document.getElementById("teacherCount"),
  teacherEmptyState: document.getElementById("teacherEmptyState"),
  teacherCardList: document.getElementById("teacherCardList"),
  teacherModal: document.getElementById("teacherModal"),
  teacherModalMask: document.getElementById("teacherModalMask"),
  teacherFormTitle: document.getElementById("teacherFormTitle"),
  closeTeacherModalBtn: document.getElementById("closeTeacherModalBtn"),
  cancelTeacherBtn: document.getElementById("cancelTeacherBtn"),
  saveTeacherBtn: document.getElementById("saveTeacherBtn"),
  teacherName: document.getElementById("teacherName"),
  teacherNickname: document.getElementById("teacherNickname"),
  teacherSubject: document.getElementById("teacherSubject"),
  teacherPhone: document.getElementById("teacherPhone"),
  courseQuickAddBtn: document.getElementById("courseQuickAddBtn"),
  courseTableBody: document.getElementById("courseTableBody"),
  addClassTypeBtn: document.getElementById("addClassTypeBtn"),
  addClassBtn: document.getElementById("addClassBtn"),
  newClassInput: document.getElementById("newClassInput"),
  classTypeSelect: document.getElementById("classTypeSelect"),
  classTableBody: document.getElementById("classTableBody"),
  chooseTeacherBtn: document.getElementById("chooseTeacherBtn"),
  sessionTeacherDisplay: document.getElementById("sessionTeacherDisplay"),
  sessionAvailableClassCount: document.getElementById("sessionAvailableClassCount"),
  sessionPendingStudentCount: document.getElementById("sessionPendingStudentCount"),
  sessionClassTabs: document.getElementById("sessionClassTabs"),
  sessionStudentList: document.getElementById("sessionStudentList"),
  sessionSelectAllBtn: document.getElementById("sessionSelectAllBtn"),
  sessionResetBtn: document.getElementById("sessionResetBtn"),
  saveSessionBtn: document.getElementById("saveSessionBtn"),
  sessionRecordCount: document.getElementById("sessionRecordCount"),
  sessionTableBody: document.getElementById("sessionTableBody"),
  sessionTeacherModal: document.getElementById("sessionTeacherModal"),
  sessionTeacherMask: document.getElementById("sessionTeacherMask"),
  closeSessionTeacherModalBtn: document.getElementById("closeSessionTeacherModalBtn"),
  sessionTeacherList: document.getElementById("sessionTeacherList"),
  chargePackageList: document.getElementById("chargePackageList"),
  transactionDateFrom: document.getElementById("transactionDateFrom"),
  transactionDateTo: document.getElementById("transactionDateTo"),
  transactionCampusFilter: document.getElementById("transactionCampusFilter"),
  transactionCourseFilter: document.getElementById("transactionCourseFilter"),
  transactionCategoryFilter: document.getElementById("transactionCategoryFilter"),
  transactionStudentKeyword: document.getElementById("transactionStudentKeyword"),
  transactionItemKeyword: document.getElementById("transactionItemKeyword"),
  filterTransactionBtn: document.getElementById("filterTransactionBtn"),
  resetTransactionBtn: document.getElementById("resetTransactionBtn"),
  transactionTotalAmount: document.getElementById("transactionTotalAmount"),
  transactionTuitionAmount: document.getElementById("transactionTuitionAmount"),
  transactionRetailAmount: document.getElementById("transactionRetailAmount"),
  transactionOtherAmount: document.getElementById("transactionOtherAmount"),
  transactionTableBody: document.getElementById("transactionTableBody"),
  retailModal: document.getElementById("retailModal"),
  retailModalMask: document.getElementById("retailModalMask"),
  retailFormTitle: document.getElementById("retailFormTitle"),
  closeRetailModalBtn: document.getElementById("closeRetailModalBtn"),
  cancelRetailBtn: document.getElementById("cancelRetailBtn"),
  saveRetailBtn: document.getElementById("saveRetailBtn"),
  retailDateInput: document.getElementById("retailDateInput"),
  retailItemInput: document.getElementById("retailItemInput"),
  retailCategoryInput: document.getElementById("retailCategoryInput"),
  retailCampusInput: document.getElementById("retailCampusInput"),
  retailCourseInput: document.getElementById("retailCourseInput"),
  retailQuantityInput: document.getElementById("retailQuantityInput"),
  retailUnitPriceInput: document.getElementById("retailUnitPriceInput"),
  retailAmountInput: document.getElementById("retailAmountInput"),
  retailBuyerInput: document.getElementById("retailBuyerInput"),
  retailPaymentInput: document.getElementById("retailPaymentInput"),
  retailOperatorInput: document.getElementById("retailOperatorInput"),
  retailRemarkInput: document.getElementById("retailRemarkInput"),
  managementEditorModal: document.getElementById("managementEditorModal"),
  managementEditorMask: document.getElementById("managementEditorMask"),
  closeManagementEditorBtn: document.getElementById("closeManagementEditorBtn"),
  cancelManagementEditorBtn: document.getElementById("cancelManagementEditorBtn"),
  managementEditorTitle: document.getElementById("managementEditorTitle"),
  managementEditorHint: document.getElementById("managementEditorHint"),
  managementEditorLabel: document.getElementById("managementEditorLabel"),
  managementEditorInput: document.getElementById("managementEditorInput"),
  saveManagementEditorBtn: document.getElementById("saveManagementEditorBtn"),
  studentAdjustModal: document.getElementById("studentAdjustModal"),
  studentAdjustMask: document.getElementById("studentAdjustMask"),
  closeStudentAdjustBtn: document.getElementById("closeStudentAdjustBtn"),
  cancelStudentAdjustBtn: document.getElementById("cancelStudentAdjustBtn"),
  saveStudentAdjustBtn: document.getElementById("saveStudentAdjustBtn"),
  studentAdjustTitle: document.getElementById("studentAdjustTitle"),
  adjustStudentName: document.getElementById("adjustStudentName"),
  adjustCourseField: document.getElementById("adjustCourseField"),
  adjustClassField: document.getElementById("adjustClassField"),
  adjustTeacherField: document.getElementById("adjustTeacherField"),
  adjustCourseSelect: document.getElementById("adjustCourseSelect"),
  adjustClassSelect: document.getElementById("adjustClassSelect"),
  adjustTeacherSelect: document.getElementById("adjustTeacherSelect"),
  adjustEffectiveDate: document.getElementById("adjustEffectiveDate"),
  adjustNoteInput: document.getElementById("adjustNoteInput")
};

function showToast(message) {
  if (!refs.toast) return;
  refs.toast.textContent = message;
  refs.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    refs.toast.classList.add("hidden");
  }, 2200);
}

function uid() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function getTodayString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMoney(value) {
  return Number(value || 0).toFixed(0);
}

function findPackage(name) {
  return chargePackages.find((item) => item.name === name);
}

function getPackageHours(name) {
  return Number(findPackage(name)?.hours || 0);
}

function getPackagePrice(name) {
  return Number(findPackage(name)?.price || 0);
}

function isStudentActive(record) {
  return (record.studentStatus || "active") === "active";
}

function getEnrollmentUsedHours(record) {
  if (!record) return 0;
  return sessionRecords.reduce((total, session) => {
    const matched = Array.isArray(session.students)
      ? session.students.filter((item) => Number(item.enrollmentId) === Number(record.id))
      : [];
    return total + matched.reduce((sum, item) => sum + Number(item.deductedHours || 0), 0);
  }, 0);
}

function getEnrollmentTotalHours(record) {
  if (!record) return 0;
  return Number(record.paidHours || 0) + Number(record.giftHoursTotal || 0);
}

function getEnrollmentRemainingHours(record) {
  if (!record) return 0;
  if ((record.studentStatus || "active") === "refunded") return 0;
  const remaining = getEnrollmentTotalHours(record) - getEnrollmentUsedHours(record);
  return remaining > 0 ? remaining : 0;
}

function getTeacherMonthlyHours(teacherName) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  return sessionRecords.reduce((total, record) => {
    if (record.teacherName !== teacherName) return total;
    const recordDate = new Date(record.date);
    if (Number.isNaN(recordDate.getTime())) return total;
    if (recordDate.getFullYear() !== year || recordDate.getMonth() !== month) return total;
    return total + Number(record.hours || 0);
  }, 0);
}

function getCurrentClassTeacher(className) {
  const matchedTeachers = Array.from(new Set(
    enrollmentRecords
      .filter((record) => isStudentActive(record) && record.className === className)
      .map((record) => record.teacherName)
      .filter(Boolean)
  ));
  return matchedTeachers.length > 0 ? matchedTeachers.join(" / ") : "待分配";
}

function getCurrentClassStudentCount(className) {
  return enrollmentRecords.filter((record) => isStudentActive(record) && record.className === className).length;
}

function closeModal(modal) {
  modal?.classList.add("hidden");
}

function openModal(modal) {
  modal?.classList.remove("hidden");
}

function confirmDelete(label) {
  return window.confirm(`确认删除${label}吗？删除后将无法恢复。`);
}

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
  const options = courses.length > 0
    ? courses.map((course) => `<option value="${course.name}" ${course.name === selectedCourse ? "selected" : ""}>${course.name}</option>`).join("")
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
  const options = classes.length > 0
    ? classes.map((item) => `<option value="${item.name}" ${item.name === selectedClass ? "selected" : ""}>${item.name} / ${item.type}</option>`).join("")
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

function renderChargePackages() {
  refs.chargePackageList.innerHTML = chargePackages.map((pkg) => `
    <article class="pricing-card">
      <h4>${pkg.name}</h4>
      <strong>${pkg.hours} 课时</strong>
      <p>标准价格：${pkg.price}</p>
    </article>
  `).join("");
}

function renderCourseManagementList() {
  if (courses.length === 0) {
    refs.courseTableBody.innerHTML = `<tr><td colspan="2">当前还没有课程类型</td></tr>`;
    return;
  }
  refs.courseTableBody.innerHTML = courses.map((course) => `
    <tr>
      <td>${course.name}</td>
      <td>
        <button class="table-edit-btn" type="button" data-edit-course-id="${course.id}">修改</button>
        <button class="table-action-btn" type="button" data-delete-course-id="${course.id}">删除</button>
      </td>
    </tr>
  `).join("");
}

function renderClasses() {
  if (classes.length === 0) {
    refs.classTableBody.innerHTML = `<tr><td colspan="4">当前还没有班级</td></tr>`;
    return;
  }
  refs.classTableBody.innerHTML = classes.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.type}</td>
      <td>${getCurrentClassTeacher(item.name)}</td>
      <td>${getCurrentClassStudentCount(item.name)}</td>
    </tr>
  `).join("");
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

function renderRenewalDiscountRates() {
  const options = [`<option value="10">无折扣</option>`];
  for (let i = 99; i >= 10; i -= 1) {
    const value = (i / 10).toFixed(1);
    options.push(`<option value="${value}">${value}折</option>`);
  }
  refs.renewalDiscountRate.innerHTML = options.join("");
}

function updateRenewalDiscountMode() {
  const isDiscountMode = refs.renewalDiscountMode.value === "discount";
  refs.renewalDiscountRateField.classList.toggle("hidden", !isDiscountMode);
  refs.renewalDiscountAmountField.classList.toggle("hidden", isDiscountMode);
}

function calculateRenewalReceivedAmount() {
  const receivable = getPackagePrice(refs.renewalPackageSelect.value || "");
  refs.renewalReceivableInput.value = String(receivable);

  let result = receivable;
  if (refs.renewalDiscountMode.value === "discount") {
    const rate = Number(refs.renewalDiscountRate.value || 10);
    result = receivable * (rate / 10);
  } else {
    result = receivable - Number(refs.renewalDiscountAmount.value || 0);
  }
  result = result < 0 ? 0 : result;
  refs.renewalReceivedInput.value = result.toFixed(0);
}

function getRenewalStudentRecords() {
  return enrollmentRecords
    .filter((record) => isStudentActive(record) && getEnrollmentRemainingHours(record) <= 4)
    .sort((a, b) => getEnrollmentRemainingHours(a) - getEnrollmentRemainingHours(b));
}

function getRenewalPreviewRecords() {
  return [
    {
      id: "sample-1",
      studentName: "林若溪",
      parentPhone: "13800001231",
      courseName: "古筝",
      className: "古筝少儿提高班",
      teacherName: "刘老师",
      packageName: "课时包 24 节",
      remainingHours: 3,
      usedHours: 21,
      giftHours: 2,
      note: "建议本周内联系家长续费，避免影响下周正常排课。",
      sample: true
    },
    {
      id: "sample-2",
      studentName: "周子昊",
      parentPhone: "13800001232",
      courseName: "琵琶",
      className: "琵琶 1对1",
      teacherName: "王老师",
      packageName: "课时包 24 节",
      remainingHours: 4,
      usedHours: 22,
      giftHours: 0,
      note: "家长上次提过续费想走转账，可以前台提前确认付款方式。",
      sample: true
    },
    {
      id: "sample-3",
      studentName: "许星妍",
      parentPhone: "13800001233",
      courseName: "声乐",
      className: "声乐启蒙班",
      teacherName: "陈老师",
      packageName: "季度班",
      remainingHours: 2,
      usedHours: 34,
      giftHours: 0,
      note: "剩余课时较少，建议在本周最后一节课前完成续费提醒。",
      sample: true
    }
  ];
}

function renderRenewalList() {
  const actual = getRenewalStudentRecords();
  const displayRecords = actual.length > 0
    ? actual.map((record) => ({
        id: record.id,
        studentName: record.studentName,
        parentPhone: record.parentPhone,
        courseName: record.courseName,
        className: record.className,
        teacherName: record.teacherName,
        packageName: record.packageName,
        remainingHours: getEnrollmentRemainingHours(record),
        usedHours: getEnrollmentUsedHours(record),
        giftHours: record.giftHoursTotal || 0,
        note: record.remark || "建议前台尽快联系家长，确认后续续费安排。"
      }))
    : getRenewalPreviewRecords();

  refs.renewalList.innerHTML = displayRecords.map((record) => `
    <article class="renewal-item">
      <div>
        <h4>${record.studentName}${record.sample ? "（示例）" : ""}</h4>
        <p class="renewal-meta">
          <strong>联系电话：</strong>${record.parentPhone || "-"}<br>
          <strong>报名班级：</strong>${record.className || "-"}<br>
          <strong>报名课程：</strong>${record.courseName || "-"}<br>
          <strong>教师：</strong>${record.teacherName || "-"}<br>
          <strong>课时包：</strong>${record.packageName || "-"}<br>
          <strong>剩余课时：</strong>${record.remainingHours || 0}<br>
          <strong>已上课时：</strong>${record.usedHours || 0}<br>
          <strong>赠送课时：</strong>${record.giftHours || 0}
        </p>
      </div>
      <div class="renewal-card-actions">
        <button class="primary-btn" type="button" data-renew-student-id="${record.id}">续费</button>
      </div>
    </article>
  `).join("");
}

function resetRenewalForm() {
  renewingStudentId = null;
  refs.renewalFormTitle.textContent = "学员续费";
  refs.renewalStudentName.value = "";
  refs.renewalCourseName.value = "";
  refs.renewalGiftHoursInput.value = "0";
  refs.renewalDiscountMode.value = "discount";
  refs.renewalDiscountAmount.value = "0";
  refs.renewalNoteInput.value = "";
  populatePackageOptions(chargePackages[0]?.name || "");
  renderRenewalDiscountRates();
  updateRenewalDiscountMode();
  calculateRenewalReceivedAmount();
}

function openRenewalForm(recordId) {
  resetRenewalForm();
  const target = enrollmentRecords.find((item) => Number(item.id) === Number(recordId));
  const preview = getRenewalPreviewRecords().find((item) => item.id === recordId);
  const record = target || preview;
  if (!record) return;
  renewingStudentId = target ? target.id : null;
  refs.renewalFormTitle.textContent = `${record.studentName} 续费办理`;
  refs.renewalStudentName.value = record.studentName || "";
  refs.renewalCourseName.value = record.courseName || "";
  populatePackageOptions(record.packageName || chargePackages[0]?.name || "");
  calculateRenewalReceivedAmount();
  openModal(refs.renewalFormModal);
}

function saveRenewal() {
  if (!renewingStudentId) {
    showToast("当前是示例续费学员，先查看流程样式即可");
    closeModal(refs.renewalFormModal);
    return;
  }

  const target = enrollmentRecords.find((item) => item.id === renewingStudentId);
  if (!target) return;

  const packageName = refs.renewalPackageSelect.value;
  const packageHours = getPackageHours(packageName);
  const giftHours = Number(refs.renewalGiftHoursInput.value || 0);
  const receivedAmount = Number(refs.renewalReceivedInput.value || 0);
  const note = refs.renewalNoteInput.value.trim();
  const actionRecord = {
    date: getTodayString(),
    packageName,
    packageHours,
    giftHours,
    receivedAmount,
    note
  };

  enrollmentRecords = enrollmentRecords.map((record) => {
    if (record.id !== renewingStudentId) return record;
    const renewalLogs = Array.isArray(record.renewalLogs) ? record.renewalLogs : [];
    return {
      ...record,
      packageName,
      paidHours: Number(record.paidHours || 0) + packageHours,
      giftHoursTotal: Number(record.giftHoursTotal || 0) + giftHours,
      renewalLogs: [...renewalLogs, actionRecord],
      remark: note ? [record.remark, `${getTodayString()}续费备注：${note}`].filter(Boolean).join("；") : record.remark
    };
  });

  transactions.unshift({
    id: uid(),
    date: getTodayString(),
    studentName: target.studentName,
    type: "续费",
    amount: receivedAmount,
    note: `${packageName} 续费，赠送 ${giftHours} 课时`,
    campus: "总部校区",
    course: target.courseName,
    category: "学费",
    itemName: "",
    sourceType: "renewal",
    sourceId: renewingStudentId
  });

  closeModal(refs.renewalFormModal);
  renderStudents(refs.studentSearch.value || "");
  renderEnrollmentRecords();
  renderTransactions();
  renderRenewalList();
  showToast("续费已保存，学员课时和流水已同步更新");
}

function resetEnrollmentForm() {
  editingEnrollmentId = null;
  refs.enrollmentEditHint.textContent = "当前为新增报名状态，可直接填写后提交。";
  refs.saveEnrollmentBtn.textContent = "提交按钮";
  refs.enrollDateInput.value = getTodayString();
  refs.studentNameInput.value = "";
  refs.parentNameInput.value = "";
  refs.parentPhoneInput.value = "";
  refs.studentAgeInput.value = "";
  refs.birthMonthInput.value = "";
  populateCourseOptions(courses[0]?.name || "");
  populateClassOptions(classes[0]?.name || "");
  populateTeacherOptions(teachers[0]?.name || "");
  populatePackageOptions(chargePackages[0]?.name || "");
  refs.giftHoursInput.value = "0";
  refs.packageNoteInput.value = "";
  refs.remarkInput.value = "";
}

function syncEnrollmentToToday(record, type = "新生报名") {
  todayRecords.unshift({
    id: uid(),
    date: record.enrollDate || getTodayString(),
    time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }),
    item: type,
    target: record.studentName,
    course: record.courseName,
    status: "已完成"
  });
}

function renderEnrollmentRecords() {
  refs.enrollmentCount.textContent = `${enrollmentRecords.length} 条记录`;
  refs.enrollmentTableBody.innerHTML = enrollmentRecords.map((record) => `
    <tr>
      <td>${record.enrollDate || "-"}</td>
      <td>${record.studentName || "-"}</td>
      <td>${record.parentName || "-"}</td>
      <td>${record.courseName || "-"}</td>
      <td>${record.className || "-"}</td>
      <td>${record.packageName || "-"}</td>
      <td>${Number(record.giftHoursTotal || 0)} 课时</td>
      <td>${record.teacherName || "-"}</td>
      <td>
        <button class="table-edit-btn" type="button" data-edit-enrollment-id="${record.id}">编辑</button>
        <button class="table-detail-btn" type="button" data-detail-enrollment-id="${record.id}">详情</button>
        <button class="table-action-btn" type="button" data-delete-enrollment-id="${record.id}">删除</button>
      </td>
    </tr>
    <tr class="detail-row hidden" id="detail-row-${record.id}">
      <td colspan="9">
        <div class="record-detail-box">
          <div><strong>联系电话：</strong>${record.parentPhone || "-"}</div>
          <div><strong>学员年龄：</strong>${record.studentAge || "-"}</div>
          <div><strong>出生日期：</strong>${record.birthMonth || "-"}</div>
          <div><strong>课时说明：</strong>${record.packageNote || "-"}</div>
          <div><strong>备注事项：</strong>${record.remark || "-"}</div>
        </div>
      </td>
    </tr>
  `).join("");
}

function loadEnrollmentForEdit(recordId) {
  const record = enrollmentRecords.find((item) => item.id === recordId);
  if (!record) return;
  editingEnrollmentId = record.id;
  refs.enrollmentEditHint.textContent = `当前正在编辑：${record.studentName} 的报名记录，修改后点击“保存修改”。`;
  refs.saveEnrollmentBtn.textContent = "保存修改";
  refs.enrollDateInput.value = record.enrollDate || "";
  refs.studentNameInput.value = record.studentName || "";
  refs.parentNameInput.value = record.parentName || "";
  refs.parentPhoneInput.value = record.parentPhone || "";
  refs.studentAgeInput.value = record.studentAge || "";
  refs.birthMonthInput.value = record.birthMonth || "";
  populateCourseOptions(record.courseName || "");
  populateClassOptions(record.className || "");
  populateTeacherOptions(record.teacherName || "");
  populatePackageOptions(record.packageName || "");
  refs.giftHoursInput.value = String(record.giftHoursTotal || 0);
  refs.packageNoteInput.value = record.packageNote || "";
  refs.remarkInput.value = record.remark || "";
  switchPage("enrollment");
  switchBusinessTab("registration");
}

function saveEnrollment() {
  const isEditing = Boolean(editingEnrollmentId);
  const payload = {
    enrollDate: refs.enrollDateInput.value,
    studentName: refs.studentNameInput.value.trim(),
    parentName: refs.parentNameInput.value.trim(),
    parentPhone: refs.parentPhoneInput.value.trim(),
    studentAge: refs.studentAgeInput.value.trim(),
    birthMonth: refs.birthMonthInput.value,
    courseName: refs.courseSelect.value,
    className: refs.classSelect.value,
    teacherName: refs.teacherSelect.value,
    packageName: refs.packageSelect.value,
    paidHours: getPackageHours(refs.packageSelect.value),
    giftHoursTotal: Number(refs.giftHoursInput.value || 0),
    packageNote: refs.packageNoteInput.value.trim(),
    remark: refs.remarkInput.value.trim()
  };

  if (!payload.enrollDate || !payload.studentName || !payload.parentName || !payload.parentPhone || !payload.studentAge || !payload.birthMonth || !payload.courseName || !payload.className || !payload.teacherName || !payload.packageName) {
    showToast("请先完整填写新生报名的必填信息");
    return;
  }

  if (isEditing) {
    enrollmentRecords = enrollmentRecords.map((record) => record.id === editingEnrollmentId ? {
      ...record,
      ...payload
    } : record);
  } else {
    enrollmentRecords.unshift({
      id: uid(),
      studentStatus: "active",
      changeLogs: [],
      lifecycleLogs: [],
      renewalLogs: [],
      ...payload
    });
    syncEnrollmentToToday(payload, "新生报名");
  }

  resetEnrollmentForm();
  renderEnrollmentRecords();
  renderBirthdayRecords();
  renderStudents(refs.studentSearch.value || "");
  renderRenewalList();
  renderClasses();
  renderSessionWorkspace();
  renderTodayRecords();
  showToast(isEditing ? "报名记录已更新" : "新生报名已提交");
}

function getUpcomingBirthdayInfo(birthValue) {
  if (!birthValue) return null;
  const birthDate = new Date(birthValue);
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const diffDays = Math.round((nextBirthday - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0 || diffDays > 7) return null;
  return diffDays;
}

function formatBirthdayLabel(birthValue) {
  const birthDate = new Date(birthValue);
  if (Number.isNaN(birthDate.getTime())) return "-";
  return `${birthDate.getMonth() + 1}月${birthDate.getDate()}日`;
}

function renderBirthdayRecords() {
  const records = enrollmentRecords
    .filter((record) => isStudentActive(record))
    .map((record) => ({ ...record, diffDays: getUpcomingBirthdayInfo(record.birthMonth) }))
    .filter((record) => record.diffDays !== null)
    .sort((a, b) => a.diffDays - b.diffDays);

  if (records.length === 0) {
    refs.birthdayTableBody.innerHTML = `<tr><td colspan="5">当前没有未来 7 天内过生日的学员。</td></tr>`;
    return;
  }

  refs.birthdayTableBody.innerHTML = records.map((record) => `
    <tr>
      <td>${record.studentName}</td>
      <td>${formatBirthdayLabel(record.birthMonth)}${record.diffDays === 0 ? "（今天）" : `（${record.diffDays} 天后）`}</td>
      <td>${record.className || "-"}</td>
      <td>${birthdayNotes[record.studentName] || "-"}</td>
      <td><button class="table-detail-btn" type="button" data-birthday-note="${record.studentName}">添加备注</button></td>
    </tr>
  `).join("");
}

function resetRetailForm() {
  editingRetailId = null;
  refs.retailFormTitle.textContent = "新增零售";
  refs.saveRetailBtn.textContent = "保存记录";
  refs.retailDateInput.value = getTodayString();
  refs.retailItemInput.value = "";
  refs.retailQuantityInput.value = "1";
  refs.retailUnitPriceInput.value = "0";
  refs.retailAmountInput.value = "0";
  refs.retailBuyerInput.value = "";
  refs.retailPaymentInput.value = "";
  refs.retailOperatorInput.value = "";
  refs.retailRemarkInput.value = "";
  populateRetailBaseOptions();
  populateCourseOptions(courses[0]?.name || "");
}

function openRetailModal(recordId = null) {
  resetRetailForm();
  if (recordId) {
    const record = retailRecords.find((item) => item.id === recordId);
    if (!record) return;
    editingRetailId = record.id;
    refs.retailFormTitle.textContent = "编辑零售";
    refs.saveRetailBtn.textContent = "保存修改";
    refs.retailDateInput.value = record.date;
    refs.retailItemInput.value = record.itemName;
    refs.retailCategoryInput.value = record.category;
    refs.retailCampusInput.value = record.campus;
    refs.retailCourseInput.value = record.course;
    refs.retailQuantityInput.value = String(record.quantity);
    refs.retailUnitPriceInput.value = String(record.unitPrice);
    refs.retailAmountInput.value = String(record.amount);
    refs.retailBuyerInput.value = record.buyer;
    refs.retailPaymentInput.value = record.paymentMethod;
    refs.retailOperatorInput.value = record.operator;
    refs.retailRemarkInput.value = record.remark || "";
  }
  openModal(refs.retailModal);
}

function syncRetailTransaction(record) {
  transactions = transactions.filter((item) => !(item.sourceType === "retail" && item.sourceId === record.id));
  transactions.unshift({
    id: uid(),
    date: record.date,
    studentName: record.buyer,
    type: "教材零售",
    amount: Number(record.amount),
    note: `${record.itemName}，数量 ${record.quantity}，收款方式：${record.paymentMethod}`,
    campus: record.campus,
    course: record.course,
    category: record.category,
    itemName: record.itemName,
    sourceType: "retail",
    sourceId: record.id
  });
}

function syncRetailToday(record) {
  todayRecords.unshift({
    id: uid(),
    date: record.date,
    time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }),
    item: "教材购买",
    target: record.buyer,
    course: record.course,
    status: "已完成"
  });
}

function saveRetail() {
  const isEditing = Boolean(editingRetailId);
  const payload = {
    id: editingRetailId || uid(),
    date: refs.retailDateInput.value,
    itemName: refs.retailItemInput.value.trim(),
    category: refs.retailCategoryInput.value,
    campus: refs.retailCampusInput.value,
    course: refs.retailCourseInput.value,
    quantity: Number(refs.retailQuantityInput.value || 0),
    unitPrice: Number(refs.retailUnitPriceInput.value || 0),
    amount: Number(refs.retailAmountInput.value || 0) || Number(refs.retailQuantityInput.value || 0) * Number(refs.retailUnitPriceInput.value || 0),
    buyer: refs.retailBuyerInput.value.trim(),
    paymentMethod: refs.retailPaymentInput.value.trim(),
    operator: refs.retailOperatorInput.value.trim(),
    remark: refs.retailRemarkInput.value.trim()
  };

  if (!payload.date || !payload.itemName || !payload.quantity || !payload.unitPrice || !payload.buyer) {
    showToast("请完整填写零售信息");
    return;
  }

  if (isEditing) {
    retailRecords = retailRecords.map((item) => item.id === editingRetailId ? payload : item);
  } else {
    retailRecords.unshift(payload);
    syncRetailToday(payload);
  }

  syncRetailTransaction(payload);
  closeModal(refs.retailModal);
  renderRetailRecords();
  renderTransactions();
  renderTodayRecords();
  showToast(isEditing ? "零售记录已更新，并已同步流水" : "零售记录已保存，并已同步到流水");
}

function renderRetailRecords() {
  if (retailRecords.length === 0) {
    refs.retailTableBody.innerHTML = `<tr><td colspan="8">当前还没有零售记录。</td></tr>`;
    return;
  }
  refs.retailTableBody.innerHTML = retailRecords.map((record) => `
    <tr>
      <td>${record.date}</td>
      <td>${record.itemName}</td>
      <td>${record.category}</td>
      <td>${record.quantity}</td>
      <td>${record.unitPrice}</td>
      <td>${record.amount}</td>
      <td>${record.buyer}</td>
      <td>
        <button class="table-edit-btn" type="button" data-edit-retail-id="${record.id}">编辑</button>
        <button class="table-detail-btn" type="button" data-detail-retail-id="${record.id}">详情</button>
        <button class="table-action-btn" type="button" data-delete-retail-id="${record.id}">删除</button>
      </td>
    </tr>
    <tr class="detail-row hidden" id="retail-detail-row-${record.id}">
      <td colspan="8">
        <div class="record-detail-box">
          <div><strong>校区：</strong>${record.campus || "-"}</div>
          <div><strong>关联课程：</strong>${record.course || "-"}</div>
          <div><strong>收款方式：</strong>${record.paymentMethod || "-"}</div>
          <div><strong>经办人：</strong>${record.operator || "-"}</div>
          <div><strong>备注：</strong>${record.remark || "-"}</div>
        </div>
      </td>
    </tr>
  `).join("");
}

function getStudentChangeLogs(record, type) {
  const logs = Array.isArray(record.changeLogs) ? record.changeLogs : [];
  if (!type) return logs;
  return logs.filter((item) => item.changeType === type);
}

function getStudentLifecycleLogs(record, status) {
  const logs = Array.isArray(record.lifecycleLogs) ? record.lifecycleLogs : [];
  if (!status) return logs;
  return logs.filter((item) => item.status === status);
}

function getStudentLogsHtml(logs) {
  if (!logs || logs.length === 0) return "暂无记录";
  return `
    <div class="change-log-list">
      ${logs.map((log) => `
        <div class="change-log-item">
          <strong>${log.date || log.effectiveDate || "-"}</strong><br>
          ${log.fromClass && log.toClass ? `<span>班级：${log.fromClass} → ${log.toClass}</span><br>` : ""}
          ${log.fromTeacher && log.toTeacher ? `<span>教师：${log.fromTeacher} → ${log.toTeacher}</span><br>` : ""}
          ${log.note ? `<span>备注：${log.note}</span>` : ""}
          ${log.amount ? `<span>金额：${log.amount}</span>` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function renderStudentStatusFilters() {
  refs.studentStatusFilters.innerHTML = `
    <button class="secondary-btn ${studentStatusFilter === "all" ? "active" : ""}" type="button" data-student-filter="all">全部学员</button>
    <button class="secondary-btn ${studentStatusFilter === "active" ? "active" : ""}" type="button" data-student-filter="active">在读学员</button>
    <button class="secondary-btn ${studentStatusFilter === "paused" ? "active" : ""}" type="button" data-student-filter="paused">停课学员</button>
    <button class="secondary-btn ${studentStatusFilter === "refunded" ? "active" : ""}" type="button" data-student-filter="refunded">退费学员</button>
  `;
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
  refs.resultCount.textContent = `${filtered.length} 位学员`;
  renderStudentStatusFilters();

  if (filtered.length === 0) {
    refs.studentTableBody.innerHTML = `<tr><td colspan="9">当前没有匹配的学员档案。</td></tr>`;
    return;
  }

  refs.studentTableBody.innerHTML = filtered.map((record) => {
    const totalHours = getEnrollmentTotalHours(record);
    const remaining = getEnrollmentRemainingHours(record);
    const statusLabel = record.studentStatus === "paused" ? "停课中" : record.studentStatus === "refunded" ? "已退费" : "在读";
    const statusClass = record.studentStatus === "active" ? "status-normal" : "status-warning";
    return `
      <tr>
        <td>${record.studentName}</td>
        <td>${record.parentPhone || "-"}</td>
        <td>${record.courseName || "-"}</td>
        <td>${record.className || "-"}</td>
        <td>${record.teacherName || "-"}</td>
        <td>${totalHours}</td>
        <td>${remaining}</td>
        <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
        <td>
          <button class="table-detail-btn" type="button" data-detail-student-id="${record.id}">详情</button>
          <button class="table-shift-btn" type="button" data-transfer-student-id="${record.id}">转班</button>
          <button class="table-edit-btn" type="button" data-change-teacher-student-id="${record.id}">换老师</button>
          ${record.studentStatus === "paused"
            ? `<button class="table-pause-btn" type="button" data-resume-student-id="${record.id}">停课恢复</button>`
            : record.studentStatus === "active"
              ? `<button class="table-pause-btn" type="button" data-pause-student-id="${record.id}">停课</button>`
              : ""}
          ${record.studentStatus !== "refunded" ? `<button class="table-refund-btn" type="button" data-refund-student-id="${record.id}">退费</button>` : ""}
        </td>
      </tr>
      <tr class="detail-row hidden" id="student-detail-row-${record.id}">
        <td colspan="9">
          <div class="record-detail-box">
            <div><strong>报名日期：</strong>${record.enrollDate || "-"}</div>
            <div><strong>家长姓名：</strong>${record.parentName || "-"}</div>
            <div><strong>学员年龄：</strong>${record.studentAge || "-"}</div>
            <div><strong>出生日期：</strong>${record.birthMonth || "-"}</div>
            <div><strong>课时包：</strong>${record.packageName || "-"}</div>
            <div><strong>赠送课时：</strong>${record.giftHoursTotal || 0}</div>
            <div><strong>课时说明：</strong>${record.packageNote || "-"}</div>
            <div><strong>备注事项：</strong>${record.remark || "-"}</div>
            <div><strong>转班记录：</strong>${getStudentLogsHtml(getStudentChangeLogs(record, "transfer"))}</div>
            <div><strong>换老师记录：</strong>${getStudentLogsHtml(getStudentChangeLogs(record, "teacher_change"))}</div>
            <div><strong>停课记录：</strong>${getStudentLogsHtml(getStudentLifecycleLogs(record, "paused"))}</div>
            <div><strong>退费记录：</strong>${getStudentLogsHtml(getStudentLifecycleLogs(record, "refunded"))}</div>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function openStudentAdjustModal(recordId, mode) {
  const record = enrollmentRecords.find((item) => item.id === recordId);
  if (!record) return;
  adjustingStudentId = recordId;
  studentAdjustMode = mode;
  refs.adjustStudentName.textContent = `${record.studentName} / 当前：${record.className} / ${record.teacherName}`;
  refs.adjustEffectiveDate.value = getTodayString();
  refs.adjustNoteInput.value = "";
  populateCourseOptions(record.courseName);
  populateClassOptions(record.className);
  populateTeacherOptions(record.teacherName);

  refs.adjustCourseField.classList.add("hidden");
  refs.adjustClassField.classList.toggle("hidden", mode === "teacher");
  refs.adjustTeacherField.classList.toggle("hidden", mode === "class");

  if (mode === "class") {
    refs.studentAdjustTitle.textContent = "学员转班";
  } else {
    refs.studentAdjustTitle.textContent = "学员换老师";
  }

  openModal(refs.studentAdjustModal);
}

function saveStudentAdjust() {
  const target = enrollmentRecords.find((item) => item.id === adjustingStudentId);
  if (!target) return;

  const effectiveDate = refs.adjustEffectiveDate.value;
  const nextClass = studentAdjustMode === "class" ? refs.adjustClassSelect.value : target.className;
  const nextTeacher = studentAdjustMode === "teacher" ? refs.adjustTeacherSelect.value : target.teacherName;
  const note = refs.adjustNoteInput.value.trim();

  if (!effectiveDate || !nextClass || !nextTeacher) {
    showToast("请完整填写调整信息");
    return;
  }

  if (nextClass === target.className && nextTeacher === target.teacherName && !note) {
    showToast("当前没有检测到调整变化");
    return;
  }

  const changeType = studentAdjustMode === "teacher" ? "teacher_change" : "transfer";
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
    if (record.id !== adjustingStudentId) return record;
    return {
      ...record,
      className: nextClass,
      teacherName: nextTeacher,
      changeLogs: [...(Array.isArray(record.changeLogs) ? record.changeLogs : []), changeLog],
      remark: note ? [record.remark, `${effectiveDate}${changeType === "teacher_change" ? "换老师" : "转班"}：${note}`].filter(Boolean).join("；") : record.remark
    };
  });

  closeModal(refs.studentAdjustModal);
  renderStudents(refs.studentSearch.value || "");
  renderEnrollmentRecords();
  renderClasses();
  renderRenewalList();
  renderSessionWorkspace();
  renderTodayRecords();
  showToast(changeType === "teacher_change" ? "学员换老师已保存" : "学员转班已保存");
}

function updateStudentLifecycle(recordId, nextStatus) {
  const target = enrollmentRecords.find((item) => item.id === recordId);
  if (!target) return;
  if (target.studentStatus === nextStatus) {
    showToast(nextStatus === "paused" ? "该学员当前已经是停课状态" : "当前状态未发生变化");
    return;
  }

  const actionMap = {
    active: "停课恢复",
    paused: "停课",
    refunded: "退费"
  };
  const actionLabel = actionMap[nextStatus] || "状态调整";
  if (!window.confirm(`确认对 ${target.studentName} 执行${actionLabel}吗？历史上课记录会保留。`)) return;

  let refundAmount = 0;
  const remainingBeforeRefund = getEnrollmentRemainingHours(target);
  if (nextStatus === "refunded") {
    const input = window.prompt("请输入本次退费金额", "");
    if (input === null) return;
    refundAmount = Number(input);
    if (!Number.isFinite(refundAmount) || refundAmount < 0) {
      showToast("请输入正确的退费金额");
      return;
    }
  }

  const note = window.prompt(`可选：填写${actionLabel}备注`, "") || "";

  enrollmentRecords = enrollmentRecords.map((record) => {
    if (record.id !== recordId) return record;
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
      remark: note ? [record.remark, `${getTodayString()}${actionLabel}：${note}`].filter(Boolean).join("；") : record.remark
    };
  });

  if (nextStatus === "refunded") {
    transactions.unshift({
      id: uid(),
      date: getTodayString(),
      studentName: target.studentName,
      type: "退费",
      amount: -Math.abs(refundAmount),
      note: note || `学员退费，剩余课时 ${remainingBeforeRefund}`,
      campus: "总部校区",
      course: target.courseName || "",
      category: "学费",
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
    showToast("学员已停课，课时已冻结，暂时不能记录上课");
  } else if (nextStatus === "active") {
    showToast("学员已恢复上课，可以继续正常记录课时");
  } else {
    showToast("学员已退费，剩余课时已清零，流水已同步");
  }
}

function renderSessionTeacherPicker() {
  if (teachers.length === 0) {
    refs.sessionTeacherList.innerHTML = `<div class="teacher-empty-state"><h4>当前没有教师信息</h4><p>请先在教师管理中添加教师。</p></div>`;
    return;
  }
  refs.sessionTeacherList.innerHTML = teachers.map((teacher) => `
    <article class="renewal-item">
      <div>
        <h4>${teacher.name}</h4>
        <p class="renewal-meta">教授科目：${teacher.subject || "-"}<br>联系电话：${teacher.phone || "-"}</p>
      </div>
      <div class="renewal-card-actions">
        <button class="primary-btn" type="button" data-pick-session-teacher="${teacher.name}">选择</button>
      </div>
    </article>
  `).join("");
}

function getTeacherAvailableClasses(teacherName) {
  return Array.from(new Set(
    enrollmentRecords
      .filter((record) => isStudentActive(record) && record.teacherName === teacherName)
      .map((record) => record.className)
      .filter(Boolean)
  ));
}

function renderSessionClassTabs() {
  const classesForTeacher = selectedSessionTeacherName ? getTeacherAvailableClasses(selectedSessionTeacherName) : [];
  refs.sessionAvailableClassCount.textContent = String(classesForTeacher.length);

  if (classesForTeacher.length === 0) {
    refs.sessionClassTabs.innerHTML = "";
    selectedSessionClassName = "";
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
  const candidates = enrollmentRecords.filter((record) => {
    return isStudentActive(record)
      && record.teacherName === selectedSessionTeacherName
      && record.className === selectedSessionClassName;
  });

  if (candidates.length === 0) {
    refs.sessionStudentList.innerHTML = `<p class="session-empty-note">当前教师或班级下暂无可记录课时的学员。</p>`;
    refs.sessionPendingStudentCount.textContent = "0 / 0";
    return;
  }

  refs.sessionPendingStudentCount.textContent = `${selectedSessionStudentIds.length} / ${candidates.length}`;
  refs.sessionStudentList.innerHTML = candidates.map((record) => `
    <article class="session-student-card">
      <label>
        <input class="session-student-checkbox" type="checkbox" value="${record.id}" ${selectedSessionStudentIds.includes(record.id) ? "checked" : ""}>
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

function renderSessionRecords() {
  const filtered = selectedSessionTeacherName
    ? sessionRecords.filter((record) => record.teacherName === selectedSessionTeacherName)
    : [];

  refs.sessionRecordCount.textContent = `${filtered.length} 条记录`;
  if (filtered.length === 0) {
    refs.sessionTableBody.innerHTML = `<tr><td colspan="6">当前教师还没有上课记录。</td></tr>`;
    return;
  }

  refs.sessionTableBody.innerHTML = filtered.map((record) => {
    const names = record.students
      .map((item) => enrollmentRecords.find((row) => row.id === Number(item.enrollmentId))?.studentName)
      .filter(Boolean)
      .join("、");
    return `
      <tr>
        <td>${record.date}</td>
        <td>${record.teacherName}</td>
        <td>${record.className}</td>
        <td>${record.attendance}</td>
        <td>${names || "-"}</td>
        <td><button class="table-action-btn" type="button" data-delete-session-id="${record.id}">删除</button></td>
      </tr>
    `;
  }).join("");
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
  if (!selectedSessionTeacherName || !selectedSessionClassName || selectedSessionStudentIds.length === 0) {
    showToast("请先选择教师、班级并勾选学员");
    return;
  }

  const session = {
    id: uid(),
    date: getTodayString(),
    teacherName: selectedSessionTeacherName,
    className: selectedSessionClassName,
    attendance: selectedSessionStudentIds.length,
    hours: 1,
    students: selectedSessionStudentIds.map((id) => ({ enrollmentId: id, deductedHours: 1 }))
  };

  sessionRecords.unshift(session);
  selectedSessionStudentIds = [];
  renderSessionWorkspace();
  renderTeachers();
  renderStudents(refs.studentSearch.value || "");
  renderRenewalList();
  showToast("上课记录已保存");
}

function getFilteredTransactions() {
  return transactions.filter((record) => {
    const from = refs.transactionDateFrom.value;
    const to = refs.transactionDateTo.value;
    const campus = refs.transactionCampusFilter.value;
    const course = refs.transactionCourseFilter.value;
    const category = refs.transactionCategoryFilter.value;
    const studentKeyword = refs.transactionStudentKeyword.value.trim();
    const itemKeyword = refs.transactionItemKeyword.value.trim();

    if (from && record.date < from) return false;
    if (to && record.date > to) return false;
    if (campus && campus !== "全部校区" && record.campus !== campus) return false;
    if (course && course !== "全部课程" && record.course !== course) return false;
    if (category && category !== "全部分类" && record.category !== category) return false;
    if (studentKeyword && !String(record.studentName || "").includes(studentKeyword)) return false;
    if (itemKeyword && !String(record.itemName || "").includes(itemKeyword)) return false;
    return true;
  });
}

function renderTransactions() {
  const filtered = getFilteredTransactions();
  const total = filtered.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const tuition = filtered.filter((item) => item.category === "学费").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const retail = filtered.filter((item) => item.type === "教材零售").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const other = total - tuition - retail;

  refs.transactionTotalAmount.textContent = formatMoney(total);
  refs.transactionTuitionAmount.textContent = formatMoney(tuition);
  refs.transactionRetailAmount.textContent = formatMoney(retail);
  refs.transactionOtherAmount.textContent = formatMoney(other);

  if (filtered.length === 0) {
    refs.transactionTableBody.innerHTML = `<tr><td colspan="9">当前没有匹配的流水记录。</td></tr>`;
    return;
  }

  refs.transactionTableBody.innerHTML = filtered.map((record) => `
    <tr>
      <td>${record.date}</td>
      <td>${record.studentName || "-"}</td>
      <td>${record.type || "-"}</td>
      <td>${record.amount}</td>
      <td>${record.campus || "-"}</td>
      <td>${record.course || "-"}</td>
      <td>${record.category || "-"}</td>
      <td>${record.itemName || "-"}</td>
      <td>${record.note || "-"}</td>
    </tr>
  `).join("");
}

function renderTodayRecords() {
  const dateValue = refs.todayDateFilter.value;
  const courseValue = refs.todayCourseFilter.value;
  const filtered = todayRecords.filter((record) => {
    if (dateValue && record.date !== dateValue) return false;
    if (courseValue && courseValue !== "全部课程" && record.course !== courseValue) return false;
    return true;
  });

  if (filtered.length === 0) {
    refs.todayTableBody.innerHTML = `<tr><td colspan="6">当前没有匹配的办理记录。</td></tr>`;
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

function renameCourseAcrossSystem(oldName, newName) {
  enrollmentRecords = enrollmentRecords.map((record) => record.courseName === oldName ? { ...record, courseName: newName } : record);
  retailRecords = retailRecords.map((record) => record.course === oldName ? { ...record, course: newName } : record);
  transactions = transactions.map((record) => record.course === oldName ? { ...record, course: newName } : record);
  todayRecords = todayRecords.map((record) => record.course === oldName ? { ...record, course: newName } : record);
}

function getCourseUsageSummary(courseName) {
  const summary = {
    enrollments: enrollmentRecords.filter((item) => item.courseName === courseName).length,
    retail: retailRecords.filter((item) => item.course === courseName).length,
    transactions: transactions.filter((item) => item.course === courseName).length,
    today: todayRecords.filter((item) => item.course === courseName).length
  };
  const messages = [];
  if (summary.enrollments) messages.push(`报名记录 ${summary.enrollments} 条`);
  if (summary.retail) messages.push(`零售记录 ${summary.retail} 条`);
  if (summary.transactions) messages.push(`流水 ${summary.transactions} 条`);
  if (summary.today) messages.push(`今日办理 ${summary.today} 条`);
  return { summary, message: messages.length > 0 ? messages.join("、") : "当前没有业务数据在使用" };
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
    courses.unshift({ id: uid(), name: value });
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
    courses = courses.map((item) => item.id === editingCourseId ? { ...item, name: value } : item);
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
  closeManagementEditor();
  showToast("班级类型已添加");
}

function deleteCourse(courseId) {
  const target = courses.find((item) => item.id === courseId);
  if (!target) return;
  const usageInfo = getCourseUsageSummary(target.name);
  if (!window.confirm(`确认删除课程“${target.name}”吗？\n当前正在使用的位置：${usageInfo.message}`)) return;
  courses = courses.filter((item) => item.id !== courseId);
  populateCourseOptions(courses[0]?.name || "");
  renderCourseManagementList();
  showToast("课程已删除，历史记录中的原课程名称会保留");
}

function addClass() {
  const className = refs.newClassInput.value.trim();
  const classType = refs.classTypeSelect.value;
  if (!className) {
    showToast("请先填写班级名称");
    return;
  }
  if (!classType) {
    showToast("请先选择班级类型");
    return;
  }
  if (classes.some((item) => item.name === className)) {
    showToast("该班级名称已存在");
    return;
  }
  classes.unshift({
    id: uid(),
    name: className,
    type: classType
  });
  refs.newClassInput.value = "";
  populateClassOptions(className);
  renderClasses();
  showToast("班级已创建，可在新生报名中选择");
}

function getFilteredTodayRecords() {
  const dateValue = refs.todayDateFilter.value;
  const courseValue = refs.todayCourseFilter.value;
  return todayRecords.filter((record) => {
    if (dateValue && record.date !== dateValue) return false;
    if (courseValue && courseValue !== "全部课程" && record.course !== courseValue) return false;
    return true;
  });
}

function bindEvents() {
  refs.menuParents.forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.parent;
      const menuGroup = button.closest(".menu-group");
      const expanded = menuGroup ? menuGroup.classList.contains("collapsed") : false;
      setGroupExpanded(group, expanded);
    });
  });

  refs.menuItems.forEach((button) => {
    button.addEventListener("click", () => switchPage(button.dataset.page));
  });

  refs.businessTabs.forEach((button) => {
    button.addEventListener("click", () => switchBusinessTab(button.dataset.businessTab));
  });

  refs.studentSearch.addEventListener("input", () => {
    renderStudents(refs.studentSearch.value || "");
  });

  refs.teacherSearch.addEventListener("input", renderTeachers);

  refs.viewRenewalBtn.addEventListener("click", () => {
    renderRenewalList();
    openModal(refs.renewalModal);
  });
  refs.closeModalBtn.addEventListener("click", () => closeModal(refs.renewalModal));
  refs.modalMask.addEventListener("click", () => closeModal(refs.renewalModal));

  refs.openSessionManageBtn.addEventListener("click", () => switchPage("session"));
  refs.logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("school-admin-auth");
    window.location.href = "./login.html";
  });

  refs.addTeacherBtn.addEventListener("click", () => openTeacherModal());
  refs.closeTeacherModalBtn.addEventListener("click", () => closeModal(refs.teacherModal));
  refs.cancelTeacherBtn.addEventListener("click", () => closeModal(refs.teacherModal));
  refs.teacherModalMask.addEventListener("click", () => closeModal(refs.teacherModal));
  refs.saveTeacherBtn.addEventListener("click", saveTeacher);

  refs.courseQuickAddBtn.addEventListener("click", () => openManagementEditor("course-create"));
  refs.addClassTypeBtn.addEventListener("click", () => openManagementEditor("class-type-create"));
  refs.addClassBtn.addEventListener("click", addClass);

  refs.saveManagementEditorBtn.addEventListener("click", saveManagementEditor);
  refs.closeManagementEditorBtn.addEventListener("click", closeManagementEditor);
  refs.cancelManagementEditorBtn.addEventListener("click", closeManagementEditor);
  refs.managementEditorMask.addEventListener("click", closeManagementEditor);

  refs.saveEnrollmentBtn.addEventListener("click", saveEnrollment);
  refs.resetEnrollmentBtn.addEventListener("click", resetEnrollmentForm);

  refs.addRetailBtn.addEventListener("click", () => openRetailModal());
  refs.closeRetailModalBtn.addEventListener("click", () => closeModal(refs.retailModal));
  refs.cancelRetailBtn.addEventListener("click", () => closeModal(refs.retailModal));
  refs.retailModalMask.addEventListener("click", () => closeModal(refs.retailModal));
  refs.saveRetailBtn.addEventListener("click", saveRetail);
  refs.retailQuantityInput.addEventListener("input", () => {
    refs.retailAmountInput.value = String(Number(refs.retailQuantityInput.value || 0) * Number(refs.retailUnitPriceInput.value || 0));
  });
  refs.retailUnitPriceInput.addEventListener("input", () => {
    refs.retailAmountInput.value = String(Number(refs.retailQuantityInput.value || 0) * Number(refs.retailUnitPriceInput.value || 0));
  });

  refs.filterTodayBtn.addEventListener("click", renderTodayRecords);
  refs.resetTodayBtn.addEventListener("click", () => {
    refs.todayDateFilter.value = "";
    refs.todayCourseFilter.value = "全部课程";
    renderTodayRecords();
  });

  refs.filterTransactionBtn.addEventListener("click", renderTransactions);
  refs.resetTransactionBtn.addEventListener("click", () => {
    refs.transactionDateFrom.value = "";
    refs.transactionDateTo.value = "";
    refs.transactionCampusFilter.value = "全部校区";
    refs.transactionCourseFilter.value = "全部课程";
    refs.transactionCategoryFilter.value = "全部分类";
    refs.transactionStudentKeyword.value = "";
    refs.transactionItemKeyword.value = "";
    renderTransactions();
  });

  refs.renewalDiscountMode.addEventListener("change", () => {
    updateRenewalDiscountMode();
    calculateRenewalReceivedAmount();
  });
  refs.renewalDiscountRate.addEventListener("change", calculateRenewalReceivedAmount);
  refs.renewalDiscountAmount.addEventListener("input", calculateRenewalReceivedAmount);
  refs.renewalPackageSelect.addEventListener("change", calculateRenewalReceivedAmount);
  refs.saveRenewalBtn.addEventListener("click", saveRenewal);
  refs.cancelRenewalBtn.addEventListener("click", () => closeModal(refs.renewalFormModal));
  refs.closeRenewalFormBtn.addEventListener("click", () => closeModal(refs.renewalFormModal));
  refs.renewalFormModalMask.addEventListener("click", () => closeModal(refs.renewalFormModal));

  refs.chooseTeacherBtn.addEventListener("click", () => {
    renderSessionTeacherPicker();
    openModal(refs.sessionTeacherModal);
  });
  refs.closeSessionTeacherModalBtn.addEventListener("click", () => closeModal(refs.sessionTeacherModal));
  refs.sessionTeacherMask.addEventListener("click", () => closeModal(refs.sessionTeacherModal));
  refs.sessionSelectAllBtn.addEventListener("click", () => {
    const candidates = enrollmentRecords
      .filter((record) => isStudentActive(record) && record.teacherName === selectedSessionTeacherName && record.className === selectedSessionClassName)
      .map((record) => record.id);
    selectedSessionStudentIds = candidates;
    renderSessionStudents();
  });
  refs.sessionResetBtn.addEventListener("click", resetSessionSelection);
  refs.saveSessionBtn.addEventListener("click", saveSessionRecord);

  refs.studentStatusFilters.addEventListener("click", (event) => {
    const target = event.target.closest("[data-student-filter]");
    if (!target) return;
    studentStatusFilter = target.dataset.studentFilter;
    renderStudents(refs.studentSearch.value || "");
  });

  refs.studentTableBody.addEventListener("click", (event) => {
    const detailBtn = event.target.closest("[data-detail-student-id]");
    if (detailBtn) {
      document.getElementById(`student-detail-row-${detailBtn.dataset.detailStudentId}`)?.classList.toggle("hidden");
      return;
    }
    const transferBtn = event.target.closest("[data-transfer-student-id]");
    if (transferBtn) {
      openStudentAdjustModal(Number(transferBtn.dataset.transferStudentId), "class");
      return;
    }
    const changeTeacherBtn = event.target.closest("[data-change-teacher-student-id]");
    if (changeTeacherBtn) {
      openStudentAdjustModal(Number(changeTeacherBtn.dataset.changeTeacherStudentId), "teacher");
      return;
    }
    const pauseBtn = event.target.closest("[data-pause-student-id]");
    if (pauseBtn) {
      updateStudentLifecycle(Number(pauseBtn.dataset.pauseStudentId), "paused");
      return;
    }
    const resumeBtn = event.target.closest("[data-resume-student-id]");
    if (resumeBtn) {
      updateStudentLifecycle(Number(resumeBtn.dataset.resumeStudentId), "active");
      return;
    }
    const refundBtn = event.target.closest("[data-refund-student-id]");
    if (refundBtn) {
      updateStudentLifecycle(Number(refundBtn.dataset.refundStudentId), "refunded");
    }
  });

  refs.closeStudentAdjustBtn.addEventListener("click", () => closeModal(refs.studentAdjustModal));
  refs.cancelStudentAdjustBtn.addEventListener("click", () => closeModal(refs.studentAdjustModal));
  refs.studentAdjustMask.addEventListener("click", () => closeModal(refs.studentAdjustModal));
  refs.saveStudentAdjustBtn.addEventListener("click", saveStudentAdjust);

  refs.enrollmentTableBody.addEventListener("click", (event) => {
    const detailBtn = event.target.closest("[data-detail-enrollment-id]");
    if (detailBtn) {
      document.getElementById(`detail-row-${detailBtn.dataset.detailEnrollmentId}`)?.classList.toggle("hidden");
      return;
    }
    const editBtn = event.target.closest("[data-edit-enrollment-id]");
    if (editBtn) {
      loadEnrollmentForEdit(Number(editBtn.dataset.editEnrollmentId));
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-enrollment-id]");
    if (deleteBtn) {
      if (!confirmDelete("这条报名记录")) return;
      enrollmentRecords = enrollmentRecords.filter((item) => item.id !== Number(deleteBtn.dataset.deleteEnrollmentId));
      renderEnrollmentRecords();
      renderStudents(refs.studentSearch.value || "");
      renderBirthdayRecords();
      renderRenewalList();
      renderSessionWorkspace();
      showToast("报名记录已删除");
    }
  });

  refs.birthdayTableBody.addEventListener("click", (event) => {
    const noteBtn = event.target.closest("[data-birthday-note]");
    if (!noteBtn) return;
    const name = noteBtn.dataset.birthdayNote;
    const currentNote = birthdayNotes[name] || "";
    const nextNote = window.prompt(`为 ${name} 添加或修改生日备注：`, currentNote);
    if (nextNote === null) return;
    birthdayNotes[name] = nextNote.trim();
    renderBirthdayRecords();
    showToast("生日备注已更新");
  });

  refs.retailTableBody.addEventListener("click", (event) => {
    const detailBtn = event.target.closest("[data-detail-retail-id]");
    if (detailBtn) {
      document.getElementById(`retail-detail-row-${detailBtn.dataset.detailRetailId}`)?.classList.toggle("hidden");
      return;
    }
    const editBtn = event.target.closest("[data-edit-retail-id]");
    if (editBtn) {
      openRetailModal(Number(editBtn.dataset.editRetailId));
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-retail-id]");
    if (deleteBtn) {
      if (!window.confirm("确认删除这条零售记录吗？删除后会同步移除对应流水。")) return;
      const retailId = Number(deleteBtn.dataset.deleteRetailId);
      retailRecords = retailRecords.filter((item) => item.id !== retailId);
      transactions = transactions.filter((item) => !(item.sourceType === "retail" && item.sourceId === retailId));
      renderRetailRecords();
      renderTransactions();
      showToast("零售记录已删除，并已同步更新流水");
    }
  });

  refs.teacherCardList.addEventListener("click", (event) => {
    const editBtn = event.target.closest("[data-edit-teacher-id]");
    if (editBtn) {
      openTeacherModal(Number(editBtn.dataset.editTeacherId));
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-teacher-id]");
    if (deleteBtn) {
      if (!confirmDelete("这位教师")) return;
      const teacherId = Number(deleteBtn.dataset.deleteTeacherId);
      teachers = teachers.filter((item) => item.id !== teacherId);
      populateTeacherOptions(teachers[0]?.name || "");
      renderTeachers();
      renderSessionTeacherPicker();
      showToast("教师已删除");
    }
  });

  refs.courseTableBody.addEventListener("click", (event) => {
    const editBtn = event.target.closest("[data-edit-course-id]");
    if (editBtn) {
      const courseId = Number(editBtn.dataset.editCourseId);
      const course = courses.find((item) => item.id === courseId);
      if (course) {
        openManagementEditor("course-edit", { courseId, courseName: course.name });
      }
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-course-id]");
    if (deleteBtn) {
      deleteCourse(Number(deleteBtn.dataset.deleteCourseId));
    }
  });

  refs.sessionTeacherList.addEventListener("click", (event) => {
    const pickBtn = event.target.closest("[data-pick-session-teacher]");
    if (!pickBtn) return;
    selectSessionTeacher(pickBtn.dataset.pickSessionTeacher);
  });

  refs.sessionClassTabs.addEventListener("click", (event) => {
    const tabBtn = event.target.closest("[data-session-class]");
    if (!tabBtn) return;
    selectedSessionClassName = tabBtn.dataset.sessionClass;
    selectedSessionStudentIds = [];
    renderSessionWorkspace();
  });

  refs.sessionStudentList.addEventListener("change", (event) => {
    const checkbox = event.target.closest(".session-student-checkbox");
    if (!checkbox) return;
    const recordId = Number(checkbox.value);
    if (checkbox.checked) {
      if (!selectedSessionStudentIds.includes(recordId)) selectedSessionStudentIds.push(recordId);
    } else {
      selectedSessionStudentIds = selectedSessionStudentIds.filter((item) => item !== recordId);
    }
    renderSessionStudents();
  });

  refs.sessionTableBody.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest("[data-delete-session-id]");
    if (!deleteBtn) return;
    if (!confirmDelete("这条上课记录")) return;
    const sessionId = Number(deleteBtn.dataset.deleteSessionId);
    sessionRecords = sessionRecords.filter((item) => item.id !== sessionId);
    renderSessionWorkspace();
    renderTeachers();
    renderStudents(refs.studentSearch.value || "");
    renderRenewalList();
    showToast("上课记录已删除");
  });

  refs.renewalList.addEventListener("click", (event) => {
    const renewBtn = event.target.closest("[data-renew-student-id]");
    if (!renewBtn) return;
    openRenewalForm(renewBtn.dataset.renewStudentId);
  });
}

function init() {
  populateRetailBaseOptions();
  populateTeacherOptions(teachers[0]?.name || "");
  populateCourseOptions(courses[0]?.name || "");
  populateClassTypeOptions(classTypeOptions[0] || "");
  populateClassOptions(classes[0]?.name || "");
  populatePackageOptions(chargePackages[0]?.name || "");
  renderRenewalDiscountRates();
  updateRenewalDiscountMode();
  calculateRenewalReceivedAmount();
  resetEnrollmentForm();
  resetRetailForm();
  renderTeachers();
  renderCourseManagementList();
  renderClasses();
  renderEnrollmentRecords();
  renderBirthdayRecords();
  renderTodayRecords();
  renderRetailRecords();
  renderStudents("");
  renderRenewalList();
  renderSessionWorkspace();
  renderChargePackages();
  renderTransactions();
  renderSessionTeacherPicker();
  refs.todayDateFilter.value = getTodayString();
  refs.todayCourseFilter.value = "全部课程";
  updateHeader();
  bindEvents();
}

init();
