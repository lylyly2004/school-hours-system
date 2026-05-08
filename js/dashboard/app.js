function bindEvents() {
  const closeDataToolsMenu = () => {
    refs.dataToolsToggle?.closest(".top-tools-menu")?.removeAttribute("open");
  };

  refs.menuParents.forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.parent;
      const menuGroup = button.closest(".menu-group");
      const expanded = menuGroup ? menuGroup.classList.contains("collapsed") : false;
      setGroupExpanded(group, expanded);
    });
  });

  refs.menuItems.forEach((button) => {
    button.addEventListener("click", () => switchPage(button.dataset.page));
  });

  refs.businessTabs.forEach((button) => {
    button.addEventListener("click", () => switchBusinessTab(button.dataset.businessTab));
  });

  refs.studentSearch.addEventListener("input", () => {
    setStudentListPage(1);
    renderStudents(refs.studentSearch.value || "");
  });

  refs.teacherSearch.addEventListener("input", renderTeachers);

  refs.viewRenewalBtn.addEventListener("click", () => {
    renderRenewalList();
    openModal(refs.renewalModal);
  });
  refs.closeModalBtn.addEventListener("click", () => closeModal(refs.renewalModal));

  refs.openSessionManageBtn.addEventListener("click", () => switchPage("session"));
  refs.bindDataFileBtn?.addEventListener("click", bindDataFile);
  refs.syncDataFileBtn?.addEventListener("click", () => {
    void syncFromBoundDataFile(true);
  });
  refs.dataToolsExportBtn?.addEventListener("click", () => {
    refs.exportDataBtn?.click();
    closeDataToolsMenu();
  });
  refs.dataToolsImportBtn?.addEventListener("click", () => {
    refs.importDataBtn?.click();
    closeDataToolsMenu();
  });
  refs.dataToolsBindBtn?.addEventListener("click", () => {
    refs.bindDataFileBtn?.click();
    closeDataToolsMenu();
  });
  refs.dataToolsSyncBtn?.addEventListener("click", () => {
    refs.syncDataFileBtn?.click();
    closeDataToolsMenu();
  });
  refs.usageGuideBtn?.addEventListener("click", () => openModal(refs.usageGuideModal));
  refs.exportDataBtn.addEventListener("click", exportAppData);
  refs.importDataBtn.addEventListener("click", () => {
    refs.importDataInput.value = "";
    refs.importDataInput.click();
  });
  refs.importDataInput.addEventListener("change", () => {
    const file = refs.importDataInput.files?.[0];
    if (!file) return;
    if (!window.confirm("瀵煎叆鏁版嵁浼氳鐩栧綋鍓嶆湰鏈轰繚瀛樼殑鏁版嵁锛屾槸鍚︾户缁紵")) {
      refs.importDataInput.value = "";
      return;
    }
    importAppDataFromFile(file);
  });
  refs.closeUsageGuideBtn?.addEventListener("click", () => closeModal(refs.usageGuideModal));
  refs.confirmUsageGuideBtn?.addEventListener("click", () => closeModal(refs.usageGuideModal));
  refs.confirmDialogCancelBtn?.addEventListener("click", () => closeConfirmDialog(false));
  refs.confirmDialogConfirmBtn?.addEventListener("click", () => closeConfirmDialog(true));
  refs.inputDialogCancelBtn?.addEventListener("click", () => closeInputDialog(null));
  refs.inputDialogConfirmBtn?.addEventListener("click", () => closeInputDialog(refs.inputDialogInput?.value ?? ""));
  refs.inputDialogInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      closeInputDialog(refs.inputDialogInput?.value ?? "");
    }
  });
  document.addEventListener("click", (event) => {
    const menu = refs.dataToolsToggle?.closest(".top-tools-menu");
    if (!menu?.hasAttribute("open")) return;
    if (menu.contains(event.target)) return;
    closeDataToolsMenu();
  });
  refs.logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("school-admin-auth");
    window.location.href = "./login.html";
  });

  refs.addTeacherBtn.addEventListener("click", () => openTeacherModal());
  refs.closeTeacherModalBtn.addEventListener("click", () => closeModal(refs.teacherModal));
  refs.cancelTeacherBtn.addEventListener("click", () => closeModal(refs.teacherModal));
  refs.saveTeacherBtn.addEventListener("click", saveTeacher);

  refs.addChargePackageBtn.addEventListener("click", () => openChargePackageModal());
  refs.closeChargePackageModalBtn.addEventListener("click", closeChargePackageModal);
  refs.cancelChargePackageBtn.addEventListener("click", closeChargePackageModal);
  refs.saveChargePackageBtn.addEventListener("click", saveChargePackage);

  refs.courseQuickAddBtn.addEventListener("click", () => openManagementEditor("course-create"));
  refs.addClassTypeBtn.addEventListener("click", () => openManagementEditor("class-type-create"));
  refs.addClassBtn.addEventListener("click", addClass);
  refs.classSearch?.addEventListener("input", () => {
    setClassListPage(1);
    renderClasses(refs.classSearch.value || "");
  });
  refs.classPrevPageBtn?.addEventListener("click", () => {
    setClassListPage(currentClassListPage - 1);
    renderClasses(refs.classSearch?.value || "");
  });
  refs.classNextPageBtn?.addEventListener("click", () => {
    setClassListPage(currentClassListPage + 1);
    renderClasses(refs.classSearch?.value || "");
  });

  refs.saveManagementEditorBtn.addEventListener("click", saveManagementEditor);
  refs.closeManagementEditorBtn.addEventListener("click", closeManagementEditor);
  refs.cancelManagementEditorBtn.addEventListener("click", closeManagementEditor);
  refs.managementEditorList?.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest("[data-delete-class-type]");
    if (!deleteBtn) return;
    if (deleteBtn.dataset.deleteClassTypeAllowed !== "true") {
      showToast(deleteBtn.dataset.deleteClassTypeReason || "当前授课形式不满足删除条件");
      return;
    }
    void deleteClassType(deleteBtn.dataset.deleteClassType);
  });

  refs.saveEnrollmentBtn.addEventListener("click", saveEnrollment);
  refs.resetEnrollmentBtn.addEventListener("click", resetEnrollmentForm);
  refs.enrollmentPrevPageBtn?.addEventListener("click", () => {
    setEnrollmentPage(currentEnrollmentPage - 1);
    renderEnrollmentRecords();
  });
  refs.enrollmentNextPageBtn?.addEventListener("click", () => {
    setEnrollmentPage(currentEnrollmentPage + 1);
    renderEnrollmentRecords();
  });

  refs.addRetailBtn.addEventListener("click", () => openRetailModal());
  refs.closeRetailModalBtn.addEventListener("click", () => closeModal(refs.retailModal));
  refs.cancelRetailBtn.addEventListener("click", () => closeModal(refs.retailModal));
  refs.saveRetailBtn.addEventListener("click", saveRetail);
  refs.retailQuantityInput.addEventListener("input", () => {
    refs.retailAmountInput.value = String(Number(refs.retailQuantityInput.value || 0) * Number(refs.retailUnitPriceInput.value || 0));
  });
  refs.retailUnitPriceInput.addEventListener("input", () => {
    refs.retailAmountInput.value = String(Number(refs.retailQuantityInput.value || 0) * Number(refs.retailUnitPriceInput.value || 0));
  });
  refs.retailPrevPageBtn?.addEventListener("click", () => {
    setRetailPage(currentRetailPage - 1);
    renderRetailRecords();
  });
  refs.retailNextPageBtn?.addEventListener("click", () => {
    setRetailPage(currentRetailPage + 1);
    renderRetailRecords();
  });
  refs.birthdayPrevPageBtn?.addEventListener("click", () => {
    setBirthdayPage(currentBirthdayPage - 1);
    renderBirthdayRecords();
  });
  refs.birthdayNextPageBtn?.addEventListener("click", () => {
    setBirthdayPage(currentBirthdayPage + 1);
    renderBirthdayRecords();
  });

  refs.filterTodayBtn.addEventListener("click", () => {
    setTodayPage(1);
    renderTodayRecords();
  });
  refs.resetTodayBtn.addEventListener("click", () => {
    refs.todayDateFilter.value = "";
    setTodayPage(1);
    refs.todayCourseFilter.value = "閸忋劑鍎寸拠鍓р柤";
    renderTodayRecords();
  });

  refs.todayPrevPageBtn?.addEventListener("click", () => {
    setTodayPage(currentTodayPage - 1);
    renderTodayRecords();
  });
  refs.todayNextPageBtn?.addEventListener("click", () => {
    setTodayPage(currentTodayPage + 1);
    renderTodayRecords();
  });

  refs.filterTransactionBtn.addEventListener("click", () => {
    setTransactionPage(1);
    renderTransactions();
  });
  refs.resetTransactionBtn.addEventListener("click", () => {
    refs.transactionDateFrom.value = "";
    refs.transactionDateTo.value = "";
    refs.transactionCampusFilter.value = "閸忋劑鍎撮弽鈥冲隘";
    refs.transactionCourseFilter.value = "閸忋劑鍎寸拠鍓р柤";
    refs.transactionCategoryFilter.value = "閸忋劑鍎撮崚鍡欒";
    refs.transactionTypeFilter.value = "\u5168\u90E8\u7C7B\u578B";
    refs.transactionStudentKeyword.value = "";
    refs.transactionItemKeyword.value = "";
    setTransactionPage(1);
    renderTransactions();
  });
  refs.transactionPrevPageBtn.addEventListener("click", () => {
    setTransactionPage(currentTransactionPage - 1);
    renderTransactions();
  });
  refs.transactionNextPageBtn.addEventListener("click", () => {
    setTransactionPage(currentTransactionPage + 1);
    renderTransactions();
  });
  refs.transactionTableBody.addEventListener("click", (event) => {
    const detailBtn = event.target.closest("[data-detail-transaction-id]");
    if (!detailBtn) return;
    const targetId = detailBtn.dataset.detailTransactionId;
    refs.transactionTableBody.querySelectorAll(".detail-row").forEach((row) => {
      if (row.id !== `transaction-detail-row-${targetId}`) {
        row.classList.add("hidden");
      }
    });
    document.getElementById(`transaction-detail-row-${targetId}`)?.classList.toggle("hidden");
  });

  refs.renewalDiscountMode.addEventListener("change", () => {
    updateRenewalDiscountMode();
    calculateRenewalReceivedAmount();
  });
  refs.renewalDiscountRate.addEventListener("change", calculateRenewalReceivedAmount);
  refs.renewalDiscountAmount.addEventListener("input", calculateRenewalReceivedAmount);
  refs.renewalPackageSelect.addEventListener("change", calculateRenewalReceivedAmount);
  refs.saveRenewalBtn.addEventListener("click", saveRenewal);
  refs.cancelRenewalBtn.addEventListener("click", () => closeModal(refs.renewalFormModal));
  refs.closeRenewalFormBtn.addEventListener("click", () => closeModal(refs.renewalFormModal));

  refs.chooseTeacherBtn.addEventListener("click", () => {
    renderSessionTeacherPicker();
    openModal(refs.sessionTeacherModal);
  });
  refs.closeSessionTeacherModalBtn.addEventListener("click", () => closeModal(refs.sessionTeacherModal));
  refs.sessionSelectAllBtn.addEventListener("click", () => {
    const candidates = getSessionSelectableStudents().map((record) => Number(record.id));
    selectedSessionStudentIds = candidates;
    renderSessionStudents();
  });
  refs.sessionViewTabs.addEventListener("click", (event) => {
    const target = event.target.closest("[data-session-view]");
    if (!target) return;
    switchSessionView(target.dataset.sessionView);
  });
  refs.sessionResetBtn.addEventListener("click", resetSessionSelection);
  refs.filterSessionBtn.addEventListener("click", applySessionRecordFilters);
  refs.resetSessionFilterBtn.addEventListener("click", resetSessionRecordFilters);
  refs.sessionPrevPageBtn.addEventListener("click", () => changeSessionRecordPage(-1));
  refs.sessionNextPageBtn.addEventListener("click", () => changeSessionRecordPage(1));
  refs.saveSessionBtn.addEventListener("click", saveSessionRecord);
  refs.sessionLessonDateInput?.addEventListener("click", () => {
    if (typeof refs.sessionLessonDateInput.showPicker === "function") {
      refs.sessionLessonDateInput.showPicker();
    }
  });
  refs.sessionStudentSearch?.addEventListener("input", () => {
    renderSessionStudents();
  });

  refs.studentStatusFilters.addEventListener("click", (event) => {
    const target = event.target.closest("[data-student-filter]");
    if (!target) return;
    studentStatusFilter = target.dataset.studentFilter;
    setStudentListPage(1);
    renderStudents(refs.studentSearch.value || "");
  });
  refs.studentPrevPageBtn.addEventListener("click", () => {
    setStudentListPage(currentStudentListPage - 1);
    renderStudents(refs.studentSearch.value || "");
  });
  refs.studentNextPageBtn.addEventListener("click", () => {
    setStudentListPage(currentStudentListPage + 1);
    renderStudents(refs.studentSearch.value || "");
  });

  refs.studentTableBody.addEventListener("click", (event) => {
    const detailBtn = event.target.closest("[data-detail-student-id]");
    if (detailBtn) {
      openStudentDetail(Number(detailBtn.dataset.detailStudentId));
      return;
    }
    const transferBtn = event.target.closest("[data-transfer-student-id]");
    if (transferBtn) {
      openStudentAdjustModal(Number(transferBtn.dataset.transferStudentId), "class");
      return;
    }
    const changeTeacherBtn = event.target.closest("[data-change-teacher-student-id]");
    if (changeTeacherBtn) {
      openStudentAdjustModal(Number(changeTeacherBtn.dataset.changeTeacherStudentId), "teacher");
      return;
    }
    const pauseBtn = event.target.closest("[data-pause-student-id]");
    if (pauseBtn) {
      updateStudentLifecycle(Number(pauseBtn.dataset.pauseStudentId), "paused");
      return;
    }
    const resumeBtn = event.target.closest("[data-resume-student-id]");
    if (resumeBtn) {
      updateStudentLifecycle(Number(resumeBtn.dataset.resumeStudentId), "active");
      return;
    }
    const refundBtn = event.target.closest("[data-refund-student-id]");
    if (refundBtn) {
      updateStudentLifecycle(Number(refundBtn.dataset.refundStudentId), "refunded");
    }
  });

  refs.closeStudentAdjustBtn.addEventListener("click", () => closeModal(refs.studentAdjustModal));
  refs.cancelStudentAdjustBtn.addEventListener("click", () => closeModal(refs.studentAdjustModal));
  refs.saveStudentAdjustBtn.addEventListener("click", saveStudentAdjust);

  refs.enrollmentTableBody.addEventListener("click", async (event) => {
    const detailBtn = event.target.closest("[data-detail-enrollment-id]");
    if (detailBtn) {
      document.getElementById(`detail-row-${detailBtn.dataset.detailEnrollmentId}`)?.classList.toggle("hidden");
      return;
    }
    const editBtn = event.target.closest("[data-edit-enrollment-id]");
    if (editBtn) {
      loadEnrollmentForEdit(Number(editBtn.dataset.editEnrollmentId));
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-enrollment-id]");
    if (deleteBtn) {
      if (!await confirmDelete("这条报名记录")) return;
      enrollmentRecords = enrollmentRecords.filter((item) => item.id !== Number(deleteBtn.dataset.deleteEnrollmentId));
      renderEnrollmentRecords();
      renderStudents(refs.studentSearch.value || "");
      renderBirthdayRecords();
      renderRenewalList();
      renderSessionWorkspace();
      showToast("报名记录已删除。");
    }
  });

  refs.birthdayTableBody.addEventListener("click", async (event) => {
    const noteBtn = event.target.closest("[data-birthday-note]");
    if (!noteBtn) return;
    const name = noteBtn.dataset.birthdayNote;
    const currentNote = birthdayNotes[name] || "";
    const nextNote = await openTextInputDialog({
      title: "生日备注",
      hint: `为 ${name} 添加或修改生日备注。`, 
      label: "备注内容",
      value: currentNote,
      placeholder: "请输入生日备注",
      confirmText: "保存备注",
      cancelText: "取消"
    });
    if (nextNote === null) return;
    birthdayNotes[name] = nextNote.trim();
    renderBirthdayRecords();
    showToast("生日备注已更新。");
    const editBtn = event.target.closest("[data-edit-retail-id]");
    if (editBtn) {
      openRetailModal(Number(editBtn.dataset.editRetailId));
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-retail-id]");
    if (deleteBtn) {
      if (!await confirmDelete("这条零售记录", "删除后会同步移除对应流水。")) return;
      const retailId = Number(deleteBtn.dataset.deleteRetailId);
      retailRecords = retailRecords.filter((item) => item.id !== retailId);
      transactions = transactions.filter((item) => !(item.sourceType === "retail" && item.sourceId === retailId));
      renderRetailRecords();
      renderTransactions();
      showToast("零售记录已删除，关联流水已同步移除。");
    }
  });

  refs.teacherCardList.addEventListener("click", async (event) => {
    const detailBtn = event.target.closest("[data-detail-teacher-id]");
    if (detailBtn) {
      const targetId = detailBtn.dataset.detailTeacherId;
      refs.teacherCardList.querySelectorAll(".teacher-detail-row").forEach((row) => {
        if (row.id !== `teacher-detail-row-${targetId}`) {
          row.classList.add("hidden");
        }
      });
      document.getElementById(`teacher-detail-row-${targetId}`)?.classList.toggle("hidden");
      return;
    }
    const teacherPageBtn = event.target.closest("[data-teacher-history-page]");
    if (teacherPageBtn) {
      const teacherId = Number(teacherPageBtn.dataset.teacherHistoryPage);
      const direction = teacherPageBtn.dataset.pageDirection;
      const currentPage = getTeacherDetailPage(teacherId);
      setTeacherDetailPage(teacherId, direction === "prev" ? currentPage - 1 : currentPage + 1);
      renderTeachers();
      refs.teacherCardList.querySelectorAll(".teacher-detail-row").forEach((row) => row.classList.add("hidden"));
      document.getElementById(`teacher-detail-row-${teacherId}`)?.classList.remove("hidden");
      return;
    }
    const editBtn = event.target.closest("[data-edit-teacher-id]");
    if (editBtn) {
      openTeacherModal(Number(editBtn.dataset.editTeacherId));
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-teacher-id]");
    if (deleteBtn) {
      if (!await confirmDelete("这位教师")) return;
      const teacherId = Number(deleteBtn.dataset.deleteTeacherId);
      teachers = teachers.filter((item) => item.id !== teacherId);
      populateTeacherOptions(teachers[0]?.name || "");
      renderTeachers();
      renderClasses();
      renderStudents(refs.studentSearch?.value || "");
      renderSessionTeacherPicker();
      renderSessionWorkspace();
      showToast("教师已删除。");
    }
  });

  refs.chargePackageList.addEventListener("click", (event) => {
    const editBtn = event.target.closest("[data-edit-charge-package-id]");
    if (editBtn) {
      openChargePackageModal(Number(editBtn.dataset.editChargePackageId));
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-charge-package-id]");
    if (!deleteBtn) return;
    if (deleteBtn.dataset.deleteChargeAllowed !== "true") {
      showToast(deleteBtn.dataset.deleteChargeReason || "当前收费模式不满足删除条件");
      return;
    }
    void deleteChargePackage(Number(deleteBtn.dataset.deleteChargePackageId));
  });

  refs.courseTableBody.addEventListener("click", (event) => {
    const editBtn = event.target.closest("[data-edit-course-id]");
    if (editBtn) {
      const courseId = Number(editBtn.dataset.editCourseId);
      const course = courses.find((item) => item.id === courseId);
      if (course) {
        openManagementEditor("course-edit", { courseId, courseName: course.name });
      }
      return;
    }
    const toggleBtn = event.target.closest("[data-toggle-course-id]");
    if (toggleBtn) {
      toggleCourseStatus(Number(toggleBtn.dataset.toggleCourseId));
    }
  });

  refs.classTableBody.addEventListener("click", (event) => {
    const detailBtn = event.target.closest("[data-detail-class-id]");
    if (detailBtn) {
      document.getElementById(`class-detail-row-${detailBtn.dataset.detailClassId}`)?.classList.toggle("hidden");
      return;
    }
    const editBtn = event.target.closest("[data-edit-class-id]");
    if (editBtn) {
      if (editBtn.dataset.editClassAllowed !== "true") {
        showToast(editBtn.dataset.editClassReason || "当前班级不满足编辑条件");
        return;
      }
      editClass(Number(editBtn.dataset.editClassId));
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-class-id]");
    if (deleteBtn) {
      if (deleteBtn.dataset.deleteClassAllowed !== "true") {
        showToast(deleteBtn.dataset.deleteClassReason || "\u5F53\u524D\u73ED\u7EA7\u4E0D\u6EE1\u8DB3\u5220\u9664\u6761\u4EF6");
        return;
      }
      void deleteClass(Number(deleteBtn.dataset.deleteClassId));
      return;
    }
    const toggleBtn = event.target.closest("[data-toggle-class-id]");
    if (!toggleBtn) return;
    toggleClassStatus(Number(toggleBtn.dataset.toggleClassId));
  });

  refs.sessionTeacherList.addEventListener("click", (event) => {
    const pickBtn = event.target.closest("[data-pick-session-teacher]");
    if (!pickBtn) return;
    selectSessionTeacher(pickBtn.dataset.pickSessionTeacher);
  });

  refs.sessionClassTabs.addEventListener("click", (event) => {
    const tabBtn = event.target.closest("[data-session-class]");
    if (!tabBtn) return;
    selectedSessionClassName = tabBtn.dataset.sessionClass;
    shouldAutoSelectSessionStudents = true;
    selectedSessionStudentIds = [];
    renderSessionWorkspace();
  });

  refs.sessionStudentList.addEventListener("change", (event) => {
    const checkbox = event.target.closest(".session-student-checkbox");
    if (!checkbox) return;
    shouldAutoSelectSessionStudents = false;
    const recordId = Number(checkbox.value);
    if (checkbox.checked) {
      if (!selectedSessionStudentIds.includes(recordId)) selectedSessionStudentIds.push(recordId);
    } else {
      selectedSessionStudentIds = selectedSessionStudentIds.filter((item) => item !== recordId);
    }
    renderSessionStudents();
  });

  refs.sessionTableBody.addEventListener("click", async (event) => {
    const detailBtn = event.target.closest("[data-detail-session-id]");
    if (detailBtn) {
      document.getElementById(`session-detail-row-${detailBtn.dataset.detailSessionId}`)?.classList.toggle("hidden");
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-session-id]");
    if (!deleteBtn) return;
    if (!await confirmDelete("这条上课记录")) return;
    deleteSessionRecord(Number(deleteBtn.dataset.deleteSessionId));
  });

  refs.renewalList.addEventListener("click", (event) => {
    const renewBtn = event.target.closest("[data-renew-student-id]");
    if (!renewBtn) return;
    openRenewalForm(renewBtn.dataset.renewStudentId);
  });
}

