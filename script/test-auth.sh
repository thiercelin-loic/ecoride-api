#!/bin/bash

echo "🚀 Testing EcoRide Authentication System"
echo "========================================"

# Start the server in background
echo "📡 Starting development server..."
cd /home/lolo/ecoride-api
npm run start:dev > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 10

# Test endpoints
echo "🧪 Testing authentication endpoints..."

echo ""
echo "1. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe", 
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "pseudo": "johndoe"
  }')

echo "Registration Response: $REGISTER_RESPONSE"

echo ""
echo "2. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo ""
echo "3. Testing protected endpoint..."
if [ ! -z "$TOKEN" ]; then
  PROTECTED_RESPONSE=$(curl -s -X GET http://localhost:3000/users \
    -H "Authorization: Bearer $TOKEN")
  echo "Protected Endpoint Response: $PROTECTED_RESPONSE"
else
  echo "No token received, skipping protected endpoint test"
fi

# Cleanup
echo ""
echo "🧹 Cleaning up..."
kill $SERVER_PID

echo "✅ Authentication system test completed!"
