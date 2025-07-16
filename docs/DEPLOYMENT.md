# 🚀 EcoRide Deployment Guide

## Overview

This guide covers deploying EcoRide API to production environments including cloud platforms, traditional servers, and containerized deployments.

## Production Readiness Checklist

### Security
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] HTTPS/TLS enabled
- [ ] CORS configured restrictively
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Input validation enforced
- [ ] Error handling sanitized

### Performance
- [ ] Database connection pooling configured
- [ ] Caching implemented
- [ ] Static assets optimized
- [ ] Compression enabled
- [ ] Database indexes optimized
- [ ] Query performance tested

### Monitoring
- [ ] Health checks implemented
- [ ] Logging configured
- [ ] Error tracking setup
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Alerting rules defined

### Backup & Recovery
- [ ] Database backup strategy implemented
- [ ] Backup testing performed
- [ ] Recovery procedures documented
- [ ] Data retention policies defined

## Environment Configuration

### Production Environment Variables

```env
# Application
NODE_ENV=production
PORT=3000
API_PREFIX=api

# Database
DB_HOST=your-db-host.com
DB_PORT=3306
DB_USERNAME=ecoride_prod
DB_PASSWORD=your_very_secure_production_password
DB_DATABASE=ecoride_production
DB_SSL=true
DB_CONNECTION_LIMIT=20

# JWT & Security
JWT_SECRET=your_super_secure_jwt_production_secret_key_here
JWT_EXPIRATION=24h
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# SSL/TLS
SSL_CERT_PATH=/etc/ssl/certs/ecoride.crt
SSL_KEY_PATH=/etc/ssl/private/ecoride.key

# Logging
LOG_LEVEL=warn
LOG_FILE_PATH=/var/log/ecoride/app.log

# Monitoring
HEALTH_CHECK_ENDPOINT=/health
METRICS_ENDPOINT=/metrics

# Email (if implemented)
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=smtp_password
```

## Cloud Deployment Options

### 1. AWS Deployment

#### AWS App Runner

```yaml
# apprunner.yaml
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - npm ci
      - npm run build
run:
  runtime-version: 18.17.0
  command: npm run start:prod
  network:
    port: 3000
    env: PORT
  env:
    - name: NODE_ENV
      value: production
    - name: DB_HOST
      value: your-rds-endpoint.amazonaws.com
    - name: JWT_SECRET
      value: your-jwt-secret
```

#### AWS Elastic Beanstalk

```json
// .ebextensions/environment.config
{
  "option_settings": [
    {
      "namespace": "aws:elasticbeanstalk:application:environment",
      "option_name": "NODE_ENV",
      "value": "production"
    },
    {
      "namespace": "aws:elasticbeanstalk:application:environment", 
      "option_name": "PORT",
      "value": "3000"
    }
  ]
}
```

#### AWS ECS with Fargate

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  ecoride-api:
    image: your-account.dkr.ecr.region.amazonaws.com/ecoride-api:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=${DB_HOST}
      - JWT_SECRET=${JWT_SECRET}
    logging:
      driver: awslogs
      options:
        awslogs-group: /ecs/ecoride-api
        awslogs-region: us-east-1
        awslogs-stream-prefix: ecs
```

### 2. Google Cloud Platform

#### Cloud Run

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/ecoride-api:$COMMIT_SHA', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/ecoride-api:$COMMIT_SHA']
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'ecoride-api'
      - '--image=gcr.io/$PROJECT_ID/ecoride-api:$COMMIT_SHA'
      - '--region=us-central1'
      - '--platform=managed'
      - '--allow-unauthenticated'
```

#### App Engine

```yaml
# app.yaml
runtime: nodejs18

env_variables:
  NODE_ENV: production
  JWT_SECRET: your-jwt-secret
  DB_HOST: /cloudsql/your-project:region:instance

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6

vpc_access_connector:
  name: projects/your-project/locations/region/connectors/your-connector
```

### 3. Microsoft Azure

#### Azure App Service

