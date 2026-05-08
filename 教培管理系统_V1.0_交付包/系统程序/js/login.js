const loginForm = document.getElementById("loginForm");
const toast = document.getElementById("toast");

const DEFAULT_LOGIN_ACCOUNT = "admin";
const DEFAULT_LOGIN_PASSWORD = "123456";

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.add("hidden");
  }, 2200);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === DEFAULT_LOGIN_ACCOUNT && password === DEFAULT_LOGIN_PASSWORD) {
    sessionStorage.setItem("school-admin-auth", "true");
    window.location.href = "./dashboard.html";
    return;
  }

  showToast("账号或密码不正确");
});
