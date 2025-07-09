# Use the official Node.js 18 image as base
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run db:seed && npm run dev"]