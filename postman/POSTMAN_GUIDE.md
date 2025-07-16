# 🚀 Postman Setup Guide for EcoRide API

## Overview

This guide helps you set up Postman to test the EcoRide API efficiently. The collection includes all API endpoints with automated tests, collection variables, and authentication handling.

## 📁 Files Included

- `EcoRide-API.postman_collection.json` - Complete API collection
- `POSTMAN_GUIDE.md` - This setup guide

## 🛠️ Setup Instructions

### 1. Import Collection

1. **Open Postman**
2. **Import Collection**:
   - Click "Import" button
   - Select `EcoRide-API.postman_collection.json`
   - Click "Import"

### 2. Start Your API Server

Before testing, ensure your EcoRide API is running:

```bash
cd /home/lolo/ecoride-api
npm run start:dev
```

The API should be available at `http://localhost:3000`

### 3. Configure Variables

You can set up the following variables in your Postman collection for easier testing:

| Variable | Description |
|----------|-------------|
| `base_url` | API base URL (default: `http://localhost:3000`) |
| `access_token` | JWT token (auto-populated during authentication) |
| `user_id` | Current user ID (auto-populated) |
| `user_email` | Current user email (auto-populated) |
| `car_id` | Test car ID (auto-populated) |
| `trip_id` | Test trip ID (auto-populated) |
| `booking_id` | Test booking ID (auto-populated) |
| `review_id` | Test review ID (auto-populated) |

## 🔄 Testing Workflow

### Step 1: Authentication

Start by testing the authentication flow:

1. **Register User**:
   - Run "Authentication > Register User"
   - This automatically sets `access_token`, `user_id`, and `user_email`
   - The email includes a random number to avoid conflicts

2. **Login User** (optional):
   - Run "Authentication > Login User"
   - Uses the email from registration

### Step 2: User Management

Test user-related operations:

1. **Get All Users** - View all registered users
2. **Get User by ID** - Get specific user details
3. **Update User** - Modify user profile and preferences

### Step 3: Vehicle Management

Test car-related operations:

1. **Create Car** - Register a new vehicle (sets `car_id`)
2. **Get All Cars** - View all registered cars
3. **Get Car by ID** - Get specific car details
4. **Update Car** - Modify car information

### Step 4: Trip Management

Test trip/codriving operations:

1. **Create Trip** - Create a new carpool trip (sets `trip_id`)
2. **Get All Trips** - View all available trips
3. **Get Trip by ID** - Get specific trip details
4. **Update Trip** - Modify trip information

### Step 5: Booking System

Test booking workflow:

1. **Create Booking** - Book a trip (sets `booking_id`)
2. **Get My Bookings** - View user's bookings
3. **Get Booking by ID** - Get specific booking details
4. **Update Booking** - Modify booking notes
5. **Confirm Booking** - Driver confirms booking
6. **Cancel Booking** - Cancel a booking

### Step 6: Reviews

Test review system:

1. **Create Review** - Submit a review (sets `review_id`)
2. **Get All Reviews** - View all reviews
3. **Update Review** - Modify review content

### Step 7: Search

Test search functionality:

1. **Search All** - Search across all entities
2. **Search Users** - Find specific users
3. **Search Cars** - Find specific vehicles
4. **Advanced Trip Search** - Search trips with filters

## 🧪 Automated Tests

Each request includes automated tests that verify:

### Global Tests (All Requests)
- Response time is less than 5000ms
- Response is valid JSON

### Authentication Tests
- Status code verification
- Token extraction and storage
- User data validation
- Password security (not returned in response)

### CRUD Operation Tests
- Successful creation (201 status)
- Successful retrieval (200 status)
- Proper data structure
- ID extraction for chaining requests

### Error Handling Tests
- Invalid data rejection
- Unauthorized access prevention
- Proper error messages

## 📊 Collection Structure

### Authentication Folder
- `Register User` - Create new account
- `Login User` - Authenticate existing user

### Users Folder
- `Get All Users` - List all users
- `Get User by ID` - Get specific user
- `Get User by Pseudo` - Find by username
- `Update User` - Modify profile

### Cars Folder
- `Get All Cars` - List vehicles with filters
- `Get Car by ID` - Get specific car
- `Create Car` - Register new vehicle
- `Update Car` - Modify car details

### Trips (Codriving) Folder
- `Get All Trips` - List available trips
- `Get Trip by ID` - Get specific trip
- `Create Trip` - Create new trip
- `Update Trip` - Modify trip details

