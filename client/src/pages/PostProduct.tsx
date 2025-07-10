import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Camera, Upload, X, Plus, Minus, Info, AlertCircle, Check, ChevronDown, ChevronUp, Save, Eye, Package, Truck, DollarSign, Tag, Grid, FileText, Image as ImageIcon, Globe, Shield, Clock, Star, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { HelpTooltip } from "@/components/HelpTooltip";
import type { Category, Product } from "@shared/schema";

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  condition: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  weight: string;
  dimensions: string;
  material: string;
  manufacturer: string;
  countryOfOrigin: string;
  warranty: string;
  listingType: string;
  duration: string;
  startPrice: string;
  reservePrice: string;
  buyItNowPrice: string;
  acceptOffers: boolean;
  internationalShipping: boolean;
  freeShipping: boolean;
  shippingCost: string;
  handlingTime: string;
  returnPolicy: string;
  returnPeriod: string;
  images: string[];
  tags: string[];
  features: string[];
  specifications: { [key: string]: string };
}

const initialFormData: ProductFormData = {
  title: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  condition: "new",
  brand: "",
  model: "",
  color: "",
  size: "",
  weight: "",
  dimensions: "",
  material: "",
  manufacturer: "",
  countryOfOrigin: "",
  warranty: "",
  listingType: "fixed",
  duration: "7",
  startPrice: "",
  reservePrice: "",
  buyItNowPrice: "",
  acceptOffers: false,
  internationalShipping: false,
  freeShipping: false,
  shippingCost: "",
  handlingTime: "1",
  returnPolicy: "30-day",
  returnPeriod: "30",
  images: [],
  tags: [],
  features: [],
  specifications: {}
};

