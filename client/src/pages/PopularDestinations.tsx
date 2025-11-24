import React, { useState, useEffect } from 'react';
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
  DollarSign, 
  Users, 
  Wifi, 
  Car, 
  Utensils,
  Waves,
  Dumbbell,
  Coffee,
  Plane,
  Search,
  Heart,
  Eye,
  Filter
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function PopularDestinations() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('destinations');
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
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
  const { toast } = useToast();

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

  const destinations = [
    {
      id: 1,
      name: 'Hạ Long Bay',
      nameEn: 'Ha Long Bay',
      location: 'Quảng Ninh, Vietnam',
      coordinates: { lat: 20.9101, lng: 107.1839 },
      image: 'https://images.unsplash.com/photo-1596414086775-3e321ab08f36?w=800&h=600&fit=crop',
      description: 'UNESCO World Heritage site famous for emerald waters and limestone karsts',
      rating: 4.8,
      reviews: 12847,
      category: 'Natural Wonder',
      bestTime: 'October - April',
      avgStay: '2-3 days',
      attractions: ['Titop Island', 'Sung Sot Cave', 'Floating Villages', 'Kayaking'],
      hotels: [
        {
          id: 101,
          name: 'Emeralda Cruise Ha Long',
          rating: 4.7,
          price: 2800000,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
          amenities: ['wifi', 'restaurant', 'spa', 'pool'],
          distance: '0.5km from bay center'
        },
        {
          id: 102,
          name: 'Novotel Ha Long Bay',
          rating: 4.5,
          price: 2200000,
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
          amenities: ['wifi', 'restaurant', 'gym', 'pool'],
          distance: '1.2km from bay center'
        },
        {
          id: 103,
          name: 'Wyndham Legend Ha Long',
          rating: 4.6,
          price: 1800000,
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
          amenities: ['wifi', 'restaurant', 'spa', 'gym'],
          distance: '2.0km from bay center'
        }
      ]
    },
    {
      id: 2,
      name: 'Phố Cổ Hội An',
      nameEn: 'Hoi An Ancient Town',
      location: 'Quảng Nam, Vietnam',
      coordinates: { lat: 15.8801, lng: 108.3380 },
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
      description: 'Historic trading port with well-preserved ancient architecture',
      rating: 4.9,
      reviews: 18293,
      category: 'Historic Town',
      bestTime: 'February - August',
      avgStay: '3-4 days',
      attractions: ['Japanese Covered Bridge', 'Old Houses', 'Lantern Festival', 'Tailor Shops'],
      hotels: [
        {
          id: 201,
          name: 'La Siesta Hoi An Resort',
          rating: 4.8,
          price: 1500000,
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
          amenities: ['wifi', 'pool', 'spa', 'restaurant'],
          distance: '0.3km from Ancient Town'
        },
        {
          id: 202,
          name: 'Boutique Hoi An Resort',
          rating: 4.6,
          price: 1200000,
          image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
          amenities: ['wifi', 'pool', 'restaurant', 'spa'],
          distance: '0.5km from Ancient Town'
        },
        {
          id: 203,
          name: 'Hoi An Eco Lodge',
          rating: 4.4,
          price: 900000,
          image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
          amenities: ['wifi', 'restaurant', 'garden', 'bike'],
          distance: '1.0km from Ancient Town'
        }
      ]
    },
    {
      id: 3,
      name: 'Phú Quốc',
      nameEn: 'Phu Quoc Island',
      location: 'Kiên Giang, Vietnam',
      coordinates: { lat: 10.2899, lng: 103.9840 },
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop',
      description: 'Tropical island paradise with pristine beaches and crystal clear waters',
      rating: 4.7,
      reviews: 9456,
      category: 'Beach Paradise',
      bestTime: 'November - March',
      avgStay: '4-5 days',
      attractions: ['Sao Beach', 'Night Market', 'Cable Car', 'Pepper Farms'],
      hotels: [
        {
          id: 301,
          name: 'JW Marriott Phu Quoc',
          rating: 4.9,
          price: 4500000,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          amenities: ['wifi', 'pool', 'spa', 'restaurant', 'beach'],
          distance: '0.1km from beach'
        },
        {
          id: 302,
          name: 'Salinda Resort Phu Quoc',
          rating: 4.6,
          price: 3200000,
          image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
          amenities: ['wifi', 'pool', 'spa', 'restaurant'],
          distance: '0.2km from beach'
        },
        {
          id: 303,
          name: 'Phu Quoc Eco Beach Resort',
          rating: 4.3,
          price: 1800000,
          image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop',
          amenities: ['wifi', 'pool', 'restaurant', 'beach'],
          distance: '0.3km from beach'
        }
      ]
    },
    {
      id: 4,
      name: 'Đà Lạt',
      nameEn: 'Da Lat',
      location: 'Lâm Đồng, Vietnam',
      coordinates: { lat: 11.9404, lng: 108.4583 },
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      description: 'Cool mountain city known for flowers, waterfalls, and French colonial architecture',
      rating: 4.6,
      reviews: 15782,
      category: 'Mountain City',
      bestTime: 'Year-round',
      avgStay: '2-3 days',
      attractions: ['Flower Gardens', 'Crazy House', 'Waterfalls', 'Coffee Plantations'],
      hotels: [
        {
          id: 401,
          name: 'Dalat Palace Heritage Hotel',
          rating: 4.7,
          price: 2500000,
          image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400&h=300&fit=crop',
          amenities: ['wifi', 'restaurant', 'spa', 'golf'],
          distance: '1.0km from city center'
        },
        {
          id: 402,
          name: 'Ana Mandara Villas Dalat',
          rating: 4.5,
          price: 1800000,
          image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
          amenities: ['wifi', 'restaurant', 'spa', 'garden'],
          distance: '2.0km from city center'
        },
        {
          id: 403,
          name: 'Dalat Edensee Lake Resort',
          rating: 4.4,
          price: 1500000,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          amenities: ['wifi', 'restaurant', 'lake', 'garden'],
          distance: '3.0km from city center'
        }
      ]
    },
    {
      id: 5,
      name: 'Sapa',
      nameEn: 'Sapa',
      location: 'Lào Cai, Vietnam',
      coordinates: { lat: 22.3380, lng: 103.8438 },
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
      description: 'Mountainous region famous for terraced rice fields and ethnic minorities',
      rating: 4.5,
      reviews: 8647,
      category: 'Mountain Adventure',
      bestTime: 'September - November, March - May',
      avgStay: '2-3 days',
      attractions: ['Rice Terraces', 'Fansipan Mountain', 'Ethnic Villages', 'Markets'],
      hotels: [
        {
          id: 501,
          name: 'Hotel de la Coupole - MGallery',
          rating: 4.6,
          price: 2200000,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
          amenities: ['wifi', 'restaurant', 'spa', 'mountain-view'],
          distance: '0.5km from town center'
        },
        {
          id: 502,
          name: 'Pao\'s Sapa Leisure Hotel',
          rating: 4.4,
          price: 1600000,
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
          amenities: ['wifi', 'restaurant', 'spa', 'garden'],
          distance: '1.0km from town center'
        },
        {
          id: 503,
          name: 'Sapa Jade Hill Resort',
          rating: 4.2,
          price: 1200000,
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
          amenities: ['wifi', 'restaurant', 'mountain-view', 'garden'],
          distance: '2.0km from town center'
        }
      ]
    },
    {
      id: 6,
      name: 'Nha Trang',
      nameEn: 'Nha Trang',
      location: 'Khánh Hòa, Vietnam',
      coordinates: { lat: 12.2388, lng: 109.1967 },
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop',
      description: 'Coastal city with beautiful beaches, diving spots, and vibrant nightlife',
      rating: 4.4,
      reviews: 11293,
      category: 'Beach City',
      bestTime: 'January - August',
      avgStay: '3-4 days',
      attractions: ['Beaches', 'Diving', 'Night Markets', 'Temples'],
      hotels: [
        {
          id: 601,
          name: 'InterContinental Nha Trang',
          rating: 4.8,
          price: 3500000,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          amenities: ['wifi', 'pool', 'spa', 'restaurant', 'beach'],
          distance: '0.1km from beach'
        },
        {
          id: 602,
          name: 'Sheraton Nha Trang Hotel',
          rating: 4.6,
          price: 2800000,
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
          amenities: ['wifi', 'pool', 'spa', 'restaurant'],
          distance: '0.2km from beach'
        },
        {
          id: 603,
          name: 'Nha Trang Lodge',
          rating: 4.3,
          price: 1500000,
          image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop',
          amenities: ['wifi', 'pool', 'restaurant', 'beach'],
          distance: '0.5km from beach'
        }
      ]
    }
  ];

  const filteredDestinations = destinations.filter(dest => 
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getAmenityIcon = (amenity: string) => {
    const icons = {
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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Natural Wonder': 'bg-green-100 text-green-800',
      'Historic Town': 'bg-amber-100 text-amber-800',
      'Beach Paradise': 'bg-blue-100 text-blue-800',
      'Mountain City': 'bg-purple-100 text-purple-800',
      'Mountain Adventure': 'bg-orange-100 text-orange-800',
      'Beach City': 'bg-cyan-100 text-cyan-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

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
                      onClick={() => setSelectedDestination(destination)}
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

      {/* Destination Details Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedDestination.image} 
                alt={selectedDestination.name}
                className="w-full h-64 object-cover"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-4 right-4 bg-white"
                onClick={() => setSelectedDestination(null)}
              >
                ×
              </Button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedDestination.name}</h2>
                  <p className="text-gray-600">{selectedDestination.location}</p>
                </div>
                <Badge className={getCategoryColor(selectedDestination.category)}>
                  {selectedDestination.category}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-700 mb-4">{selectedDestination.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Best Time to Visit</p>
                      <p className="text-gray-600">{selectedDestination.bestTime}</p>
                    </div>
                    <div>
                      <p className="font-medium">Average Stay</p>
                      <p className="text-gray-600">{selectedDestination.avgStay}</p>
                    </div>
                    <div>
                      <p className="font-medium">Rating</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{selectedDestination.rating}</span>
                        <span className="text-gray-500 ml-1">({selectedDestination.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Attractions</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {selectedDestination.attractions.map((attraction, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{attraction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Nearby Hotels</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedDestination.hotels.map((hotel) => (
                    <Card key={hotel.id}>
                      <CardContent className="p-4">
                        <img 
                          src={hotel.image} 
                          alt={hotel.name}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <h4 className="font-semibold mb-1">{hotel.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{hotel.distance}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{hotel.rating}</span>
                          </div>
                          <p className="font-semibold text-blue-600">
                            {formatCurrency(hotel.price)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