### Bookings Folder
- `Get My Bookings` - User's bookings
- `Create Booking` - Book a trip
- `Get Booking by ID` - Get specific booking
- `Update Booking` - Modify booking
- `Confirm Booking (Driver)` - Confirm booking
- `Cancel Booking` - Cancel booking

### Search Folder
- `Search All` - General search
- `Search Users` - User search
- `Search Cars` - Vehicle search
- `Advanced Trip Search` - Trip search with filters

### Reviews Folder
- `Get All Reviews` - List all reviews
- `Create Review` - Submit review
- `Update Review` - Modify review

### Health Check Folder
- `Health Check` - API status check

## 🔧 Advanced Configuration

### Setting Up Variables

You can create collection-level variables for different environments (dev, staging, prod):

1. Go to your collection settings
2. Click on the "Variables" tab
3. Add variables as needed:

```
base_url: http://localhost:3000 (for development)
base_url: https://staging-api.ecoride.com (for staging)
base_url: https://api.ecoride.com (for production)
```

### Authentication Flow Automation

The collection automatically handles JWT tokens:

1. Register/Login requests extract the `access_token`
2. Token is stored in collection variables
3. Subsequent requests use the token automatically
4. No manual token copying required

### Test Data Generation

The collection uses Postman's built-in variables for test data:

- `{{$randomInt}}` - Random integers for unique values
- `{{$randomEmail}}` - Random email addresses
- `{{$timestamp}}` - Current timestamp
- `{{$randomFirstName}}` - Random first names

### Request Chaining

Requests are designed to chain together:

1. Register creates user and sets `user_id`
2. Create Car uses `user_id` as owner and sets `car_id`
3. Create Trip uses `car_id` and sets `trip_id`
4. Create Booking uses `trip_id` and sets `booking_id`
5. All subsequent operations use these IDs

## 🐛 Troubleshooting

### Common Issues

1. **API Not Running**
   ```
   Error: getaddrinfo ENOTFOUND localhost
   ```
   **Solution**: Start the API server with `npm run start:dev`

2. **Authentication Required**
   ```
   Status: 401 Unauthorized
   ```
   **Solution**: Run "Register User" or "Login User" first

3. **Invalid Token**
   ```
   Status: 401 Unauthorized - Invalid token
   ```
   **Solution**: Re-run authentication to get fresh token

4. **Resource Not Found**
   ```
   Status: 404 Not Found
   ```
   **Solution**: Ensure dependent resources exist (create car before trip, etc.)

### Debug Tips

1. **Check Collection Variables**:
   - Go to your collection settings
   - Click on the "Variables" tab
   - Verify variables are populated correctly

2. **View Console**:
   - Open Postman Console (View > Show Postman Console)
   - Check for detailed error messages

3. **Inspect Responses**:
   - Check response body for error details
   - Verify response headers

## 📈 Testing Scenarios

### Complete User Journey

Run requests in this order for full testing:

1. `Authentication > Register User`
2. `Cars > Create Car`
3. `Trips > Create Trip`
4. `Bookings > Create Booking`
5. `Reviews > Create Review`
6. `Search > Search All`

### Error Testing

Test error scenarios:

1. Login with wrong credentials
2. Access protected routes without token
3. Create car with invalid data
4. Book non-existent trip
5. Update resources you don't own

### Performance Testing

1. Use Postman's Collection Runner
2. Run requests multiple times
3. Monitor response times
4. Check for memory leaks

## 🔒 Security Testing

The collection includes security-focused tests:

1. **Token Validation**: Ensures tokens are properly formatted
2. **Password Security**: Verifies passwords aren't returned
3. **Authorization**: Tests role-based access control
4. **Input Validation**: Tests malformed requests

## 📝 Best Practices

1. **Use Collection Variables**: Set up variables at the collection level instead of hardcoding values
2. **Chain Requests**: Use response data in subsequent requests
3. **Test Error Cases**: Don't just test happy paths
4. **Monitor Performance**: Check response times
5. **Clean Up**: Delete test data when finished
6. **Document Changes**: Update collection when API changes

## 🚀 Next Steps

After setting up Postman:

1. **Explore the API**: Run through all endpoints
2. **Customize Tests**: Add specific validations for your use case
3. **Create Test Suites**: Group related tests together
4. **Automate Testing**: Use Newman for CI/CD integration
5. **Share Collections**: Export and share with team members

This Postman setup provides a comprehensive testing environment for the EcoRide API, making development and debugging more efficient.
