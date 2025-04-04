# PathXpressAI Backend API Documentation

## Overview
PathXpressAI is a route optimization service built with AWS Amplify and Next.js. The service provides APIs for route optimization, route management, calendar integration, and fleet management.

## Architecture
- **Frontend**: Next.js (>=13.5.0 <16.0.0)
- **Backend**: AWS Amplify
- **Database**: Amazon DynamoDB
- **Authentication**: Amazon Cognito
- **APIs**: AWS AppSync (GraphQL) & API Gateway (REST)
- **Functions**: AWS Lambda
- **Storage**: Amazon S3
- **CDN**: Amazon CloudFront

## Enums

### Subscription Related
```typescript
enum SubscriptionTier {
  FREE
  WEEKLY
  MONTHLY
  YEARLY
}

enum SubscriptionStatus {
  ACTIVE
  INACTIVE
  PAST_DUE
}
```

### Route Related
```typescript
enum RouteStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

enum ScheduleStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

### Fleet Management
```typescript
enum SubUserRole {
  DRIVER
  DISPATCHER
  MANAGER
}

enum SubUserStatus {
  ACTIVE
  INACTIVE
  PENDING
}

enum VehicleType {
  CAR
  VAN
  TRUCK
  SUV
  OTHER
}

enum FuelType {
  GASOLINE
  DIESEL
  ELECTRIC
  HYBRID
  OTHER
}

enum VehicleStatus {
  ACTIVE
  MAINTENANCE
  INACTIVE
}
```

### Authentication
```typescript
enum MFAType {
  TOTP
  SMS
}
```

### Calendar Related
```typescript
enum CalendarVisibility {
  PRIVATE
  TEAM
  PUBLIC
}

enum CalendarEventStatus {
  CONFIRMED
  TENTATIVE
  CANCELLED
}

enum CalendarSharePermissions {
  READ
  WRITE
  ADMIN
}

