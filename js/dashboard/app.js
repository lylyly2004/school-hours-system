function bindEvents() {
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
    renderStudents(refs.studentSearch.value || "");
  });

  refs.teacherSearch.addEventListener("input", renderTeachers);

  refs.viewRenewalBtn.addEventListener("click", () => {
    renderRenewalList();
    openModal(refs.renewalModal);
  });
  refs.closeModalBtn.addEventListener("click", () => closeModal(refs.renewalModal));
  refs.modalMask.addEventListener("click", () => closeModal(refs.renewalModal));

  refs.openSessionManageBtn.addEventListener("click", () => switchPage("session"));
  refs.logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("school-admin-auth");
    window.location.href = "./login.html";
  });

  refs.addTeacherBtn.addEventListener("click", () => openTeacherModal());
  refs.closeTeacherModalBtn.addEventListener("click", () => closeModal(refs.teacherModal));
  refs.cancelTeacherBtn.addEventListener("click", () => closeModal(refs.teacherModal));
  refs.teacherModalMask.addEventListener("click", () => closeModal(refs.teacherModal));
  refs.saveTeacherBtn.addEventListener("click", saveTeacher);

  refs.courseQuickAddBtn.addEventListener("click", () => openManagementEditor("course-create"));
  refs.addClassTypeBtn.addEventListener("click", () => openManagementEditor("class-type-create"));
  refs.addClassBtn.addEventListener("click", addClass);
  refs.classSearch?.addEventListener("input", () => {
    renderClasses(refs.classSearch.value || "");
  });

  refs.saveManagementEditorBtn.addEventListener("click", saveManagementEditor);
  refs.closeManagementEditorBtn.addEventListener("click", closeManagementEditor);
  refs.cancelManagementEditorBtn.addEventListener("click", closeManagementEditor);
  refs.managementEditorMask.addEventListener("click", closeManagementEditor);

  refs.saveEnrollmentBtn.addEventListener("click", saveEnrollment);
  refs.resetEnrollmentBtn.addEventListener("click", resetEnrollmentForm);

  refs.addRetailBtn.addEventListener("click", () => openRetailModal());
  refs.closeRetailModalBtn.addEventListener("click", () => closeModal(refs.retailModal));
  refs.cancelRetailBtn.addEventListener("click", () => closeModal(refs.retailModal));
  refs.retailModalMask.addEventListener("click", () => closeModal(refs.retailModal));
  refs.saveRetailBtn.addEventListener("click", saveRetail);
  refs.retailQuantityInput.addEventListener("input", () => {
    refs.retailAmountInput.value = String(Number(refs.retailQuantityInput.value || 0) * Number(refs.retailUnitPriceInput.value || 0));
  });
  refs.retailUnitPriceInput.addEventListener("input", () => {
    refs.retailAmountInput.value = String(Number(refs.retailQuantityInput.value || 0) * Number(refs.retailUnitPriceInput.value || 0));
  });

  refs.filterTodayBtn.addEventListener("click", renderTodayRecords);
  refs.resetTodayBtn.addEventListener("click", () => {
    refs.todayDateFilter.value = "";
    refs.todayCourseFilter.value = "鍏ㄩ儴璇剧▼";
    renderTodayRecords();
  });

  refs.filterTransactionBtn.addEventListener("click", renderTransactions);
  refs.resetTransactionBtn.addEventListener("click", () => {
    refs.transactionDateFrom.value = "";
    refs.transactionDateTo.value = "";
    refs.transactionCampusFilter.value = "鍏ㄩ儴鏍″尯";
    refs.transactionCourseFilter.value = "鍏ㄩ儴璇剧▼";
    refs.transactionCategoryFilter.value = "鍏ㄩ儴鍒嗙被";
    refs.transactionStudentKeyword.value = "";
    refs.transactionItemKeyword.value = "";
    renderTransactions();
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
  refs.renewalFormModalMask.addEventListener("click", () => closeModal(refs.renewalFormModal));

  refs.chooseTeacherBtn.addEventListener("click", () => {
    renderSessionTeacherPicker();
    openModal(refs.sessionTeacherModal);
  });
  refs.closeSessionTeacherModalBtn.addEventListener("click", () => closeModal(refs.sessionTeacherModal));
  refs.sessionTeacherMask.addEventListener("click", () => closeModal(refs.sessionTeacherModal));
  refs.sessionSelectAllBtn.addEventListener("click", () => {
    const candidates = getSessionSelectableStudents().map((record) => Number(record.id));
    selectedSessionStudentIds = candidates;
    renderSessionStudents();
  });
  refs.sessionResetBtn.addEventListener("click", resetSessionSelection);
  refs.sessionPrevPageBtn.addEventListener("click", () => changeSessionRecordPage(-1));
  refs.sessionNextPageBtn.addEventListener("click", () => changeSessionRecordPage(1));
  refs.saveSessionBtn.addEventListener("click", saveSessionRecord);

  refs.studentStatusFilters.addEventListener("click", (event) => {
    const target = event.target.closest("[data-student-filter]");
    if (!target) return;
    studentStatusFilter = target.dataset.studentFilter;
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
  refs.studentAdjustMask.addEventListener("click", () => closeModal(refs.studentAdjustModal));
  refs.saveStudentAdjustBtn.addEventListener("click", saveStudentAdjust);

  refs.enrollmentTableBody.addEventListener("click", (event) => {
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
      if (!confirmDelete("这条报名记录")) return;
      enrollmentRecords = enrollmentRecords.filter((item) => item.id !== Number(deleteBtn.dataset.deleteEnrollmentId));
      renderEnrollmentRecords();
      renderStudents(refs.studentSearch.value || "");
      renderBirthdayRecords();
      renderRenewalList();
      renderSessionWorkspace();
      showToast("报名记录已删除。")
    }
  });

  refs.birthdayTableBody.addEventListener("click", (event) => {
    const noteBtn = event.target.closest("[data-birthday-note]");
    if (!noteBtn) return;
    const name = noteBtn.dataset.birthdayNote;
    const currentNote = birthdayNotes[name] || "";
    const nextNote = window.prompt(`为 ${name} 添加或修改生日备注：`, currentNote);
    if (nextNote === null) return;
    birthdayNotes[name] = nextNote.trim();
    renderBirthdayRecords();
    showToast("生日备注已更新。")
  });

  refs.retailTableBody.addEventListener("click", (event) => {
    const detailBtn = event.target.closest("[data-detail-retail-id]");
    if (detailBtn) {
      document.getElementById(`retail-detail-row-${detailBtn.dataset.detailRetailId}`)?.classList.toggle("hidden");
      return;
    }
    const editBtn = event.target.closest("[data-edit-retail-id]");
    if (editBtn) {
      openRetailModal(Number(editBtn.dataset.editRetailId));
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-retail-id]");
    if (deleteBtn) {
      if (!window.confirm("确认删除这条零售记录吗？删除后会同步移除对应流水。")) return;
      const retailId = Number(deleteBtn.dataset.deleteRetailId);
      retailRecords = retailRecords.filter((item) => item.id !== retailId);
      transactions = transactions.filter((item) => !(item.sourceType === "retail" && item.sourceId === retailId));
      renderRetailRecords();
      renderTransactions();
      showToast("闆跺敭璁板綍宸插垹闄わ紝骞跺凡鍚屾鏇存柊娴佹按");
    }
  });

  refs.teacherCardList.addEventListener("click", (event) => {
    const editBtn = event.target.closest("[data-edit-teacher-id]");
    if (editBtn) {
      openTeacherModal(Number(editBtn.dataset.editTeacherId));
      return;
    }
    const deleteBtn = event.target.closest("[data-delete-teacher-id]");
    if (deleteBtn) {
      if (!confirmDelete("这位教师")) return;
      const teacherId = Number(deleteBtn.dataset.deleteTeacherId);
      teachers = teachers.filter((item) => item.id !== teacherId);
      populateTeacherOptions(teachers[0]?.name || "");
      renderTeachers();
      renderSessionTeacherPicker();
      showToast("教师已删除。")
    }
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
    selectedSessionStudentIds = [];
    renderSessionWorkspace();
  });

  refs.sessionStudentList.addEventListener("change", (event) => {
    const checkbox = event.target.closest(".session-student-checkbox");
    if (!checkbox) return;
    const recordId = Number(checkbox.value);
    if (checkbox.checked) {
      if (!selectedSessionStudentIds.includes(recordId)) selectedSessionStudentIds.push(recordId);
    } else {
      selectedSessionStudentIds = selectedSessionStudentIds.filter((item) => item !== recordId);
    }
    renderSessionStudents();
  });

  refs.sessionTableBody.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest("[data-delete-session-id]");
    if (!deleteBtn) return;
    if (!confirmDelete("这条上课记录")) return;
    deleteSessionRecord(Number(deleteBtn.dataset.deleteSessionId));
  });

  refs.renewalList.addEventListener("click", (event) => {
    const renewBtn = event.target.closest("[data-renew-student-id]");
    if (!renewBtn) return;
    openRenewalForm(renewBtn.dataset.renewStudentId);
  });
}

function init() {
  normalizeSharedData();
  populateRetailBaseOptions();
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
  renderTodayRecords();
  renderRetailRecords();
  renderStudents("");
  renderRenewalList();
  renderSessionWorkspace();
  renderChargePackages();
  renderTransactions();
  renderSessionTeacherPicker();
  refs.todayDateFilter.value = getTodayString();
  refs.todayCourseFilter.value = "鍏ㄩ儴璇剧▼";
  updateHeader();
  bindEvents();
}

init();
