function renderCourseManagementList() {
  if (courses.length === 0) {
    refs.courseTableBody.innerHTML = `<tr><td colspan="2">\u5F53\u524D\u8FD8\u6CA1\u6709\u5B66\u79D1\u7C7B\u522B</td></tr>`;
    return;
  }

  refs.courseTableBody.innerHTML = courses.map((course) => {
    const enabled = isCourseEnabled(course);
    const statusLabel = enabled ? "\u542F\u7528\u4E2D" : "\u5DF2\u505C\u7528";
    const toggleLabel = enabled ? "\u505C\u7528" : "\u542F\u7528";
    const toggleClass = enabled ? "table-action-btn" : "table-edit-btn";
    return `
      <tr>
        <td>${course.name}<span class="table-note"> ${statusLabel}</span></td>
        <td>
          <button class="table-edit-btn" type="button" data-edit-course-id="${course.id}">\u4FEE\u6539</button>
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
  if (summary.enrollments) messages.push(`\u62A5\u540D\u8BB0\u5F55 ${summary.enrollments} \u6761`);
  if (summary.retail) messages.push(`\u96F6\u552E\u8BB0\u5F55 ${summary.retail} \u6761`);
  if (summary.transactions) messages.push(`\u6D41\u6C34 ${summary.transactions} \u6761`);
  if (summary.today) messages.push(`\u4ECA\u65E5\u529E\u7406 ${summary.today} \u6761`);
  return {
    summary,
    message: messages.length > 0 ? messages.join("\u3001") : "\u5F53\u524D\u6CA1\u6709\u4E1A\u52A1\u6570\u636E\u5728\u4F7F\u7528"
  };
}

function toggleCourseStatus(courseId) {
  const target = courses.find((item) => item.id === courseId);
  if (!target) return;

  const nextStatus = isCourseEnabled(target) ? "inactive" : "active";
  const actionLabel = nextStatus === "inactive" ? "\u505C\u7528" : "\u542F\u7528";
  const usageInfo = getCourseUsageSummary(target.name);

  if (!window.confirm(`\u786E\u8BA4${actionLabel}\u5B66\u79D1\u7C7B\u522B\u201C${target.name}\u201D\u5417\uFF1F\n\u5F53\u524D\u5173\u8054\u6570\u636E\uFF1A${usageInfo.message}`)) {
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
    ? "\u5B66\u79D1\u7C7B\u522B\u5DF2\u505C\u7528\uFF0C\u5386\u53F2\u6570\u636E\u4FDD\u7559\uFF0C\u65B0\u62A5\u540D\u5C06\u4E0D\u53EF\u518D\u9009\u62E9"
    : "\u5B66\u79D1\u7C7B\u522B\u5DF2\u542F\u7528\uFF0C\u53EF\u91CD\u65B0\u5728\u65B0\u751F\u62A5\u540D\u4E2D\u9009\u62E9");
}
