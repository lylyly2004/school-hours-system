function getFilteredClasses(keyword = "") {
  const normalized = String(keyword || "").trim();
  if (!normalized) return classes;
  return classes.filter((item) => [
    item.name,
    item.type,
    getCurrentClassTeacher(item.name)
  ].some((value) => String(value || "").includes(normalized)));
}

function getClassActiveStudents(className) {
  return enrollmentRecords.filter((record) => isStudentActive(record) && record.className === className);
}

function getClassBlockingStudents(className) {
  return enrollmentRecords.filter((record) => (
    record.className === className && (record.studentStatus || "active") !== "refunded"
  ));
}

function getClassSessionCount(className) {
  return sessionRecords.filter((record) => record.className === className).length;
}

function canDeleteClass(item) {
  return getClassBlockingStudents(item.name).length === 0;
}

function canEditClass(item) {
  return getClassSessionCount(item.name) === 0;
}

function getClassEditBlockReason(item) {
  if (getClassSessionCount(item.name) > 0) {
    return "该班级已有上课记录";
  }
  return "";
}

function getClassDeleteBlockReason(item) {
  const blockingStudents = getClassBlockingStudents(item.name);
  if (blockingStudents.length > 0) {
    return "\u8BE5\u73ED\u7EA7\u8FD8\u6709\u5728\u8BFB\u6216\u505C\u8BFE\u5B66\u5458";
  }
  return "";
}

function getClassDetailHtml(item) {
  const teacherName = getCurrentClassTeacher(item.name);
  const activeStudents = getClassActiveStudents(item.name);
  const statusText = isClassEnabled(item) ? "\u542F\u7528\u4E2D" : "\u5DF2\u505C\u7528";

  return `
    <div class="record-detail-box">
      <div><strong>\u73ED\u7EA7\u540D\u79F0\uFF1A</strong>${item.name}</div>
      <div><strong>\u6388\u8BFE\u5F62\u5F0F\uFF1A</strong>${item.type || "-"}</div>
      <div><strong>\u5F53\u524D\u72B6\u6001\uFF1A</strong>${statusText}</div>
      <div><strong>\u5F53\u524D\u6388\u8BFE\u8001\u5E08\uFF1A</strong>${teacherName || "-"}</div>
      <div><strong>\u5728\u8BFB\u5B66\u5458\u4EBA\u6570\uFF1A</strong>${activeStudents.length}</div>
      <div><strong>\u5F53\u524D\u5728\u8BFB\u5B66\u5458\uFF1A</strong>${activeStudents.length > 0 ? activeStudents.map((record) => record.studentName).join("\u3001") : "\u6682\u65E0\u5728\u8BFB\u5B66\u5458"}</div>
    </div>
  `;
}

function renderClasses(keyword = "") {
  const filtered = getFilteredClasses(keyword);

  if (filtered.length === 0) {
    refs.classTableBody.innerHTML = `<tr><td colspan="6">\u5F53\u524D\u6CA1\u6709\u5339\u914D\u7684\u73ED\u7EA7\u6570\u636E</td></tr>`;
    return;
  }

  refs.classTableBody.innerHTML = filtered.map((item) => {
    const enabled = isClassEnabled(item);
    const statusLabel = enabled ? "\u542F\u7528\u4E2D" : "\u5DF2\u505C\u7528";
    const toggleLabel = enabled ? "\u505C\u7528" : "\u542F\u7528";
    const toggleClass = enabled ? "table-action-btn" : "table-edit-btn";
    const editable = canEditClass(item);
    const editBlockReason = getClassEditBlockReason(item);
    const deletable = canDeleteClass(item);
    const deleteBlockReason = getClassDeleteBlockReason(item);

    return `
      <tr>
        <td>${item.name}</td>
        <td>${item.type}</td>
        <td><span class="status-pill ${enabled ? "status-active" : "status-paused"}">${statusLabel}</span></td>
        <td>${getCurrentClassTeacher(item.name)}</td>
        <td>${getCurrentClassStudentCount(item.name)}</td>
        <td>
          <button class="table-detail-btn" type="button" data-detail-class-id="${item.id}">\u8BE6\u60C5</button>
          <button class="table-edit-btn ${editable ? "" : "disabled-btn"}" type="button" data-edit-class-id="${item.id}" data-edit-class-allowed="${editable ? "true" : "false"}" data-edit-class-reason="${editBlockReason}">\u7F16\u8F91</button>
          <button class="${toggleClass}" type="button" data-toggle-class-id="${item.id}">${toggleLabel}</button>
          <button class="table-refund-btn ${deletable ? "" : "disabled-btn"}" type="button" data-delete-class-id="${item.id}" data-delete-class-allowed="${deletable ? "true" : "false"}" data-delete-class-reason="${deleteBlockReason}">\u5220\u9664</button>
        </td>
      </tr>
      <tr class="detail-row hidden" id="class-detail-row-${item.id}">
        <td colspan="6">
          ${getClassDetailHtml(item)}
        </td>
      </tr>
    `;
  }).join("");
}

