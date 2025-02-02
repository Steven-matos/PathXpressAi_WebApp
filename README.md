# PathXpress AI - Delivery Route Optimization Platform

[![Next.js](https://img.shields.io/badge/Next.js-13.5.4-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the App](#-running-the-app)
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

## 💻 Tech Stack

### Frontend

| Technology      | Version | Purpose          |
| --------------- | ------- | ---------------- |
| Next.js         | 13.5    | App Router & SSR |
| TypeScript      | 5.2     | Type Safety      |
| Tailwind CSS    | 3.3     | Styling          |
| Radix UI        | 1.3     | Primitives       |
| React Hook Form | 7.4     | Form Management  |

### Backend

See [Backend Repository](https://github.com/Steven-matos/PathXpressAi_Backend) for details:

- AWS (Lambda, CloudFormation, S3, IAM, DynamoDB)

## 📦 Installation

```bash
Clone repository
git clone https://github.com/Steven-matos/PathXpressAi_Frontend.git
cd PathXpressAi_Frontend
```

## Install Dependencies

```bash
npm install
```

Configure environment

```bash
cp .env.example .env.local
```

## Running the App

```bash
npm run dev
```

## ⚙️ Configuration

Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_API_URL=https://api.pathxpress.ai/v1
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

Key configuration files:

- `src/context/TranslationContext.tsx` - Language management
- `tailwind.config.js` - Theme customization
- `src/app/api/` - API route handlers

## ▶️ Running the App

```bash
# Development
npm run dev

# Production build
npm run build && npm run start

# Linting
npm run lint

```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Branch Naming: `feature/[short-description]` or `fix/[issue-number]`
2. Commit Messages: Use [Conventional Commits](https://www.conventionalcommits.org/) 3. PR Process:
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

### Project Structure

```
src/
├── app/                 # App router pages
├── components/          # Reusable components
├── context/             # Global state management
├── lib/                 # Utilities and helpers
├── public/              # Static assets
├── styles/              # Global CSS
└── types/               # TypeScript definitions
```

### Key Implementation Details

1. **React Server Components (RSC)**

   - Used for data fetching and static pages
   - Example: `src/app/page.tsx`

2. **State Management**

   - Context API for language management
   - URL Search Params for filter state
   - Redux for complex state (see Redux provider)

3. **UI Components**
   - Built with Shadcn UI and Radix primitives
   - Custom theme in `tailwind.config.js`
   - Responsive breakpoints using mobile-first approach

### API Integration

```typescript
// Example API call
async function fetchOptimalRoute(waypoints: LatLng[]) {
  const response = await fetch("/api/optimize-route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ waypoints }),
  });

  return await response.json();
}
```

### Testing

if creating new tests, run the following command to update the coverage report:

```bash
# Run unit tests
npm test

# Run coverage
npm test:coverage
```

© 2024 PathXpress AI. All rights reserved.
