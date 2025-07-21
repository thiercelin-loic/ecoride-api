# 🔗 EcoRide API Reference

## Overview

The EcoRide API provides a comprehensive REST interface for managing a carpooling platform. All endpoints return JSON responses and use standard HTTP status codes.

**Base URL**: `http://localhost:3000`  
**API Documentation**: `http://localhost:3000/api` (Swagger UI)

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "pseudo": "johndoe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "pseudo": "johndoe",
    "firstname": "John",
    "lastname": "Doe",
    "role": "USER",
    "userType": "PASSENGER",
    "credits": 20,
    "isActive": true
  }
}
```

#### POST /auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Same as registration response.

## User Management

### GET /users
Retrieve all users (admin only).

**Response:**
```json
[
  {
    "id": 1,
    "email": "john.doe@example.com",
    "pseudo": "johndoe",
    "firstname": "John",
    "lastname": "Doe",
    "role": "USER",
    "userType": "PASSENGER",
    "credits": 20,
    "isActive": true,
    "preferences": {
      "smokingAllowed": false,
      "animalsAllowed": true,
      "musicAllowed": true
    }
  }
]
```

### GET /users/:id
Get a specific user by ID.

**Parameters:**
- `id` (number): User ID

### GET /users/search/pseudo/:pseudo
Find a user by their pseudo.

**Parameters:**
- `pseudo` (string): User's pseudo/username

### PUT /users/:id
Update user profile (requires authentication).

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Smith",
  "preferences": {
    "smokingAllowed": false,
    "animalsAllowed": true,
    "musicAllowed": false
  }
}
```

### DELETE /users/:id
Delete a user account (admin only).

## Vehicle Management

### GET /cars
Retrieve all cars with optional filtering.

**Query Parameters:**
- `model` (string): Filter by car model
- `energy` (string): Filter by energy type (Electric, Hybrid, Gasoline, Diesel)
- `color` (string): Filter by car color

**Response:**
```json
[
  {
    "id": "1",
    "immatriculation": "AB-123-CD",
    "model": "Tesla Model 3",
    "color": "White",
    "energy": "Electric",
    "availableSeats": 4,
    "brand": {
      "id": 1,
      "name": "Tesla"
    },
    "owner": {
      "id": 1,
      "pseudo": "johndoe"
    }
  }
]
```

### GET /cars/:id
Get a specific car by ID.

### POST /cars
Register a new car (requires authentication).

**Request Body:**
```json
{
  "immatriculation": "AB-123-CD",
  "model": "Tesla Model 3",
  "color": "White",
  "energy": "Electric",
  "availableSeats": 4,
  "brandId": 1
}
```

### PUT /cars/:id
Update car information (owner only).

### DELETE /cars/:id
Remove a car (owner only).

## Trip Management (Codriving)

### GET /codriving
List all available trips.

**Response:**
```json
[
  {
    "id": 1,
    "startLocation": "Paris",
    "endLocation": "Lyon",
    "startDate": "2024-01-15T09:00:00Z",
    "endDate": "2024-01-15T14:00:00Z",
    "seatsAvailable": 3,
    "pricePerSeat": 25,
    "isEcological": true,
    "driver": {
      "id": 1,
      "pseudo": "johndoe",
      "rating": 4.8
    },
    "car": {
      "id": "1",
      "model": "Tesla Model 3",
      "energy": "Electric"
    }
  }
]
```

### GET /codriving/:id
Get a specific trip by ID.

### POST /codriving
Create a new trip (requires authentication).

**Request Body:**
```json
{
  "startLocation": "Paris",
  "endLocation": "Lyon",
  "startDate": "2024-01-15T09:00:00Z",
  "endDate": "2024-01-15T14:00:00Z",
  "seatsAvailable": 3,
  "pricePerSeat": 25,
  "carId": "1"
}
```

### PUT /codriving/:id
Update trip details (driver only).

### DELETE /codriving/:id
Cancel a trip (driver only).

