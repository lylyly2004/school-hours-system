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

