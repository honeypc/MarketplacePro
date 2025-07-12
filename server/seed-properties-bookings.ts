import { prisma } from './prisma';

export async function seedPropertiesAndBookings() {
  console.log('🏠 Seeding properties and bookings data...');

  try {
    // Delete existing data to prevent duplicates
    await prisma.booking.deleteMany({});
    await prisma.propertyReview.deleteMany({});
    await prisma.property.deleteMany({});
    
    console.log('✅ Cleared existing property and booking data');

    // Create properties
    const properties = await prisma.property.createMany({
      data: [
        {
          hostId: 'admin-001',
          title: 'Luxury Apartment in Ho Chi Minh City Center',
          description: 'Beautiful modern apartment with city views, perfect for business travelers and tourists. Located in the heart of District 1 with easy access to restaurants, shopping, and attractions.',
          propertyType: 'apartment',
          roomType: 'entire_place',
          address: '123 Nguyen Hue Street, District 1',
          city: 'Ho Chi Minh City',
          country: 'Vietnam',
          zipCode: '700000',
          latitude: 10.7769,
          longitude: 106.7009,
          pricePerNight: 85,
          maxGuests: 4,
          bedrooms: 2,
          bathrooms: 2,
          amenities: ['wifi', 'air_conditioning', 'kitchen', 'tv', 'washer', 'elevator', 'parking'],
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
          ],
          checkInTime: '15:00',
          checkOutTime: '11:00',
          cleaningFee: 15,
          serviceFee: 12,
          rating: 4.8,
          reviewCount: 127,
          isInstantBook: true,
          minimumStay: 1,
          maximumStay: 30,
          isActive: true
        },
        {
          hostId: 'seller-001',
          title: 'Cozy Villa in Da Nang Beach',
          description: 'Stunning beachfront villa with private pool and direct beach access. Perfect for families and groups looking for a relaxing getaway by the sea.',
          propertyType: 'villa',
          roomType: 'entire_place',
          address: '456 My Khe Beach, Son Tra District',
          city: 'Da Nang',
          country: 'Vietnam',
          zipCode: '550000',
          latitude: 16.0544,
          longitude: 108.2442,
          pricePerNight: 150,
          maxGuests: 8,
          bedrooms: 4,
          bathrooms: 3,
          amenities: ['wifi', 'air_conditioning', 'kitchen', 'tv', 'washer', 'pool', 'beach_access', 'parking', 'bbq'],
          images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
            'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
          ],
          checkInTime: '14:00',
          checkOutTime: '12:00',
          cleaningFee: 25,
          serviceFee: 20,
          rating: 4.9,
          reviewCount: 89,
          isInstantBook: false,
          minimumStay: 2,
          maximumStay: 14,
          isActive: true
        },
        {
          hostId: 'admin-001',
          title: 'Traditional House in Hanoi Old Quarter',
          description: 'Authentic Vietnamese house in the historic Old Quarter. Experience local culture while staying in comfort with modern amenities.',
          propertyType: 'house',
          roomType: 'entire_place',
          address: '789 Hang Bac Street, Hoan Kiem District',
          city: 'Hanoi',
          country: 'Vietnam',
          zipCode: '100000',
          latitude: 21.0285,
          longitude: 105.8542,
          pricePerNight: 65,
          maxGuests: 6,
          bedrooms: 3,
          bathrooms: 2,
          amenities: ['wifi', 'air_conditioning', 'kitchen', 'tv', 'washer', 'balcony'],
          images: [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
          ],
          checkInTime: '15:00',
          checkOutTime: '11:00',
          cleaningFee: 20,
          serviceFee: 15,
          rating: 4.6,
          reviewCount: 203,
          isInstantBook: true,
          minimumStay: 1,
          maximumStay: 21,
          isActive: true
        },
        {
          hostId: 'seller-001',
          title: 'Modern Studio in Nha Trang',
          description: 'Contemporary studio apartment near Nha Trang Beach. Perfect for couples and solo travelers seeking comfort and convenience.',
          propertyType: 'apartment',
          roomType: 'entire_place',
          address: '321 Tran Phu Street, Nha Trang',
          city: 'Nha Trang',
          country: 'Vietnam',
          zipCode: '650000',
          latitude: 12.2388,
          longitude: 109.1967,
          pricePerNight: 45,
          maxGuests: 2,
          bedrooms: 1,
          bathrooms: 1,
          amenities: ['wifi', 'air_conditioning', 'kitchen', 'tv', 'washer', 'gym', 'elevator'],
          images: [
            'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
            'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800',
            'https://images.unsplash.com/photo-1515263487990-61b07816b5a3?w=800'
          ],
          checkInTime: '16:00',
          checkOutTime: '10:00',
          cleaningFee: 10,
          serviceFee: 8,
          rating: 4.7,
          reviewCount: 156,
          isInstantBook: true,
          minimumStay: 1,
          maximumStay: 7,
          isActive: true
        },
        {
          hostId: 'admin-001',
          title: 'Riverside Homestay in Hoi An',
          description: 'Peaceful homestay by the river with traditional Vietnamese architecture. Experience authentic local life in this UNESCO World Heritage site.',
          propertyType: 'house',
          roomType: 'private_room',
          address: '159 Bach Dang Street, Hoi An',
          city: 'Hoi An',
          country: 'Vietnam',
          zipCode: '560000',
          latitude: 15.8801,
          longitude: 108.3380,
          pricePerNight: 35,
          maxGuests: 3,
          bedrooms: 1,
          bathrooms: 1,
          amenities: ['wifi', 'air_conditioning', 'shared_kitchen', 'tv', 'bike_rental', 'garden'],
          images: [
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
            'https://images.unsplash.com/photo-1581809658106-3b4b9d3e9f6f?w=800'
          ],
          checkInTime: '14:00',
          checkOutTime: '12:00',
          cleaningFee: 8,
          serviceFee: 6,
          rating: 4.5,
          reviewCount: 78,
          isInstantBook: false,
          minimumStay: 2,
          maximumStay: 10,
          isActive: true
        },
        {
          hostId: 'seller-001',
          title: 'Mountain Retreat in Sapa',
          description: 'Escape to the mountains with breathtaking views of terraced rice fields. Perfect for nature lovers and hikers seeking tranquility.',
          propertyType: 'cabin',
          roomType: 'entire_place',
          address: '88 Muong Hoa Valley, Sapa',
          city: 'Sapa',
          country: 'Vietnam',
          zipCode: '330000',
          latitude: 22.3364,
          longitude: 103.8438,
          pricePerNight: 95,
          maxGuests: 6,
          bedrooms: 3,
          bathrooms: 2,
          amenities: ['wifi', 'fireplace', 'kitchen', 'tv', 'hiking_trails', 'mountain_view', 'parking'],
          images: [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
          ],
          checkInTime: '15:00',
          checkOutTime: '11:00',
          cleaningFee: 18,
          serviceFee: 14,
          rating: 4.8,
          reviewCount: 92,
          isInstantBook: true,
          minimumStay: 2,
          maximumStay: 14,
          isActive: true
        }
      ]
    });

    console.log('✅ Created properties');

    // Get property IDs for bookings
    const propertyList = await prisma.property.findMany({
      select: { id: true, hostId: true, pricePerNight: true, cleaningFee: true, serviceFee: true }
    });

    // Create bookings
    const bookings = await prisma.booking.createMany({
      data: [
        {
          propertyId: propertyList[0].id,
          guestId: 'user-001',
          hostId: propertyList[0].hostId,
          checkInDate: new Date('2024-12-15'),
          checkOutDate: new Date('2024-12-18'),
          guests: 2,
          totalAmount: (propertyList[0].pricePerNight * 3) + propertyList[0].cleaningFee + propertyList[0].serviceFee,
          status: 'confirmed',
          paymentStatus: 'paid',
          specialRequests: 'Late check-in preferred'
        },
        {
          propertyId: propertyList[1].id,
          guestId: 'user-002',
          hostId: propertyList[1].hostId,
          checkInDate: new Date('2024-12-20'),
          checkOutDate: new Date('2024-12-25'),
          guests: 4,
          totalAmount: (propertyList[1].pricePerNight * 5) + propertyList[1].cleaningFee + propertyList[1].serviceFee,
          status: 'confirmed',
          paymentStatus: 'paid',
          specialRequests: 'Family with children'
        },
        {
          propertyId: propertyList[2].id,
          guestId: 'admin-001',
          hostId: propertyList[2].hostId,
          checkInDate: new Date('2024-12-10'),
          checkOutDate: new Date('2024-12-14'),
          guests: 3,
          totalAmount: (propertyList[2].pricePerNight * 4) + propertyList[2].cleaningFee + propertyList[2].serviceFee,
          status: 'completed',
          paymentStatus: 'paid'
        },
        {
          propertyId: propertyList[3].id,
          guestId: 'user-001',
          hostId: propertyList[3].hostId,
          checkInDate: new Date('2025-01-05'),
          checkOutDate: new Date('2025-01-08'),
          guests: 2,
          totalAmount: (propertyList[3].pricePerNight * 3) + propertyList[3].cleaningFee + propertyList[3].serviceFee,
          status: 'pending',
          paymentStatus: 'pending'
        },
        {
          propertyId: propertyList[4].id,
          guestId: 'user-002',
          hostId: propertyList[4].hostId,
          checkInDate: new Date('2025-01-15'),
          checkOutDate: new Date('2025-01-18'),
          guests: 2,
          totalAmount: (propertyList[4].pricePerNight * 3) + propertyList[4].cleaningFee + propertyList[4].serviceFee,
          status: 'confirmed',
          paymentStatus: 'paid'
        },
        {
          propertyId: propertyList[5].id,
          guestId: 'admin-001',
          hostId: propertyList[5].hostId,
          checkInDate: new Date('2025-02-01'),
          checkOutDate: new Date('2025-02-05'),
          guests: 4,
          totalAmount: (propertyList[5].pricePerNight * 4) + propertyList[5].cleaningFee + propertyList[5].serviceFee,
          status: 'confirmed',
          paymentStatus: 'paid',
          specialRequests: 'Vegetarian meals preferred'
        }
      ]
    });

    console.log('✅ Created bookings');

    // Create property reviews
    const bookingList = await prisma.booking.findMany({
      where: { status: 'completed' },
      select: { id: true, propertyId: true, guestId: true, hostId: true }
    });

    if (bookingList.length > 0) {
      await prisma.propertyReview.createMany({
        data: [
          {
            propertyId: bookingList[0].propertyId,
            bookingId: bookingList[0].id,
            guestId: bookingList[0].guestId,
            hostId: bookingList[0].hostId,
            rating: 5,
            comment: 'Amazing location in the heart of the city! The apartment was exactly as described and the host was very responsive. Would definitely stay again.',
            cleanliness: 5,
            communication: 5,
            checkIn: 5,
            accuracy: 5,
            location: 5,
            value: 4
          }
        ]
      });
      console.log('✅ Created property reviews');
    }

    // Get counts
    const propertyCount = await prisma.property.count();
    const bookingCount = await prisma.booking.count();
    const reviewCount = await prisma.propertyReview.count();

    console.log(`✅ Seeding completed successfully!`);
    console.log(`📊 Created ${propertyCount} properties`);
    console.log(`📊 Created ${bookingCount} bookings`);
    console.log(`📊 Created ${reviewCount} property reviews`);

    return { propertyCount, bookingCount, reviewCount };
  } catch (error) {
    console.error('❌ Error seeding properties and bookings:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPropertiesAndBookings()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}