enum CalendarShareStatus {
  PENDING
  ACCEPTED
  DECLINED
}
```

## Data Models

### User
```typescript
type User {
  id: ID!
  email: String!
  name: String!
  homeBase: String
  authUserId: String!
  language: String
  preferences: AWSJSON
  onboarded: Boolean
  terms: Boolean
  privacy_policy: Boolean
  subscriptionPlans: AWSJSON
  isEnterprise: Boolean
  createdAt: String
  updatedAt: String
}
```

### UserCustomer
```typescript
type UserCustomer {
  id: ID!
  userEmail: String!
  name: String!
  address: String!
  phone: String
  email: String
  preferredDays: [String]
  preferredTimeSlot: String
  notes: String
  createdAt: String
  updatedAt: String
}
```

### Route
```typescript
type Route {
  id: ID!
  userEmail: String!
  name: String!
  description: String
  homeBase: String!
  customers: [String!]!
  timeSlots: AWSJSON
  optimizationParams: AWSJSON
  optimizedRoute: AWSJSON
  status: RouteStatus!
  estimatedDuration: Int
  estimatedDistance: Int
  estimatedCost: Float
  tags: [String]
  favorite: Boolean
  lastUsed: String
  useCount: Int
  createdAt: String
  updatedAt: String
}
```

### RouteSchedule
```typescript
type RouteSchedule {
  id: ID!
  userEmail: String!
  routeId: String!
  title: String!
  date: String!
  startTime: String!
  endTime: String
  status: ScheduleStatus!
  notes: String
  color: String
  isRecurring: Boolean
  recurrenceRule: String
  recurrenceId: String
  notificationSettings: AWSJSON
  createdAt: String
  updatedAt: String
}
```

### Calendar
```typescript
type Calendar {
  id: ID!
  userEmail: String!
  name: String!
  description: String
  color: String
  isDefault: Boolean
  visibility: String
  settings: AWSJSON
  createdAt: String
  updatedAt: String
}
```

### CalendarShare
```typescript
type CalendarShare {
  id: ID!
  calendarId: String!
  ownerEmail: String!
  sharedWithEmail: String!
  permissions: String!
  status: String!
  createdAt: String
  updatedAt: String
}
```

### CalendarEvent
```typescript
type CalendarEvent {
  id: ID!
  calendarId: String!
  userEmail: String!
  title: String!
  description: String
  location: String
  startTime: String!
  endTime: String
  allDay: Boolean
  color: String
  isRecurring: Boolean
  recurrenceRule: String
  recurrenceId: String
  notificationSettings: AWSJSON
  status: String!
  createdAt: String
  updatedAt: String
}
```

### UserSubscription
```typescript
type UserSubscription {
  id: ID!
  userEmail: String!
  tier: SubscriptionTier!
  status: SubscriptionStatus!
  startDate: String!
  endDate: String
  paymentMethodId: String
  stripeCustomerId: String
  stripeSubscriptionId: String
}
```

### SubscriptionPlan
```typescript
type SubscriptionPlan {
  id: ID!
  name: String!
  tier: SubscriptionTier!
  price: Float!
  billingCycle: String!
  features: AWSJSON!
  maxRoutesPerDay: Int!
  maxCustomers: Int!
  maxVehicles: Int!
  maxSubUsers: Int!
  isActive: Boolean!
  createdAt: String
  updatedAt: String
}
```

### MFASettings
```typescript
type MFASettings {
  id: ID!
  userEmail: String!
  enabled: Boolean!
  preferredMFA: MFAType
}
```

### SubUser
```typescript
type SubUser {
  id: ID!
  parentUserEmail: String!
  email: String!
  name: String!
  phone: String
  role: SubUserRole!
  status: SubUserStatus!
  homeBase: String
  language: String
  permissions: AWSJSON
  assignedVehicle: String
  createdAt: String
  updatedAt: String
}
```

### Vehicle
```typescript
type Vehicle {
  id: ID!
  userEmail: String!
  name: String!
  make: String
  model: String
  year: Int
  licensePlate: String
  vin: String
  type: VehicleType
  capacity: Float
  fuelType: FuelType
  fuelEfficiency: Float
  status: VehicleStatus
  assignedTo: String
  lastMaintenanceDate: String
  nextMaintenanceDate: String
  notes: String
  createdAt: String
  updatedAt: String
}
```

### RouteRecommendation
```typescript
type RouteRecommendation {
  route: Route!
  weatherConditions: WeatherConditions
  personalScore: Float
  recommendationReason: String
}
```

### WeatherConditions
```typescript
type WeatherConditions {
  temperature: Float
  condition: String
  windSpeed: Float
  precipitation: Float
  alerts: [String]
}
```

### CalendarEventResponse
```typescript
type CalendarEventResponse {
  id: ID!
  title: String!
  start: String!
  end: String
  allDay: Boolean
  color: String
  type: String!
  calendarId: ID!
  status: CalendarEventStatus!
  isRecurring: Boolean
  recurrenceId: ID
}
```

### RouteScheduleResponse
```typescript
type RouteScheduleResponse {
  id: ID!
  title: String!
  start: String!
  end: String
  color: String
  type: String!
  routeId: ID!
  status: ScheduleStatus!
  isRecurring: Boolean
  recurrenceId: ID
}
```

## GraphQL API

### Route Management

#### Query
```graphql
type Query {
  # Get a user's route history with pagination and filtering
  getRouteHistory(input: GetRouteHistoryInput!): RouteHistoryResponse
  
  # Get daily recommended routes based on user preferences
  getDailyRoutes(input: GetDailyRoutesInput!): DailyRoutesResponse
}
```

#### Mutation
```graphql
type Mutation {
  # Save a route for future reference
  saveRoute(input: SaveRouteInput!): Route
}
```

### Calendar Management

#### Query
```graphql
type Query {
  # Get calendar events for a specific date range
  getCalendarEvents(input: GetCalendarEventsInput!): CalendarEventsResponse
}
```

#### Mutation
```graphql
type Mutation {
  # Create a new calendar event
  createCalendarEvent(input: CreateCalendarEventInput!): CalendarEvent
  
  # Create a new route schedule
  createRouteSchedule(input: CreateRouteScheduleInput!): RouteSchedule
  
  # Share a calendar with another user
  shareCalendar(input: ShareCalendarInput!): CalendarShare
  
  # Update a calendar event
  updateCalendarEvent(input: UpdateCalendarEventInput!): CalendarEvent
  
  # Update a route schedule
  updateRouteSchedule(input: UpdateRouteScheduleInput!): RouteSchedule
  
  # Update calendar share
  updateCalendarShare(input: UpdateCalendarShareInput!): CalendarShare
  
  # Delete a calendar event
  deleteCalendarEvent(input: DeleteCalendarEventInput!): Boolean
  
  # Delete a route schedule
  deleteRouteSchedule(input: DeleteRouteScheduleInput!): Boolean
  
  # Delete calendar share
  deleteCalendarShare(input: DeleteCalendarShareInput!): Boolean
}
```

### Input Types

#### Route Related
```graphql
input SaveRouteInput {
  userEmail: String!
  name: String!
  description: String
  homeBase: String!
  customers: [String!]!
  timeSlots: AWSJSON
  optimizationParams: AWSJSON
  tags: [String]
  favorite: Boolean
}

