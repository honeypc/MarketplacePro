# MarketplacePro Feature Coverage and Gap Report

## Coverage Summary

### A. Auth & Users
- **Signup/login/logout**: Implemented via session-based auth with password hashing and Express routes. Email verification and secure reset flows are not implemented. 【F:server/auth.ts†L22-L120】
- **Roles & permissions**: Single `role` string; no multi-role or granular permissions. 【F:prisma/schema.prisma†L20-L63】
- **Profile**: Basic profile CRUD; no preferences for currency/language/timezone. 【F:server/routes.ts†L990-L1031】

### B. Listings Core
- **Listing entity with types**: Missing unified listing model; only `Product` and `Property` exist. 【F:prisma/schema.prisma†L35-L118】【F:prisma/schema.prisma†L120-L210】
- **Images**: Products/properties store string array images, but no ordering. 【F:prisma/schema.prisma†L53-L70】【F:prisma/schema.prisma†L157-L190】
- **Location**: Property has address fields; no generic location component or coordinates for all listings. 【F:prisma/schema.prisma†L157-L190】
- **Lifecycle statuses**: Product uses `isActive` bool; Property uses `isActive`; no review/approval workflow. 【F:prisma/schema.prisma†L53-L70】【F:prisma/schema.prisma†L157-L190】

### C. Product Marketplace
- **Product details**: Implemented (stock, category, price) but missing SKU, weight/dimensions, shipping_required. 【F:prisma/schema.prisma†L35-L118】
- **Cart & checkout**: Implemented (cart items CRUD) with session user. 【F:server/routes.ts†L335-L425】
- **Orders**: Implemented basic order & items creation; statuses limited to `pending`, payment link is shallow. 【F:prisma/schema.prisma†L85-L133】【F:server/routes.ts†L424-L500】
- **Host visibility**: Seller analytics endpoints exist but no host-specific order filtering. 【F:server/routes.ts†L501-L760】

### D. Real Estate Module
- **RealEstateDetail**: Property model covers core fields but lacks `listing_purpose`, `available_from`, `extra_features`. 【F:prisma/schema.prisma†L157-L210】
- **Leads**: Missing PropertyLead model and endpoints.
- **Filters & contact**: Property listing endpoints missing; no lead creation endpoint. 【F:server/routes.ts†L1-L200】【F:client/src/pages/Properties.tsx†L1-L120】

### E. Tours / Trips / Tickets (Booking Engine)
- **Tour/Ticket details & schedule**: Missing models and routes; only lodging `Booking` for properties. 【F:prisma/schema.prisma†L191-L250】
- **Booking flow**: Property bookings exist but no schedule capacity checks or statuses beyond `pending`. 【F:prisma/schema.prisma†L191-L250】

### F. Payments & Payouts
- **Payments**: Payment model exists tied to bookings only; no order linkage or provider metadata. 【F:prisma/schema.prisma†L251-L285】
- **Payouts**: No payout models or routes.

### G. Affiliate System
- **Affiliate models & tracking**: Missing entirely.

### H. Reviews & Ratings
- **Product reviews**: Implemented with endpoints; lacks enforcement of purchase requirement. 【F:prisma/schema.prisma†L71-L84】【F:server/routes.ts†L365-L423】
- **Property reviews**: Implemented but simple; linked to booking. 【F:prisma/schema.prisma†L191-L250】

### I. Messaging / Chat
- **Conversation & Message**: ChatRoom/ChatMessage models and routes for support-like chat; not listing-based. 【F:prisma/schema.prisma†L134-L156】【F:server/routes.ts†L200-L334】

### J. Notifications & Emails
- **Notifications**: Missing model and delivery stubs.

### K. Search & Filters
- **Listings search**: Products endpoint supports search & price filter; no full-text index or multi-vertical filters. 【F:server/routes.ts†L69-L145】

### L. Admin Panel (Backend)
- **Management endpoints**: No admin-specific routes beyond seller analytics; role is single `user`. 【F:server/routes.ts†L501-L869】

---

## Gap Report & Required Additions

