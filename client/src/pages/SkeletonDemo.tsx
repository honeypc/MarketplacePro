import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  ProductGridSkeleton, 
  PropertyGridSkeleton, 
  TravelGridSkeleton, 
  DashboardStatsSkeleton,
  ProfileHeaderSkeleton,
  ProfileFormSkeleton,
  CartSkeleton
} from '@/components/skeletons';
import { ProductCard } from '@/components/ProductCard';
import { PropertyCard } from '@/components/PropertyCard';
import { RefreshCw } from 'lucide-react';

export default function SkeletonDemo() {
  const [activeTab, setActiveTab] = useState('products');
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/test/products-slow', refreshKey],
    enabled: activeTab === 'products',
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/test/properties-slow', refreshKey],
    enabled: activeTab === 'properties',
  });

  const { data: travels, isLoading: travelsLoading } = useQuery({
    queryKey: ['/api/test/travel-slow', refreshKey],
    enabled: activeTab === 'travel',
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Skeleton Loading Demo
              </h1>
              <p className="text-gray-600">
                Watch how our skeleton loading system provides smooth transitions while content loads
              </p>
            </div>
            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Demo
            </Button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">How It Works:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Each skeleton component mimics the exact layout of the real content</li>
              <li>• Skeleton animations provide visual feedback during loading</li>
              <li>• Seamless transitions from skeleton to real content</li>
              <li>• Improves perceived performance and user experience</li>
            </ul>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="travel">Travel</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="cart">Cart</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Grid Skeleton (2 second delay)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productsLoading ? (
                    <ProductGridSkeleton count={8} />
                  ) : (
                    products?.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Property Grid Skeleton (2.5 second delay)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {propertiesLoading ? (
                    <PropertyGridSkeleton count={8} />
                  ) : (
                    properties?.map((property: any) => (
                      <PropertyCard key={property.id} property={property} />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="travel">
            <Card>
              <CardHeader>
                <CardTitle>Travel Grid Skeleton (3 second delay)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {travelsLoading ? (
                    <TravelGridSkeleton count={6} />
                  ) : (
                    travels?.map((travel: any, index: number) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{travel.airline || 'Travel Item'}</h3>
                          <p className="text-sm text-gray-600">{travel.route || 'Route information'}</p>
                          <p className="text-lg font-bold text-blue-600 mt-2">
                            ${travel.price || '199'}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Statistics Skeleton</CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardStatsSkeleton />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Skeleton Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProfileHeaderSkeleton />
                <ProfileFormSkeleton />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cart">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart Skeleton</CardTitle>
              </CardHeader>
              <CardContent>
                <CartSkeleton items={4} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}