# MarketplacePro feature guide

This guide highlights the flagship capabilities of MarketplacePro and points to the key modules that implement them.

## 1. Commerce foundation
- **Product discovery and filters** – Buyers can search, filter, and browse the catalog with guided tooltips and a persistent shopping cart overlay. See `client/src/pages/Products.tsx` for the page shell, filter sidebar, and cart modal integration. 【F:client/src/pages/Products.tsx†L1-L82】
- **Catalog management APIs** – Express routes provide CRUD operations, validation, and image handling for products and categories. Review `server/routes.ts` under the product and category sections. 【F:server/routes.ts†L129-L220】【F:server/routes.ts†L237-L344】
- **Cart and wishlist flows** – Session-aware routes back cart and wishlist pages by fetching product details for each item. The logic lives in the cart endpoints within `server/routes.ts`. 【F:server/routes.ts†L344-L420】

## 2. Seller analytics and inventory
- **Analytics dashboards** – Multi-tab UI with KPI cards, charts, exports, and VND formatting is defined in `client/src/pages/SellerAnalytics.tsx`. 【F:client/src/pages/SellerAnalytics.tsx†L1-L120】
- **Seller API surface** – Dedicated routes guard analytics, product performance, orders, and inventory with role checks. Inspect the seller section in `server/routes.ts`. 【F:server/routes.ts†L2260-L2324】
- **Inventory data access layer** – Prisma storage exposes inventory alerts, stock movements, and performance helpers. Interfaces are defined in `server/storage-prisma.ts`. 【F:server/storage-prisma.ts†L1-L120】

## 3. Admin operations
- **Unified admin workspace** – The admin panel aggregates dashboards, CRUD dialogs, bulk actions, and role controls; implemented in `client/src/pages/AdminPanel.tsx`. 【F:client/src/pages/AdminPanel.tsx†L1-L120】
- **System health checks** – `/api/admin/health` reports DB and runtime stats for admins. Route registration appears in `server/routes.ts`. 【F:server/routes.ts†L2260-L2294】

## 4. Personalization and recommendations
- **Preference management** – Users edit categories, travel styles, and budgets through the recommendation dashboard’s preference form state. See `client/src/pages/RecommendationsDashboard.tsx`. 【F:client/src/pages/RecommendationsDashboard.tsx†L1-L120】
- **Hybrid ML hooks** – The dashboard orchestrates collaborative, hybrid, seasonal, contextual, and real-time recommendation hooks from `@/hooks/useRecommendations`. 【F:client/src/pages/RecommendationsDashboard.tsx†L17-L120】
- **Storage contracts** – Prisma storage defines types and methods for `UserPreferences`, `UserInteraction`, `Recommendation`, and `SimilarItem` entities. Check `server/storage-prisma.ts`. 【F:server/storage-prisma.ts†L1-L80】

## 5. Travel and hospitality
- **Travel booking hub** – Tabs for flights, transport, tours, and booking history live in `client/src/pages/TravelBooking.tsx`. 【F:client/src/pages/TravelBooking.tsx†L1-L120】
- **Property marketplace** – Destination filters, amenity toggles, map mode, and pricing utilities are implemented in `client/src/pages/Properties.tsx`. 【F:client/src/pages/Properties.tsx†L1-L120】
- **Schema support** – Prisma models for properties, bookings, reviews, availability, and itineraries power the travel workflows. Explore `prisma/schema.prisma`. 【F:prisma/schema.prisma†L19-L160】

## 6. Support and communication
- **Live chat** – A WebSocket server handles authentication, message broadcasting, read receipts, and connection lifecycle in `server/routes.ts`. 【F:server/routes.ts†L2330-L2420】
- **Chat storage** – Storage contracts manage chat rooms, messages, attachments, and support metrics. Refer to `server/storage-prisma.ts`. 【F:server/storage-prisma.ts†L80-L160】

## 7. Shared infrastructure
- **Session-based auth** – Express sessions backed by PostgreSQL are configured at the top of `server/routes.ts`. 【F:server/routes.ts†L57-L122】
- **Type sharing** – Frontend and backend consume unified Prisma types exported from `shared/schema.ts`. 【F:shared/schema.ts†L1-L40】
- **Prisma schema** – `prisma/schema.prisma` outlines marketplace, travel, chat, and recommendation entities. 【F:prisma/schema.prisma†L1-L160】
