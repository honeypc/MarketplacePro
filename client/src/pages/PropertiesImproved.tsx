import React, { useState } from 'react';
import { useSearchProperties } from '@/hooks/useProperties';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, Users, Star, Calendar, Grid, Map, List, Filter, SlidersHorizontal } from 'lucide-react';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters } from '@/components/PropertyFilters';
import { PropertyMap } from '@/components/PropertyMap';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Properties() {
  const [filters, setFilters] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    propertyType: '',
    roomType: '',
    minPrice: 0,
    maxPrice: 5000000,
    amenities: [] as string[],
    instantBook: false,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [selectedProperty, setSelectedProperty] = useState<number | undefined>();
  const [, setLocation] = useLocation();

  const { data: properties, isLoading, error } = useSearchProperties(filters);

  const handleSearch = () => {
    // Trigger search with current filters
    console.log('Searching with filters:', filters);
  };

  const handleClearFilters = () => {
    setFilters({
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: '',
      propertyType: '',
      roomType: '',
      minPrice: 0,
      maxPrice: 5000000,
      amenities: [],
      instantBook: false,
    });
  };

  const handleWishlistToggle = (propertyId: number) => {
    // TODO: Implement wishlist functionality
    console.log('Toggle wishlist for property:', propertyId);
  };

  const handlePropertySelect = (propertyId: number) => {
    setSelectedProperty(propertyId);
    setLocation(`/property/${propertyId}`);
  };

  const renderPropertyGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Card className="p-8 text-center">
          <p className="text-red-500">Có lỗi xảy ra khi tải danh sách chỗ ở. Vui lòng thử lại.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Thử lại
          </Button>
        </Card>
      );
    }

    if (!properties || properties.length === 0) {
      return (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy chỗ ở nào</h3>
          <p className="text-gray-600 mb-4">
            Thử thay đổi bộ lọc hoặc tìm kiếm để xem thêm kết quả
          </p>
          <Button onClick={handleClearFilters} variant="outline">
            Xóa bộ lọc
          </Button>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onWishlistToggle={handleWishlistToggle}
            isWishlisted={false} // TODO: Implement wishlist state
          />
        ))}
      </div>
    );
  };

  const renderPropertyList = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (error || !properties || properties.length === 0) {
      return renderPropertyGrid();
    }

    return (
      <div className="space-y-4">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-24 h-24 object-cover rounded cursor-pointer"
                  onClick={() => handlePropertySelect(property.id)}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg cursor-pointer hover:text-primary"
                        onClick={() => handlePropertySelect(property.id)}>
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {property.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{property.rating}</span>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWishlistToggle(property.id)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.city}, {property.country}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{property.maxGuests} khách</span>
                    </div>
                    <span>•</span>
                    <span>{property.bedrooms} phòng ngủ</span>
                    <span>•</span>
                    <span>{property.bathrooms} phòng tắm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(property.pricePerNight)}
                      <span className="text-sm font-normal text-gray-600">/đêm</span>
                    </span>
                    <Button onClick={() => handlePropertySelect(property.id)}>
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="destination" className="text-sm font-medium">Điểm đến</Label>
                <Input
                  id="destination"
                  placeholder="Tìm kiếm điểm đến..."
                  value={filters.destination}
                  onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="checkIn" className="text-sm font-medium">Nhận phòng</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={filters.checkIn}
                  onChange={(e) => setFilters(prev => ({ ...prev, checkIn: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="checkOut" className="text-sm font-medium">Trả phòng</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={filters.checkOut}
                  onChange={(e) => setFilters(prev => ({ ...prev, checkOut: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="guests" className="text-sm font-medium">Số khách</Label>
                <Select value={filters.guests} onValueChange={(value) => setFilters(prev => ({ ...prev, guests: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn số khách" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} khách</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 space-y-6">
            <PropertyFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">
                  {properties ? `${properties.length} chỗ ở` : 'Đang tải...'}
                </h2>
                {filters.destination && (
                  <Badge variant="secondary">
                    {filters.destination}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filters */}
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <PropertyFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClearFilters={handleClearFilters}
                    />
                  </SheetContent>
                </Sheet>

                {/* View Mode Toggle */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {viewMode === 'grid' && renderPropertyGrid()}
            {viewMode === 'list' && renderPropertyList()}
            {viewMode === 'map' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-1">
                  {renderPropertyGrid()}
                </div>
                <div className="lg:col-span-1">
                  <PropertyMap
                    properties={properties || []}
                    selectedProperty={selectedProperty}
                    onPropertySelect={handlePropertySelect}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}