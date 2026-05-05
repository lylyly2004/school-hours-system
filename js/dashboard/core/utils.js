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

function isCourseEnabled(course) {
  return course?.status !== "inactive";
}

function isClassEnabled(classItem) {
  return classItem?.status !== "inactive";
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
  return matchedTeachers.length > 0 ? matchedTeachers.join(" / ") : "\u5F85\u5206\u914D";
}

function getCurrentClassStudentCount(className) {
  return enrollmentRecords.filter((record) => isStudentActive(record) && record.className === className).length;
}

function normalizeSharedData() {
  Object.assign(pageMeta, {
    enrollment: { tag: "\u524D\u53F0\u4E1A\u52A1", title: "\u65B0\u751F\u62A5\u540D\u7BA1\u7406" },
    teacher: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u6559\u5E08\u7BA1\u7406" },
    course: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u5B66\u79D1\u7BA1\u7406" },
    class: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u73ED\u7EA7\u7BA1\u7406" },
    student: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u5B66\u5458\u7BA1\u7406" },
    session: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u4E0A\u8BFE\u7BA1\u7406" },
    charge: { tag: "\u6559\u5B66\u7BA1\u7406", title: "\u6536\u8D39\u6A21\u5F0F" },
    transaction: { tag: "\u8D22\u52A1\u7BA1\u7406", title: "\u6D41\u6C34\u7BA1\u7406" }
  });

  campusOptions.splice(0, campusOptions.length, "\u5168\u90E8\u6821\u533A", "\u603B\u90E8\u6821\u533A");
  retailCategoryOptions.splice(0, retailCategoryOptions.length, "\u6559\u6750", "\u914D\u4EF6", "\u4E50\u5668", "\u5B66\u4E60\u7528\u54C1");

  const normalizedClassTypes = Array.isArray(classTypeOptions)
    ? classTypeOptions.filter(Boolean)
    : [];
  classTypeOptions = Array.from(new Set(normalizedClassTypes));
  if (classTypeOptions.length === 0) {
    classTypeOptions = ["1\u5BF91", "1\u5BF92", "\u5C0F\u7EC4\u8BFE", "\u73ED\u5236\u8BFE"];
  }

  chargePackages = Array.isArray(chargePackages)
    ? chargePackages.map((item) => ({
      ...item,
      hours: Number(item.hours || 0),
      price: Number(item.price || 0)
    }))
    : [];

  courses = Array.isArray(courses)
    ? courses.map((item) => ({
      ...item,
      status: item.status || "active"
    }))
    : [];

  teachers = Array.isArray(teachers)
    ? teachers.map((item) => ({
      ...item,
      nickname: item.nickname || item.name || "",
      subject: item.subject || "",
      phone: item.phone || ""
    }))
    : [];

  classes = Array.isArray(classes)
    ? classes.map((item) => ({
      ...item,
      status: item.status || "active"
    }))
    : [];

  enrollmentRecords = Array.isArray(enrollmentRecords)
    ? enrollmentRecords.map((record) => ({
      ...record,
      campus: record.campus || "\u603B\u90E8\u6821\u533A",
      studentStatus: record.studentStatus || "active",
      changeLogs: Array.isArray(record.changeLogs) ? record.changeLogs : [],
      lifecycleLogs: Array.isArray(record.lifecycleLogs) ? record.lifecycleLogs : [],
      renewalLogs: Array.isArray(record.renewalLogs) ? record.renewalLogs : []
    }))
    : [];

  retailRecords = Array.isArray(retailRecords)
    ? retailRecords.map((record) => ({
      ...record,
      campus: record.campus || "\u603B\u90E8\u6821\u533A",
      quantity: Number(record.quantity || 0),
      unitPrice: Number(record.unitPrice || 0),
      amount: Number(record.amount || 0)
    }))
    : [];

  birthdayNotes = birthdayNotes && typeof birthdayNotes === "object" ? birthdayNotes : {};

  todayRecords = Array.isArray(todayRecords) ? todayRecords : [];
  sessionRecords = Array.isArray(sessionRecords) ? sessionRecords : [];

  transactions = Array.isArray(transactions)
    ? transactions.map((record) => ({
      ...record,
      campus: record.campus || "\u603B\u90E8\u6821\u533A",
      amount: Number(record.amount || 0),
      category: record.category || "\u5B66\u8D39",
      itemName: record.itemName || ""
    }))
    : [];
}

function closeModal(modal) {
  modal?.classList.add("hidden");
}

function openModal(modal) {
  modal?.classList.remove("hidden");
}

function confirmDelete(label) {
  return window.confirm(`\u786E\u8BA4\u5220\u9664${label}\u5417\uFF1F\u5220\u9664\u540E\u5C06\u65E0\u6CD5\u6062\u590D\u3002`);
}
