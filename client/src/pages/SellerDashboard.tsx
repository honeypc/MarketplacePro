import { useState } from "react";
import { Plus, Store, Package, DollarSign, TrendingUp, Eye, Edit3, Trash2, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { HelpTooltip, helpContent } from "@/components/HelpTooltip";
import { HelpGuidance, guidanceFlows, useGuidanceFlow } from "@/components/HelpGuidance";
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Product, Category } from "@shared/schema";

const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  logo: z.string().url("Please enter a valid URL"),
  bannerImage: z.string().url("Please enter a valid URL"),
  contactEmail: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const productSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().min(0, "Stock cannot be negative"),
  categoryId: z.number().min(1, "Please select a category"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

type StoreFormData = z.infer<typeof storeSchema>;
type ProductFormData = z.infer<typeof productSchema>;

export default function SellerDashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  
  // Help guidance for new sellers
  const guidance = useGuidanceFlow('newSeller');

  // Store form
  const storeForm = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      bannerImage: '',
      contactEmail: '',
      phone: '',
      address: '',
    },
  });

  // Product form
  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: 0,
      images: [],
    },
  });

  // Fetch seller's store
  const { data: store } = useQuery({
    queryKey: ['/api/seller/store'],
    enabled: isAuthenticated,
  });

  // Fetch seller's products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/seller/products'],
    enabled: isAuthenticated,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Fetch seller stats
  const { data: stats } = useQuery({
    queryKey: ['/api/seller/stats'],
    enabled: isAuthenticated,
  });

  // Show guidance for new sellers (users with no products)
  const shouldShowGuidance = products?.length === 0 && !guidance.isDismissed;

  // Store creation/update mutation
  const storeMutation = useMutation({
    mutationFn: async (data: StoreFormData) => {
      const method = store ? 'PUT' : 'POST';
      const url = store ? `/api/seller/store/${store.id}` : '/api/seller/store';
      await apiRequest(method, url, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: store ? "Store updated successfully" : "Store created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/seller/store'] });
      setIsStoreDialogOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save store",
        variant: "destructive",
      });
    },
  });

  // Product creation/update mutation
  const productMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('stock', data.stock.toString());
      formData.append('categoryId', data.categoryId.toString());
      
      // Add images as JSON
      formData.append('images', JSON.stringify(data.images));

      const url = selectedProduct ? `/api/products/${selectedProduct.id}` : '/api/products';
      const method = selectedProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${selectedProduct ? 'update' : 'create'} product`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: selectedProduct ? "Product updated successfully" : "Product created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/seller/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/seller/stats'] });
      setIsProductDialogOpen(false);
      setSelectedProduct(null);
      setProductImages([]);
      productForm.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    },
  });

  // Product deletion mutation
  const deleteMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest('DELETE', `/api/products/${productId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/seller/products'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductImages(product.images || []);
    productForm.reset({
      title: product.title,
      description: product.description,
      price: parseFloat(product.price.toString()),
      stock: product.stock,
      categoryId: product.categoryId,
      images: product.images || [],
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(productId);
    }
  };

  const onStoreSubmit = (data: StoreFormData) => {
    storeMutation.mutate(data);
  };

  const onProductSubmit = (data: ProductFormData) => {
    // Update form data with current images
    const formData = { ...data, images: productImages };
    productMutation.mutate(formData);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">{t('common.loginRequired')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Please log in to access your seller dashboard
            </p>
            <Button onClick={() => window.location.href = "/api/login"}>
              {t('common.login')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {t('seller.dashboard')}
              </h1>
              <HelpTooltip 
                content={helpContent.orderManagement}
                size="lg"
                placement="bottom"
              />
            </div>
            <Link href="/analytics">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-gray-600">
            Manage your store and products
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats?.totalRevenue || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.avgRating || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Store Management */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Store className="h-5 w-5 mr-2" />
                  Store Information
                </span>
                <Dialog open={isStoreDialogOpen} onOpenChange={setIsStoreDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      {store ? <Edit3 className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                      {store ? 'Edit Store' : 'Create Store'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {store ? 'Edit Store' : 'Create Store'}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...storeForm}>
                      <form onSubmit={storeForm.handleSubmit(onStoreSubmit)} className="space-y-4">
                        <FormField
                          control={storeForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Store Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter store name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={storeForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Describe your store" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={storeForm.control}
                          name="logo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logo URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/logo.png" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={storeForm.control}
                          name="bannerImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Banner Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/banner.png" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={storeForm.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="store@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsStoreDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={storeMutation.isPending}>
                            {storeMutation.isPending ? 'Saving...' : 'Save Store'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {store ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img src={store.logo} alt={store.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <h3 className="text-lg font-semibold">{store.name}</h3>
                      <p className="text-gray-600">{store.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No store created yet. Create your store to start selling!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Products Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Products ({products.length})
                <HelpTooltip 
                  content={helpContent.productDescription}
                  size="md"
                  placement="bottom"
                  className="ml-2"
                />
              </span>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                      <FormField
                        control={productForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              Product Title
                              <HelpTooltip 
                                content={helpContent.productDescription}
                                size="sm"
                                placement="top"
                              />
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter product title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe your product" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Price
                                <HelpTooltip 
                                  content={helpContent.productPricing}
                                  size="sm"
                                  placement="top"
                                />
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="0.00" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={productForm.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={productForm.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category: Category) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-4">
                        <Label htmlFor="images" className="flex items-center gap-2">
                          Product Images
                          <HelpTooltip 
                            content={helpContent.productUpload}
                            size="md"
                            placement="top"
                          />
                        </Label>
                        <ImageUpload 
                          images={productImages} 
                          onImagesChange={setProductImages} 
                          maxImages={10}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsProductDialogOpen(false);
                            setSelectedProduct(null);
                            setProductImages([]);
                            productForm.reset();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={productMutation.isPending}>
                          {productMutation.isPending ? 'Saving...' : 'Save Product'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No products yet. Add your first product!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: Product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square w-full">
                      <img 
                        src={product.images && product.images.length > 0 ? product.images[0] : '/api/placeholder/400/400'} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-green-600">${product.price}</span>
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}