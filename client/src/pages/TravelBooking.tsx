import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plane, 
  Bus, 
  MapPin, 
  Calendar, 
  Users, 
  Clock,
  Star,
  Filter,
  Search
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { TravelGridSkeleton } from '@/components/skeletons';
import FlightSearch from '@/components/travel/FlightSearch';
import BusSearch from '@/components/travel/BusSearch';
import TourSearch from '@/components/travel/TourSearch';
import BookingHistory from '@/components/travel/BookingHistory';

export default function TravelBooking() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('flights');

  const travelStats = [
    { icon: Plane, label: t('flights'), value: '500+', color: 'text-blue-500' },
    { icon: Bus, label: t('transport'), value: '200+', color: 'text-green-500' },
    { icon: MapPin, label: t('tours'), value: '150+', color: 'text-purple-500' },
    { icon: Users, label: t('bookings'), value: '10K+', color: 'text-orange-500' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('travelBooking')}</h1>
        <p className="text-gray-600">{t('discoverAndBookYourNextTrip')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {travelStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="flights" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            {t('flights')}
          </TabsTrigger>
          <TabsTrigger value="transport" className="flex items-center gap-2">
            <Bus className="h-4 w-4" />
            {t('transport')}
          </TabsTrigger>
          <TabsTrigger value="tours" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t('tours')}
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('myBookings')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights" className="mt-8">
          <FlightSearch />
        </TabsContent>

        <TabsContent value="transport" className="mt-8">
          <BusSearch />
        </TabsContent>

        <TabsContent value="tours" className="mt-8">
          <TourSearch />
        </TabsContent>

        <TabsContent value="bookings" className="mt-8">
          <BookingHistory />
        </TabsContent>
      </Tabs>

      {/* Popular Destinations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('popularDestinations')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Ho Chi Minh City', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400', trips: '120+ tours' },
              { name: 'Hanoi', image: 'https://images.unsplash.com/photo-1509577864551-595c2e6b7b5c?w=400', trips: '95+ tours' },
              { name: 'Da Nang', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400', trips: '80+ tours' },
              { name: 'Sapa', image: 'https://images.unsplash.com/photo-1552825730-fb2c2c0e7c6e?w=400', trips: '60+ tours' },
            ].map((destination, index) => (
              <div key={index} className="relative group cursor-pointer">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-32 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 rounded-b-lg">
                  <h3 className="text-white font-semibold">{destination.name}</h3>
                  <p className="text-white/80 text-sm">{destination.trips}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}