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
  return matchedTeachers.length > 0 ? matchedTeachers.join(" / ") : "待分配";
}

function getCurrentClassStudentCount(className) {
  return enrollmentRecords.filter((record) => isStudentActive(record) && record.className === className).length;
}

function normalizeSharedData() {
  Object.assign(pageMeta, {
    enrollment: { tag: "前台业务", title: "新生报名管理" },
    teacher: { tag: "教学管理", title: "教师管理" },
    course: { tag: "教学管理", title: "课程管理" },
    class: { tag: "教学管理", title: "班级管理" },
    student: { tag: "教学管理", title: "学员管理" },
    session: { tag: "教学管理", title: "上课管理" },
    charge: { tag: "教学管理", title: "收费模式" },
    transaction: { tag: "财务管理", title: "流水管理" }
  });

  campusOptions.splice(0, campusOptions.length, "全部校区", "总部校区", "东城校区", "西城校区");
  retailCategoryOptions.splice(0, retailCategoryOptions.length, "教材", "配件", "乐器", "学习用品");
  classTypeOptions = ["成人班", "少儿班", "1对1"];

  chargePackages = [
    { id: 1, name: "课时包 24 节", hours: 24, price: 2880 },
    { id: 2, name: "课时包 48 节", hours: 48, price: 5280 },
    { id: 3, name: "季度班", hours: 36, price: 3600 }
  ];

  courses = [
    { id: 1, name: "古筝", status: "active" },
    { id: 2, name: "琵琶", status: "active" },
    { id: 3, name: "素描", status: "active" },
    { id: 4, name: "声乐", status: "active" },
    ...courses
      .filter((item) => ![1, 2, 3, 4].includes(Number(item.id)))
      .map((item) => ({ ...item, status: item.status || "active" }))
  ];

  teachers = [
    { id: 1, name: "刘老师", nickname: "刘老师", subject: "古筝", phone: "13800010001" },
    { id: 2, name: "王老师", nickname: "王老师", subject: "琵琶", phone: "13800010002" },
    { id: 3, name: "陈老师", nickname: "陈老师", subject: "素描", phone: "13800010003" },
    ...teachers.filter((item) => ![1, 2, 3].includes(Number(item.id)))
  ];

  classes = [
    { id: 1, name: "古筝成人班", type: "成人班", status: "active" },
    { id: 2, name: "琵琶少儿班", type: "少儿班", status: "active" },
    { id: 3, name: "素描 1对1", type: "1对1", status: "active" },
    ...classes
      .filter((item) => ![1, 2, 3].includes(Number(item.id)))
      .map((item) => ({ ...item, status: item.status || "active" }))
  ];

  enrollmentRecords = enrollmentRecords.map((record) => {
    if (Number(record.id) === 101) {
      return {
        ...record,
        studentName: "许安然",
        parentName: "许妈妈",
        courseName: "古筝",
        className: "古筝成人班",
        teacherName: "刘老师",
        packageName: "课时包 24 节",
        packageNote: "开班活动赠送 2 课时",
        remark: "家长比较关注上课时间安排"
      };
    }
    if (Number(record.id) === 102) {
      return {
        ...record,
        studentName: "沈佳怡",
        parentName: "沈爸爸",
        courseName: "琵琶",
        className: "琵琶少儿班",
        teacherName: "王老师",
        packageName: "季度班"
      };
    }
    if (Number(record.id) === 103) {
      return {
        ...record,
        studentName: "李思彤",
        parentName: "李妈妈",
        courseName: "素描",
        className: "素描 1对1",
        teacherName: "陈老师",
        packageName: "课时包 24 节",
        remark: "需要续费跟进"
      };
    }
    return record;
  });

  retailRecords = retailRecords.map((record) => {
    if (Number(record.id) === 201) {
      return {
        ...record,
        itemName: "古筝教材基础册",
        category: "教材",
        campus: "总部校区",
        course: "古筝",
        buyer: "许妈妈",
        paymentMethod: "微信",
        operator: "前台A",
        remark: "配套报名教材"
      };
    }
    if (Number(record.id) === 202) {
      return {
        ...record,
        itemName: "琵琶指甲套装",
        category: "配件",
        campus: "东城校区",
        course: "琵琶",
        buyer: "沈爸爸",
        paymentMethod: "支付宝",
        operator: "前台B",
        remark: "课堂用品"
      };
    }
    return record;
  });

  birthdayNotes = {
    许安然: "准备生日卡片",
    沈佳怡: "课堂祝福",
    ...birthdayNotes
  };

  todayRecords = todayRecords.map((record) => {
    if (Number(record.id) === 301) return { ...record, item: "新生报名", target: "许安然", course: "古筝", status: "已完成" };
    if (Number(record.id) === 302) return { ...record, item: "教材购买", target: "李思彤", course: "素描", status: "已完成" };
    if (Number(record.id) === 303) return { ...record, item: "转班申请", target: "沈佳怡", course: "琵琶", status: "待确认" };
    return record;
  });

  sessionRecords = sessionRecords.map((record) => {
    if (Number(record.id) === 401) return { ...record, teacherName: "刘老师", className: "古筝成人班" };
    if (Number(record.id) === 402) return { ...record, teacherName: "王老师", className: "琵琶少儿班" };
    if (Number(record.id) === 403) return { ...record, teacherName: "陈老师", className: "素描 1对1" };
    return record;
  });

  transactions = transactions.map((record) => {
    if (Number(record.id) === 501) {
      return { ...record, studentName: "李思彤", type: "续费", note: "续费课时包 24 节", campus: "总部校区", course: "素描", category: "学费", itemName: "" };
    }
    if (Number(record.id) === 502) {
      return { ...record, studentName: "沈佳怡", type: "报名", note: "新生报名首期费用", campus: "东城校区", course: "琵琶", category: "学费", itemName: "" };
    }
    if (Number(record.id) === 503) {
      return { ...record, studentName: "许安然", type: "补课费", note: "单次补课费用", campus: "总部校区", course: "古筝", category: "学费", itemName: "" };
    }
    if (Number(record.id) === 504) {
      return { ...record, studentName: "许妈妈", type: "教材零售", note: "古筝教材基础册，数量 2，收款方式：微信", campus: "总部校区", course: "古筝", category: "教材", itemName: "古筝教材基础册" };
    }
    if (Number(record.id) === 505) {
      return { ...record, studentName: "沈爸爸", type: "教材零售", note: "琵琶指甲套装，数量 1，收款方式：支付宝", campus: "东城校区", course: "琵琶", category: "配件", itemName: "琵琶指甲套装" };
    }
    return record;
  });
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