function applySystemShellCopy() {
  document.title = "学校学员课时管理系统";

  const brandTitle = document.querySelector(".brand-block h2");
  const brandSubTitle = document.querySelector(".brand-block p");
  const brandMark = document.querySelector(".brand-mark");
  const logoutBtn = refs.logoutBtn;
  const exportBtn = refs.exportDataBtn;
  const importBtn = refs.importDataBtn;
  const bindBtn = refs.bindDataFileBtn;
  const syncBtn = refs.syncDataFileBtn;
  const status = refs.dataFileStatus;

  if (brandTitle) brandTitle.textContent = "课时管理系统";
  if (brandSubTitle) {
    brandSubTitle.textContent = "";
    brandSubTitle.style.display = "none";
  }
  if (brandMark) brandMark.textContent = "时";
  if (logoutBtn) logoutBtn.textContent = "退出登录";
  if (exportBtn) exportBtn.textContent = "导出数据";
  if (importBtn) importBtn.textContent = "导入数据";
  if (bindBtn) bindBtn.textContent = "绑定数据文件";
  if (syncBtn) syncBtn.textContent = "从文件同步";
  if (status && !status.textContent.trim()) status.textContent = "未绑定数据文件";
}

async function init() {
  const hasLocalData = loadPersistedData();
  if (!hasLocalData) {
    await syncFromBoundDataFile(false);
  }
  normalizeSharedData();
  applySystemShellCopy();
  populateRetailBaseOptions();
  populateCampusOptions(campusOptions.find((item) => item !== "全部校区") || "");
  populateTeacherOptions(teachers[0]?.name || "");
  populateCourseOptions(courses[0]?.name || "");
  populateClassTypeOptions(classTypeOptions[0] || "");
  populateClassOptions(classes[0]?.name || "");
  populatePackageOptions(chargePackages[0]?.name || "");
  renderRenewalDiscountRates();
  updateRenewalDiscountMode();
  calculateRenewalReceivedAmount();
  resetEnrollmentForm();
  resetRetailForm();
  renderTeachers();
  renderCourseManagementList();
  renderClasses();
  renderEnrollmentRecords();
  renderBirthdayRecords();
  refs.todayDateFilter.value = getTodayString();
  refs.todayCourseFilter.value = "閸忋劑鍎寸拠鍓р柤";
  setTodayPage(1);
  renderTodayRecords();
  renderRetailRecords();
  renderStudents("");
  renderRenewalList();
  renderSessionWorkspace();
  renderChargePackages();
  renderTransactions();
  renderSessionTeacherPicker();
  updateHeader();
  bindEvents();
  void refreshDataFileStatus();
  if (window.__schoolHoursRecoveredFromBackup) {
    showToast("已从最近一次本地备份恢复数据。");
    window.__schoolHoursRecoveredFromBackup = false;
  }
  window.addEventListener("beforeunload", persistAppData);
}

init();
