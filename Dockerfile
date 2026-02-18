# Build Arguments
ARG BUILD_NODE_VERSION=20-alpine

# Stage 1: Build stage
FROM node:${BUILD_NODE_VERSION} AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* ./

# Install dependencies
RUN npm ci

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime stage
FROM node:${BUILD_NODE_VERSION}

WORKDIR /app

# Environment variables
ENV NODE_ENV=production
ENV APP_PORT=3000
ENV SERVE_STATIC_DIR=dist

# Install serve to run the production build
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE ${APP_PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:${APP_PORT}', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["serve", "-s", "${SERVE_STATIC_DIR}", "-l", "${APP_PORT}"]
