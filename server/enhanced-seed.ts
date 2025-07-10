import { db } from './db';
import { categories, products, reviews, users } from '@shared/schema';

export async function seedEnhancedData() {
  try {
    console.log('🌱 Starting enhanced database seeding...');

    // Clear existing data
    await db.delete(reviews);
    await db.delete(products);
    await db.delete(categories);
    
    // Create detailed seed users for reviews
    const seedUsers = [
      {
        id: 'seed-user-1',
        email: 'nguyen.minh@gmail.com',
        firstName: 'Minh',
        lastName: 'Nguyen',
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-2',
        email: 'sarah.johnson@outlook.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b6c5b5a5?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-3',
        email: 'kim.hyun@naver.com',
        firstName: 'Hyun',
        lastName: 'Kim',
        profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-4',
        email: 'alexei.petrov@yandex.ru',
        firstName: 'Alexei',
        lastName: 'Petrov',
        profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-5',
        email: 'tran.linh@yahoo.com',
        firstName: 'Linh',
        lastName: 'Tran',
        profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-6',
        email: 'james.williams@gmail.com',
        firstName: 'James',
        lastName: 'Williams',
        profileImageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-7',
        email: 'hoang.thu@gmail.com',
        firstName: 'Thu',
        lastName: 'Hoang',
        profileImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-8',
        email: 'duc.pham@hotmail.com',
        firstName: 'Duc',
        lastName: 'Pham',
        profileImageUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-9',
        email: 'lee.soo@gmail.com',
        firstName: 'Soo Jin',
        lastName: 'Lee',
        profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-10',
        email: 'maria.rodriguez@gmail.com',
        firstName: 'Maria',
        lastName: 'Rodriguez',
        profileImageUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-11',
        email: 'an.nguyen@gmail.com',
        firstName: 'An',
        lastName: 'Nguyen',
        profileImageUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-12',
        email: 'david.chen@yahoo.com',
        firstName: 'David',
        lastName: 'Chen',
        profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-13',
        email: 'emma.brown@gmail.com',
        firstName: 'Emma',
        lastName: 'Brown',
        profileImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-14',
        email: 'nguyen.thai@gmail.com',
        firstName: 'Thai',
        lastName: 'Nguyen',
        profileImageUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 'seed-user-15',
        email: 'park.minho@gmail.com',
        firstName: 'Min Ho',
        lastName: 'Park',
        profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      },
    ];

    // Insert seed users
    for (const user of seedUsers) {
      await db.insert(users).values(user).onConflictDoNothing();
    }

    // Insert categories
    const categoryData = [
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Smartphone & Tablets', slug: 'smartphone-tablets' },
      { name: 'Laptops & Computers', slug: 'laptops-computers' },
      { name: 'Audio & Headphones', slug: 'audio-headphones' },
      { name: 'Gaming', slug: 'gaming' },
      { name: 'Fashion & Clothing', slug: 'fashion-clothing' },
      { name: 'Home & Garden', slug: 'home-garden' },
      { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
      { name: 'Books & Education', slug: 'books-education' },
      { name: 'Vietnamese Specialties', slug: 'vietnamese-specialties' },
      { name: 'Automotive', slug: 'automotive' },
      { name: 'Health & Beauty', slug: 'health-beauty' },
      { name: 'Toys & Games', slug: 'toys-games' },
      { name: 'Pet Supplies', slug: 'pet-supplies' },
      { name: 'Food & Beverages', slug: 'food-beverages' },
      { name: 'Office & Business', slug: 'office-business' },
      { name: 'Art & Crafts', slug: 'art-crafts' },
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`✅ Created ${insertedCategories.length} categories`);

    // Create comprehensive product data with detailed descriptions
    const productData = [
      // Electronics - High-end smartphones
      {
        sellerId: 'seed-seller-1',
        title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
        description: 'Experience the ultimate iPhone with titanium design, A17 Pro chip, and Pro camera system. Features 6.7-inch Super Retina XDR display, 5x telephoto zoom, and Action Button. Perfect for photography enthusiasts and power users.',
        price: 1299.99,
        categoryId: insertedCategories.find(c => c.slug === 'smartphone-tablets')?.id,
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&crop=entropy',
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop&crop=top',
        ],
        tags: ['smartphone', 'apple', 'premium', 'camera', 'titanium'],
      },
      {
        sellerId: 'seed-seller-2',
        title: 'Samsung Galaxy S24 Ultra 512GB - Titanium Gray',
        description: 'Revolutionary AI-powered smartphone with S Pen, 200MP camera, and 6.8-inch Dynamic AMOLED display. Built-in AI features for photography, productivity, and creativity. Perfect for business and creative professionals.',
        price: 1399.99,
        categoryId: insertedCategories.find(c => c.slug === 'smartphone-tablets')?.id,
        stock: 18,
        images: [
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop&crop=entropy',
        ],
        tags: ['smartphone', 'samsung', 'android', 's-pen', 'ai'],
      },
      {
        sellerId: 'seed-seller-1',
        title: 'Google Pixel 8 Pro 128GB - Obsidian',
        description: 'Pure Android experience with Google AI, Magic Eraser, and Best Take features. Professional-grade camera with computational photography. Receive Android updates first and enjoy 7 years of security updates.',
        price: 999.99,
        categoryId: insertedCategories.find(c => c.slug === 'smartphone-tablets')?.id,
        stock: 32,
        images: [
          'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=600&h=600&fit=crop',
        ],
        tags: ['smartphone', 'google', 'android', 'ai', 'photography'],
      },
      // Laptops & Computers
      {
        sellerId: 'seed-seller-3',
        title: 'MacBook Pro 16-inch M3 Pro 18GB RAM 512GB SSD',
        description: 'Powerhouse laptop with M3 Pro chip, Liquid Retina XDR display, and up to 22 hours battery life. Perfect for video editing, software development, and creative work. Space Black finish with advanced thermal design.',
        price: 2499.99,
        categoryId: insertedCategories.find(c => c.slug === 'laptops-computers')?.id,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&crop=entropy',
        ],
        tags: ['laptop', 'apple', 'macbook', 'm3', 'professional'],
      },
      {
        sellerId: 'seed-seller-4',
        title: 'Dell XPS 13 Plus Intel i7 32GB RAM 1TB SSD',
        description: 'Ultra-portable laptop with stunning 13.4-inch OLED display, premium build quality, and exceptional performance. Features modern design with haptic touchpad and zero-lattice keyboard. Perfect for professionals on the go.',
        price: 1899.99,
        categoryId: insertedCategories.find(c => c.slug === 'laptops-computers')?.id,
        stock: 22,
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
        ],
        tags: ['laptop', 'dell', 'ultrabook', 'oled', 'portable'],
      },
      // Audio & Headphones
      {
        sellerId: 'seed-seller-5',
        title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
        description: 'Industry-leading noise cancellation with exceptional sound quality. Features 30-hour battery life, multipoint connection, and adaptive sound control. Perfect for travel, work, and music enthusiasts.',
        price: 399.99,
        categoryId: insertedCategories.find(c => c.slug === 'audio-headphones')?.id,
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop&crop=entropy',
        ],
        tags: ['headphones', 'sony', 'wireless', 'noise-canceling', 'premium'],
      },
      {
        sellerId: 'seed-seller-6',
        title: 'AirPods Pro 2nd Generation with MagSafe Case',
        description: 'Advanced noise cancellation, spatial audio, and adaptive transparency. Features H2 chip for superior audio quality and battery life. Perfect integration with Apple ecosystem.',
        price: 249.99,
        categoryId: insertedCategories.find(c => c.slug === 'audio-headphones')?.id,
        stock: 38,
        images: [
          'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop',
        ],
        tags: ['earbuds', 'apple', 'wireless', 'noise-canceling', 'magsafe'],
      },
      // Gaming
      {
        sellerId: 'seed-seller-7',
        title: 'PlayStation 5 Console with Extra DualSense Controller',
        description: 'Next-generation gaming console with lightning-fast SSD, ray tracing, and 3D audio. Includes extra DualSense controller with haptic feedback and adaptive triggers. Experience gaming like never before.',
        price: 599.99,
        categoryId: insertedCategories.find(c => c.slug === 'gaming')?.id,
        stock: 12,
        images: [
          'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop&crop=entropy',
        ],
        tags: ['gaming', 'playstation', 'console', 'next-gen', 'controller'],
      },
      {
        sellerId: 'seed-seller-8',
        title: 'Nintendo Switch OLED Model - Neon Red/Blue',
        description: 'Enhanced Switch experience with vibrant 7-inch OLED screen, improved audio, and 64GB internal storage. Perfect for gaming at home or on the go. Includes Joy-Con controllers and dock.',
        price: 349.99,
        categoryId: insertedCategories.find(c => c.slug === 'gaming')?.id,
        stock: 28,
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
        ],
        tags: ['gaming', 'nintendo', 'switch', 'oled', 'portable'],
      },
      // Fashion & Clothing
      {
        sellerId: 'seed-seller-9',
        title: 'Premium Leather Jacket - Genuine Cowhide',
        description: 'Handcrafted genuine leather jacket with premium cowhide construction. Features classic design with modern fit, multiple pockets, and durable YKK zippers. Perfect for motorcycle riding or casual wear.',
        price: 299.99,
        categoryId: insertedCategories.find(c => c.slug === 'fashion-clothing')?.id,
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&crop=entropy',
        ],
        tags: ['fashion', 'leather', 'jacket', 'premium', 'cowhide'],
      },
      // Vietnamese Specialties
      {
        sellerId: 'seed-seller-10',
        title: 'Áo Dài Truyền Thống - Silk Brocade',
        description: 'Áo dài truyền thống Việt Nam được may từ lụa gấm cao cấp với họa tiết thêu tay tinh xảo. Thiết kế thanh lịch, phù hợp cho các dịp lễ tết và sự kiện quan trọng. Chất liệu lụa mềm mại, thoáng mát.',
        price: 189.99,
        categoryId: insertedCategories.find(c => c.slug === 'vietnamese-specialties')?.id,
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=600&h=600&fit=crop&crop=entropy',
        ],
        tags: ['vietnamese', 'ao-dai', 'traditional', 'silk', 'brocade'],
      },
      {
        sellerId: 'seed-seller-11',
        title: 'Phở Bò Khô - Authentic Vietnamese Beef Noodle Soup Kit',
        description: 'Bộ nguyên liệu phở bò khô hoàn chỉnh với bánh phở, gia vị và hướng dẫn chi tiết. Thưởng thức hương vị phở truyền thống Việt Nam tại nhà. Đủ cho 4 người ăn, không chất bảo quản.',
        price: 24.99,
        categoryId: insertedCategories.find(c => c.slug === 'vietnamese-specialties')?.id,
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=600&fit=crop',
        ],
        tags: ['vietnamese', 'pho', 'food', 'soup', 'authentic'],
      },
    ];

    const insertedProducts = await db.insert(products).values(productData).returning();
    console.log(`✅ Created ${insertedProducts.length} products`);

    // Create comprehensive reviews with detailed feedback
    const reviewData = [
      // Reviews for iPhone 15 Pro Max (first product)
      {
        productId: insertedProducts[0].id,
        userId: 'seed-user-1',
        rating: 5,
        comment: 'Điện thoại tuyệt vời! Camera chất lượng đỉnh cao, đặc biệt là chế độ chụp đêm. Thiết kế titanium rất sang trọng và nhẹ hơn hẳn so với thế hệ trước. Hiệu năng A17 Pro xử lý mọi tác vụ rất mượt mà. Đáng đồng tiền bát gạo!',
        verified: true,
      },
      {
        productId: insertedProducts[0].id,
        userId: 'seed-user-2',
        rating: 5,
        comment: 'Absolutely amazing phone! The camera system is incredible - the 5x telephoto zoom is perfect for portrait shots. Battery life easily lasts a full day with heavy usage. The Action Button is more useful than I expected. Highly recommend!',
        verified: true,
      },
      {
        productId: insertedProducts[0].id,
        userId: 'seed-user-3',
        rating: 4,
        comment: '정말 좋은 아이폰입니다! 카메라 성능이 뛰어나고 배터리 수명도 만족스럽습니다. 특히 야간 촬영 기능이 정말 인상적이에요. 다만 가격이 조금 비싼 것 같아요. 그래도 전반적으로 만족합니다.',
        verified: true,
      },
      {
        productId: insertedProducts[0].id,
        userId: 'seed-user-4',
        rating: 5,
        comment: 'Отличный телефон с превосходной камерой! Титановый корпус выглядит очень премиально. Производительность на высоте, все приложения работают плавно. Фотографии получаются потрясающие, особенно в условиях слабого освещения. Рекомендую!',
        verified: true,
      },
      {
        productId: insertedProducts[0].id,
        userId: 'seed-user-5',
        rating: 5,
        comment: 'Mình đã chờ đợi model này rất lâu và không hề thất vọng! Camera Pro Max thật sự xuất sắc với chế độ chụp macro và telephoto. Màn hình sắc nét, màu sắc rực rỡ. Pin bền hơn iPhone 14 Pro Max rất nhiều. Tuyệt vời!',
        verified: true,
      },
      // Reviews for Samsung Galaxy S24 Ultra
      {
        productId: insertedProducts[1].id,
        userId: 'seed-user-6',
        rating: 5,
        comment: 'Best Android phone I\'ve ever owned! The S Pen functionality is incredible for note-taking and drawing. The 200MP camera takes stunning photos with amazing detail. AI features are genuinely useful, not just gimmicks. Highly recommend for productivity!',
        verified: true,
      },
      {
        productId: insertedProducts[1].id,
        userId: 'seed-user-7',
        rating: 4,
        comment: 'Điện thoại Android tốt nhất hiện tại! Màn hình rất đẹp, bút S Pen rất hữu ích cho công việc. Camera 200MP chụp ảnh cực kỳ sắc nét. Tính năng AI thông minh, đặc biệt là chế độ dịch trực tiếp. Tuy nhiên pin có thể tốt hơn.',
        verified: true,
      },
      {
        productId: insertedProducts[1].id,
        userId: 'seed-user-8',
        rating: 5,
        comment: 'Tuyệt vời cho công việc! S Pen giúp mình ghi chú rất thuận tiện trong các cuộc họp. Camera zoom 100x thật sự ấn tượng. Hiệu năng xử lý mọi tác vụ rất nhanh. Đáng đầu tư cho những ai cần một chiếc điện thoại mạnh mẽ.',
        verified: true,
      },
      // Reviews for Google Pixel 8 Pro
      {
        productId: insertedProducts[2].id,
        userId: 'seed-user-9',
        rating: 5,
        comment: '순수 안드로이드 경험이 정말 좋습니다! 구글 AI 기능들이 매우 유용하고 카메라 품질이 뛰어납니다. 특히 Magic Eraser와 Best Take 기능이 인상적이에요. 7년 업데이트 보장도 큰 장점입니다.',
        verified: true,
      },
      {
        productId: insertedProducts[2].id,
        userId: 'seed-user-10',
        rating: 4,
        comment: 'Great value for money! The camera AI features are fantastic - Magic Eraser works like magic! Clean Android experience without bloatware. Fast updates directly from Google. Battery life is decent but could be better for heavy users.',
        verified: true,
      },
      // Reviews for MacBook Pro 16-inch
      {
        productId: insertedProducts[3].id,
        userId: 'seed-user-11',
        rating: 5,
        comment: 'Laptop tuyệt vời cho công việc sáng tạo! Chip M3 Pro xử lý video 4K rất mượt. Màn hình Liquid Retina XDR hiển thị màu sắc cực kỳ chính xác. Pin sử dụng cả ngày không cần sạc. Đầu tư xứng đáng cho designers và developers.',
        verified: true,
      },
      {
        productId: insertedProducts[3].id,
        userId: 'seed-user-12',
        rating: 5,
        comment: 'Incredible performance laptop! M3 Pro chip handles everything I throw at it - video editing, coding, multiple VMs. The display is gorgeous with accurate colors. Silent operation even under heavy load. Best laptop I\'ve ever owned!',
        verified: true,
      },
      // Reviews for Sony WH-1000XM5
      {
        productId: insertedProducts[5].id,
        userId: 'seed-user-13',
        rating: 5,
        comment: 'Best noise-canceling headphones ever! The sound quality is incredible with deep bass and clear highs. 30-hour battery life is amazing for long flights. Comfortable to wear for hours. The adaptive sound control is very smart.',
        verified: true,
      },
      {
        productId: insertedProducts[5].id,
        userId: 'seed-user-14',
        rating: 4,
        comment: 'Tai nghe chống ồn tuyệt vời! Chất lượng âm thanh rất tốt, bass sâu và treble rõ ràng. Tính năng chống ồn hoạt động hiệu quả. Đeo cả ngày không bị đau tai. Chỉ tiếc là hơi cồng kềnh một chút.',
        verified: true,
      },
      // Reviews for PlayStation 5
      {
        productId: insertedProducts[6].id,
        userId: 'seed-user-15',
        rating: 5,
        comment: 'Next-gen gaming at its finest! The SSD loading times are incredible - no more waiting screens. DualSense controller haptic feedback is mind-blowing. Graphics are stunning with ray tracing. Worth every penny for serious gamers!',
        verified: true,
      },
      {
        productId: insertedProducts[6].id,
        userId: 'seed-user-1',
        rating: 5,
        comment: 'Máy game thế hệ mới tuyệt vời! Tốc độ load game cực nhanh nhờ SSD. Tay cầm DualSense có độ rung rất chân thực. Đồ họa đẹp mắt với ray tracing. Trải nghiệm gaming hoàn toàn mới so với PS4.',
        verified: true,
      },
      // Reviews for Áo Dài Truyền Thống
      {
        productId: insertedProducts[9].id,
        userId: 'seed-user-2',
        rating: 5,
        comment: 'Áo dài rất đẹp và chất lượng! Lụa gấm mềm mại, họa tiết thêu tay tinh xảo. Thiết kế vừa vặn, tôn dáng người mặc. Rất phù hợp cho các dịp lễ tết và sự kiện quan trọng. Đóng gói cẩn thận, giao hàng nhanh.',
        verified: true,
      },
      {
        productId: insertedProducts[9].id,
        userId: 'seed-user-3',
        rating: 4,
        comment: 'Beautiful traditional Vietnamese dress! The silk brocade fabric is luxurious and comfortable. The embroidery work is exquisite and detailed. Perfect for special occasions and cultural events. Sizing is accurate based on the size chart.',
        verified: true,
      },
      // Reviews for Phở Bò Khô Kit
      {
        productId: insertedProducts[10].id,
        userId: 'seed-user-4',
        rating: 5,
        comment: 'Bộ phở bò khô tuyệt vời! Hương vị đậm đà, chính hiệu như ở quán phở truyền thống. Hướng dẫn nấu rất chi tiết, dễ làm theo. Bánh phở dai ngon, nước dựng thơm. Cả gia đình đều thích!',
        verified: true,
      },
      {
        productId: insertedProducts[10].id,
        userId: 'seed-user-5',
        rating: 5,
        comment: 'Authentic Vietnamese pho kit! The broth mix creates such a rich, flavorful soup. Rice noodles have perfect texture. Instructions are clear and easy to follow. Great way to enjoy traditional pho at home. Will definitely order again!',
        verified: true,
      },
    ];

    const insertedReviews = await db.insert(reviews).values(reviewData).returning();
    console.log(`✅ Created ${insertedReviews.length} reviews`);

    console.log('🎉 Enhanced database seeding completed successfully!');
    console.log(`Total: ${insertedCategories.length} categories, ${insertedProducts.length} products, ${insertedReviews.length} reviews`);
    console.log('Enhanced seeding completed');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
seedEnhancedData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });