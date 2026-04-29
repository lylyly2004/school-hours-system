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