## Booking System

### GET /bookings/my-bookings
Get current user's bookings (requires authentication).

**Response:**
```json
[
  {
    "id": 1,
    "status": "CONFIRMED",
    "creditsUsed": 25,
    "notes": "Looking forward to this trip!",
    "createdAt": "2024-01-10T10:00:00Z",
    "codriving": {
      "id": 1,
      "startLocation": "Paris",
      "endLocation": "Lyon",
      "startDate": "2024-01-15T09:00:00Z"
    }
  }
]
```

### POST /bookings
Book a trip (requires authentication).

**Request Body:**
```json
{
  "codrivingId": 1,
  "creditsUsed": 25,
  "notes": "Looking forward to this trip!"
}
```

### GET /bookings/:id
Get a specific booking by ID.

### PATCH /bookings/:id
Update a booking (passenger only).

**Request Body:**
```json
{
  "notes": "Updated notes for the trip"
}
```

### DELETE /bookings/:id
Cancel a booking (passenger only).

### PATCH /bookings/:id/confirm
Confirm a booking (driver only).

### PATCH /bookings/:id/complete
Mark a booking as completed (driver only).

## Search Functionality

### GET /search
Search across all entities (users, cars, trips).

**Query Parameters:**
- `q` (string): Search query
- `type` (string): Entity type ('user', 'car', 'codriving')

**Response:**
```json
{
  "data": [
    {
      "type": "codriving",
      "id": 1,
      "title": "Paris to Lyon",
      "description": "Comfortable trip in Tesla Model 3",
      "entity": {
        "id": 1,
        "startLocation": "Paris",
        "endLocation": "Lyon"
      }
    }
  ]
}
```

### GET /search/trips
Advanced trip search with multiple criteria.

**Query Parameters:**
- `from` (string): Departure location
- `to` (string): Destination location
- `date` (string): Travel date (YYYY-MM-DD)
- `minPrice` (number): Minimum price per seat
- `maxPrice` (number): Maximum price per seat
- `ecological` (boolean): Only ecological trips
- `minRating` (number): Minimum driver rating

## Review System

### GET /reviews
List all reviews.

**Response:**
```json
[
  {
    "id": 1,
    "rating": 5,
    "commentary": "Great driver, very punctual!",
    "status": "PUBLISHED",
    "createdAt": "2024-01-16T10:00:00Z",
    "reviewer": {
      "id": 2,
      "pseudo": "passenger1"
    },
    "reviewee": {
      "id": 1,
      "pseudo": "johndoe"
    }
  }
]
```

### POST /reviews
Submit a new review (requires authentication).

**Request Body:**
```json
{
  "rating": 5,
  "commentary": "Great driver, very punctual!",
  "revieweeId": 1
}
```

### PUT /reviews/:id
Update a review (reviewer only).

### DELETE /reviews/:id
Delete a review (reviewer or admin only).

## Error Responses

The API uses standard HTTP status codes and returns error details in JSON format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute per user
- Search endpoints: 50 requests per minute per user

## Data Models

### User Types
- `VISITOR` - Not registered user
- `USER` - Regular registered user
- `EMPLOYEE` - EcoRide employee
- `ADMINISTRATOR` - System administrator

### User Types (Passenger/Driver)
- `PASSENGER` - Only books trips
- `DRIVER` - Only offers trips  
- `BOTH` - Can book and offer trips

### Booking Status
- `PENDING` - Awaiting driver confirmation
- `CONFIRMED` - Confirmed by driver
- `CANCELLED` - Cancelled by passenger or driver
- `COMPLETED` - Trip completed successfully

### Car Energy Types
- `Electric` - Electric vehicles (ecological)
- `Hybrid` - Hybrid vehicles
- `Gasoline` - Gasoline vehicles
- `Diesel` - Diesel vehicles

### Review Status
- `PENDING` - Under moderation
- `PUBLISHED` - Publicly visible
- `REJECTED` - Rejected by moderation