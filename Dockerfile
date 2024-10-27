FROM node:alpine AS base
WORKDIR /app

RUN apk add --no-cache sqlite

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and generate Prisma Client
COPY . .

# Generate Prisma Client and initialize database
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image
FROM node:alpine AS runner
WORKDIR /app

RUN apk add --no-cache sqlite

# Add system user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create prisma directory
RUN mkdir -p /app/prisma
RUN chown -R nextjs:nodejs /app/prisma

# Copy built assets
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/prisma ./prisma

RUN chown -R nextjs:nodejs .

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]