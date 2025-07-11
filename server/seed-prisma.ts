import { prisma } from './prisma';
import { hashPassword } from './auth';

export async function seedPrismaDatabase() {
  console.log('🌱 Seeding database with Prisma...');

  try {
    // Create test users
    const adminUser = await prisma.user.create({
      data: {
        id: 'admin-001',
        email: 'admin@marketplacepro.com',
        password: await hashPassword('admin123'),
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        isVerified: true,
        profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
      }
    });

    const sellerUser = await prisma.user.create({
      data: {
        id: 'seller-001',
        email: 'seller@marketplacepro.com',
        password: await hashPassword('seller123'),
        firstName: 'Seller',
        lastName: 'User',
        role: 'seller',
        isActive: true,
        isVerified: true,
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
      }
    });

    const regularUser = await prisma.user.create({
      data: {
        id: 'user-001',
        email: 'user@marketplacepro.com',
        password: await hashPassword('user123'),
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
        isActive: true,
        isVerified: true,
        profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
      }
    });

    // Create categories
    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Latest electronic devices and gadgets' },
      { name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes, and accessories' },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden supplies' },
      { name: 'Sports & Recreation', slug: 'sports', description: 'Sports equipment and outdoor gear' },
      { name: 'Books & Media', slug: 'books', description: 'Books, movies, music, and games' },
      { name: 'Health & Beauty', slug: 'health-beauty', description: 'Health, beauty, and personal care' },
      { name: 'Automotive', slug: 'automotive', description: 'Car parts and automotive accessories' },
      { name: 'Toys & Games', slug: 'toys-games', description: 'Toys, games, and hobby items' },
      { name: 'Food & Beverages', slug: 'food-beverages', description: 'Gourmet food and beverages' },
      { name: 'Vietnamese Specialties', slug: 'vietnamese-specialties', description: 'Authentic Vietnamese products' },
      { name: 'Office & Business', slug: 'office-business', description: 'Office supplies and business equipment' },
      { name: 'Pet Supplies', slug: 'pet-supplies', description: 'Pet food, toys, and accessories' },
      { name: 'Art & Crafts', slug: 'art-crafts', description: 'Art supplies and craft materials' }
    ];

    const createdCategories = await Promise.all(
      categories.map(category => prisma.category.create({ data: category }))
    );

    // Create products
    const products = [
      {
        title: 'iPhone 15 Pro Max',
        description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
        price: 1199.99,
        categoryId: createdCategories[0].id, // Electronics
        sellerId: sellerUser.id,
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569'],
        stock: 25
      },
      {
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android phone with S Pen, 200MP camera, and AI features',
        price: 1299.99,
        categoryId: createdCategories[0].id, // Electronics
        sellerId: sellerUser.id,
        images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf'],
        stock: 30
      },
      {
        title: 'MacBook Pro 16"',
        description: 'Powerful laptop with M3 Max chip, perfect for professional work',
        price: 2499.99,
        categoryId: createdCategories[0].id, // Electronics
        sellerId: sellerUser.id,
        images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef'],
        stock: 15
      },
      {
        title: 'Áo Dài Truyền Thống',
        description: 'Traditional Vietnamese dress, handmade with premium silk',
        price: 149.99,
        categoryId: createdCategories[9].id, // Vietnamese Specialties
        sellerId: sellerUser.id,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96'],
        stock: 50
      },
      {
        title: 'Phở Bò Instant Noodles',
        description: 'Authentic Vietnamese beef pho noodle soup, premium quality',
        price: 24.99,
        categoryId: createdCategories[9].id, // Vietnamese Specialties
        sellerId: sellerUser.id,
        images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624'],
        stock: 100
      },
      {
        title: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Max Air cushioning',
        price: 129.99,
        categoryId: createdCategories[1].id, // Fashion
        sellerId: sellerUser.id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'],
        stock: 75
      },
      {
        title: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling headphones with 30-hour battery',
        price: 199.99,
        categoryId: createdCategories[0].id, // Electronics
        sellerId: sellerUser.id,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
        stock: 60
      },
      {
        title: 'Yoga Mat Premium',
        description: 'Non-slip yoga mat with carrying strap, perfect for home workouts',
        price: 39.99,
        categoryId: createdCategories[3].id, // Sports
        sellerId: sellerUser.id,
        images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'],
        stock: 120
      },
      {
        title: 'Coffee Maker Machine',
        description: 'Programmable coffee maker with thermal carafe, 12-cup capacity',
        price: 89.99,
        categoryId: createdCategories[2].id, // Home & Garden
        sellerId: sellerUser.id,
        images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'],
        stock: 45
      },
      {
        title: 'Gaming Mechanical Keyboard',
        description: 'RGB backlit gaming keyboard with blue switches',
        price: 79.99,
        categoryId: createdCategories[0].id, // Electronics
        sellerId: sellerUser.id,
        images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a'],
        stock: 80
      }
    ];

    const createdProducts = await Promise.all(
      products.map(product => prisma.product.create({ data: product }))
    );

    // Create reviews
    const reviews = [
      {
        productId: createdProducts[0].id,
        userId: regularUser.id,
        rating: 5,
        comment: 'Amazing phone! The camera quality is incredible and the battery life is excellent.'
      },
      {
        productId: createdProducts[0].id,
        userId: adminUser.id,
        rating: 4,
        comment: 'Great phone overall, but quite expensive. The titanium design is beautiful.'
      },
      {
        productId: createdProducts[3].id,
        userId: regularUser.id,
        rating: 5,
        comment: 'Áo dài rất đẹp và chất lượng tuyệt vời! Đáng giá tiền bỏ ra.'
      },
      {
        productId: createdProducts[4].id,
        userId: adminUser.id,
        rating: 4,
        comment: 'Phở ăn ngon, gần giống như phở thật. Rất tiện lợi.'
      },
      {
        productId: createdProducts[5].id,
        userId: regularUser.id,
        rating: 5,
        comment: 'Very comfortable shoes! Perfect for running and everyday wear.'
      }
    ];

    await Promise.all(
      reviews.map(review => prisma.review.create({ data: review }))
    );

    // Create cart items
    await prisma.cartItem.createMany({
      data: [
        {
          userId: adminUser.id,
          productId: createdProducts[0].id,
          quantity: 1
        },
        {
          userId: adminUser.id,
          productId: createdProducts[6].id,
          quantity: 2
        },
        {
          userId: regularUser.id,
          productId: createdProducts[3].id,
          quantity: 1
        }
      ]
    });

    // Create wishlist items
    await prisma.wishlistItem.createMany({
      data: [
        {
          userId: adminUser.id,
          productId: createdProducts[1].id
        },
        {
          userId: adminUser.id,
          productId: createdProducts[2].id
        },
        {
          userId: regularUser.id,
          productId: createdProducts[4].id
        }
      ]
    });

    // Create sample order
    const sampleOrder = await prisma.order.create({
      data: {
        userId: adminUser.id,
        status: 'completed',
        totalAmount: 329.98,
        shippingAddress: '123 Main St, Ho Chi Minh City, Vietnam',
        paymentMethod: 'credit_card'
      }
    });

    await prisma.orderItem.createMany({
      data: [
        {
          orderId: sampleOrder.id,
          productId: createdProducts[6].id,
          quantity: 1,
          price: 199.99
        },
        {
          orderId: sampleOrder.id,
          productId: createdProducts[5].id,
          quantity: 1,
          price: 129.99
        }
      ]
    });

    // Create inventory alerts
    await prisma.inventoryAlert.createMany({
      data: [
        {
          productId: createdProducts[2].id,
          sellerId: sellerUser.id,
          type: 'low_stock',
          message: 'MacBook Pro 16" is running low on stock (15 items remaining)'
        },
        {
          productId: createdProducts[8].id,
          sellerId: sellerUser.id,
          type: 'restock_needed',
          message: 'Coffee Maker Machine needs restocking soon'
        }
      ]
    });

    // Create stock movements
    await prisma.stockMovement.createMany({
      data: [
        {
          productId: createdProducts[0].id,
          sellerId: sellerUser.id,
          movementType: 'restock',
          quantity: 25,
          previousStock: 0,
          newStock: 25,
          reason: 'Initial stock'
        },
        {
          productId: createdProducts[1].id,
          sellerId: sellerUser.id,
          movementType: 'restock',
          quantity: 30,
          previousStock: 0,
          newStock: 30,
          reason: 'Initial stock'
        },
        {
          productId: createdProducts[0].id,
          sellerId: sellerUser.id,
          movementType: 'sale',
          quantity: -2,
          previousStock: 25,
          newStock: 23,
          reason: 'Product sold'
        }
      ]
    });

    // Create chat rooms
    const chatRoom1 = await prisma.chatRoom.create({
      data: {
        customerId: adminUser.id,
        supportAgentId: adminUser.id,
        status: 'active',
        subject: 'Question about shipping',
        priority: 'medium'
      }
    });

    const chatRoom2 = await prisma.chatRoom.create({
      data: {
        customerId: regularUser.id,
        status: 'waiting',
        subject: 'Product inquiry',
        priority: 'high'
      }
    });

    // Create chat messages
    await prisma.chatMessage.createMany({
      data: [
        {
          roomId: chatRoom1.id,
          senderId: adminUser.id,
          message: 'Hello, I have a question about shipping options for international orders.',
          messageType: 'text'
        },
        {
          roomId: chatRoom1.id,
          senderId: adminUser.id,
          message: 'We offer multiple shipping options including express delivery. Let me check the details for you.',
          messageType: 'text'
        },
        {
          roomId: chatRoom2.id,
          senderId: regularUser.id,
          message: 'Is the Áo Dài available in different colors?',
          messageType: 'text'
        }
      ]
    });

    console.log('✅ Database seeded successfully with Prisma!');
    console.log('👥 Created users:', { adminUser: adminUser.email, sellerUser: sellerUser.email, regularUser: regularUser.email });
    console.log('📦 Created products:', createdProducts.length);
    console.log('📝 Created reviews:', reviews.length);
    console.log('💬 Created chat rooms:', 2);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPrismaDatabase()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}