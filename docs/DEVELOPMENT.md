# 💻 EcoRide Development Guide

## Development Environment Setup

### Prerequisites

Ensure you have the following development tools installed:

- **Node.js** 18.x or higher
- **npm** 8.x or higher
- **MySQL** 8.x
- **Git**
- **VS Code** (recommended IDE)

### VS Code Extensions

Install these recommended extensions:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode-remote.remote-containers",
    "humao.rest-client"
  ]
}
```

### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  }
}
```

## Project Architecture

### Folder Structure

```
src/
├── api/                        # API Controllers & DTOs
│   ├── bookings/              # Booking management
│   │   ├── booking.controller.ts
│   │   ├── booking.module.ts
│   │   └── dto/
│   │       └── booking.dto.ts
│   ├── cars/                  # Vehicle management
│   ├── codriving/             # Trip management
│   ├── reviews/               # Review system
│   ├── search/                # Search functionality
│   └── users/                 # User management
├── auth/                      # Authentication system
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── guards/               # Auth guards
│   ├── strategies/           # Passport strategies
│   └── dto/                  # Auth DTOs
├── database/                  # Database layer
│   ├── database.module.ts
│   ├── database.providers.ts
│   └── [entity]/             # Entity-specific modules
│       ├── entity.entity.ts
│       ├── entity.service.ts
│       ├── entity.providers.ts
│       └── entity.module.ts
├── types/                     # TypeScript type definitions
│   ├── auth.types.ts
│   └── user.types.ts
├── app.module.ts             # Root module
└── main.ts                   # Application entry point
```

### Architecture Principles

1. **Modular Design**: Each feature is organized into its own module
2. **Separation of Concerns**: Clear separation between API, business logic, and data layers
3. **Dependency Injection**: NestJS DI container manages dependencies
4. **Type Safety**: Strong typing throughout the application
5. **Repository Pattern**: Database access abstracted through repositories

## Coding Standards

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### ESLint Configuration

```javascript
// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/prefer-const': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
);
```

### Prettier Configuration

```json
// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 80,
  "endOfLine": "lf"
}
```

## Development Workflow

### Git Workflow

1. **Feature Branch Model**:
   ```bash
   # Create feature branch
   git checkout -b feature/user-authentication
   
   # Work on feature
   git add .
   git commit -m "feat: implement JWT authentication"
   
   # Push and create PR
   git push origin feature/user-authentication
   ```

2. **Commit Message Convention**:
   ```
   type(scope): description
   
   feat: new feature
   fix: bug fix
   docs: documentation
   style: formatting
   refactor: code restructuring
   test: adding tests
   chore: maintenance
   ```

### Development Commands

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run start:dev

# Build application
npm run build

# Run tests
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Test coverage

# Linting and formatting
npm run lint          # Check linting
npm run lint:fix      # Fix linting issues
npm run format        # Format code with Prettier

# Database operations
npm run migration:generate    # Generate migration
npm run migration:run        # Run migrations
npm run migration:revert     # Revert migration
```

## Creating New Features

### 1. Create a New Module

```bash
# Generate module using NestJS CLI
nest generate module api/notifications
nest generate controller api/notifications
nest generate service api/notifications
```

### 2. Entity Creation

```typescript
// notifications.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 3. Service Implementation

```typescript
// notifications.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

export interface CreateNotificationDto {
  title: string;
  message: string;
  userId: number;
}

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    return this.notificationRepository.save(notification);
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    await this.notificationRepository.update(
      { id, userId },
      { isRead: true }
    );
  }
}
```

### 4. Controller Implementation

```typescript
// notifications.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../../types/auth.types';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async getUserNotifications(@Request() req: AuthenticatedRequest) {
    return this.notificationsService.findByUser(req.user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    await this.notificationsService.markAsRead(id, req.user.id);
    return { message: 'Notification marked as read' };
  }
}
```

### 5. Module Configuration

```typescript
// notifications.module.ts
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { notificationProviders } from './notifications.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationsController],
  providers: [...notificationProviders, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
```

## Testing Guidelines

### Unit Testing

```typescript
// notifications.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: 'NOTIFICATION_REPOSITORY',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const createDto = {
        title: 'Test',
        message: 'Test message',
        userId: 1,
      };

      const expectedNotification = { id: 1, ...createDto };
      mockRepository.create.mockReturnValue(expectedNotification);
      mockRepository.save.mockResolvedValue(expectedNotification);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedNotification);
      expect(result).toEqual(expectedNotification);
    });
  });
});
```

### E2E Testing

```typescript
// notifications.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('NotificationsController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login and get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password',
      });

    authToken = loginResponse.body.access_token;
  });

  it('/notifications (GET)', () => {
    return request(app.getHttpServer())
      .get('/notifications')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
```

