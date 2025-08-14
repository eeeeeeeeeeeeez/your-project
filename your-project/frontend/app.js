// ========== 前端 JavaScript ==========

const authSection = document.getElementById("auth");
const mainSection = document.getElementById("main");
const verifySection = document.getElementById("verifySection");

// 註冊
async function register() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!email || !username || !password) {
    alert("請填寫所有欄位");
    return;
  }

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  const data = await res.json();
  if (data.success) {
    alert("註冊成功，請查看 Gmail 收驗證碼");
    verifySection.style.display = "block";
  } else {
    alert(data.message);
  }
}

// 驗證 Email
async function verifyEmail() {
  const email = document.getElementById("email").value;
  const code = document.getElementById("verifyCode").value;

  const res = await fetch("/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  const data = await res.json();
  if (data.success) {
    alert("驗證成功，請登入");
    verifySection.style.display = "none";
  } else {
    alert(data.message);
  }
}

// 登入
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (data.success) {
    authSection.style.display = "none";
    mainSection.style.display = "block";
    loadTasks();
  } else {
    alert(data.message);
  }
}

// 讀取任務列表
async function loadTasks() {
  const res = await fetch("/tasks");
  const tasks = await res.json();

  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = `${task.title}（發布者: ${task.creator}）`;
    taskList.appendChild(li);
  });
}

// 發布任務
async function createTask() {
  const title = document.getElementById("taskTitle").value;
  const creator = document.getElementById("taskCreator").value;

  if (!title || !creator) {
    alert("請填寫任務名稱與你的名稱");
    return;
  }

  const res = await fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, creator }),
  });

  const data = await res.json();
  if (data.success) {
    document.getElementById("taskTitle").value = "";
    loadTasks();
  } else {
    alert(data.message);
  }
}
