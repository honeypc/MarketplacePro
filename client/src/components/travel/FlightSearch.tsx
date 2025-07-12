import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plane, 
  Calendar, 
  Users, 
  Clock,
  Star,
  ArrowRight,
  Filter,
  MapPin,
  Wifi,
  Utensils,
  Luggage
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { format } from 'date-fns';

export default function FlightSearch() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    passengers: 1,
    class: 'economy'
  });
  const [tripType, setTripType] = useState('roundtrip');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setShowResults(true);
  };

  const sampleFlights = [
    {
      id: 1,
      airline: 'Vietnam Airlines',
      logo: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=100',
      flightNumber: 'VN123',
      departure: { time: '08:00', airport: 'SGN', city: 'Ho Chi Minh City' },
      arrival: { time: '10:30', airport: 'HAN', city: 'Hanoi' },
      duration: '2h 30m',
      price: 2500000,
      originalPrice: 3000000,
      class: 'Economy',
      amenities: ['wifi', 'meals', 'entertainment'],
      aircraft: 'Boeing 737',
      baggage: '20kg',
      rating: 4.5,
      stops: 0
    },
    {
      id: 2,
      airline: 'VietJet Air',
      logo: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=100',
      flightNumber: 'VJ456',
      departure: { time: '14:15', airport: 'SGN', city: 'Ho Chi Minh City' },
      arrival: { time: '16:45', airport: 'HAN', city: 'Hanoi' },
      duration: '2h 30m',
      price: 1800000,
      originalPrice: 2200000,
      class: 'Economy',
      amenities: ['wifi', 'snacks'],
      aircraft: 'Airbus A320',
      baggage: '15kg',
      rating: 4.2,
      stops: 0
    },
    {
      id: 3,
      airline: 'Bamboo Airways',
      logo: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=100',
      flightNumber: 'QH789',
      departure: { time: '19:30', airport: 'SGN', city: 'Ho Chi Minh City' },
      arrival: { time: '22:00', airport: 'HAN', city: 'Hanoi' },
      duration: '2h 30m',
      price: 2200000,
      originalPrice: 2800000,
      class: 'Economy',
      amenities: ['wifi', 'meals', 'entertainment', 'extra_legroom'],
      aircraft: 'Boeing 787',
      baggage: '25kg',
      rating: 4.7,
      stops: 0
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'meals': case 'snacks': return <Utensils className="h-4 w-4" />;
      case 'entertainment': return <Star className="h-4 w-4" />;
      case 'extra_legroom': return <Users className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            {t('searchFlights')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trip Type */}
          <div className="flex gap-4">
            <Label className="flex items-center gap-2">
              <input
                type="radio"
                value="roundtrip"
                checked={tripType === 'roundtrip'}
                onChange={(e) => setTripType(e.target.value)}
                className="rounded"
              />
              {t('roundTrip')}
            </Label>
            <Label className="flex items-center gap-2">
              <input
                type="radio"
                value="oneway"
                checked={tripType === 'oneway'}
                onChange={(e) => setTripType(e.target.value)}
                className="rounded"
              />
              {t('oneWay')}
            </Label>
          </div>

          {/* Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label>{t('from')}</Label>
              <Select value={searchParams.from} onValueChange={(value) => setSearchParams(prev => ({ ...prev, from: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDeparture')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SGN">Ho Chi Minh City (SGN)</SelectItem>
                  <SelectItem value="HAN">Hanoi (HAN)</SelectItem>
                  <SelectItem value="DAD">Da Nang (DAD)</SelectItem>
                  <SelectItem value="CXR">Nha Trang (CXR)</SelectItem>
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
                  <SelectItem value="SGN">Ho Chi Minh City (SGN)</SelectItem>
                  <SelectItem value="HAN">Hanoi (HAN)</SelectItem>
                  <SelectItem value="DAD">Da Nang (DAD)</SelectItem>
                  <SelectItem value="CXR">Nha Trang (CXR)</SelectItem>
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

            {tripType === 'roundtrip' && (
              <div>
                <Label>{t('return')}</Label>
                <Input
                  type="date"
                  value={searchParams.return}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, return: e.target.value }))}
                />
              </div>
            )}

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

          <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
            <Plane className="h-4 w-4 mr-2" />
            {t('searchFlights')}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {showResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('availableFlights')}</h3>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t('filters')}
            </Button>
          </div>

          {sampleFlights.map((flight) => (
            <Card key={flight.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={flight.logo}
                      alt={flight.airline}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{flight.airline}</h4>
                      <p className="text-sm text-gray-600">{flight.flightNumber} • {flight.aircraft}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <p className="text-xl font-bold">{flight.departure.time}</p>
                      <p className="text-sm text-gray-600">{flight.departure.airport}</p>
                      <p className="text-xs text-gray-500">{flight.departure.city}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <div className="h-px bg-gray-300 w-16"></div>
                        <Plane className="h-4 w-4 text-gray-400" />
                        <div className="h-px bg-gray-300 w-16"></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{flight.duration}</p>
                      <p className="text-xs text-gray-500">
                        {flight.stops === 0 ? t('direct') : `${flight.stops} stops`}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xl font-bold">{flight.arrival.time}</p>
                      <p className="text-sm text-gray-600">{flight.arrival.airport}</p>
                      <p className="text-xs text-gray-500">{flight.arrival.city}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{flight.rating}</span>
                    </div>
                    <div className="mb-2">
                      {flight.originalPrice > flight.price && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatCurrency(flight.originalPrice)}
                        </p>
                      )}
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(flight.price)}
                      </p>
                    </div>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      {t('select')}
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Luggage className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{flight.baggage}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {flight.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            {getAmenityIcon(amenity)}
                            <span className="text-xs text-gray-500 capitalize">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary">{flight.class}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}