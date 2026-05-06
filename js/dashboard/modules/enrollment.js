function getEnrollmentHistoryCount(recordId) {
  if (!recordId) return 0;
  return sessionRecords.reduce((count, session) => {
    const students = Array.isArray(session.students) ? session.students : [];
    return count + students.filter((item) => Number(item.enrollmentId) === Number(recordId)).length;
  }, 0);
}

function hasEnrollmentSessionHistory(recordId) {
  return getEnrollmentHistoryCount(recordId) > 0;
}

function setEnrollmentFieldLockState(isLocked) {
  refs.courseSelect.disabled = isLocked;
  refs.classSelect.disabled = isLocked;
  refs.teacherSelect.disabled = isLocked;
  refs.packageSelect.disabled = isLocked;
}

function getEnrollmentEditHint(record, isLocked) {
  if (!record) {
    return "\u5f53\u524d\u4e3a\u65b0\u589e\u62a5\u540d\u72b6\u6001\uff0c\u53ef\u76f4\u63a5\u586b\u5199\u540e\u63d0\u4ea4\u3002";
  }

  if (isLocked) {
    return `\u5f53\u524d\u6b63\u5728\u7f16\u8f91 ${record.studentName} \u7684\u62a5\u540d\u8bb0\u5f55\u3002\u8be5\u5b66\u5458\u5df2\u6709\u4e0a\u8bfe\u8bb0\u5f55\uff0c\u8bfe\u7a0b / \u73ed\u7ea7 / \u8001\u5e08 / \u8bfe\u65f6\u5305\u5df2\u9501\u5b9a\uff1b\u5982\u9700\u8c03\u6574\uff0c\u8bf7\u524d\u5f80\u5b66\u5458\u7ba1\u7406\u4f7f\u7528\u8f6c\u73ed\u6216\u6362\u8001\u5e08\u529f\u80fd\u3002`;
  }

  return `\u5f53\u524d\u6b63\u5728\u7f16\u8f91 ${record.studentName} \u7684\u62a5\u540d\u8bb0\u5f55\uff0c\u4fee\u6539\u540e\u70b9\u51fb\u201c\u4fdd\u5b58\u4fee\u6539\u201d\u3002`;
}

function refreshEnrollmentLinkedViews() {
  renderEnrollmentRecords();
  renderBirthdayRecords();
  renderStudents(refs.studentSearch.value || "");
  renderRenewalList();
  renderClasses(refs.classSearch?.value || "");
  renderSessionWorkspace();
  renderTodayRecords();
  renderTransactions();
}

function syncEnrollmentTransaction(record) {
  if (!record) return;

  const transactionPayload = {
    date: record.enrollmentPaidDate || record.enrollDate || getTodayString(),
    studentName: record.studentName || "",
    type: "\u62A5\u540D",
    amount: Number(record.enrollmentPaidAmount || getPackagePrice(record.enrollmentPackageId || record.enrollmentPackageName || record.packageId || record.packageName || "")),
    note: `${record.enrollmentPackageName || record.packageName || ""} \u62A5\u540D\u9996\u671F\u8D39\u7528`,
    campus: record.campus || "\u603B\u90E8\u6821\u533A",
    course: record.courseName || "",
    category: "\u5B66\u8D39",
    itemName: "",
    sourceType: "enrollment",
    sourceId: record.id
  };

  const matchedIndex = transactions.findIndex(
    (item) => item.sourceType === "enrollment" && Number(item.sourceId) === Number(record.id)
  );

  if (matchedIndex >= 0) {
    transactions[matchedIndex] = {
      ...transactions[matchedIndex],
      ...transactionPayload
    };
    return;
  }

  transactions.unshift({
    id: uid(),
    ...transactionPayload
  });
}