export default function PostProduct() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isDraft, setIsDraft] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => apiRequest('GET', '/api/categories'),
  });

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to post products",
        variant: "destructive",
      });
      setTimeout(() => window.location.href = "/api/login", 1000);
    }
  }, [isAuthenticated, toast]);

  const steps = [
    {
      id: 0,
      title: "Product Details",
      description: "Tell us about your item",
      icon: <Package className="h-5 w-5" />,
      fields: ['title', 'description', 'categoryId', 'condition', 'brand']
    },
    {
      id: 1,
      title: "Photos & Media",
      description: "Add photos and videos",
      icon: <ImageIcon className="h-5 w-5" />,
      fields: ['images']
    },
    {
      id: 2,
      title: "Pricing & Quantity",
      description: "Set your price and quantity",
      icon: <DollarSign className="h-5 w-5" />,
      fields: ['price', 'stock', 'listingType']
    },
    {
      id: 3,
      title: "Shipping & Returns",
      description: "Set shipping and return policies",
      icon: <Truck className="h-5 w-5" />,
      fields: ['shippingCost', 'handlingTime', 'returnPolicy']
    },
    {
      id: 4,
      title: "Review & Publish",
      description: "Review your listing",
      icon: <Eye className="h-5 w-5" />,
      fields: []
    }
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData('tags', [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      updateFormData('features', [...formData.features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove: string) => {
    updateFormData('features', formData.features.filter(feature => feature !== featureToRemove));
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      updateFormData('specifications', {
        ...formData.specifications,
        [specKey.trim()]: specValue.trim()
      });
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpecification = (keyToRemove: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[keyToRemove];
    updateFormData('specifications', newSpecs);
  };

  const handleImageUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setUploadingImages(true);
    const formDataUpload = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formDataUpload.append('images', files[i]);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { urls } = await response.json();
      updateFormData('images', [...formData.images, ...urls]);
      
      toast({
        title: "Images uploaded successfully",
        description: `${urls.length} image(s) added to your listing`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    updateFormData('images', formData.images.filter((_, index) => index !== indexToRemove));
  };

  const validateStep = (stepIndex: number) => {
    const step = steps[stepIndex];
    const requiredFields = step.fields;
    
    for (const field of requiredFields) {
      if (!formData[field as keyof ProductFormData] || 
          (Array.isArray(formData[field as keyof ProductFormData]) && 
           (formData[field as keyof ProductFormData] as any[]).length === 0)) {
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    } else {
      toast({
        title: "Please complete all required fields",
        description: "Fill in the required information before proceeding",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const saveDraft = async () => {
    setIsDraft(true);
    // In a real app, you would save to drafts API
    toast({
      title: "Draft saved",
      description: "Your listing has been saved as a draft",
    });
  };

  const submitProduct = useMutation({
    mutationFn: async (productData: any) => {
      return apiRequest('POST', '/api/products', productData);
    },
    onSuccess: () => {
      toast({
        title: "Product listed successfully!",
        description: "Your product is now live on the marketplace",
      });
      setLocation('/seller/dashboard');
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Login Required",
          description: "Please log in to post products",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 1000);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create product listing",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    const productData = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      stock: parseInt(formData.stock),
      categoryId: parseInt(formData.categoryId),
      images: formData.images,
      condition: formData.condition,
      brand: formData.brand,
      features: formData.features,
      specifications: formData.specifications,
      tags: formData.tags,
    };

    submitProduct.mutate(productData);
  };

  const getProgressPercentage = () => {
    return ((completedSteps.length + (validateStep(currentStep) ? 1 : 0)) / steps.length) * 100;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
            <Button onClick={() => window.location.href = "/api/login"}>
              Login to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Progress Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create your listing</h1>
              <p className="text-gray-600">Get your item in front of millions of buyers</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={saveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Preview Your Listing</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {formData.images.length > 0 && (
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={formData.images[0]}
                            alt={formData.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">{formData.title || "Product Title"}</h2>
                      <div className="text-3xl font-bold text-primary mb-4">
                        ${formData.price || "0.00"}
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><strong>Condition:</strong> {formData.condition}</p>
                        <p><strong>Brand:</strong> {formData.brand}</p>
                        <p><strong>Stock:</strong> {formData.stock}</p>
                      </div>
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-700">{formData.description || "No description yet."}</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    ${index === currentStep ? 'bg-primary text-white' : 
                      completedSteps.includes(index) ? 'bg-green-500 text-white' : 
                      'bg-gray-200 text-gray-600'}
                  `}>
                    {completedSteps.includes(index) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div className={`text-sm font-medium ${index === currentStep ? 'text-primary' : 'text-gray-700'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {Math.round(getProgressPercentage())}% complete
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Product Details
                  </h2>
                  <p className="text-gray-600 mb-6">Provide basic information about your item</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="flex items-center">
                      Title <span className="text-red-500 ml-1">*</span>
                      <HelpTooltip 
                        content={{
                          id: "product-title",
                          title: "Product Title Tips",
                          description: "Write a clear, descriptive title that buyers will search for",
                          tips: [
                            "Include brand, model, and key features",
                            "Use specific keywords buyers search for",
                            "Keep it under 80 characters",
                            "Avoid symbols and excessive punctuation"
                          ]
                        }}
                      />
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      placeholder="e.g., Apple iPhone 14 Pro Max 256GB Unlocked - Space Black"
                      className="mt-1"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.title.length}/80 characters
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category" className="flex items-center">
                      Category <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select value={formData.categoryId} onValueChange={(value) => updateFormData('categoryId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                        ) : (
                          safeCategories.map((category: Category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition" className="flex items-center">
                      Condition <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select value={formData.condition} onValueChange={(value) => updateFormData('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="very-good">Very Good</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="acceptable">Acceptable</SelectItem>
                        <SelectItem value="for-parts">For Parts or Not Working</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => updateFormData('brand', e.target.value)}
                        placeholder="e.g., Apple, Samsung, Nike"
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => updateFormData('model', e.target.value)}
                        placeholder="e.g., iPhone 14 Pro Max"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="flex items-center">
                      Description <span className="text-red-500 ml-1">*</span>
                      <HelpTooltip 
                        content={{
                          id: "product-description",
                          title: "Description Best Practices",
                          description: "Write a detailed description that helps buyers understand your item",
                          tips: [
                            "Describe the item's condition honestly",
                            "Include all relevant details and specifications",
                            "Mention any defects or wear",
                            "Use bullet points for easy reading",
                            "Include dimensions and weight if relevant"
                          ]
                        }}
                      />
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      rows={6}
                      placeholder="Describe your item in detail. Include condition, features, and any relevant information buyers should know..."
                      className="mt-1"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/1000 characters recommended
                    </div>
                  </div>

                  {/* Additional Details Accordion */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="additional-details">
                      <AccordionTrigger>Additional Product Details (Optional)</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="color">Color</Label>
                              <Input
                                id="color"
                                value={formData.color}
                                onChange={(e) => updateFormData('color', e.target.value)}
                                placeholder="e.g., Black, White, Red"
                              />
                            </div>
                            <div>
                              <Label htmlFor="size">Size</Label>
                              <Input
                                id="size"
                                value={formData.size}
                                onChange={(e) => updateFormData('size', e.target.value)}
                                placeholder="e.g., Large, 10.5, 42"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="weight">Weight</Label>
                              <Input
                                id="weight"
                                value={formData.weight}
                                onChange={(e) => updateFormData('weight', e.target.value)}
                                placeholder="e.g., 1.2 lbs, 500g"
                              />
                            </div>
                            <div>
                              <Label htmlFor="dimensions">Dimensions</Label>
                              <Input
                                id="dimensions"
                                value={formData.dimensions}
                                onChange={(e) => updateFormData('dimensions', e.target.value)}
                                placeholder="e.g., 12 x 8 x 4 inches"
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Photos & Media
                  </h2>
                  <p className="text-gray-600 mb-6">Add photos to help buyers see your item</p>
                </div>

                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Add at least 1 photo. Items with multiple photos typically sell faster and for higher prices.
                    </AlertDescription>
                  </Alert>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        {uploadingImages ? 'Uploading...' : 'Add photos'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Drag and drop or click to browse • Max 12 photos • JPG, PNG up to 10MB each
                      </p>
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2 bg-blue-500">
                              Main Photo
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Photo Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use natural lighting and avoid shadows</li>
                      <li>• Show the item from multiple angles</li>
                      <li>• Include close-ups of important details</li>
                      <li>• Show any defects or wear honestly</li>
                      <li>• Use a clean, uncluttered background</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Pricing & Quantity
                  </h2>
                  <p className="text-gray-600 mb-6">Set your price and quantity</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="listingType">Listing Type</Label>
                    <RadioGroup 
                      value={formData.listingType} 
                      onValueChange={(value) => updateFormData('listingType', value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed">Fixed Price</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auction" id="auction" />
                        <Label htmlFor="auction">Auction</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price" className="flex items-center">
                        {formData.listingType === 'auction' ? 'Starting Price' : 'Price'} 
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => updateFormData('price', e.target.value)}
                          placeholder="0.00"
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="stock" className="flex items-center">
                        Quantity <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        min="1"
                        value={formData.stock}
                        onChange={(e) => updateFormData('stock', e.target.value)}
                        placeholder="1"
                      />
                    </div>
                  </div>

                  {formData.listingType === 'auction' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">Auction Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration">Auction Duration</Label>
                          <Select value={formData.duration} onValueChange={(value) => updateFormData('duration', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Day</SelectItem>
                              <SelectItem value="3">3 Days</SelectItem>
                              <SelectItem value="5">5 Days</SelectItem>
                              <SelectItem value="7">7 Days</SelectItem>
                              <SelectItem value="10">10 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="buyItNowPrice">Buy It Now Price (Optional)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              id="buyItNowPrice"
                              type="number"
                              step="0.01"
                              value={formData.buyItNowPrice}
                              onChange={(e) => updateFormData('buyItNowPrice', e.target.value)}
                              placeholder="0.00"
                              className="pl-8"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="acceptOffers"
                      checked={formData.acceptOffers}
                      onCheckedChange={(checked) => updateFormData('acceptOffers', checked)}
                    />
                    <Label htmlFor="acceptOffers">Accept offers from buyers</Label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping & Returns
                  </h2>
                  <p className="text-gray-600 mb-6">Set your shipping and return policies</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shippingCost">Shipping Cost</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="freeShipping"
                          checked={formData.freeShipping}
                          onCheckedChange={(checked) => updateFormData('freeShipping', checked)}
                        />
                        <Label htmlFor="freeShipping">Free shipping</Label>
                      </div>
                      {!formData.freeShipping && (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.shippingCost}
                            onChange={(e) => updateFormData('shippingCost', e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="handlingTime">Handling Time</Label>
                    <Select value={formData.handlingTime} onValueChange={(value) => updateFormData('handlingTime', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select handling time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 business day</SelectItem>
                        <SelectItem value="2">2 business days</SelectItem>
                        <SelectItem value="3">3 business days</SelectItem>
                        <SelectItem value="5">5 business days</SelectItem>
                        <SelectItem value="7">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="returnPolicy">Return Policy</Label>
                    <Select value={formData.returnPolicy} onValueChange={(value) => updateFormData('returnPolicy', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select return policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30-day">30-day returns</SelectItem>
                        <SelectItem value="14-day">14-day returns</SelectItem>
                        <SelectItem value="7-day">7-day returns</SelectItem>
                        <SelectItem value="no-returns">No returns</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="internationalShipping"
                      checked={formData.internationalShipping}
                      onCheckedChange={(checked) => updateFormData('internationalShipping', checked)}
                    />
                    <Label htmlFor="internationalShipping">Offer international shipping</Label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Review & Publish
                  </h2>
                  <p className="text-gray-600 mb-6">Review your listing before publishing</p>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Listing Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          {formData.images.length > 0 && (
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                              <img
                                src={formData.images[0]}
                                alt={formData.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="text-sm text-gray-600">
                            {formData.images.length} photo(s) added
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{formData.title}</h3>
                          <div className="text-2xl font-bold text-primary mb-4">
                            ${formData.price}
                          </div>
                          <div className="space-y-2 text-sm">
                            <div><strong>Category:</strong> {safeCategories.find(c => c.id.toString() === formData.categoryId)?.name || 'Not selected'}</div>
                            <div><strong>Condition:</strong> {formData.condition}</div>
                            <div><strong>Quantity:</strong> {formData.stock}</div>
                            <div><strong>Shipping:</strong> {formData.freeShipping ? 'Free' : `$${formData.shippingCost}`}</div>
                            <div><strong>Returns:</strong> {formData.returnPolicy}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      By publishing this listing, you agree to our seller terms and conditions. 
                      Make sure all information is accurate and complete.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {currentStep < steps.length - 1 ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={submitProduct.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitProduct.isPending ? 'Publishing...' : 'Publish Listing'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}