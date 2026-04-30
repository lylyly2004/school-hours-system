function getFilteredClasses(keyword = "") {
  const normalized = String(keyword || "").trim();
  if (!normalized) return classes;
  return classes.filter((item) => [
    item.name,
    item.type,
    getCurrentClassTeacher(item.name)
  ].some((value) => String(value || "").includes(normalized)));
}

function renderClasses(keyword = "") {
  const filtered = getFilteredClasses(keyword);

  if (filtered.length === 0) {
    refs.classTableBody.innerHTML = `<tr><td colspan="6">当前没有匹配的班级数据</td></tr>`;
    return;
  }

  refs.classTableBody.innerHTML = filtered.map((item) => {
    const enabled = isClassEnabled(item);
    const statusLabel = enabled ? "启用中" : "已停用";
    const toggleLabel = enabled ? "停用" : "启用";
    const toggleClass = enabled ? "table-action-btn" : "table-edit-btn";

    return `
      <tr>
        <td>${item.name}</td>
        <td>${item.type}</td>
        <td><span class="status-pill ${enabled ? "status-active" : "status-paused"}">${statusLabel}</span></td>
        <td>${getCurrentClassTeacher(item.name)}</td>
        <td>${getCurrentClassStudentCount(item.name)}</td>
        <td>
          <button class="${toggleClass}" type="button" data-toggle-class-id="${item.id}">${toggleLabel}</button>
        </td>
      </tr>
    `;
  }).join("");
}

function addClass() {
  const className = refs.newClassInput.value.trim();
  const classType = refs.classTypeSelect.value;

  if (!className) {
    showToast("请先填写班级名称");
    return;
  }
  if (!classType) {
    showToast("请先选择班级类型");
    return;
  }
  if (classes.some((item) => item.name === className)) {
    showToast("该班级名称已存在");
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
  showToast("班级已创建，可在新生报名中选择");
}

function getClassUsageSummary(className) {
  const summary = {
    enrollments: enrollmentRecords.filter((item) => item.className === className).length,
    sessions: sessionRecords.filter((item) => item.className === className).length
  };
  const messages = [];
  if (summary.enrollments) messages.push(`报名记录 ${summary.enrollments} 条`);
  if (summary.sessions) messages.push(`上课记录 ${summary.sessions} 条`);
  return {
    summary,
    message: messages.length > 0 ? messages.join("、") : "当前没有业务数据在使用"
  };
}

function toggleClassStatus(classId) {
  const target = classes.find((item) => Number(item.id) === Number(classId));
  if (!target) return;

  const nextStatus = isClassEnabled(target) ? "inactive" : "active";
  const actionLabel = nextStatus === "inactive" ? "停用" : "启用";
  const usageInfo = getClassUsageSummary(target.name);

  if (!window.confirm(`确认${actionLabel}班级“${target.name}”吗？\n当前关联数据：${usageInfo.message}`)) {
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
      ? "班级已停用，历史数据保留，新报名将不可再选择"
      : "班级已启用，可重新在新生报名中选择"
  );
}
