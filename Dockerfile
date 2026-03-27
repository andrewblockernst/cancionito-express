# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Directorio para la base de datos SQLite (montar como volumen en producción)
RUN mkdir -p ./Data

EXPOSE 10000
CMD ["node", "dist/index.js"]