## Database Development

### Migration Workflow

```bash
# Generate migration
npm run migration:generate -- --name CreateNotificationTable

# Review generated migration
# Edit src/migrations/[timestamp]-CreateNotificationTable.ts if needed

# Run migration
npm run migration:run

# Revert if needed
npm run migration:revert
```

### Seeding Data

```typescript
// seeds/notifications.seed.ts
import { DataSource } from 'typeorm';
import { Notification } from '../src/database/notifications/notification.entity';

export async function seedNotifications(dataSource: DataSource) {
  const notificationRepository = dataSource.getRepository(Notification);

  const notifications = [
    {
      title: 'Welcome!',
      message: 'Welcome to EcoRide! Start your ecological journey today.',
      userId: 1,
    },
    // Add more seed data
  ];

  await notificationRepository.save(notifications);
}
```

## API Documentation

### Swagger Decorators

```typescript
// Use comprehensive Swagger decorators
@ApiTags('notifications')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationsController {
  @Post()
  @ApiOperation({ 
    summary: 'Create notification',
    description: 'Create a new notification for a user'
  })
  @ApiBody({ 
    type: CreateNotificationDto,
    description: 'Notification data'
  })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    type: Notification,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(@Body() createDto: CreateNotificationDto) {
    return this.notificationsService.create(createDto);
  }
}
```

### DTO Documentation

```typescript
// create-notification.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification title',
    example: 'Trip Confirmed',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your trip to Lyon has been confirmed!',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;

  @ApiProperty({
    description: 'User ID to send notification to',
    example: 1,
  })
  @IsNumber()
  userId: number;
}
```

## Error Handling

### Custom Exception Filters

```typescript
// all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : exception,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    });
  }
}
```

## Performance Optimization

### Database Query Optimization

```typescript
// Optimize queries with proper relations and selections
async findNotificationsWithUser(userId: number): Promise<Notification[]> {
  return this.notificationRepository
    .createQueryBuilder('notification')
    .leftJoinAndSelect('notification.user', 'user')
    .where('notification.userId = :userId', { userId })
    .select([
      'notification.id',
      'notification.title',
      'notification.message',
      'notification.isRead',
      'notification.createdAt',
      'user.id',
      'user.pseudo',
    ])
    .orderBy('notification.createdAt', 'DESC')
    .limit(50)
    .getMany();
}
```

### Caching Implementation

```typescript
// Use caching for frequently accessed data
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // ... other dependencies
  ) {}

  async findByUser(userId: number): Promise<Notification[]> {
    const cacheKey = `user_notifications_${userId}`;
    
    let notifications = await this.cacheManager.get<Notification[]>(cacheKey);
    
    if (!notifications) {
      notifications = await this.notificationRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
      
      await this.cacheManager.set(cacheKey, notifications, 300); // 5 minutes
    }
    
    return notifications;
  }
}
```

## Security Best Practices

### Input Validation

```typescript
// Use DTOs with validation
export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9\s\-_!?.,]+$/, {
    message: 'Title contains invalid characters',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Transform(({ value }) => value.trim())
  message: string;
}
```

### Authorization Guards

```typescript
// resource-owner.guard.ts
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;

    // Check if user owns the resource
    return this.checkOwnership(user.id, resourceId);
  }

  private async checkOwnership(userId: number, resourceId: number): Promise<boolean> {
    // Implement ownership check logic
    return true;
  }
}
```

## Debugging and Troubleshooting

### Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "program": "${workspaceFolder}/src/main.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector"
    }
  ]
}
```

### Logging for Development

```typescript
// Enable detailed logging in development
import { Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    this.logger.debug(`Creating notification: ${JSON.stringify(createNotificationDto)}`);
    
    try {
      const notification = await this.notificationRepository.save(createNotificationDto);
      this.logger.debug(`Notification created with ID: ${notification.id}`);
      return notification;
    } catch (error) {
      this.logger.error(`Failed to create notification: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

## Code Review Guidelines

### Checklist for Code Reviews

- [ ] Code follows TypeScript best practices
- [ ] All functions and classes have proper types
- [ ] No use of `any` type
- [ ] DTOs have proper validation decorators
- [ ] API endpoints have Swagger documentation
- [ ] Tests are written and passing
- [ ] Error handling is implemented
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Database queries are optimized

### Review Process

1. **Self Review**: Review your own code before creating PR
2. **Automated Checks**: Ensure CI/CD pipeline passes
3. **Peer Review**: At least one team member review
4. **Testing**: Verify functionality works as expected
5. **Documentation**: Update relevant documentation

This development guide provides a comprehensive foundation for working with the EcoRide codebase while maintaining code quality and best practices.
