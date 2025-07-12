import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock,
  Star,
  Camera,
  Mountain,
  Waves,
  TreePine,
  Building,
  Heart,
  Filter,
  Search
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { format } from 'date-fns';

export default function TourSearch() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({
    destination: '',
    category: '',
    duration: '',
    minPrice: '',
    maxPrice: '',
    date: ''
  });
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setShowResults(true);
  };

  const sampleTours = [
    {
      id: 1,
      title: 'Ha Long Bay Premium Cruise 2 Days 1 Night',
      description: 'Explore the stunning Ha Long Bay with luxury cruise, kayaking, and cave exploration.',
      destination: 'Ha Long Bay',
      country: 'Vietnam',
      duration: 2,
      price: 3500000,
      originalPrice: 4200000,
      category: 'cruise',
      difficulty: 'easy',
      rating: 4.8,
      reviewCount: 342,
      maxGuests: 20,
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        'https://images.unsplash.com/photo-1586259531132-77b314b3d47f?w=400',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
      ],
      highlights: ['Luxury cruise accommodation', 'Kayaking adventure', 'Sung Sot Cave exploration', 'Seafood dinner'],
      inclusions: ['Cruise accommodation', 'All meals', 'Kayaking', 'English-speaking guide', 'Transfer'],
      provider: 'Halong Tourism',
      isInstantConfirm: true
    },
    {
      id: 2,
      title: 'Sapa Trekking Adventure 3 Days 2 Nights',
      description: 'Trek through beautiful rice terraces and experience local ethnic minority culture.',
      destination: 'Sapa',
      country: 'Vietnam',
      duration: 3,
      price: 2800000,
      originalPrice: 3200000,
      category: 'trekking',
      difficulty: 'moderate',
      rating: 4.6,
      reviewCount: 198,
      maxGuests: 15,
      images: [
        'https://images.unsplash.com/photo-1552825730-fb2c2c0e7c6e?w=400',
        'https://images.unsplash.com/photo-1552825912-f1f7c5b7d2e2?w=400',
        'https://images.unsplash.com/photo-1552825730-fb2c2c0e7c6e?w=400'
      ],
      highlights: ['Rice terrace trekking', 'Local village homestay', 'Traditional cooking class', 'Ethnic culture experience'],
      inclusions: ['Homestay accommodation', 'All meals', 'Trekking guide', 'Transportation', 'Cultural activities'],
      provider: 'Sapa Adventures',
      isInstantConfirm: false
    },
    {
      id: 3,
      title: 'Mekong Delta Discovery Day Tour',
      description: 'Explore the floating markets and traditional villages of the Mekong Delta.',
      destination: 'Mekong Delta',
      country: 'Vietnam',
      duration: 1,
      price: 850000,
      originalPrice: 1000000,
      category: 'cultural',
      difficulty: 'easy',
      rating: 4.5,
      reviewCount: 567,
      maxGuests: 25,
      images: [
        'https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=400',
        'https://images.unsplash.com/photo-1582639510857-8d2e8f0c3e12?w=400',
        'https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=400'
      ],
      highlights: ['Floating market visit', 'Traditional boat rides', 'Local fruit tasting', 'Handicraft workshops'],
      inclusions: ['Transportation', 'Boat rides', 'Lunch', 'English guide', 'Entrance fees'],
      provider: 'Mekong Tours',
      isInstantConfirm: true
    },
    {
      id: 4,
      title: 'Phong Nha Cave Exploration 2 Days 1 Night',
      description: 'Adventure into the world\'s largest cave system with underground rivers and formations.',
      destination: 'Phong Nha',
      country: 'Vietnam',
      duration: 2,
      price: 2200000,
      originalPrice: 2600000,
      category: 'adventure',
      difficulty: 'challenging',
      rating: 4.7,
      reviewCount: 124,
      maxGuests: 12,
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        'https://images.unsplash.com/photo-1586259531132-77b314b3d47f?w=400',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
      ],
      highlights: ['Paradise Cave exploration', 'Underground river kayaking', 'Phong Nha Cave boat tour', 'Jungle trekking'],
      inclusions: ['Hotel accommodation', 'All meals', 'Cave entrance fees', 'Professional guide', 'Safety equipment'],
      provider: 'Phong Nha Discovery',
      isInstantConfirm: false
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cruise': return <Waves className="h-4 w-4" />;
      case 'trekking': return <Mountain className="h-4 w-4" />;
      case 'cultural': return <Building className="h-4 w-4" />;
      case 'adventure': return <TreePine className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('searchTours')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>{t('destination')}</Label>
              <Select value={searchParams.destination} onValueChange={(value) => setSearchParams(prev => ({ ...prev, destination: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDestination')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="halong">Ha Long Bay</SelectItem>
                  <SelectItem value="sapa">Sapa</SelectItem>
                  <SelectItem value="mekong">Mekong Delta</SelectItem>
                  <SelectItem value="phong-nha">Phong Nha</SelectItem>
                  <SelectItem value="hoi-an">Hoi An</SelectItem>
                  <SelectItem value="da-nang">Da Nang</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('category')}</Label>
              <Select value={searchParams.category} onValueChange={(value) => setSearchParams(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cruise">Cruise</SelectItem>
                  <SelectItem value="trekking">Trekking</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="beach">Beach</SelectItem>
                  <SelectItem value="city">City Tour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('duration')}</Label>
              <Select value={searchParams.duration} onValueChange={(value) => setSearchParams(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDuration')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="2">2 Days</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="4">4+ Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('minPrice')}</Label>
              <Input
                type="number"
                placeholder="Min price"
                value={searchParams.minPrice}
                onChange={(e) => setSearchParams(prev => ({ ...prev, minPrice: e.target.value }))}
              />
            </div>

            <div>
              <Label>{t('maxPrice')}</Label>
              <Input
                type="number"
                placeholder="Max price"
                value={searchParams.maxPrice}
                onChange={(e) => setSearchParams(prev => ({ ...prev, maxPrice: e.target.value }))}
              />
            </div>

            <div>
              <Label>{t('date')}</Label>
              <Input
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={handleSearch} className="w-full bg-purple-600 hover:bg-purple-700">
            <Search className="h-4 w-4 mr-2" />
            {t('searchTours')}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {showResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t('availableTours')}</h3>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t('filters')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleTours.map((tour) => (
              <Card key={tour.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="outline" className="bg-white/80 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className={getDifficultyColor(tour.difficulty)}>
                      {tour.difficulty}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{tour.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{tour.destination}</span>
                        <span>•</span>
                        <Clock className="h-4 w-4" />
                        <span>{tour.duration} days</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(tour.category)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {tour.description}
                  </p>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{tour.rating}</span>
                      <span className="text-xs text-gray-500">({tour.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Max {tour.maxGuests} guests</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {tour.highlights.slice(0, 3).map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {tour.originalPrice > tour.price && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatCurrency(tour.originalPrice)}
                        </p>
                      )}
                      <p className="text-lg font-bold text-purple-600">
                        {formatCurrency(tour.price)}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                    <div className="text-right">
                      {tour.isInstantConfirm && (
                        <Badge className="bg-green-100 text-green-800 mb-2">
                          Instant Confirm
                        </Badge>
                      )}
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        {t('bookNow')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}