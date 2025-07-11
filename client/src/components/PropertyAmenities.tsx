import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wifi, 
  Car, 
  Tv, 
  Waves, 
  Dumbbell, 
  ChefHat, 
  Snowflake, 
  Flame, 
  Shirt,
  Dog,
  Music,
  Mountain,
  Coffee,
  Utensils
} from 'lucide-react';

interface PropertyAmenitiesProps {
  amenities: string[];
  title?: string;
  showTitle?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const amenityConfig = {
  wifi: { icon: Wifi, label: 'WiFi', color: 'bg-blue-100 text-blue-800' },
  parking: { icon: Car, label: 'Chỗ đậu xe', color: 'bg-gray-100 text-gray-800' },
  tv: { icon: Tv, label: 'TV', color: 'bg-purple-100 text-purple-800' },
  pool: { icon: Waves, label: 'Bể bơi', color: 'bg-cyan-100 text-cyan-800' },
  gym: { icon: Dumbbell, label: 'Phòng tập', color: 'bg-orange-100 text-orange-800' },
  kitchen: { icon: ChefHat, label: 'Bếp', color: 'bg-green-100 text-green-800' },
  ac: { icon: Snowflake, label: 'Điều hòa', color: 'bg-blue-100 text-blue-800' },
  fireplace: { icon: Flame, label: 'Lò sưởi', color: 'bg-red-100 text-red-800' },
  washing_machine: { icon: Shirt, label: 'Máy giặt', color: 'bg-indigo-100 text-indigo-800' },
  pet_friendly: { icon: Dog, label: 'Thân thiện với thú cưng', color: 'bg-yellow-100 text-yellow-800' },
  music: { icon: Music, label: 'Âm thanh', color: 'bg-pink-100 text-pink-800' },
  mountain_view: { icon: Mountain, label: 'View núi', color: 'bg-emerald-100 text-emerald-800' },
  coffee: { icon: Coffee, label: 'Máy pha cà phê', color: 'bg-amber-100 text-amber-800' },
  restaurant: { icon: Utensils, label: 'Nhà hàng', color: 'bg-rose-100 text-rose-800' },
};

export function PropertyAmenities({ 
  amenities, 
  title = 'Tiện nghi', 
  showTitle = true, 
  variant = 'default' 
}: PropertyAmenitiesProps) {
  const getAmenityInfo = (amenity: string) => {
    return amenityConfig[amenity as keyof typeof amenityConfig] || {
      icon: Badge,
      label: amenity.charAt(0).toUpperCase() + amenity.slice(1),
      color: 'bg-gray-100 text-gray-800'
    };
  };

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {amenities.slice(0, 4).map((amenity) => {
          const { icon: Icon, label } = getAmenityInfo(amenity);
          return (
            <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600">
              <Icon className="h-3 w-3" />
              <span>{label}</span>
            </div>
          );
        })}
        {amenities.length > 4 && (
          <span className="text-xs text-gray-500">+{amenities.length - 4} tiện nghi</span>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {amenities.map((amenity) => {
              const { icon: Icon, label } = getAmenityInfo(amenity);
              return (
                <div key={amenity} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-gray-500">Có sẵn</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {showTitle && (
        <h3 className="font-semibold text-lg">{title}</h3>
      )}
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity) => {
          const { icon: Icon, label, color } = getAmenityInfo(amenity);
          return (
            <Badge key={amenity} variant="secondary" className={`${color} flex items-center gap-1`}>
              <Icon className="h-3 w-3" />
              <span className="text-xs">{label}</span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

export default PropertyAmenities;