function addClass() {
  const className = refs.newClassInput.value.trim();
  const classType = refs.classTypeSelect.value;

  if (!className) {
    showToast("\u8BF7\u5148\u586B\u5199\u73ED\u7EA7\u540D\u79F0");
    return;
  }
  if (!classType) {
    showToast("\u8BF7\u5148\u9009\u62E9\u6388\u8BFE\u5F62\u5F0F");
    return;
  }
  if (classes.some((item) => item.name === className)) {
    showToast("\u8BE5\u73ED\u7EA7\u540D\u79F0\u5DF2\u5B58\u5728");
    return;
  }

  classes.unshift({
    id: uid(),
    name: className,
    type: classType,
    status: "active"
  });

  refs.newClassInput.value = "";
  populateClassOptions(className);
  renderClasses(refs.classSearch?.value || "");
  showToast("\u73ED\u7EA7\u5DF2\u521B\u5EFA\uFF0C\u53EF\u5728\u65B0\u751F\u62A5\u540D\u4E2D\u9009\u62E9");
}

function getClassUsageSummary(className) {
  const summary = {
    enrollments: enrollmentRecords.filter((item) => item.className === className).length,
    sessions: sessionRecords.filter((item) => item.className === className).length,
    blockingStudents: getClassBlockingStudents(className).length
  };
  const messages = [];
  if (summary.blockingStudents) messages.push(`\u5728\u8BFB/\u505C\u8BFE\u5B66\u5458 ${summary.blockingStudents} \u4F4D`);
  if (summary.enrollments) messages.push(`\u62A5\u540D\u8BB0\u5F55 ${summary.enrollments} \u6761`);
  if (summary.sessions) messages.push(`\u4E0A\u8BFE\u8BB0\u5F55 ${summary.sessions} \u6761`);
  return {
    summary,
    message: messages.length > 0 ? messages.join("\u3001") : "\u5F53\u524D\u6CA1\u6709\u4E1A\u52A1\u6570\u636E\u5728\u4F7F\u7528"
  };
}

function toggleClassStatus(classId) {
  const target = classes.find((item) => Number(item.id) === Number(classId));
  if (!target) return;

  const nextStatus = isClassEnabled(target) ? "inactive" : "active";
  const actionLabel = nextStatus === "inactive" ? "\u505C\u7528" : "\u542F\u7528";
  const usageInfo = getClassUsageSummary(target.name);

  if (!window.confirm(`\u786E\u8BA4${actionLabel}\u73ED\u7EA7\u201C${target.name}\u201D\u5417\uFF1F\n\u5F53\u524D\u5173\u8054\u6570\u636E\uFF1A${usageInfo.message}`)) {
    return;
  }

  classes = classes.map((item) => (
    Number(item.id) === Number(classId)
      ? { ...item, status: nextStatus }
      : { ...item, status: item.status || "active" }
  ));

  populateClassOptions(refs.classSelect?.value || "");
  renderClasses(refs.classSearch?.value || "");

  showToast(
    nextStatus === "inactive"
      ? "\u73ED\u7EA7\u5DF2\u505C\u7528\uFF0C\u5386\u53F2\u6570\u636E\u4FDD\u7559\uFF0C\u65B0\u62A5\u540D\u5C06\u4E0D\u53EF\u518D\u9009\u62E9"
      : "\u73ED\u7EA7\u5DF2\u542F\u7528\uFF0C\u53EF\u91CD\u65B0\u5728\u65B0\u751F\u62A5\u540D\u4E2D\u9009\u62E9"
  );
}

