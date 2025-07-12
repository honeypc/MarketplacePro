import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bus, 
  Calendar, 
  Users, 
  Clock,
  Star,
  ArrowRight,
  Filter,
  MapPin,
  Wifi,
  Utensils,
  Zap,
  Armchair
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { format } from 'date-fns';
import BookingDialog from './BookingDialog';

export default function BusSearch() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departure: '',
    passengers: 1
  });
  const [showResults, setShowResults] = useState(false);
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const handleSearch = () => {
    setShowResults(true);
  };

  const sampleBuses = [
    {
      id: 1,
      operator: 'Phuong Trang',
      logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100',
      routeNumber: 'PT001',
      departure: { time: '06:00', station: 'Ben Xe Mien Dong', city: 'Ho Chi Minh City' },
      arrival: { time: '12:30', station: 'Ben Xe My Dinh', city: 'Hanoi' },
      duration: '6h 30m',
      price: 450000,
      originalPrice: 550000,
      busType: 'VIP Sleeper',
      amenities: ['wifi', 'ac', 'charging', 'blanket', 'water'],
      seats: 28,
      availableSeats: 12,
      rating: 4.6,
      facilities: ['reclining_seats', 'onboard_toilet', 'entertainment']
    },
    {
      id: 2,
      operator: 'Hoang Long',
      logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100',
      routeNumber: 'HL245',
      departure: { time: '08:15', station: 'Ben Xe Mien Dong', city: 'Ho Chi Minh City' },
      arrival: { time: '14:45', station: 'Ben Xe My Dinh', city: 'Hanoi' },
      duration: '6h 30m',
      price: 380000,
      originalPrice: 420000,
      busType: 'Limousine',
      amenities: ['wifi', 'ac', 'charging', 'snacks'],
      seats: 22,
      availableSeats: 8,
      rating: 4.4,
      facilities: ['reclining_seats', 'onboard_toilet']
    },
    {
      id: 3,
      operator: 'Thanh Buoi',
      logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100',
      routeNumber: 'TB789',
      departure: { time: '22:00', station: 'Ben Xe Mien Dong', city: 'Ho Chi Minh City' },
      arrival: { time: '04:30', station: 'Ben Xe My Dinh', city: 'Hanoi' },
      duration: '6h 30m',
      price: 520000,
      originalPrice: 650000,
      busType: 'Double Decker Sleeper',
      amenities: ['wifi', 'ac', 'charging', 'blanket', 'pillow', 'meals'],
      seats: 34,
      availableSeats: 15,
      rating: 4.8,
      facilities: ['full_bed', 'onboard_toilet', 'entertainment', 'personal_tv']
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'ac': return <Zap className="h-4 w-4" />;
      case 'charging': return <Zap className="h-4 w-4" />;
      case 'meals': case 'snacks': return <Utensils className="h-4 w-4" />;
      case 'blanket': case 'pillow': return <Armchair className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            {t('searchBuses')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>{t('from')}</Label>
              <Select value={searchParams.from} onValueChange={(value) => setSearchParams(prev => ({ ...prev, from: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDeparture')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hcmc">Ho Chi Minh City</SelectItem>
                  <SelectItem value="hanoi">Hanoi</SelectItem>
                  <SelectItem value="danang">Da Nang</SelectItem>
                  <SelectItem value="nhatrang">Nha Trang</SelectItem>
                  <SelectItem value="hue">Hue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('to')}</Label>
              <Select value={searchParams.to} onValueChange={(value) => setSearchParams(prev => ({ ...prev, to: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDestination')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hcmc">Ho Chi Minh City</SelectItem>
                  <SelectItem value="hanoi">Hanoi</SelectItem>
                  <SelectItem value="danang">Da Nang</SelectItem>
                  <SelectItem value="nhatrang">Nha Trang</SelectItem>
                  <SelectItem value="hue">Hue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('departure')}</Label>
              <Input
                type="date"
                value={searchParams.departure}
                onChange={(e) => setSearchParams(prev => ({ ...prev, departure: e.target.value }))}
              />
            </div>

            <div>
              <Label>{t('passengers')}</Label>
              <Select value={searchParams.passengers.toString()} onValueChange={(value) => setSearchParams(prev => ({ ...prev, passengers: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Passenger</SelectItem>
                  <SelectItem value="2">2 Passengers</SelectItem>
                  <SelectItem value="3">3 Passengers</SelectItem>
                  <SelectItem value="4">4 Passengers</SelectItem>
                  <SelectItem value="5">5+ Passengers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSearch} className="w-full bg-green-600 hover:bg-green-700">
            <Bus className="h-4 w-4 mr-2" />
            {t('searchBuses')}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {showResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('availableBuses')}</h3>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t('filters')}
            </Button>
          </div>

          {sampleBuses.map((bus) => (
            <Card key={bus.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={bus.logo}
                      alt={bus.operator}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{bus.operator}</h4>
                      <p className="text-sm text-gray-600">{bus.routeNumber} • {bus.busType}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <p className="text-xl font-bold">{bus.departure.time}</p>
                      <p className="text-sm text-gray-600 max-w-24 truncate">{bus.departure.station}</p>
                      <p className="text-xs text-gray-500">{bus.departure.city}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <div className="h-px bg-gray-300 w-16"></div>
                        <Bus className="h-4 w-4 text-gray-400" />
                        <div className="h-px bg-gray-300 w-16"></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{bus.duration}</p>
                      <p className="text-xs text-gray-500">Direct</p>
                    </div>

                    <div className="text-center">
                      <p className="text-xl font-bold">{bus.arrival.time}</p>
                      <p className="text-sm text-gray-600 max-w-24 truncate">{bus.arrival.station}</p>
                      <p className="text-xs text-gray-500">{bus.arrival.city}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{bus.rating}</span>
                    </div>
                    <div className="mb-2">
                      {bus.originalPrice > bus.price && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatCurrency(bus.originalPrice)}
                        </p>
                      )}
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(bus.price)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {bus.availableSeats} / {bus.seats} seats left
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setSelectedBus({
                          ...bus,
                          type: 'transport',
                          route: `${bus.departure.city} → ${bus.arrival.city}`,
                          date: searchParams.departure,
                          time: `${bus.departure.time} - ${bus.arrival.time}`
                        });
                        setShowBookingDialog(true);
                      }}
                    >
                      {t('select')}
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {bus.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            {getAmenityIcon(amenity)}
                            <span className="text-xs text-gray-500 capitalize">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {bus.facilities.map((facility, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {facility.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <BookingDialog
        open={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        bookingData={selectedBus}
        onConfirm={(booking) => {
          console.log('Bus booked:', booking);
          setShowBookingDialog(false);
        }}
      />
    </div>
  );
}