import React, { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Filter, Grid, List, Eye, Star, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useWishlist, useRemoveFromWishlist, useAuth, useWishlistStore, useCartStore } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export default function Wishlist() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'price' | 'name'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Use the new hooks system
  const { data: wishlistItems = [], isLoading, error } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const { items: localWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign in to view your wishlist
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Save your favorite items and access them from anywhere
            </p>
            <div className="space-y-3">
              <Button onClick={() => setLocation('/login')} className="w-full">
                Sign In
              </Button>
              <Button onClick={() => setLocation('/register')} variant="outline" className="w-full">
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle removing item from wishlist
  const handleRemoveFromWishlist = async (wishlistId: number) => {
    try {
      await removeFromWishlistMutation.mutateAsync(wishlistId);
      toast({
        title: "Item removed",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle adding item to cart
  const handleAddToCart = (product: any) => {
    if (!product) return;
    
    addToCart({
      id: Date.now(),
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      images: product.images || [],
      sellerId: product.sellerId,
      stockQuantity: product.stockQuantity || 0
    });
    
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  // Filter and sort wishlist items
  const filteredItems = wishlistItems.filter(item => 
    item.product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.product?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return parseFloat(a.product?.price || '0') - parseFloat(b.product?.price || '0');
      case 'name':
        return (a.product?.title || '').localeCompare(b.product?.title || '');
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search wishlist items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Empty State */}
        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding items you love to your wishlist
            </p>
            <Button onClick={() => setLocation('/products')}>
              Browse Products
            </Button>
          </div>
        )}

        {/* Wishlist Items */}
        {sortedItems.length > 0 && (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {sortedItems.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <Card key={item.id} className={viewMode === 'list' ? 'p-4' : 'overflow-hidden'}>
                  {viewMode === 'grid' ? (
                    <div>
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={product.images?.[0] || '/placeholder.png'}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-2xl font-bold text-blue-600 mb-3">
                          ${product.price}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                              {product.rating || 0} ({product.reviewCount || 0})
                            </span>
                          </div>
                          {product.stockQuantity > 0 ? (
                            <Badge variant="outline" className="text-green-600">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1"
                            disabled={product.stockQuantity === 0}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setLocation(`/products/${product.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className="w-24 h-24 relative overflow-hidden rounded-lg">
                        <img
                          src={product.images?.[0] || '/placeholder.png'}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {product.title}
                        </h3>
                        <p className="text-xl font-bold text-blue-600 mb-2">
                          ${product.price}
                        </p>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                              {product.rating || 0} ({product.reviewCount || 0})
                            </span>
                          </div>
                          {product.stockQuantity > 0 ? (
                            <Badge variant="outline" className="text-green-600">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            size="sm"
                            disabled={product.stockQuantity === 0}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/products/${product.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}