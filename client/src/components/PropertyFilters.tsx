import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Filter } from 'lucide-react';

interface PropertyFiltersProps {
  filters: {
    city?: string;
    propertyType?: string;
    roomType?: string;
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    checkIn?: string;
    checkOut?: string;
    instantBook?: boolean;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const cities = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Nha Trang', 'Đà Lạt', 'Phú Quốc', 'Sapa', 'Hội An', 'Vũng Tàu'
];

const propertyTypes = [
  { value: 'apartment', label: 'Căn hộ' },
  { value: 'house', label: 'Nhà riêng' },
  { value: 'villa', label: 'Biệt thự' },
  { value: 'studio', label: 'Studio' },
  { value: 'resort', label: 'Resort' },
  { value: 'hotel', label: 'Khách sạn' },
];

const roomTypes = [
  { value: 'entire_place', label: 'Toàn bộ chỗ ở' },
  { value: 'private_room', label: 'Phòng riêng' },
  { value: 'shared_room', label: 'Phòng chung' },
];

const amenities = [
  { value: 'wifi', label: 'WiFi' },
  { value: 'ac', label: 'Điều hòa' },
  { value: 'kitchen', label: 'Bếp' },
  { value: 'parking', label: 'Chỗ đậu xe' },
  { value: 'pool', label: 'Bể bơi' },
  { value: 'gym', label: 'Phòng tập' },
  { value: 'tv', label: 'TV' },
  { value: 'washing_machine', label: 'Máy giặt' },
  { value: 'fireplace', label: 'Lò sưởi' },
];

export function PropertyFilters({ filters, onFiltersChange, onClearFilters }: PropertyFiltersProps) {
  const priceRange = [filters.minPrice || 0, filters.maxPrice || 5000000];

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    onFiltersChange({
      ...filters,
      amenities: newAmenities,
    });
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof typeof filters] !== undefined && 
    filters[key as keyof typeof filters] !== '' &&
    !(Array.isArray(filters[key as keyof typeof filters]) && (filters[key as keyof typeof filters] as any[]).length === 0)
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location */}
        <div className="space-y-2">
          <Label>Địa điểm</Label>
          <Select value={filters.city || ''} onValueChange={(value) => onFiltersChange({ ...filters, city: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn thành phố" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label>Loại chỗ ở</Label>
          <Select value={filters.propertyType || ''} onValueChange={(value) => onFiltersChange({ ...filters, propertyType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại chỗ ở" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Room Type */}
        <div className="space-y-2">
          <Label>Loại phòng</Label>
          <Select value={filters.roomType || ''} onValueChange={(value) => onFiltersChange({ ...filters, roomType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại phòng" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Khoảng giá (VND/đêm)</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={5000000}
              min={0}
              step={100000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{priceRange[0].toLocaleString('vi-VN')} ₫</span>
              <span>{priceRange[1].toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <Label>Số khách</Label>
          <Select value={filters.guests?.toString() || ''} onValueChange={(value) => onFiltersChange({ ...filters, guests: parseInt(value) })}>
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

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label>Phòng ngủ</Label>
          <Select value={filters.bedrooms?.toString() || ''} onValueChange={(value) => onFiltersChange({ ...filters, bedrooms: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn số phòng ngủ" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(num => (
                <SelectItem key={num} value={num.toString()}>{num} phòng</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amenities */}
        <div className="space-y-2">
          <Label>Tiện nghi</Label>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map(amenity => (
              <div key={amenity.value} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.value}
                  checked={filters.amenities?.includes(amenity.value) || false}
                  onCheckedChange={() => handleAmenityToggle(amenity.value)}
                />
                <Label htmlFor={amenity.value} className="text-sm">{amenity.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Instant Book */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="instantBook"
            checked={filters.instantBook || false}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, instantBook: checked })}
          />
          <Label htmlFor="instantBook">Đặt ngay</Label>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <Label>Bộ lọc đang áp dụng</Label>
            <div className="flex flex-wrap gap-2">
              {filters.city && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.city}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ ...filters, city: undefined })} />
                </Badge>
              )}
              {filters.propertyType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {propertyTypes.find(t => t.value === filters.propertyType)?.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ ...filters, propertyType: undefined })} />
                </Badge>
              )}
              {filters.amenities?.map(amenity => (
                <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                  {amenities.find(a => a.value === amenity)?.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleAmenityToggle(amenity)} />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}