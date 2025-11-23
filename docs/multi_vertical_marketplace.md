# Multi-Vertical Marketplace Architecture

This document outlines the data schema, backend API surface, frontend structure, and critical backend code scaffolding for a unified marketplace that supports products, real estate listings, tours/trips, and ticket bookings with multi-role users.

## 1) Database / Schema Layer

The following tables are expressed in SQL/Prisma-style definitions. Adjust column types to match your ORM/DB adapter.

### Core & Auth
- **users** (`id` uuid PK, `email` text unique, `encrypted_password` text, `name` text, `avatar_url` text, `phone` text, `default_currency` char(3) default `USD`, `language` text default `en`, `timezone` text default `UTC`, `email_verified_at` timestamptz, `created_at`, `updated_at`).
- **user_roles** (`id` serial PK, `user_id` fk users, `role` enum (`end_user`, `host`, `affiliate`, `admin`), unique (`user_id`, `role`)).
- **user_profiles** (`id` serial PK, `user_id` fk users unique, `bio` text, social links jsonb, preferences jsonb).
- **sessions** (for JWT refresh or server sessions; `id`, `user_id`, `refresh_token`, `expires_at`).

### Locations & Listings
- **locations** (`id` serial PK, `address` text, `city` text, `state` text, `country` text, `latitude` decimal(10,8), `longitude` decimal(11,8), `created_at`, `updated_at`).
- **listings** (`id` serial PK, `user_id` fk users, `listing_type` enum(`product`,`real_estate`,`tour`,`ticket`), `title` text, `slug` text unique, `description` text, `base_price` numeric(12,2), `currency` char(3), `status` enum(`draft`,`pending_review`,`active`,`paused`,`rejected`,`archived`) default `draft`, `location_id` fk locations nullable, `created_at`, `updated_at`).
- **listing_images** (`id` serial PK, `listing_id` fk listings, `image_url` text, `position` int, `created_at`).

### Product Marketplace
- **product_details** (`id` serial PK, `listing_id` fk listings unique, `stock_quantity` int, `sku` text, `weight` numeric, `dimensions` jsonb, `shipping_required` boolean default true).
- **carts** (`id` serial PK, `user_id` fk users, `created_at`, `updated_at`).
- **cart_items** (`id` serial PK, `cart_id` fk carts, `listing_id` fk listings, `quantity` int, unique(cart_id, listing_id)).
- **orders** (`id` serial PK, `buyer_id` fk users, `total_amount` numeric(12,2), `currency` char(3), `status` enum(`pending_payment`,`paid`,`shipped`,`completed`,`cancelled`,`refunded`) default `pending_payment`, `payment_id` fk payments nullable, `shipping_address_id` fk locations nullable, `placed_at` timestamptz, `created_at`, `updated_at`).
- **order_items** (`id` serial PK, `order_id` fk orders, `listing_id` fk listings, `quantity` int, `unit_price` numeric(12,2)).

### Real Estate
- **real_estate_details** (`id` serial PK, `listing_id` fk listings unique, `property_type` text, `listing_purpose` enum(`sale`,`rent`,`short_stay`), `bedrooms` int, `bathrooms` int, `area` numeric, `floor` int, `year_built` int, `available_from` date, `extra_features` jsonb).
- **property_leads** (`id` serial PK, `listing_id` fk listings, `user_id` fk users nullable, `guest_email` text nullable, `message` text, `status` enum(`new`,`in_progress`,`closed`) default `new`, `created_at`).

### Tours / Tickets
- **tour_details** (`id` serial PK, `listing_id` fk listings unique, `duration_type` enum(`hours`,`days`), `duration_value` int, `max_guests` int, `included_items` jsonb, `not_included` jsonb, `meeting_point` text, `city` text, `country` text, `cancellation_policy` text).
- **tour_schedules** (`id` serial PK, `tour_detail_id` fk tour_details, `start_datetime` timestamptz, `end_datetime` timestamptz, `capacity` int, `remaining_slots` int).
- **ticket_details** (`id` serial PK, `listing_id` fk listings unique, `event_date` date, `event_time` time, `venue_name` text, `venue_address` text, `seat_map_json` jsonb).
- **bookings** (`id` serial PK, `listing_id` fk listings, `buyer_id` fk users, `host_id` fk users, `schedule_id` int nullable, `quantity` int, `total_amount` numeric(12,2), `currency` char(3), `status` enum(`pending_payment`,`confirmed`,`cancelled`,`completed`,`refunded`) default `pending_payment`, `payment_id` fk payments nullable, `check_in_code` text, `created_at`, `updated_at`).

