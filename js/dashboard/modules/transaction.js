function getFilteredTransactions() {
  return transactions.filter((record) => {
    const from = refs.transactionDateFrom.value;
    const to = refs.transactionDateTo.value;
    const campus = refs.transactionCampusFilter.value;
    const course = refs.transactionCourseFilter.value;
    const category = refs.transactionCategoryFilter.value;
    const studentKeyword = refs.transactionStudentKeyword.value.trim();
    const itemKeyword = refs.transactionItemKeyword.value.trim();

    if (from && record.date < from) return false;
    if (to && record.date > to) return false;
    if (campus && campus !== "鍏ㄩ儴鏍″尯" && record.campus !== campus) return false;
    if (course && course !== "鍏ㄩ儴璇剧▼" && record.course !== course) return false;
    if (category && category !== "鍏ㄩ儴鍒嗙被" && record.category !== category) return false;
    if (studentKeyword && !String(record.studentName || "").includes(studentKeyword)) return false;
    if (itemKeyword && !String(record.itemName || "").includes(itemKeyword)) return false;
    return true;
  });
}

function renderTransactions() {
  const filtered = getFilteredTransactions();
  const total = filtered.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const tuition = filtered.filter((item) => item.category === "瀛﹁垂").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const retail = filtered.filter((item) => item.type === "鏁欐潗闆跺敭").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const other = total - tuition - retail;

  refs.transactionTotalAmount.textContent = formatMoney(total);
  refs.transactionTuitionAmount.textContent = formatMoney(tuition);
  refs.transactionRetailAmount.textContent = formatMoney(retail);
  refs.transactionOtherAmount.textContent = formatMoney(other);

  if (filtered.length === 0) {
    refs.transactionTableBody.innerHTML = `<tr><td colspan="9">褰撳墠娌℃湁鍖归厤鐨勬祦姘磋褰曘€?/td></tr>`;
    return;
  }

  refs.transactionTableBody.innerHTML = filtered.map((record) => `
    <tr>
      <td>${record.date}</td>
      <td>${record.studentName || "-"}</td>
      <td>${record.type || "-"}</td>
      <td>${record.amount}</td>
      <td>${record.campus || "-"}</td>
      <td>${record.course || "-"}</td>
      <td>${record.category || "-"}</td>
      <td>${record.itemName || "-"}</td>
      <td>${record.note || "-"}</td>
    </tr>
  `).join("");
}

function renderTodayRecords() {
  const filtered = getFilteredTodayRecords();

  if (filtered.length === 0) {
    refs.todayTableBody.innerHTML = `<tr><td colspan="6">褰撳墠娌℃湁鍖归厤鐨勫姙鐞嗚褰曘€?/td></tr>`;
    return;
  }

  refs.todayTableBody.innerHTML = filtered.map((record) => `
    <tr>
      <td>${record.date}</td>
      <td>${record.time}</td>
      <td>${record.item}</td>
      <td>${record.target}</td>
      <td>${record.course}</td>
      <td>${record.status}</td>
    </tr>
  `).join("");
}

function getFilteredTodayRecords() {
  const dateValue = refs.todayDateFilter.value;
  const courseValue = refs.todayCourseFilter.value;
  return todayRecords.filter((record) => {
    if (dateValue && record.date !== dateValue) return false;
    if (courseValue && courseValue !== "鍏ㄩ儴璇剧▼" && record.course !== courseValue) return false;
    return true;
  });
}
