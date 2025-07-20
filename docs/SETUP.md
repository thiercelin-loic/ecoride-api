# 🚀 EcoRide Setup Guide

## Prerequisites

Before setting up EcoRide, ensure you have the following installed on your system:

### Required Software

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **MySQL**: Version 8.x or higher
- **Git**: For version control

### System Requirements

- **RAM**: Minimum 4GB, recommended 8GB
- **Storage**: At least 1GB free space
- **OS**: Linux, macOS, or Windows 10/11

## Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd ecoride-api

# Or if you're starting fresh
mkdir ecoride-api
cd ecoride-api
git init
```

### 2. Install Dependencies

```bash
# Install project dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Environment Configuration

Create environment configuration file:

```bash
# Copy example environment file
cp .env.example .env

# Edit the environment file
nano .env  # or use your preferred editor
```

Configure the following environment variables:

```env
# Application Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=ecoride_app
DB_PASSWORD=your_secure_password_here
DB_DATABASE=ecoride

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRATION=24h

# Security Configuration
BCRYPT_ROUNDS=12

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Database Setup

#### 4.1 Create MySQL Database

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE ecoride CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user
CREATE USER 'ecoride_app'@'localhost' IDENTIFIED BY 'your_secure_password_here';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ecoride.* TO 'ecoride_app'@'localhost';
GRANT CREATE, ALTER, DROP, INDEX, REFERENCES ON ecoride.* TO 'ecoride_app'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

#### 4.2 Run Database Security Script

Execute the provided security setup script:

```bash
# Make script executable
chmod +x setup-database-security.sh

# Run the script
./setup-database-security.sh
```

#### 4.3 Initialize Database Schema

```bash
# Run migrations (TypeORM will auto-create tables in development)
npm run start:dev

# Or manually run TypeORM commands
npx typeorm schema:sync
```

### 5. Start the Application

#### Development Mode

```bash
# Start in development mode with hot reload
npm run start:dev

# The server will start on http://localhost:3000
```

#### Production Mode

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### 6. Verify Installation

#### 6.1 Health Check

```bash
# Check if the server is running
curl http://localhost:3000/health

# Expected response: {"status":"ok","timestamp":"..."}
```

#### 6.2 API Documentation

Open your browser and navigate to:
- **Swagger UI**: http://localhost:3000/api
- **API Endpoints**: http://localhost:3000

#### 6.3 Run Tests

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Run test coverage
npm run test:cov
```

## Advanced Configuration

### SSL/TLS Configuration

For production environments, configure HTTPS:

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/private-key.pem'),
    cert: fs.readFileSync('./secrets/public-certificate.pem'),
  };
  
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  
  await app.listen(3000);
}
bootstrap();
```

### CORS Configuration

Configure Cross-Origin Resource Sharing:

```typescript
// main.ts
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

### Rate Limiting

Configure API rate limiting:

```bash
# Install rate limiting package
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

### Logging Configuration

Configure application logging:

```typescript
// main.ts
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn'] 
      : ['log', 'debug', 'error', 'verbose', 'warn'],
  });
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();
```

## Docker Setup (Optional)

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "start:prod"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USERNAME=ecoride_app
      - DB_PASSWORD=secure_password
      - DB_DATABASE=ecoride
      - JWT_SECRET=your_jwt_secret
    depends_on:
      - mysql
    networks:
      - ecoride-network

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=ecoride
      - MYSQL_USER=ecoride_app
      - MYSQL_PASSWORD=secure_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - ecoride-network

volumes:
  mysql_data:

networks:
  ecoride-network:
    driver: bridge
```

### Run with Docker

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Testing Setup

### Authentication Testing

Run the authentication test script:

```bash
# Make script executable
chmod +x test-auth.sh

# Run authentication tests
./test-auth.sh
```

### Booking System Testing

Run the booking system test script:

```bash
# Make script executable
chmod +x test-booking-system.sh

# Run booking tests
./test-booking-system.sh
```

### Manual API Testing

Use curl or Postman to test endpoints:

```bash
# Test user registration
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "pseudo": "johndoe"
  }'

# Test user login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

## Development Tools

### VS Code Extensions

Recommended VS Code extensions:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode-remote.remote-containers",
    "ms-vscode.vscode-json"
  ]
}
```

### Git Hooks

Set up pre-commit hooks:

```bash
# Install husky
npm install --save-dev husky

# Initialize husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

### Code Quality Tools

Configure ESLint and Prettier:

```bash
# Install development dependencies
npm install --save-dev eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Performance Optimization

### Database Connection Pooling

Configure connection pooling in TypeORM:

```typescript
// database.providers.ts
{
  type: 'mysql',
  // ... other config
  extra: {
    connectionLimit: 10,
    acquireConnectionTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    dateStrings: false,
  },
}
```

### Caching Setup

Install and configure Redis for caching:

```bash
# Install Redis client
npm install redis @nestjs/cache-manager cache-manager-redis-store

# Configure caching module
```

```typescript
// app.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
})
export class AppModule {}
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `ECONNREFUSED` or `Access denied`

**Solution**:
```bash
# Check MySQL service status
sudo systemctl status mysql

# Start MySQL service
sudo systemctl start mysql

# Verify database credentials
mysql -u ecoride_app -p ecoride
```

#### 2. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use a different port
PORT=3001 npm run start:dev
```

#### 3. Environment Variables Not Loaded

**Error**: `JWT_SECRET is not defined`

**Solution**:
```bash
# Verify .env file exists
ls -la .env

# Check environment variables
cat .env

# Ensure .env is in project root
pwd
```

#### 4. TypeORM Synchronization Issues

**Error**: `Table doesn't exist` or `Column not found`

**Solution**:
```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE ecoride; CREATE DATABASE ecoride;"

# Restart application to trigger synchronization
npm run start:dev
```

### Debug Mode

Enable debug logging:

```env
# Add to .env file
DEBUG=*
LOG_LEVEL=debug
TYPEORM_LOGGING=true
```

### Performance Monitoring

Install performance monitoring:

```bash
# Install monitoring tools
npm install @nestjs/terminus @godaddy/terminus

# Add health check endpoint
```

## Security Checklist

### Pre-Production Security

- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable request validation
- [ ] Configure security headers
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Database backup strategy

### Environment-Specific Configuration

#### Development
- Detailed error messages
- Debug logging enabled
- Auto-reload enabled
- CORS permissive

#### Production
- Error messages hidden
- Minimal logging
- Auto-reload disabled
- CORS restrictive
- Security headers enabled
- Rate limiting strict

## Next Steps

After successful setup:

1. **Explore the API**: Use Swagger UI at http://localhost:3000/api
2. **Read the Documentation**: Check other docs in the `/docs` folder
3. **Run Tests**: Execute the test suite to verify functionality
4. **Customize Configuration**: Adjust settings for your environment
5. **Deploy**: Follow the deployment guide for production setup

For additional help, refer to:
- [API Documentation](./API.md)
- [Authentication Guide](./AUTHENTICATION.md)
- [Database Schema](./DATABASE.md)
- [Deployment Guide](./DEPLOYMENT.md)

Happy coding with EcoRide! 🌱🚗