import React from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useTranslation } from "@/lib/i18n";
import { useStore } from "@/store/useStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { CartSkeleton } from "@/components/skeletons";

export function ShoppingCart() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    setCartItems, 
    removeFromLocalCart,
    updateLocalCartQuantity 
  } = useStore();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: cartData = [], isLoading } = useQuery({
    queryKey: ['/api/cart'],
    enabled: isAuthenticated,
  });

  // Sync cart data from API
  React.useEffect(() => {
    if (cartData.length > 0) {
      setCartItems(cartData);
    }
  }, [cartData, setCartItems]);

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      await apiRequest('PUT', `/api/cart/${id}`, { quantity });
    },
    onMutate: async ({ id, quantity }) => {
      // Optimistic update
      updateLocalCartQuantity(id, quantity);
    },
    onError: (error, { id }) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/cart/${id}`);
    },
    onMutate: async (id) => {
      // Optimistic update
      removeFromLocalCart(id);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItemMutation.mutate(id);
    } else {
      updateQuantityMutation.mutate({ id, quantity });
    }
  };

  const handleProceedToCheckout = () => {
    closeCart();
    setLocation('/checkout');
  };

  const total = cartItems.reduce((sum, item) => {
    const price = item.product?.price ? parseFloat(item.product.price) : 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            {t('cart.title')}
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <CartSkeleton items={3} />
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('cart.empty')}</p>
                <Button variant="outline" onClick={closeCart} className="mt-4">
                  {t('cart.continueShopping')}
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {item.product?.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.product?.title}</h3>
                      <p className="text-sm text-gray-600">
                        ${item.product?.price ? parseFloat(item.product.price).toFixed(2) : '0.00'}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={updateQuantityMutation.isPending}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updateQuantityMutation.isPending}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItemMutation.mutate(item.id)}
                      disabled={removeItemMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
          
          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">{t('cart.total')}:</span>
                <span className="text-xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
              
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white"
                onClick={handleProceedToCheckout}
                disabled={!isAuthenticated}
              >
                {t('cart.proceedToCheckout')}
              </Button>
              
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Please login to proceed to checkout
                </p>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
