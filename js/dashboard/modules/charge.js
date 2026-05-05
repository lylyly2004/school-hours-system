function openChargePackageModal(packageId = null) {
  editingChargePackageId = packageId;
  const target = chargePackages.find((pkg) => Number(pkg.id) === Number(packageId));

  refs.chargePackageFormTitle.textContent = target ? "编辑收费模式" : "新增收费模式";
  refs.saveChargePackageBtn.textContent = target ? "保存修改" : "保存收费模式";
  refs.chargePackageNameInput.value = target?.name || "";
  refs.chargePackageHoursInput.value = String(target?.hours ?? 24);
  refs.chargePackagePriceInput.value = String(target?.price ?? 0);

  openModal(refs.chargePackageModal);
}

function closeChargePackageModal() {
  editingChargePackageId = null;
  closeModal(refs.chargePackageModal);
}

function renameChargePackageAcrossSystem(oldName, nextPackage) {
  if (!oldName || oldName === nextPackage.name) return;

  enrollmentRecords = enrollmentRecords.map((record) => {
    const nextRenewalLogs = Array.isArray(record.renewalLogs)
      ? record.renewalLogs.map((log) => (
        log.packageName === oldName ? { ...log, packageName: nextPackage.name } : log
      ))
      : [];

    return {
      ...record,
      packageName: record.packageName === oldName ? nextPackage.name : record.packageName,
      enrollmentPackageName: record.enrollmentPackageName === oldName ? nextPackage.name : record.enrollmentPackageName,
      renewalLogs: nextRenewalLogs
    };
  });
}

function getChargePackageBlockingStudents(packageName) {
  return enrollmentRecords.filter((record) => (
    (record.studentStatus || "active") !== "refunded" &&
    record.packageName === packageName
  ));
}

function getChargePackageDeleteBlockReason(pkg) {
  const blockingStudents = getChargePackageBlockingStudents(pkg.name);
  if (blockingStudents.length > 0) {
    return "该收费模式还有在读或停课学员使用";
  }
  return "";
}

function deleteChargePackage(packageId) {
  const target = chargePackages.find((pkg) => Number(pkg.id) === Number(packageId));
  if (!target) return;

  const blockingStudents = getChargePackageBlockingStudents(target.name);
  if (blockingStudents.length > 0) {
    showToast("该收费模式还有在读或停课学员使用");
    return;
  }

  if (!window.confirm(`确认删除收费模式“${target.name}”吗？`)) {
    return;
  }

  chargePackages = chargePackages.filter((pkg) => Number(pkg.id) !== Number(packageId));
  populatePackageOptions(chargePackages[0]?.name || "");
  renderChargePackages();
  if (typeof renderStudents === "function") {
    renderStudents(refs.studentSearch?.value || "");
  }
  if (typeof renderRenewalList === "function") {
    renderRenewalList();
  }
  showToast("收费模式已删除");
}

function saveChargePackage() {
  const name = refs.chargePackageNameInput.value.trim();
  const hours = Number(refs.chargePackageHoursInput.value || 0);
  const price = Number(refs.chargePackagePriceInput.value || 0);
  const isEditing = Boolean(editingChargePackageId);

  if (!name || hours <= 0 || price < 0) {
    showToast("请完整填写收费模式信息");
    return;
  }

  const duplicated = chargePackages.some((pkg) => (
    pkg.name === name && Number(pkg.id) !== Number(editingChargePackageId)
  ));
  if (duplicated) {
    showToast("该收费模式已存在");
    return;
  }

  if (isEditing) {
    const previousPackage = chargePackages.find((pkg) => Number(pkg.id) === Number(editingChargePackageId));
    chargePackages = chargePackages.map((pkg) => (
      Number(pkg.id) === Number(editingChargePackageId)
        ? { ...pkg, name, hours, price }
        : pkg
    ));
    renameChargePackageAcrossSystem(previousPackage?.name || "", { name, hours, price });
  } else {
    chargePackages.unshift({ id: uid(), name, hours, price });
  }

  const selectedPackageName = name;
  populatePackageOptions(selectedPackageName);
  renderChargePackages();
  if (typeof renderStudents === "function") {
    renderStudents(refs.studentSearch?.value || "");
  }
  if (typeof renderRenewalList === "function") {
    renderRenewalList();
  }
  closeChargePackageModal();
  showToast(isEditing ? "收费模式已更新" : "收费模式已新增");
}

function renderChargePackages() {
  refs.chargePackageList.innerHTML = chargePackages.map((pkg) => `
    <article class="pricing-card">
      <div class="pricing-card-head">
        <div>
          <h4>${pkg.name}</h4>
          <p>标准收费模式</p>
        </div>
        <div class="inline-actions">
          <button class="table-edit-btn" type="button" data-edit-charge-package-id="${pkg.id}">编辑</button>
          <button class="table-action-btn" type="button" data-delete-charge-package-id="${pkg.id}" data-delete-charge-allowed="${getChargePackageBlockingStudents(pkg.name).length === 0 ? "true" : "false"}" data-delete-charge-reason="${getChargePackageDeleteBlockReason(pkg)}">删除</button>
        </div>
      </div>
      <strong>${pkg.hours} 课时</strong>
      <p>收费金额：${pkg.price}</p>
    </article>
  `).join("");
}
