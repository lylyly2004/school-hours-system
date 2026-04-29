function renderClasses() {
  if (classes.length === 0) {
    refs.classTableBody.innerHTML = `<tr><td colspan="4">褰撳墠杩樻病鏈夌彮绾?/td></tr>`;
    return;
  }
  refs.classTableBody.innerHTML = classes.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.type}</td>
      <td>${getCurrentClassTeacher(item.name)}</td>
      <td>${getCurrentClassStudentCount(item.name)}</td>
    </tr>
  `).join("");
}

function addClass() {
  const className = refs.newClassInput.value.trim();
  const classType = refs.classTypeSelect.value;
  if (!className) {
    showToast("璇峰厛濉啓鐝骇鍚嶇О");
    return;
  }
  if (!classType) {
    showToast("璇峰厛閫夋嫨鐝骇绫诲瀷");
    return;
  }
  if (classes.some((item) => item.name === className)) {
    showToast("璇ョ彮绾у悕绉板凡瀛樺湪");
    return;
  }
  classes.unshift({
    id: uid(),
    name: className,
    type: classType
  });
  refs.newClassInput.value = "";
  populateClassOptions(className);
  renderClasses();
  showToast("鐝骇宸插垱寤猴紝鍙湪鏂扮敓鎶ュ悕涓€夋嫨");
}