### Payments & Payouts
- **payments** (`id` serial PK, `user_id` fk users, `amount` numeric(12,2), `currency` char(3), `status` enum(`pending`,`succeeded`,`failed`,`refunded`), `provider` text, `provider_charge_id` text, `raw_response` jsonb, `created_at`).
- **payout_accounts** (`id` serial PK, `user_id` fk users, `provider_account_id` text, `payout_method` text, `created_at`).
- **payouts** (`id` serial PK, `user_id` fk users, `amount` numeric(12,2), `currency` char(3), `status` enum(`pending`,`in_process`,`paid`,`failed`), `provider_payout_id` text, `created_at`).

### Affiliates
- **affiliates** (`id` serial PK, `user_id` fk users unique, `referral_code` text unique, `tracking_id` text, `commission_rate_default` numeric(5,2)).
- **affiliate_clicks** (`id` serial PK, `affiliate_id` fk affiliates, `ip_address` inet, `user_agent` text, `clicked_at` timestamptz).
- **affiliate_conversions** (`id` serial PK, `affiliate_id` fk affiliates, `order_id` fk orders nullable, `booking_id` fk bookings nullable, `commission_amount` numeric(12,2), `currency` char(3), `status` enum(`pending`,`approved`,`paid`), `created_at`).

### Reviews & Messaging
- **reviews** (`id` serial PK, `reviewer_id` fk users, `listing_id` fk listings, `order_id` fk orders nullable, `booking_id` fk bookings nullable, `rating` int, `title` text, `comment` text, `status` enum(`pending`,`published`,`hidden`) default `pending`, `created_at`).
- **conversations** (`id` serial PK, `user1_id` fk users, `user2_id` fk users, `last_message_at` timestamptz).
- **messages** (`id` serial PK, `conversation_id` fk conversations, `sender_id` fk users, `body` text, `read_at` timestamptz, `created_at`).

### Notifications
- **notifications** (`id` serial PK, `user_id` fk users, `type` text, `data` jsonb, `read_at` timestamptz, `created_at`).

### Search
- Elasticsearch index `listings` mirrors listing data with fields: id, title, description, listing_type, price, currency, city, country, rating, status, created_at, updated_at.

## 2) Backend API

All endpoints are prefixed with `/api`. Authentication uses JWT bearer tokens; admin routes require admin role. Request/response samples are abbreviated.

### Auth & Users
- `POST /api/auth/signup` – create user. Body `{email, password, name}` → `{token, user}`
- `POST /api/auth/login` – obtain JWT. Body `{email, password}` → `{token, user}`
- `POST /api/auth/logout` – invalidate refresh token.
- `POST /api/auth/verify` – verify email token.
- `POST /api/auth/password/reset` – request reset `{email}`.
- `POST /api/auth/password/change` – change password `{token, newPassword}`.
- `GET /api/users/me` – current profile.
- `PATCH /api/users/me` – update profile `{name, avatarUrl, phone, defaultCurrency, language, timezone}`.
- `GET /api/users/:id/roles` – list roles.
- `POST /api/users/:id/roles` – add role `{role}` (admin).

### Listings Core
- `GET /api/listings` – search query params `q, type, city, minPrice, maxPrice, status` → array of listings.
- `POST /api/listings` – create `{listingType, title, description, basePrice, currency, location}`.
- `GET /api/listings/:id` – fetch detail including images and type-specific detail.
- `PATCH /api/listings/:id` – update listing.
- `DELETE /api/listings/:id` – archive/delete (soft delete recommended).
- `POST /api/listings/:id/images` – add image `{imageUrl, position}`.

### Product Marketplace
- `POST /api/products` – create product detail `{listingId, stockQuantity, sku, weight, dimensions, shippingRequired}`.
- `POST /api/cart/items` – add to cart `{listingId, quantity}` → cart summary.
- `PATCH /api/cart/items/:id` – update quantity.
- `DELETE /api/cart/items/:id` – remove item.
- `POST /api/orders` – create order from cart `{shippingAddressId, paymentMethod}` → `{order, clientSecret}`.
- `GET /api/orders` – buyer history.
- `GET /api/host/orders` – host view of orders containing their listings.