```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  - group: production-variables

stages:
  - stage: Build
    jobs:
      - job: Build
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'
          - script: |
              npm ci
              npm run build
          - task: ArchiveFiles@2
            inputs:
              rootFolderOrFile: '$(System.DefaultWorkingDirectory)'
              includeRootFolder: false
              archiveFile: '$(Build.ArtifactStagingDirectory)/drop.zip'
          - task: PublishBuildArtifacts@1

  - stage: Deploy
    jobs:
      - deployment: Deploy
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: 'your-subscription'
                    appName: 'ecoride-api'
                    package: '$(Pipeline.Workspace)/drop/drop.zip'
```

### 4. Heroku Deployment

```json
// package.json - Add Heroku scripts
{
  "scripts": {
    "heroku-postbuild": "npm run build",
    "start": "node dist/main.js"
  },
  "engines": {
    "node": "18.x",
    "npm": "8.x"
  }
}
```

```yaml
# heroku.yml
build:
  docker:
    web: Dockerfile.prod
run:
  web: npm run start:prod
```

```bash
# Heroku deployment commands
heroku create ecoride-api
heroku addons:create cleardb:ignite
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-jwt-secret
git push heroku main
```

## Docker Production Setup

### Multi-stage Dockerfile

```dockerfile
# Dockerfile.prod
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Switch to app user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "dist/main.js"]
```

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  ecoride-api:
    build:
      context: .
      dockerfile: Dockerfile.prod
    restart: unless-stopped
    ports:
      - "${PORT:-3000}:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_DATABASE=${DB_DATABASE}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - ecoride-network
    volumes:
      - ./logs:/var/log/ecoride
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${DB_DATABASE}
      - MYSQL_USER=${DB_USERNAME}
      - MYSQL_PASSWORD=${DB_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/conf.d:/etc/mysql/conf.d
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10
    networks:
      - ecoride-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - ecoride-api
    networks:
      - ecoride-network

  redis:
    image: redis:alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - ecoride-network

volumes:
  mysql_data:
  redis_data:

networks:
  ecoride-network:
    driver: bridge
```

## Load Balancer Configuration

### Nginx Configuration

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream ecoride_backend {
        server ecoride-api:3000;
        # Add more servers for load balancing
        # server ecoride-api-2:3000;
        # server ecoride-api-3:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/ecoride.crt;
        ssl_certificate_key /etc/nginx/ssl/ecoride.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;

        # Security Headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

        # Gzip Compression
        gzip on;
        gzip_types
            text/plain
            text/css
            text/js
            text/xml
            text/javascript
            application/javascript
            application/xml+rss
            application/json;

        location / {
            # Rate limiting
            limit_req zone=api burst=20 nodelay;

            # Proxy to backend
            proxy_pass http://ecoride_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check endpoint
        location /health {
            proxy_pass http://ecoride_backend/health;
            access_log off;
        }

        # Static files (if any)
        location /static/ {
            alias /var/www/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## Database Production Setup

### MySQL Production Configuration

```ini
# mysql/conf.d/production.cnf
[mysqld]
# Connection settings
max_connections = 200
connect_timeout = 10
wait_timeout = 600
max_allowed_packet = 64M
thread_cache_size = 128

# Buffer pool settings
innodb_buffer_pool_size = 1G
innodb_buffer_pool_instances = 4
innodb_log_file_size = 512M
innodb_log_buffer_size = 64M

# Performance settings
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
innodb_io_capacity = 1000

# Security settings
skip-name-resolve
ssl-ca = /etc/mysql/ssl/ca.pem
ssl-cert = /etc/mysql/ssl/server-cert.pem
ssl-key = /etc/mysql/ssl/server-key.pem

# Logging
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
log_queries_not_using_indexes = 1

# Binary logging for replication
log-bin = mysql-bin
server-id = 1
binlog_format = ROW
expire_logs_days = 7
```

### Database Replication Setup

```sql
-- Master database configuration
CREATE USER 'replication'@'%' IDENTIFIED BY 'secure_replication_password';
GRANT REPLICATION SLAVE ON *.* TO 'replication'@'%';
FLUSH PRIVILEGES;

-- Show master status
SHOW MASTER STATUS;
```

```sql
-- Slave database configuration
CHANGE MASTER TO
  MASTER_HOST='master-db-host',
  MASTER_USER='replication',
  MASTER_PASSWORD='secure_replication_password',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=154;

START SLAVE;
SHOW SLAVE STATUS\G
```

## Monitoring and Logging

### Application Monitoring

```typescript
// monitoring.service.ts
import { Injectable } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.checkMemoryUsage(),
      () => this.checkDiskSpace(),
    ]);
  }

  private async checkMemoryUsage() {
    const used = process.memoryUsage();
    const isHealthy = used.heapUsed < 1024 * 1024 * 1024; // 1GB limit
    
    return {
      memory: {
        status: isHealthy ? 'up' : 'down',
        heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
      },
    };
  }

  private async checkDiskSpace() {
    // Implement disk space check
    return { disk: { status: 'up' } };
  }
}
```

### Logging Configuration

```typescript
// logger.config.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: '/var/log/ecoride/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: '/var/log/ecoride/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile.prod
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Deploy to production
        run: |
          # Add your deployment commands here
          echo "Deploying to production..."
