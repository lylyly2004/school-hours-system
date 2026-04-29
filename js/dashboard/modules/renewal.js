function renderRenewalDiscountRates() {
  const options = [`<option value="10">无折扣</option>`];
  for (let i = 99; i >= 10; i -= 1) {
    const value = (i / 10).toFixed(1);
    options.push(`<option value="${value}">${value}折</option>`);
  }
  refs.renewalDiscountRate.innerHTML = options.join("");
}

function updateRenewalDiscountMode() {
  const isDiscountMode = refs.renewalDiscountMode.value === "discount";
  refs.renewalDiscountRateField.classList.toggle("hidden", !isDiscountMode);
  refs.renewalDiscountAmountField.classList.toggle("hidden", isDiscountMode);
}

function calculateRenewalReceivedAmount() {
  const receivable = getPackagePrice(refs.renewalPackageSelect.value || "");
  refs.renewalReceivableInput.value = String(receivable);

  let result = receivable;
  if (refs.renewalDiscountMode.value === "discount") {
    const rate = Number(refs.renewalDiscountRate.value || 10);
    result = receivable * (rate / 10);
  } else {
    result = receivable - Number(refs.renewalDiscountAmount.value || 0);
  }
  result = result < 0 ? 0 : result;
  refs.renewalReceivedInput.value = result.toFixed(0);
}

function getRenewalStudentRecords() {
  return enrollmentRecords
    .filter((record) => isStudentActive(record) && getEnrollmentRemainingHours(record) <= 4)
    .sort((a, b) => getEnrollmentRemainingHours(a) - getEnrollmentRemainingHours(b));
}

function getRenewalPreviewRecords() {
  return [
    {
      id: "sample-1",
      studentName: "林若溪",
      parentPhone: "13800001231",
      courseName: "古筝",
      className: "古筝少儿提高班",
      teacherName: "刘老师",
      packageName: "课时包 24 节",
      remainingHours: 3,
      usedHours: 21,
      giftHours: 2,
      note: "建议本周内联系家长续费，避免影响下周正常排课。",
      sample: true
    },
    {
      id: "sample-2",
      studentName: "周子昊",
      parentPhone: "13800001232",
      courseName: "琵琶",
      className: "琵琶 1对1",
      teacherName: "王老师",
      packageName: "课时包 24 节",
      remainingHours: 4,
      usedHours: 22,
      giftHours: 0,
      note: "家长上次提过续费想走转账，可以前台提前确认付款方式。",
      sample: true
    },
    {
      id: "sample-3",
      studentName: "许星妍",
      parentPhone: "13800001233",
      courseName: "声乐",
      className: "声乐启蒙班",
      teacherName: "陈老师",
      packageName: "季度班",
      remainingHours: 2,
      usedHours: 34,
      giftHours: 0,
      note: "剩余课时较少，建议在本周最后一节课前完成续费提醒。",
      sample: true
    }
  ];
}

function renderRenewalList() {
  const actual = getRenewalStudentRecords();
  const displayRecords = actual.length > 0
    ? actual.map((record) => ({
        id: record.id,
        studentName: record.studentName,
        parentPhone: record.parentPhone,
        courseName: record.courseName,
        className: record.className,
        teacherName: record.teacherName,
        packageName: record.packageName,
        remainingHours: getEnrollmentRemainingHours(record),
        usedHours: getEnrollmentUsedHours(record),
        giftHours: record.giftHoursTotal || 0,
        note: record.remark || "建议前台尽快联系家长，确认后续续费安排。"
      }))
    : getRenewalPreviewRecords();

  refs.renewalList.innerHTML = displayRecords.map((record) => `
    <article class="renewal-item">
      <div>
        <h4>${record.studentName}${record.sample ? "（示例）" : ""}</h4>
        <p class="renewal-meta">
          <strong>联系电话：</strong>${record.parentPhone || "-"}<br>
          <strong>报名班级：</strong>${record.className || "-"}<br>
          <strong>报名课程：</strong>${record.courseName || "-"}<br>
          <strong>教师：</strong>${record.teacherName || "-"}<br>
          <strong>课时包：</strong>${record.packageName || "-"}<br>
          <strong>剩余课时：</strong>${record.remainingHours || 0}<br>
          <strong>已上课时：</strong>${record.usedHours || 0}<br>
          <strong>赠送课时：</strong>${record.giftHours || 0}
        </p>
      </div>
      <div class="renewal-card-actions">
        <button class="primary-btn" type="button" data-renew-student-id="${record.id}">续费</button>
      </div>
    </article>
  `).join("");
}

