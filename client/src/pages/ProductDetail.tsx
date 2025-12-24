import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Star, Heart, Share2, Shield, Truck, RotateCcw, MessageSquare, ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart, CheckCircle, ThumbsUp, MessageCircle, Eye, Globe, Award, Clock, CreditCard, Package, Users, ArrowLeft, ChevronUp, ChevronDown, MapPin, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ModelAttributePanel } from "@/components/ModelAttributePanel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { useTableFormConfig } from "@/hooks/useTableFormConfig";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { format } from "date-fns";
import type { Product, Review, User } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { addToLocalCart, addToLocalWishlist } = useStore();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [currentImageSet, setCurrentImageSet] = useState(0);
  const { data: tableFormConfig } = useTableFormConfig();
  const productModelConfig = tableFormConfig?.models.find((model) => model.id === "product");

  // Fetch product details
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['/api/products', id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/products/${id}`);
      return response.json();
    },
    enabled: !!id,
  });



  // Fetch product reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/products', id, 'reviews'],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/products/${id}/reviews`);
      return response.json();
    },
    enabled: !!id,
  });
  
  const reviewsArray = Array.isArray(reviews) ? reviews : [];

  // Fetch related products (same category)
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['/api/products', 'related', product?.categoryId, product?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/products?categoryId=${product?.categoryId}&limit=12&excludeId=${product?.id}`);
      return response.json();
    },
    enabled: !!product?.categoryId && !!product?.id,
  });

  // Fetch similar products (different categories but similar price range)
  const { data: similarProducts = [] } = useQuery({
    queryKey: ['/api/products', 'similar', product?.price, product?.id],
    queryFn: async () => {
      const price = parseFloat(product?.price || '0');
      const minPrice = Math.max(0, price - 50);
      const maxPrice = price + 50;
      const response = await apiRequest('GET', `/api/products?minPrice=${minPrice}&maxPrice=${maxPrice}&limit=12&excludeId=${product?.id}`);
      return response.json();
    },
    enabled: !!product?.price && !!product?.id,
  });

  // Mock image sets for demonstration (in real app, these would come from product data)
  const imageSets = [
    [
      product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&h=500&fit=crop',
    ]
  ];

  const currentImages = imageSets[currentImageSet] || [];

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) throw new Error('Authentication required');
      const response = await apiRequest('POST', '/api/cart', {
        productId: parseInt(id!),
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('products.addedToCart'),
        description: `${product?.title} has been added to your cart`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Login Required",
          description: "Please log in to add items to cart",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/auth", 1000);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) throw new Error('Authentication required');
      const response = await apiRequest('POST', '/api/wishlist', {
        productId: parseInt(id!),
      });
      return response.json();
    },
    onSuccess: () => {
      setIsWishlisted(true);
      toast({
        title: "Added to Wishlist",
        description: `${product?.title} has been added to your wishlist`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Login Required",
          description: "Please log in to add items to wishlist",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/auth", 1000);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    },
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string }) => {
      if (!isAuthenticated) throw new Error('Authentication required');
      const response = await apiRequest('POST', `/api/products/${id}/reviews`, reviewData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
      setReviewText('');
      setReviewRating(5);
      queryClient.invalidateQueries({ queryKey: ['/api/products', id, 'reviews'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Login Required",
          description: "Please log in to submit a review",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/auth", 1000);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      addToLocalCart(product!, quantity);
      toast({
        title: "Added to Cart",
        description: `${product?.title} has been added to your cart`,
      });
      return;
    }
    addToCartMutation.mutate();
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      addToLocalWishlist(product!);
      toast({
        title: "Added to Wishlist",
        description: `${product?.title} has been added to your wishlist`,
      });
      return;
    }
    addToWishlistMutation.mutate();
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) return;
    submitReviewMutation.mutate({
      rating: reviewRating,
      comment: reviewText,
    });
  };

  const calculateAverageRating = () => {
    if (reviewsArray.length === 0) return 0;
    const sum = reviewsArray.reduce((acc: number, review: Review) => acc + review.rating, 0);
    return sum / reviewsArray.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsArray.forEach((review: Review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Button onClick={() => setLocation('/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => setLocation('/')} className="hover:text-primary">Home</button>
            <ChevronRight className="h-4 w-4" />
            <button onClick={() => setLocation('/products')} className="hover:text-primary">Products</button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 relative group">
                <img
                  src={currentImages[selectedImageIndex] || product.images?.[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {currentImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={selectedImageIndex === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(Math.min(currentImages.length - 1, selectedImageIndex + 1))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={selectedImageIndex === currentImages.length - 1}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} of {currentImages.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4">
                <div className="grid grid-cols-6 gap-2">
                  {currentImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({averageRating.toFixed(1)}) • {reviewsArray.length} reviews
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddToWishlist}
                    disabled={addToWishlistMutation.isPending}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-primary">${product.price}</span>
                  <span className="text-lg text-gray-500 line-through">$89.99</span>
                  <Badge variant="destructive" className="text-sm">15% OFF</Badge>
                </div>
                <p className="text-sm text-green-600 mt-1">Free shipping on orders over $50</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">12 sold in the last 24 hours</span>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Quantity:</label>
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  size="lg"
                  className="w-full"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Shop with Confidence */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                Shop with confidence
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-full">
                    <Truck className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Free 2-day shipping</p>
                    <p className="text-xs text-gray-600">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <RotateCcw className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">30-day returns</p>
                    <p className="text-xs text-gray-600">Free returns & exchanges</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-full">
                    <Award className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Top-rated seller</p>
                    <p className="text-xs text-gray-600">98.5% positive feedback</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-50 rounded-full">
                    <Shield className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Money-back guarantee</p>
                    <p className="text-xs text-gray-600">Protected by our guarantee</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${product.sellerId}&background=random`} />
                  <AvatarFallback>{product.sellerId?.charAt(0)?.toUpperCase() || 'S'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{product.sellerId}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>98.5% positive</span>
                    <span>•</span>
                    <span>1,234 reviews</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span>Ships from California, United States</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Usually ships within 1 business day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviewsArray.length})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="p-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <div className={`text-gray-700 ${!expandedDescription ? 'line-clamp-4' : ''}`}>
                  <p className="mb-4">{product.description}</p>
                  <p className="mb-4">
                    This premium product features high-quality materials and exceptional craftsmanship. 
                    Perfect for everyday use or special occasions, it combines style with functionality 
                    to meet your needs.
                  </p>
                  <p className="mb-4">
                    Key features include durable construction, modern design, and versatile functionality. 
                    Whether you're looking for reliability or style, this product delivers on all fronts.
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>Premium materials for long-lasting durability</li>
                    <li>Ergonomic design for comfort and ease of use</li>
                    <li>Versatile functionality for multiple applications</li>
                    <li>Modern aesthetic that complements any style</li>
                    <li>Easy maintenance and care instructions</li>
                  </ul>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setExpandedDescription(!expandedDescription)}
                  className="mt-2"
                >
                  {expandedDescription ? (
                    <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>Show more <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="p-6">
              <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
              {productModelConfig?.detailAttributes?.length ? (
                <div className="mb-4">
                  <ModelAttributePanel
                    title="Dynamic details"
                    attributes={productModelConfig.detailAttributes}
                    data={product}
                  />
                </div>
              ) : null}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Brand</span>
                    <span>Premium Brand</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Model</span>
                    <span>PB-2024</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Material</span>
                    <span>High-grade materials</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Color</span>
                    <span>Multiple options</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Weight</span>
                    <span>2.5 lbs</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Dimensions</span>
                    <span>12" x 8" x 4"</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Warranty</span>
                    <span>1 year</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Country of Origin</span>
                    <span>USA</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6">
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="border-b pb-6">
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reviewsArray.length} reviews
                      </div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2 mb-2">
                          <span className="text-sm w-8">{rating}</span>
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <div className="flex-1">
                            <Progress
                              value={reviewsArray.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviewsArray.length) * 100 : 0}
                              className="h-2"
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {ratingDistribution[rating as keyof typeof ratingDistribution]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add Review Form */}
                {isAuthenticated && (
                  <div className="border-b pb-6">
                    <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setReviewRating(rating)}
                              className="p-1"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  rating <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Your Review</label>
                        <Textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your experience with this product..."
                          rows={4}
                        />
                      </div>
                      <Button
                        onClick={handleSubmitReview}
                        disabled={!reviewText.trim() || submitReviewMutation.isPending}
                      >
                        {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviewsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : reviewsArray.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No reviews yet. Be the first to review this product!
                    </div>
                  ) : (
                    reviewsArray.map((review: Review & { user?: User }) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.user?.profileImageUrl} />
                            <AvatarFallback>
                              {review.user?.firstName?.[0] || (typeof review.userId === 'string' ? review.userId.charAt(0).toUpperCase() : 'U')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">
                                {review.user?.firstName || (typeof review.userId === 'string' ? review.userId : 'Anonymous')}
                              </span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {format(new Date(review.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-50 rounded-full">
                        <Truck className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Free Standard Shipping</p>
                        <p className="text-sm text-gray-600">5-7 business days • Orders over $50</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-full">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Express Shipping</p>
                        <p className="text-sm text-gray-600">2-3 business days • $9.99</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-50 rounded-full">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Overnight Delivery</p>
                        <p className="text-sm text-gray-600">Next business day • $19.99</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Return Policy</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      <strong>30-Day Returns:</strong> Return any item within 30 days of delivery for a full refund.
                    </p>
                    <p>
                      <strong>Free Returns:</strong> We provide free return shipping labels for all returns.
                    </p>
                    <p>
                      <strong>Easy Process:</strong> Print a return label and drop off at any carrier location.
                    </p>
                    <p>
                      <strong>Refund Timeline:</strong> Refunds processed within 3-5 business days of receiving returned item.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Related items</h2>
            <Button variant="outline" onClick={() => setLocation('/products')}>
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedProducts.slice(0, 6).map((relatedProduct: Product) => (
              <Card key={relatedProduct.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden">
                    <img
                      src={relatedProduct.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onClick={() => setLocation(`/products/${relatedProduct.id}`)}
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{relatedProduct.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">${relatedProduct.price}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Similar Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Similar items</h2>
            <Button variant="outline" onClick={() => setLocation('/products')}>
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarProducts.slice(0, 6).map((similarProduct: Product) => (
              <Card key={similarProduct.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden">
                    <img
                      src={similarProduct.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'}
                      alt={similarProduct.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onClick={() => setLocation(`/products/${similarProduct.id}`)}
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{similarProduct.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">${similarProduct.price}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Eye className="h-6 w-6 mr-2" />
              Recently viewed
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedProducts.slice(0, 4).map((recentProduct: Product) => (
              <Card key={recentProduct.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden">
                    <img
                      src={recentProduct.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'}
                      alt={recentProduct.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onClick={() => setLocation(`/products/${recentProduct.id}`)}
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{recentProduct.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">${recentProduct.price}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}