### High Priority Gaps
1. **Unified Listing + Lifecycle**
   - Add `Listing` model (id, ownerId, listingType, title, description, basePrice, currency, status, location fields, publishedAt) with status enum covering draft/pending_review/active/paused/rejected/archived.
   - Introduce `ListingImage` with ordering, and `ListingLocation` reusable component; link Product/Property to Listing via `listingId` for polymorphic behavior.
   - Create Express routes for listing CRUD, status transitions, and ownership/role checks.

2. **Roles & Permissions**
   - Migrate `User.role` to `User.roles` (string[]), seed roles (end_user, host, affiliate, admin). Update auth middleware to allow multi-role checks.
   - Add `UserPreferences` extension for currency/language/timezone.

3. **Orders/Payments Integration**
   - Extend Payment with `orderId`, provider fields (provider, providerChargeId, rawResponse json, status enum) and webhook handler route. Connect order status transitions (pending_payment → paid → shipped → completed/cancelled/refunded).
   - Add seller-facing order queries filtered by seller products.

4. **Real Estate Leads**
   - Create `PropertyLead` model (id, listingId/propertyId, userId?, guestEmail, message, status) and `/api/properties/:id/contact` endpoint creating leads.

5. **Tour/Ticket Module & Booking Engine**
   - Add models: `TourDetail`, `TourSchedule`, `TicketDetail`, `Booking` extension (listingId, scheduleId, quantity, totalAmount, currency, status enum, paymentId). Implement availability check endpoint and booking flow with status updates after payment.

6. **Payouts & Affiliates**
   - Add `PayoutAccount`, `Payout`, `Affiliate`, `AffiliateClick`, `AffiliateConversion` models plus minimal service hooks to record ref codes and conversions.

7. **Notifications**
   - Add `Notification` model with json data and simple fetch/mark-read endpoints; stub email service functions.

### DB/Schema Changes (Prisma)
- Add the new models and relations mentioned above; use `@map` table naming consistent with existing schema.
- Update `User` to support roles array, profile preferences (currency/language/timezone), and optional avatar/phone fields.
- Introduce enums for statuses (listingStatus, orderStatus, bookingStatus, paymentStatus).

### API/Route Changes
- New routers under `server/routes` or modularized files for listings, leads, tours, affiliates, payouts, notifications.
- Update auth middleware to handle multi-role arrays and add `requireAnyRole([...])` helper.
- Extend existing order routes with status transitions and payment linkage.

---

## Code Generation (stubs aligned to current stack)

> Assumptions are noted as comments. Prisma enums/fields follow existing naming with `@map` hints.