function resetEnrollmentForm() {
  editingEnrollmentId = null;
  setEnrollmentFieldLockState(false);
  refs.enrollmentEditHint.textContent = getEnrollmentEditHint(null, false);
  refs.saveEnrollmentBtn.textContent = "\u63d0\u4ea4\u6309\u94ae";
  refs.enrollDateInput.value = getTodayString();
  refs.studentNameInput.value = "";
  refs.parentNameInput.value = "";
  refs.parentPhoneInput.value = "";
  refs.studentAgeInput.value = "";
  refs.birthMonthInput.value = "";
  populateCampusOptions(campusOptions.find((item) => item !== "閸忋劑鍎撮弽鈥冲隘") || "");
  populateCourseOptions(courses.find((item) => isCourseEnabled(item))?.name || "");
  populateClassOptions(classes.find((item) => isClassEnabled(item))?.name || "");
  populateTeacherOptions(teachers[0]?.name || "");
  populatePackageOptions(String(chargePackages[0]?.id || ""));
  refs.giftHoursInput.value = "0";
  refs.packageNoteInput.value = "";
  refs.remarkInput.value = "";
}

function syncEnrollmentToToday(record, type = "\u65b0\u751f\u62a5\u540d") {
  todayRecords.unshift({
    id: uid(),
    date: record.enrollDate || getTodayString(),
    time: new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }),
    item: type,
    target: record.studentName,
    course: record.courseName,
    status: "\u5df2\u5b8c\u6210"
  });
}

function renderEnrollmentRecords() {
  refs.enrollmentCount.textContent = `${enrollmentRecords.length} \u6761\u8bb0\u5f55`;

  refs.enrollmentTableBody.innerHTML = enrollmentRecords.map((record) => `
    <tr>
      <td>${record.enrollDate || "-"}</td>
      <td>${record.studentName || "-"}</td>
      <td>${record.parentName || "-"}</td>
      <td>${record.courseName || "-"}</td>
      <td>${record.className || "-"}</td>
      <td>${record.packageName || "-"}</td>
      <td>${Number(record.giftHoursTotal || 0)} \u8bfe\u65f6</td>
      <td>${record.teacherName || "-"}</td>
      <td>
        <button class="table-edit-btn" type="button" data-edit-enrollment-id="${record.id}">\u7f16\u8f91</button>
        <button class="table-detail-btn" type="button" data-detail-enrollment-id="${record.id}">\u8be6\u60c5</button>
        <button class="table-action-btn" type="button" data-delete-enrollment-id="${record.id}">\u5220\u9664</button>
      </td>
    </tr>
    <tr class="detail-row hidden" id="detail-row-${record.id}">
      <td colspan="9">
        <div class="record-detail-box">
          <div><strong>\u8054\u7cfb\u7535\u8bdd\uff1a</strong>${record.parentPhone || "-"}</div>
          <div><strong>\u5b66\u5458\u5e74\u9f84\uff1a</strong>${record.studentAge || "-"}</div>
          <div><strong>\u51fa\u751f\u65e5\u671f\uff1a</strong>${record.birthMonth || "-"}</div>
          <div><strong>\u8bfe\u65f6\u8bf4\u660e\uff1a</strong>${record.packageNote || "-"}</div>
          <div><strong>\u5907\u6ce8\u4e8b\u9879\uff1a</strong>${record.remark || "-"}</div>
        </div>
      </td>
    </tr>
  `).join("");
}

