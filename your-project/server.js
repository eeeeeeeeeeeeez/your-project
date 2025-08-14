const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'frontend'))); // 前端靜態檔案

const dbFile = './db.json';
if(!fs.existsSync(dbFile)){
  fs.writeFileSync(dbFile, JSON.stringify({users:[], tasks:[]}, null,2));
}

// Nodemailer 設定 Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// 註冊
app.post('/register', async (req,res)=>{
  const {email, username, password} = req.body;
  const db = JSON.parse(fs.readFileSync(dbFile));
  if(db.users.find(u=>u.email===email)) return res.status(400).json({message:'Email 已被註冊'});

  const code = Math.floor(1000 + Math.random()*9000).toString();
  const hash = await bcrypt.hash(password,10);
  db.users.push({email, username, password:hash, verified:false, code});
  fs.writeFileSync(dbFile, JSON.stringify(db, null,2));

  transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: '三角洲平台驗證碼',
    text: `你的驗證碼是：${code}`
  }, (err, info)=>{
    if(err) return res.status(500).json({message:'寄信失敗'});
    return res.json({message:'驗證碼已寄送 Gmail'});
  });
});

// 驗證
app.post('/verify', (req,res)=>{
  const {email, code} = req.body;
  const db = JSON.parse(fs.readFileSync(dbFile));
  const user = db.users.find(u=>u.email===email);
  if(!user) return res.status(400).json({message:'帳號不存在'});
  if(user.code===code){
    user.verified = true;
    delete user.code;
    fs.writeFileSync(dbFile, JSON.stringify(db, null,2));
    return res.json({message:'驗證成功'});
  }
  return res.status(400).json({message:'驗證碼錯誤'});
});

// 登入
app.post('/login', async (req,res)=>{
  const {email, password} = req.body;
  const db = JSON.parse(fs.readFileSync(dbFile));
  const user = db.users.find(u=>u.email===email);
  if(!user) return res.status(400).json({message:'帳號不存在'});
  if(!user.verified) return res.status(400).json({message:'帳號未驗證'});
  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.status(400).json({message:'密碼錯誤'});
  res.json({message:'登入成功', username:user.username});
});

// 任務
app.post('/task', (req,res)=>{
  const {title, creator} = req.body;
  const db = JSON.parse(fs.readFileSync(dbFile));
  db.tasks.push({title, creator});
  fs.writeFileSync(dbFile, JSON.stringify(db, null,2));
  res.json({message:'任務發布成功'});
});

app.get('/tasks', (req,res)=>{
  const db = JSON.parse(fs.readFileSync(dbFile));
  res.json(db.tasks);
});

app.listen(3000, ()=>console.log('Server running on port 3000'));
