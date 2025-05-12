# Stage 1: install dependencies and build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only what’s needed for install
COPY package.json package-lock.json bun.lockb   ./
COPY tsconfig.json   ./
COPY next.config.js  ./
COPY postcss.config.js tailwind.config.js ./

# Install dependencies (using npm; if you prefer bun, adjust accordingly)
RUN npm ci

# Copy the rest of your source code
COPY . .

# Build the production Next.js app
RUN npm run build

# Stage 2: run the production build
FROM node:18-alpine AS runner

WORKDIR /app

# Install only production deps
COPY package.json package-lock.json bun.lockb ./
RUN npm ci --omit=dev

# Copy built files and next internals from builder
COPY --from=builder /app/.next        ./.next
COPY --from=builder /app/public       ./public
COPY --from=builder /app/next.config.js  ./next.config.js

# Expose the port Next.js uses by default
EXPOSE 3000

# Use the built-in Next.js start script
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
