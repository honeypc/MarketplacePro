import { ReactNode } from 'react';
import { Wifi, Utensils, Coffee, Waves, Dumbbell, Car, MapPin } from 'lucide-react';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const getAmenityIcon = (amenity: string): ReactNode => {
  const icons: Record<string, ReactNode> = {
    wifi: <Wifi className="h-4 w-4" />,
    restaurant: <Utensils className="h-4 w-4" />,
    spa: <Coffee className="h-4 w-4" />,
    pool: <Waves className="h-4 w-4" />,
    gym: <Dumbbell className="h-4 w-4" />,
    parking: <Car className="h-4 w-4" />,
    beach: <MapPin className="h-4 w-4" />
  };
  return icons[amenity] || <MapPin className="h-4 w-4" />;
};

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Natural Wonder': 'bg-green-100 text-green-800',
    'Historic Town': 'bg-amber-100 text-amber-800',
    'Beach Paradise': 'bg-blue-100 text-blue-800',
    'Mountain City': 'bg-purple-100 text-purple-800',
    'Mountain Adventure': 'bg-orange-100 text-orange-800',
    'Beach City': 'bg-cyan-100 text-cyan-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};
