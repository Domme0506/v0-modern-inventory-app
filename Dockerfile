# Dockerfile
FROM node:18-alpine AS base

# Arbeitsverzeichnis im Container
WORKDIR /app

# Abhängigkeiten installieren
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Build der Anwendung
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Produktionsimage
FROM base AS runner
ENV NODE_ENV production

# Runtime-Benutzer für bessere Sicherheit
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Anwendungsdateien kopieren
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Ports freigeben
EXPOSE 3000

# Startskript für Datenbankmigration und App-Start
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
