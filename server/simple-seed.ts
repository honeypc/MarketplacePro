import { db } from './db';
import * as schema from '../shared/schema';
import { hashPassword } from './auth';

export async function seedSimpleData() {
  try {
    console.log('🌱 Starting simple data seeding...');
    
    // Clear existing data in reverse order of dependencies
    await db.delete(schema.reviews);
    await db.delete(schema.cartItems);
    await db.delete(schema.wishlistItems);
    await db.delete(schema.orderItems);
    await db.delete(schema.orders);
    await db.delete(schema.inventoryAlerts);
    await db.delete(schema.stockMovements);
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
    const now = new Date();
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
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        createdAt: now,
        updatedAt: now
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
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b332639e?w=150&h=150&fit=crop&crop=face',
        createdAt: now,
        updatedAt: now
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
        profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        createdAt: now,
        updatedAt: now
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
        profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        createdAt: now,
        updatedAt: now
      }
    ]).returning();

    // Create categories
    const categories = await db.insert(schema.categories).values([
      { name: 'Điện tử', slug: 'dien-tu', description: 'Thiết bị điện tử và công nghệ', createdAt: now, updatedAt: now },
      { name: 'Thời trang', slug: 'thoi-trang', description: 'Quần áo và phụ kiện', createdAt: now, updatedAt: now },
      { name: 'Nhà cửa & Vườn', slug: 'nha-cua-vuon', description: 'Đồ dùng gia đình và vườn', createdAt: now, updatedAt: now },
      { name: 'Thể thao', slug: 'the-thao', description: 'Dụng cụ thể thao và giải trí', createdAt: now, updatedAt: now },
      { name: 'Ô tô', slug: 'o-to', description: 'Phụ kiện và dụng cụ ô tô', createdAt: now, updatedAt: now },
      { name: 'Đồ chơi', slug: 'do-choi', description: 'Đồ chơi và trò chơi', createdAt: now, updatedAt: now },
      { name: 'Thú cưng', slug: 'thu-cung', description: 'Đồ dùng cho thú cưng', createdAt: now, updatedAt: now },
      { name: 'Thực phẩm', slug: 'thuc-pham', description: 'Thực phẩm và đồ uống', createdAt: now, updatedAt: now },
      { name: 'Sách', slug: 'sach', description: 'Sách và tài liệu', createdAt: now, updatedAt: now },
      { name: 'Sức khỏe', slug: 'suc-khoe', description: 'Sản phẩm chăm sóc sức khỏe', createdAt: now, updatedAt: now },
      { name: 'Đặc sản Việt Nam', slug: 'dac-san-viet-nam', description: 'Sản phẩm truyền thống Việt Nam', createdAt: now, updatedAt: now },
      { name: 'Văn phòng', slug: 'van-phong', description: 'Đồ dùng văn phòng', createdAt: now, updatedAt: now },
      { name: 'Nghệ thuật', slug: 'nghe-thuat', description: 'Đồ nghệ thuật và thủ công', createdAt: now, updatedAt: now }
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
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        sellerId: 'seller-001',
        title: 'MacBook Pro 14 inch',
        description: 'MacBook Pro 14 inch với chip M3 Pro, 18GB RAM, 512GB SSD',
        price: '52490000',
        categoryId: categories[0].id,
        images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop'],
        stock: 15,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        sellerId: 'seller-001',
        title: 'Áo Dài Tơ Tằm',
        description: 'Áo dài tơ tằm cao cấp, thêu tay tinh xảo, màu đỏ truyền thống',
        price: '2500000',
        categoryId: categories[10].id,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop'],
        stock: 8,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        sellerId: 'seller-001',
        title: 'Nước Mắm Phú Quốc',
        description: 'Nước mắm Phú Quốc nguyên chất, độ đạm 40°N, chai 500ml',
        price: '285000',
        categoryId: categories[7].id,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop'],
        stock: 50,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        sellerId: 'seller-001',
        title: 'Cà Phê Robusta Đak Lak',
        description: 'Cà phê Robusta nguyên chất từ Đak Lak, rang mộc, gói 500g',
        price: '180000',
        categoryId: categories[7].id,
        images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop'],
        stock: 100,
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ]).returning();

    // Create sample reviews
    const reviews = await db.insert(schema.reviews).values([
      {
        userId: 'user-001',
        productId: products[0].id,
        rating: 5,
        comment: 'iPhone 15 Pro Max chất lượng tuyệt vời, camera đẹp, pin trâu!',
        createdAt: now,
        updatedAt: now
      },
      {
        userId: 'traveler-001',
        productId: products[1].id,
        rating: 4,
        comment: 'MacBook Pro hiệu năng mạnh mẽ, phù hợp cho công việc thiết kế',
        createdAt: now,
        updatedAt: now
      },
      {
        userId: 'user-001',
        productId: products[2].id,
        rating: 5,
        comment: 'Áo dài đẹp lắm, chất liệu tơ tằm mềm mại, may công phu',
        createdAt: now,
        updatedAt: now
      }
    ]).returning();

    // Create sample cart items
    const cartItems = await db.insert(schema.cartItems).values([
      {
        userId: 'user-001',
        productId: products[0].id,
        quantity: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        userId: 'traveler-001',
        productId: products[2].id,
        quantity: 2,
        createdAt: now,
        updatedAt: now
      }
    ]).returning();

    // Create sample wishlist items
    const wishlistItems = await db.insert(schema.wishlistItems).values([
      {
        userId: 'user-001',
        productId: products[1].id,
        createdAt: now
      },
      {
        userId: 'traveler-001',
        productId: products[3].id,
        createdAt: now
      }
    ]).returning();

    // Create sample chat rooms
    const chatRooms = await db.insert(schema.chatRooms).values([
      {
        customerId: 'user-001',
        supportAgentId: 'admin-001',
        subject: 'Hỗ trợ đơn hàng #001',
        status: 'active',
        priority: 'medium',
        createdAt: now,
        updatedAt: now
      },
      {
        customerId: 'traveler-001',
        subject: 'Tư vấn tour du lịch',
        status: 'waiting',
        priority: 'low',
        createdAt: now,
        updatedAt: now
      }
    ]).returning();

    // Create sample chat messages
    const chatMessages = await db.insert(schema.chatMessages).values([
      {
        roomId: chatRooms[0].id,
        senderId: 'user-001',
        message: 'Chào bạn, tôi cần hỗ trợ về đơn hàng iPhone 15 Pro Max',
        messageType: 'text',
        isRead: true,
        createdAt: now
      },
      {
        roomId: chatRooms[0].id,
        senderId: 'admin-001',
        message: 'Chào anh/chị! Tôi sẽ hỗ trợ anh/chị ngay. Vui lòng cho tôi biết mã đơn hàng.',
        messageType: 'text',
        isRead: false,
        createdAt: now
      },
      {
        roomId: chatRooms[1].id,
        senderId: 'traveler-001',
        message: 'Tôi muốn tư vấn về tour Sapa 4 ngày 3 đêm',
        messageType: 'text',
        isRead: false,
        createdAt: now
      }
    ]).returning();

    console.log('✅ Simple data seeding completed successfully!');
    console.log('Created:');
    console.log('- 4 users (admin, seller, user, traveler)');
    console.log('- 13 categories');
    console.log('- 5 products with Vietnamese specialties');
    console.log('- 3 product reviews');
    console.log('- 2 cart items and 2 wishlist items');
    console.log('- 2 chat rooms and 3 messages');
    console.log('');
    console.log('Test accounts:');
    console.log('- Admin: admin@marketplacepro.com / 123456');
    console.log('- Seller: seller@marketplacepro.com / 123456');
    console.log('- User: user@marketplacepro.com / 123456');
    console.log('- Traveler: traveler@marketplacepro.com / 123456');

  } catch (error) {
    console.error('Error seeding simple data:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
seedSimpleData()
  .catch(console.error)
  .finally(() => process.exit(0));