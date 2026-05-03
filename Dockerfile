# ==============================
# Stage 1: Build React Frontend
# ==============================
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build


# ==============================
# Stage 2: Run Backend + Serve Frontend
# ==============================
FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./

# Copy frontend production build into backend public folder
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 5000

CMD ["node", "server.js"]