function renderCourseManagementList() {
  if (courses.length === 0) {
    refs.courseTableBody.innerHTML = `<tr><td colspan="2">当前还没有课程类型</td></tr>`;
    return;
  }

  refs.courseTableBody.innerHTML = courses.map((course) => {
    const enabled = isCourseEnabled(course);
    const statusLabel = enabled ? "启用中" : "已停用";
    const toggleLabel = enabled ? "停用" : "启用";
    const toggleClass = enabled ? "table-action-btn" : "table-edit-btn";
    return `
      <tr>
        <td>${course.name}<span class="table-note"> ${statusLabel}</span></td>
        <td>
          <button class="table-edit-btn" type="button" data-edit-course-id="${course.id}">修改</button>
          <button class="${toggleClass}" type="button" data-toggle-course-id="${course.id}">${toggleLabel}</button>
        </td>
      </tr>
    `;
  }).join("");
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
  return {
    summary,
    message: messages.length > 0 ? messages.join("、") : "当前没有业务数据在使用"
  };
}

function toggleCourseStatus(courseId) {
  const target = courses.find((item) => item.id === courseId);
  if (!target) return;

  const nextStatus = isCourseEnabled(target) ? "inactive" : "active";
  const actionLabel = nextStatus === "inactive" ? "停用" : "启用";
  const usageInfo = getCourseUsageSummary(target.name);

  if (!window.confirm(`确认${actionLabel}课程“${target.name}”吗？\n当前关联数据：${usageInfo.message}`)) {
    return;
  }

  courses = courses.map((item) => (
    item.id === courseId
      ? { ...item, status: nextStatus }
      : { ...item, status: item.status || "active" }
  ));

  populateCourseOptions(refs.courseSelect.value || "");
  renderCourseManagementList();
  renderTransactions();

  showToast(nextStatus === "inactive"
    ? "课程已停用，历史数据保留，新报名将不可再选择"
    : "课程已启用，可重新在新生报名中选择");
}
