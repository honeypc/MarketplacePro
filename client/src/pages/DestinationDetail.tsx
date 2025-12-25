import React from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, getAmenityIcon, getCategoryColor } from '@/lib/destinationHelpers';
import { ArrowLeft, MapPin, Star, Clock, Users, Heart } from 'lucide-react';
import { useDestinationsStore } from '@/store/useDestinationsStore';

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const destination = useDestinationsStore((state) =>
    state.destinations.find((dest) => dest.id === Number(id))
  );

  if (!destination) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <Button variant="ghost" onClick={() => setLocation('/destinations')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to destinations
        </Button>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-700">We couldn&apos;t find that destination. Please try again from the destinations list.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => setLocation('/destinations')} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to destinations
      </Button>

      <div className="overflow-hidden rounded-xl border">
        <div className="relative h-72 md:h-96">
          <img
            src={destination.image}
            alt={destination.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 text-white">
            <div className="space-y-2">
              <p className="text-sm text-white/80">{destination.location}</p>
              <h1 className="text-3xl md:text-4xl font-bold">{destination.name}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getCategoryColor(destination.category)}>
                  {destination.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{destination.rating}</span>
                  <span className="text-sm text-white/80">({destination.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" className="bg-white/80 text-gray-900 hover:bg-white">
                <Heart className="h-4 w-4 mr-2" />
                Save to wishlist
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setLocation('/travel')}>
                Plan this trip
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>About {destination.nameEn}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">{destination.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Best time to visit</p>
                  <p className="font-semibold">{destination.bestTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Average stay</p>
                  <p className="font-semibold">{destination.avgStay}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Coordinates</p>
                  <p className="font-semibold">
                    {destination.coordinates.lat.toFixed(2)}°N, {destination.coordinates.lng.toFixed(2)}°E
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top attractions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {destination.attractions.map((attraction, index) => (
              <div key={index} className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">{attraction}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nearby hotels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destination.hotels.map((hotel) => (
              <div key={hotel.id} className="rounded-lg border overflow-hidden bg-white shadow-sm">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{hotel.name}</h3>
                      <p className="text-sm text-gray-600">{hotel.distance}</p>
                    </div>
                    <Badge className="bg-white text-gray-900 border">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {hotel.rating}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    {hotel.amenities.map((amenity) => (
                      <span key={amenity} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                        {getAmenityIcon(amenity)}
                        <span className="capitalize">{amenity}</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(hotel.price)}</p>
                      <p className="text-xs text-muted-foreground">per night</p>
                    </div>
                    <Button size="sm" onClick={() => setLocation(`/travel?hotel=${hotel.id}`)}>
                      Book stay
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
