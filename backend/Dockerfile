# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# 1. Copy package files ก่อนเพื่อใช้ Docker Layer Caching
COPY package*.json ./

# 2. Install dependencies
# แนะนำให้ลบ --ignore-scripts ออกเพื่อให้มั่นใจว่า libs อื่นๆ ทำงานได้สมบูรณ์
RUN npm ci

# 3. Copy source code ทั้งหมด (รวมถึงโฟลเดอร์ prisma)
COPY . .

# 4. --- ส่วนสำคัญ: Generate Prisma Client ---
# ใช้ dummy URL เพื่อให้ผ่าน validation ช่วง build
# คำสั่งนี้จะสร้างไฟล์ client ไปไว้ใน node_modules/@prisma/client
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# ---------------------------------------

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# *** เพิ่ม: ติดตั้ง OpenSSL ***
# Prisma Engine ต้องการ OpenSSL ในการทำงานบน Alpine Linux
RUN apk add --no-cache openssl

# Copy ไฟล์ทั้งหมดจาก builder (รวม node_modules ที่ generate prisma แล้ว)
COPY --from=builder /app /app

# สร้าง logs dir
RUN mkdir -p logs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/demo || exit 1

EXPOSE 3000
CMD ["node", "server.js"]