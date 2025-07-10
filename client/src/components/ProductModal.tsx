import { useState } from "react";
import { X, Heart, ShoppingCart, Star, Plus, Minus, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function ProductModal() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { 
    isProductModalOpen, 
    selectedProduct, 
    closeProductModal,
    addToLocalCart 
  } = useStore();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: reviews = [] } = useQuery({
    queryKey: ['/api/products', selectedProduct?.id, 'reviews'],
    enabled: !!selectedProduct?.id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/cart', {
        productId: selectedProduct?.id,
        quantity: selectedQuantity,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product added to cart",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      
      // Optimistic update
      if (selectedProduct) {
        addToLocalCart({
          id: Date.now(),
          userId: '',
          productId: selectedProduct.id,
          quantity: selectedQuantity,
          createdAt: new Date(),
          product: selectedProduct,
        });
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/wishlist', {
        productId: selectedProduct?.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Added to wishlist",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add to wishlist",
        variant: "destructive",
      });
    },
  });

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }
    addToCartMutation.mutate();
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to manage your wishlist",
        variant: "destructive",
      });
      return;
    }
    addToWishlistMutation.mutate();
  };

  const discountPercentage = selectedProduct.originalPrice 
    ? Math.round((1 - parseFloat(selectedProduct.price) / parseFloat(selectedProduct.originalPrice)) * 100)
    : 0;

  const images = selectedProduct.images || [];
  const hasImages = images.length > 0;

  return (
    <Dialog open={isProductModalOpen} onOpenChange={closeProductModal}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Product Details
            <Button variant="ghost" size="icon" onClick={closeProductModal}>
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              {hasImages ? (
                <img
                  src={images[selectedImageIndex]}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400">No Image Available</span>
              )}
            </div>
            
            {hasImages && images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded border-2 ${
                      selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${selectedProduct.title} ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedProduct.title}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  (4.8) {reviews.length} {t('product.reviews')}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${parseFloat(selectedProduct.price).toFixed(2)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${parseFloat(selectedProduct.originalPrice).toFixed(2)}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {discountPercentage}% off
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-gray-700 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="font-medium">{t('product.quantity')}:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  disabled={selectedQuantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{selectedQuantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedQuantity(Math.min(selectedProduct.stock, selectedQuantity + 1))}
                  disabled={selectedQuantity >= selectedProduct.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-500">
                {selectedProduct.stock} {t('product.inStock')}
              </span>
            </div>
            
            <div className="flex space-x-4">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || selectedProduct.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t('product.addToCart')}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                disabled={addToWishlistMutation.isPending}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="h-4 w-4 mr-2" />
                <span>{t('product.freeShipping')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <RotateCcw className="h-4 w-4 mr-2" />
                <span>{t('product.returnPolicy')}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for additional information */}
        <Tabs defaultValue="reviews" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review: any, index: number) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3" />
                        <div>
                          <p className="font-medium">User {index + 1}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Product Details</h4>
                <dl className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">SKU:</dt>
                    <dd>{selectedProduct.sku || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Stock:</dt>
                    <dd>{selectedProduct.stock}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Weight:</dt>
                    <dd>{selectedProduct.weight || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
