import { prisma } from "./prisma";
import { hashPassword } from "./auth";

async function resetDatabase() {
  // Quick reset that respects foreign keys
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "sessions",
      "affiliates",
      "affiliate_conversions",
      "affiliate_clicks",
      "payouts",
      "tour_bookings",
      "ticket_details",
      "tour_schedules",
      "tours",
      "itinerary_activities",
      "itinerary_days",
      "itineraries",
      "payments",
      "property_reviews",
      "bookings",
      "room_availability",
      "property_availability",
      "recommendations",
      "similar_items",
      "form_fields",
      "form_templates",
      "notifications",
      "order_items",
      "orders",
      "cart_items",
      "wishlist_items",
      "reviews",
      "content_ratings",
      "products",
      "categories",
      "chat_messages",
      "chat_rooms",
      "user_preferences",
      "user_interactions",
      "users"
    RESTART IDENTITY CASCADE;
  `);
}

export async function seedSimpleData() {
  try {
    console.log("Starting database seed...");
    await resetDatabase();

    const passwordPlain = "123456";
    const usersWithHashedPasswords = await Promise.all(
      [
        { id: "admin", email: "admin@marketplacepro.com", firstName: "Admin", lastName: "User", role: "admin", isActive: true, isVerified: true },
        { id: "seller1", email: "seller@marketplacepro.com", firstName: "Seller", lastName: "One", role: "seller", isActive: true, isVerified: true },
        { id: "user1", email: "user@marketplacepro.com", firstName: "Regular", lastName: "User", role: "user", isActive: true, isVerified: true },
        { id: "traveler1", email: "traveler@marketplacepro.com", firstName: "Travel", lastName: "Lover", role: "user", isActive: true, isVerified: true }
      ].map(async (user) => ({
        ...user,
        password: await hashPassword(passwordPlain),
      }))
    );

    await prisma.user.createMany({ data: usersWithHashedPasswords });
    console.log(`✅ Created ${usersWithHashedPasswords.length} users`);

    await prisma.userPreferences.createMany({
      data: [
        {
          userId: "traveler1",
          preferredDestinations: ["Ho Chi Minh City", "Da Nang", "Hanoi"],
          travelBudgetRange: "100-300",
          travelStyle: "adventure",
          accommodationType: "apartment",
          favoriteCategories: ["Điện tử", "Thời trang"],
          priceRange: "medium",
          brandPreferences: ["Apple", "Nike"],
          interests: ["travel", "tech", "food"]
        },
        {
          userId: "user1",
          preferredDestinations: ["Da Lat"],
          travelStyle: "family",
          accommodationType: "villa",
          favoriteCategories: ["Nhà cửa & Vườn"],
          brandPreferences: ["Ikea"],
          interests: ["home", "decor", "gadgets"]
        }
      ]
    });

    const formTemplates = [
      {
        id: "product-form",
        title: "Product Listing",
        entity: "Product",
        description: "Structured product intake for catalog managers",
        status: "published",
        permissions: ["admin", "seller", "manager"],
        fields: [
          {
            id: "title",
            name: "title",
            label: "Title",
            type: "text",
            required: true,
            description: "Display name customers will see",
            validations: ["required", "min"],
            roles: ["admin", "seller", "manager"],
          },
          {
            id: "price",
            name: "price",
            label: "Price",
            type: "currency",
            required: true,
            description: "Base selling price",
            validations: ["required", "min"],
            roles: ["admin", "seller"],
          },
          {
            id: "inventory",
            name: "inventory",
            label: "Inventory",
            type: "number",
            required: false,
            description: "Available stock count",
            validations: ["min"],
            roles: ["admin", "manager"],
          },
        ],
      },
      {
        id: "property-form",
        title: "Property Onboarding",
        entity: "Property",
        description: "Capture accommodation metadata and compliance",
        status: "published",
        permissions: ["admin", "agent"],
        fields: [
          {
            id: "name",
            name: "name",
            label: "Property Name",
            type: "text",
            required: true,
            description: "Internal and public name",
            validations: ["required"],
            roles: ["admin", "agent"],
          },
          {
            id: "location",
            name: "location",
            label: "Location",
            type: "text",
            required: true,
            description: "City, country, and coordinates",
            validations: ["required"],
            roles: ["admin", "agent", "traveler"],
          },
          {
            id: "safety",
            name: "safety",
            label: "Safety Checks",
            type: "checkbox",
            required: false,
            description: "Fire alarms, exits, and insurance",
            validations: [],
            roles: ["admin"],
          },
        ],
      },
      {
        id: "itinerary-form",
        title: "Travel Itinerary",
        entity: "Itinerary",
        description: "Trip planning template for travelers",
        status: "draft",
        permissions: ["admin", "traveler"],
        fields: [
          {
            id: "destination",
            name: "destination",
            label: "Destination",
            type: "text",
            required: true,
            description: "Primary destination city",
            validations: ["required"],
            roles: ["admin", "traveler", "agent"],
          },
          {
            id: "dates",
            name: "dates",
            label: "Travel Dates",
            type: "date",
            required: true,
            description: "Start and end dates",
            validations: ["required"],
            roles: ["admin", "traveler"],
          },
          {
            id: "budget",
            name: "budget",
            label: "Budget",
            type: "currency",
            required: false,
            description: "Optional budget guardrail",
            validations: ["min", "max"],
            roles: ["admin", "traveler"],
          },
        ],
      },
    ];

    for (const template of formTemplates) {
      await prisma.formTemplate.create({
        data: {
          id: template.id,
          title: template.title,
          entity: template.entity,
          description: template.description,
          status: template.status,
          permissions: template.permissions,
          fields: {
            create: template.fields.map((field) => ({
              id: field.id,
              name: field.name,
              label: field.label,
              type: field.type,
              required: field.required,
              description: field.description,
              validations: field.validations,
              roles: field.roles,
            })),
          },
        },
      });
    }
    console.log(`✅ Seeded ${formTemplates.length} admin form templates`);

    // Categories + products
    const categories = await prisma.category.createMany({
      data: [
        { name: "Điện tử", slug: "dien-tu", description: "Thiết bị điện tử, công nghệ" },
        { name: "Thời trang", slug: "thoi-trang", description: "Quần áo, phụ kiện thời trang" },
        { name: "Nhà cửa & Vườn", slug: "nha-cua-vuon", description: "Đồ gia dụng, nội thất" },
        { name: "Sức khỏe & Làm đẹp", slug: "suc-khoe-lam-dep", description: "Sản phẩm chăm sóc sức khỏe" },
        { name: "Đặc sản Việt Nam", slug: "dac-san-viet-nam", description: "Sản phẩm đặc sản Việt Nam" }
      ]
    });
    console.log(`✅ Created ${categories.count} categories`);

    const product1 = await prisma.product.create({
      data: {
        sellerId: "seller1",
        title: "iPhone 15 Pro Max",
        description: "iPhone 15 Pro Max mới nhất với chip A17 Pro, camera 48MP chuyên nghiệp",
        price: 32990000,
        categoryId: 1,
        stock: 50,
        images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab"],
        isActive: true
      }
    });
    const product2 = await prisma.product.create({
      data: {
        sellerId: "seller1",
        title: "Áo Dài Truyền Thống",
        description: "Áo dài Việt Nam truyền thống, chất liệu lụa cao cấp, thêu tay tinh xảo",
        price: 2500000,
        categoryId: 2,
        stock: 25,
        images: ["https://images.unsplash.com/photo-1583846294664-7b0e8b5a1c7c"],
        isActive: true
      }
    });
    const product3 = await prisma.product.create({
      data: {
        sellerId: "seller1",
        title: "Bộ Bàn Ghế Gỗ Mahogany",
        description: "Bộ bàn ghế gỗ mahogany cao cấp, thiết kế cổ điển sang trọng",
        price: 15000000,
        categoryId: 3,
        stock: 10,
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7"],
        isActive: true
      }
    });
    const product4 = await prisma.product.create({
      data: {
        sellerId: "seller1",
        title: "Kem Chống Nắng SPF 50+",
        description: "Kem chống nắng tự nhiên, bảo vệ da khỏi tia UV hiệu quả",
        price: 350000,
        categoryId: 4,
        stock: 100,
        images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"],
        isActive: true
      }
    });
    const product5 = await prisma.product.create({
      data: {
        sellerId: "seller1",
        title: "Nước Mắm Phú Quốc",
        description: "Nước mắm truyền thống Phú Quốc, độ đạm cao, hương vị đậm đà",
        price: 125000,
        categoryId: 5,
        stock: 200,
        images: ["https://images.unsplash.com/photo-1563379091339-03246963d96c"],
        isActive: true
      }
    });
    console.log("✅ Created products");

    await prisma.review.createMany({
      data: [
        { userId: "user1", productId: product1.id, rating: 5, comment: "Sản phẩm rất tuyệt vời! Chất lượng hoàn hảo, giao hàng nhanh." },
        { userId: "traveler1", productId: product2.id, rating: 4, comment: "Áo dài rất đẹp, chất liệu tốt. Sẽ mua thêm cho gia đình." },
        { userId: "user1", productId: product5.id, rating: 5, comment: "Nước mắm ngon, đúng vị truyền thống Phú Quốc. Highly recommended!" }
      ]
    });

    await prisma.cartItem.createMany({
      data: [
        { userId: "user1", productId: product1.id, quantity: 1 },
        { userId: "user1", productId: product4.id, quantity: 2 }
      ]
    });
    await prisma.wishlistItem.createMany({
      data: [
        { userId: "user1", productId: product2.id },
        { userId: "traveler1", productId: product3.id }
      ]
    });

    const order = await prisma.order.create({
      data: {
        userId: "user1",
        status: "completed",
        totalAmount: 33490000,
        shippingAddress: { line1: "123 Nguyen Hue", city: "Ho Chi Minh", country: "VN" },
        paymentMethod: "card",
        paymentStatus: "paid"
      }
    });
    await prisma.orderItem.createMany({
      data: [
        { orderId: order.id, productId: product1.id, quantity: 1, price: product1.price },
        { orderId: order.id, productId: product4.id, quantity: 1, price: product4.price }
      ]
    });

    await prisma.chatRoom.createMany({
      data: [
        { customerId: "user1", supportAgentId: "admin", status: "active", subject: "Hỏi về sản phẩm iPhone 15 Pro Max", priority: "medium" },
        { customerId: "traveler1", status: "active", subject: "Cần hỗ trợ đặt hàng", priority: "high" }
      ]
    });
    await prisma.chatMessage.createMany({
      data: [
        { roomId: 1, senderId: "user1", message: "Xin chào, tôi muốn hỏi về iPhone 15 Pro Max có còn hàng không?", messageType: "text" },
        { roomId: 1, senderId: "admin", message: "Chào bạn! iPhone 15 Pro Max hiện vẫn còn hàng. Bạn có cần hỗ trợ gì thêm không?", messageType: "text", isRead: false },
        { roomId: 2, senderId: "traveler1", message: "Tôi cần hỗ trợ đặt hàng nhiều sản phẩm cùng lúc", messageType: "text" }
      ]
    });

    // Stays/properties
    const property1 = await prisma.property.create({
      data: {
        hostId: "admin",
        title: "Luxury Apartment in Ho Chi Minh City Center",
        description: "Modern apartment with skyline views in District 1.",
        propertyType: "apartment",
        roomType: "entire_place",
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        pricePerNight: 85,
        cleaningFee: 15,
        serviceFee: 12,
        address: "123 Nguyen Hue Street, District 1",
        city: "Ho Chi Minh City",
        country: "Vietnam",
        zipCode: "700000",
        latitude: 10.7769,
        longitude: 106.7009,
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
        ],
        amenities: ["wifi", "air_conditioning", "kitchen", "tv", "washer", "elevator", "parking"],
        instantBook: true
      }
    });
    const property2 = await prisma.property.create({
      data: {
        hostId: "seller1",
        title: "Cozy Villa in Da Nang Beach",
        description: "Beachfront villa with private pool and BBQ area.",
        propertyType: "villa",
        roomType: "entire_place",
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        pricePerNight: 150,
        cleaningFee: 25,
        serviceFee: 20,
        address: "456 My Khe Beach, Son Tra District",
        city: "Da Nang",
        country: "Vietnam",
        zipCode: "550000",
        latitude: 16.0544,
        longitude: 108.2442,
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
          "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800"
        ],
        amenities: ["wifi", "air_conditioning", "kitchen", "tv", "washer", "pool", "beach_access", "parking", "bbq"],
        instantBook: false
      }
    });

    await prisma.propertyAvailability.createMany({
      data: [
        { propertyId: property1.id, date: new Date("2024-12-10"), available: true, customPrice: 95 },
        { propertyId: property1.id, date: new Date("2024-12-11"), available: true, customPrice: 90 },
        { propertyId: property2.id, date: new Date("2024-12-12"), available: true, customPrice: 180 }
      ]
    });

    const booking1 = await prisma.booking.create({
      data: {
        propertyId: property1.id,
        guestId: "traveler1",
        checkIn: new Date("2024-12-10"),
        checkOut: new Date("2024-12-14"),
        guests: 3,
        totalAmount: 85 * 4 + 15 + 12,
        status: "completed",
        specialRequests: "Late check-in around 10pm"
      }
    });
    const booking2 = await prisma.booking.create({
      data: {
        propertyId: property2.id,
        guestId: "user1",
        checkIn: new Date("2024-12-20"),
        checkOut: new Date("2024-12-23"),
        guests: 5,
        totalAmount: 150 * 3 + 25 + 20,
        status: "pending",
        specialRequests: "Airport pickup if possible"
      }
    });

    await prisma.propertyReview.create({
      data: {
        propertyId: property1.id,
        bookingId: booking1.id,
        userId: "traveler1",
        rating: 5,
        cleanliness: 5,
        communication: 5,
        checkIn: 5,
        accuracy: 4,
        location: 5,
        value: 4,
        comment: "View tuyệt đẹp, chủ nhà hỗ trợ nhiệt tình. Sẽ quay lại!"
      }
    });

    await prisma.payment.createMany({
      data: [
        { userId: "traveler1", bookingId: booking1.id, amount: 85 * 4 + 15 + 12, currency: "USD", status: "paid", paymentMethod: "card", transactionId: "txn_booking1" },
        { userId: "user1", amount: 33490000, currency: "VND", status: "paid", paymentMethod: "card", transactionId: "txn_order1" }
      ]
    });

    // Tours
    const saigonTour = await prisma.tourDetail.create({
      data: {
        hostId: "admin",
        title: "Saigon Food Night Tour",
        description: "Taste the best street food in District 1 with a local guide.",
        location: "Ho Chi Minh City",
        duration: "4 hours",
        basePrice: 45,
        tags: ["food", "nightlife", "culture"],
        images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900"],
        schedules: {
          create: [
            { startTime: new Date("2024-12-12T18:00:00Z"), endTime: new Date("2024-12-12T22:00:00Z"), capacity: 12, availableSpots: 8, price: 55, meetingPoint: "Ben Thanh Market" },
            { startTime: new Date("2024-12-13T18:00:00Z"), endTime: new Date("2024-12-13T22:00:00Z"), capacity: 12, availableSpots: 10, price: 50, meetingPoint: "Nguyen Hue Walking Street" }
          ]
        }
      },
      include: { schedules: true }
    });

    const hanoiTour = await prisma.tourDetail.create({
      data: {
        hostId: "seller1",
        title: "Hanoi Old Quarter Walking Tour",
        description: "Discover hidden alleys, temples, and egg coffee spots.",
        location: "Hanoi",
        duration: "3 hours",
        basePrice: 30,
        tags: ["history", "walking", "food"],
        images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900"],
        schedules: {
          create: [
            { startTime: new Date("2024-12-14T09:00:00Z"), endTime: new Date("2024-12-14T12:00:00Z"), capacity: 15, availableSpots: 15, price: 35, meetingPoint: "Hoan Kiem Lake" }
          ]
        }
      },
      include: { schedules: true }
    });

    await prisma.ticketDetail.createMany({
      data: [
        { tourScheduleId: saigonTour.schedules[0].id, name: "Standard", description: "Includes all tastings", price: 55, perks: ["food", "drink"] },
        { tourScheduleId: saigonTour.schedules[0].id, name: "VIP", description: "Front seats and extra desserts", price: 70, perks: ["food", "drink", "dessert"] },
        { tourScheduleId: hanoiTour.schedules[0].id, name: "Morning Tour", description: "Coffee and snacks included", price: 35, perks: ["coffee", "snacks"] }
      ]
    });

    await prisma.tourBooking.createMany({
      data: [
        { userId: "traveler1", tourScheduleId: saigonTour.schedules[0].id, guests: 2, status: "confirmed", totalAmount: 110, contactEmail: "traveler@marketplacepro.com", contactPhone: "+84 123456789" },
        { userId: "user1", tourScheduleId: hanoiTour.schedules[0].id, guests: 1, status: "pending", totalAmount: 35, contactEmail: "user@marketplacepro.com" }
      ]
    });

    // Itinerary planner sample
    const itinerary = await prisma.itinerary.create({
      data: {
        userId: "traveler1",
        title: "Weekend in Saigon",
        description: "Food, culture, and chill time by the river.",
        destination: "Ho Chi Minh City",
        startDate: new Date("2024-12-12"),
        endDate: new Date("2024-12-14"),
        totalBudget: 500,
        status: "confirmed",
        isPublic: true
      }
    });
    const day1 = await prisma.itineraryDay.create({
      data: { itineraryId: itinerary.id, dayNumber: 1, date: new Date("2024-12-12"), title: "Food crawl", notes: "Evening food tour" }
    });
    const day2 = await prisma.itineraryDay.create({
      data: { itineraryId: itinerary.id, dayNumber: 2, date: new Date("2024-12-13"), title: "City sights", notes: "Museums + shopping" }
    });
    await prisma.itineraryActivity.createMany({
      data: [
        { dayId: day1.id, title: "Saigon food night tour", description: "Street food tastings", startTime: new Date("2024-12-12T18:00:00Z"), endTime: new Date("2024-12-12T22:00:00Z"), cost: 55, category: "food", orderIndex: 0 },
        { dayId: day2.id, title: "War Remnants Museum", description: "Morning visit", startTime: new Date("2024-12-13T09:00:00Z"), endTime: new Date("2024-12-13T11:00:00Z"), cost: 10, category: "museum", orderIndex: 0 },
        { dayId: day2.id, title: "Saigon Centre shopping", description: "Pick up gifts", startTime: new Date("2024-12-13T14:00:00Z"), endTime: new Date("2024-12-13T16:00:00Z"), cost: 80, category: "shopping", orderIndex: 1 }
      ]
    });

    // Generic ratings across different marketplace entities
    await prisma.contentRating.createMany({
      data: [
        {
          userId: "user1",
          targetType: "product",
          targetId: product1.id.toString(),
          rating: 5,
          comment: "Amazing quality and delivery speed for the flagship phone!"
        },
        {
          userId: "traveler1",
          targetType: "host",
          targetId: property1.hostId,
          rating: 5,
          comment: "Host was super responsive and check-in was smooth",
          metadata: { hospitality: 5, communication: 5 }
        },
        {
          userId: "traveler1",
          targetType: "property",
          targetId: property1.id.toString(),
          rating: 5,
          comment: "Great location and spotless apartment",
          metadata: { cleanliness: 5, location: 5 }
        },
        {
          userId: "user1",
          targetType: "tour",
          targetId: saigonTour.id.toString(),
          rating: 5,
          comment: "Loved every food stop and the guide's energy"
        },
        {
          userId: "traveler1",
          targetType: "tour",
          targetId: hanoiTour.id.toString(),
          rating: 4,
          comment: "Great intro to the Old Quarter",
          metadata: { pacing: 4 }
        },
        {
          userId: "traveler1",
          targetType: "trip",
          targetId: itinerary.id.toString(),
          rating: 4,
          comment: "Itinerary kept us on track with just enough flexibility"
        }
      ]
    });

    // Notifications to drive UI
    await prisma.notification.createMany({
      data: [
        { userId: "traveler1", type: "booking", title: "Booking confirmed", body: "Your stay in HCMC is confirmed.", data: { bookingId: booking1.id } },
        { userId: "user1", type: "order", title: "Order shipped", body: "Your iPhone order is on the way!", data: { orderId: order.id } },
        { userId: "traveler1", type: "tour", title: "Tour reminder", body: "Saigon food tour starts at 6pm tomorrow.", data: { tourId: saigonTour.id } }
      ]
    });

    // Affiliate samples
    const affiliate = await prisma.affiliate.create({
      data: { userId: "seller1", referralCode: "SELLER-REF", commissionRate: 0.08 }
    });
    await prisma.affiliateClick.createMany({
      data: [
        { affiliateId: affiliate.id, landingPage: "/products/1", ipAddress: "192.168.1.10" },
        { affiliateId: affiliate.id, landingPage: "/properties", ipAddress: "192.168.1.11" }
      ]
    });
    await prisma.affiliateConversion.create({
      data: { affiliateId: affiliate.id, orderId: order.id, amount: 33490000, commission: 2679200, status: "paid" }
    });
    await prisma.payout.create({
      data: { affiliateId: affiliate.id, amount: 1500000, status: "processing", notes: "Monthly payout" }
    });

    // Interaction + recommendations
    await prisma.userInteraction.createMany({
      data: [
        { userId: "traveler1", itemType: "property", itemId: property1.id.toString(), actionType: "view", duration: 120 },
        { userId: "traveler1", itemType: "tour", itemId: saigonTour.id.toString(), actionType: "book", duration: 30 },
        { userId: "user1", itemType: "product", itemId: product1.id.toString(), actionType: "purchase", duration: 45 }
      ]
    });
    await prisma.recommendation.createMany({
      data: [
        { userId: "traveler1", itemType: "property", itemId: property2.id.toString(), score: 0.82, reason: "Similar to places you viewed", category: "stays" },
        { userId: "user1", itemType: "product", itemId: product2.id.toString(), score: 0.76, reason: "Trending fashion pick", category: "products" }
      ]
    });
    await prisma.similarItem.createMany({
      data: [
        { itemType: "product", itemId: product1.id.toString(), similarItemId: product4.id.toString(), similarity: 0.71 },
        { itemType: "property", itemId: property1.id.toString(), similarItemId: property2.id.toString(), similarity: 0.66 }
      ]
    });

    console.log("🎉 Database seeding completed successfully!");
    console.log("\nTest accounts created:");
    console.log("- Admin: admin@marketplacepro.com / 123456");
    console.log("- Seller: seller@marketplacepro.com / 123456");
    console.log("- User: user@marketplacepro.com / 123456");
    console.log("- Traveler: traveler@marketplacepro.com / 123456");

  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    throw error;
  }
}

// Run the seed function if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSimpleData()
    .then(() => {
      console.log("Seeding finished successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
