# E-commerce Marketplace Application

## Overview

This is a full-stack e-commerce marketplace application built with React, Express.js, and PostgreSQL. The application supports both buyers and sellers, featuring product browsing, shopping cart functionality, user authentication via Replit Auth, and a seller dashboard for product management.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

### Authentication System Overhaul
- **Traditional Email/Password Authentication**: Replaced Replit Auth with comprehensive email/password system
- **Social Login Integration**: Added Google and Facebook authentication options
- **Professional Auth Pages**: Created dedicated Login, Register, and ForgotPassword pages with modern UI
- **Form Validation**: Implemented robust client-side validation with Zod schemas
- **Password Security**: Added password strength requirements and visibility toggles
- **Terms & Privacy**: Integrated terms of service and privacy policy acceptance
- **Security Features**: Highlighted enterprise-grade encryption and GDPR compliance
- **Responsive Design**: Mobile-optimized authentication flow with consistent branding

### Multi-Language Support & Theming
- **Vietnamese as Default Language**: Implemented Vietnamese as the primary language with comprehensive translations
- **Multi-Language Support**: Added English, Korean, Russian, and Arabic language options
- **Dark Mode**: Complete dark/light theme system with CSS custom properties
- **Color Customization**: Theme selector with 6 preset color schemes (blue, purple, green, orange, red, pink)
- **Language Selector**: Dropdown with flag icons for easy language switching
- **Theme Persistence**: Both language and theme preferences stored in localStorage

### Comprehensive Test Data
- **Expanded Categories**: Added 13 product categories including Electronics, Fashion, Home & Garden, Sports, Automotive, Toys & Games, Pet Supplies, Food & Beverages, Books, Health & Beauty, Vietnamese Specialties, Office & Business, and Art & Crafts
- **Diverse Product Catalog**: 43 products ranging from $12.99 to $3,499.99 with realistic descriptions and stock levels
- **Multi-Language Reviews**: 17 product reviews in Vietnamese, English, Korean, and Russian
- **High-Quality Images**: All products feature professional images from Unsplash
- **Realistic Pricing**: Products span various price points to showcase marketplace diversity
- **Vietnamese Cultural Products**: Authentic Vietnamese items including Áo Dài, Pho Bo noodles, bamboo lacquerware, and Phu Quoc fish sauce
- **Trending Technology**: Latest tech products including Apple Vision Pro, Tesla accessories, and premium electronics

### eBay-Style Product Detail Pages
- **Comprehensive Product View**: Detailed product pages with image galleries, seller information, and tabbed content
- **Review System**: User reviews with ratings, comment functionality, and review statistics
- **Enhanced Navigation**: Smooth product browsing with proper routing and back navigation
- **Mobile Responsive**: Optimized for both desktop and mobile viewing experiences

### Contextual Help System
- **Help Tooltips**: Interactive tooltips with detailed guidance for product management, pricing, and descriptions
- **Dynamic User Guidance**: Step-by-step guidance flows for new sellers and buyers
- **Progress Tracking**: Visual progress indicators and completion tracking for onboarding workflows
- **Context-Aware Help**: Relevant help content based on user's current location in the application

### Technical Improvements
- **Fixed API Query Issues**: Resolved "[object Object]" parameter passing in query client
- **Enhanced URL Construction**: Improved query key handling for proper API communication
- **Database Seeding**: Automated seed script for consistent test data generation
- **RTL Support**: Complete right-to-left language support for Arabic
- **Product Detail Error Handling**: Fixed array handling issues in product reviews display
- **Routing Updates**: Fixed product detail routing from /products/:id to /product/:id

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