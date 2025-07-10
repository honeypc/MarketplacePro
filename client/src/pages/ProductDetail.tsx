import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Star, Heart, Share2, Shield, Truck, RotateCcw, MessageSquare, ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Product, Review, User } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { addToLocalCart, addToLocalWishlist } = useStore();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product details
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['/api/products', id],
    queryFn: () => apiRequest('GET', `/api/products/${id}`),
    enabled: !!id,
  });

  // Fetch product reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/products', id, 'reviews'],
    queryFn: () => apiRequest('GET', `/api/products/${id}/reviews`),
    enabled: !!id,
  });

  // Fetch seller information
  const { data: seller } = useQuery({
    queryKey: ['/api/users', product?.sellerId],
    queryFn: () => apiRequest('GET', `/api/users/${product?.sellerId}`),
    enabled: !!product?.sellerId,
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['/api/products', 'related', product?.categoryId],
    queryFn: () => apiRequest('GET', `/api/products?categoryId=${product?.categoryId}&limit=4`),
    enabled: !!product?.categoryId,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) throw new Error('Authentication required');
      return apiRequest('POST', '/api/cart', {
        productId: parseInt(id!),
        quantity,
      });
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
        setTimeout(() => window.location.href = "/api/login", 1000);
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
      return apiRequest('POST', '/api/wishlist', {
        productId: parseInt(id!),
      });
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
        setTimeout(() => window.location.href = "/api/login", 1000);
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
    mutationFn: async () => {
      if (!isAuthenticated) throw new Error('Authentication required');
      return apiRequest('POST', '/api/reviews', {
        productId: parseInt(id!),
        rating: reviewRating,
        comment: reviewText,
      });
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
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
        setTimeout(() => window.location.href = "/api/login", 1000);
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
      toast({
        title: "Login Required",
        description: "Please log in to add items to cart",
        variant: "destructive",
      });
      setTimeout(() => window.location.href = "/api/login", 1000);
      return;
    }
    addToCartMutation.mutate();
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to wishlist",
        variant: "destructive",
      });
      setTimeout(() => window.location.href = "/api/login", 1000);
      return;
    }
    addToWishlistMutation.mutate();
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to proceed with purchase",
        variant: "destructive",
      });
      setTimeout(() => window.location.href = "/api/login", 1000);
      return;
    }
    // Add to cart and redirect to checkout
    addToCartMutation.mutate();
    setTimeout(() => setLocation('/checkout'), 1000);
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      toast({
        title: "Error",
        description: "Please write a review comment",
        variant: "destructive",
      });
      return;
    }
    submitReviewMutation.mutate();
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-300 aspect-square rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-10 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const averageRating = calculateAverageRating();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-gray-800">Home</a>
          <span className="mx-2">/</span>
          <a href="/products" className="hover:text-gray-800">Products</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Main Image */}
              <div className="aspect-square relative bg-gray-100">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                      disabled={selectedImageIndex === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(Math.min(images.length - 1, selectedImageIndex + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                      disabled={selectedImageIndex === images.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                          index === selectedImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && parseFloat(product.originalPrice.toString()) > parseFloat(product.price.toString()) && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min="1"
                    max={product.stock}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleBuyNow}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                  disabled={product.stock === 0}
                >
                  Buy Now
                </Button>
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3"
                  disabled={product.stock === 0 || addToCartMutation.isPending}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleAddToWishlist}
                  variant="outline"
                  className="w-full"
                  disabled={isWishlisted || addToWishlistMutation.isPending}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                  {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

              {/* Share Button */}
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share this product
                </Button>
              </div>
            </div>

            {/* Seller Info */}
            {seller && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={seller.profileImageUrl} />
                    <AvatarFallback>
                      {seller.firstName?.[0]}{seller.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{seller.firstName} {seller.lastName}</h4>
                    <p className="text-sm text-gray-600">{seller.email}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Seller
                </Button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Shopping Confidence</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Buyer Protection</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Fast Shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Write Review Form */}
                  {isAuthenticated && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Write a Review</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Rating</label>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setReviewRating(i + 1)}
                                className={`w-6 h-6 ${
                                  i < reviewRating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              >
                                <Star className="w-full h-full" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Review</label>
                          <Textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience with this product..."
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={handleSubmitReview}
                          disabled={submitReviewMutation.isPending}
                        >
                          {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No reviews yet. Be the first to review this product!
                      </p>
                    ) : (
                      reviews.map((review: Review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Information</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Free shipping on orders over $50</li>
                        <li>• Standard shipping: 5-7 business days</li>
                        <li>• Express shipping: 2-3 business days</li>
                        <li>• Overnight shipping available</li>
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold mb-2">Returns & Exchanges</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• 30-day return policy</li>
                        <li>• Items must be in original condition</li>
                        <li>• Free returns on defective items</li>
                        <li>• Return shipping costs may apply</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct: Product) => (
                <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={relatedProduct.images?.[0] || '/api/placeholder/300/300'}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{relatedProduct.title}</h3>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(relatedProduct.price)}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setLocation(`/products/${relatedProduct.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}