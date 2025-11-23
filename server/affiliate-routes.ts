import { Express } from "express";
import { prisma } from "./prisma";
import { requireAuth } from "./auth";
import { z } from "zod";

const trackClickSchema = z.object({
  referralCode: z.string(),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
});

const trackConversionSchema = z.object({
  referralCode: z.string(),
  orderId: z.number().optional(),
  bookingId: z.number().optional(),
  amount: z.number().min(0),
});

export function registerAffiliateRoutes(app: Express) {
  // Get or create affiliate profile for authenticated user
  app.get("/api/affiliates/me", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      let affiliate = await prisma.affiliate.findUnique({ where: { userId } });

      if (!affiliate) {
        // Assumption: referral code uses short hash of userId for demo purposes
        affiliate = await prisma.affiliate.create({
          data: {
            userId,
            referralCode: `ref-${userId.slice(-6)}`,
          },
        });
      }

      const payouts = await prisma.payout.findMany({ where: { affiliateId: affiliate.id } });
      res.json({ affiliate, payouts });
    } catch (error) {
      console.error("Error fetching affiliate profile", error);
      res.status(500).json({ message: "Failed to load affiliate profile" });
    }
  });

  // Track click for referral code
  app.post("/api/affiliates/track-click", async (req, res) => {
    try {
      const payload = trackClickSchema.parse(req.body);
      const affiliate = await prisma.affiliate.findUnique({ where: { referralCode: payload.referralCode } });

      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }

      await prisma.affiliateClick.create({
        data: {
          affiliateId: affiliate.id,
          landingPage: payload.landingPage,
          referrer: payload.referrer,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });

      await prisma.affiliate.update({
        where: { id: affiliate.id },
        data: { totalClicks: { increment: 1 } },
      });

      res.json({ message: "Click recorded" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid click payload", errors: error.errors });
      }
      console.error("Error tracking click", error);
      res.status(500).json({ message: "Failed to record click" });
    }
  });

  // Track conversion and commission accrual
  app.post("/api/affiliates/track-conversion", async (req, res) => {
    try {
      const payload = trackConversionSchema.parse(req.body);
      const affiliate = await prisma.affiliate.findUnique({ where: { referralCode: payload.referralCode } });

      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }

      const commission = Number(payload.amount) * Number(affiliate.commissionRate);

      const conversion = await prisma.affiliateConversion.create({
        data: {
          affiliateId: affiliate.id,
          orderId: payload.orderId,
          bookingId: payload.bookingId,
          amount: payload.amount,
          commission,
          status: "pending",
        },
      });

      await prisma.affiliate.update({
        where: { id: affiliate.id },
        data: {
          totalConversions: { increment: 1 },
          totalCommission: { increment: commission },
        },
      });

      res.json(conversion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid conversion payload", errors: error.errors });
      }
      console.error("Error tracking conversion", error);
      res.status(500).json({ message: "Failed to record conversion" });
    }
  });

  // Aggregate stats for dashboard
  app.get("/api/affiliates/stats", requireAuth, async (req: any, res) => {
    try {
      const affiliate = await prisma.affiliate.findUnique({ where: { userId: req.session.userId } });
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate profile not found" });
      }

      const [clicks, conversions, payouts] = await Promise.all([
        prisma.affiliateClick.count({ where: { affiliateId: affiliate.id } }),
        prisma.affiliateConversion.findMany({ where: { affiliateId: affiliate.id }, orderBy: { createdAt: "desc" }, take: 20 }),
        prisma.payout.findMany({ where: { affiliateId: affiliate.id }, orderBy: { requestedAt: "desc" } }),
      ]);

      res.json({
        affiliate,
        summary: {
          clicks,
          conversions: conversions.length,
          pendingCommission: conversions
            .filter((c) => c.status === "pending")
            .reduce((sum, c) => sum + Number(c.commission), 0),
        },
        conversions,
        payouts,
      });
    } catch (error) {
      console.error("Error loading affiliate stats", error);
      res.status(500).json({ message: "Failed to load affiliate stats" });
    }
  });
}
