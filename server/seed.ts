import { db } from './db';
import { categories, products, reviews } from '@shared/schema';

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await db.delete(reviews);
    await db.delete(products);
    await db.delete(categories);

    // Insert categories
    const categoryData = [
      {
        name: 'Electronics',
        description: 'Latest gadgets and electronic devices',
        slug: 'electronics',
        imageUrl: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&h=300&fit=crop',
      },
      {
        name: 'Fashion',
        description: 'Trendy clothing and accessories',
        slug: 'fashion',
        imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=300&fit=crop',
      },
      {
        name: 'Home & Garden',
        description: 'Everything for your home and garden',
        slug: 'home-garden',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop',
      },
      {
        name: 'Sports & Outdoors',
        description: 'Sports equipment and outdoor gear',
        slug: 'sports',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop',
      },
      {
        name: 'Books & Media',
        description: 'Books, movies, and educational content',
        slug: 'books',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop',
      },
      {
        name: 'Health & Beauty',
        description: 'Health, beauty, and personal care products',
        slug: 'health-beauty',
        imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=300&fit=crop',
      },
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`✅ Created ${insertedCategories.length} categories`);

    // Insert products
    const productData = [
      // Electronics
      {
        title: 'iPhone 15 Pro Max',
        description: 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system. Perfect for photography enthusiasts and professionals.',
        price: 1199.99,
        stock: 25,
        categoryId: insertedCategories[0].id,
        sellerId: 'seed-seller-1',
        imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.8,
        reviewCount: 147,
      },
      {
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen, 200MP camera, and AI-powered features. Built for productivity and creativity.',
        price: 1299.99,
        stock: 18,
        categoryId: insertedCategories[0].id,
        sellerId: 'seed-seller-2',
        imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.7,
        reviewCount: 89,
      },
      {
        title: 'MacBook Pro 14" M3',
        description: 'Powerful laptop with M3 chip, Liquid Retina XDR display, and all-day battery life. Ideal for professionals and creators.',
        price: 1999.99,
        stock: 12,
        categoryId: insertedCategories[0].id,
        sellerId: 'seed-seller-1',
        imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.9,
        reviewCount: 203,
      },
      {
        title: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise canceling wireless headphones with premium sound quality and 30-hour battery life.',
        price: 399.99,
        stock: 45,
        categoryId: insertedCategories[0].id,
        sellerId: 'seed-seller-3',
        imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.6,
        reviewCount: 312,
      },
      {
        title: 'Nintendo Switch OLED',
        description: 'Handheld gaming console with vibrant OLED screen, enhanced audio, and versatile gameplay modes.',
        price: 349.99,
        stock: 32,
        categoryId: insertedCategories[0].id,
        sellerId: 'seed-seller-2',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.5,
        reviewCount: 156,
      },

      // Fashion
      {
        title: 'Levi\'s 501 Original Jeans',
        description: 'Classic straight-leg jeans with authentic fit and timeless style. Made from premium denim for durability and comfort.',
        price: 89.99,
        stock: 67,
        categoryId: insertedCategories[1].id,
        sellerId: 'seed-seller-4',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.4,
        reviewCount: 89,
      },
      {
        title: 'Nike Air Max 270',
        description: 'Comfortable lifestyle sneakers with Max Air unit for exceptional cushioning and modern design.',
        price: 149.99,
        stock: 89,
        categoryId: insertedCategories[1].id,
        sellerId: 'seed-seller-5',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.3,
        reviewCount: 234,
      },
      {
        title: 'Cashmere Blend Sweater',
        description: 'Luxurious cashmere blend sweater with soft texture and elegant design. Perfect for professional and casual settings.',
        price: 129.99,
        stock: 34,
        categoryId: insertedCategories[1].id,
        sellerId: 'seed-seller-4',
        imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.7,
        reviewCount: 67,
      },
      {
        title: 'Leather Crossbody Bag',
        description: 'Genuine leather crossbody bag with adjustable strap and multiple compartments. Stylish and functional.',
        price: 199.99,
        stock: 23,
        categoryId: insertedCategories[1].id,
        sellerId: 'seed-seller-6',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.8,
        reviewCount: 145,
      },

      // Home & Garden
      {
        title: 'Instant Pot Duo 7-in-1',
        description: 'Multi-functional electric pressure cooker that replaces 7 kitchen appliances. Perfect for quick and healthy meals.',
        price: 99.99,
        stock: 56,
        categoryId: insertedCategories[2].id,
        sellerId: 'seed-seller-7',
        imageUrl: 'https://images.unsplash.com/photo-1585515656973-e8073b938cb8?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.6,
        reviewCount: 892,
      },
      {
        title: 'Dyson V15 Detect Vacuum',
        description: 'Cordless vacuum with laser dust detection and powerful suction. Advanced cleaning technology for all floor types.',
        price: 749.99,
        stock: 18,
        categoryId: insertedCategories[2].id,
        sellerId: 'seed-seller-8',
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.9,
        reviewCount: 234,
      },
      {
        title: 'Philips Hue Smart Bulbs 4-Pack',
        description: 'Color-changing smart LED bulbs with app control and voice activation. Create the perfect ambiance for any occasion.',
        price: 199.99,
        stock: 78,
        categoryId: insertedCategories[2].id,
        sellerId: 'seed-seller-7',
        imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.5,
        reviewCount: 167,
      },

      // Sports & Outdoors
      {
        title: 'Peloton Bike+',
        description: 'Premium indoor cycling bike with rotating touchscreen and live classes. Transform your home into a fitness studio.',
        price: 2495.00,
        stock: 8,
        categoryId: insertedCategories[3].id,
        sellerId: 'seed-seller-9',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.4,
        reviewCount: 78,
      },
      {
        title: 'Hydro Flask Water Bottle',
        description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Perfect for active lifestyles.',
        price: 44.99,
        stock: 124,
        categoryId: insertedCategories[3].id,
        sellerId: 'seed-seller-10',
        imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.7,
        reviewCount: 456,
      },
      {
        title: 'Adidas Ultraboost 22',
        description: 'High-performance running shoes with responsive cushioning and energy return. Designed for serious runners.',
        price: 189.99,
        stock: 67,
        categoryId: insertedCategories[3].id,
        sellerId: 'seed-seller-11',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.6,
        reviewCount: 234,
      },

      // Books & Media
      {
        title: 'The Psychology of Money',
        description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. Essential reading for financial literacy.',
        price: 16.99,
        stock: 145,
        categoryId: insertedCategories[4].id,
        sellerId: 'seed-seller-12',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.8,
        reviewCount: 1234,
      },
      {
        title: 'Atomic Habits',
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear. Transform your life with small changes.',
        price: 18.99,
        stock: 89,
        categoryId: insertedCategories[4].id,
        sellerId: 'seed-seller-12',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.9,
        reviewCount: 2156,
      },

      // Health & Beauty
      {
        title: 'Cetaphil Gentle Skin Cleanser',
        description: 'Gentle, non-irritating cleanser for sensitive skin. Fragrance-free and recommended by dermatologists.',
        price: 14.99,
        stock: 234,
        categoryId: insertedCategories[5].id,
        sellerId: 'seed-seller-13',
        imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.5,
        reviewCount: 567,
      },
      {
        title: 'Olaplex Hair Perfector No. 3',
        description: 'At-home hair treatment that reduces breakage and strengthens hair. Works on all hair types.',
        price: 28.99,
        stock: 156,
        categoryId: insertedCategories[5].id,
        sellerId: 'seed-seller-14',
        imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&h=500&fit=crop',
        isActive: true,
        rating: 4.7,
        reviewCount: 789,
      },
    ];

    const insertedProducts = await db.insert(products).values(productData).returning();
    console.log(`✅ Created ${insertedProducts.length} products`);

    // Insert sample reviews
    const reviewData = [
      {
        productId: insertedProducts[0].id,
        userId: 'seed-user-1',
        rating: 5,
        comment: 'Tuyệt vời! Điện thoại chất lượng cao và camera thật sự ấn tượng. Đáng đồng tiền bát gạo.',
        isVerifiedPurchase: true,
      },
      {
        productId: insertedProducts[0].id,
        userId: 'seed-user-2',
        rating: 4,
        comment: 'Great phone overall, but the price is quite high. Camera quality is excellent though.',
        isVerifiedPurchase: true,
      },
      {
        productId: insertedProducts[1].id,
        userId: 'seed-user-3',
        rating: 5,
        comment: '정말 좋은 스마트폰입니다. S펜 기능이 매우 유용하고 화질도 선명해요.',
        isVerifiedPurchase: true,
      },
      {
        productId: insertedProducts[2].id,
        userId: 'seed-user-4',
        rating: 5,
        comment: 'Отличный ноутбук для работы. Быстрый, тихий и с отличным дисплеем.',
        isVerifiedPurchase: true,
      },
      {
        productId: insertedProducts[3].id,
        userId: 'seed-user-5',
        rating: 4,
        comment: 'Chất lượng âm thanh tuyệt vời và tính năng chống ồn rất hiệu quả.',
        isVerifiedPurchase: true,
      },
      {
        productId: insertedProducts[10].id,
        userId: 'seed-user-6',
        rating: 5,
        comment: 'This Instant Pot has changed my cooking game completely! So versatile and easy to use.',
        isVerifiedPurchase: true,
      },
      {
        productId: insertedProducts[16].id,
        userId: 'seed-user-7',
        rating: 5,
        comment: 'Cuốn sách thay đổi cách nhìn của tôi về tiền bạc. Rất khuyến khích mọi người đọc.',
        isVerifiedPurchase: true,
      },
    ];

    const insertedReviews = await db.insert(reviews).values(reviewData).returning();
    console.log(`✅ Created ${insertedReviews.length} reviews`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`Total: ${insertedCategories.length} categories, ${insertedProducts.length} products, ${insertedReviews.length} reviews`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}