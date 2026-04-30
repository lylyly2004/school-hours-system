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

function getStudentRenewalLogs(record) {
  return Array.isArray(record.renewalLogs) ? record.renewalLogs : [];
}

function getStudentRecentSessions(record, limit = 5) {
  if (!record) return [];
  return sessionRecords
    .filter((session) => {
      const students = Array.isArray(session.students) ? session.students : [];
      return students.some((item) => Number(item.enrollmentId) === Number(record.id));
    })
    .slice(0, limit)
    .map((session) => {
      const students = Array.isArray(session.students) ? session.students : [];
      const matched = students.find((item) => Number(item.enrollmentId) === Number(record.id));
      return {
        date: session.date,
        teacherName: session.teacherName,
        className: session.className,
        deductedHours: Number(matched?.deductedHours || 0)
      };
    });
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null || amount === "") return "-";
  return `${amount}`;
}

function getStudentLogsHtml(logs) {
  if (!logs || logs.length === 0) return `<div class="detail-log-empty">暂无记录</div>`;
  return `
    <div class="change-log-list">
      ${logs.map((log) => `
        <div class="change-log-item">
          <strong>${log.date || log.effectiveDate || "-"}</strong><br>
          ${log.fromClass && log.toClass ? `<span>班级：${log.fromClass} → ${log.toClass}</span><br>` : ""}
          ${log.fromTeacher && log.toTeacher ? `<span>教师：${log.fromTeacher} → ${log.toTeacher}</span><br>` : ""}
          ${log.note ? `<span>备注：${log.note}</span><br>` : ""}
          ${log.amount !== undefined ? `<span>金额：${formatCurrency(log.amount)}</span>` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function getStudentRenewalHtml(record) {
  const logs = getStudentRenewalLogs(record);
  if (logs.length === 0) return `<div class="detail-log-empty">暂无续费记录</div>`;
  return `
    <div class="change-log-list">
      ${logs.map((log) => `
        <div class="change-log-item">
          <strong>${log.date || "-"}</strong><br>
          <span>课时包：${log.packageName || "-"}</span><br>
          <span>续费课时：${Number(log.packageHours || 0)}</span><br>
          <span>赠送课时：${Number(log.giftHours || 0)}</span><br>
          <span>实收金额：${formatCurrency(log.receivedAmount)}</span>
          ${log.note ? `<br><span>备注：${log.note}</span>` : ""}
        </div>
      `).join("")}
    </div>
  `;
}

function getStudentRecentSessionHtml(record) {
  const logs = getStudentRecentSessions(record);
  if (logs.length === 0) return `<div class="detail-log-empty">暂无上课记录</div>`;
  return `
    <div class="change-log-list">
      ${logs.map((log) => `
        <div class="change-log-item">
          <strong>${log.date || "-"}</strong><br>
          <span>班级：${log.className || "-"}</span><br>
          <span>教师：${log.teacherName || "-"}</span><br>
          <span>本次扣课：${Number(log.deductedHours || 0)} 课时</span>
        </div>
      `).join("")}
    </div>
  `;
}

function getStudentStatusMeta(record) {
  if (record.studentStatus === "paused") {
    return { label: "停课中", className: "status-warning" };
  }
  if (record.studentStatus === "refunded") {
    return { label: "已退费", className: "status-warning" };
  }
  return { label: "在读", className: "status-normal" };
}

function getStudentDetailHtml(record) {
  const totalHours = getEnrollmentTotalHours(record);
  const usedHours = getEnrollmentUsedHours(record);
  const remainingHours = getEnrollmentRemainingHours(record);
  const statusMeta = getStudentStatusMeta(record);

  return `
    <div class="record-detail-box student-detail-box">
      <div class="detail-summary-grid">
        <div class="detail-stat-card">
          <span>总课时</span>
          <strong>${totalHours}</strong>
        </div>
        <div class="detail-stat-card">
          <span>已上课时</span>
          <strong>${usedHours}</strong>
        </div>
        <div class="detail-stat-card">
          <span>剩余课时</span>
          <strong>${remainingHours}</strong>
        </div>
        <div class="detail-stat-card">
          <span>当前状态</span>
          <strong><span class="status-pill ${statusMeta.className}">${statusMeta.label}</span></strong>
        </div>
      </div>

      <div class="detail-section">
        <h4 class="detail-section-title">基础信息</h4>
        <div class="detail-info-grid">
          <div><strong>报名日期：</strong>${record.enrollDate || "-"}</div>
          <div><strong>学员姓名：</strong>${record.studentName || "-"}</div>
          <div><strong>家长姓名：</strong>${record.parentName || "-"}</div>
          <div><strong>联系电话：</strong>${record.parentPhone || "-"}</div>
          <div><strong>学员年龄：</strong>${record.studentAge || "-"}</div>
          <div><strong>出生日期：</strong>${record.birthMonth || "-"}</div>
          <div><strong>当前课程：</strong>${record.courseName || "-"}</div>
          <div><strong>当前班级：</strong>${record.className || "-"}</div>
          <div><strong>授课老师：</strong>${record.teacherName || "-"}</div>
          <div><strong>课时包：</strong>${record.packageName || "-"}</div>
          <div><strong>赠送课时：</strong>${Number(record.giftHoursTotal || 0)}</div>
          <div><strong>课时说明：</strong>${record.packageNote || "-"}</div>
        </div>
        <div><strong>备注事项：</strong>${record.remark || "-"}</div>
      </div>

      <div class="detail-section detail-two-column">
        <div>
          <h4 class="detail-section-title">最近上课记录</h4>
          ${getStudentRecentSessionHtml(record)}
        </div>
        <div>
          <h4 class="detail-section-title">续费记录</h4>
          ${getStudentRenewalHtml(record)}
        </div>
      </div>

      <div class="detail-section detail-two-column">
        <div>
          <h4 class="detail-section-title">转班记录</h4>
          ${getStudentLogsHtml(getStudentChangeLogs(record, "transfer"))}
        </div>
        <div>
          <h4 class="detail-section-title">换老师记录</h4>
          ${getStudentLogsHtml(getStudentChangeLogs(record, "teacher_change"))}
        </div>
      </div>

      <div class="detail-section detail-two-column">
        <div>
          <h4 class="detail-section-title">停课记录</h4>
          ${getStudentLogsHtml(getStudentLifecycleLogs(record, "paused"))}
        </div>
        <div>
          <h4 class="detail-section-title">退费记录</h4>
          ${getStudentLogsHtml(getStudentLifecycleLogs(record, "refunded"))}
        </div>
      </div>
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
    refs.studentTableBody.innerHTML = `<tr><td colspan="9">当前没有匹配的学员档案</td></tr>`;
    return;
  }

  refs.studentTableBody.innerHTML = filtered.map((record) => {
    const totalHours = getEnrollmentTotalHours(record);
    const remaining = getEnrollmentRemainingHours(record);
    const statusMeta = getStudentStatusMeta(record);
    return `
      <tr>
        <td>${record.studentName}</td>
        <td>${record.parentPhone || "-"}</td>
        <td>${record.courseName || "-"}</td>
        <td>${record.className || "-"}</td>
        <td>${record.teacherName || "-"}</td>
        <td>${totalHours}</td>
        <td>${remaining}</td>
        <td><span class="status-pill ${statusMeta.className}">${statusMeta.label}</span></td>
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
          ${getStudentDetailHtml(record)}
        </td>
      </tr>
    `;
  }).join("");
}

function openStudentAdjustModal(recordId, mode) {
  const record = enrollmentRecords.find((item) => Number(item.id) === Number(recordId));
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

  refs.studentAdjustTitle.textContent = mode === "class" ? "学员转班" : "学员换老师";
  openModal(refs.studentAdjustModal);
}

function saveStudentAdjust() {
  const target = enrollmentRecords.find((item) => Number(item.id) === Number(adjustingStudentId));
  if (!target) return;

  const effectiveDate = refs.adjustEffectiveDate.value;
  const nextClass = studentAdjustMode === "class" ? refs.adjustClassSelect.value : target.className;
  const nextTeacher = studentAdjustMode === "teacher" ? refs.adjustTeacherSelect.value : target.teacherName;
  const note = refs.adjustNoteInput.value.trim();

  if (!effectiveDate || !nextClass || !nextTeacher) {
    showToast("请完整填写调整信息。");
    return;
  }

  if (nextClass === target.className && nextTeacher === target.teacherName && !note) {
    showToast("当前没有检测到调整变化。");
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
    if (Number(record.id) !== Number(adjustingStudentId)) return record;
    return {
      ...record,
      className: nextClass,
      teacherName: nextTeacher,
      changeLogs: [...(Array.isArray(record.changeLogs) ? record.changeLogs : []), changeLog],
      remark: note
        ? [record.remark, `${effectiveDate}${changeType === "teacher_change" ? "换老师" : "转班"}：${note}`].filter(Boolean).join("；")
        : record.remark
    };
  });

  closeModal(refs.studentAdjustModal);
  renderStudents(refs.studentSearch.value || "");
  renderEnrollmentRecords();
  renderClasses(refs.classSearch?.value || "");
  renderRenewalList();
  renderSessionWorkspace();
  renderTodayRecords();
  showToast(changeType === "teacher_change" ? "学员换老师已保存。" : "学员转班已保存。");
}

function updateStudentLifecycle(recordId, nextStatus) {
  const target = enrollmentRecords.find((item) => Number(item.id) === Number(recordId));
  if (!target) return;
  if (target.studentStatus === nextStatus) {
    showToast(nextStatus === "paused" ? "该学员当前已经是停课状态。" : "当前状态未发生变化。");
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
      showToast("请输入正确的退费金额。");
      return;
    }
  }

  const note = window.prompt(`可选：填写${actionLabel}备注`, "") || "";

  enrollmentRecords = enrollmentRecords.map((record) => {
    if (Number(record.id) !== Number(recordId)) return record;
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
    showToast("学员已停课，课时已冻结，暂时不能记录上课。");
  } else if (nextStatus === "active") {
    showToast("学员已恢复上课，可以继续正常记录课时。");
  } else {
    showToast("学员已退费，剩余课时已清零，流水已同步。");
  }
}
