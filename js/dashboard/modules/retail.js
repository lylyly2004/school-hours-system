function resetRetailForm() {
  editingRetailId = null;
  refs.retailFormTitle.textContent = "新增零售";
  refs.saveRetailBtn.textContent = "保存记录";
  refs.retailDateInput.value = getTodayString();
  refs.retailItemInput.value = "";
  refs.retailQuantityInput.value = "1";
  refs.retailUnitPriceInput.value = "0";
  refs.retailAmountInput.value = "0";
  refs.retailBuyerInput.value = "";
  refs.retailPaymentInput.value = "";
  refs.retailOperatorInput.value = "";
  refs.retailRemarkInput.value = "";
  populateRetailBaseOptions();
  populateCourseOptions(courses[0]?.name || "");
}

function openRetailModal(recordId = null) {
  resetRetailForm();
  if (recordId) {
    const record = retailRecords.find((item) => item.id === recordId);
    if (!record) return;
    editingRetailId = record.id;
    refs.retailFormTitle.textContent = "编辑零售";
    refs.saveRetailBtn.textContent = "保存修改";
    refs.retailDateInput.value = record.date;
    refs.retailItemInput.value = record.itemName;
    refs.retailCategoryInput.value = record.category;
    refs.retailCampusInput.value = record.campus;
    refs.retailCourseInput.value = record.course;
    refs.retailQuantityInput.value = String(record.quantity);
    refs.retailUnitPriceInput.value = String(record.unitPrice);
    refs.retailAmountInput.value = String(record.amount);
    refs.retailBuyerInput.value = record.buyer;
    refs.retailPaymentInput.value = record.paymentMethod;
    refs.retailOperatorInput.value = record.operator;
    refs.retailRemarkInput.value = record.remark || "";
  }
  openModal(refs.retailModal);
}

function syncRetailTransaction(record) {
  transactions = transactions.filter((item) => !(item.sourceType === "retail" && item.sourceId === record.id));
  transactions.unshift({
    id: uid(),
    date: record.date,
    studentName: record.buyer,
    type: "教材零售",
    amount: Number(record.amount),
    note: `${record.itemName}，数量 ${record.quantity}，收款方式：${record.paymentMethod}`,
    campus: record.campus,
    course: record.course,
    category: record.category,
    itemName: record.itemName,
    sourceType: "retail",
    sourceId: record.id
  });
}

function syncRetailToday(record) {
  todayRecords.unshift({
    id: uid(),
    date: record.date,
    time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }),
    item: "教材购买",
    target: record.buyer,
    course: record.course,
    status: "已完成"
  });
}

function saveRetail() {
  const isEditing = Boolean(editingRetailId);
  const payload = {
    id: editingRetailId || uid(),
    date: refs.retailDateInput.value,
    itemName: refs.retailItemInput.value.trim(),
    category: refs.retailCategoryInput.value,
    campus: refs.retailCampusInput.value,
    course: refs.retailCourseInput.value,
    quantity: Number(refs.retailQuantityInput.value || 0),
    unitPrice: Number(refs.retailUnitPriceInput.value || 0),
    amount: Number(refs.retailAmountInput.value || 0) || Number(refs.retailQuantityInput.value || 0) * Number(refs.retailUnitPriceInput.value || 0),
    buyer: refs.retailBuyerInput.value.trim(),
    paymentMethod: refs.retailPaymentInput.value.trim(),
    operator: refs.retailOperatorInput.value.trim(),
    remark: refs.retailRemarkInput.value.trim()
  };

  if (!payload.date || !payload.itemName || !payload.quantity || !payload.unitPrice || !payload.buyer) {
    showToast("请完整填写零售信息");
    return;
  }

  if (isEditing) {
    retailRecords = retailRecords.map((item) => item.id === editingRetailId ? payload : item);
  } else {
    retailRecords.unshift(payload);
    syncRetailToday(payload);
  }

  syncRetailTransaction(payload);
  closeModal(refs.retailModal);
  renderRetailRecords();
  renderTransactions();
  renderTodayRecords();
  showToast(isEditing ? "零售记录已更新，并已同步流水" : "零售记录已保存，并已同步到流水");
}

function renderRetailRecords() {
  if (retailRecords.length === 0) {
    refs.retailTableBody.innerHTML = `<tr><td colspan="8">当前还没有零售记录。</td></tr>`;
    return;
  }
  refs.retailTableBody.innerHTML = retailRecords.map((record) => `
    <tr>
      <td>${record.date}</td>
      <td>${record.itemName}</td>
      <td>${record.category}</td>
      <td>${record.quantity}</td>
      <td>${record.unitPrice}</td>
      <td>${record.amount}</td>
      <td>${record.buyer}</td>
      <td>
        <button class="table-edit-btn" type="button" data-edit-retail-id="${record.id}">编辑</button>
        <button class="table-detail-btn" type="button" data-detail-retail-id="${record.id}">详情</button>
        <button class="table-action-btn" type="button" data-delete-retail-id="${record.id}">删除</button>
      </td>
    </tr>
    <tr class="detail-row hidden" id="retail-detail-row-${record.id}">
      <td colspan="8">
        <div class="record-detail-box">
          <div><strong>校区：</strong>${record.campus || "-"}</div>
          <div><strong>关联课程：</strong>${record.course || "-"}</div>
          <div><strong>收款方式：</strong>${record.paymentMethod || "-"}</div>
          <div><strong>经办人：</strong>${record.operator || "-"}</div>
          <div><strong>备注：</strong>${record.remark || "-"}</div>
        </div>
      </td>
    </tr>
  `).join("");
}

