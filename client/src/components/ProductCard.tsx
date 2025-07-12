import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { openProductModal, addToLocalCart } = useStore();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/cart', {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product added to cart",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      
      // Optimistic update
      addToLocalCart({
        id: Date.now(), // temporary ID
        userId: '',
        productId: product.id,
        quantity: 1,
        createdAt: new Date(),
        product,
      });
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
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      if (isWishlisted) {
        // Remove from wishlist - would need wishlist item ID
        await apiRequest('DELETE', `/api/wishlist/${product.id}`);
      } else {
        // Add to wishlist
        await apiRequest('POST', '/api/wishlist', {
          productId: product.id,
        });
      }
    },
    onSuccess: () => {
      setIsWishlisted(!isWishlisted);
      toast({
        title: "Success",
        description: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
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
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }
    addToCartMutation.mutate();
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to manage your wishlist",
        variant: "destructive",
      });
      return;
    }
    toggleWishlistMutation.mutate();
  };

  const discountPercentage = product.originalPrice 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100)
    : 0;

  const hasDiscount = discountPercentage > 0;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <div className="relative">
        <div 
          className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center"
          onClick={() => setLocation(`/products/${product.id}`)}
        >
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white shadow-md"
          onClick={handleToggleWishlist}
          disabled={toggleWishlistMutation.isPending}
        >
          <Heart 
            className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </Button>
        
        {hasDiscount && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{discountPercentage}%
          </Badge>
        )}
        
        {product.stock === 0 && (
          <Badge className="absolute top-2 left-2 bg-gray-500 text-white">
            {t('product.outOfStock')}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 
          className="font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-primary"
          onClick={() => setLocation(`/products/${product.id}`)}
        >
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            (4.8) 1,234 {t('product.reviews')}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-800">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${parseFloat(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending || product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {t('product.addToCart')}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          {t('product.soldBy')}: Store Name
        </p>
      </CardContent>
    </Card>
  );
}
