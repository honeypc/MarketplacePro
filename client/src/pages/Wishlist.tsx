import React, { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Filter, Grid, List, Eye, Star, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useI18n } from '@/lib/i18n';
import { isUnauthorizedError } from '@/lib/authUtils';
import type { Product, WishlistItem } from '@shared/schema';

interface WishlistItemWithProduct extends WishlistItem {
  product: Product;
}

export default function Wishlist() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { addToLocalCart } = useStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'price' | 'name'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  // Fetch wishlist items
  const { data: wishlistItems = [], isLoading, error } = useQuery<WishlistItemWithProduct[]>({
    queryKey: ['/api/wishlist'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/wishlist');
        return response.json();
      } catch (error: any) {
        if (isUnauthorizedError(error)) {
          toast({
            title: "Session expired",
            description: "Please log in again to view your wishlist.",
            variant: "destructive",
          });
          setLocation('/login');
        }
        throw error;
      }
    },
    enabled: isAuthenticated,
  });

  // Remove from wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (wishlistId: number) => {
      const response = await apiRequest('DELETE', `/api/wishlist/${wishlistId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your wishlist.",
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        setLocation('/login');
      } else {
        toast({
          title: "Error",
          description: "Failed to remove item from wishlist.",
          variant: "destructive",
        });
      }
    },
  });

  // Add to cart
  const addToCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest('POST', '/api/cart', {
        productId,
        quantity: 1
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        setLocation('/login');
      } else {
        toast({
          title: "Error",
          description: "Failed to add item to cart.",
          variant: "destructive",
        });
      }
    },
  });

  // Filter and sort items
  const filteredAndSortedItems = wishlistItems
    .filter(item => 
      item.product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return Number(a.product?.price || 0) - Number(b.product?.price || 0);
        case 'name':
          return (a.product?.title || '').localeCompare(b.product?.title || '');
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleRemoveFromWishlist = (wishlistId: number) => {
    removeFromWishlistMutation.mutate(wishlistId);
  };

  const handleAddToCart = (productId: number) => {
    addToCartMutation.mutate(productId);
  };

  const handleViewProduct = (productId: number) => {
    setLocation(`/products/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
              <p className="text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Error loading wishlist</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              There was an error loading your wishlist. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <Badge variant="secondary" className="ml-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Keep track of items you want to buy later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-24 w-24 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding items to your wishlist to keep track of products you love!
            </p>
            <Button onClick={() => setLocation('/products')} size="lg">
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search wishlist items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(value: 'recent' | 'price' | 'name') => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="price">Price: Low to High</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Items */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="relative aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'}
                          alt={item.product?.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => handleViewProduct(item.product.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white shadow-sm"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          disabled={removeFromWishlistMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-primary"
                            onClick={() => handleViewProduct(item.product.id)}>
                          {item.product?.title}
                        </h3>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">
                            ${Number(item.product?.price || 0).toFixed(2)}
                          </span>
                          {item.product?.stock === 0 && (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>4.5</span>
                          <span className="text-gray-400">(123)</span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleAddToCart(item.product.id)}
                            disabled={addToCartMutation.isPending || item.product?.stock === 0}
                            className="flex-1"
                            size="sm"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProduct(item.product.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                            alt={item.product?.title}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => handleViewProduct(item.product.id)}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-primary"
                              onClick={() => handleViewProduct(item.product.id)}>
                            {item.product?.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {item.product?.description}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold text-primary">
                              ${Number(item.product?.price || 0).toFixed(2)}
                            </span>
                            
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>4.5</span>
                              <span className="text-gray-400">(123)</span>
                            </div>
                            
                            {item.product?.stock === 0 && (
                              <Badge variant="destructive">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleAddToCart(item.product.id)}
                            disabled={addToCartMutation.isPending || item.product?.stock === 0}
                            size="sm"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProduct(item.product.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            disabled={removeFromWishlistMutation.isPending}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredAndSortedItems.length === 0 && searchQuery && (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No items found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No items match your search criteria. Try adjusting your search or filters.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}