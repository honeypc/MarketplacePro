import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Airlines table
export const airlines = pgTable("airlines", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  logo: varchar("logo", { length: 500 }),
  country: varchar("country", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Airports table
export const airports = pgTable("airports", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  timezone: varchar("timezone", { length: 50 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Flights table
export const flights = pgTable("flights", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  airlineId: integer("airline_id").references(() => airlines.id),
  flightNumber: varchar("flight_number", { length: 20 }).notNull(),
  departureAirportId: integer("departure_airport_id").references(() => airports.id),
  arrivalAirportId: integer("arrival_airport_id").references(() => airports.id),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  duration: integer("duration"), // in minutes
  aircraft: varchar("aircraft", { length: 100 }),
  economyPrice: decimal("economy_price", { precision: 10, scale: 2 }),
  businessPrice: decimal("business_price", { precision: 10, scale: 2 }),
  firstClassPrice: decimal("first_class_price", { precision: 10, scale: 2 }),
  economySeats: integer("economy_seats").default(0),
  businessSeats: integer("business_seats").default(0),
  firstClassSeats: integer("first_class_seats").default(0),
  availableSeats: integer("available_seats").default(0),
  status: varchar("status", { length: 50 }).default("scheduled"), // scheduled, delayed, cancelled, completed
  baggage: jsonb("baggage"), // baggage allowance details
  amenities: jsonb("amenities"), // flight amenities
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bus/Train operators table
export const transportOperators = pgTable("transport_operators", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // bus, train, ferry
  logo: varchar("logo", { length: 500 }),
  country: varchar("country", { length: 100 }),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stations table (for bus/train)
export const stations = pgTable("stations", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }).unique(),
  city: varchar("city", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  type: varchar("type", { length: 50 }).notNull(), // bus_station, train_station, ferry_terminal
  facilities: jsonb("facilities"), // waiting room, parking, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transport routes table
export const transportRoutes = pgTable("transport_routes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  operatorId: integer("operator_id").references(() => transportOperators.id),
  routeNumber: varchar("route_number", { length: 20 }),
  departureStationId: integer("departure_station_id").references(() => stations.id),
  arrivalStationId: integer("arrival_station_id").references(() => stations.id),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  duration: integer("duration"), // in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  businessPrice: decimal("business_price", { precision: 10, scale: 2 }),
  vehicleType: varchar("vehicle_type", { length: 100 }), // AC Bus, Executive, etc.
  totalSeats: integer("total_seats").default(0),
  availableSeats: integer("available_seats").default(0),
  facilities: jsonb("facilities"), // wifi, charging, meals, etc.
  operatingDays: jsonb("operating_days"), // [1,2,3,4,5,6,7] for days of week
  status: varchar("status", { length: 50 }).default("active"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tours table
export const tours = pgTable("tours", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  providerId: varchar("provider_id", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  destination: varchar("destination", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  duration: integer("duration").notNull(), // in days
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("VND"),
  maxGuests: integer("max_guests").default(20),
  minGuests: integer("min_guests").default(1),
  difficulty: varchar("difficulty", { length: 50 }), // easy, moderate, challenging
  category: varchar("category", { length: 100 }).notNull(), // cultural, adventure, beach, etc.
  images: jsonb("images"), // array of image URLs
  inclusions: jsonb("inclusions"), // what's included
  exclusions: jsonb("exclusions"), // what's not included
  itinerary: jsonb("itinerary"), // day-by-day itinerary
  highlights: jsonb("highlights"), // tour highlights
  meetingPoint: text("meeting_point"),
  cancellationPolicy: text("cancellation_policy"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default(0),
  reviewCount: integer("review_count").default(0),
  isInstantConfirm: boolean("is_instant_confirm").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tour schedules table
export const tourSchedules = pgTable("tour_schedules", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  tourId: integer("tour_id").references(() => tours.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  availableSpots: integer("available_spots").default(0),
  totalSpots: integer("total_spots").default(0),
  status: varchar("status", { length: 50 }).default("available"), // available, sold_out, cancelled
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Travel bookings table
export const travelBookings = pgTable("travel_bookings", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id", { length: 100 }).notNull(),
  bookingType: varchar("booking_type", { length: 50 }).notNull(), // flight, transport, tour, hotel
  referenceId: integer("reference_id").notNull(), // ID of flight, transport, tour, etc.
  scheduleId: integer("schedule_id"), // for tours
  bookingNumber: varchar("booking_number", { length: 50 }).notNull().unique(),
  passengerDetails: jsonb("passenger_details").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("VND"),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  bookingStatus: varchar("booking_status", { length: 50 }).default("confirmed"),
  travelDate: timestamp("travel_date").notNull(),
  returnDate: timestamp("return_date"),
  contactInfo: jsonb("contact_info").notNull(),
  specialRequests: text("special_requests"),
  cancellationReason: text("cancellation_reason"),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  checkInStatus: varchar("check_in_status", { length: 50 }).default("pending"),
  qrCode: text("qr_code"), // for mobile tickets
  eTicket: text("e_ticket"), // ticket URL/reference
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Travel booking passengers table
export const travelBookingPassengers = pgTable("travel_booking_passengers", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  bookingId: integer("booking_id").references(() => travelBookings.id),
  title: varchar("title", { length: 10 }).notNull(), // Mr, Mrs, Ms, etc.
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  nationality: varchar("nationality", { length: 100 }),
  passportNumber: varchar("passport_number", { length: 50 }),
  seatNumber: varchar("seat_number", { length: 10 }),
  mealPreference: varchar("meal_preference", { length: 100 }),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Travel reviews table
export const travelReviews = pgTable("travel_reviews", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  bookingId: integer("booking_id").references(() => travelBookings.id),
  userId: varchar("user_id", { length: 100 }).notNull(),
  bookingType: varchar("booking_type", { length: 50 }).notNull(),
  referenceId: integer("reference_id").notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  comment: text("comment"),
  images: jsonb("images"), // review images
  serviceRating: integer("service_rating"), // 1-5
  valueRating: integer("value_rating"), // 1-5
  comfortRating: integer("comfort_rating"), // 1-5
  isVerified: boolean("is_verified").default(false),
  isRecommended: boolean("is_recommended"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Indexes for performance
export const flightIndexes = [
  index("flights_departure_airport_idx").on(flights.departureAirportId),
  index("flights_arrival_airport_idx").on(flights.arrivalAirportId),
  index("flights_departure_time_idx").on(flights.departureTime),
  index("flights_airline_idx").on(flights.airlineId),
];

export const transportRouteIndexes = [
  index("transport_routes_departure_station_idx").on(transportRoutes.departureStationId),
  index("transport_routes_arrival_station_idx").on(transportRoutes.arrivalStationId),
  index("transport_routes_departure_time_idx").on(transportRoutes.departureTime),
  index("transport_routes_operator_idx").on(transportRoutes.operatorId),
];

export const tourIndexes = [
  index("tours_destination_idx").on(tours.destination),
  index("tours_country_idx").on(tours.country),
  index("tours_category_idx").on(tours.category),
  index("tours_price_idx").on(tours.price),
];

export const travelBookingIndexes = [
  index("travel_bookings_user_idx").on(travelBookings.userId),
  index("travel_bookings_booking_number_idx").on(travelBookings.bookingNumber),
  index("travel_bookings_travel_date_idx").on(travelBookings.travelDate),
  index("travel_bookings_type_idx").on(travelBookings.bookingType),
];

// Zod schemas
export const insertAirlineSchema = createInsertSchema(airlines);
export const insertAirportSchema = createInsertSchema(airports);
export const insertFlightSchema = createInsertSchema(flights);
export const insertTransportOperatorSchema = createInsertSchema(transportOperators);
export const insertStationSchema = createInsertSchema(stations);
export const insertTransportRouteSchema = createInsertSchema(transportRoutes);
export const insertTourSchema = createInsertSchema(tours);
export const insertTourScheduleSchema = createInsertSchema(tourSchedules);
export const insertTravelBookingSchema = createInsertSchema(travelBookings);
export const insertTravelBookingPassengerSchema = createInsertSchema(travelBookingPassengers);
export const insertTravelReviewSchema = createInsertSchema(travelReviews);

// Types
export type Airline = typeof airlines.$inferSelect;
export type Airport = typeof airports.$inferSelect;
export type Flight = typeof flights.$inferSelect;
export type TransportOperator = typeof transportOperators.$inferSelect;
export type Station = typeof stations.$inferSelect;
export type TransportRoute = typeof transportRoutes.$inferSelect;
export type Tour = typeof tours.$inferSelect;
export type TourSchedule = typeof tourSchedules.$inferSelect;
export type TravelBooking = typeof travelBookings.$inferSelect;
export type TravelBookingPassenger = typeof travelBookingPassengers.$inferSelect;
export type TravelReview = typeof travelReviews.$inferSelect;

export type InsertAirline = z.infer<typeof insertAirlineSchema>;
export type InsertAirport = z.infer<typeof insertAirportSchema>;
export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type InsertTransportOperator = z.infer<typeof insertTransportOperatorSchema>;
export type InsertStation = z.infer<typeof insertStationSchema>;
export type InsertTransportRoute = z.infer<typeof insertTransportRouteSchema>;
export type InsertTour = z.infer<typeof insertTourSchema>;
export type InsertTourSchedule = z.infer<typeof insertTourScheduleSchema>;
export type InsertTravelBooking = z.infer<typeof insertTravelBookingSchema>;
export type InsertTravelBookingPassenger = z.infer<typeof insertTravelBookingPassengerSchema>;
export type InsertTravelReview = z.infer<typeof insertTravelReviewSchema>;