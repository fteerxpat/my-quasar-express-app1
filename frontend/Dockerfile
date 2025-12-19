# Stage 1: Build Quasar SPA
FROM node:20-alpine AS builder

# 1. ลง Quasar CLI ทั่วโลก
RUN npm install -g @quasar/cli

WORKDIR /app

# 2. ก๊อปปี้ไฟล์ package
COPY package*.json ./

# 3. แก้ไขตรงนี้: เพิ่ม --ignore-scripts เพื่อไม่ให้มันรัน quasar prepare ตอนนี้
RUN npm install --legacy-peer-deps --ignore-scripts

# 4. ก๊อปปี้โค้ดและไฟล์ตั้งค่าทั้งหมด (รวมถึง quasar.config.js) เข้ามา
COPY . .

# 5. สั่ง Build (ขั้นตอนนี้จะจัดการเรื่องเตรียมไฟล์ให้เอง)
RUN npm run build

# Stage 2: Production (Nginx)
FROM nginx:1.27-alpine
COPY --from=builder /app/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]