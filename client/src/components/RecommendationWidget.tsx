import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackInteraction, useMarkRecommendationClicked } from '@/hooks/useRecommendations';
import { useAuth } from '@/hooks/useAuth';
import { Star, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

interface RecommendationWidgetProps {
  type: 'products' | 'properties' | 'destinations';
  title?: string;
  limit?: number;
  showViewAll?: boolean;
  className?: string;
}

export default function RecommendationWidget({ 
  type, 
  title, 
  limit = 4, 
  showViewAll = true,
  className = '' 
}: RecommendationWidgetProps) {
  const { user } = useAuth();
  const trackInteraction = useTrackInteraction();
  const markClicked = useMarkRecommendationClicked();
  
  // Mock data for demonstration - in a real app, this would come from the recommendations API
  const mockRecommendations = {
    products: [
      {
        id: 1,
        title: 'Premium Wireless Headphones',
        price: 2500000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        rating: 4.8,
        category: 'Electronics',
        reason: 'Based on your recent audio purchases'
      },
      {
        id: 2,
        title: 'Organic Vietnamese Coffee',
        price: 350000,
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
        rating: 4.9,
        category: 'Food & Beverages',
        reason: 'Popular in your area'
      },
      {
        id: 3,
        title: 'Handwoven Bamboo Bag',
        price: 450000,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
        rating: 4.7,
        category: 'Fashion',
        reason: 'Matches your style preferences'
      },
      {
        id: 4,
        title: 'Smart Fitness Watch',
        price: 1800000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        rating: 4.6,
        category: 'Electronics',
        reason: 'Based on your fitness interests'
      }
    ],
    properties: [
      {
        id: 1,
        title: 'Luxury Beach Villa in Phu Quoc',
        pricePerNight: 3200000,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
        rating: 4.9,
        location: 'Phu Quoc, Vietnam',
        propertyType: 'Villa',
        reason: 'Perfect for your beach vacation'
      },
      {
        id: 2,
        title: 'Cozy Mountain Cabin in Da Lat',
        pricePerNight: 1200000,
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
        rating: 4.7,
        location: 'Da Lat, Vietnam',
        propertyType: 'Cabin',
        reason: 'Ideal for your mountain retreat'
      },
      {
        id: 3,
        title: 'Historic House in Hoi An',
        pricePerNight: 800000,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
        rating: 4.8,
        location: 'Hoi An, Vietnam',
        propertyType: 'House',
        reason: 'Based on your cultural interests'
      },
      {
        id: 4,
        title: 'Modern Apartment in Ho Chi Minh',
        pricePerNight: 1500000,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        rating: 4.5,
        location: 'Ho Chi Minh City, Vietnam',
        propertyType: 'Apartment',
        reason: 'Great for city exploration'
      }
    ],
    destinations: [
      {
        id: 1,
        name: 'Ha Long Bay',
        image: 'https://images.unsplash.com/photo-1596414086775-3e321ab08f36?w=400&h=300&fit=crop',
        rating: 4.8,
        category: 'Natural Wonder',
        reason: 'Perfect for nature lovers'
      },
      {
        id: 2,
        name: 'Hoi An Ancient Town',
        image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop',
        rating: 4.9,
        category: 'Historic Town',
        reason: 'Rich cultural heritage'
      },
      {
        id: 3,
        name: 'Sapa Rice Terraces',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop',
        rating: 4.7,
        category: 'Adventure',
        reason: 'Amazing trekking experience'
      },
      {
        id: 4,
        name: 'Mekong Delta',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop',
        rating: 4.6,
        category: 'Cultural',
        reason: 'Authentic local culture'
      }
    ]
  };

  const recommendations = mockRecommendations[type].slice(0, limit);
  const isLoading = false; // In a real app, this would come from the API hook

  const handleItemClick = (item: any) => {
    if (user) {
      trackInteraction.mutate({
        userId: user.id,
        itemType: type.slice(0, -1) as 'product' | 'property' | 'destination',
        itemId: item.id.toString(),
        actionType: 'view',
        duration: 0
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'products':
        return 'Recommended Products';
      case 'properties':
        return 'Recommended Properties';
      case 'destinations':
        return 'Recommended Destinations';
      default:
        return 'Recommendations';
    }
  };

  const getViewAllLink = () => {
    switch (type) {
      case 'products':
        return '/recommendations?tab=products';
      case 'properties':
        return '/recommendations?tab=properties';
      case 'destinations':
        return '/recommendations?tab=properties';
      default:
        return '/recommendations';
    }
  };

  const ProductCard = ({ item }: { item: any }) => (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
      <CardContent className="p-4">
        <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
        <p className="text-blue-600 font-bold text-sm mb-2">{formatPrice(item.price)}</p>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs">{item.rating}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 italic">{item.reason}</p>
      </CardContent>
    </Card>
  );

  const PropertyCard = ({ item }: { item: any }) => (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
      <CardContent className="p-4">
        <div className="aspect-video mb-3 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
        <p className="text-blue-600 font-bold text-sm mb-2">{formatPrice(item.pricePerNight)}/night</p>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">{item.propertyType}</Badge>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs">{item.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="h-3 w-3 text-gray-500" />
          <span className="text-xs text-gray-600">{item.location}</span>
        </div>
        <p className="text-xs text-gray-500 italic">{item.reason}</p>
      </CardContent>
    </Card>
  );

  const DestinationCard = ({ item }: { item: any }) => (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 h-full">
      <CardContent className="p-4">
        <div className="aspect-video mb-3 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs">{item.rating}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 italic">{item.reason}</p>
      </CardContent>
    </Card>
  );

  const renderCard = (item: any) => {
    switch (type) {
      case 'products':
        return <ProductCard item={item} />;
      case 'properties':
        return <PropertyCard item={item} />;
      case 'destinations':
        return <DestinationCard item={item} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <Skeleton className="h-5 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            {title || getDefaultTitle()}
          </CardTitle>
          {showViewAll && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={getViewAllLink()}>
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((item) => (
            <div key={item.id} onClick={() => handleItemClick(item)}>
              {renderCard(item)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Specific widget components for easy use
export const RecommendedProducts = (props: Omit<RecommendationWidgetProps, 'type'>) => (
  <RecommendationWidget type="products" {...props} />
);

export const RecommendedProperties = (props: Omit<RecommendationWidgetProps, 'type'>) => (
  <RecommendationWidget type="properties" {...props} />
);

export const RecommendedDestinations = (props: Omit<RecommendationWidgetProps, 'type'>) => (
  <RecommendationWidget type="destinations" {...props} />
);