```

## Security Hardening

### Application Security

```typescript
// security.config.ts
import helmet from 'helmet';
import * as compression from 'compression';

export function configureSecurity(app) {
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // Compression
  app.use(compression());

  // Request size limiting
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
}
```

### Environment Security

```bash
#!/bin/bash
# security-hardening.sh

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install fail2ban for intrusion prevention
sudo apt install fail2ban -y

# Configure firewall
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw --force enable

# Secure MySQL installation
sudo mysql_secure_installation

# Create non-root user for application
sudo useradd -m -s /bin/bash ecoride
sudo usermod -aG sudo ecoride

# Set up SSL certificates with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Backup Strategy

### Automated Backup Script

```bash
#!/bin/bash
# backup-production.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/ecoride"
S3_BUCKET="ecoride-backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u $DB_USERNAME -p$DB_PASSWORD $DB_DATABASE | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Application files backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /opt/ecoride-api

# Upload to S3
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz s3://$S3_BUCKET/database/
aws s3 cp $BACKUP_DIR/app_backup_$DATE.tar.gz s3://$S3_BUCKET/application/

# Clean local backups older than 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

# Set up cron job
# 0 2 * * * /opt/scripts/backup-production.sh
```

## Performance Optimization

### Application Optimization

```typescript
// performance.config.ts
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'redis',
      port: 6379,
      ttl: 300, // 5 minutes
      max: 1000, // maximum number of items in cache
    }),
  ],
})
export class AppModule {}
```

### Database Optimization

```sql
-- Production database optimizations
-- Analyze tables for query optimization
ANALYZE TABLE users, cars, codriving, bookings, reviews;

-- Optimize frequently used queries
OPTIMIZE TABLE users, cars, codriving, bookings, reviews;

-- Create indexes for common queries
CREATE INDEX idx_codriving_location_date ON codriving(startLocation, endLocation, startDate);
CREATE INDEX idx_bookings_user_status ON bookings(passengerId, status);
CREATE INDEX idx_reviews_rating ON reviews(revieweeId, rating);
```

## Troubleshooting Production Issues

### Common Production Issues

1. **High Memory Usage**
   ```bash
   # Monitor memory usage
   free -h
   top -p $(pgrep node)
   
   # Check for memory leaks
   node --inspect=0.0.0.0:9229 dist/main.js
   ```

2. **Database Connection Issues**
   ```bash
   # Check connection pool
   SHOW PROCESSLIST;
   SHOW STATUS LIKE 'Threads%';
   
   # Monitor connections
   watch -n 1 'mysql -e "SHOW PROCESSLIST"'
   ```

3. **High CPU Usage**
   ```bash
   # Check CPU usage
   htop
   iostat 1
   
   # Profile application
   node --prof dist/main.js
   ```

### Emergency Procedures

```bash
# Emergency restart script
#!/bin/bash
# emergency-restart.sh

echo "Emergency restart initiated at $(date)"

# Stop application
docker-compose -f docker-compose.prod.yml down

# Check system resources
free -h
df -h

# Restart application
docker-compose -f docker-compose.prod.yml up -d

# Verify services
sleep 30
curl -f http://localhost:3000/health || echo "Health check failed"

echo "Emergency restart completed at $(date)"
```

This comprehensive deployment guide ensures your EcoRide API is production-ready with proper security, monitoring, and scalability considerations.
