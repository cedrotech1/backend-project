# Car Repair Payment Management System (CRPMS) - Backend

A comprehensive backend API for managing car repair services, payments, and reporting. Built with Node.js, Express.js, and MySQL.

## Features

- **User Authentication** - Secure login/signup with JWT tokens
- **Car Management** - Full CRUD operations for vehicle information
- **Service Management** - Manage available services and pricing
- **Payment Tracking** - Record and track payments
- **Service Records** - Complete CRUD for service records (exam requirement)
- **Reporting** - Daily reports, bill generation, and revenue tracking
- **RESTful API** - Clean, well-documented API endpoints

## Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend-project
```

2. **Install dependencies**
```bash
npm install
```

3. **Database Setup**
   - Create MySQL database named `crpms1`
   - Import the SQL file provided in the project
   - Update database connection in `connection.js`

4. **Environment Configuration**
   - Set up your database connection details
   - Configure JWT secret key
   - Set server port (default: 4000)

## Database Schema

The system uses the following tables:

### `car` - Vehicle Information
```sql
CREATE TABLE `car` (
  `PlateNumber` int(11) NOT NULL,
  `type` varchar(40) NOT NULL,
  `Model` varchar(40) DEFAULT NULL,
  `MechanicName` varchar(40) DEFAULT NULL
);
```

### `services` - Available Services
```sql
CREATE TABLE `services` (
  `ServiceCode` int(11) NOT NULL,
  `ServiceName` varchar(40) DEFAULT NULL,
  `ServicePrice` int(11) DEFAULT NULL
);
```

### `payment` - Payment Records
```sql
CREATE TABLE `payment` (
  `PaymentID` int(11) NOT NULL,
  `AmountPaid` int(11) DEFAULT NULL,
  `PaymentDate` varchar(40) DEFAULT NULL,
  `ServiceCode` int(11) DEFAULT NULL,
  `PlateNumber` int(11) DEFAULT NULL
);
```

### `servicerecord` - Service Records (Full CRUD Required)
```sql
CREATE TABLE `servicerecord` (
  `RecordNumber` int(11) NOT NULL,
  `SeviceDate` varchar(30) DEFAULT NULL
);
```

### `users` - User Authentication
```sql
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `names` varchar(40) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
);
```

## API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /login` - User login

### Car Management
- `POST /add-car` - Add new car
- `GET /display-cars` - Get all cars
- `PUT /edit-car` - Update car information
- `DELETE /delete-car` - Delete car

### Services
- `POST /add-service` - Add new service
- `GET /display-services` - Get all services

### Payments
- `POST /add-payment` - Add payment record
- `GET /display-payments` - Get all payments

### Service Records (Full CRUD)
- `POST /add-service-record` - Add service record
- `GET /display-service-records` - Get all service records
- `PUT /update-service-record` - Update service record
- `DELETE /delete-service-record` - Delete service record

### Reports
- `GET /daily-report/:date` - Generate daily report
- `GET /generate-bill/:plateNumber` - Generate car bill
- `GET /total-revenue/:date` - Calculate total revenue

## Running the Application

1. **Start the server**
```bash
node index.js
```

2. **Server will start on port 4000**
```
Server is running on port 4000
```

3. **Test the API**
```bash
curl http://localhost:4000/hello
```

## Project Structure

```
backend-project/
|-- index.js              # Main application file
|-- connection.js          # Database connection
|-- crpms1.sql            # Database schema
|-- API_DOCUMENTATION.md  # Detailed API documentation
|-- README.md             # This file
|-- package.json          # Dependencies and scripts
```

## Key Features Implementation

### Authentication System
- Secure password hashing with bcrypt
- JWT token-based authentication
- User session management

### Service Records (Exam Requirement)
- **Full CRUD Operations** as required for Technical Secondary Schools National Practical Examination
- Create, Read, Update, Delete functionality
- Date tracking for service records

### Reporting System
- Daily service reports
- Individual car bills
- Revenue calculations
- Data aggregation and analysis

## Security Features

