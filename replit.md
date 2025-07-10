# E-commerce Marketplace Application

## Overview

This is a full-stack e-commerce marketplace application built with React, Express.js, and PostgreSQL. The application supports both buyers and sellers, featuring product browsing, shopping cart functionality, user authentication via Replit Auth, and a seller dashboard for product management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand for global state (cart, wishlist, UI state)
- **Routing**: Wouter for client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: Custom i18n implementation with Zustand persistence

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM with Zod schema validation
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **Build System**: Vite for development, ESBuild for production

### Database Design
- **Users**: Authentication and profile data
- **Products**: Marketplace items with categories, pricing, and inventory
- **Categories**: Hierarchical product categorization
- **Cart/Wishlist**: User shopping preferences
- **Orders**: Purchase history and order management
- **Reviews**: Product feedback system
- **Sessions**: Authentication session storage

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions
- **User Management**: Automatic user creation/update on login
- **Authorization**: Route-level protection for authenticated features

### Product Management
- **Catalog**: Browsable product grid with filtering and search
- **Categories**: Hierarchical organization system
- **Inventory**: Stock tracking and management
- **Reviews**: User feedback and rating system
- **Seller Dashboard**: Product CRUD operations for sellers

### Shopping Experience
- **Cart**: Persistent shopping cart with quantity management
- **Wishlist**: Save products for later
- **Search**: Full-text search across products
- **Filters**: Category, price range, rating filters
- **Checkout**: Multi-step purchase process

### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Radix UI primitives with custom styling
- **Internationalization**: Multi-language support
- **Loading States**: Skeleton loaders and optimistic updates
- **Error Handling**: User-friendly error messages

## Data Flow

### Authentication Flow
1. User clicks login → Redirects to Replit Auth
2. OAuth callback → Creates/updates user in database
3. Session created → User redirected to protected routes
4. Subsequent requests → Session validated via middleware

### Product Discovery Flow
1. User browses products → API fetches paginated results
2. Filters applied → Query parameters updated
3. Search performed → Full-text search executed
4. Product selected → Modal opens with details

### Shopping Cart Flow
1. Add to cart → Optimistic update + API call
2. Cart state synced → Database and local state updated
3. Checkout initiated → Multi-step form validation
4. Order placed → Inventory updated, order created

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Headless UI components
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **tailwindcss**: CSS framework

### Authentication
- **openid-client**: OpenID Connect client
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Development server and build tool
- **typescript**: Type checking
- **eslint**: Code linting
- **tsx**: TypeScript execution

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle generates and runs migrations
4. **Assets**: Static files served from build directory

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **SESSION_SECRET**: Session encryption key
- **REPL_ID**: Replit application identifier
- **ISSUER_URL**: OpenID Connect issuer endpoint

### Production Considerations
- **Session Security**: HTTPS-only cookies with secure flags
- **Database Scaling**: Neon serverless auto-scaling
- **Error Handling**: Comprehensive error boundaries
- **Performance**: Query optimization and caching strategies

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and a focus on user experience. The choice of technologies prioritizes developer experience while maintaining production-ready scalability and security.