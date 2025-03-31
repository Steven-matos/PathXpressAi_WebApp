# PathXpress AI - Delivery Route Optimization Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-latest-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-latest-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)
[![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-6.13.5-FF9900?logo=aws)](https://aws.amazon.com/amplify/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.5.1-764ABC?logo=redux)](https://redux-toolkit.js.org/)

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the App](#-running-the-app)
- [Project Structure](#-project-structure)
- [Custom Hooks](#-custom-hooks)
- [Contributing](#-contributing)
- [License](#-license)

## 🌐 Project Overview

PathXpress AI is an intelligent delivery route optimization platform that leverages machine learning and real-time data analysis to:

- Automatically generate optimal delivery routes
- Adapt to traffic patterns and weather conditions
- Provide dynamic ETAs and route adjustments
- [Backend System](https://github.com/Steven-matos/PathXpressAi_Backend)

## 🚀 Key Features

- **AI-Powered Route Optimization**
- Multi-Stop Route Planning
- Real-Time Traffic Adaptation
- Multi-Language Support (EN/ES)
- Responsive UI with Dark Mode
- JWT Authentication
- Privacy-First Data Handling
- User Onboarding Flow
- Custom Hook System
- Redux State Management
- AWS Amplify Integration

## 💻 Tech Stack

### Frontend

| Technology      | Version | Purpose          |
| --------------- | ------- | ---------------- |
| Next.js         | 15.2.4  | App Router & SSR |
| TypeScript      | 5.3.3   | Type Safety      |
| Tailwind CSS    | 3.4.1   | Styling          |
| Radix UI        | 1.0.4   | Primitives       |
| React Hook Form | 7.50.1  | Form Management  |
| AWS Amplify     | 6.0.17  | Backend Services |
| Redux Toolkit   | 2.1.0   | State Management |
| Shadcn UI       | 0.8.0   | UI Components    |
| Zod            | 3.22.4  | Schema Validation|

### Backend

See [Backend Repository](https://github.com/Steven-matos/PathXpressAi_Backend) for details:

- AWS (Lambda, CloudFormation, S3, IAM, DynamoDB)
- AWS Amplify
- GraphQL API
- Cognito Authentication

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/Steven-matos/PathXpressAi_Frontend.git
cd PathXpressAi_Frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

## ⚙️ Configuration

Update `.env.local` with your credentials:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.pathxpress.ai/v1
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# AWS Amplify Configuration
NEXT_PUBLIC_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your_user_pool_client_id
NEXT_PUBLIC_GRAPHQL_ENDPOINT=your_graphql_endpoint
NEXT_PUBLIC_REGION=your_aws_region

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CRASH_REPORTING=false

# Optional: Development Tools
NEXT_PUBLIC_ENABLE_DEV_TOOLS=false
```

Key configuration files:
- `src/context/TranslationContext.tsx` - Language management
- `tailwind.config.js` - Theme customization
- `src/app/api/` - API route handlers
- `amplify.yml` - AWS Amplify configuration
- `src/lib/amplifyConfig.ts` - Amplify client configuration

## ▶️ Running the App

```bash
# Development
npm run dev

# Production build
npm run build && npm run start

# Linting
npm run lint

# Testing
npm test
npm test:coverage
```

## 📁 Project Structure

```
src/
├── app/                 # App router pages and layouts
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn)
│   └── forms/          # Form-related components
├── context/            # React Context providers
├── features/           # Feature-specific components
│   ├── auth/          # Authentication components
│   ├── onboarding/    # Onboarding flow components
│   └── routes/        # Route management components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helpers
│   ├── amplify/       # AWS Amplify configuration
│   ├── auth/          # Authentication utilities
│   └── api/           # API utilities
├── public/             # Static assets
├── store/              # Redux store and slices
├── styles/             # Global CSS and Tailwind config
└── types/              # TypeScript type definitions
```

Each directory serves a specific purpose:
- `app/`: Contains all Next.js pages and layouts using the App Router
- `components/`: Houses reusable UI components, organized by category
- `context/`: Contains React Context providers for global state
- `features/`: Contains feature-specific components and logic
- `hooks/`: Custom React hooks for shared functionality
- `lib/`: Utility functions and configurations
- `store/`: Redux store configuration and slices
- `types/`: TypeScript type definitions and interfaces

## 🎣 Custom Hooks

The application includes several custom hooks for common functionality:

### useApiData
- Fetches and manages API data using Redux
- Handles loading states and error handling
- Supports automatic refresh and caching

### useOnboarding
- Manages the user onboarding flow
- Handles step progression and data collection
- Integrates with AWS Amplify for user creation

### useAuth
- Manages authentication state and operations
- Handles sign-in, sign-up, and password reset
- Integrates with AWS Cognito

### useTranslation
- Manages translations and language preferences
- Supports dynamic language switching
- Handles translation loading states

See [Custom Hooks Documentation](src/hooks/README.md) for detailed usage.

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Branch Naming: `feature/[short-description]` or `fix/[issue-number]`
2. Commit Messages: Use [Conventional Commits](https://www.conventionalcommits.org/)
3. PR Process:
   - Reference related issues
   - Include screenshots for UI changes
   - Update documentation

```bash
# Create new feature branch
git checkout -b feature/your-feature

# After making changes
npm run lint

# Commit with message
git commit -m "feat: add new route optimization view"
```

## 🧑💻 Developer Guide

### Key Implementation Details

1. **React Server Components (RSC)**
   - Used for data fetching and static pages
   - Example: `src/app/page.tsx`

2. **State Management**
   - Context API for language management
   - Redux for complex state
   - URL Search Params for filter state

3. **UI Components**
   - Built with Shadcn UI and Radix primitives
   - Custom theme in `tailwind.config.js`
   - Responsive breakpoints using mobile-first approach

4. **Authentication Flow**
   - AWS Cognito integration
   - JWT token management
   - Protected routes and API calls

5. **Onboarding Process**
   - Multi-step form with validation
   - AWS Amplify integration
   - Progress persistence

### API Integration

```typescript
// Example API call using AWS Amplify
import { generateClient } from 'aws-amplify/api';

async function fetchOptimalRoute(waypoints: LatLng[]) {
  const client = generateClient();
  
  const response = await client.graphql({
    query: /* GraphQL query */,
    variables: { waypoints }
  });

  return response.data;
}
```

### Testing

```bash
# Run unit tests
npm test

# Run coverage
npm test:coverage

# Run E2E tests
npm run test:e2e
```

## 📄 License

© 2024 PathXpress AI. All rights reserved.
