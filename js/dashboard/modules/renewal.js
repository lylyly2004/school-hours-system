function renderRenewalDiscountRates() {
  const options = [`<option value="10">\u65E0\u6298\u6263</option>`];
  for (let i = 99; i >= 10; i -= 1) {
    const value = (i / 10).toFixed(1);
    options.push(`<option value="${value}">${value}\u6298</option>`);
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

function getRenewalDisplayRecords() {
  return getRenewalStudentRecords().map((record) => ({
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
    note: record.remark || "\u5EFA\u8BAE\u524D\u53F0\u5C3D\u5FEB\u8054\u7CFB\u5BB6\u957F\uFF0C\u786E\u8BA4\u540E\u7EED\u7F34\u8D39\u5B89\u6392\u3002"
  }));
}

function renderRenewalList() {
  const displayRecords = getRenewalDisplayRecords();
  if (displayRecords.length === 0) {
    refs.renewalList.innerHTML = `
      <article class="empty-tip">
        <p>\u6682\u65E0\u9700\u7EED\u8D39\u5B66\u5458</p>
      </article>
    `;
    return;
  }

  refs.renewalList.innerHTML = displayRecords.map((record) => `
    <article class="renewal-item">
      <div>
        <h4>${record.studentName}</h4>
        <p class="renewal-meta">
          <strong>\u8054\u7CFB\u7535\u8BDD\uFF1A</strong>${record.parentPhone || "-"}<br>
          <strong>\u62A5\u540D\u73ED\u7EA7\uFF1A</strong>${record.className || "-"}<br>
          <strong>\u62A5\u540D\u8BFE\u7A0B\uFF1A</strong>${record.courseName || "-"}<br>
          <strong>\u6559\u5E08\uFF1A</strong>${record.teacherName || "-"}<br>
          <strong>\u8BFE\u65F6\u5305\uFF1A</strong>${record.packageName || "-"}<br>
          <strong>\u5269\u4F59\u8BFE\u65F6\uFF1A</strong>${record.remainingHours || 0}<br>
          <strong>\u5DF2\u4E0A\u8BFE\u65F6\uFF1A</strong>${record.usedHours || 0}<br>
          <strong>\u8D60\u9001\u8BFE\u65F6\uFF1A</strong>${record.giftHours || 0}
        </p>
      </div>
      <div class="renewal-card-actions">
        <button class="primary-btn" type="button" data-renew-student-id="${record.id}">\u7EED\u8D39</button>
      </div>
    </article>
  `).join("");
}

function resetRenewalForm() {
  renewingStudentId = null;
  refs.renewalFormTitle.textContent = "\u5B66\u5458\u7EED\u8D39";
  refs.renewalStudentName.value = "";
  refs.renewalCourseName.value = "";
  refs.renewalGiftHoursInput.value = "0";
  refs.renewalDiscountMode.value = "discount";
  refs.renewalDiscountAmount.value = "0";
  refs.renewalNoteInput.value = "";
  populatePackageOptions(String(chargePackages[0]?.id || ""));
  renderRenewalDiscountRates();
  updateRenewalDiscountMode();
  calculateRenewalReceivedAmount();
}

function openRenewalForm(recordId) {
  resetRenewalForm();
  const target = enrollmentRecords.find((item) => Number(item.id) === Number(recordId));
  if (!target) return;

  renewingStudentId = target.id;
  refs.renewalFormTitle.textContent = `${target.studentName} \u7EED\u8D39\u529E\u7406`;
  refs.renewalStudentName.value = target.studentName || "";
  refs.renewalCourseName.value = target.courseName || "";
  populatePackageOptions(target.packageId || target.packageName || String(chargePackages[0]?.id || ""));
  calculateRenewalReceivedAmount();
  openModal(refs.renewalFormModal);
}

function saveRenewal() {
  if (!renewingStudentId) return;

  const target = enrollmentRecords.find((item) => Number(item.id) === Number(renewingStudentId));
  if (!target) return;

  const selectedPackage = findPackage(refs.renewalPackageSelect.value);
  if (!selectedPackage) {
    showToast("\u8BF7\u5148\u9009\u62E9\u6709\u6548\u7684\u8BFE\u65F6\u5305");
    return;
  }

  const packageId = selectedPackage.id;
  const packageName = selectedPackage.name;
  const packageHours = Number(selectedPackage.hours || 0);
  const giftHours = Number(refs.renewalGiftHoursInput.value || 0);
  const receivedAmount = Number(refs.renewalReceivedInput.value || 0);
  const note = refs.renewalNoteInput.value.trim();
  const actionRecord = {
    date: getTodayString(),
    packageId,
    packageName,
    packageHours,
    giftHours,
    receivedAmount,
    note
  };

  enrollmentRecords = enrollmentRecords.map((record) => {
    if (Number(record.id) !== Number(renewingStudentId)) return record;
    const renewalLogs = Array.isArray(record.renewalLogs) ? record.renewalLogs : [];
    return {
      ...record,
      packageId,
      packageName,
      paidHours: Number(record.paidHours || 0) + packageHours,
      giftHoursTotal: Number(record.giftHoursTotal || 0) + giftHours,
      renewalLogs: [...renewalLogs, actionRecord],
      remark: note
        ? [record.remark, `${getTodayString()}\u7EED\u8D39\u5907\u6CE8\uFF1A${note}`].filter(Boolean).join("\uFF1B")
        : record.remark
    };
  });

  transactions.unshift({
    id: uid(),
    date: getTodayString(),
    studentName: target.studentName,
    type: "\u7EED\u8D39",
    amount: receivedAmount,
    note: `${packageName} \u7EED\u8D39\uFF0C\u8D60\u9001 ${giftHours} \u8BFE\u65F6`,
    campus: target.campus || "\u603B\u90E8\u6821\u533A",
    course: target.courseName,
    category: "\u5B66\u8D39",
    itemName: "",
    sourceType: "renewal",
    sourceId: renewingStudentId
  });

  closeModal(refs.renewalFormModal);
  renderStudents(refs.studentSearch.value || "");
  renderEnrollmentRecords();
  renderTransactions();
  renderRenewalList();
  renderSessionWorkspace();
  showToast("\u7EED\u8D39\u5DF2\u4FDD\u5B58\uFF0C\u5B66\u5458\u8BFE\u65F6\u548C\u6D41\u6C34\u5DF2\u540C\u6B65\u66F4\u65B0\u3002");
}
