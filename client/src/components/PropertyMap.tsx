import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation } from 'lucide-react';

interface PropertyMapProps {
  properties: Array<{
    id: number;
    title: string;
    city: string;
    country: string;
    pricePerNight: number;
    latitude?: number;
    longitude?: number;
    images: string[];
  }>;
  selectedProperty?: number;
  onPropertySelect?: (propertyId: number) => void;
}

export function PropertyMap({ properties, selectedProperty, onPropertySelect }: PropertyMapProps) {
  const [selectedCity, setSelectedCity] = useState<string>('');

  // Group properties by city
  const citiesWithProperties = properties.reduce((acc, property) => {
    if (!acc[property.city]) {
      acc[property.city] = [];
    }
    acc[property.city].push(property);
    return acc;
  }, {} as { [key: string]: typeof properties });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Bản đồ chỗ ở
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Interactive Map Placeholder */}
        <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
          <div className="text-center">
            <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Bản đồ tương tác</p>
            <p className="text-xs text-gray-400">Tích hợp Google Maps/Mapbox</p>
          </div>
        </div>

        {/* Cities List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Các thành phố có chỗ ở</h3>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(citiesWithProperties).map(([city, cityProperties]) => (
              <div
                key={city}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedCity === city ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCity(selectedCity === city ? '' : city)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{city}</span>
                  </div>
                  <Badge variant="secondary">
                    {cityProperties.length} chỗ ở
                  </Badge>
                </div>
                
                {selectedCity === city && (
                  <div className="mt-3 space-y-2">
                    {cityProperties.map(property => (
                      <div
                        key={property.id}
                        className={`p-2 rounded border-l-4 cursor-pointer transition-colors ${
                          selectedProperty === property.id 
                            ? 'border-l-primary bg-primary/5' 
                            : 'border-l-gray-200 hover:border-l-gray-300'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPropertySelect?.(property.id);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm line-clamp-1">{property.title}</h4>
                            <p className="text-xs text-gray-500">{formatPrice(property.pricePerNight)}/đêm</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map Legend */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Chú thích</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Chỗ ở được chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Chỗ ở có sẵn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span>Chỗ ở đã được đặt</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}