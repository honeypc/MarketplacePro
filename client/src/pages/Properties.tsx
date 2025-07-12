import React, { useState } from 'react';
import { useSearchProperties } from '@/hooks/useProperties';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, Users, Star, Calendar, Home, Building2, TreePine, Waves, Heart, Filter, Grid, Map, List } from 'lucide-react';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters } from '@/components/PropertyFilters';
import { PropertyMap } from '@/components/PropertyMap';
import { PropertyGridSkeleton } from '@/components/skeletons';
import { useLocation } from 'wouter';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const amenitiesOptions = [
  { value: 'wifi', label: 'WiFi', icon: '📶' },
  { value: 'parking', label: 'Parking', icon: '🅿️' },
  { value: 'pool', label: 'Pool', icon: '🏊' },
  { value: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { value: 'ac', label: 'Air Conditioning', icon: '❄️' },
  { value: 'gym', label: 'Gym', icon: '🏋️' },
  { value: 'pet_friendly', label: 'Pet Friendly', icon: '🐕' },
  { value: 'tv', label: 'TV', icon: '📺' },
  { value: 'washing_machine', label: 'Washing Machine', icon: '🧺' },
  { value: 'fireplace', label: 'Fireplace', icon: '🔥' },
];

const propertyTypes = [
  { value: 'apartment', label: 'Apartment', icon: Building2 },
  { value: 'house', label: 'House', icon: Home },
  { value: 'villa', label: 'Villa', icon: TreePine },
  { value: 'condo', label: 'Condo', icon: Building2 },
  { value: 'studio', label: 'Studio', icon: Building2 },
  { value: 'resort', label: 'Resort', icon: Waves },
];

const roomTypes = [
  { value: 'entire_place', label: 'Entire place' },
  { value: 'private_room', label: 'Private room' },
  { value: 'shared_room', label: 'Shared room' },
];

export default function Properties() {
  const [filters, setFilters] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    propertyType: '',
    roomType: '',
    minPrice: 0,
    maxPrice: 1000,
    amenities: [] as string[],
  });

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [, setLocation] = useLocation();

  const { data: properties, isLoading, error } = useSearchProperties(filters);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, minPrice: priceRange[0], maxPrice: priceRange[1] }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: '',
      propertyType: '',
      roomType: '',
      minPrice: 0,
      maxPrice: 1000,
      amenities: [],
    });
    setPriceRange([0, 1000]);
  };

  const getPropertyIcon = (type: string) => {
    const propertyType = propertyTypes.find(pt => pt.value === type);
    return propertyType ? propertyType.icon : Home;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Khám phá chỗ ở tuyệt vời
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Tìm kiếm và đặt chỗ ở hoàn hảo cho chuyến đi của bạn
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <Label htmlFor="destination">Điểm đến</Label>
              <Input
                id="destination"
                type="text"
                placeholder="Nhập thành phố, quốc gia..."
                value={filters.destination}
                onChange={(e) => setFilters(prev => ({ ...prev, destination: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="check-in">Nhận phòng</Label>
              <Input
                id="check-in"
                type="date"
                value={filters.checkIn}
                onChange={(e) => setFilters(prev => ({ ...prev, checkIn: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="check-out">Trả phòng</Label>
              <Input
                id="check-out"
                type="date"
                value={filters.checkOut}
                onChange={(e) => setFilters(prev => ({ ...prev, checkOut: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="guests">Số khách</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                placeholder="1"
                value={filters.guests}
                onChange={(e) => setFilters(prev => ({ ...prev, guests: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Loại chỗ ở</Label>
                  <Select value={filters.propertyType} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn loại chỗ ở" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Loại phòng</Label>
                  <Select value={filters.roomType} onValueChange={(value) => setFilters(prev => ({ ...prev, roomType: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Khoảng giá (VND/đêm)</Label>
                  <div className="mt-2 px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={2000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Tiện nghi</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                  {amenitiesOptions.map(amenity => (
                    <Button
                      key={amenity.value}
                      variant={filters.amenities.includes(amenity.value) ? "default" : "outline"}
                      onClick={() => handleAmenityToggle(amenity.value)}
                      className="h-auto p-2 flex items-center gap-2"
                    >
                      <span>{amenity.icon}</span>
                      <span className="text-xs">{amenity.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
                <Button onClick={handleSearch}>
                  Áp dụng bộ lọc
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <PropertyGridSkeleton count={8} />
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.</p>
          </div>
        ) : properties?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">Không tìm thấy chỗ ở phù hợp. Hãy thử thay đổi bộ lọc.</p>
          </div>
        ) : (
          properties?.map((property: any) => {
            const PropertyIcon = getPropertyIcon(property.propertyType);
            return (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative">
                  <img
                    src={property.images?.[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      <PropertyIcon className="h-3 w-3 mr-1" />
                      {propertyTypes.find(pt => pt.value === property.propertyType)?.label}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{property.rating?.toFixed(1) || 'Mới'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{property.city}, {property.country}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{property.maxGuests} khách</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{property.bedrooms} phòng ngủ</span>
                    </div>
                  </div>
                  
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.amenities.slice(0, 3).map((amenity: string) => {
                        const amenityInfo = amenitiesOptions.find(a => a.value === amenity);
                        return amenityInfo ? (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenityInfo.icon} {amenityInfo.label}
                          </Badge>
                        ) : null;
                      })}
                      {property.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 3} tiện nghi
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">{formatPrice(property.pricePerNight)}</span>
                      <span className="text-gray-600 text-sm">/đêm</span>
                    </div>
                    <Button 
                      onClick={() => setLocation(`/property/${property.id}`)}
                      size="sm"
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}