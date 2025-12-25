import type { Express } from "express";
import { requireAuth } from "./auth";
import { storage } from "./storage-prisma";
import { z } from "zod";
import { isDiscountActive } from "./discount-utils";

const tourSchema = z.object({
  hostId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  location: z.string(),
  duration: z.string().optional(),
  basePrice: z.number().nonnegative(),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  status: z.string().default("published"),
});

const scheduleSchema = z.object({
  tourId: z.number(),
  startTime: z.string().or(z.date()),
  endTime: z.string().or(z.date()),
  capacity: z.number().min(1),
  availableSpots: z.number().min(0),
  price: z.number().optional(),
  meetingPoint: z.string().optional(),
  notes: z.string().optional(),
});

const ticketSchema = z.object({
  tourScheduleId: z.number(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  perks: z.array(z.string()).default([]),
});

const tourBookingSchema = z.object({
  tourScheduleId: z.number(),
  guests: z.number().min(1).default(1),
  totalAmount: z.number().nonnegative().optional().default(0),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  discountId: z.number().optional()
});

const tourStatusUpdateSchema = z.object({
  status: z.enum(["published", "draft", "paused", "archived"])
});

export function registerTourRoutes(app: Express) {
  app.get("/api/tours", async (req, res) => {
    try {
      const tours = await storage.getTours({
        search: (req.query.search as string) || undefined,
        location: (req.query.location as string) || undefined,
        hostId: (req.query.hostId as string) || undefined,
      });
      res.json(tours);
    } catch (error) {
      console.error("Error fetching tours", error);
      res.status(500).json({ message: "Failed to fetch tours" });
    }
  });

  app.post("/api/tours", requireAuth, async (req: any, res) => {
    try {
      const payload = tourSchema.parse({ ...req.body, hostId: req.session.userId });
      const created = await storage.createTour({
        ...payload,
        tags: payload.tags || [],
        images: payload.images || [],
      });
      res.json(created);
    } catch (error) {
      console.error("Error creating tour", error);
      res.status(400).json({ message: "Failed to create tour" });
    }
  });

  app.post("/api/tours/:id/status", requireAuth, async (req: any, res) => {
    try {
      const payload = tourStatusUpdateSchema.parse(req.body);
      const tourId = Number(req.params.id);
      const tour = await storage.getTour(tourId);

      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }

      const isOwner = tour.hostId === req.session.userId;
      const isAdmin = req.session.userRole === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "Not authorized to update this tour" });
      }

      const updated = await storage.updateTourStatus(tourId, payload.status);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status", errors: error.errors });
      }
      console.error("Error updating tour status", error);
      res.status(400).json({ message: "Failed to update tour status" });
    }
  });

  app.post("/api/tours/:id/schedules", requireAuth, async (req, res) => {
    try {
      const payload = scheduleSchema.parse({ ...req.body, tourId: Number(req.params.id) });
      const created = await storage.createTourSchedule({
        ...payload,
        startTime: new Date(payload.startTime),
        endTime: new Date(payload.endTime),
      });
      res.json(created);
    } catch (error) {
      console.error("Error creating tour schedule", error);
      res.status(400).json({ message: "Failed to create schedule" });
    }
  });

  app.post("/api/tour-schedules/:id/tickets", requireAuth, async (req, res) => {
    try {
      const payload = ticketSchema.parse({ ...req.body, tourScheduleId: Number(req.params.id) });
      const created = await storage.createTicketDetail(payload);
      res.json(created);
    } catch (error) {
      console.error("Error creating ticket", error);
      res.status(400).json({ message: "Failed to create ticket" });
    }
  });

  app.get("/api/tours/:id/schedules", async (req, res) => {
    try {
      const schedules = await storage.getTourSchedules(Number(req.params.id));
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching schedules", error);
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  app.post("/api/tours/:id/bookings", requireAuth, async (req: any, res) => {
    try {
      const payload = tourBookingSchema.parse(req.body);
      let discount = undefined as Awaited<ReturnType<typeof storage.getDiscount>> | undefined;

      if (payload.discountId) {
        discount = await storage.getDiscount(payload.discountId);
        if (!discount) {
          return res.status(404).json({ message: "Discount not found" });
        }
        if (!isDiscountActive(discount)) {
          return res.status(400).json({ message: "Discount is not active" });
        }
      }

      const booking = await storage.bookTour(
        {
          ...payload,
          userId: req.session.userId,
          totalAmount: 0
        },
        payload.guests,
        discount
      );
      res.json(booking);
    } catch (error: any) {
      console.error("Error booking tour", error);
      res.status(400).json({ message: error?.message || "Failed to book tour" });
    }
  });

  app.get("/api/tour-bookings", requireAuth, async (req: any, res) => {
    try {
      const role = (req.query.role as "host" | "guest") || "guest";
      const bookings = await storage.getTourBookings(req.session.userId, role);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching tour bookings", error);
      res.status(500).json({ message: "Failed to fetch tour bookings" });
    }
  });

  app.post("/api/tour-bookings/:id/status", requireAuth, async (req, res) => {
    try {
      const status = req.body.status as string;
      const booking = await storage.updateTourBookingStatus(Number(req.params.id), status);
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking status", error);
      res.status(400).json({ message: "Failed to update booking status" });
    }
  });
}