function resetRenewalForm() {
  renewingStudentId = null;
  refs.renewalFormTitle.textContent = "学员续费";
  refs.renewalStudentName.value = "";
  refs.renewalCourseName.value = "";
  refs.renewalGiftHoursInput.value = "0";
  refs.renewalDiscountMode.value = "discount";
  refs.renewalDiscountAmount.value = "0";
  refs.renewalNoteInput.value = "";
  populatePackageOptions(chargePackages[0]?.name || "");
  renderRenewalDiscountRates();
  updateRenewalDiscountMode();
  calculateRenewalReceivedAmount();
}

function openRenewalForm(recordId) {
  resetRenewalForm();
  const target = enrollmentRecords.find((item) => Number(item.id) === Number(recordId));
  const preview = getRenewalPreviewRecords().find((item) => item.id === recordId);
  const record = target || preview;
  if (!record) return;
  renewingStudentId = target ? target.id : null;
  refs.renewalFormTitle.textContent = `${record.studentName} 续费办理`;
  refs.renewalStudentName.value = record.studentName || "";
  refs.renewalCourseName.value = record.courseName || "";
  populatePackageOptions(record.packageName || chargePackages[0]?.name || "");
  calculateRenewalReceivedAmount();
  openModal(refs.renewalFormModal);
}

function saveRenewal() {
  if (!renewingStudentId) {
    showToast("当前是示例续费学员，先查看流程样式即可");
    closeModal(refs.renewalFormModal);
    return;
  }

  const target = enrollmentRecords.find((item) => item.id === renewingStudentId);
  if (!target) return;

  const packageName = refs.renewalPackageSelect.value;
  const packageHours = getPackageHours(packageName);
  const giftHours = Number(refs.renewalGiftHoursInput.value || 0);
  const receivedAmount = Number(refs.renewalReceivedInput.value || 0);
  const note = refs.renewalNoteInput.value.trim();
  const actionRecord = {
    date: getTodayString(),
    packageName,
    packageHours,
    giftHours,
    receivedAmount,
    note
  };

  enrollmentRecords = enrollmentRecords.map((record) => {
    if (record.id !== renewingStudentId) return record;
    const renewalLogs = Array.isArray(record.renewalLogs) ? record.renewalLogs : [];
    return {
      ...record,
      packageName,
      paidHours: Number(record.paidHours || 0) + packageHours,
      giftHoursTotal: Number(record.giftHoursTotal || 0) + giftHours,
      renewalLogs: [...renewalLogs, actionRecord],
      remark: note ? [record.remark, `${getTodayString()}续费备注：${note}`].filter(Boolean).join("；") : record.remark
    };
  });

  transactions.unshift({
    id: uid(),
    date: getTodayString(),
    studentName: target.studentName,
    type: "续费",
    amount: receivedAmount,
    note: `${packageName} 续费，赠送 ${giftHours} 课时`,
    campus: "总部校区",
    course: target.courseName,
    category: "学费",
    itemName: "",
    sourceType: "renewal",
    sourceId: renewingStudentId
  });

  closeModal(refs.renewalFormModal);
  renderStudents(refs.studentSearch.value || "");
  renderEnrollmentRecords();
  renderTransactions();
  renderRenewalList();
  showToast("续费已保存，学员课时和流水已同步更新");
}

