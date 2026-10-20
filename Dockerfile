# Portable production image: runs on Suga, Hugging Face Spaces, Koyeb, Render, etc.
# Migrations are not run here; apply them from your machine with `npx prisma migrate deploy`.

FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Generates the Prisma client, compiles to dist/, then drops devDependencies.
RUN npm run build && npm prune --omit=dev

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3001
CMD ["node", "dist/main"]
