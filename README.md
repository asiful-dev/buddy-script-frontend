# Buddy Script Frontend

## Project Summary

Buddy Script is a modern social media platform built with Next.js and React. The application provides users with a comprehensive social networking experience including user authentication, a personalized feed, post creation and management, interactive comments, multi-reaction system, user profiles, stories, events, and suggested connections. The platform features a responsive design with support for both light and dark themes, ensuring an optimal user experience across all devices.

## Technologies Used

### Core Framework
- Next.js 16.0.3 (React Framework with App Router)
- React 19.2.0
- TypeScript 5.x

### State Management
- Redux Toolkit 2.11.0
- React Redux 9.2.0

### UI Components & Styling
- Tailwind CSS 4.x
- Radix UI (Avatar, Dialog, Dropdown Menu, Label, Slot)
- Lucide React (Icon Library)
- next-themes (Theme Management)

### Form Handling & Validation
- React Hook Form 7.66.1
- Zod 4.1.13
- Hookform Resolvers 5.2.2

### HTTP Client
- Axios 1.13.2

### Utilities
- clsx 2.1.1
- tailwind-merge 3.4.0
- class-variance-authority 0.7.1

### Development Tools
- ESLint 9.x
- TypeScript
- PostCSS

## Features

- User Authentication (Login, Registration)
- Protected Routes with Middleware
- User Profile Management with Avatar Upload
- Social Feed with Infinite Scroll
- Post Creation (Text, Images, Visibility Settings)
- Post Editing and Deletion
- Multi-Reaction System (Like, Love, Haha, Care, Angry)
- Comments and Nested Replies
- Stories Section
- Events Display
- Suggested People and Friends
- Dark/Light Theme Toggle
- Responsive Design

## Folder Architecture

The project follows a feature-based architecture pattern with clear separation of concerns:

```
frontend/
├── app/                          # Next.js App Router pages and layouts
│   ├── auth/                     # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── feed/                     # Main feed route
│   │   ├── components/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── profile/                  # User profile route
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── providers.tsx             # App-level providers
│
├── features/                     # Feature-based modules
│   ├── auth/                     # Authentication feature
│   │   ├── components/           # Auth-related UI components
│   │   ├── services/             # API services and hooks
│   │   ├── slices/               # Redux slices
│   │   ├── types/                # TypeScript type definitions
│   │   └── validations/          # Zod schemas
│   └── feed/                     # Feed feature
│       ├── components/           # Feed-related UI components
│       ├── services/             # API services
│       ├── slices/               # Redux slices
│       └── types/                # TypeScript type definitions
│
├── shared/                       # Shared utilities and components
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Base UI components (shadcn/ui)
│   │   └── ToastProvider.tsx
│   ├── hooks/                    # Custom React hooks
│   ├── libs/                     # Library configurations
│   │   ├── axios.config.ts       # Axios instance and interceptors
│   │   ├── redux.config.ts       # Redux store configuration
│   │   └── theme.config.ts
│   ├── types/                    # Shared TypeScript types
│   └── utils/                    # Utility functions
│
├── providers/                    # Context providers
│   └── redux.provider.tsx
│
├── public/                       # Static assets
│   └── assests/                  # Images and media files
│
├── middleware.ts                 # Next.js middleware for route protection
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## Nomenclature

### File Naming Conventions

1. **Components**: PascalCase with descriptive names
   - Example: `LoginView.tsx`, `PostItem.tsx`, `FeedHeader.tsx`

2. **Pages**: Lowercase `page.tsx` within route folders
   - Example: `app/feed/page.tsx`, `app/profile/page.tsx`

3. **Layouts**: Lowercase `layout.tsx` within route folders
   - Example: `app/layout.tsx`, `app/feed/layout.tsx`

4. **Services/API**: camelCase with `.api.ts` or `.ts`
   - Example: `api.ts`, `me-loader.ts`

5. **Redux Slices**: camelCase with `.slice.ts`
   - Example: `auth.slice.ts`, `feed.slice.ts`

6. **Types**: camelCase with `.definitions.ts` or `.types.ts`
   - Example: `auth.definitions.ts`, `feed.definitions.ts`

7. **Validations**: camelCase with `.schema.ts`
   - Example: `auth.schema.ts`

8. **Configuration Files**: camelCase with `.config.ts`
   - Example: `axios.config.ts`, `redux.config.ts`

9. **Utilities**: camelCase with `.helper.ts` or `.utils.ts`
   - Example: `axios.helper.ts`, `shadcn.utils.ts`

10. **Hooks**: camelCase with `use` prefix
    - Example: `useInitUser`, `useAppDispatch`

### Component Structure

Each feature module follows this structure:
- `components/` - UI components specific to the feature
- `services/` - API calls and data fetching logic
- `slices/` - Redux state management
- `types/` - TypeScript interfaces and types
- `validations/` - Form validation schemas (if applicable)

## Scripts

### Development

```bash
npm run dev
```
Starts the development server on `http://localhost:3000` with hot module replacement.

### Production Build

```bash
npm run build
```
Creates an optimized production build of the application.

### Production Start

```bash
npm start
```
Starts the production server (requires `npm run build` to be run first).

### Linting

```bash
npm run lint
```
Runs ESLint to check code quality and catch potential errors.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Backend API server running (default: `http://localhost:5000/api`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables file:
Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Note: Replace the URL with your backend API endpoint if different.

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. The application will automatically:
   - Show the login page if not authenticated
   - Redirect to the feed page if already authenticated

### Building for Production

1. Create a production build:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The production server will run on `http://localhost:3000` by default.

## Environment Variables

The following environment variables can be configured:

- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: `http://localhost:5000/api`)

Create a `.env.local` file in the root directory to set these values. The `.env.local` file is gitignored and will not be committed to version control.

## Project Configuration

### TypeScript Path Aliases

The project uses TypeScript path aliases for cleaner imports:
- `@/*` maps to the root directory

Example:
```typescript
import { authApi } from "@/features/auth/services/api";
import { Button } from "@/shared/components/ui/button";
```

### Image Configuration

The Next.js image configuration allows images from:
- `localhost`
- `res.cloudinary.com` (for Cloudinary-hosted images)

Update `next.config.ts` to add additional image domains if needed.

## Additional Notes

### Authentication Flow

1. User logs in or registers through the authentication pages
2. Access token is stored in `localStorage` and synced to cookies
3. Middleware protects routes based on authentication status
4. Redux store manages user state across the application
5. `useInitUser` hook initializes user data on app load

### State Management

The application uses Redux Toolkit for global state management:
- `auth` slice: Manages authentication state and user data
- `feed` slice: Manages posts, comments, and reactions

### Theme Support

The application supports both light and dark themes using `next-themes`. Users can toggle between themes using the theme toggle component in the feed header.

## License

This project is private and proprietary.

