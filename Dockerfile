FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

COPY --from=builder /app/frontend/dist ./frontend/dist

COPY backend/ ./backend/

EXPOSE 5000

CMD ["node", "backend/src/index.js"]