- **Password Hashing** - All passwords are hashed using bcrypt
- **JWT Authentication** - Secure token-based authentication
- **CORS Enabled** - Cross-origin resource sharing
- **Input Validation** - Basic input validation (enhance in production)

## Error Handling

- Consistent error response format
- Appropriate HTTP status codes
- Detailed error messages for debugging
- Graceful error recovery

## Development

### Adding New Features
1. Create new API endpoint in `index.js`
2. Update database schema if needed
3. Add error handling
4. Update API documentation

### Database Migrations
- Use the provided SQL file for initial setup
- Create migration scripts for schema changes
- Backup database before major changes

## Testing

### Manual Testing
Use Postman or curl to test endpoints:

```bash
# Test health check
curl http://localhost:4000/hello

# Test user registration
curl -X POST http://localhost:4000/signup \
  -H "Content-Type: application/json" \
  -d '{"names":"Cedrick","email":"cedrick@gmail.com","password":"12345"}'

# Test car addition
curl -X POST http://localhost:4000/add-car \
  -H "Content-Type: application/json" \
  -d '{"type":"Sedan","Model":"Toyota Camry","MechanicName":"John Smith"}'
```

### Automated Testing
- Set up test database
- Write unit tests for API endpoints
- Implement integration tests

## Deployment

### Production Setup
1. Set up production database
2. Configure environment variables
3. Use process manager (PM2)
4. Set up reverse proxy (Nginx)
5. Implement SSL/TLS

### Environment Variables
```bash
NODE_ENV=production
DB_HOST=localhost
DB_USER=username
DB_PASSWORD=password
DB_NAME=crpms1
JWT_SECRET=your-secret-key
PORT=4000
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## Support

For issues and questions:
- Check API documentation
- Review error logs
- Test with sample data
- Verify database connection

## License

This project is part of the 2024-2025 Technical Secondary Schools National Practical Examination.

---

**Note**: This backend is designed to work with the corresponding React.js frontend application. Both applications should be run simultaneously for full functionality.

# Car Repair Payment Management System - Backend API Documentation

## Overview
This document provides comprehensive API documentation for the Car Repair Payment Management System (CRPMS) backend built with Node.js, Express.js, and MySQL.

## Base URL
```
http://localhost:4000
```

## Authentication
The system uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected routes.

## Database Schema
The system uses the following tables:
- `car` - Vehicle information
- `services` - Available services
- `payment` - Payment records
- `servicerecord` - Service records
- `users` - User authentication

---

## Authentication APIs

### POST /signup
Register a new user account.

**Request Body:**
```json
{
  "names": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 1,
    "info": "",
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 0
  }
}
```

### POST /login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "names": "John Doe",
    "email": "john@example.com",
    "password": "$2b$10$..."
  }
}
```

**Response (Error):**
```json
{
  "message": "Invalid password"
}
```

---

## Car Management APIs

### POST /add-car
Add a new car to the system.

**Request Body:**
```json
{
  "type": "Sedan",
  "Model": "Toyota Camry",
  "MechanicName": "John Smith"
}
```

**Response:**
```json
{
  "message": "Car added successfully",
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 1,
    "info": "",
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 0
  }
}
```

### GET /display-cars
Retrieve all cars from the system.

**Response:**
```json
[
  {
    "PlateNumber": 1,
    "type": "Sedan",
    "Model": "Toyota Camry",
    "MechanicName": "John Smith"
  }
]
```

### DELETE /delete-car
Delete a car by plate number.

**Request Body:**
```json
{
  "PlateNumber": 1
}
```

**Response:**
```json
{
  "message": "Car deleted successfully",
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 0,
    "info": "",
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 0
  }
}
```

### PUT /edit-car
Update car information.

**Request Body:**
```json
{
  "PlateNumber": 1,
  "type": "SUV",
  "Model": "Toyota RAV4",
  "MechanicName": "Jane Doe"
}
```

**Response:**
```json
{
  "message": "Car updated successfully",
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 0,
    "info": "",
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 1
  }
}
```

---

## Services Management APIs

### POST /add-service
Add a new service to the system.

**Request Body:**
```json
{
  "ServiceName": "Oil Change",
  "ServicePrice": 50000
}
```

