import { prisma } from "./prisma";

export async function seedSimpleData() {
  try {
    console.log("Starting database seed...");

    // Clear existing data in correct order (respecting foreign key constraints)
    await prisma.chatMessage.deleteMany();
    await prisma.chatRoom.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    const users = await prisma.user.createMany({
      data: [
        {
          id: "admin",
          email: "admin@marketplacepro.com",
          password: "123456",
          firstName: "Admin",
          lastName: "User",
          role: "admin",
          isActive: true,
          isVerified: true
        },
        {
          id: "seller1",
          email: "seller@marketplacepro.com",
          password: "123456",
          firstName: "Seller",
          lastName: "One",
          role: "seller",
          isActive: true,
          isVerified: true
        },
        {
          id: "user1",
          email: "user@marketplacepro.com",
          password: "123456",
          firstName: "Regular",
          lastName: "User",
          role: "user",
          isActive: true,
          isVerified: true
        },
        {
          id: "traveler1",
          email: "traveler@marketplacepro.com",
          password: "123456",
          firstName: "Travel",
          lastName: "Lover",
          role: "user",
          isActive: true,
          isVerified: true
        }
      ]
    });

    console.log(`✅ Created ${users.count} users`);

    // Create categories
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

    // Create products
    const products = await prisma.product.createMany({
      data: [
        {
          sellerId: "seller1",
          title: "iPhone 15 Pro Max",
          description: "iPhone 15 Pro Max mới nhất với chip A17 Pro, camera 48MP chuyên nghiệp",
          price: 32990000,
          categoryId: 1,
          stock: 50,
          images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab"],
          isActive: true
        },
        {
          sellerId: "seller1",
          title: "Áo Dài Truyền Thống",
          description: "Áo dài Việt Nam truyền thống, chất liệu lụa cao cấp, thêu tay tinh xảo",
          price: 2500000,
          categoryId: 2,
          stock: 25,
          images: ["https://images.unsplash.com/photo-1583846294664-7b0e8b5a1c7c"],
          isActive: true
        },
        {
          sellerId: "seller1",
          title: "Bộ Bàn Ghế Gỗ Mahogany",
          description: "Bộ bàn ghế gỗ mahogany cao cấp, thiết kế cổ điển sang trọng",
          price: 15000000,
          categoryId: 3,
          stock: 10,
          images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7"],
          isActive: true
        },
        {
          sellerId: "seller1",
          title: "Kem Chống Nắng SPF 50+",
          description: "Kem chống nắng tự nhiên, bảo vệ da khỏi tia UV hiệu quả",
          price: 350000,
          categoryId: 4,
          stock: 100,
          images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"],
          isActive: true
        },
        {
          sellerId: "seller1",
          title: "Nước Mắm Phú Quốc",
          description: "Nước mắm truyền thống Phú Quốc, độ đạm cao, hương vị đậm đà",
          price: 125000,
          categoryId: 5,
          stock: 200,
          images: ["https://images.unsplash.com/photo-1563379091339-03246963d96c"],
          isActive: true
        }
      ]
    });

    console.log(`✅ Created ${products.count} products`);

    // Create reviews
    const reviews = await prisma.review.createMany({
      data: [
        {
          userId: "user1",
          productId: 1,
          rating: 5,
          comment: "Sản phẩm rất tuyệt vời! Chất lượng hoàn hảo, giao hàng nhanh."
        },
        {
          userId: "traveler1",
          productId: 2,
          rating: 4,
          comment: "Áo dài rất đẹp, chất liệu tốt. Sẽ mua thêm cho gia đình."
        },
        {
          userId: "user1",
          productId: 5,
          rating: 5,
          comment: "Nước mắm ngon, đúng vị truyền thống Phú Quốc. Highly recommended!"
        }
      ]
    });

    console.log(`✅ Created ${reviews.count} reviews`);

    // Create cart items
    const cartItems = await prisma.cartItem.createMany({
      data: [
        {
          userId: "user1",
          productId: 1,
          quantity: 1
        },
        {
          userId: "user1",
          productId: 4,
          quantity: 2
        }
      ]
    });

    console.log(`✅ Created ${cartItems.count} cart items`);

    // Create wishlist items
    const wishlistItems = await prisma.wishlistItem.createMany({
      data: [
        {
          userId: "user1",
          productId: 2
        },
        {
          userId: "traveler1",
          productId: 3
        }
      ]
    });

    console.log(`✅ Created ${wishlistItems.count} wishlist items`);

    // Create chat rooms
    const chatRooms = await prisma.chatRoom.createMany({
      data: [
        {
          customerId: "user1",
          supportAgentId: "admin",
          status: "active",
          subject: "Hỏi về sản phẩm iPhone 15 Pro Max",
          priority: "medium"
        },
        {
          customerId: "traveler1",
          status: "active",
          subject: "Cần hỗ trợ đặt hàng",
          priority: "high"
        }
      ]
    });

    console.log(`✅ Created ${chatRooms.count} chat rooms`);

    // Create chat messages
    const chatMessages = await prisma.chatMessage.createMany({
      data: [
        {
          roomId: 1,
          senderId: "user1",
          message: "Xin chào, tôi muốn hỏi về iPhone 15 Pro Max có còn hàng không?",
          messageType: "text"
        },
        {
          roomId: 1,
          senderId: "admin",
          message: "Chào bạn! iPhone 15 Pro Max hiện vẫn còn hàng. Bạn có cần hỗ trợ gì thêm không?",
          messageType: "text",
          isRead: false
        },
        {
          roomId: 2,
          senderId: "traveler1",
          message: "Tôi cần hỗ trợ đặt hàng nhiều sản phẩm cùng lúc",
          messageType: "text"
        }
      ]
    });

    console.log(`✅ Created ${chatMessages.count} chat messages`);

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