function deleteClass(classId) {
  const target = classes.find((item) => Number(item.id) === Number(classId));
  if (!target) return;

  const usageInfo = getClassUsageSummary(target.name);
  if (usageInfo.summary.blockingStudents > 0) {
    showToast("\u5F53\u524D\u73ED\u7EA7\u4ECD\u6709\u5728\u8BFB\u6216\u505C\u8BFE\u5B66\u5458\uFF0C\u4E0D\u5141\u8BB8\u5220\u9664");
    return;
  }

  if (!window.confirm(`\u786E\u8BA4\u5220\u9664\u73ED\u7EA7\u201C${target.name}\u201D\u5417\uFF1F\n\u53EF\u5220\u9664\u6761\u4EF6\u5DF2\u6EE1\u8DB3\u3002\n\u5F53\u524D\u5173\u8054\u6570\u636E\uFF1A${usageInfo.message}`)) {
    return;
  }

  classes = classes.filter((item) => Number(item.id) !== Number(classId));

  const nextSelectedClass = refs.classSelect?.value === target.name ? "" : (refs.classSelect?.value || "");
  populateClassOptions(nextSelectedClass);
  renderClasses(refs.classSearch?.value || "");
  if (typeof renderSessionWorkspace === "function") {
    renderSessionWorkspace();
  }
  if (typeof renderStudents === "function") {
    renderStudents(refs.studentSearch?.value || "");
  }

  showToast("\u73ED\u7EA7\u5DF2\u5220\u9664\u3002\u5386\u53F2\u62A5\u540D\u548C\u4E0A\u8BFE\u8BB0\u5F55\u4ECD\u4F1A\u4FDD\u7559\u539F\u73ED\u7EA7\u540D\u79F0\u4F5C\u4E3A\u8FFD\u6EAF\u3002");
}

function editClass(classId) {
  const target = classes.find((item) => Number(item.id) === Number(classId));
  if (!target) return;

  const sessionCount = getClassSessionCount(target.name);
  if (sessionCount > 0) {
    showToast("\u8BE5\u73ED\u7EA7\u5DF2\u6709\u4E0A\u8BFE\u8BB0\u5F55\uFF0C\u4E0D\u652F\u6301\u76F4\u63A5\u6539\u540D");
    return;
  }

  const nextNameRaw = window.prompt("\u8BF7\u8F93\u5165\u65B0\u7684\u73ED\u7EA7\u540D\u79F0", target.name);
  if (nextNameRaw === null) return;
  const nextName = String(nextNameRaw).trim();

  if (!nextName) {
    showToast("\u8BF7\u5148\u586B\u5199\u73ED\u7EA7\u540D\u79F0");
    return;
  }

  if (classes.some((item) => item.name === nextName && Number(item.id) !== Number(classId))) {
    showToast("\u8BE5\u73ED\u7EA7\u540D\u79F0\u5DF2\u5B58\u5728");
    return;
  }

  const previousName = target.name;

  classes = classes.map((item) => (
    Number(item.id) === Number(classId)
      ? { ...item, name: nextName }
      : item
  ));

  enrollmentRecords = enrollmentRecords.map((record) => (
    record.className === previousName
      ? { ...record, className: nextName }
      : record
  ));

  if (selectedSessionClassName === previousName) {
    selectedSessionClassName = nextName;
  }

  const currentSelectedClass = refs.classSelect?.value === previousName
    ? nextName
    : (refs.classSelect?.value || "");

  populateClassOptions(currentSelectedClass);
  renderClasses(refs.classSearch?.value || "");
  if (typeof renderStudents === "function") {
    renderStudents(refs.studentSearch?.value || "");
  }
  if (typeof renderEnrollmentRecords === "function") {
    renderEnrollmentRecords();
  }
  if (typeof renderBirthdayRecords === "function") {
    renderBirthdayRecords();
  }
  if (typeof renderTodayRecords === "function") {
    renderTodayRecords();
  }
  if (typeof renderRenewalList === "function") {
    renderRenewalList();
  }
  if (typeof renderSessionWorkspace === "function") {
    renderSessionWorkspace();
  }

  showToast("\u73ED\u7EA7\u540D\u79F0\u5DF2\u66F4\u65B0");
}