function loadEnrollmentForEdit(recordId) {
  const record = enrollmentRecords.find((item) => Number(item.id) === Number(recordId));
  if (!record) return;

  const isLocked = hasEnrollmentSessionHistory(record.id);
  editingEnrollmentId = record.id;
  refs.enrollmentEditHint.textContent = getEnrollmentEditHint(record, isLocked);
  refs.saveEnrollmentBtn.textContent = "\u4fdd\u5b58\u4fee\u6539";
  refs.enrollDateInput.value = record.enrollDate || "";
  refs.studentNameInput.value = record.studentName || "";
  refs.parentNameInput.value = record.parentName || "";
  refs.parentPhoneInput.value = record.parentPhone || "";
  refs.studentAgeInput.value = record.studentAge || "";
  refs.birthMonthInput.value = record.birthMonth || "";
  populateCampusOptions(record.campus || campusOptions.find((item) => item !== "閸忋劑鍎撮弽鈥冲隘") || "");
  populateCourseOptions(record.courseName || "");
  populateClassOptions(record.className || "");
  populateTeacherOptions(record.teacherName || "");
  populatePackageOptions(record.packageId || record.packageName || "");
  refs.giftHoursInput.value = String(record.giftHoursTotal || 0);
  refs.packageNoteInput.value = record.packageNote || "";
  refs.remarkInput.value = record.remark || "";
  setEnrollmentFieldLockState(isLocked);
  switchPage("enrollment");
  switchBusinessTab("registration");
}

function saveEnrollment() {
  const isEditing = Boolean(editingEnrollmentId);
  const originalRecord = isEditing
    ? enrollmentRecords.find((record) => Number(record.id) === Number(editingEnrollmentId))
    : null;
  const isLocked = originalRecord ? hasEnrollmentSessionHistory(originalRecord.id) : false;
  const selectedPackage = findPackage(refs.packageSelect.value);

  const payload = {
    enrollDate: refs.enrollDateInput.value,
    studentName: refs.studentNameInput.value.trim(),
    parentName: refs.parentNameInput.value.trim(),
    parentPhone: refs.parentPhoneInput.value.trim(),
    studentAge: refs.studentAgeInput.value.trim(),
    birthMonth: refs.birthMonthInput.value,
    campus: refs.campusSelect.value,
    courseName: refs.courseSelect.value,
    className: refs.classSelect.value,
    teacherName: refs.teacherSelect.value,
    packageId: selectedPackage?.id || "",
    packageName: selectedPackage?.name || "",
    paidHours: getPackageHours(selectedPackage?.id || refs.packageSelect.value, selectedPackage?.name || ""),
    enrollmentPackageId: selectedPackage?.id || "",
    enrollmentPackageName: selectedPackage?.name || "",
    enrollmentPaidAmount: getPackagePrice(selectedPackage?.id || refs.packageSelect.value, selectedPackage?.name || ""),
    enrollmentPaidDate: refs.enrollDateInput.value,
    giftHoursTotal: Number(refs.giftHoursInput.value || 0),
    packageNote: refs.packageNoteInput.value.trim(),
    remark: refs.remarkInput.value.trim()
  };

  if (!payload.enrollDate || !payload.studentName || !payload.campus || !payload.courseName || !payload.className || !payload.teacherName || !payload.packageId) {
    showToast("\u8bf7\u5148\u5b8c\u6574\u586b\u5199\u65b0\u751f\u62a5\u540d\u7684\u5fc5\u586b\u4fe1\u606f");
    return;
  }

  if (isLocked && originalRecord) {
    payload.campus = originalRecord.campus || payload.campus;
    payload.courseName = originalRecord.courseName;
    payload.className = originalRecord.className;
    payload.teacherName = originalRecord.teacherName;
    payload.packageId = originalRecord.packageId || payload.packageId;
    payload.packageName = originalRecord.packageName;
    payload.paidHours = Number(originalRecord.paidHours || 0);
    payload.enrollmentPackageId = originalRecord.enrollmentPackageId || originalRecord.packageId || payload.enrollmentPackageId;
    payload.enrollmentPackageName = originalRecord.enrollmentPackageName || originalRecord.packageName;
    payload.enrollmentPaidAmount = Number(originalRecord.enrollmentPaidAmount ?? getPackagePrice(originalRecord.enrollmentPackageId || originalRecord.enrollmentPackageName || originalRecord.packageId || originalRecord.packageName || ""));
    payload.enrollmentPaidDate = originalRecord.enrollmentPaidDate || originalRecord.enrollDate;
  }

  const selectedCourse = courses.find((item) => item.name === payload.courseName);
  const selectedClass = classes.find((item) => item.name === payload.className);
  if (selectedCourse && !isCourseEnabled(selectedCourse)) {
    showToast("\u5f53\u524d\u6240\u9009\u8bfe\u7a0b\u5df2\u505c\u7528\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9\u8bfe\u7a0b");
    return;
  }
  if (selectedClass && !isClassEnabled(selectedClass)) {
    showToast("\u5f53\u524d\u6240\u9009\u73ed\u7ea7\u5df2\u505c\u7528\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9\u73ed\u7ea7");
    return;
  }

  if (isEditing) {
    enrollmentRecords = enrollmentRecords.map((record) => (
      Number(record.id) === Number(editingEnrollmentId)
        ? {
          ...record,
          ...payload,
          enrollmentPackageId: isLocked ? payload.enrollmentPackageId : payload.packageId,
          enrollmentPackageName: isLocked ? payload.enrollmentPackageName : payload.packageName,
          enrollmentPaidAmount: isLocked ? payload.enrollmentPaidAmount : getPackagePrice(payload.packageId || payload.packageName || ""),
          enrollmentPaidDate: isLocked ? payload.enrollmentPaidDate : payload.enrollDate
        }
        : record
    ));
    const updatedRecord = enrollmentRecords.find((record) => Number(record.id) === Number(editingEnrollmentId));
    syncEnrollmentTransaction(updatedRecord);
  } else {
    const newRecord = {
      id: uid(),
      studentStatus: "active",
      changeLogs: [],
      lifecycleLogs: [],
      renewalLogs: [],
      ...payload
    };
    enrollmentRecords.unshift(newRecord);
    syncEnrollmentToToday(newRecord, "\u65b0\u751F\u62A5\u540D");
    syncEnrollmentTransaction(newRecord);
  }

  resetEnrollmentForm();
  refreshEnrollmentLinkedViews();
  showToast(isEditing ? "\u62a5\u540d\u8bb0\u5f55\u5df2\u66f4\u65b0\uff0c\u5b66\u5458\u6863\u6848\u5df2\u540c\u6b65" : "\u65b0\u751f\u62a5\u540d\u5df2\u63d0\u4ea4\uff0c\u5b66\u5458\u6863\u6848\u5df2\u540c\u6b65");
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
  return `${birthDate.getMonth() + 1}\u6708${birthDate.getDate()}\u65e5`;
}

