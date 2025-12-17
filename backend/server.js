const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
// 1. เพิ่ม Prisma Client
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
// 2. สร้าง instance ของ Prisma
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// ... (ส่วน log directory เหมือนเดิม) ...
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Endpoint demo เดิม
app.get('/api/demo', (req, res) => {
    // ... (code เดิม) ...
    res.json({ status: 'ok' }); // ย่อเพื่อความกระชับ
});

// --- 3. เพิ่มส่วนนี้เข้าไปครับ ---
// API สำหรับดึง Tasks ทั้งหมด
app.get('/api/tasks', async (req, res) => {
  try {
    // ดึงข้อมูลจากตาราง task (เช็คชื่อ model ใน schema.prisma ด้วยนะครับ ว่าเป็น task หรือ Task)
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// API สำหรับสร้าง Task ใหม่ (เผื่อต้องใช้)
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: { title },
    });
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});
// ------------------------------

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});