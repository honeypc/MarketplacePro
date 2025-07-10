import { db } from './db';
import { categories, products, reviews, users } from '@shared/schema';

export async function seedMoreProducts() {
  try {
    console.log('🌱 Adding more products for testing...');

    // Get existing categories
    const existingCategories = await db.select().from(categories);
    const smartphoneCategory = existingCategories.find(c => c.slug === 'smartphone-tablets');
    const laptopCategory = existingCategories.find(c => c.slug === 'laptops-computers');
    const audioCategory = existingCategories.find(c => c.slug === 'audio-headphones');
    const gamingCategory = existingCategories.find(c => c.slug === 'gaming');
    const fashionCategory = existingCategories.find(c => c.slug === 'fashion-clothing');
    const vietnameseCategory = existingCategories.find(c => c.slug === 'vietnamese-specialties');

    // Add more smartphone products
    const moreProducts = [
      {
        sellerId: 'seed-seller-1',
        title: 'OnePlus 12 Pro 256GB - Forest Green',
        description: 'Flagship killer with Snapdragon 8 Gen 3, 50MP Hasselblad camera system, and 100W SuperVOOC charging. Features 6.82-inch QHD+ 120Hz display with Dolby Vision. Perfect balance of performance and value.',
        price: 899.99,
        categoryId: smartphoneCategory?.id,
        stock: 28,
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&crop=entropy',
        ],
        tags: ['smartphone', 'oneplus', 'android', 'fast-charging', 'camera'],
      },
      {
        sellerId: 'seed-seller-2',
        title: 'Xiaomi 14 Ultra 512GB - Photography Edition',
        description: 'Photography-focused smartphone with Leica quad-camera system, 1-inch main sensor, and professional photography modes. Features Snapdragon 8 Gen 3 and 120W HyperCharge. Ideal for mobile photographers.',
        price: 1199.99,
        categoryId: smartphoneCategory?.id,
        stock: 22,
        images: [
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop',
        ],
        tags: ['smartphone', 'xiaomi', 'camera', 'leica', 'photography'],
      },
      // More laptop products
      {
        sellerId: 'seed-seller-3',
        title: 'ASUS ROG Zephyrus G16 Gaming Laptop',
        description: 'High-performance gaming laptop with AMD Ryzen 9 7940HS, NVIDIA RTX 4080, and 32GB RAM. Features 16-inch QHD+ 240Hz display with G-Sync. Perfect for gaming and content creation.',
        price: 2299.99,
        categoryId: laptopCategory?.id,
        stock: 18,
        images: [
          'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop',
        ],
        tags: ['laptop', 'asus', 'gaming', 'rtx', 'ryzen'],
      },
      {
        sellerId: 'seed-seller-4',
        title: 'Microsoft Surface Laptop Studio 2',
        description: 'Versatile 2-in-1 laptop with unique hinge design, Intel Core i7-13700H, and NVIDIA RTX 4060. Features 14.4-inch PixelSense touchscreen. Perfect for creative professionals and designers.',
        price: 1999.99,
        categoryId: laptopCategory?.id,
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop',
        ],
        tags: ['laptop', 'microsoft', 'surface', 'touchscreen', 'creative'],
      },
      // More audio products
      {
        sellerId: 'seed-seller-5',
        title: 'Bose QuietComfort Ultra Headphones',
        description: 'Premium noise-canceling headphones with spatial audio and CustomTune technology. Features 24-hour battery life and luxurious comfort. Perfect for audiophiles and frequent travelers.',
        price: 429.99,
        categoryId: audioCategory?.id,
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop',
        ],
        tags: ['headphones', 'bose', 'noise-canceling', 'spatial-audio', 'premium'],
      },
      {
        sellerId: 'seed-seller-6',
        title: 'Sennheiser Momentum 4 Wireless',
        description: 'Exceptional sound quality with adaptive noise cancellation and 60-hour battery life. Features premium fabric design and audiophile-grade drivers. Perfect for music enthusiasts.',
        price: 349.99,
        categoryId: audioCategory?.id,
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
        ],
        tags: ['headphones', 'sennheiser', 'wireless', 'audiophile', 'premium'],
      },
      // More gaming products
      {
        sellerId: 'seed-seller-7',
        title: 'Xbox Series X Console with Game Pass',
        description: 'Most powerful Xbox console with 12 teraflops of processing power, 1TB SSD, and 4K gaming. Includes 3-month Game Pass Ultimate subscription. Perfect for serious gamers.',
        price: 499.99,
        categoryId: gamingCategory?.id,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=600&fit=crop',
        ],
        tags: ['gaming', 'xbox', 'console', 'game-pass', '4k'],
      },
      {
        sellerId: 'seed-seller-8',
        title: 'Steam Deck OLED 512GB',
        description: 'Handheld gaming PC with Steam OS, AMD APU, and vibrant OLED display. Play your Steam library anywhere with console-quality controls. Perfect for portable PC gaming.',
        price: 549.99,
        categoryId: gamingCategory?.id,
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=600&fit=crop',
        ],
        tags: ['gaming', 'steam', 'handheld', 'oled', 'portable'],
      },
      // More Vietnamese products
      {
        sellerId: 'seed-seller-10',
        title: 'Bánh Chưng Truyền Thống - Tết Vietnamese',
        description: 'Bánh chưng truyền thống được gói bằng lá dong tự nhiên với nhân đậu xanh và thịt ba chỉ. Đặc sản không thể thiếu trong ngày Tết của người Việt. Hương vị đậm đà, chính hiệu.',
        price: 15.99,
        categoryId: vietnameseCategory?.id,
        stock: 60,
        images: [
          'https://images.unsplash.com/photo-1596040178728-d1f4a2dea0e4?w=600&h=600&fit=crop',
        ],
        tags: ['vietnamese', 'banh-chung', 'tet', 'traditional', 'food'],
      },
      {
        sellerId: 'seed-seller-11',
        title: 'Chè Bưởi Hạt Sen - Premium Dessert',
        description: 'Chè bưởi hạt sen đặc biệt với hạt sen tươi và bưởi Đà Lạt. Món tráng miệng truyền thống với hương vị tự nhiên, thanh mát. Đóng gói tiện lợi, bảo quản lạnh.',
        price: 8.99,
        categoryId: vietnameseCategory?.id,
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1567306301408-e1b5d90c3e11?w=600&h=600&fit=crop',
        ],
        tags: ['vietnamese', 'dessert', 'che', 'lotus', 'grapefruit'],
      },
    ];

    const insertedProducts = await db.insert(products).values(moreProducts).returning();
    console.log(`✅ Added ${insertedProducts.length} more products`);

    // Add some reviews for the new products
    const moreReviews = [
      {
        productId: insertedProducts[0].id, // OnePlus 12 Pro
        userId: 'seed-user-1',
        rating: 5,
        comment: 'OnePlus 12 Pro thật sự ấn tượng! Màn hình 120Hz mượt mà, camera Hasselblad chụp ảnh đẹp, sạc nhanh 100W chỉ 30 phút là đầy pin. Giá cả hợp lý so với chất lượng.',
        verified: true,
      },
      {
        productId: insertedProducts[1].id, // Xiaomi 14 Ultra
        userId: 'seed-user-2',
        rating: 5,
        comment: 'Camera Leica on this phone is absolutely incredible! The 1-inch sensor captures amazing detail and the photography modes are professional-grade. Perfect for mobile photography enthusiasts.',
        verified: true,
      },
      {
        productId: insertedProducts[2].id, // ASUS ROG Zephyrus
        userId: 'seed-user-3',
        rating: 5,
        comment: '게이밍 노트북 중에서 최고입니다! RTX 4080과 Ryzen 9 조합이 모든 게임을 4K로 플레이할 수 있게 해줍니다. 발열 관리도 우수하고 키보드감도 좋아요.',
        verified: true,
      },
      {
        productId: insertedProducts[4].id, // Bose QuietComfort Ultra
        userId: 'seed-user-4',
        rating: 5,
        comment: 'Лучшие наушники с шумоподавлением! Spatial audio создает невероятное ощущение присутствия. Комфорт на высшем уровне, можно носить часами без усталости.',
        verified: true,
      },
      {
        productId: insertedProducts[6].id, // Xbox Series X
        userId: 'seed-user-5',
        rating: 5,
        comment: 'Xbox Series X với Game Pass thật sự tuyệt vời! Hiệu năng 4K mượt mà, thời gian load game cực nhanh. Game Pass có rất nhiều game hay. Đáng đầu tư!',
        verified: true,
      },
      {
        productId: insertedProducts[8].id, // Bánh Chưng
        userId: 'seed-user-6',
        rating: 5,
        comment: 'Bánh chưng chính hiệu, hương vị truyền thống đậm đà! Nhân đậu xanh mềm, thịt ba chỉ thơm ngon. Gói bằng lá dong tự nhiên, giữ được hương vị truyền thống. Rất hài lòng!',
        verified: true,
      },
    ];

    const insertedReviews = await db.insert(reviews).values(moreReviews).returning();
    console.log(`✅ Added ${insertedReviews.length} more reviews`);

    console.log('🎉 More products seeding completed successfully!');
  } catch (error) {
    console.error('More products seeding error:', error);
    throw error;
  }
}

// Run the seeding
seedMoreProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('More products seeding failed:', error);
    process.exit(1);
  });