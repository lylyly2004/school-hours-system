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
    <button class="secondary-btn ${studentStatusFilter === "all" ? "active" : ""}" type="button" data-student-filter="all">\u5168\u90e8\u5b66\u5458</button>
    <button class="secondary-btn ${studentStatusFilter === "active" ? "active" : ""}" type="button" data-student-filter="active">\u5728\u8bfb\u5b66\u5458</button>
    <button class="secondary-btn ${studentStatusFilter === "paused" ? "active" : ""}" type="button" data-student-filter="paused">\u505c\u8bfe\u5b66\u5458</button>
    <button class="secondary-btn ${studentStatusFilter === "refunded" ? "active" : ""}" type="button" data-student-filter="refunded">\u9000\u8d39\u5b66\u5458</button>
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
  refs.resultCount.textContent = `${filtered.length} \u4f4d\u5b66\u5458`;
  renderStudentStatusFilters();

  if (filtered.length === 0) {
    refs.studentTableBody.innerHTML = `<tr><td colspan="9">\u5f53\u524d\u6ca1\u6709\u5339\u914d\u7684\u5b66\u5458\u6863\u6848</td></tr>`;
    return;
  }

  refs.studentTableBody.innerHTML = filtered.map((record) => {
    const totalHours = getEnrollmentTotalHours(record);
    const remaining = getEnrollmentRemainingHours(record);
    const statusLabel = record.studentStatus === "paused" ? "\u505c\u8bfe\u4e2d" : record.studentStatus === "refunded" ? "\u5df2\u9000\u8d39" : "\u5728\u8bfb";
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