### Prisma Schema Additions (append to `prisma/schema.prisma`)
```prisma
// Listing core
model Listing {
  id           Int       @id @default(autoincrement())
  ownerId      String    @db.VarChar
  listingType  String    @db.VarChar // 'product' | 'real_estate' | 'tour' | 'ticket'
  title        String    @db.VarChar(200)
  description  String?   @db.Text
  basePrice    Decimal   @db.Decimal(10, 2)
  currency     String    @db.VarChar(3)
  status       String    @default("draft") @db.VarChar(30)
  city         String?   @db.VarChar(100)
  country      String?   @db.VarChar(100)
  latitude     Decimal?  @db.Decimal(10, 8)
  longitude    Decimal?  @db.Decimal(11, 8)
  publishedAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  owner        User      @relation(fields: [ownerId], references: [id])
  images       ListingImage[]
  property     Property?
  product      Product?
  tourDetail   TourDetail?
  ticketDetail TicketDetail?

  @@map("listings")
}

model ListingImage {
  id         Int     @id @default(autoincrement())
  listingId  Int
  url        String  @db.Text
  position   Int     @default(0)

  listing Listing @relation(fields: [listingId], references: [id])
  @@map("listing_images")
}

// Tours & tickets
model TourDetail {
  id             Int      @id @default(autoincrement())
  listingId      Int      @unique
  durationType   String   @db.VarChar(10) // hours|days
  durationValue  Int
  maxGuests      Int
  includedItems  String[] @db.Text
  notIncluded    String[] @db.Text
  meetingPoint   String?  @db.VarChar(200)
  city           String?  @db.VarChar(100)
  country        String?  @db.VarChar(100)
  cancellationPolicy String? @db.Text

  listing   Listing      @relation(fields: [listingId], references: [id])
  schedules TourSchedule[]
  bookings  Booking[]

  @@map("tour_details")
}

model TourSchedule {
  id             Int      @id @default(autoincrement())
  tourDetailId   Int
  startDatetime  DateTime
  endDatetime    DateTime
  capacity       Int
  remainingSlots Int

  tourDetail TourDetail @relation(fields: [tourDetailId], references: [id])
  bookings   Booking[]

  @@map("tour_schedules")
}

model TicketDetail {
  id           Int      @id @default(autoincrement())
  listingId    Int      @unique
  eventDate    DateTime
  venue        String   @db.VarChar(200)
  seatMapJson  Json?

  listing Listing @relation(fields: [listingId], references: [id])
  bookings Booking[]

  @@map("ticket_details")
}

// Booking extension
model Booking {
  id            Int      @id @default(autoincrement())
  listingId     Int?
  scheduleId    Int?
  propertyId    Int?
  guestId       String   @db.VarChar
  quantity      Int      @default(1)
  checkIn       DateTime? @db.Date
  checkOut      DateTime? @db.Date
  totalAmount   Decimal  @db.Decimal(10, 2)
  currency      String   @default("USD") @db.VarChar(3)
  status        String   @default("pending_payment") @db.VarChar(30)
  paymentId     Int?
  specialRequests String? @db.Text
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  property Property? @relation(fields: [propertyId], references: [id])
  listing  Listing?  @relation(fields: [listingId], references: [id])
  schedule TourSchedule? @relation(fields: [scheduleId], references: [id])
  guest    User      @relation("GuestBookings", fields: [guestId], references: [id])
  payment  Payment?  @relation(fields: [paymentId], references: [id])

  @@map("bookings")
}

// Payments & payouts
model Payment {
  id               Int      @id @default(autoincrement())
  userId           String   @db.VarChar
  orderId          Int?
  bookingId        Int?
  amount           Decimal  @db.Decimal(10, 2)
  currency         String   @default("USD") @db.VarChar(3)
  status           String   @default("pending") @db.VarChar(30)
  provider         String?  @db.VarChar(50)
  providerChargeId String?  @db.VarChar(100)
  rawResponse      Json?
  paymentMethod    String   @db.VarChar(50)
  transactionId    String?  @db.VarChar(100)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id])
  order  Order? @relation(fields: [orderId], references: [id])
  booking Booking? @relation(fields: [bookingId], references: [id])

  @@map("payments")
}

model PayoutAccount {
  id                 Int     @id @default(autoincrement())
  userId             String  @db.VarChar
  providerAccountId  String  @db.VarChar(100)
  payoutMethod       String  @db.VarChar(50)
  createdAt          DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  payouts Payout[]

  @@map("payout_accounts")
}

model Payout {
  id              Int      @id @default(autoincrement())
  userId          String   @db.VarChar
  accountId       Int
  amount          Decimal  @db.Decimal(10, 2)
  currency        String   @default("USD") @db.VarChar(3)
  status          String   @default("pending") @db.VarChar(30)
  providerPayoutId String? @db.VarChar(100)
  createdAt       DateTime @default(now())

  user    User          @relation(fields: [userId], references: [id])
  account PayoutAccount @relation(fields: [accountId], references: [id])

  @@map("payouts")
}

// Affiliates
model Affiliate {
  id                  Int     @id @default(autoincrement())
  userId              String  @unique @db.VarChar
  referralCode        String  @unique @db.VarChar(50)
  trackingId          String? @db.VarChar(100)
  commissionRateDefault Decimal @default(0.05) @db.Decimal(4, 2)
  createdAt           DateTime @default(now())

  user         User               @relation(fields: [userId], references: [id])
  clicks       AffiliateClick[]
  conversions  AffiliateConversion[]

  @@map("affiliates")
}

model AffiliateClick {
  id           Int      @id @default(autoincrement())
  affiliateId  Int
  ipAddress    String   @db.VarChar(50)
  userAgent    String?  @db.Text
  clickedAt    DateTime @default(now())

  affiliate Affiliate @relation(fields: [affiliateId], references: [id])
  @@map("affiliate_clicks")
}

model AffiliateConversion {
  id            Int      @id @default(autoincrement())
  affiliateId   Int
  orderId       Int?
  bookingId     Int?
  commissionAmount Decimal @db.Decimal(10, 2)
  currency      String   @default("USD") @db.VarChar(3)
  status        String   @default("pending") @db.VarChar(30)
  createdAt     DateTime @default(now())

  affiliate Affiliate @relation(fields: [affiliateId], references: [id])
  order     Order?    @relation(fields: [orderId], references: [id])
  booking   Booking?  @relation(fields: [bookingId], references: [id])

  @@map("affiliate_conversions")
}

// Notifications
model Notification {
  id        Int      @id @default(autoincrement())
  userId    String   @db.VarChar
  type      String   @db.VarChar(50)
  data      Json     @db.Json
  readAt    DateTime?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  @@map("notifications")
}
```

