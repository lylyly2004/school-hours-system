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
  classSearch: document.getElementById("classSearch"),
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
  sessionPrevPageBtn: document.getElementById("sessionPrevPageBtn"),
  sessionNextPageBtn: document.getElementById("sessionNextPageBtn"),
  sessionPageInfo: document.getElementById("sessionPageInfo"),
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