**Response:**
```json
{
  "message": "Service added successfully",
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 1,
    "info": "",
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 0
  }
}
```

### GET /display-services
Retrieve all services from the system.

**Response:**
```json
[
  {
    "ServiceCode": 1,
    "ServiceName": "Oil Change",
    "ServicePrice": 50000
  }
]
```

---

## Payment Management APIs

### POST /add-payment
Add a new payment record.

**Request Body:**
```json
{
  "AmountPaid": 50000,
  "PaymentDate": "2024-04-15",
  "ServiceCode": 1,
  "PlateNumber": 1
}
```

**Response:**
```json
{
  "message": "Payment added successfully",
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 1,
    "info": "",
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 0
  }
}
```

### GET /display-payments
Retrieve all payment records.

**Response:**
```json
[
  {
    "PaymentID": 1,
    "AmountPaid": 50000,
    "PaymentDate": "2024-04-15",
    "ServiceCode": 1,
    "PlateNumber": 1
  }
]
```

---

## Service Record APIs (Full CRUD)

### POST /add-service-record
Add a new service record.

**Request Body:**
```json
{
  "SeviceDate": "2024-04-15"
}
```

**Response:**
```json
{
  "message": "Service record added successfully",
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 1,
    "info": "",
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 0
  }
}
```

### GET /display-service-records
Retrieve all service records.

**Response:**
```json
[
  {
    "RecordNumber": 1,
    "SeviceDate": "2024-04-15"
  }
]
```

### PUT /update-service-record
Update a service record.

**Request Body:**
```json
{
  "RecordNumber": 1,
  "SeviceDate": "2024-04-16"
}
```

**Response:**
```json
{
  "message": "Service record updated successfully",
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 0,
    "info": "",
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 1
  }
}
```

### DELETE /delete-service-record
Delete a service record.

**Request Body:**
```json
{
  "RecordNumber": 1
}
```

**Response:**
```json
{
  "message": "Service record deleted successfully",
  "result": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 0,
    "info": "",
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 0
  }
}
```

---

## Reports APIs

### GET /daily-report/:date
Generate daily report for specific date.

**URL Parameters:**
- `date` (string): Date in YYYY-MM-DD format

**Response:**
```json
[
  {
    "RecordNumber": 1,
    "SeviceDate": "2024-04-15",
    "PlateNumber": 1,
    "type": "Sedan",
    "Model": "Toyota Camry",
    "ServiceName": "Oil Change",
    "ServicePrice": 50000,
    "AmountPaid": 50000,
    "PaymentDate": "2024-04-15"
  }
]
```

### GET /generate-bill/:plateNumber
Generate bill for specific car.

**URL Parameters:**
- `plateNumber` (integer): Car plate number

**Response:**
```json
[
  {
    "PlateNumber": 1,
    "type": "Sedan",
    "Model": "Toyota Camry",
    "MechanicName": "John Smith",
    "RecordNumber": 1,
    "SeviceDate": "2024-04-15",
    "ServiceName": "Oil Change",
    "ServicePrice": 50000,
    "AmountPaid": 50000,
    "PaymentDate": "2024-04-15",
    "receiver": "John Doe"
  }
]
```

### GET /total-revenue/:date
Calculate total revenue for specific date.

**URL Parameters:**
- `date` (string): Date in YYYY-MM-DD format

**Response:**
```json
{
  "totalRevenue": 50000,
  "totalServices": 1
}
```

---

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages:

### Success Responses
- `200 OK` - Request successful
- `201 Created` - Resource created successfully

### Error Responses
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Error Response Format
```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

---

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

---

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure database connection in `connection.js`

3. Start the server:
```bash
node index.js
```

4. Server runs on port 4000

---

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is enabled for cross-origin requests
- Input validation should be implemented in production

---

## Testing

Use tools like Postman or curl to test API endpoints:

```bash
# Test login
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test add car
curl -X POST http://localhost:4000/add-car \
  -H "Content-Type: application/json" \
  -d '{"type":"Sedan","Model":"Toyota Camry","MechanicName":"John Smith"}'
```
