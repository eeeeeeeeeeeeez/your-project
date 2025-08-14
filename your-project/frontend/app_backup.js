async function register(){
  const email=document.getElementById('email').value;
  const username=document.getElementById('username').value;
  const password=document.getElementById('password').value;

  const res=await fetch('/register',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,username,password})
  });
  const data=await res.json();
  alert(data.message);
  if(res.ok) document.getElementById('verifySection').style.display='block';
}

async function verifyEmail(){
  const email=document.getElementById('email').value;
  const code=document.getElementById('verifyCode').value;

  const res=await fetch('/verify',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,code})
  });
  const data=await res.json();
  alert(data.message);
  if(res.ok) document.getElementById('verifySection').style.display='none';
}

async function login(){
  const email=document.getElementById('loginEmail').value;
  const password=document.getElementById('loginPassword').value;

  const res=await fetch('/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
  });
  const data=await res.json();
  alert(data.message);
  if(res.ok){
    document.getElementById('auth').style.display='none';
    document.getElementById('main').style.display='block';
    loadTasks();
  }
}

async function createTask(){
  const title=document.getElementById('taskTitle').value;
  const creator=document.getElementById('taskCreator').value;

  const res=await fetch('/task',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({title,creator})
  });
  const data=await res.json();
  alert(data.message);
  loadTasks();
}

async function loadTasks(){
  const res=await fetch('/tasks');
  const tasks=await res.json();

  const taskList=document.getElementById('taskList');
  taskList.innerHTML='';
  tasks.forEach(t=>{
    const li=document.createElement('li');
    li.textContent=`${t.title} (發布者: ${t.creator})`;
    taskList.appendChild(li);
  });
}
