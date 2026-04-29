function renderChargePackages() {
  refs.chargePackageList.innerHTML = chargePackages.map((pkg) => `
    <article class="pricing-card">
      <h4>${pkg.name}</h4>
      <strong>${pkg.hours} 课时</strong>
      <p>标准价格：${pkg.price}</p>
    </article>
  `).join("");
}