function renderBirthdayRecords() {
  const records = enrollmentRecords
    .filter((record) => isStudentActive(record))
    .map((record) => ({ ...record, diffDays: getUpcomingBirthdayInfo(record.birthMonth) }))
    .filter((record) => record.diffDays !== null)
    .sort((a, b) => a.diffDays - b.diffDays);

  if (records.length === 0) {
    refs.birthdayTableBody.innerHTML = `<tr><td colspan="5">\u5f53\u524d\u6ca1\u6709\u672a\u6765 7 \u5929\u5185\u8fc7\u751f\u65e5\u7684\u5b66\u5458\u3002</td></tr>`;
    return;
  }

  refs.birthdayTableBody.innerHTML = records.map((record) => `
    <tr>
      <td>${record.studentName}</td>
      <td>${formatBirthdayLabel(record.birthMonth)}${record.diffDays === 0 ? "\uff08\u4eca\u5929\uff09" : `\uff08${record.diffDays} \u5929\u540e\uff09`}</td>
      <td>${record.className || "-"}</td>
      <td>${birthdayNotes[record.studentName] || "-"}</td>
      <td><button class="table-detail-btn" type="button" data-birthday-note="${record.studentName}">\u6dfb\u52a0\u5907\u6ce8</button></td>
    </tr>
  `).join("");
}