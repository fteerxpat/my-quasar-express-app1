# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# 1. ติดตั้ง Dependencies (รวมถึงตัวอ่าน TypeScript)
COPY package*.json ./
RUN npm install

# 2. Copy ไฟล์ Prisma และ Config (.ts)
COPY prisma ./prisma/
COPY prisma.config.ts ./ 

# 3. *** สำคัญ: Generate Prisma Client ***
# Prisma 7 จะใช้ jiti ในการอ่านไฟล์ .ts โดยอัตโนมัติ
RUN npx prisma generate

# 4. Copy โค้ดทั้งหมด
COPY . .

# --- Stage 2: Production ---
FROM node:20-alpine
WORKDIR /app

# 5. ติดตั้ง OpenSSL (จำเป็นสำหรับ Prisma 7 บน Alpine)
RUN apk add --no-cache openssl

# 6. Copy ทุกอย่างจาก builder stage
COPY --from=builder /app /app

EXPOSE 3000

# ตรวจสอบว่า API พร้อมทำงาน
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/demo || exit 1

CMD ["node", "server.js"]