import { db } from "./db";
import { users } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedTestAccounts() {
  console.log("🌱 Seeding test accounts...");

  try {
    // Hash passwords for test accounts
    const adminPassword = await hashPassword("admin123");
    const sellerPassword = await hashPassword("seller123");
    const userPassword = await hashPassword("user123");

    // Create test accounts
    const testAccounts = [
      {
        id: "admin-001",
        email: "admin@marketplacepro.com",
        firstName: "Admin",
        lastName: "User",
        password: adminPassword,
        role: "admin",
        isActive: true,
        isVerified: true,
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: "seller-001",
        email: "seller@marketplacepro.com",
        firstName: "John",
        lastName: "Seller",
        password: sellerPassword,
        role: "seller",
        isActive: true,
        isVerified: true,
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: "seller-002",
        email: "maria.shop@marketplacepro.com",
        firstName: "Maria",
        lastName: "Rodriguez",
        password: sellerPassword,
        role: "seller",
        isActive: true,
        isVerified: true,
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b2bb?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: "seller-003",
        email: "tech.store@marketplacepro.com",
        firstName: "David",
        lastName: "Chen",
        password: sellerPassword,
        role: "seller",
        isActive: true,
        isVerified: true,
        profileImageUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: "user-001",
        email: "user@marketplacepro.com",
        firstName: "Jane",
        lastName: "Customer",
        password: userPassword,
        role: "user",
        isActive: true,
        isVerified: true,
        profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: "user-002",
        email: "shopper@marketplacepro.com",
        firstName: "Michael",
        lastName: "Johnson",
        password: userPassword,
        role: "user",
        isActive: true,
        isVerified: true,
        profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: "user-003",
        email: "buyer@marketplacepro.com",
        firstName: "Sarah",
        lastName: "Williams",
        password: userPassword,
        role: "user",
        isActive: true,
        isVerified: true,
        profileImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: "user-004",
        email: "customer@marketplacepro.com",
        firstName: "Robert",
        lastName: "Davis",
        password: userPassword,
        role: "user",
        isActive: true,
        isVerified: false, // Unverified user example
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: "user-005",
        email: "test@marketplacepro.com",
        firstName: "Emily",
        lastName: "Brown",
        password: userPassword,
        role: "user",
        isActive: false, // Inactive user example
        isVerified: true,
        profileImageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      },
    ];

    // Insert or update test accounts
    for (const account of testAccounts) {
      await db
        .insert(users)
        .values(account)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...account,
            updatedAt: new Date(),
          },
        });
    }

    console.log("✅ Test accounts seeded successfully!");
    console.log("\n📋 Test Account Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔐 ADMIN ACCOUNT:");
    console.log("   Email: admin@marketplacepro.com");
    console.log("   Password: admin123");
    console.log("   Role: admin");
    console.log("");
    console.log("🏪 SELLER ACCOUNTS:");
    console.log("   Email: seller@marketplacepro.com");
    console.log("   Password: seller123");
    console.log("   Role: seller");
    console.log("");
    console.log("   Email: maria.shop@marketplacepro.com");
    console.log("   Password: seller123");
    console.log("   Role: seller");
    console.log("");
    console.log("   Email: tech.store@marketplacepro.com");
    console.log("   Password: seller123");
    console.log("   Role: seller");
    console.log("");
    console.log("👥 USER ACCOUNTS:");
    console.log("   Email: user@marketplacepro.com");
    console.log("   Password: user123");
    console.log("   Role: user");
    console.log("");
    console.log("   Email: shopper@marketplacepro.com");
    console.log("   Password: user123");
    console.log("   Role: user");
    console.log("");
    console.log("   Email: buyer@marketplacepro.com");
    console.log("   Password: user123");
    console.log("   Role: user");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

  } catch (error) {
    console.error("❌ Error seeding test accounts:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTestAccounts()
    .then(() => {
      console.log("✅ Test accounts seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Test accounts seeding failed:", error);
      process.exit(1);
    });
}