# 🌱 EcoRide API - Carpooling Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange.svg)](https://www.mysql.com/)

## 🚀 Overview

EcoRide is a modern carpooling platform API built with NestJS and TypeScript, promoting ecological travel and reducing environmental impact through efficient car sharing. The platform provides a comprehensive REST API for managing users, vehicles, trips, bookings, and reviews.

## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based authentication system
- Role-based access control (Visitor, User, Employee, Administrator)
- Secure password hashing with bcrypt
- Protected API endpoints with guards
- Database security with dedicated user credentials

### 👥 User Management
- User registration and profile management
- Driver/Passenger role system
- Credit-based booking system (users start with 20 credits)
- User preferences (smoking, animals, music)
- Account suspension functionality

### 🚗 Vehicle Management
- Car registration with detailed specifications
- Multiple energy types: Electric, Hybrid, Gasoline, Diesel
- Brand and model management
- Owner-vehicle relationships

### 🛣️ Trip & Booking System
- Create and manage carpool trips (codriving)
- Real-time seat availability tracking
- Credit-based booking with automatic deduction
- Booking status management (Pending, Confirmed, Cancelled, Completed)
- Trip cancellation with credit refunds

### ⭐ Review System
- Post-trip rating and review system
- Driver and passenger feedback
- Rating aggregation and display

### 🔍 Advanced Search
- Location-based trip search
- Date and time filtering
- Multi-criteria search (price, duration, ecological trips)
- Real-time availability checking

## 📁 Project Structure

```
ecoride-api/
├── src/
│   ├── api/                     # API Controllers & DTOs
│   │   ├── bookings/           # Booking management endpoints
│   │   ├── cars/               # Vehicle management endpoints
│   │   ├── codriving/          # Trip management endpoints
│   │   ├── reviews/            # Review system endpoints
│   │   ├── search/             # Search functionality
│   │   └── users/              # User management endpoints
│   ├── auth/                   # Authentication module
│   │   ├── guards/             # Auth guards and middleware
│   │   ├── strategies/         # Passport strategies (JWT, Local)
│   │   └── dto/                # Authentication DTOs
│   ├── database/               # Database layer
│   │   ├── entities/           # TypeORM entities
│   │   ├── services/           # Database services
│   │   ├── providers/          # Repository providers
│   │   └── modules/            # Database modules
│   └── types/                  # TypeScript type definitions
├── docs/                       # Documentation
└── test/                       # Test suites
```

## 🛠️ Technologies

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: MySQL 8.x with TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer
- **Testing**: Jest
- **Security**: bcrypt, CORS, Helmet

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- MySQL 8.x
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecoride-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Create database and user
   ./setup-database-security.sh
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Access the API**
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api
   - Health Check: http://localhost:3000/health

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API Documentation](./docs/API.md) | Complete API endpoint reference |
| [Authentication Guide](./docs/AUTHENTICATION.md) | Authentication system setup and usage |
| [Database Schema](./docs/DATABASE.md) | Database structure and relationships |
| [Setup Guide](./docs/SETUP.md) | Detailed installation and configuration |
| [Development Guide](./docs/DEVELOPMENT.md) | Development workflow and guidelines |
| [Deployment Guide](./docs/DEPLOYMENT.md) | Production deployment instructions |
| [Security Guide](./docs/SECURITY.md) | Security best practices and configuration |

## 🔗 API Endpoints Overview

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user account

### Cars
- `GET /cars` - List all cars (with filters)
- `POST /cars` - Register a new car
- `PUT /cars/:id` - Update car information
- `DELETE /cars/:id` - Remove car

### Trips (Codriving)
- `GET /codriving` - List available trips
- `POST /codriving` - Create a new trip
- `PUT /codriving/:id` - Update trip details
- `DELETE /codriving/:id` - Cancel trip

### Bookings
- `GET /bookings/my-bookings` - Get user's bookings
- `POST /bookings` - Book a trip
- `PATCH /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking
- `PATCH /bookings/:id/confirm` - Confirm booking (driver only)

### Search
- `GET /search` - Search trips by criteria
- `GET /search/users` - Search users
- `GET /search/cars` - Search cars

### Reviews
- `GET /reviews` - List reviews
- `POST /reviews` - Submit a review
- `PUT /reviews/:id` - Update review

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Test authentication system
./test-auth.sh

# Test booking system
./test-booking-system.sh
```

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `DB_USERNAME` | Database username | `ecoride_app` |
| `DB_PASSWORD` | Database password | `your_secure_password` |
| `DB_DATABASE` | Database name | `ecoride` |
| `JWT_SECRET` | JWT signing secret | `your_jwt_secret` |
| `PORT` | Application port | `3000` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 Documentation: [Full Documentation](./docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/thiercelin-loic/ecoride-api/issues)

## 🔄 Project Status

- ✅ Authentication System
- ✅ User Management
- ✅ Vehicle Management
- ✅ Trip Management
- ✅ Booking System
- ✅ Review System
- ✅ Search Functionality
- ✅ Database Security
- ✅ API Documentation
- 🚧 Email Notifications (Planned)
- 🚧 Admin Dashboard (Planned)
- 🚧 Mobile App Integration (Future)

---# ecoride-gui
# ecoride-gui
