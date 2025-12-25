import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Search,
  Heart,
  Eye
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { formatCurrency, getAmenityIcon, getCategoryColor } from '@/lib/destinationHelpers';
import { useDestinationsStore } from '@/store/useDestinationsStore';

export default function PopularDestinations() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('destinations');
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const destinations = useDestinationsStore((state) => state.destinations);

  const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

  const toggleBookingDialog = (open: boolean) => {
    setShowBooking(open);
    if (!open) {
      setSelectedHotel(null);
      setBookingDetails((prev) => ({
        ...prev,
        checkIn: '',
        checkOut: '',
      }));
    }
  };

  const startBooking = (destination: any, hotel: any) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    setSelectedHotel({ ...hotel, destinationName: destination.name });
    setBookingDetails({
      checkIn: formatDateForInput(today),
      checkOut: formatDateForInput(tomorrow),
      guests: 2
    });
    setShowBooking(true);
  };

  const confirmBooking = () => {
    if (!selectedHotel) return;

    if (!bookingDetails.checkIn || !bookingDetails.checkOut) {
      toast({ title: 'Select dates', description: 'Please choose check-in and check-out dates.', variant: 'destructive' });
      return;
    }

    const checkInDate = new Date(bookingDetails.checkIn);
    const checkOutDate = new Date(bookingDetails.checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));

    const booking = {
      id: `hotel-${selectedHotel.id}-${Date.now()}`,
      hotelId: selectedHotel.id,
      destination: selectedHotel.destinationName,
      hotelName: selectedHotel.name,
      checkIn: bookingDetails.checkIn,
      checkOut: bookingDetails.checkOut,
      guests: bookingDetails.guests,
      nights,
      pricePerNight: selectedHotel.price,
      total: selectedHotel.price * nights,
      status: 'pending',
    };

    const existing = JSON.parse(localStorage.getItem('travelBookings') || '[]');
    localStorage.setItem('travelBookings', JSON.stringify([booking, ...existing].slice(0, 20)));

    toast({
      title: 'Booking requested',
      description: `We saved your booking for ${selectedHotel.name} in ${selectedHotel.destinationName}. Check your bookings for updates.`
    });
    toggleBookingDialog(false);
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Popular Destinations</h1>
        <p className="text-gray-600">
          Discover Vietnam's most beautiful destinations with nearby hotels and attractions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="destinations">
            <MapPin className="h-4 w-4 mr-2" />
            Destinations
          </TabsTrigger>
          <TabsTrigger value="map">
            <MapPin className="h-4 w-4 mr-2" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="hotels">
            <Users className="h-4 w-4 mr-2" />
            Hotels
          </TabsTrigger>
        </TabsList>

        <TabsContent value="destinations" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Destinations</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by name or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="budget">Budget (&lt; 1M VND)</SelectItem>
                      <SelectItem value="mid">Mid-range (1M - 3M VND)</SelectItem>
                      <SelectItem value="luxury">Luxury (&gt; 3M VND)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="reviews">Reviews</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getCategoryColor(destination.category)}>
                      {destination.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-2 text-white">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{destination.rating}</span>
                      <span className="text-sm">({destination.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold mb-1">{destination.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{destination.location}</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{destination.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{destination.bestTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{destination.avgStay}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Popular Attractions:</p>
                    <div className="flex flex-wrap gap-1">
                      {destination.attractions.slice(0, 3).map((attraction, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {attraction}
                        </Badge>
                      ))}
                      {destination.attractions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{destination.attractions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setLocation(`/destinations/${destination.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                  <p className="text-gray-600 mb-4">
                    Map integration would show all destinations with markers and nearby hotels
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {destinations.map((dest) => (
                      <div key={dest.id} className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>{dest.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.flatMap(dest => 
              dest.hotels.map(hotel => (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white text-black">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {hotel.rating}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{hotel.distance}</p>
                    <p className="text-sm text-gray-600 mb-3">
                      Near {destinations.find(d => d.hotels.some(h => h.id === hotel.id))?.name}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {hotel.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs text-gray-600">
                          {getAmenityIcon(amenity)}
                          <span className="capitalize">{amenity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(hotel.price)}
                        </p>
                        <p className="text-xs text-gray-500">per night</p>
                      </div>
                      <Button size="sm" onClick={() => startBooking(dest, hotel)}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick booking dialog */}
      <Dialog open={showBooking} onOpenChange={toggleBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selectedHotel?.name}</DialogTitle>
          </DialogHeader>
          {selectedHotel && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-semibold">{selectedHotel.destinationName}</p>
                  <p className="text-sm text-muted-foreground mt-1">From {formatCurrency(selectedHotel.price)} / night</p>
                </div>
                <Badge>Hotel</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Check-in</Label>
                  <Input
                    type="date"
                    value={bookingDetails.checkIn}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, checkIn: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Check-out</Label>
                  <Input
                    type="date"
                    value={bookingDetails.checkOut}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, checkOut: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Guests</Label>
                  <Input
                    type="number"
                    min={1}
                    value={bookingDetails.guests}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, guests: Number(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="rounded-md border p-3 text-sm text-muted-foreground">
                We will create a booking request and hold this rate. You can manage it from your bookings dashboard.
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBooking(false)}>Cancel</Button>
            <Button onClick={confirmBooking} disabled={!selectedHotel}>Confirm booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
