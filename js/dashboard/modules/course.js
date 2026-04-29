function renderCourseManagementList() {
  if (courses.length === 0) {
    refs.courseTableBody.innerHTML = `<tr><td colspan="2">当前还没有课程类型</td></tr>`;
    return;
  }
  refs.courseTableBody.innerHTML = courses.map((course) => `
    <tr>
      <td>${course.name}</td>
      <td>
        <button class="table-edit-btn" type="button" data-edit-course-id="${course.id}">修改</button>
        <button class="table-action-btn" type="button" data-delete-course-id="${course.id}">删除</button>
      </td>
    </tr>
  `).join("");
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
  return { summary, message: messages.length > 0 ? messages.join("、") : "当前没有业务数据在使用" };
}

function deleteCourse(courseId) {
  const target = courses.find((item) => item.id === courseId);
  if (!target) return;
  const usageInfo = getCourseUsageSummary(target.name);
  if (!window.confirm(`确认删除课程“${target.name}”吗？\n当前正在使用的位置：${usageInfo.message}`)) return;
  courses = courses.filter((item) => item.id !== courseId);
  populateCourseOptions(courses[0]?.name || "");
  renderCourseManagementList();
  showToast("课程已删除，历史记录中的原课程名称会保留");
}