input GetRouteHistoryInput {
  userEmail: String!
  startDate: String
  endDate: String
  location: String
  status: String
  tags: [String]
  limit: Int
  nextToken: String
}

input GetDailyRoutesInput {
  userEmail: String!
  location: String
  distance: Int
  activityType: String
  difficulty: String
  limit: Int
}
```

#### Calendar Related
```graphql
input GetCalendarEventsInput {
  userEmail: String!
  startDate: String!
  endDate: String!
}

input CreateCalendarEventInput {
  userEmail: String!
  calendarId: ID!
  title: String!
  description: String
  location: String
  startTime: String!
  endTime: String
  allDay: Boolean
  color: String
  isRecurring: Boolean
  recurrenceOptions: RecurrenceOptionsInput
}

input UpdateCalendarEventInput {
  id: ID!
  userEmail: String!
  title: String
  description: String
  location: String
  startTime: String
  endTime: String
  allDay: Boolean
  color: String
  isRecurring: Boolean
  recurrenceOptions: RecurrenceOptionsInput
  status: String
}

input DeleteCalendarEventInput {
  id: ID!
  userEmail: String!
}

input CreateRouteScheduleInput {
  userEmail: String!
  routeId: ID!
  title: String!
  date: String!
  startTime: String!
  endTime: String
  notes: String
  color: String
  isRecurring: Boolean
  recurrenceOptions: RecurrenceOptionsInput
}

input UpdateRouteScheduleInput {
  id: ID!
  userEmail: String!
  title: String
  date: String
  startTime: String
  endTime: String
  notes: String
  color: String
  isRecurring: Boolean
  recurrenceOptions: RecurrenceOptionsInput
  status: String
}

input DeleteRouteScheduleInput {
  id: ID!
  userEmail: String!
}

input ShareCalendarInput {
  calendarId: ID!
  ownerEmail: String!
  sharedWithEmail: String!
  permissions: String
}

input UpdateCalendarShareInput {
  id: ID!
  ownerEmail: String!
  permissions: String
  status: String
}

input DeleteCalendarShareInput {
  id: ID!
  ownerEmail: String!
}

input RecurrenceOptionsInput {
  frequency: String!
  interval: Int
  count: Int
  until: String
  byDay: [String]
  byMonthDay: [Int]
  byMonth: [Int]
}
```

## Authorization

Each model has specific authorization rules:

### Public Models
- `SubscriptionPlan`: Authenticated users can read, admins have full access

### Owner-Only Models
- `User`: Owner can read/update/delete, authenticated users can create initial record
- `UserCustomer`: Owner has full access
- `Route`: Owner has full access
- `RouteSchedule`: Owner has full access
- `Calendar`: Owner has full access
- `CalendarEvent`: Owner has full access
- `UserSubscription`: Owner has full access
- `MFASettings`: Owner has full access
- `SubUser`: Owner has full access
- `Vehicle`: Owner has full access

### Shared Models
- `CalendarShare`: Owner has full access, authenticated users can read
- `CalendarEvent`: Owner has full access, authenticated users can read

### Admin Access
All models allow admin group full access (create, read, update, delete)

## Error Handling

All API endpoints return standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error responses follow this format:
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {} // Optional additional information
  }
}
```

## Authentication

The API uses Amazon Cognito for authentication. All requests must include a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Rate Limiting

- Default rate limit: 1000 requests per minute per user
- Bulk operations: 100 requests per minute per user
- Route optimization: 50 requests per minute per user

## Development Guidelines

1. All dates should be in ISO 8601 format
2. All coordinates should be in decimal degrees
3. All distances are in meters
4. All durations are in seconds
5. All monetary values are in USD with 2 decimal places

## Monitoring

The service publishes the following CloudWatch metrics:
- Operation duration (ms)
- Request count
- Cache hit/miss ratio
- Error rates