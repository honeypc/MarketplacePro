import React from 'react';
import { 
  useProducts, 
  useCategories, 
  useCart, 
  useWishlist, 
  useCartStore, 
  useWishlistStore, 
  useUIStore, 
  useSearchStore,
  useAuth,
  usePermissions,
  useDebounce,
  useLocalStorage 
} from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// Example component demonstrating the new hooks system
export function HooksExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [userPreference, setUserPreference] = useLocalStorage('user-preference', 'default');

  // Authentication and permissions
  const { user, isAuthenticated, loginMutation } = useAuth();
  const { canManageProducts, canAccessSellerDashboard } = usePermissions();

  // Data fetching hooks
  const { data: products, isLoading: productsLoading } = useProducts({
    search: debouncedSearchTerm,
    limit: 12
  });
  const { data: categories } = useCategories();
  const { data: cartItems } = useCart();
  const { data: wishlistItems } = useWishlist();

  // Zustand stores
  const { 
    items: cartStoreItems, 
    totalItems, 
    totalPrice, 
    addItem, 
    removeItem,
    toggleCart 
  } = useCartStore();
  
  const { 
    items: wishlistStoreItems, 
    addItem: addToWishlist, 
    removeItem: removeFromWishlist,
    isItemInWishlist 
  } = useWishlistStore();

  const { 
    theme, 
    language, 
    setTheme, 
    setLanguage,
    openModal,
    setLoading
  } = useUIStore();

  const { 
    filters, 
    setQuery, 
    setCategory, 
    clearFilters,
    hasActiveFilters,
    getFilterCount 
  } = useSearchStore();

  const handleAddToCart = (product: any) => {
    addItem({
      id: Date.now(),
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      images: product.images,
      sellerId: product.sellerId,
      stockQuantity: product.stockQuantity
    });
  };

  const handleAddToWishlist = (product: any) => {
    addToWishlist({
      id: Date.now(),
      productId: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
      sellerId: product.sellerId,
      addedAt: new Date().toISOString()
    });
  };

  const handleLogin = () => {
    loginMutation.mutate({
      email: 'admin@marketplacepro.com',
      password: 'admin123'
    });
  };

  if (productsLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hooks System Demo</CardTitle>
          <CardDescription>
            Demonstrating the comprehensive hooks system with Zustand and TanStack Query
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Authentication Status */}
          <div className="space-y-2">
            <h3 className="font-semibold">Authentication Status</h3>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Badge variant="default">
                  Logged in as {user?.firstName} {user?.lastName} ({user?.role})
                </Badge>
              ) : (
                <Badge variant="secondary">Not authenticated</Badge>
              )}
              {!isAuthenticated && (
                <Button onClick={handleLogin} size="sm">
                  Login as Admin
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Badge variant={canManageProducts() ? "default" : "secondary"}>
                Can Manage Products: {canManageProducts() ? "Yes" : "No"}
              </Badge>
              <Badge variant={canAccessSellerDashboard() ? "default" : "secondary"}>
                Can Access Seller Dashboard: {canAccessSellerDashboard() ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-2">
            <h3 className="font-semibold">Search & Filters</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => setQuery(searchTerm)}>
                Apply Search
              </Button>
            </div>
            <div className="flex gap-2">
              <Badge variant={hasActiveFilters() ? "default" : "secondary"}>
                Active Filters: {getFilterCount()}
              </Badge>
              {hasActiveFilters() && (
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Cart State */}
          <div className="space-y-2">
            <h3 className="font-semibold">Cart State (Zustand)</h3>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                Items: {totalItems}
              </Badge>
              <Badge variant="default">
                Total: ${totalPrice.toFixed(2)}
              </Badge>
              <Button onClick={toggleCart} variant="outline" size="sm">
                Toggle Cart
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              Cart items: {cartStoreItems.length} | 
              Wishlist items: {wishlistStoreItems.length}
            </div>
          </div>

          {/* Theme and Language */}
          <div className="space-y-2">
            <h3 className="font-semibold">UI Settings</h3>
            <div className="flex gap-2">
              <Button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                variant="outline"
                size="sm"
              >
                Theme: {theme}
              </Button>
              <Button
                onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
                variant="outline"
                size="sm"
              >
                Language: {language}
              </Button>
            </div>
          </div>

          {/* Local Storage Demo */}
          <div className="space-y-2">
            <h3 className="font-semibold">Local Storage</h3>
            <div className="flex gap-2">
              <Input
                value={userPreference}
                onChange={(e) => setUserPreference(e.target.value)}
                placeholder="User preference"
              />
              <Badge variant="outline">
                Saved: {userPreference}
              </Badge>
            </div>
          </div>

          {/* Products Grid */}
          <div className="space-y-2">
            <h3 className="font-semibold">Products ({products?.length || 0})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products?.slice(0, 8).map((product: any) => (
                <Card key={product.id} className="p-3">
                  <div className="aspect-square bg-gray-100 rounded mb-2">
                    {product.images?.[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">
                    {product.title}
                  </h4>
                  <p className="text-lg font-semibold text-blue-600 mb-2">
                    ${product.price}
                  </p>
                  <div className="flex gap-1">
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      className="flex-1"
                    >
                      Cart
                    </Button>
                    <Button 
                      onClick={() => handleAddToWishlist(product)}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      ♥
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="font-semibold">Categories ({categories?.length || 0})</h3>
            <div className="flex flex-wrap gap-2">
              {categories?.slice(0, 8).map((category: any) => (
                <Badge 
                  key={category.id} 
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}