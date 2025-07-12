import { db } from './db';
import * as schema from '../shared/schema';
import { hashPassword } from './auth';

export async function seedCompleteData() {
  try {
    console.log('🌱 Starting complete data seeding...');
    
    // Clear existing data in reverse order of dependencies
    await db.delete(schema.reviews);
    await db.delete(schema.cartItems);
    await db.delete(schema.wishlistItems);
    await db.delete(schema.orderItems);
    await db.delete(schema.orders);
    await db.delete(schema.products);
    await db.delete(schema.categories);
    await db.delete(schema.chatMessages);
    await db.delete(schema.chatRooms);
    await db.delete(schema.propertyReviews);
    await db.delete(schema.bookings);
    await db.delete(schema.properties);
    await db.delete(schema.users);

    // Create test users
    const hashedPassword = await hashPassword('123456');
    const users = await db.insert(schema.users).values([
      {
        id: 'admin-001',
        email: 'admin@marketplacepro.com',
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        isVerified: true,
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'seller-001',
        email: 'seller@marketplacepro.com',
        firstName: 'Seller',
        lastName: 'One',
        password: hashedPassword,
        role: 'seller',
        isActive: true,
        isVerified: true,
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b332639e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'user-001',
        email: 'user@marketplacepro.com',
        firstName: 'Regular',
        lastName: 'User',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        isVerified: true,
        profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'traveler-001',
        email: 'traveler@marketplacepro.com',
        firstName: 'Travel',
        lastName: 'Enthusiast',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        isVerified: true,
        profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    ]);

    // Create categories
    const categories = await db.insert(schema.categories).values([
      { name: 'Điện tử', slug: 'dien-tu', description: 'Thiết bị điện tử và công nghệ' },
      { name: 'Thời trang', slug: 'thoi-trang', description: 'Quần áo và phụ kiện' },
      { name: 'Nhà cửa & Vườn', slug: 'nha-cua-vuon', description: 'Đồ dùng gia đình và vườn' },
      { name: 'Thể thao', slug: 'the-thao', description: 'Dụng cụ thể thao và giải trí' },
      { name: 'Ô tô', slug: 'o-to', description: 'Phụ kiện và dụng cụ ô tô' },
      { name: 'Đồ chơi', slug: 'do-choi', description: 'Đồ chơi và trò chơi' },
      { name: 'Thú cưng', slug: 'thu-cung', description: 'Đồ dùng cho thú cưng' },
      { name: 'Thực phẩm', slug: 'thuc-pham', description: 'Thực phẩm và đồ uống' },
      { name: 'Sách', slug: 'sach', description: 'Sách và tài liệu' },
      { name: 'Sức khỏe', slug: 'suc-khoe', description: 'Sản phẩm chăm sóc sức khỏe' },
      { name: 'Đặc sản Việt Nam', slug: 'dac-san-viet-nam', description: 'Sản phẩm truyền thống Việt Nam' },
      { name: 'Văn phòng', slug: 'van-phong', description: 'Đồ dùng văn phòng' },
      { name: 'Nghệ thuật', slug: 'nghe-thuat', description: 'Đồ nghệ thuật và thủ công' }
    ]).returning();

    // Create products
    const products = await db.insert(schema.products).values([
      {
        sellerId: 'seller-001',
        title: 'iPhone 15 Pro Max',
        description: 'iPhone 15 Pro Max mới nhất với chip A17 Pro, camera 48MP và màn hình ProMotion',
        price: '29990000',
        categoryId: categories[0].id,
        images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop'],
        stock: 25,
        status: 'active'
      },
      {
        sellerId: 'seller-001',
        title: 'MacBook Pro 14 inch',
        description: 'MacBook Pro 14 inch với chip M3 Pro, 18GB RAM, 512GB SSD',
        price: '52490000',
        categoryId: categories[0].id,
        images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop'],
        stock: 15,
        status: 'active'
      },
      {
        sellerId: 'seller-001',
        title: 'Áo Dài Tơ Tằm',
        description: 'Áo dài tơ tằm cao cấp, thêu tay tinh xảo, màu đỏ truyền thống',
        price: '2500000',
        categoryId: categories[10].id,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop'],
        stock: 8,
        status: 'active'
      },
      {
        sellerId: 'seller-001',
        title: 'Nước Mắm Phú Quốc',
        description: 'Nước mắm Phú Quốc nguyên chất, độ đạm 40°N, chai 500ml',
        price: '285000',
        categoryId: categories[7].id,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop'],
        stock: 50,
        status: 'active'
      },
      {
        sellerId: 'seller-001',
        title: 'Cà Phê Robusta Đak Lak',
        description: 'Cà phê Robusta nguyên chất từ Đak Lak, rang mộc, gói 500g',
        price: '180000',
        categoryId: categories[7].id,
        images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop'],
        stock: 100,
        status: 'active'
      }
    ]).returning();

    // Create sample reviews
    const reviews = await db.insert(schema.reviews).values([
      {
        userId: 'user-001',
        productId: products[0].id,
        rating: 5,
        comment: 'iPhone 15 Pro Max chất lượng tuyệt vời, camera đẹp, pin trâu!'
      },
      {
        userId: 'traveler-001',
        productId: products[1].id,
        rating: 4,
        comment: 'MacBook Pro hiệu năng mạnh mẽ, phù hợp cho công việc thiết kế'
      },
      {
        userId: 'user-001',
        productId: products[2].id,
        rating: 5,
        comment: 'Áo dài đẹp lắm, chất liệu tơ tằm mềm mại, may công phu'
      }
    ]).returning();

    // Create sample properties
    const properties = await db.insert(schema.properties).values([
      {
        hostId: 'seller-001',
        title: 'Villa biển Vũng Tàu',
        description: 'Villa sang trọng view biển, phù hợp cho gia đình và nhóm bạn',
        address: '123 Thùy Vân, Vũng Tàu',
        city: 'Vũng Tàu',
        state: 'Bà Rịa - Vũng Tàu',
        country: 'Vietnam',
        zipCode: '78000',
        latitude: 10.3460,
        longitude: 107.0843,
        propertyType: 'Villa',
        roomType: 'Toàn bộ nhà',
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        pricePerNight: 3500000,
        cleaningFee: 300000,
        serviceFee: 250000,
        amenities: ['Wifi', 'Bể bơi', 'Bãi đậu xe', 'Điều hòa', 'Bếp', 'Máy giặt'],
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop'],
        houseRules: ['Không hút thuốc', 'Không thú cưng', 'Không tiệc tùng'],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        minimumNights: 2,
        maximumNights: 14,
        instantBook: true,
        isActive: true,
        rating: 4.9,
        reviewCount: 67
      },
      {
        hostId: 'seller-001',
        title: 'Homestay Hội An cổ kính',
        description: 'Nhà cổ truyền thống trong lòng phố cổ Hội An',
        address: '45 Trần Phú, Hội An',
        city: 'Hội An',
        state: 'Quảng Nam',
        country: 'Vietnam',
        zipCode: '560000',
        latitude: 15.8801,
        longitude: 108.3380,
        propertyType: 'Nhà riêng',
        roomType: 'Toàn bộ nhà',
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        pricePerNight: 1200000,
        cleaningFee: 150000,
        serviceFee: 100000,
        amenities: ['Wifi', 'Điều hòa', 'Bếp', 'Xe đạp miễn phí'],
        images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&h=300&fit=crop'],
        houseRules: ['Không hút thuốc', 'Giữ yên lặng sau 22:00'],
        checkInTime: '14:00',
        checkOutTime: '12:00',
        minimumNights: 1,
        maximumNights: 7,
        instantBook: false,
        isActive: true,
        rating: 4.7,
        reviewCount: 43
      }
    ]).returning();

    // Create sample bookings
    const bookings = await db.insert(schema.bookings).values([
      {
        userId: 'user-001',
        propertyId: properties[0].id,
        checkInDate: new Date('2025-08-15'),
        checkOutDate: new Date('2025-08-18'),
        guests: 4,
        totalNights: 3,
        pricePerNight: 3500000,
        subtotal: 10500000,
        cleaningFee: 300000,
        serviceFee: 250000,
        total: 11050000,
        status: 'confirmed',
        specialRequests: 'Phòng view biển, giường đôi'
      },
      {
        userId: 'traveler-001',
        propertyId: properties[1].id,
        checkInDate: new Date('2025-09-01'),
        checkOutDate: new Date('2025-09-03'),
        guests: 2,
        totalNights: 2,
        pricePerNight: 1200000,
        subtotal: 2400000,
        cleaningFee: 150000,
        serviceFee: 100000,
        total: 2650000,
        status: 'confirmed',
        specialRequests: 'Xe đạp cho 2 người'
      }
    ]).returning();

    // Create sample chat rooms
    const chatRooms = await db.insert(schema.chatRooms).values([
      {
        customerId: 'user-001',
        supportAgentId: 'admin-001',
        title: 'Hỗ trợ đơn hàng #001',
        status: 'active',
        priority: 'medium',
        category: 'order_support'
      },
      {
        customerId: 'traveler-001',
        title: 'Tư vấn tour du lịch',
        status: 'waiting',
        priority: 'low',
        category: 'travel_inquiry'
      }
    ]).returning();

    // Create sample chat messages
    const chatMessages = await db.insert(schema.chatMessages).values([
      {
        roomId: chatRooms[0].id,
        senderId: 'user-001',
        message: 'Chào bạn, tôi cần hỗ trợ về đơn hàng iPhone 15 Pro Max',
        messageType: 'text',
        isRead: true
      },
      {
        roomId: chatRooms[0].id,
        senderId: 'admin-001',
        message: 'Chào anh/chị! Tôi sẽ hỗ trợ anh/chị ngay. Vui lòng cho tôi biết mã đơn hàng.',
        messageType: 'text',
        isRead: false
      },
      {
        roomId: chatRooms[1].id,
        senderId: 'traveler-001',
        message: 'Tôi muốn tư vấn về tour Sapa 4 ngày 3 đêm',
        messageType: 'text',
        isRead: false
      }
    ]).returning();

    // Create sample cart items
    const cartItems = await db.insert(schema.cartItems).values([
      {
        userId: 'user-001',
        productId: products[0].id,
        quantity: 1
      },
      {
        userId: 'traveler-001',
        productId: products[2].id,
        quantity: 2
      }
    ]).returning();

    // Create sample wishlist items
    const wishlistItems = await db.insert(schema.wishlistItems).values([
      {
        userId: 'user-001',
        productId: products[1].id
      },
      {
        userId: 'traveler-001',
        productId: products[3].id
      }
    ]).returning();

    console.log('✅ Complete data seeding completed successfully!');
    console.log('Created:');
    console.log('- 4 users (admin, seller, user, traveler)');
    console.log('- 13 categories');
    console.log('- 5 products with Vietnamese specialties');
    console.log('- 3 product reviews');
    console.log('- 2 properties (Villa & Homestay)');
    console.log('- 2 property bookings');
    console.log('- 2 chat rooms and 3 messages');
    console.log('- 2 cart items and 2 wishlist items');
    console.log('');
    console.log('Test accounts:');
    console.log('- Admin: admin@marketplacepro.com / 123456');
    console.log('- Seller: seller@marketplacepro.com / 123456');
    console.log('- User: user@marketplacepro.com / 123456');
    console.log('- Traveler: traveler@marketplacepro.com / 123456');

  } catch (error) {
    console.error('Error seeding complete data:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
seedCompleteData()
  .catch(console.error)
  .finally(() => process.exit(0));

    // Create travel itineraries
    const travelItineraries = await prisma.travelItinerary.createMany({
      data: [
        {
          userId: 'traveler-001',
          title: 'Kỳ nghỉ Phú Quốc 5 ngày',
          description: 'Nghỉ dưỡng tại đảo ngọc Phú Quốc với bãi biển tuyệt đẹp',
          destination: 'Phú Quốc',
          startDate: new Date('2025-08-10'),
          endDate: new Date('2025-08-14'),
          duration: 5,
          budget: 12000000,
          currency: 'VND',
          travelStyle: 'Beach',
          groupSize: 2,
          interests: ['Biển', 'Nghỉ dưỡng', 'Hải sản'],
          isPublic: false,
          status: 'active'
        },
        {
          userId: 'traveler-001',
          title: 'Khám phá Đà Lạt 4 ngày',
          description: 'Tour khám phá thành phố ngàn hoa với khí hậu mát mẻ',
          destination: 'Đà Lạt',
          startDate: new Date('2025-09-01'),
          endDate: new Date('2025-09-04'),
          duration: 4,
          budget: 6000000,
          currency: 'VND',
          travelStyle: 'Nature',
          groupSize: 4,
          interests: ['Thiên nhiên', 'Khí hậu mát mẻ', 'Cảnh quan'],
          isPublic: true,
          status: 'planning'
        }
      ]
    });

    // Create itinerary days
    const itineraryDays = await prisma.itineraryDay.createMany({
      data: [
        {
          itineraryId: 1,
          dayNumber: 1,
          date: new Date('2025-08-10'),
          title: 'Ngày 1: Khám phá Dương Đông',
          description: 'Tham quan trung tâm Dương Đông và chợ đêm',
          budget: 1500000
        },
        {
          itineraryId: 1,
          dayNumber: 2,
          date: new Date('2025-08-11'),
          title: 'Ngày 2: Bãi Sao - Cáp treo Hòn Thơm',
          description: 'Tắm biển tại bãi Sao và trải nghiệm cáp treo',
          budget: 2000000
        },
        {
          itineraryId: 2,
          dayNumber: 1,
          date: new Date('2025-09-01'),
          title: 'Ngày 1: Hồ Xuân Hương - Chợ Đà Lạt',
          description: 'Dạo quanh hồ Xuân Hương và mua sắm tại chợ',
          budget: 800000
        }
      ]
    });

    // Create itinerary activities
    const itineraryActivities = await prisma.itineraryActivity.createMany({
      data: [
        {
          dayId: 1,
          title: 'Check-in khách sạn',
          description: 'Nhận phòng tại khách sạn 4 sao trung tâm Dương Đông',
          location: 'Dương Đông, Phú Quốc',
          address: '123 Trần Hưng Đạo, Dương Đông',
          startTime: '14:00',
          endTime: '15:00',
          duration: 60,
          cost: 0,
          category: 'Lưu trú',
          priority: 1,
          isBooked: true,
          bookingReference: 'PQ2025001'
        },
        {
          dayId: 1,
          title: 'Tham quan chợ đêm Dương Đông',
          description: 'Thưởng thức hải sản tươi sống và mua sắm đặc sản',
          location: 'Chợ đêm Dương Đông',
          address: 'Võ Thị Sáu, Dương Đông',
          startTime: '19:00',
          endTime: '22:00',
          duration: 180,
          cost: 800000,
          category: 'Ẩm thực',
          priority: 2,
          isBooked: false,
          notes: 'Nên thử ghẹ nướng và ếch nướng'
        }
      ]
    });

    // Create reviews
    const reviews = await prisma.review.createMany({
      data: [
        {
          userId: 'user-001',
          productId: 1,
          rating: 5,
          comment: 'iPhone 15 Pro Max chất lượng tuyệt vời, camera đẹp, pin trâu!'
        },
        {
          userId: 'traveler-001',
          productId: 2,
          rating: 4,
          comment: 'MacBook Pro hiệu năng mạnh mẽ, phù hợp cho công việc thiết kế'
        }
      ]
    });

    // Create bookings
    const bookings = await prisma.booking.createMany({
      data: [
        {
          userId: 'user-001',
          propertyId: 1,
          checkInDate: new Date('2025-08-15'),
          checkOutDate: new Date('2025-08-18'),
          guests: 4,
          totalNights: 3,
          pricePerNight: 3500000,
          subtotal: 10500000,
          cleaningFee: 300000,
          serviceFee: 250000,
          total: 11050000,
          status: 'confirmed',
          specialRequests: 'Phòng view biển, giường đôi'
        }
      ]
    });

    // Create travel bookings
    const travelBookings = await prisma.travelBooking.createMany({
      data: [
        {
          userId: 'traveler-001',
          bookingType: 'flight',
          referenceId: 'VN201',
          bookingDate: new Date('2025-07-20'),
          travelDate: new Date('2025-08-01'),
          passengers: 2,
          totalAmount: 5000000,
          currency: 'VND',
          status: 'confirmed',
          paymentStatus: 'paid',
          contactInfo: {
            email: 'traveler@marketplacepro.com',
            phone: '0901234567'
          }
        },
        {
          userId: 'traveler-001',
          bookingType: 'tour',
          referenceId: 'HALONG_3D2N',
          bookingDate: new Date('2025-07-25'),
          travelDate: new Date('2025-08-01'),
          passengers: 2,
          totalAmount: 5000000,
          currency: 'VND',
          status: 'confirmed',
          paymentStatus: 'paid',
          contactInfo: {
            email: 'traveler@marketplacepro.com',
            phone: '0901234567'
          }
        }
      ]
    });

    // Create travel reviews
    const travelReviews = await prisma.travelReview.createMany({
      data: [
        {
          userId: 'traveler-001',
          bookingId: 1,
          bookingType: 'flight',
          rating: 5,
          comment: 'Chuyến bay đúng giờ, dịch vụ tuyệt vời, tiếp viên thân thiện',
          serviceRating: 5,
          valueRating: 4,
          cleanlinessRating: 5
        },
        {
          userId: 'traveler-001',
          bookingId: 2,
          bookingType: 'tour',
          rating: 4,
          comment: 'Tour Hạ Long rất đẹp, hướng dẫn viên nhiệt tình, thức ăn ngon',
          serviceRating: 4,
          valueRating: 4,
          cleanlinessRating: 4
        }
      ]
    });

    // Create chat rooms
    const chatRooms = await prisma.chatRoom.createMany({
      data: [
        {
          customerId: 'user-001',
          supportAgentId: 'admin-001',
          title: 'Hỗ trợ đơn hàng #001',
          status: 'active',
          priority: 'medium',
          category: 'order_support'
        },
        {
          customerId: 'traveler-001',
          title: 'Tư vấn tour du lịch',
          status: 'waiting',
          priority: 'low',
          category: 'travel_inquiry'
        }
      ]
    });

    // Create chat messages
    const chatMessages = await prisma.chatMessage.createMany({
      data: [
        {
          roomId: 1,
          senderId: 'user-001',
          message: 'Chào bạn, tôi cần hỗ trợ về đơn hàng iPhone 15 Pro Max',
          messageType: 'text',
          isRead: true
        },
        {
          roomId: 1,
          senderId: 'admin-001',
          message: 'Chào anh/chị! Tôi sẽ hỗ trợ anh/chị ngay. Vui lòng cho tôi biết mã đơn hàng.',
          messageType: 'text',
          isRead: false
        },
        {
          roomId: 2,
          senderId: 'traveler-001',
          message: 'Tôi muốn tư vấn về tour Sapa 4 ngày 3 đêm',
          messageType: 'text',
          isRead: false
        }
      ]
    });

    console.log('✅ Complete data seeding completed successfully!');
    console.log('Created:');
    console.log('- 4 users (admin, seller, user, traveler)');
    console.log('- 13 categories');
    console.log('- 5 products with Vietnamese specialties');
    console.log('- 3 airlines, 4 airports, 3 flights');
    console.log('- 3 transport operators, 3 stations, 2 routes');
    console.log('- 2 tours with schedules');
    console.log('- 2 properties (Villa & Homestay)');
    console.log('- 2 itinerary templates');
    console.log('- 2 travel itineraries with days and activities');
    console.log('- Reviews, bookings, and travel reviews');
    console.log('- Chat rooms and messages');
    console.log('');
    console.log('Test accounts:');
    console.log('- Admin: admin@marketplacepro.com / admin123');
    console.log('- Seller: seller@marketplacepro.com / seller123');
    console.log('- User: user@marketplacepro.com / user123');
    console.log('- Traveler: traveler@marketplacepro.com / traveler123');

  } catch (error) {
    console.error('Error seeding complete data:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
seedCompleteData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());