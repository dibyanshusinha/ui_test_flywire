# Docker Setup for Flywire Frontend Challenge

This application is now fully Dockerized for easy deployment and consistent environments.

## Quick Start

### Using Docker Compose (Recommended)
```bash
# 1. Copy the example env file (first time only)
cp .env.example .env

# 2. Start the application
docker-compose up --build
```

The application will be available at `http://localhost:3000` (or whatever `APP_PORT` is set to in `.env`)

### Using Docker directly
```bash
# Build the image
docker build -t pokemon-app .

# Run the container
docker run -p 3000:3000 pokemon-app
```

## Files Included

- **Dockerfile**: Multi-stage build configuration with environment variable support
  - Stage 1: Builds the React/Vite application
  - Stage 2: Serves the built app using Node.js and `serve`
  - Includes non-root user for security

- **docker-compose.yml**: Docker Compose configuration using environment variables from `.env`

- **.dockerignore**: Specifies files and directories to exclude from the Docker build context

- **.env.example**: Template file showing all available environment variables with descriptions

- **.env**: Local environment configuration (should NOT be committed to version control)

## Environment Configuration

### Setup

1. Copy the example configuration (first time only):
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your desired settings:
   ```env
   NODE_ENV=production
   APP_PORT=3000
   CONTAINER_NAME=pokemon-app
   IMAGE_NAME=pokemon-app
   IMAGE_TAG=latest
   ```

### Available Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | production | Node environment mode |
| `APP_PORT` | 3000 | Port the application listens on |
| `CONTAINER_NAME` | pokemon-app | Docker container name |
| `IMAGE_NAME` | pokemon-app | Docker image name |
| `IMAGE_TAG` | latest | Docker image tag |
| `SERVE_STATIC_DIR` | dist | Static files directory |
| `HEALTHCHECK_INTERVAL` | 30 | Health check interval in seconds |
| `HEALTHCHECK_TIMEOUT` | 3 | Health check timeout in seconds |
| `HEALTHCHECK_RETRIES` | 3 | Health check retries |
| `HEALTHCHECK_START_PERIOD` | 5 | Health check start period in seconds |
| `LOG_LEVEL` | info | Application log level |
| `BUILD_NODE_VERSION` | 20-alpine | Node.js version for build |

### Git Best Practices

- ✅ **Commit**: `.env.example` - Version control the template
- ❌ **DO NOT Commit**: `.env` - Keep local secrets and configuration out of version control
- Add to `.gitignore`: `.env` is already ignored

## Architecture

The Dockerfile uses a multi-stage build process:

1. **Build Stage** (Alpine Node 20)
   - Installs dependencies using npm
   - Builds the Vite bundle to `dist/` folder
   - ARG support for customizable Node version

2. **Runtime Stage** (Alpine Node 20)
   - Uses a smaller base image for production
   - Installs `serve` globally to serve static files
   - Copies only the built artifacts from the build stage
   - Runs as non-root user (nodejs) for security
   - Exposes configurable port (default 3000)
   - Includes health checks

## Security Features

- Non-root user execution (`nodejs:1001`)
- Multi-stage build reduces attack surface
- Alpine Linux minimal base image
- Health checks for container orchestration

## Image Size

The multi-stage build significantly reduces the final image size by:
- Only copying production dependencies
- Excluding development dependencies
- Using Alpine-based images
- Non-root user without shell access

## Health Checks

The container includes a health check that verifies the app is responding on the configured port every 30 seconds (configurable via `HEALTHCHECK_INTERVAL`).

## Commands

### Development

While the Docker setup builds for production, for local development use:
```bash
npm install
npm run dev
```

### Production Build Locally

```bash
npm run build
npm run preview
```

### Testing

```bash
# Run tests in container
docker run --rm pokemon-app npm run test

# Or with docker-compose
docker-compose exec app npm run test:run
```

### Environment-specific Builds

Change `APP_PORT` in `.env` and rebuild:
```bash
# Edit .env
APP_PORT=8080

# Rebuild and start
docker-compose up --build
# App now available at http://localhost:8080
```

## Deployment

### Docker Hub / Registry

1. Build the image:
   ```bash
   docker build -t your-registry/pokemon-app:latest .
   ```

2. Push to registry:
   ```bash
   docker push your-registry/pokemon-app:latest
   ```

3. Deploy using your orchestration platform (Kubernetes, Docker Swarm, etc.)

### Environment Variables in Deployment

For production deployments:

1. Create a `.env` file in your deployment environment with production values
2. Or pass environment variables directly:
   ```bash
   docker run -e APP_PORT=3000 -e NODE_ENV=production pokemon-app
   ```

### Docker Compose Production Deployment

```bash
# Pull latest image
docker-compose pull

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## Troubleshooting

### Port already in use

Edit `.env` and change `APP_PORT`:
```bash
# .env
APP_PORT=8080

# Then restart
docker-compose down
docker-compose up --build
```

### Build failures

Ensure you have a `package-lock.json` file:
```bash
npm install
```

### View logs

```bash
# Docker Compose logs
docker-compose logs -f app

# Docker logs for specific container
docker logs pokemon-app -f
```

### Container exits immediately

```bash
# Check logs for errors
docker-compose logs app

# Rebuild without cache
docker-compose build --no-cache
docker-compose up
```

### Permission denied errors

The Dockerfile runs as non-root user `nodejs`. Ensure all required files are readable:
```bash
# Check file permissions
docker-compose exec app ls -la /app/dist
```

## Network Access

- From host: `http://localhost:${APP_PORT}` (default: `http://localhost:3000`)
- From other containers on the same network: `http://pokemon-app:${APP_PORT}`
- Network name: `pokemon-network` (when using docker-compose)

## Advanced Usage

### Custom Node Version

Override in `.env`:
```env
BUILD_NODE_VERSION=22-alpine
```

Then rebuild:
```bash
docker-compose build --no-cache
```

### Multi-stage Build Optimization

The Dockerfile uses Docker BuildKit features. Enable for faster builds:
```bash
export DOCKER_BUILDKIT=1
docker-compose build
```

### Health Check Testing

Test health check manually:
```bash
# Check container health
docker inspect pokemon-app --format='{{.State.Health.Status}}'

# Test endpoint directly
docker-compose exec app curl http://localhost:3000
```

## Clean Up

```bash
# Remove stopped containers
docker-compose down

# Remove all images
docker-compose down -v

# Remove specific image
docker rmi pokemon-app:latest

# Clean up unused resources
docker system prune
```

## Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js in Docker](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
