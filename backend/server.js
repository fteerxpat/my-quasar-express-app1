const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(cors()); // อนุญาต cross-origin จาก frontend
app.use(express.json());

// สร้างโฟลเดอร์ logs ถ้ายังไม่มี
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// --- API Endpoints ---

// 1. ดึง Tasks ทั้งหมด
app.get('/api/tasks', async (req, res) => {
  try {
    // ดึงข้อมูลจากตาราง task (ตรวจสอบใน schema.prisma ว่าชื่อ model คือ task หรือ Task)
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// 2. สร้าง Task ใหม่
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: { title },
    });
    res.json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// 3. Endpoint demo: ส่งข้อมูล Git + Docker และบันทึก Log
app.get('/api/demo', (req, res) => {
  const logMessage = `Request at ${new Date().toISOString()}: ${req.ip}\n`;
  try {
    fs.appendFileSync(path.join(logsDir, 'access.log'), logMessage);
  } catch (err) {
    console.error('Failed to write log:', err);
  }

  res.json({
    git: {
      title: 'Advanced Git Workflow',
      detail: 'ใช้ branch protection บน GitHub, code review ใน PR, และ squash merge เพื่อ history ที่สะอาด'
    },
    docker: {
      title: 'Advanced Docker',
      detail: 'ใช้ multi-stage build, healthcheck ใน Dockerfile, และ orchestration ด้วย Compose'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});