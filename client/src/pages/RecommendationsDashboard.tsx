import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  useRecommendationData, 
  useUpdatePreferences, 
  useGenerateRecommendations,
  usePopularItems,
  useTrendingItems,
  useTrackInteraction,
  useMarkRecommendationClicked,
  useCollaborativeRecommendations,
  useHybridRecommendations,
  useRecommendationFeedback,
  useRecommendationPerformance,
  useSeasonalRecommendations,
  useContextualRecommendations,
  useUpdateRecommendationScores,
  useSimilarUsers,
  useMLRecommendations,
  useRealTimeRecommendations
} from '@/hooks/useRecommendations';
import { 
  Heart, 
  Star, 
  MapPin, 
  TrendingUp, 
  Users, 
  Zap, 
  Settings,
  Eye,
  ShoppingCart,
  Home,
  Plane,
  RefreshCw,
  Sparkles,
  Brain,
  Target,
  Activity,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Shuffle
} from 'lucide-react';

interface RecommendationItem {
  id: string;
  title: string;
  image: string;
  price?: number;
  rating?: number;
  category?: string;
  reason?: string;
  type: 'product' | 'property' | 'destination';
}

export default function RecommendationsDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [preferences, setPreferences] = useState({
    favoriteCategories: [] as string[],
    priceRange: '',
    brandPreferences: [] as string[],
    preferredDestinations: [] as string[],
    travelBudgetRange: '',
    travelStyle: '',
    accommodationType: '',
    interests: [] as string[],
    language: 'vi'
  });

  const recommendationData = useRecommendationData();
  const updatePreferencesMutation = useUpdatePreferences();
  const generateRecommendationsMutation = useGenerateRecommendations();
  const popularProducts = usePopularItems('product');
  const trendingProducts = useTrendingItems('product');
  const popularProperties = usePopularItems('property');
  const trackInteraction = useTrackInteraction();
  const markClicked = useMarkRecommendationClicked();
  
  // Advanced ML hooks
  const collaborativeRecommendations = useCollaborativeRecommendations('product');
  const hybridRecommendations = useHybridRecommendations('product');
  const recommendationFeedback = useRecommendationFeedback();
  const performanceData = useRecommendationPerformance();
  const seasonalRecommendations = useSeasonalRecommendations('summer');
  const contextualRecommendationsMutation = useContextualRecommendations();
  const updateScores = useUpdateRecommendationScores();
  const similarUsers = useSimilarUsers();
  const mlRecommendations = useMLRecommendations('hybrid');
  const realTimeRecommendations = useRealTimeRecommendations();

  // Update local preferences when data loads
  useEffect(() => {
    if (recommendationData.preferences) {
      setPreferences({
        favoriteCategories: recommendationData.preferences.favoriteCategories || [],
        priceRange: recommendationData.preferences.priceRange || '',
        brandPreferences: recommendationData.preferences.brandPreferences || [],
        preferredDestinations: recommendationData.preferences.preferredDestinations || [],
        travelBudgetRange: recommendationData.preferences.travelBudgetRange || '',
        travelStyle: recommendationData.preferences.travelStyle || '',
        accommodationType: recommendationData.preferences.accommodationType || '',
        interests: recommendationData.preferences.interests || [],
        language: recommendationData.preferences.language || 'vi'
      });
    }
  }, [recommendationData.preferences]);

  const handleUpdatePreferences = async () => {
    try {
      await updatePreferencesMutation.mutateAsync(preferences);
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateRecommendations = async () => {
    try {
      await generateRecommendationsMutation.mutateAsync();
      toast({
        title: "Recommendations Generated",
        description: "New personalized recommendations have been created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recommendations.",
        variant: "destructive",
      });
    }
  };

  const handleItemClick = (item: any, type: 'product' | 'property' | 'destination') => {
    // Track interaction
    trackInteraction.mutate({
      userId: 'current-user', // This would come from auth context
      itemType: type,
      itemId: item.id.toString(),
      actionType: 'view',
      duration: 0
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleItemClick(product, 'product')}
    >
      <CardContent className="p-4">
        <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={product.images?.[0] || '/placeholder-product.jpg'} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.title}</h3>
        <p className="text-blue-600 font-bold text-sm mb-2">{formatPrice(product.price)}</p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">{product.category?.name}</Badge>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs">{product.rating || 4.5}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PropertyCard = ({ property }: { property: any }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleItemClick(property, 'property')}
    >
      <CardContent className="p-4">
        <div className="aspect-video mb-3 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={property.images?.[0] || '/placeholder-property.jpg'} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{property.title}</h3>
        <p className="text-blue-600 font-bold text-sm mb-2">{formatPrice(property.pricePerNight)}/night</p>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">{property.propertyType}</Badge>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gray-500" />
            <span className="text-xs">{property.city}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DestinationCard = ({ destination }: { destination: any }) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleItemClick(destination, 'destination')}
    >
      <CardContent className="p-4">
        <div className="aspect-video mb-3 bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={destination.image || '/placeholder-destination.jpg'} 
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-sm mb-1">{destination.name}</h3>
        <p className="text-gray-600 text-xs mb-2">{destination.category}</p>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          <span className="text-xs">{destination.rating}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Personalized Recommendations</h1>
        <p className="text-gray-600">Discover products, properties, and destinations tailored just for you</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="ml-algorithms" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI & ML
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5" />
                  Recent Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">24</div>
                <p className="text-sm text-gray-600">Items viewed this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5" />
                  Saved Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-600 mb-2">12</div>
                <p className="text-sm text-gray-600">Items in your wishlist</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {(recommendationData.products.length + recommendationData.properties.length + recommendationData.destinations.length)}
                </div>
                <p className="text-sm text-gray-600">Personalized for you</p>
                <Button 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={handleGenerateRecommendations}
                  disabled={generateRecommendationsMutation.isPending}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trending Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {trendingProducts.data?.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Popular Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {popularProperties.data?.slice(0, 4).map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recommended Products</h2>
            <Badge variant="outline">{recommendationData.products.length} items</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendationData.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recommended Properties</h2>
            <Badge variant="outline">{recommendationData.properties.length} items</Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendationData.properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-bold mb-4">Recommended Destinations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {recommendationData.destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ml-algorithms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collaborative Filtering */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collaborative Filtering
                </CardTitle>
                <CardDescription>
                  Recommendations based on users with similar preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{similarUsers.data?.length || 0}</div>
                      <p className="text-sm text-gray-600">Similar Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{collaborativeRecommendations.data?.length || 0}</div>
                      <p className="text-sm text-gray-600">Recommendations</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Top Collaborative Picks:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {collaborativeRecommendations.data?.slice(0, 4).map((item, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                          <div className="font-medium truncate">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.category?.name || 'Product'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hybrid Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shuffle className="h-5 w-5" />
                  Hybrid Algorithm
                </CardTitle>
                <CardDescription>
                  Combined content-based and collaborative filtering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{hybridRecommendations.data?.length || 0}</div>
                      <p className="text-sm text-gray-600">Hybrid Results</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">95%</div>
                      <p className="text-sm text-gray-600">Accuracy</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Top Hybrid Picks:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {hybridRecommendations.data?.slice(0, 4).map((item, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                          <div className="font-medium truncate">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.category?.name || 'Product'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Recommendation system performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {performanceData.data?.clickThroughRate ? 
                          `${(performanceData.data.clickThroughRate * 100).toFixed(1)}%` : '0%'}
                      </div>
                      <p className="text-sm text-gray-600">Click-through Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {performanceData.data?.positiveRate ? 
                          `${(performanceData.data.positiveRate * 100).toFixed(1)}%` : '0%'}
                      </div>
                      <p className="text-sm text-gray-600">Positive Feedback</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Actions:</h4>
                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => updateScores.mutate()}
                        disabled={updateScores.isPending}
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Update ML Scores
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full"
                        onClick={() => contextualRecommendationsMutation.mutate({
                          timeOfDay: 'morning',
                          location: 'Ho Chi Minh City'
                        })}
                        disabled={contextualRecommendationsMutation.isPending}
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Contextual Recommendations
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5" />
                  Feedback System
                </CardTitle>
                <CardDescription>
                  Help improve recommendation quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rate Recommendation Quality:</Label>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => recommendationFeedback.mutate({
                          recommendationId: 1,
                          feedback: 'positive'
                        })}
                        className="flex-1"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Excellent
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => recommendationFeedback.mutate({
                          recommendationId: 1,
                          feedback: 'neutral'
                        })}
                        className="flex-1"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Good
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => recommendationFeedback.mutate({
                          recommendationId: 1,
                          feedback: 'negative'
                        })}
                        className="flex-1"
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Poor
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Seasonal Recommendations:</Label>
                    <Select onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="autumn">Autumn</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Preferences</CardTitle>
              <p className="text-sm text-gray-600">
                Help us personalize your recommendations by updating your preferences.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="priceRange">Price Range</Label>
                  <Select value={preferences.priceRange} onValueChange={(value) => setPreferences({...preferences, priceRange: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget (Under 1M VND)</SelectItem>
                      <SelectItem value="mid">Mid-range (1M - 3M VND)</SelectItem>
                      <SelectItem value="luxury">Luxury (Above 3M VND)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="travelStyle">Travel Style</Label>
                  <Select value={preferences.travelStyle} onValueChange={(value) => setPreferences({...preferences, travelStyle: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select travel style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="relaxation">Relaxation</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="budget">Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="accommodationType">Accommodation Type</Label>
                  <Select value={preferences.accommodationType} onValueChange={(value) => setPreferences({...preferences, accommodationType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select accommodation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="homestay">Homestay</SelectItem>
                      <SelectItem value="resort">Resort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="interests">Interests</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['nature', 'culture', 'adventure', 'food', 'history', 'beach', 'mountain', 'city'].map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Switch
                          id={interest}
                          checked={preferences.interests.includes(interest)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPreferences({
                                ...preferences,
                                interests: [...preferences.interests, interest]
                              });
                            } else {
                              setPreferences({
                                ...preferences,
                                interests: preferences.interests.filter(i => i !== interest)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={interest} className="capitalize">{interest}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleUpdatePreferences}
                  disabled={updatePreferencesMutation.isPending}
                  className="flex-1"
                >
                  {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
                </Button>
                <Button 
                  onClick={handleGenerateRecommendations}
                  disabled={generateRecommendationsMutation.isPending}
                  variant="outline"
                  className="flex-1"
                >
                  {generateRecommendationsMutation.isPending ? 'Generating...' : 'Generate Recommendations'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}