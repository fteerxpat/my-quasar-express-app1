# Stage 1: Build Quasar SPA
FROM node:20-alpine AS builder
WORKDIR /app
# Copy package files และ install dependencies
COPY package*.json ./
<<<<<<< HEAD
RUN npm ci --legacy-peer-deps --ignore-scripts
=======
RUN npm ci --legacy-peer-deps  # เพิม --legacy-peer-deps ถ้ามี issue กับ dependencies
>>>>>>> a6c44ef8090586f6c7367d607d539226a88fcc07
# Copy source code
COPY . .
# Build Quasar (สําหรับ SPA)
RUN npm run build
# Stage 2: Production (Nginx serve static files)
FROM nginx:1.27-alpine
# Copy build artifacts จาก stage 1
COPY --from=builder /app/dist/spa /usr/share/nginx/html
# Expose port
EXPOSE 80
# Run Nginx
CMD ["nginx", "-g", "daemon off;"]