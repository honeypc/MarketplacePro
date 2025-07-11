import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Star, Heart, Wifi, Car, Tv, Waves } from 'lucide-react';
import { useLocation } from 'wouter';

interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    description: string;
    propertyType: string;
    roomType: string;
    address: string;
    city: string;
    country: string;
    pricePerNight: number;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    images: string[];
    rating?: number;
    reviewCount?: number;
    isInstantBook?: boolean;
  };
  onWishlistToggle?: (propertyId: number) => void;
  isWishlisted?: boolean;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  wifi: <Wifi className="h-4 w-4" />,
  parking: <Car className="h-4 w-4" />,
  tv: <Tv className="h-4 w-4" />,
  pool: <Waves className="h-4 w-4" />,
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const getPropertyTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    apartment: 'Căn hộ',
    house: 'Nhà riêng',
    villa: 'Biệt thự',
    studio: 'Studio',
    resort: 'Resort',
    hotel: 'Khách sạn',
  };
  return labels[type] || type;
};

const getRoomTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    entire_place: 'Toàn bộ chỗ ở',
    private_room: 'Phòng riêng',
    shared_room: 'Phòng chung',
  };
  return labels[type] || type;
};

export function PropertyCard({ property, onWishlistToggle, isWishlisted }: PropertyCardProps) {
  const [, setLocation] = useLocation();

  const handleViewDetails = () => {
    setLocation(`/property/${property.id}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlistToggle?.(property.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <div className="relative" onClick={handleViewDetails}>
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {property.isInstantBook && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Đặt ngay
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-8 w-8 rounded-full bg-white/80 hover:bg-white ${
              isWishlisted ? 'text-red-500' : 'text-gray-600'
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-white/90">
            {getPropertyTypeLabel(property.propertyType)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3" onClick={handleViewDetails}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">{property.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{getRoomTypeLabel(property.roomType)}</p>
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.city}, {property.country}</span>
            </div>
          </div>
          {property.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{property.rating}</span>
              <span className="text-xs text-gray-500">({property.reviewCount || 0})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{property.maxGuests} khách</span>
          </div>
          <span>•</span>
          <span>{property.bedrooms} phòng ngủ</span>
          <span>•</span>
          <span>{property.bathrooms} phòng tắm</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {property.amenities.slice(0, 4).map((amenity) => (
            <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600">
              {amenityIcons[amenity] || <span className="w-4 h-4 bg-gray-200 rounded"></span>}
              <span className="capitalize">{amenity}</span>
            </div>
          ))}
          {property.amenities.length > 4 && (
            <span className="text-xs text-gray-500">+{property.amenities.length - 4} tiện nghi</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xl font-bold">{formatPrice(property.pricePerNight)}</span>
            <span className="text-gray-600 text-sm">/đêm</span>
          </div>
          <Button size="sm" variant="outline" onClick={handleViewDetails}>
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}