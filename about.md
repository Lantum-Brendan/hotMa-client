# HotMa Hotel Management System Documentation

## Routes Overview

### Public Routes
1. `/` (HomePage)
   - Main landing page
   - Features:
     - Hero section with search widget
     - Room search functionality (check-in, check-out, guests, room type)
     - Featured rooms display
     - Hotel amenities section
     - Contact information
   - API Integration Points:
     - `/api/rooms/search` (Pending) - For room availability search

2. `/booking` (BookingWizard)
   - Multi-step booking process
   - Steps:
     1. Room Search
     2. Room Selection
     3. Guest Details
     4. Payment
     5. Confirmation
   - API Integration Points:
     - `/api/rooms/search` (Pending) - Room availability
     - `/api/bookings/create` (Pending) - Create new booking
     - `/api/payments/process` (Pending) - Process payment

3. `/manage-booking` (ManageBookingPage)
   - Booking management for guests
   - Features:
     - Booking lookup by booking number and email
     - Booking details display
     - Cancellation functionality
   - API Integration Points:
     - `/api/booking-history/guest` (Pending) - Retrieve booking
     - `/api/bookings/:bookingId/cancel` (Pending) - Cancel booking

### Protected Routes
1. `/dashboard` (GuestDashboard)
   - Customer dashboard
   - Features:
     - Quick room search
     - Upcoming bookings
     - Profile management
     - Booking history
   - API Integration Points:
     - `/api/user/profile` (Pending)
     - `/api/user/bookings` (Pending)

2. `/rooms` (RoomManagementPage)
   - Admin room management
   - Features:
     - Room listing with filters
     - Add/Edit rooms
     - Status management
   - API Integration Points:
     - `/api/rooms` (Pending) - CRUD operations
     - `/api/rooms/status` (Pending) - Status updates

3. `/receptionist` (ReceptionistDashboard)
   - Front desk operations
   - Features:
     - Check-in/out management
     - Room status monitoring
     - Payment processing
   - API Integration Points:
     - `/api/check-in-out` (Pending)
     - `/api/payments/pending` (Pending)

## Data Models

