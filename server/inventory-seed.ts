import { db } from "./db";
import { products, inventoryAlerts, stockMovements } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedInventoryData() {
  console.log("Seeding inventory management data...");

  try {
    // Get some existing products to work with
    const existingProducts = await db.select().from(products).limit(10);
    
    if (existingProducts.length === 0) {
      console.log("No products found, skipping inventory seed");
      return;
    }

    // Update some products with low stock thresholds and set some to low stock
    const updatePromises = existingProducts.map(async (product, index) => {
      const lowStockThreshold = 15;
      const stockLevel = index < 3 ? 5 : index < 6 ? 8 : 25; // Make first 6 products low stock
      const reservedStock = Math.floor(Math.random() * 3);

      await db
        .update(products)
        .set({
          lowStockThreshold,
          stock: stockLevel,
          reservedStock,
          lastRestocked: new Date(),
        })
        .where(eq(products.id, product.id));

      return { ...product, stock: stockLevel, lowStockThreshold };
    });

    const updatedProducts = await Promise.all(updatePromises);

    // Create inventory alerts for low stock products
    const alertPromises = updatedProducts
      .filter(product => product.stock <= 15)
      .map(async (product) => {
        const severity = product.stock === 0 ? 'critical' : 
                        product.stock <= 5 ? 'high' : 
                        product.stock <= 10 ? 'medium' : 'low';

        await db.insert(inventoryAlerts).values({
          productId: product.id,
          sellerId: product.sellerId,
          alertType: product.stock === 0 ? 'out_of_stock' : 'low_stock',
          message: product.stock === 0 
            ? `OUT OF STOCK: ${product.title} is completely out of stock and needs immediate restocking`
            : `Low stock alert: ${product.title} has only ${product.stock} units remaining (threshold: ${product.lowStockThreshold})`,
          severity,
          isRead: Math.random() > 0.7, // Some alerts are already read
          isResolved: false,
        });
      });

    await Promise.all(alertPromises);

    // Create some stock movement history
    const movementPromises = updatedProducts.map(async (product) => {
      const movements = [
        {
          productId: product.id,
          sellerId: product.sellerId,
          movementType: 'restock',
          quantity: 50,
          previousStock: 0,
          newStock: 50,
          reason: 'Initial stock from supplier',
          notes: 'Received new shipment from main supplier',
        },
        {
          productId: product.id,
          sellerId: product.sellerId,
          movementType: 'sale',
          quantity: -15,
          previousStock: 50,
          newStock: 35,
          reason: 'Customer purchases',
          notes: 'Multiple customer orders',
        },
        {
          productId: product.id,
          sellerId: product.sellerId,
          movementType: 'sale',
          quantity: -20,
          previousStock: 35,
          newStock: 15,
          reason: 'Bulk order sale',
          notes: 'Large corporate order',
        },
        {
          productId: product.id,
          sellerId: product.sellerId,
          movementType: 'adjustment',
          quantity: -(15 - product.stock),
          previousStock: 15,
          newStock: product.stock,
          reason: 'Inventory adjustment',
          notes: 'Stock count adjustment after audit',
        },
      ];

      // Insert movements with different timestamps
      for (let i = 0; i < movements.length; i++) {
        const movement = movements[i];
        const date = new Date();
        date.setDate(date.getDate() - (movements.length - i));
        
        await db.insert(stockMovements).values({
          ...movement,
          createdAt: date,
        });
      }
    });

    await Promise.all(movementPromises);

    // Create some additional alert types
    const additionalAlerts = [
      {
        productId: updatedProducts[0].id,
        sellerId: updatedProducts[0].sellerId,
        alertType: 'restock_reminder',
        message: 'Restock reminder: Consider ordering more units of ' + updatedProducts[0].title,
        severity: 'medium' as const,
        isRead: false,
        isResolved: false,
      },
      {
        productId: updatedProducts[1].id,
        sellerId: updatedProducts[1].sellerId,
        alertType: 'high_demand',
        message: 'High demand alert: ' + updatedProducts[1].title + ' is selling faster than usual',
        severity: 'low' as const,
        isRead: true,
        isResolved: false,
      },
    ];

    await db.insert(inventoryAlerts).values(additionalAlerts);

    console.log("✅ Inventory management data seeded successfully!");
    console.log(`- Updated ${updatedProducts.length} products with inventory settings`);
    console.log(`- Created alerts for ${updatedProducts.filter(p => p.stock <= 15).length} low stock products`);
    console.log(`- Generated stock movement history for all products`);

  } catch (error) {
    console.error("❌ Error seeding inventory data:", error);
    throw error;
  }
}

// Auto-run when executed directly
seedInventoryData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });