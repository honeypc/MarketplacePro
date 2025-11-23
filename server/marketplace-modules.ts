import { Router } from "express";
import { randomUUID } from "crypto";

// Domain model interfaces kept minimal for scaffolding. Replace with Prisma/ORM models in production.
type UserRoleType = "end_user" | "host" | "affiliate" | "admin";
type ListingType = "product" | "real_estate" | "tour" | "ticket";

type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "VND";

type ListingStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "paused"
  | "rejected"
  | "archived";

type OrderStatus =
  | "pending_payment"
  | "paid"
  | "shipped"
  | "completed"
  | "cancelled"
  | "refunded";

type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "refunded";

type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

type AffiliateConversionStatus = "pending" | "approved" | "paid";

export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  avatarUrl?: string;
  phone?: string;
  defaultCurrency?: CurrencyCode;
  language?: string;
  timezone?: string;
}

export interface UserRole {
  id: string;
  userId: string;
  role: UserRoleType;
}

export interface Listing {
  id: string;
  userId: string;
  listingType: ListingType;
  title: string;
  slug: string;
  description?: string;
  basePrice: number;
  currency: CurrencyCode;
  status: ListingStatus;
  locationId?: string;
}

export interface ListingImage {
  id: string;
  listingId: string;
  imageUrl: string;
  position: number;
}

export interface ProductDetail {
  id: string;
  listingId: string;
  stockQuantity: number;
  sku?: string;
  weight?: number;
  dimensions?: Record<string, unknown>;
  shippingRequired?: boolean;
}

export interface Order {
  id: string;
  buyerId: string;
  totalAmount: number;
  currency: CurrencyCode;
  status: OrderStatus;
  paymentId?: string;
  shippingAddressId?: string;
  placedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  listingId: string;
  quantity: number;
  unitPrice: number;
}

export interface Booking {
  id: string;
  listingId: string;
  buyerId: string;
  hostId: string;
  scheduleId?: string;
  quantity: number;
  totalAmount: number;
  currency: CurrencyCode;
  status: BookingStatus;
  paymentId?: string;
  checkInCode?: string;
}

export interface Affiliate {
  id: string;
  userId: string;
  referralCode: string;
  trackingId?: string;
  commissionRateDefault: number;
}

export interface AffiliateClick {
  id: string;
  affiliateId: string;
  ipAddress: string;
  userAgent: string;
  clickedAt: Date;
}

export interface AffiliateConversion {
  id: string;
  affiliateId: string;
  orderId?: string;
  bookingId?: string;
  commissionAmount: number;
  currency: CurrencyCode;
  status: AffiliateConversionStatus;
}

// In-memory stores for demo purposes only.
const users: User[] = [];
const userRoles: UserRole[] = [];
const listings: Listing[] = [];
const listingImages: ListingImage[] = [];
const productDetails: ProductDetail[] = [];
const orders: Order[] = [];
const orderItems: OrderItem[] = [];
const bookings: Booking[] = [];
const affiliates: Affiliate[] = [];
const affiliateClicks: AffiliateClick[] = [];
const affiliateConversions: AffiliateConversion[] = [];

// Helper: naive slug creator.
function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .concat(`-${Math.random().toString(16).slice(2, 6)}`);
}

// Minimal auth stub that simulates a middleware setting req.user.
function requireAuthStub(req: any, _res: any, next: any) {
  if (!req.user) {
    // In a real app, JWT/session middleware would populate req.user.
    req.user = users[0];
  }
  next();
}