### Room
\`\`\`typescript
interface Room {
  id: string
  roomNumber: string
  type: string
  status: "available" | "occupied" | "cleaning" | "maintenance" | "out-of-order"
  floor: number
  view: string
  price: number
  amenities: string[]
  lastUpdated: string
}
\`\`\`

### BookingData
\`\`\`typescript
interface BookingData {
  bookingNumber: string
  room: {
    number: string
    type: string
    image: string
  }
  checkIn: string
  checkOut: string
  guestDetails?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    guestCount: number
    specialRequests: string
  }
  paymentMethod?: string
  paymentDetails?: any
  cancellationCode?: string
  status: "confirmed" | "completed" | "cancelled"
  totalAmount: number
}
\`\`\`

### CheckInOut
\`\`\`typescript
interface CheckInOut {
  id: string
  bookingNumber: string
  guestName: string
  roomNumber: string
  type: "check-in" | "check-out"
  scheduledTime: string
  status: "pending" | "completed" | "overdue"
}
\`\`\`

### RoomStatus
\`\`\`typescript
interface RoomStatus {
  id: string
  roomNumber: string
  type: string
  status: "available" | "occupied" | "cleaning" | "maintenance"
  guestName?: string
  checkOut?: string
}
\`\`\`

### PendingPayment
\`\`\`typescript
interface PendingPayment {
  id: string
  bookingNumber: string
  guestName: string
  amount: number
  type: "balance" | "incidentals"
  dueDate: string
  isOverdue: boolean
}
\`\`\`

## Integration Points To Be Implemented

1. Authentication System
   - User registration
   - Login/Logout
   - Role-based access control (Guest, Staff, Admin)

2. API Backend
   - Room management
   - Booking system
   - Payment processing
   - User management

3. External Integrations Needed
   - Payment gateway
   - Email service for notifications
   - SMS service for notifications
   - CAPTCHA service

## Next Steps

1. Backend Development
   - Set up API routes
   - Implement database models
   - Create authentication system

2. Integration Tasks
   - Connect frontend to backend API
   - Implement real payment processing
   - Set up email/SMS notifications
   - Add proper CAPTCHA verification

3. Additional Features
   - Room image management
   - Dynamic pricing system
   - Loyalty program
   - Staff management system

4. Testing Requirements
   - Unit tests for components
   - Integration tests for booking flow
   - End-to-end testing
   - Payment system testing

## Component Workflows

### Booking Flow Components

1. `components/booking/room-search-step.tsx`
   - First step in booking process
   - Responsibilities:
     - Date validation (no past dates)
     - Guest count validation (1-8 guests)
     - Optional room type filtering 
   - Props interface:
     ```typescript
     interface RoomSearchStepProps {
       data: BookingData
       onUpdate: (data: Partial<BookingData>) => void
       onNext: () => void
       setError: (error: string) => void
       setIsLoading: (loading: boolean) => void
     }
     ```

2. `components/booking/room-selection-step.tsx`
   - Second step in booking process
   - Features:
     - Room card display with images
     - Price calculation per night
     - Amenity display
     - Room availability check
   - Props interface:
     ```typescript
     interface RoomSelectionStepProps {
       data: BookingData
       onUpdate: (data: Partial<BookingData>) => void
       onNext: () => void
       onPrev: () => void
       setError: (error: string) => void
       setIsLoading: (loading: boolean) => void
     }
     ```

3. `components/booking/guest-details-step.tsx`
   - Third step in booking process
   - Validations:
     - Required fields (name, email, phone)
     - Email format
     - Phone number format
     - CAPTCHA verification
   - Features:
     - Special requests input
     - Sign-in option for existing users
   - Props interface: Same as RoomSelectionStepProps

4. `components/booking/payment-step.tsx`
   - Fourth step in booking process
   - Payment methods:
     - MTN Mobile Money
     - Credit/Debit Cards
   - Features:
     - Price breakdown
     - Tax calculation
     - Secure payment processing
   - Data generated:
     - Booking number
     - Cancellation code

5. `components/booking/confirmation-step.tsx`
   - Final step in booking process
   - Displays:
     - Booking summary
     - Check-in/out instructions
     - Cancellation policy
     - Contact information
   - Features:
     - PDF download option
     - Email confirmation

### Receptionist Dashboard Workflow

1. Check-in/Check-out Management
   - Component: `app/receptionist/page.tsx`
   - Data Models:
     ```typescript
     interface CheckInOut {
       id: string
       bookingNumber: string
       guestName: string
       roomNumber: string
       type: "check-in" | "check-out"
       scheduledTime: string
       status: "pending" | "completed" | "overdue"
     }
     ```
   - Features:
     - Real-time status updates
     - Overdue alerts
     - Guest notification system
   - API Requirements:
     - GET `/api/check-in-out/today`
     - PUT `/api/check-in-out/:id/status`
     - POST `/api/notifications/guest`

2. Room Status Management
   - Data Models:
     ```typescript
     interface RoomStatus {
       id: string
       roomNumber: string
       type: string
       status: "available" | "occupied" | "cleaning" | "maintenance"
       guestName?: string
       checkOut?: string
     }
     ```
   - Status Workflows:
     1. Check-in flow:
        - Available → Occupied
        - Update guest details
        - Send welcome notification
     2. Check-out flow:
        - Occupied → Cleaning
        - Generate bill
        - Schedule cleaning
     3. Maintenance flow:
        - Any status → Maintenance
        - Log maintenance request
        - Track completion

3. Payment Processing
   - Data Models:
     ```typescript
     interface PendingPayment {
       id: string
       bookingNumber: string
       guestName: string
       amount: number
       type: "balance" | "incidentals"
       dueDate: string
       isOverdue: boolean
     }
     ```
   - Payment Workflows:
     1. Regular payment:
        - Process payment
        - Generate receipt
        - Update booking status
     2. Overdue handling:
        - Send reminders
        - Apply late fees
        - Escalate if needed

### Room Management Workflow

1. Room CRUD Operations
   - Component: `app/rooms/page.tsx`
   - Features:
     - Batch operations
     - Status history
     - Maintenance logs
   - API Requirements:
     - GET `/api/rooms`
     - POST `/api/rooms`
     - PUT `/api/rooms/:id`
     - DELETE `/api/rooms/:id`

2. Room Filtering System
   ```typescript
   interface RoomFilters {
     type: string
     status: string
     minPrice: string
     maxPrice: string
     floor: string
   }
   ```
   - Filter Categories:
     - Room type
     - Availability status
     - Price range
     - Floor level
     - Amenities

3. Status Management Flow
   - Status transitions:
     ```
     Available ↔ Occupied
         ↓         ↓
     Cleaning ← Checkout
         ↓
     Maintenance
     ```
   - Auto-scheduling rules:
     - Cleaning after checkout
     - Regular maintenance
     - Deep cleaning cycles

4. Inventory Management
   - Amenities tracking
   - Maintenance supplies
   - Room equipment
   - API Requirements:
     - GET `/api/inventory/room/:id`
     - PUT `/api/inventory/update`
     - POST `/api/inventory/request`

### System Integration Requirements

1. Real-time Updates
   - WebSocket connections for:
     - Room status changes
     - Check-in/out updates
     - Payment notifications
   - Event types:
     ```typescript
     type SystemEvent =
       | { type: "ROOM_STATUS_CHANGE"; roomId: string; status: string }
       | { type: "CHECK_IN_OUT_UPDATE"; bookingId: string; status: string }
     ```

2. Background Processes
   - Automated tasks:
     - Room status updates
     - Payment reminders
     - Cleaning schedules
     - Maintenance alerts

3. External System Integration
   - Property Management System (PMS)
   - Housekeeping System
   - Accounting Software
   - CRM System

4. Reporting System
   - Required reports:
     - Occupancy rates
     - Revenue analytics
     - Staff performance
     - Maintenance logs
   - API endpoints needed:
     - GET `/api/reports/occupancy`
     - GET `/api/reports/revenue`
     - GET `/api/reports/maintenance`
     - GET `/api/reports/staff`

### State Management and Data Synchronization

1. Global State Requirements
   - User Authentication State
     ```typescript
     interface AuthState {
       isAuthenticated: boolean
       user: {
         id: string
         role: "guest" | "staff" | "admin"
         name: string
         email: string
       }
       token: string
     }
     ```
   - System Configuration
     ```typescript
     interface SystemConfig {
       checkInTime: string
       checkOutTime: string
       maintenanceHours: {
         start: string
         end: string
       }
       maxBookingDays: number
       cancellationPeriod: number // hours
     }
     ```

2. Data Persistence Requirements
   - Local Storage:
     - Auth tokens
     - User preferences
     - Form draft data
   - Session Storage:
     - Booking progress
     - Search filters
     - Temporary user inputs

3. Real-time Data Requirements
   - WebSocket Topics:
     ```typescript
     type WebSocketTopic =
       | "room_status"
       | "booking_updates"
       | "check_in_out"
       | "maintenance_alerts"
       | "payment_notifications"
     ```
   - Event Handlers:
     ```typescript
     interface WebSocketHandlers {
       onRoomStatusChange: (roomId: string, status: string) => void
       onBookingUpdate: (bookingId: string, status: string) => void
       onCheckInOut: (data: CheckInOut) => void
       onMaintenanceAlert: (roomId: string, issue: string) => void
       onPaymentUpdate: (bookingId: string, status: string) => void
     }
     ```

4. Cache Management
   - Cache Policies:
     ```typescript
     interface CachePolicy {
       key: string
       ttl: number // seconds
       invalidationEvents: string[]
       updateStrategy: "background" | "on-demand"
     }
     ```
   - Cached Resources:
     - Room availability
     - Room types and amenities
     - User bookings
     - System configuration

5. Data Synchronization Patterns
   - Optimistic Updates:
     ```typescript
     interface OptimisticUpdate<T> {
       data: T
       timestamp: number
       status: "pending" | "success" | "failed"
       rollback: () => void
     }
     ```
   - Conflict Resolution:
     ```typescript
     interface ConflictResolution {
       strategy: "client-wins" | "server-wins" | "manual"
       resolver?: (clientData: any, serverData: any) => any
     }
     ```

### Component Communication Patterns

1. Parent-Child Communication
   - Props Flow:
     - Data down
     - Events up
     - State updates through callbacks
   - Context Usage:
     - Authentication context
     - Theme context
     - Configuration context

2. Cross-Component Communication
   - Event Bus System:
     ```typescript
     interface EventBus {
       subscribe: (event: string, callback: (data: any) => void) => void
       publish: (event: string, data: any) => void
       unsubscribe: (event: string, callback: (data: any) => void) => void
     }
     ```
   - Events to Handle:
     - Room status changes
     - Booking updates
     - User notifications
     - System alerts

3. Component Update Triggers
   ```typescript
   type UpdateTrigger =
     | { type: "user_action"; action: string }
     | { type: "system_event"; event: string }
     | { type: "data_change"; path: string }
     | { type: "timer"; interval: number }
   ```

4. Error Boundary Implementation
   ```typescript
   interface ErrorBoundaryProps {
     fallback: React.ReactNode
     onError?: (error: Error, errorInfo: React.ErrorInfo) => void
     resetCondition?: any[]
   }
   ```

### Progressive Enhancement Strategy

1. Core Functionality
   - Basic room booking
   - Essential form validation
   - Simple status updates

2. Enhanced Features
   - Real-time updates
   - Advanced filtering
   - Interactive calendars
   - Rich media content

3. Premium Features
   - Virtual tours
   - AI-powered recommendations
   - Advanced analytics
   - Custom notifications

4. Feature Detection
   ```typescript
   interface FeatureSupport {
     webSocket: boolean
     localStorage: boolean
     serviceWorker: boolean
     pushNotifications: boolean
     paymentRequest: boolean
   }
   ```

### Testing Requirements

1. Unit Testing Strategy
   ```typescript
   interface TestSuite {
     component: string
     tests: {
       name: string
       type: "unit" | "integration" | "e2e"
       coverage: string[]
       mocks: string[]
     }[]
   }
   ```
   - Components to Test:
     - Form validations
     - Payment calculations
     - State management
     - UI interactions

2. Integration Testing
   - Workflow Tests:
     - Complete booking flow
     - Check-in/out process
     - Payment processing
     - Room status updates
   - API Integration:
     - Backend endpoints
     - External services
     - WebSocket connections

3. End-to-End Testing
   - User Journeys:
     - Guest booking process
     - Receptionist workflows
     - Admin management tasks
   - Cross-browser Testing:
     - Desktop browsers
     - Mobile browsers
     - Tablet devices

4. Performance Testing
   - Metrics to Monitor:
     ```typescript
     interface PerformanceMetrics {
       firstContentfulPaint: number
       timeToInteractive: number
       largestContentfulPaint: number
       cumulativeLayoutShift: number
       firstInputDelay: number
     }
     ```
   - Load Testing:
     - Concurrent users
     - Data throughput
     - Response times

### Deployment Requirements

1. Environment Configuration
   ```typescript
   interface Environment {
     name: "development" | "staging" | "production"
     apiUrl: string
     websocketUrl: string
     features: {
       enableRealtime: boolean
       enableAnalytics: boolean
       maintenanceMode: boolean
     }
     monitoring: {
       errorTracking: boolean
       performanceMonitoring: boolean
       userAnalytics: boolean
     }
   }
   ```

2. Build Process
   - Asset Optimization:
     - Code minification
     - Image optimization
     - CSS purging
   - Bundle Analysis:
     - Size monitoring
     - Dependency tracking
     - Code splitting

3. Deployment Pipeline
   ```typescript
   interface DeploymentStep {
     name: string
     environment: string
     tasks: {
       name: string
       command: string
       timeout: number
       rollback?: string
     }[]
     approvers?: string[]
   }
   ```

4. Monitoring Setup
   - Error Tracking:
     - JavaScript errors
     - API failures
     - Performance issues
   - User Analytics:
     - Usage patterns
     - Feature adoption
     - Performance metrics

### Security Measures

1. Authentication Implementation
   ```typescript
   interface AuthImplementation {
     strategies: {
       type: "jwt" | "session" | "oauth"
       provider?: string
       config: Record<string, any>
     }[]
     sessionManagement: {
       timeout: number
       renewal: "automatic" | "manual"
       concurrent: boolean
     }
     policies: {
       passwordComplexity: RegExp
       mfaRequired: boolean
       ipWhitelist?: string[]
     }
   }
   ```

2. Data Protection
   - Encryption:
     - In-transit (TLS)
     - At-rest
     - Sensitive data
   - Access Control:
     - Role-based
     - Resource-level
     - Time-based

3. Compliance Requirements
   - Standards:
     - GDPR
     - PCI DSS
     - ISO 27001
   - Documentation:
     - Privacy policy
     - Terms of service
     - Data handling

4. Security Monitoring
   ```typescript
   interface SecurityMonitoring {
     alerts: {
       type: string
       severity: "low" | "medium" | "high"
       action: "log" | "notify" | "block"
     }[]
     logging: {
       level: string
       retention: number
       encryption: boolean
     }
     scanning: {
       frequency: string
       scope: string[]
       automated: boolean
     }
   }
   ```

### Documentation Requirements

1. Technical Documentation
   - API Documentation
   - Component Documentation
   - State Management
   - Data Flow

2. User Documentation
   - Guest Manual
   - Staff Manual
   - Admin Manual
   - Training Materials

3. Maintenance Documentation
   - Deployment Procedures
   - Backup Procedures
   - Recovery Procedures
   - Monitoring Guides

### API Specifications

1. Room Management API
   ```typescript
   // Generated by Copilot
   interface RoomAPI {
     endpoints: {
       search: {
         path: "/api/rooms/search"
         method: "POST"
         body: {
           checkIn: string
           checkOut: string
           guests: number
           roomType?: string
         }
         response: {
           rooms: Room[]
           totalCount: number
           availability: {
             date: string
             availableCount: number
           }[]
         }
       }
       create: {
         path: "/api/rooms"
         method: "POST"
         body: Omit<Room, "id" | "lastUpdated">
         response: Room
       }
       update: {
         path: "/api/rooms/:id"
         method: "PUT"
         body: Partial<Room>
         response: Room
       }
       delete: {
         path: "/api/rooms/:id"
         method: "DELETE"
         response: { success: boolean }
       }
     }
     errorResponses: {
       400: { message: string; validationErrors?: Record<string, string> }
       401: { message: "Unauthorized" }
       403: { message: "Forbidden" }
       404: { message: "Room not found" }
       409: { message: "Room number already exists" }
       500: { message: "Internal server error" }
     }
   }
   ```

2. Booking API
   ```typescript
   // Generated by Copilot
   interface BookingAPI {
     endpoints: {
       create: {
         path: "/api/bookings"
         method: "POST"
         body: {
           roomId: string
           checkIn: string
           checkOut: string
           guestDetails: BookingData["guestDetails"]
           paymentIntent?: string
         }
         response: {
           booking: BookingData
           paymentIntent?: {
             clientSecret: string
             amount: number
           }
         }
       }
       cancel: {
         path: "/api/bookings/:id/cancel"
         method: "POST"
         body: {
           cancellationCode: string
           reason?: string
         }
         response: {
           success: boolean
           refundAmount?: number
         }
       }
       retrieve: {
         path: "/api/bookings/:id"
         method: "GET"
         response: BookingData
       }
     }
     webhooks: {
       paymentSuccess: {
         path: "/api/webhooks/payment"
         method: "POST"
         body: {
           type: "payment.success"
           bookingId: string
           paymentId: string
           amount: number
         }
       }
       paymentFailed: {
         path: "/api/webhooks/payment"
         method: "POST"
         body: {
           type: "payment.failed"
           bookingId: string
           paymentId: string
           error: string
         }
       }
     }
   }
   ```

### Error Handling Patterns

1. Client-side Error Types
   ```typescript
   // Generated by Copilot
   type ErrorType =
     | "ValidationError"
     | "NetworkError"
     | "AuthenticationError"
     | "PaymentError"
     | "BookingError"
     | "SystemError"

   interface ClientError {
     type: ErrorType
     message: string
     code?: string
     field?: string
     retry?: boolean
     recovery?: {
       action: "retry" | "reload" | "redirect" | "contact-support"
       path?: string
     }
   }
   ```

2. Error Recovery Strategies
   ```typescript
   // Generated by Copilot
   interface ErrorRecovery {
     strategies: {
       networkError: {
         maxRetries: number
         backoffMs: number
         exponential: boolean
       }
       validationError: {
         highlightFields: boolean
         scrollToError: boolean
         showInline: boolean
       }
       paymentError: {
         allowRetry: boolean
         alternativeMethods: boolean
         contactSupport: boolean
       }
       bookingError: {
         checkAlternatives: boolean
         offerWaitlist: boolean
         suggestDates: boolean
       }
     }
     fallback: {
       component: React.ComponentType<{ error: ClientError }>
       action: () => void
     }
   }
   ```

3. Error Response Handling
   ```typescript
   // Generated by Copilot
   interface ErrorHandler {
     displayStrategies: {
       toast: {
         duration: number
         position: "top" | "bottom"
         type: "error" | "warning" | "info"
       }
       modal: {
         dismissable: boolean
         action?: {
           label: string
           handler: () => void
         }
       }
       inline: {
         position: "above" | "below"
         icon?: boolean
         theme: "light" | "dark"
       }
     }
     logging: {
       level: "error" | "warn" | "info"
       metadata: {
         user?: string
         session?: string
         url: string
         timestamp: number
       }
     }
     recovery: {
       automatic: boolean
       maxAttempts: number
       fallbackAction?: () => void
     }
   }
   ```

4. API Error Responses
   ```typescript
   // Generated by Copilot
   interface APIErrorResponse {
     error: {
       code: string
       message: string
       details?: {
         field?: string
         constraint?: string
         value?: any
         suggestion?: string
       }[]
       timestamp: string
       requestId: string
       path: string
     }
     meta?: {
       documentation: string
       supportContact: string
     }
   }
   ```

### Integration Testing Scenarios

1. Booking Flow Tests
   ```typescript
   // Generated by Copilot
   interface BookingTestScenarios {
     happyPath: {
       description: "Complete booking flow with payment"
       steps: [
         "Search rooms with valid dates",
         "Select available room",
         "Enter valid guest details",
         "Complete payment",
         "Receive confirmation"
       ]
       assertions: [
         "Booking created in database",
         "Payment processed",
         "Confirmation email sent",
         "Room status updated"
       ]
     }
     errorCases: {
       validation: ["Invalid dates", "Missing details", "Invalid payment"]
       availability: ["Room taken", "Price changed", "Maintenance"]
       payment: ["Declined", "Timeout", "Invalid card"]
       system: ["Network error", "Server error", "Database error"]
     }
     recovery: {
       retryPayment: boolean
       alternativeRooms: boolean
       waitlist: boolean
       refund: boolean
     }
   }
   ```

### Notification System Specifications

1. Email Templates
   ```typescript
   // Generated by Copilot
   interface EmailTemplate {
     type: 
       | "booking_confirmation"
       | "check_in_reminder"
       | "check_out_reminder"
       | "payment_receipt"
       | "cancellation_confirmation"
       | "feedback_request"
     variables: {
       bookingRef?: string
       guestName: string
       hotelName: string
       dates?: {
         checkIn: string
         checkOut: string
       }
       amount?: number
       roomDetails?: {
         number: string
         type: string
       }
       customMessage?: string
     }
     scheduling: {
       trigger: "immediate" | "scheduled"
       delay?: number // minutes
       retry: {
         attempts: number
         interval: number
       }
     }
   }
   ```

2. SMS Notifications
   ```typescript
   // Generated by Copilot
   interface SMSNotification {
     templates: {
       [K in "welcome" | "reminder" | "emergency" | "promotion"]: {
         content: string
         maxLength: number
         variables: string[]
         timing: {
           allowedHours: number[]
           timezone: string
         }
       }
     }
     delivery: {
       priority: "high" | "normal" | "low"
       provider: string
       fallback?: string
       tracking: {
         deliveryStatus: boolean
         readReceipt: boolean
       }
     }
   }
   ```

3. Push Notifications
   ```typescript
   // Generated by Copilot
   interface PushNotification {
     templates: {
       booking: {
         confirmed: string
         cancelled: string
         reminder: string
       }
       payment: {
         success: string
         failure: string
       }
       system: {
         maintenance: string
         update: string
       }
     }
     scheduling: {
       immediate: boolean
       delayed: {
         enabled: boolean
         duration: number
       }
     }
     targeting: {
       allUsers: boolean
       specificUsers: string[]
       segments: string[]
     }
   }
   ```

### Analytics Integration

1. User Behavior Tracking
   ```typescript
   // Generated by Copilot
   interface AnalyticsEvent {
     category: 
       | "booking_flow"
       | "room_search"
       | "user_interaction"
       | "payment"
       | "error"
     action: string
     label?: string
     value?: number
     metadata: {
       userId?: string
       sessionId: string
       timestamp: number
       path: string
       device: {
         type: string
         os: string
         browser: string
       }
       performance?: {
         loadTime: number
         interactionTime: number
       }
     }
   }
   ```

2. Business Metrics
   ```typescript
   // Generated by Copilot
   interface BusinessMetrics {
     bookings: {
       totalCount: number
       revenue: number
       averageValue: number
       cancellationRate: number
       sourcesBreakdown: Record<string, number>
     }
     rooms: {
       occupancyRate: number
       averageDailyRate: number
       revenuePerAvailableRoom: number
       popularTypes: Array<{
         type: string
         bookingCount: number
         revenue: number
       }>
     }
     customers: {
       newVsReturning: {
         new: number
         returning: number
       }
       satisfaction: {
         nps: number
         reviews: {
           average: number
           count: number
         }
       }
       lifetime: {
         value: number
         stayCount: number
       }
     }
   }
   ```

3. Performance Monitoring
   ```typescript
   // Generated by Copilot
   interface PerformanceMonitoring {
     metrics: {
       api: {
         endpoint: string
         responseTime: number
         errorRate: number
         successRate: number
       }[]
       frontend: {
         route: string
         loadTime: number
         firstPaint: number
         firstContentfulPaint: number
         timeToInteractive: number
       }[]
       resources: {
         type: string
         size: number
         loadTime: number
         cached: boolean
       }[]
     }
     alerts: {
       conditions: {
         metric: string
         threshold: number
         duration: number
         severity: "critical" | "warning" | "info"
       }[]
       notifications: {
         channels: ("email" | "slack" | "sms")[]
         escalation: {
           delay: number
           levels: string[]
         }
       }
     }
   }
   ```

### Dashboard Analytics Views

1. Operations Dashboard
   ```typescript
   // Generated by Copilot
   interface OperationsDashboard {
     realtime: {
       occupancy: {
         current: number
         trend: number[]
         forecast: number[]
       }
       checkIns: {
         pending: number
         completed: number
         delayed: number
       }
       maintenance: {
         active: number
         scheduled: number
         overdue: number
       }
     }
     reports: {
       daily: {
         revenue: number
         occupancy: number
         incidents: number
       }
       trends: {
         period: "day" | "week" | "month"
         data: Array<{
           date: string
           metrics: Record<string, number>
         }>
       }
     }
   }
   ```

2. Revenue Analytics
   ```typescript
   // Generated by Copilot
   interface RevenueAnalytics {
     metrics: {
       revenue: {
         total: number
         breakdown: {
           roomCharges: number
           amenities: number
           services: number
         }
         comparison: {
           previousPeriod: number
           yearOverYear: number
         }
       }
       rates: {
         averageDaily: number
         revenuePerAvailable: number
         occupancyRate: number
       }
     }
     forecasting: {
       nextPeriod: {
         expected: number
         confidence: number
         factors: string[]
       }
       seasonal: {
         patterns: Array<{
           period: string
           impact: number
         }>
         recommendations: {
           pricing: string[]
           capacity: string[]
         }
       }
     }
   }
   ```

### Infrastructure and DevOps Specifications

1. Cloud Infrastructure
   ```typescript
   // Generated by Copilot
   interface CloudInfrastructure {
     hosting: {
       provider: "AWS" | "GCP" | "Azure"
       regions: string[]
       services: {
         compute: {
           type: "serverless" | "container" | "vm"
           scaling: {
             min: number
             max: number
             metrics: string[]
           }
         }
         storage: {
           types: ("object" | "file" | "block")[]
           backup: {
             frequency: string
             retention: string
             encryption: boolean
           }
         }
         database: {
           type: "relational" | "document" | "cache"
           replication: boolean
           backupStrategy: string
         }
       }
     }
     networking: {
       cdn: boolean
       ssl: {
         provider: string
         autoRenewal: boolean
       }
       firewall: {
         rules: Array<{
           port: number
           source: string
           protocol: string
         }>
       }
     }
   }
   ```

2. CI/CD Pipeline
   ```typescript
   // Generated by Copilot
   interface CIPipeline {
     triggers: {
       push: {
         branches: string[]
         paths: string[]
       }
       pullRequest: {
         types: string[]
         targetBranches: string[]
       }
       schedule: {
         cron: string
         timezone: string
       }
     }
     stages: {
       build: {
         steps: string[]
         cache: boolean
         artifacts: string[]
       }
       test: {
         unit: boolean
         integration: boolean
         e2e: boolean
         coverage: {
           threshold: number
           report: boolean
         }
       }
       deploy: {
         environments: string[]
         strategy: "rolling" | "blue-green" | "canary"
         rollback: {
           automatic: boolean
           conditions: string[]
         }
       }
     }
   }
   ```

### Monitoring and Alerting

1. System Health Monitoring
   ```typescript
   // Generated by Copilot
   interface SystemHealth {
     metrics: {
       system: {
         cpu: {
           usage: number
           load: number[]
           processes: number
         }
         memory: {
           total: number
           used: number
           swap: number
         }
         disk: {
           usage: number
           iops: number
           latency: number
         }
       }
       application: {
         response: {
           p50: number
           p90: number
           p99: number
         }
         errors: {
           rate: number
           types: Record<string, number>
         }
         throughput: {
           requests: number
           bandwidth: number
         }
       }
     }
     thresholds: {
       warning: Record<string, number>
       critical: Record<string, number>
       action: Record<string, string>
     }
   }
   ```

2. Alert Configuration
   ```typescript
   // Generated by Copilot
   interface AlertConfig {
     rules: Array<{
       name: string
       condition: string
       duration: string
       severity: "info" | "warning" | "critical"
       channels: {
         email?: string[]
         slack?: string
         webhook?: string
         pagerDuty?: string
       }
       grouping: {
         by: string[]
         window: string
       }
       silencing: {
         enabled: boolean
         duration?: string
         conditions?: string[]
       }
     }>
     notifications: {
       templates: {
         email: string
         slack: string
         sms: string
       }
       throttling: {
         maxPerHour: number
         groupingWindow: string
       }
       escalation: {
         levels: number
         interval: string
         contacts: string[]
       }
     }
   }
   ```

3. Log Management
   ```typescript
   // Generated by Copilot
   interface LogManagement {
     collection: {
       sources: {
         application: boolean
         system: boolean
         security: boolean
         access: boolean
       }
       format: {
         timestamp: string
         level: string
         service: string
         correlation: string
       }
       retention: {
         duration: string
         archival: boolean
         compression: boolean
       }
     }
     analysis: {
       realtime: {
         enabled: boolean
         latency: number
         alerts: boolean
       }
       storage: {
         type: string
         indexing: boolean
         partitioning: string[]
       }
       queries: {
         predefined: string[]
         customizable: boolean
         export: boolean
       }
     }
   }
   ```

### Disaster Recovery Plan

1. Backup Strategy
   ```typescript
   // Generated by Copilot
   interface BackupStrategy {
     types: {
       full: {
         frequency: string
         retention: string
         verification: boolean
       }
       incremental: {
         frequency: string
         retention: string
         chainLength: number
       }
       snapshot: {
         frequency: string
         retention: string
         consistency: boolean
       }
     }
     storage: {
       location: string[]
       encryption: {
         atRest: boolean
         inTransit: boolean
         keys: string[]
       }
       validation: {
         schedule: string
         method: string[]
         notification: boolean
       }
     }
   }
   ```

2. Recovery Procedures
   ```typescript
   // Generated by Copilot
   interface RecoveryProcedure {
     scenarios: {
       dataLoss: {
         rpo: string // Recovery Point Objective
         steps: string[]
         verification: string[]
       }
       systemFailure: {
         rto: string // Recovery Time Objective
         steps: string[]
         fallback: string[]
       }
       disaster: {
         site: {
           location: string
           activation: string[]
           synchronization: string[]
         }
         communication: {
           stakeholders: string[]
           templates: string[]
           channels: string[]
         }
       }
     }
     testing: {
       schedule: string
       coverage: string[]
       documentation: string[]
       improvements: string[]
     }
   }
   ```

### Accessibility Requirements

1. WCAG Compliance
   ```typescript
   // Generated by Copilot
   interface AccessibilityCompliance {
     level: "A" | "AA" | "AAA"
     guidelines: {
       perceivable: {
         imageAlts: boolean
         captions: boolean
         adaptable: boolean
         distinguishable: boolean
       }
       operable: {
         keyboardAccessible: boolean
         timingAdjustable: boolean
         navigable: boolean
         inputModalities: boolean
       }
       understandable: {
         readable: boolean
         predictable: boolean
         inputAssistance: boolean
       }
       robust: {
         compatible: boolean
         parseability: boolean
       }
     }
     testing: {
       automation: string[]
       manualChecks: string[]
       userTesting: boolean
     }
   }
   ```

2. Keyboard Navigation
   ```typescript
   // Generated by Copilot
   interface KeyboardNavigation {
     focusManagement: {
       trapFocus: boolean
       restoreFocus: boolean
       focusOrder: "dom" | "manual"
       indicators: {
         visible: boolean
         style: "outline" | "highlight"
       }
     }
     shortcuts: {
       booking: {
         search: string
         selectRoom: string
         proceed: string
         back: string
       }
       management: {
         quickActions: Record<string, string>
         navigation: Record<string, string>
       }
     }
   }
   ```

3. Screen Reader Support
   ```typescript
   // Generated by Copilot
   interface ScreenReaderSupport {
     ariaLabels: {
       required: boolean
       dynamic: boolean
       landmarks: boolean
     }
     liveRegions: {
       alerts: boolean
       status: boolean
       notifications: boolean
     }
     descriptions: {
       images: boolean
       charts: boolean
       actions: boolean
     }
     announcements: {
       pageChanges: boolean
       loadingStates: boolean
       errors: boolean
     }
   }
   ```

### Internationalization Support

1. Language Support
   ```typescript
   // Generated by Copilot
   interface LanguageSupport {
     languages: {
       code: string
       name: string
       direction: "ltr" | "rtl"
       fallback?: string
       active: boolean
     }[]
     translation: {
       namespace: string
       keys: string[]
       variables: string[]
       formatting: {
         numbers: boolean
         dates: boolean
         currency: boolean
       }
     }
     switching: {
       persistence: boolean
       urlBased: boolean
       autoDetect: boolean
     }
   }
   ```

2. Regional Settings
   ```typescript
   // Generated by Copilot
   interface RegionalSettings {
     formats: {
       date: {
         short: string
         long: string
         calendar: "gregorian" | "islamic" | "buddhist"
       }
       time: {
         format: "12h" | "24h"
         timezone: string
         displayGMT: boolean
       }
       numbers: {
         decimal: string
         thousand: string
         currency: {
           symbol: string
           position: "before" | "after"
         }
       }
     }
     localization: {
       address: {
         format: string[]
         required: string[]
         validation: Record<string, RegExp>
       }
       phone: {
         format: string
         countryCode: boolean
         validation: RegExp
       }
     }
   }
   ```

3. Content Adaptation
   ```typescript
   // Generated by Copilot
   interface ContentAdaptation {
     images: {
       culturalConsiderations: boolean
       alternativeText: boolean
       directionAware: boolean
     }
     messaging: {
       tone: Record<string, string>
       formality: Record<string, "casual" | "formal">
       honorifics: boolean
     }
     layout: {
       textDirection: boolean
       spacing: boolean
       containerAlignment: boolean
     }
     components: {
       datePicker: {
         firstDayOfWeek: number
         weekendDays: number[]
         holidays: {
           source: string
           display: boolean
         }
       }
       currency: {
         mainCurrency: string
         exchangeRates: boolean
         autoConvert: boolean
       }
     }
   }
   ```

### Content Management

1. Dynamic Content
   ```typescript
   // Generated by Copilot
   interface DynamicContent {
     types: {
       roomDescriptions: {
         fields: string[]
         formatting: boolean
         media: boolean
       }
       amenities: {
         categories: string[]
         icons: boolean
         availability: boolean
       }
       policies: {
         versions: boolean
         effective: Date
         acknowledgment: boolean
       }
     }
     scheduling: {
       publication: {
         startDate: Date
         endDate?: Date
         timezone: string
       }
       visibility: {
         roles: string[]
         regions: string[]
         conditions: string[]
       }
     }
   }
   ```

2. Media Management
   ```typescript
   // Generated by Copilot
   interface MediaManagement {
     assets: {
       images: {
         formats: string[]
         sizes: {
           thumbnail: number[]
           preview: number[]
           fullsize: number[]
         }
         optimization: {
           quality: number
           progressive: boolean
           responsive: boolean
         }
       }
       videos: {
         formats: string[]
         quality: string[]
         streaming: boolean
         thumbnails: boolean
       }
     }
     storage: {
       provider: string
       cdn: boolean
       caching: {
         duration: number
         invalidation: string[]
       }
     }
     processing: {
       onUpload: {
         resize: boolean
         compress: boolean
         metadata: boolean
       }
       variants: {
         create: boolean
         sync: boolean
         cleanup: boolean
       }
     }
   }
   ```

### Search Engine Optimization

1. SEO Configuration
   ```typescript
   // Generated by Copilot
   interface SEOConfiguration {
     metadata: {
       title: {
         template: string
         separator: string
         maxLength: number
       }
       description: {
         template: string
         maxLength: number
       }
       keywords: {
         automatic: boolean
         manual: string[]
       }
     }
     structuredData: {
       hotel: {
         schema: "Hotel"
         required: string[]
         optional: string[]
       }
       room: {
         schema: "Room"
         pricing: boolean
         availability: boolean
       }
       breadcrumbs: {
         generate: boolean
         maxLevels: number
       }
     }
     urlManagement: {
       structure: {
         rooms: string
         booking: string
         information: string
       }
       parameters: {
         tracking: string[]
         session: string[]
         utm: string[]
       }
     }
   }
   ```

### User Experience Flows

1. Guest Journey Mapping
   ```typescript
   // Generated by Copilot
   interface GuestJourney {
     touchpoints: {
       discovery: {
         channels: string[]
         entryPoints: string[]
         conversionGoals: string[]
       }
       booking: {
         steps: string[]
         decisionPoints: string[]
         abandonmentTriggers: string[]
       }
       preStay: {
         communications: string[]
         preparations: string[]
         expectations: string[]
       }
       stay: {
         checkIn: string[]
         inStayServices: string[]
         feedback: string[]
       }
       postStay: {
         followUp: string[]
         loyalty: string[]
         retention: string[]
       }
     }
     personas: {
       type: string
       characteristics: string[]
       needs: string[]
       painPoints: string[]
     }[]
   }
   ```

2. Mobile Interaction Patterns
   ```typescript
   // Generated by Copilot
   interface MobileInteractions {
     gestures: {
       swipe: {
         directions: ("left" | "right" | "up" | "down")[]
         actions: Record<string, () => void>
         threshold: number
       }
       pinch: {
         enabled: boolean
         minScale: number
         maxScale: number
       }
       tap: {
         doubleTab: boolean
         longPress: boolean
         feedback: "haptic" | "visual" | "none"
       }
     }
     navigation: {
       bottomBar: {
         enabled: boolean
         items: number
         labels: boolean
       }
       drawer: {
         edge: "left" | "right"
         gesture: boolean
         width: number
       }
     }
     forms: {
       inputs: {
         keyboard: string
         autoComplete: boolean
         validation: "immediate" | "onBlur" | "onSubmit"
       }
       scrolling: {
         smooth: boolean
         restorePosition: boolean
         keyboardAvoidance: boolean
       }
     }
   }
   ```

### Responsive Design Patterns

1. Breakpoint System
   ```typescript
   // Generated by Copilot
   interface BreakpointSystem {
     breakpoints: {
       xs: number // mobile portrait
       sm: number // mobile landscape
       md: number // tablet portrait
       lg: number // tablet landscape/desktop
       xl: number // large desktop
     }
     containers: {
       maxWidth: Record<string, string>
       padding: Record<string, string>
       margin: Record<string, string>
     }
     grid: {
       columns: Record<string, number>
       gap: Record<string, string>
       layout: "fluid" | "fixed" | "hybrid"
     }
   }
   ```

2. Component Adaptations
   ```typescript
   // Generated by Copilot
   interface ComponentAdaptations {
     navigation: {
       desktop: {
         type: "horizontal" | "vertical"
         maxItems: number
         dropdowns: boolean
       }
       mobile: {
         type: "drawer" | "bottom" | "modal"
         collapsed: boolean
         hamburger: boolean
       }
     }
     content: {
       images: {
         loading: "lazy" | "eager"
         sizes: string[]
         breakpoints: Record<string, string>
       }
       tables: {
         overflow: "scroll" | "stack" | "collapse"
         minWidth: number
         stickyHeader: boolean
       }
     }
     forms: {
       layout: {
         labelPosition: Record<string, "top" | "left" | "float">
         fieldWidth: Record<string, string>
         spacing: Record<string, string>
       }
       interactions: {
         touch: {
           targetSize: number
           spacing: number
         }
         keyboard: {
           shortcuts: boolean
           navigation: boolean
         }
       }
     }
   }
   ```

3. Performance Optimizations
   ```typescript
   // Generated by Copilot
   interface PerformanceOptimizations {
     loading: {
       strategy: {
         images: "lazy" | "eager" | "progressive"
         fonts: "swap" | "block" | "optional"
         components: "lazy" | "eager" | "on-demand"
       }
       thresholds: {
         mobile: {
           lcp: number // Largest Contentful Paint
           fid: number // First Input Delay
           cls: number // Cumulative Layout Shift
         }
         desktop: {
           lcp: number
           fid: number
           cls: number
         }
       }
     }
     optimization: {
       images: {
         formats: string[]
         quality: number
         sizes: string[]
       }
       code: {
         splitting: boolean
         minification: boolean
         treeshaking: boolean
       }
       cache: {
         strategy: "stale-while-revalidate" | "cache-first"
         duration: number
         invalidation: string[]
       }
     }
   }
   ```

### Room Presentation Guidelines

1. Visual Content Requirements
   ```typescript
   // Generated by Copilot
   interface RoomPresentation {
     images: {
       required: {
         views: string[] // ["main", "bathroom", "view"]
         angles: string[] // ["front", "side", "panorama"]
         features: string[] // ["bed", "workspace", "amenities"]
       }
       specifications: {
         minResolution: number[]
         aspectRatio: string
         fileSize: {
           min: number
           max: number
         }
       }
       optimization: {
         quality: number
         formats: string[]
         responsive: string[]
       }
     }
     virtualTour: {
       type: "360" | "3D" | "video"
       requirements: {
         duration?: number
         resolution?: string
         interactive: boolean
       }
       features: {
         hotspots: boolean
         measurements: boolean
         annotations: boolean
       }
     }
   }
   ```

2. Content Description Standards
   ```typescript
   // Generated by Copilot
   interface ContentStandards {
     roomDetails: {
       required: {
         name: string
         type: string
         size: string
         occupancy: number
         bedType: string[]
         view: string
       }
       amenities: {
         categories: string[]
         icons: boolean
         descriptions: boolean
       }
       pricing: {
         display: "rate" | "range" | "from"
         includes: string[]
         addons: {
           name: string
           price: number
           description: string
         }[]
       }
     }
     accessibility: {
       features: string[]
       measurements: boolean
       certifications: string[]
       accommodations: string[]
     }
   }
   ```