### Express Route Stubs (add under `server/routes-extra.ts` and import in `index.ts`)
```ts
import { Router } from "express";
import { requireAuth, requireRole } from "./auth";
import { storage } from "./storage-prisma";

export const listingRouter = Router();

// Create listing (owner = host/seller/admin)
listingRouter.post("/", requireAuth, async (req, res) => {
  // TODO: enforce role check once multi-role is in place
  const data = req.body; // assume validated upstream
  const listing = await storage.prisma.listing.create({ data: { ...data, ownerId: req.session.userId, status: "pending_review" } });
  res.json(listing);
});

// Update listing status (admin)
listingRouter.post('/:id/status', requireAuth, async (req, res) => {
  // TODO: requireRole('admin') once roles array exists
  const listingId = parseInt(req.params.id);
  const { status } = req.body;
  const listing = await storage.prisma.listing.update({ where: { id: listingId }, data: { status } });
  res.json(listing);
});

export const bookingRouter = Router();

// Check schedule availability and create booking draft
bookingRouter.post('/draft', requireAuth, async (req, res) => {
  const { scheduleId, quantity } = req.body;
  const schedule = await storage.prisma.tourSchedule.findUnique({ where: { id: scheduleId } });
  if (!schedule || schedule.remainingSlots < quantity) {
    return res.status(400).json({ message: 'Not enough capacity' });
  }
  const booking = await storage.prisma.booking.create({
    data: {
      scheduleId,
      guestId: req.session.userId,
      quantity,
      status: 'pending_payment',
      totalAmount: 0, // TODO: compute from listing price and quantity
      currency: 'USD'
    }
  });
  res.json(booking);
});

// Affiliate conversion hook (call after successful payment)
export async function recordAffiliateConversion(orderId?: number, bookingId?: number, affiliateCode?: string) {
  if (!affiliateCode) return;
  const affiliate = await storage.prisma.affiliate.findUnique({ where: { referralCode: affiliateCode } });
  if (!affiliate) return;
  await storage.prisma.affiliateConversion.create({
    data: {
      affiliateId: affiliate.id,
      orderId,
      bookingId,
      commissionAmount: 0, // TODO: apply percentage from affiliate.commissionRateDefault
      currency: 'USD',
    }
  });
}
```

### Notification Service Stub (`server/notifications.ts`)
```ts
import { storage } from "./storage-prisma";

export async function createNotification(userId: string, type: string, data: any) {
  return storage.prisma.notification.create({ data: { userId, type, data } });
}

export async function markNotificationRead(id: number) {
  return storage.prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
}
```

## Minimal Implementation Steps
1. Apply Prisma schema updates and run `npx prisma generate && npx prisma db push`.
2. Split new routers into modular files and mount under `/api/listings`, `/api/bookings`, `/api/affiliates`, `/api/notifications`.
3. Update auth middleware to handle multi-role arrays and enforce ownership/role checks on listing transitions.
4. Wire payments to orders/bookings, invoking `recordAffiliateConversion` and creating payout stubs after `paid` status.
5. Extend client pages to consume new endpoints (product/real estate/tour listings, booking flows, affiliate dashboard).