// ---- Route builder ----
export function buildMarketplaceRouter(): Router {
  const router = Router();

  // Auth: signup
  router.post("/auth/signup", (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });
    }
    const existing = users.find((u) => u.email === email);
    if (existing) {
      return res.status(400).json({ message: "email already registered" });
    }
    const user: User = {
      id: randomUUID(),
      email,
      password,
      name,
      defaultCurrency: "USD",
    };
    users.push(user);
    userRoles.push({ id: randomUUID(), userId: user.id, role: "end_user" });
    // Token is a placeholder string; replace with JWT.
    return res.json({ token: `demo-token-${user.id}`, user });
  });

  // Auth: login
  router.post("/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    return res.json({ token: `demo-token-${user.id}`, user });
  });

  // Create listing (core)
  router.post("/listings", requireAuthStub, (req, res) => {
    const { listingType, title, description, basePrice, currency } = req.body;
    if (!listingType || !title || !basePrice || !currency) {
      return res.status(400).json({ message: "listingType, title, basePrice, currency required" });
    }
    const listing: Listing = {
      id: randomUUID(),
      userId: req.user.id,
      listingType,
      title,
      slug: slugify(title),
      description,
      basePrice: Number(basePrice),
      currency,
      status: "pending_review",
    };
    listings.push(listing);
    return res.status(201).json(listing);
  });

  // Get listings (filtered)
  router.get("/listings", (_req, res) => {
    return res.json(listings);
  });

  // Listing detail
  router.get("/listings/:id", (req, res) => {
    const listing = listings.find((l) => l.id === req.params.id);
    if (!listing) return res.status(404).json({ message: "not found" });
    const images = listingImages.filter((img) => img.listingId === listing.id);
    const product = productDetails.find((p) => p.listingId === listing.id);
    return res.json({ ...listing, images, product });
  });

  // Add listing image
  router.post("/listings/:id/images", requireAuthStub, (req, res) => {
    const listing = listings.find((l) => l.id === req.params.id);
    if (!listing) return res.status(404).json({ message: "not found" });
    const { imageUrl, position = listingImages.length + 1 } = req.body;
    const image: ListingImage = {
      id: randomUUID(),
      listingId: listing.id,
      imageUrl,
      position,
    };
    listingImages.push(image);
    return res.status(201).json(image);
  });

  // Product detail creation
  router.post("/products", requireAuthStub, (req, res) => {
    const { listingId, stockQuantity, sku, weight, dimensions, shippingRequired } = req.body;
    const listing = listings.find((l) => l.id === listingId && l.listingType === "product");
    if (!listing) return res.status(404).json({ message: "listing not found" });
    const detail: ProductDetail = {
      id: randomUUID(),
      listingId,
      stockQuantity: Number(stockQuantity) || 0,
      sku,
      weight,
      dimensions,
      shippingRequired: shippingRequired ?? true,
    };
    productDetails.push(detail);
    return res.status(201).json(detail);
  });

  // Cart is implicit per-user; create order from cart items sent in payload.
  router.post("/orders", requireAuthStub, (req, res) => {
    const { items, currency } = req.body as { items: Array<{ listingId: string; quantity: number; unitPrice: number }>; currency: CurrencyCode };
    if (!items || items.length === 0) return res.status(400).json({ message: "items required" });
    const order: Order = {
      id: randomUUID(),
      buyerId: req.user.id,
      totalAmount: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
      currency: currency || "USD",
      status: "pending_payment",
      placedAt: new Date(),
    };
    orders.push(order);
    items.forEach((item) => {
      const orderItem: OrderItem = {
        id: randomUUID(),
        orderId: order.id,
        listingId: item.listingId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      };
      orderItems.push(orderItem);
    });
    return res.status(201).json({ order, items: orderItems.filter((oi) => oi.orderId === order.id) });
  });

  // Booking creation for tours/tickets
  router.post("/bookings", requireAuthStub, (req, res) => {
    const { listingId, hostId, scheduleId, quantity, currency } = req.body;
    const listing = listings.find((l) => l.id === listingId && (l.listingType === "tour" || l.listingType === "ticket"));
    if (!listing) return res.status(404).json({ message: "listing not found" });
    const booking: Booking = {
      id: randomUUID(),
      listingId,
      buyerId: req.user.id,
      hostId: hostId || listing.userId,
      scheduleId,
      quantity: Number(quantity) || 1,
      totalAmount: (Number(quantity) || 1) * Number(listing.basePrice),
      currency: currency || listing.currency,
      status: "pending_payment",
      checkInCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
    };
    bookings.push(booking);
    return res.status(201).json(booking);
  });

  // Affiliate creation and click/conversion stubs
  router.post("/affiliates", requireAuthStub, (req, res) => {
    const { commissionRateDefault = 10 } = req.body;
    const affiliate: Affiliate = {
      id: randomUUID(),
      userId: req.user.id,
      referralCode: `REF-${req.user.id.slice(0, 6)}`,
      trackingId: randomUUID(),
      commissionRateDefault,
    };
    affiliates.push(affiliate);
    return res.status(201).json(affiliate);
  });

  router.get("/affiliates/:code/click", (req, res) => {
    const affiliate = affiliates.find((a) => a.referralCode === req.params.code);
    if (!affiliate) return res.status(404).json({ message: "affiliate not found" });
    const click: AffiliateClick = {
      id: randomUUID(),
      affiliateId: affiliate.id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"] || "unknown",
      clickedAt: new Date(),
    };
    affiliateClicks.push(click);
    return res.json({ message: "click recorded", trackingId: affiliate.trackingId });
  });

  router.post("/affiliates/:code/conversions", (req, res) => {
    const affiliate = affiliates.find((a) => a.referralCode === req.params.code);
    if (!affiliate) return res.status(404).json({ message: "affiliate not found" });
    const { orderId, bookingId, commissionAmount, currency } = req.body;
    const conversion: AffiliateConversion = {
      id: randomUUID(),
      affiliateId: affiliate.id,
      orderId,
      bookingId,
      commissionAmount: Number(commissionAmount) || 0,
      currency: currency || "USD",
      status: "pending",
    };
    affiliateConversions.push(conversion);
    return res.status(201).json(conversion);
  });

  return router;
}

// Convenience default router instance for quick mounting in dev servers.
export const marketplaceRouter = buildMarketplaceRouter();
