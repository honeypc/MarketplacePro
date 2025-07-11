import React, { useState } from 'react';
import { useAuth, useProducts, useCart, useAddToCart, useCartStore } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TestCart() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { data: products = [] } = useProducts({ limit: 3 });
  const { data: cartItems = [] } = useCart();
  const addToCartMutation = useAddToCart();
  const { items: localCartItems, addItem, totalItems, totalPrice } = useCartStore();

  const handleAddToCart = async (product: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
      });
      
      // Also add to local store
      addItem({
        id: Date.now(),
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        images: product.images || [],
        sellerId: product.sellerId,
        stockQuantity: product.stock || 0
      });

      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Cart Test Page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Auth Status */}
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <Badge variant={isAuthenticated ? "default" : "destructive"}>
              {isAuthenticated ? `Logged in as ${user?.email}` : "Not logged in"}
            </Badge>
          </div>

          {/* Cart Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Cart Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Server Cart Items</p>
                <Badge variant="outline">{cartItems.length}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Local Cart Items</p>
                <Badge variant="outline">{localCartItems.length}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <Badge variant="outline">{totalItems}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Price</p>
                <Badge variant="outline">${totalPrice.toFixed(2)}</Badge>
              </div>
            </div>
          </div>

          {/* Test Products */}
          <div>
            <h3 className="font-semibold mb-4">Test Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.slice(0, 3).map((product: any) => (
                <Card key={product.id} className="p-4">
                  <div className="aspect-square bg-gray-100 rounded mb-3">
                    {product.images?.[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <h4 className="font-medium mb-2 line-clamp-2">{product.title}</h4>
                  <p className="text-xl font-bold text-blue-600 mb-3">${product.price}</p>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full"
                    disabled={addToCartMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Server Cart Items */}
          {cartItems.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Server Cart Items</h3>
              <div className="space-y-2">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <h4 className="font-medium">{item.product?.title}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${item.product?.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}