### Real Estate
- `POST /api/real-estate` – create detail `{listingId, propertyType, listingPurpose, bedrooms, bathrooms, area, floor, availableFrom, extraFeatures}`.
- `PATCH /api/real-estate/:id` – update detail.
- `GET /api/real-estate/search` – filters `city, minPrice, maxPrice, bedrooms, propertyType, listingPurpose`.
- `POST /api/real-estate/:listingId/leads` – create lead `{message, guestEmail}`.

### Tours / Tickets
- `POST /api/tours` – create tour detail `{listingId, durationType, durationValue, maxGuests, includedItems, meetingPoint, city, country}`.
- `POST /api/tours/:id/schedules` – add schedule `{startDatetime, endDatetime, capacity}`.
- `POST /api/tickets` – create ticket detail `{listingId, eventDate, eventTime, venueName, venueAddress, seatMapJson}`.
- `POST /api/bookings` – draft booking `{listingId, scheduleId, quantity}` → `{booking, paymentIntent}`.
- `PATCH /api/bookings/:id/cancel` – cancel booking (policy enforced server-side).
- `GET /api/bookings` – guest booking history.
- `GET /api/host/bookings` – host dashboard.

### Payments & Payouts
- `POST /api/payments/intent` – Stripe payment intent `{amount, currency, listingId | orderId | bookingId}`.
- `POST /api/payments/webhook` – Stripe webhook handler.
- `GET /api/payouts` – host/affiliate payout list.
- `POST /api/payouts` – request payout `{amount, currency}`.

### Affiliates
- `POST /api/affiliates` – create affiliate profile `{commissionRateDefault}`.
- `GET /api/affiliates/me` – dashboard summary.
- `GET /api/affiliates/:code/click` – record click via redirect.
- `GET /api/affiliates/conversions` – list conversions with status.

### Reviews
- `POST /api/reviews` – create review `{listingId, orderId?, bookingId?, rating, title, comment}`.
- `GET /api/listings/:id/reviews` – list reviews and average rating.

### Messaging
- `POST /api/conversations` – start contact with host `{user2Id, listingId?}`.
- `GET /api/conversations` – list inbox.
- `POST /api/conversations/:id/messages` – send message `{body}`.

### Notifications
- `GET /api/notifications` – list notifications.
- `PATCH /api/notifications/:id/read` – mark read.

## 3) Frontend Structure

High-level routes/pages (Next.js pages/React Router paths):
- `/` Home & discovery feed
- `/search` universal search with filters
- `/listings/:slug` Listing detail (type-aware)
- `/products/:slug` Product detail + Add to cart
- `/real-estate/:slug` Real estate detail + inquiry form + map
- `/tours/:slug` Tour detail + schedule selector
- `/tickets/:slug` Ticket detail + date/time selector
- `/cart` Cart page
- `/checkout` Checkout/Payment
- `/orders` Buyer order history
- `/bookings` Guest booking history
- `/host/dashboard` Host overview (orders, bookings, listings)
- `/affiliate/dashboard` Affiliate stats
- `/admin` Admin overview
- `/auth/login`, `/auth/signup`, `/auth/verify`, `/auth/reset`

Key components:
- **ListingCard**: shows title, price, badge by `listing_type`, rating, city; supports CTA for add-to-cart/book/inquire.
- **FiltersSidebar**: shared filter controls (price range, type tabs, city picker, date range for tours/tickets, bedrooms filter for real estate).
- **ListingDetail**: renders hero images, description, host info, tabs for reviews/policies, dynamic child components by type (ProductDetail, RealEstateInfo, TourScheduleList, TicketInfo).
- **CartPage**: table of items, quantity controls, totals, shipping estimator, checkout button.
- **BookingWidget**: date/time picker, guest/ticket quantity selector, availability check, price breakdown.
- **HostDashboard**: cards for revenue/orders/bookings, table of listings with status, latest leads/messages.
- **AffiliateDashboard**: metrics for clicks, conversions, commissions; referral link generator and payout status list.

## 4) Critical Backend Code (Express + TypeScript scaffolding)

The following code lives in `server/marketplace-modules.ts` and shows pragmatic Express handlers with simple in-memory stores. Replace stores with Prisma/DB implementations in production.

- User + Role models
- Listing + ListingImage
- ProductDetail, Order, OrderItem
- Booking model (tours/tickets)
- Affiliate models
- Auth controller (login/signup)
- Listings controller CRUD
- Orders controller (create from cart)
- Bookings controller (create booking)

All handlers assume `req.user` is populated by upstream auth middleware (stubbed here).

