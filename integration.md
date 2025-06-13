# HotMa API Integration Documentation

This document provides detailed information about each API endpoint, including request/response formats, required permissions, and examples for frontend integration.

## Authentication Routes (`/api/auth`)

### 1. Register User
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Description:** Register a new guest user in the system
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response Format:**
  ```json
  {
    "user": {
      "name": "string",
      "role": "guest"
    },
    "token": "string (JWT)"
  }
  ```
- **Error Responses:**
  - `400`: Email already in use
  - `500`: Registration failed
- **Headers:** 
  - Content-Type: application/json

### 2. Login
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Description:** Authenticate a user and get access token
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response Format:**
  ```json
  {
    "user": {
      "name": "string",
      "role": "string (guest|receptionist|admin|manager)"
    },
    "token": "string (JWT)"
  }
  ```
- **Error Responses:**
  - `401`: Invalid credentials
  - `500`: Login failed
- **Headers:** 
  - Content-Type: application/json

### 3. Create Staff User
- **Endpoint:** `POST /api/staff/create`
- **Access:** Admin only
- **Description:** Create a new staff user account
- **Request Headers:**
  - Authorization: Bearer {admin_token}
  - Content-Type: application/json
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "receptionist|manager"
  }
  ```
- **Response Format:**
  ```json
  {
    "user": {
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```
- **Error Responses:**
  - `400`: Invalid role for staff member
  - `401`: Unauthorized
  - `403`: Access denied (not admin)
  - `500`: Staff creation failed

## Booking Management Routes (`/api/bookings`)

### 1. Create Booking
- **Endpoint:** `POST /api/bookings/create`
- **Access:** Authenticated users (any role)
- **Description:** Create a new room booking
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Request Body:**
  ```json
  {
    "roomId": "string (MongoDB ID)",
    "checkIn": "string (ISO 8601 date)",
    "checkOut": "string (ISO 8601 date)",
    "numberOfGuests": "number",
    "guest": {
      "name": "string",
      "email": "string",
      "phone": "string"
    },
    "paymentMethod": "mtn_momo|orange_money|visa"
  }
  ```
- **Response Format:**
  ```json
  {
    "booking": {
      "bookingNumber": "string",
      "room": {
        "roomNumber": "string",
        "type": "string"
      },
      "totalAmount": "number",
      "checkIn": "string (ISO 8601 date)",
      "checkOut": "string (ISO 8601 date)",
      "status": "pending",
      "paymentStatus": "pending"
    },
    "room": {
      "status": "occupied",
      "_id": "string",
      "roomNumber": "string"
    }
  }
  ```
- **Error Responses:**
  - `400`: Invalid booking data or validation failed
  - `401`: Unauthorized
  - `404`: Room not found
  - `409`: Room not available for selected dates
  - `500`: Booking creation failed

### 2. Check-in
- **Endpoint:** `PATCH /api/bookings/:bookingId/check-in`
- **Access:** Admin, Receptionist
- **Description:** Process guest check-in
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **URL Parameters:**
  - bookingId: MongoDB ID of the booking
- **Response Format:**
  ```json
  {
    "bookingNumber": "string",
    "status": "checked-in",
    "checkIn": {
      "date": "string (ISO 8601 date)",
      "status": "completed"
    }
  }
  ```
- **Error Responses:**
  - `400`: Invalid check-in time
  - `401`: Unauthorized
  - `403`: Insufficient permissions
  - `404`: Booking not found

### 3. Check-out
- **Endpoint:** `PATCH /api/bookings/:bookingId/check-out`
- **Access:** Admin, Receptionist
- **Description:** Process guest check-out
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **URL Parameters:**
  - bookingId: MongoDB ID of the booking
- **Response Format:**
  ```json
  {
    "bookingNumber": "string",
    "status": "checked-out",
    "checkOut": {
      "date": "string (ISO 8601 date)",
      "status": "completed"
    },
    "bill": {
      "roomCharges": "number",
      "additionalCharges": "number",
      "taxes": "number",
      "total": "number"
    }
  }
  ```
- **Error Responses:**
  - `400`: Payment pending
  - `401`: Unauthorized
  - `403`: Insufficient permissions
  - `404`: Booking not found

## Room Service Routes (`/api/room-service`)

### 1. Create Room Service Request
- **Endpoint:** `POST /api/room-service`
- **Access:** Admin, Receptionist
- **Description:** Create a new room service request
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Request Body:**
  ```json
  {
    "bookingId": "string (MongoDB ID)",
    "items": [
      {
        "name": "string",
        "quantity": "number",
        "price": "number"
      }
    ],
    "notes": "string (optional)"
  }
  ```
- **Response Format:**
  ```json
  {
    "id": "string",
    "booking": "string (MongoDB ID)",
    "items": [
      {
        "name": "string",
        "quantity": "number",
        "price": "number"
      }
    ],
    "totalAmount": "number",
    "status": "pending",
    "requestTime": "string (ISO 8601 datetime)",
    "notes": "string"
  }
  ```
- **Error Responses:**
  - `400`: Invalid request data
  - `401`: Unauthorized
  - `403`: Access denied
  - `404`: Booking not found
  - `500`: Request creation failed

### 2. Update Room Service Status
- **Endpoint:** `PATCH /api/room-service/:id/status`
- **Access:** Admin, Receptionist
- **Description:** Update the status of a room service request
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **URL Parameters:**
  - id: MongoDB ID of the room service request
- **Request Body:**
  ```json
  {
    "status": "pending|processing|delivered|cancelled"
  }
  ```
- **Response Format:**
  ```json
  {
    "id": "string",
    "status": "string",
    "deliveryTime": "string (ISO 8601 datetime, only if status is delivered)",
    "booking": "string (MongoDB ID)",
    "items": [
      {
        "name": "string",
        "quantity": "number",
        "price": "number"
      }
    ],
    "totalAmount": "number"
  }
  ```
- **Error Responses:**
  - `400`: Invalid status
  - `401`: Unauthorized
  - `403`: Access denied
  - `404`: Room service request not found
  - `500`: Update failed

## Housekeeping Routes (`/api/housekeeping`)

### 1. Create Housekeeping Task
- **Endpoint:** `POST /api/housekeeping`
- **Access:** Admin, Receptionist
- **Description:** Create a new housekeeping task for a room
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Request Body:**
  ```json
  {
    "roomId": "string (MongoDB ID)",
    "tasks": ["string"],
    "scheduledDate": "string (ISO 8601 date)",
    "notes": "string (optional)"
  }
  ```
- **Response Format:**
  ```json
  {
    "id": "string",
    "room": {
      "roomNumber": "string",
      "floor": "number"
    },
    "tasks": [
      {
        "name": "string",
        "completed": false
      }
    ],
    "status": "pending",
    "scheduledDate": "string (ISO 8601 date)",
    "notes": "string"
  }
  ```
- **Error Responses:**
  - `400`: Invalid task data
  - `401`: Unauthorized
  - `403`: Access denied
  - `404`: Room not found
  - `500`: Task creation failed

### 2. Update Task Status
- **Endpoint:** `PATCH /api/housekeeping/task/:id`
- **Access:** Admin, Receptionist
- **Description:** Update the status of a housekeeping task
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **URL Parameters:**
  - id: MongoDB ID of the task
- **Request Body:**
  ```json
  {
    "completed": "boolean"
  }
  ```
- **Response Format:**
  ```json
  {
    "id": "string",
    "tasks": [
      {
        "name": "string",
        "completed": "boolean"
      }
    ],
    "status": "completed|pending",
    "completionDate": "string (ISO 8601 datetime, if completed)",
    "message": "Task status updated successfully"
  }
  ```
- **Error Responses:**
  - `400`: Invalid status update
  - `401`: Unauthorized
  - `403`: Access denied
  - `404`: Task not found
  - `500`: Update failed

## Maintenance Routes (`/api/maintenance`)

### 1. Create Maintenance Request
- **Endpoint:** `POST /api/maintenance`
- **Access:** Admin, Receptionist
- **Description:** Create a new maintenance request for a room
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Request Body:**
  ```json
  {
    "roomId": "string (MongoDB ID)",
    "type": "repair|replacement|inspection",
    "priority": "low|medium|high|urgent",
    "description": "string",
    "estimatedCost": "number"
  }
  ```
- **Response Format:**
  ```json
  {
    "id": "string",
    "room": {
      "roomNumber": "string",
      "floor": "number"
    },
    "type": "string",
    "priority": "string",
    "status": "pending",
    "description": "string",
    "estimatedCost": "number"
  }
  ```
- **Error Responses:**
  - `400`: Invalid request data
  - `401`: Unauthorized
  - `403`: Access denied
  - `404`: Room not found
  - `500`: Request creation failed

### 2. Update Maintenance Status
- **Endpoint:** `PATCH /api/maintenance/:id`
- **Access:** Admin
- **Description:** Update the status of a maintenance request
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **URL Parameters:**
  - id: MongoDB ID of the maintenance request
- **Request Body:**
  ```json
  {
    "status": "assigned|in-progress|completed",
    "actualCost": "number",
    "completionNotes": "string"
  }
  ```
- **Response Format:**
  ```json
  {
    "id": "string",
    "status": "string",
    "completedAt": "string (ISO 8601 datetime, if status is completed)",
    "actualCost": "number",
    "completionNotes": "string",
    "type": "string",
    "priority": "string",
    "room": {
      "roomNumber": "string",
      "floor": "number"
    }
  }
  ```
- **Error Responses:**
  - `400`: Invalid status update
  - `401`: Unauthorized
  - `403`: Access denied
  - `404`: Maintenance request not found
  - `500`: Update failed

## Analytics Routes (`/api/analytics`)

### 1. Get Analytics Data
- **Endpoint:** `GET /api/analytics`
- **Access:** Admin only
- **Description:** Get comprehensive analytics data for the hotel
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Query Parameters:**
  - startDate: string (ISO 8601 date)
  - endDate: string (ISO 8601 date)
- **Response Format:**
  ```json
  {
    "occupancyRate": "number (percentage)",
    "revenue": "number",
    "bookingTrends": [
      {
        "_id": "string (YYYY-MM-DD)",
        "count": "number",
        "revenue": "number"
      }
    ]
  }
  ```
- **Error Responses:**
  - `400`: Invalid date range
  - `401`: Unauthorized
  - `403`: Access denied (not admin)
  - `500`: Analytics calculation failed

### Frontend Integration Notes for Analytics
1. Data Visualization:
   - Implement charts and graphs for revenue trends
   - Show occupancy rate visualizations
   - Create booking trends timeline
   - Display comparative analytics (current vs previous periods)

2. Dashboard Features:
   - Implement date range selection
   - Enable data export functionality
   - Show key performance indicators (KPIs)
   - Create printable reports

3. Real-time Updates:
   - Implement periodic data refresh
   - Show live occupancy updates
   - Display recent booking notifications
   - Track revenue in real-time

### Frontend Integration Notes
1. Store the JWT token securely (e.g., in localStorage or HTTP-only cookies)
2. Include the token in all subsequent authenticated requests:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   }
   ```
3. Implement token refresh logic if tokens expire
4. Handle role-based UI rendering based on user.role in the response
5. Implement proper error handling and user feedback for all error cases

### Frontend Integration Notes for Bookings
1. Implement form validation according to the booking validator schema:
   - roomId: Must be a valid MongoDB ID
   - checkIn: Must be a future date in ISO 8601 format
   - checkOut: Must be after checkIn date
   - numberOfGuests: Must be a positive integer
   - paymentMethod: Must be one of: 'mtn_momo', 'orange_money', 'visa'

2. Handle booking state management:
   - Update room availability after successful booking
   - Implement booking status tracking (pending → confirmed → checked-in → checked-out)
   - Handle payment flow integration

3. Role-based UI components:
   - Show check-in/check-out buttons only for staff roles
   - Display appropriate error messages for permission issues
   - Implement staff-only features with proper access control

### Frontend Integration Notes for Room Service
1. Implementation Considerations:
   - Maintain a list of available room service items with prices
   - Implement a shopping cart-like interface for item selection
   - Calculate total amount on the frontend before submission
   - Show appropriate status transitions based on current status

2. Status Management:
   - Implement real-time or polling updates for status changes
   - Display different UI elements based on request status
   - Enable/disable actions based on current status

3. Role-based Access:
   - Only show room service management interface to staff
   - Implement proper access control in frontend routes
   - Handle permission errors gracefully with user feedback

### Frontend Integration Notes for Housekeeping
1. Task Management:
   - Implement a calendar view for scheduled tasks
   - Show task lists grouped by floor or room type
   - Enable bulk task creation for efficiency
   - Implement task completion tracking

2. Status Tracking:
   - Use color coding for different task statuses
   - Implement task priority sorting
   - Show task duration and completion times
   - Enable task reassignment functionality

3. Staff Interface:
   - Mobile-friendly interface for housekeeping staff
   - Quick task completion marking
   - Photo upload capability for issues
   - Real-time task assignment notifications

### Frontend Integration Notes for Maintenance
1. Request Management:
   - Implement priority-based sorting and filtering
   - Show cost estimation vs actual cost comparison
   - Enable file/image attachments for maintenance issues
   - Track maintenance history per room

2. Status Workflow:
   - Implement status transition validations
   - Show maintenance duration tracking
   - Enable cost tracking and reporting
   - Implement maintenance schedule calendar

3. Staff Interface:
   - Priority-based task highlighting
   - Real-time status updates
   - Mobile-friendly maintenance forms
   - Cost approval workflow for high-cost maintenance

## Room Management Routes (`/api/rooms`)

### 1. List Rooms
- **Endpoint:** `GET /api/rooms`
- **Access:** Public
- **Description:** Get a list of all rooms with their current status
- **Request Headers:**
  - Content-Type: application/json
- **Query Parameters:**
  - type: string (optional, filter by room type)
  - status: string (optional, filter by availability status)
  - floor: number (optional, filter by floor number)
- **Response Format:**
  ```json
  {
    "rooms": [
      {
        "id": "string",
        "roomNumber": "string",
        "type": "single|double|suite|deluxe",
        "floor": "number",
        "status": "available|occupied|maintenance|cleaning",
        "price": "number",
        "amenities": ["string"],
        "maxOccupancy": "number"
      }
    ],
    "total": "number",
    "available": "number"
  }
  ```
- **Error Responses:**
  - `500`: Server error

### 2. Get Room Details
- **Endpoint:** `GET /api/rooms/:id`
- **Access:** Public
- **Description:** Get detailed information about a specific room
- **Request Headers:**
  - Content-Type: application/json
- **URL Parameters:**
  - id: MongoDB ID of the room
- **Response Format:**
  ```json
  {
    "id": "string",
    "roomNumber": "string",
    "type": "single|double|suite|deluxe",
    "floor": "number",
    "status": "available|occupied|maintenance|cleaning",
    "price": "number",
    "amenities": ["string"],
    "maxOccupancy": "number",
    "description": "string",
    "images": ["string (URLs)"],
    "maintenanceHistory": [
      {
        "date": "string (ISO 8601)",
        "type": "string",
        "description": "string"
      }
    ],
    "currentBooking": {
      "checkIn": "string (ISO 8601)",
      "checkOut": "string (ISO 8601)"
    }
  }
  ```
- **Error Responses:**
  - `404`: Room not found
  - `500`: Server error

### 3. Update Room Status
- **Endpoint:** `PATCH /api/rooms/:id/status`
- **Access:** Admin, Receptionist
- **Description:** Update the status of a room
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **URL Parameters:**
  - id: MongoDB ID of the room
- **Request Body:**
  ```json
  {
    "status": "available|occupied|maintenance|cleaning",
    "notes": "string (optional)"
  }
  ```
- **Response Format:**
  ```json
  {
    "id": "string",
    "roomNumber": "string",
    "status": "string",
    "updatedAt": "string (ISO 8601)",
    "message": "Room status updated successfully"
  }
  ```
- **Error Responses:**
  - `400`: Invalid status
  - `401`: Unauthorized
  - `403`: Access denied
  - `404`: Room not found
  - `500`: Update failed

## Payment Routes (`/api/payments`)

### 1. Initialize Payment
- **Endpoint:** `POST /api/payments/initialize`
- **Access:** Authenticated users
- **Description:** Initialize a payment transaction for a booking
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Request Body:**
  ```json
  {
    "bookingId": "string (MongoDB ID)",
    "amount": "number",
    "paymentMethod": "mtn_momo|orange_money|visa",
    "currency": "XAF"
  }
  ```
- **Response Format:**
  ```json
  {
    "transactionId": "string",
    "paymentUrl": "string (for card payments)",
    "paymentInstructions": "string (for mobile money)",
    "expiresIn": "number (seconds)",
    "amount": "number",
    "currency": "string",
    "status": "pending"
  }
  ```
- **Error Responses:**
  - `400`: Invalid payment data
  - `401`: Unauthorized
  - `404`: Booking not found
  - `500`: Payment initialization failed

### 2. Verify Payment
- **Endpoint:** `GET /api/payments/verify/:transactionId`
- **Access:** Authenticated users
- **Description:** Check the status of a payment transaction
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **URL Parameters:**
  - transactionId: The transaction ID from payment initialization
- **Response Format:**
  ```json
  {
    "transactionId": "string",
    "status": "pending|completed|failed",
    "paymentMethod": "string",
    "amount": "number",
    "currency": "string",
    "paidAt": "string (ISO 8601 datetime, if completed)",
    "booking": {
      "id": "string",
      "status": "string"
    }
  }
  ```
- **Error Responses:**
  - `400`: Invalid transaction ID
  - `401`: Unauthorized
  - `404`: Transaction not found
  - `500`: Verification failed

### 3. Process Refund
- **Endpoint:** `POST /api/payments/refund`
- **Access:** Admin only
- **Description:** Process a refund for a completed payment
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Request Body:**
  ```json
  {
    "transactionId": "string",
    "amount": "number",
    "reason": "string"
  }
  ```
- **Response Format:**
  ```json
  {
    "refundId": "string",
    "originalTransaction": "string",
    "amount": "number",
    "status": "processed",
    "processedAt": "string (ISO 8601 datetime)",
    "estimatedProcessingTime": "string"
  }
  ```
- **Error Responses:**
  - `400`: Invalid refund request
  - `401`: Unauthorized
  - `403`: Access denied (not admin)
  - `404`: Transaction not found
  - `500`: Refund processing failed

### Frontend Integration Notes for Payments
1. Payment Flow Implementation:
   - Handle different payment method flows appropriately
   - Implement payment status polling mechanism
   - Show clear payment instructions for mobile money
   - Handle payment timeouts and retries

2. Security Considerations:
   - Never store complete payment details on frontend
   - Implement proper error handling for failed payments
   - Show clear transaction status to users
   - Handle network issues gracefully

3. User Experience:
   - Show loading states during payment processing
   - Provide clear feedback for payment status
   - Implement payment receipt generation
   - Enable easy access to payment history

## Staff Management Routes (`/api/staff`)

### 1. List Staff
- **Endpoint:** `GET /api/staff`
- **Access:** Admin only
- **Description:** Get a list of all staff members
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Query Parameters:**
  - role: string (optional, filter by role)
  - status: string (optional, filter by active status)
- **Response Format:**
  ```json
  {
    "staff": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "receptionist|manager",
        "status": "active|inactive",
        "lastLogin": "string (ISO 8601 datetime)"
      }
    ],
    "total": "number"
  }
  ```
- **Error Responses:**
  - `401`: Unauthorized
  - `403`: Access denied (not admin)
  - `500`: Server error

### 2. Update Staff Status
- **Endpoint:** `PATCH /api/staff/:id/status`
- **Access:** Admin only
- **Description:** Update the active status of a staff member
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **URL Parameters:**
  - id: MongoDB ID of the staff member
- **Request Body:**
  ```json
  {
    "status": "active|inactive",
    "reason": "string (optional)"
  }
  ```
- **Response Format:**
  ```json
  {
    "id": "string",
    "name": "string",
    "status": "string",
    "updatedAt": "string (ISO 8601 datetime)",
    "message": "Staff status updated successfully"
  }
  ```
- **Error Responses:**
  - `400`: Invalid status
  - `401`: Unauthorized
  - `403`: Access denied (not admin)
  - `404`: Staff member not found
  - `500`: Update failed

### 3. Reset Staff Password
- **Endpoint:** `POST /api/staff/:id/reset-password`
- **Access:** Admin only
- **Description:** Reset password for a staff member
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **URL Parameters:**
  - id: MongoDB ID of the staff member
- **Request Body:**
  ```json
  {
    "newPassword": "string"
  }
  ```
- **Response Format:**
  ```json
  {
    "message": "Password reset successful",
    "lastPasswordReset": "string (ISO 8601 datetime)"
  }
  ```
- **Error Responses:**
  - `400`: Invalid password format
  - `401`: Unauthorized
  - `403`: Access denied (not admin)
  - `404`: Staff member not found
  - `500`: Password reset failed

## Booking History Routes (`/api/booking-history`)

### 1. Get Booking History
- **Endpoint:** `GET /api/booking-history`
- **Access:** Authenticated users (guests see their own, staff see all)
- **Description:** Get booking history with optional filters
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **Query Parameters:**
  - startDate: string (ISO 8601 date, optional)
  - endDate: string (ISO 8601 date, optional)
  - status: string (optional, filter by booking status)
  - guestId: string (optional, admin/staff only)
- **Response Format:**
  ```json
  {
    "bookings": [
      {
        "id": "string",
        "bookingNumber": "string",
        "guest": {
          "name": "string",
          "email": "string"
        },
        "room": {
          "roomNumber": "string",
          "type": "string"
        },
        "checkIn": "string (ISO 8601 datetime)",
        "checkOut": "string (ISO 8601 datetime)",
        "status": "string",
        "totalAmount": "number",
        "paymentStatus": "string"
      }
    ],
    "total": "number",
    "page": "number",
    "totalPages": "number"
  }
  ```
- **Error Responses:**
  - `400`: Invalid query parameters
  - `401`: Unauthorized
  - `500`: Server error

### 2. Get Booking Details
- **Endpoint:** `GET /api/booking-history/:bookingId`
- **Access:** Authenticated users (guests see their own, staff see all)
- **Description:** Get detailed information about a specific booking
- **Request Headers:**
  - Authorization: Bearer {token}
  - Content-Type: application/json
- **URL Parameters:**
  - bookingId: MongoDB ID of the booking
- **Response Format:**
  ```json
  {
    "booking": {
      "id": "string",
      "bookingNumber": "string",
      "guest": {
        "name": "string",
        "email": "string",
        "phone": "string"
      },
      "room": {
        "roomNumber": "string",
        "type": "string",
        "price": "number"
      },
      "checkIn": "string (ISO 8601 datetime)",
      "checkOut": "string (ISO 8601 datetime)",
      "status": "string",
      "paymentDetails": {
        "amount": "number",
        "status": "string",
        "method": "string",
        "transactions": [
          {
            "id": "string",
            "amount": "number",
            "status": "string",
            "date": "string (ISO 8601 datetime)"
          }
        ]
      },
      "services": [
        {
          "type": "room_service|housekeeping",
          "date": "string (ISO 8601 datetime)",
          "description": "string",
          "amount": "number"
        }
      ]
    }
  }
  ```
- **Error Responses:**
  - `401`: Unauthorized
  - `403`: Access denied
  - `404`: Booking not found
  - `500`: Server error

### Frontend Integration Notes for Booking History
1. History Display:
   - Implement filterable and sortable booking list
   - Show detailed view for individual bookings
   - Enable booking history export
   - Display payment history timeline

2. Role-based Access:
   - Show only relevant bookings based on user role
   - Enable admin/staff advanced search features
   - Implement proper permission checks
   - Handle access restrictions gracefully

3. Integration Features:
   - Link to related services (room service, housekeeping)
   - Enable quick actions for staff members
   - Implement booking status tracking
   - Show payment status indicators