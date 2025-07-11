import { storage } from './storage-prisma';

export async function seedPropertyData() {
  console.log('Seeding property data...');
  
  try {
    // Sample property data
    const properties = [
      {
        hostId: 'admin-001',
        title: 'Căn hộ cao cấp view biển Nha Trang',
        description: 'Căn hộ 2 phòng ngủ hiện đại với view biển tuyệt đẹp, đầy đủ tiện nghi. Gần bãi biển và trung tâm thành phố.',
        propertyType: 'apartment',
        roomType: 'entire_place',
        address: '123 Đường Trần Phú',
        city: 'Nha Trang',
        country: 'Việt Nam',
        zipCode: '650000',
        latitude: 12.2388,
        longitude: 109.1967,
        pricePerNight: 1200000,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['wifi', 'ac', 'kitchen', 'pool', 'parking'],
        images: [
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
        ],
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cleaningFee: 200000,
        serviceFee: 150000,
        rating: 4.8,
        reviewCount: 24,
        isInstantBook: true,
        minimumStay: 2,
        maximumStay: 30,
        isActive: true
      },
      {
        hostId: 'seller-001',
        title: 'Villa sang trọng tại Đà Lạt',
        description: 'Villa 3 phòng ngủ sang trọng với khu vườn riêng, lò sưởi ấm cúng. Thích hợp cho gia đình và nhóm bạn.',
        propertyType: 'villa',
        roomType: 'entire_place',
        address: '456 Đường Hoa Hồng',
        city: 'Đà Lạt',
        country: 'Việt Nam',
        zipCode: '670000',
        latitude: 11.9404,
        longitude: 108.4583,
        pricePerNight: 2500000,
        maxGuests: 8,
        bedrooms: 3,
        bathrooms: 3,
        amenities: ['wifi', 'fireplace', 'kitchen', 'parking', 'tv', 'washing_machine'],
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1616593781171-f9c86e098d32?w=800&h=600&fit=crop'
        ],
        checkInTime: '15:00',
        checkOutTime: '12:00',
        cleaningFee: 300000,
        serviceFee: 200000,
        rating: 4.9,
        reviewCount: 18,
        isInstantBook: false,
        minimumStay: 3,
        maximumStay: 14,
        isActive: true
      },
      {
        hostId: 'user-001',
        title: 'Homestay ấm cúng tại Sapa',
        description: 'Homestay truyền thống với không gian ấm cúng, view núi đá hùng vĩ. Trải nghiệm văn hóa dân tộc địa phương.',
        propertyType: 'house',
        roomType: 'private_room',
        address: '789 Thôn Tả Van',
        city: 'Sapa',
        country: 'Việt Nam',
        zipCode: '331000',
        latitude: 22.3380,
        longitude: 103.8442,
        pricePerNight: 800000,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['wifi', 'fireplace', 'kitchen', 'tv'],
        images: [
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800&h=600&fit=crop'
        ],
        checkInTime: '14:00',
        checkOutTime: '10:00',
        cleaningFee: 100000,
        serviceFee: 80000,
        rating: 4.7,
        reviewCount: 32,
        isInstantBook: true,
        minimumStay: 1,
        maximumStay: 7,
        isActive: true
      },
      {
        hostId: 'admin-001',
        title: 'Studio hiện đại tại Quận 1, TP.HCM',
        description: 'Studio tiện nghi ngay trung tâm thành phố, gần Ben Thanh Market và Nguyen Hue Walking Street.',
        propertyType: 'studio',
        roomType: 'entire_place',
        address: '101 Đường Lê Lợi',
        city: 'Hồ Chí Minh',
        country: 'Việt Nam',
        zipCode: '700000',
        latitude: 10.7769,
        longitude: 106.7009,
        pricePerNight: 900000,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ['wifi', 'ac', 'kitchen', 'tv', 'washing_machine'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop'
        ],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        cleaningFee: 150000,
        serviceFee: 100000,
        rating: 4.6,
        reviewCount: 41,
        isInstantBook: true,
        minimumStay: 1,
        maximumStay: 30,
        isActive: true
      },
      {
        hostId: 'seller-001',
        title: 'Resort bungalow tại Phú Quốc',
        description: 'Bungalow riêng biệt với bãi biển tư nhân, hoàn hảo cho kỳ nghỉ lãng mạn. Dịch vụ spa và nhà hàng cao cấp.',
        propertyType: 'resort',
        roomType: 'entire_place',
        address: '234 Bãi Trường',
        city: 'Phú Quốc',
        country: 'Việt Nam',
        zipCode: '920000',
        latitude: 10.2899,
        longitude: 103.9840,
        pricePerNight: 3500000,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['wifi', 'ac', 'pool', 'gym', 'tv', 'kitchen'],
        images: [
          'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
        ],
        checkInTime: '16:00',
        checkOutTime: '12:00',
        cleaningFee: 400000,
        serviceFee: 300000,
        rating: 4.95,
        reviewCount: 67,
        isInstantBook: false,
        minimumStay: 2,
        maximumStay: 10,
        isActive: true
      },
      {
        hostId: 'user-001',
        title: 'Căn hộ view hồ tại Hà Nội',
        description: 'Căn hộ 2 phòng ngủ với view Hồ Gươm tuyệt đẹp, gần Phố Cổ và các điểm du lịch nổi tiếng.',
        propertyType: 'apartment',
        roomType: 'entire_place',
        address: '567 Phố Hàng Khay',
        city: 'Hà Nội',
        country: 'Việt Nam',
        zipCode: '100000',
        latitude: 21.0285,
        longitude: 105.8542,
        pricePerNight: 1800000,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['wifi', 'ac', 'kitchen', 'tv', 'washing_machine', 'parking'],
        images: [
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
        ],
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cleaningFee: 200000,
        serviceFee: 150000,
        rating: 4.7,
        reviewCount: 29,
        isInstantBook: true,
        minimumStay: 2,
        maximumStay: 21,
        isActive: true
      }
    ];

    // Create properties
    for (const propertyData of properties) {
      await storage.createProperty(propertyData);
    }

    console.log(`✓ Created ${properties.length} properties`);

    // Sample property reviews
    const propertyReviews = [
      {
        propertyId: 1,
        guestId: 'user-001',
        hostId: 'admin-001',
        rating: 5,
        cleanliness: 5,
        communication: 5,
        checkIn: 5,
        accuracy: 5,
        location: 5,
        value: 4,
        comment: 'Căn hộ rất đẹp và sạch sẽ. View biển tuyệt vời! Chủ nhà nhiệt tình và thân thiện. Sẽ quay lại lần sau.',
        createdAt: new Date('2024-01-15')
      },
      {
        propertyId: 2,
        guestId: 'user-002',
        hostId: 'seller-001',
        rating: 5,
        cleanliness: 5,
        communication: 5,
        checkIn: 4,
        accuracy: 5,
        location: 5,
        value: 5,
        comment: 'Villa rất đẹp và yên tĩnh. Không gian rộng rãi, phù hợp cho gia đình. Đà Lạt thật tuyệt vời!',
        createdAt: new Date('2024-01-20')
      },
      {
        propertyId: 3,
        guestId: 'admin-001',
        hostId: 'user-001',
        rating: 4,
        cleanliness: 4,
        communication: 5,
        checkIn: 5,
        accuracy: 4,
        location: 5,
        value: 4,
        comment: 'Trải nghiệm homestay rất thú vị. Chủ nhà dễ thương, giúp tôi hiểu thêm về văn hóa địa phương.',
        createdAt: new Date('2024-01-25')
      },
      {
        propertyId: 4,
        guestId: 'seller-001',
        hostId: 'admin-001',
        rating: 4,
        cleanliness: 5,
        communication: 4,
        checkIn: 4,
        accuracy: 4,
        location: 5,
        value: 4,
        comment: 'Vị trí thuận tiện, gần trung tâm. Studio nhỏ nhưng đầy đủ tiện nghi. Phù hợp cho chuyến công tác.',
        createdAt: new Date('2024-02-01')
      },
      {
        propertyId: 5,
        guestId: 'user-003',
        hostId: 'seller-001',
        rating: 5,
        cleanliness: 5,
        communication: 5,
        checkIn: 5,
        accuracy: 5,
        location: 5,
        value: 5,
        comment: 'Kỳ nghỉ trong mơ! Bungalow rất sang trọng, dịch vụ hoàn hảo. Bãi biển riêng thật tuyệt vời.',
        createdAt: new Date('2024-02-10')
      }
    ];

    // Create property reviews
    for (const reviewData of propertyReviews) {
      await storage.createPropertyReview(reviewData);
    }

    console.log(`✓ Created ${propertyReviews.length} property reviews`);

    // Sample bookings
    const bookings = [
      {
        propertyId: 1,
        guestId: 'user-001',
        hostId: 'admin-001',
        checkInDate: new Date('2024-03-15'),
        checkOutDate: new Date('2024-03-18'),
        guests: 2,
        nights: 3,
        totalPrice: 3600000,
        status: 'confirmed',
        specialRequests: 'Muốn check-in sớm nếu có thể'
      },
      {
        propertyId: 2,
        guestId: 'user-002',
        hostId: 'seller-001',
        checkInDate: new Date('2024-03-20'),
        checkOutDate: new Date('2024-03-25'),
        guests: 6,
        nights: 5,
        totalPrice: 12500000,
        status: 'confirmed',
        specialRequests: 'Có trẻ em, cần giường phụ'
      },
      {
        propertyId: 3,
        guestId: 'admin-001',
        hostId: 'user-001',
        checkInDate: new Date('2024-03-10'),
        checkOutDate: new Date('2024-03-12'),
        guests: 2,
        nights: 2,
        totalPrice: 1600000,
        status: 'completed',
        specialRequests: 'Muốn tìm hiểu về văn hóa địa phương'
      },
      {
        propertyId: 4,
        guestId: 'seller-001',
        hostId: 'admin-001',
        checkInDate: new Date('2024-03-25'),
        checkOutDate: new Date('2024-03-27'),
        guests: 1,
        nights: 2,
        totalPrice: 1800000,
        status: 'pending',
        specialRequests: 'Chuyến công tác, cần hóa đơn VAT'
      }
    ];

    // Create bookings
    for (const bookingData of bookings) {
      await storage.createBooking(bookingData);
    }

    console.log(`✓ Created ${bookings.length} bookings`);

    console.log('Property data seeded successfully!');
  } catch (error) {
    console.error('Error seeding property data:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPropertyData().catch(console.error);
}