import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useProperty } from '@/hooks/useProperties';
import { usePropertyReviews, useCreatePropertyReview } from '@/hooks/usePropertyReviews';
import { useCreateBooking } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModelAttributePanel } from '@/components/ModelAttributePanel';
import { 
  MapPin, Users, Star, Calendar, Home, Building2, TreePine, Waves, 
  ArrowLeft, Heart, Share2, Wifi, Car, Waves as Pool, ChefHat, 
  Snowflake, Dumbbell, PawPrint, Tv, WashingMachine, Flame,
  CheckCircle, XCircle, MessageCircle, StarIcon
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays, addDays, startOfDay, endOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTableFormConfig } from '@/hooks/useTableFormConfig';

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  pool: Pool,
  kitchen: ChefHat,
  ac: Snowflake,
  gym: Dumbbell,
  pet_friendly: PawPrint,
  tv: Tv,
  washing_machine: WashingMachine,
  fireplace: Flame,
};

const propertyTypes = {
  apartment: { label: 'Căn hộ', icon: Building2 },
  house: { label: 'Nhà riêng', icon: Home },
  villa: { label: 'Biệt thự', icon: TreePine },
  condo: { label: 'Chung cư', icon: Building2 },
  studio: { label: 'Studio', icon: Building2 },
  resort: { label: 'Resort', icon: Waves },
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    specialRequests: '',
  });
  
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  
  const [reviewData, setReviewData] = useState({
    rating: 5,
    cleanliness: 5,
    communication: 5,
    checkIn: 5,
    accuracy: 5,
    location: 5,
    value: 5,
    comment: '',
  });

  const propertyId = parseInt(id || '0');
  const { data: property, isLoading, error } = useProperty(propertyId);
  const { data: reviews, isLoading: reviewsLoading } = usePropertyReviews(propertyId);
  const createBookingMutation = useCreateBooking();
  const createReviewMutation = useCreatePropertyReview();
  const { data: tableFormConfig } = useTableFormConfig();
  const propertyModelConfig = tableFormConfig?.models.find((model) => model.id === 'property');

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: 'Vui lòng đăng nhập',
        description: 'Bạn cần đăng nhập để đặt phòng.',
        variant: 'destructive',
      });
      return;
    }

    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      toast({
        title: 'Vui lòng chọn ngày',
        description: 'Hãy chọn ngày nhận phòng và trả phòng.',
        variant: 'destructive',
      });
      return;
    }

    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = differenceInDays(checkOut, checkIn);

    if (nights <= 0) {
      toast({
        title: 'Ngày không hợp lệ',
        description: 'Ngày trả phòng phải sau ngày nhận phòng.',
        variant: 'destructive',
      });
      return;
    }

    const totalPrice = nights * (property?.pricePerNight || 0);

    try {
      await createBookingMutation.mutateAsync({
        propertyId: property.id,
        hostId: property.hostId,
        checkInDate: startOfDay(checkIn),
        checkOutDate: endOfDay(checkOut),
        guests: bookingData.guests,
        nights,
        totalPrice,
        specialRequests: bookingData.specialRequests,
        status: 'pending',
      });
      
      setShowBookingDialog(false);
      setBookingData({
        checkInDate: '',
        checkOutDate: '',
        guests: 1,
        specialRequests: '',
      });
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const handleReview = async () => {
    if (!user) {
      toast({
        title: 'Vui lòng đăng nhập',
        description: 'Bạn cần đăng nhập để đánh giá.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        propertyId: property.id,
        ...reviewData,
      });
      
      setShowReviewDialog(false);
      setReviewData({
        rating: 5,
        cleanliness: 5,
        communication: 5,
        checkIn: 5,
        accuracy: 5,
        location: 5,
        value: 5,
        comment: '',
      });
    } catch (error) {
      console.error('Review error:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const calculateTotal = () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) return 0;
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = differenceInDays(checkOut, checkIn);
    return nights > 0 ? nights * property?.pricePerNight : 0;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center">
        <p className="text-red-500">Không tìm thấy thông tin chỗ ở. Vui lòng thử lại.</p>
        <Button onClick={() => setLocation('/properties')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const PropertyIcon = property.propertyType && propertyTypes[property.propertyType as keyof typeof propertyTypes]
    ? propertyTypes[property.propertyType as keyof typeof propertyTypes].icon
    : Home;

  const propertyTypeLabel = property.propertyType && propertyTypes[property.propertyType as keyof typeof propertyTypes]
    ? propertyTypes[property.propertyType as keyof typeof propertyTypes].label
    : 'Nhà ở';

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setLocation('/properties')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Yêu thích
          </Button>
        </div>
      </div>

      {/* Property Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 h-96">
        <div className="lg:col-span-2 lg:row-span-2">
          <img
            src={Array.isArray(property.images) && property.images[0] ? property.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'}
            alt={property.title || 'Property'}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {Array.isArray(property.images) && property.images.slice(1, 5).map((image: string, index: number) => (
          <img
            key={index}
            src={image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'}
            alt={`${property.title || 'Property'} ${index + 2}`}
            className="w-full h-full object-cover rounded-lg"
          />
        ))}
      </div>

      {/* Property Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Basic Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PropertyIcon className="h-5 w-5" />
              <Badge variant="secondary">
                {propertyTypeLabel}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{property.address}, {property.city}, {property.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{property.rating?.toFixed(1) || 'Mới'}</span>
                <span>({property.reviewCount || 0} đánh giá)</span>
              </div>
            </div>
          </div>

          {/* Host Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={property.host?.profileImageUrl} />
                  <AvatarFallback>
                    {property.host?.firstName?.[0]}{property.host?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    Chủ nhà: {property.host?.firstName} {property.host?.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Tham gia từ {format(new Date(property.createdAt), 'MM/yyyy', { locale: vi })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="amenities">Tiện nghi</TabsTrigger>
              <TabsTrigger value="location">Vị trí</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-600">Khách tối đa</p>
                  <p className="font-semibold">{property.maxGuests}</p>
                </div>
                <div className="text-center">
                  <Home className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <p className="text-sm text-gray-600">Phòng ngủ</p>
                  <p className="font-semibold">{property.bedrooms}</p>
                </div>
                <div className="text-center">
                  <Building2 className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-gray-600">Phòng tắm</p>
                  <p className="font-semibold">{property.bathrooms}</p>
                </div>
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm text-gray-600">Loại phòng</p>
                  <p className="font-semibold text-xs">{property.roomType || 'Toàn bộ'}</p>
                </div>
              </div>

              {propertyModelConfig?.detailAttributes?.length ? (
                <ModelAttributePanel
                  title="Chi tiết động"
                  attributes={propertyModelConfig.detailAttributes}
                  data={property}
                />
              ) : null}

              <div>
                <h3 className="font-semibold mb-2">Mô tả</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="amenities" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.isArray(property.amenities) && property.amenities.length > 0 ? (
                  property.amenities.map((amenity: string) => {
                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                    return Icon ? (
                      <div key={amenity} className="flex items-center gap-2 p-3 border rounded-lg">
                        <Icon className="h-5 w-5 text-blue-500" />
                        <span className="capitalize">{amenity.replace(/_/g, ' ')}</span>
                      </div>
                    ) : null;
                  })
                ) : (
                  <p className="text-gray-500 col-span-full text-center py-8">Không có thông tin tiện nghi</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="space-y-4">
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Bản đồ sẽ được hiển thị tại đây</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Địa chỉ</h3>
                <p className="text-gray-700">{property.address}, {property.city}, {property.country}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Đánh giá từ khách hàng</h3>
                <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Viết đánh giá
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Đánh giá chỗ ở</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {['cleanliness', 'communication', 'checkIn', 'accuracy', 'location', 'value'].map((criteria) => (
                        <div key={criteria} className="flex items-center justify-between">
                          <Label className="capitalize">{criteria.replace(/([A-Z])/g, ' $1').trim()}</Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`h-4 w-4 cursor-pointer ${
                                  star <= reviewData[criteria as keyof typeof reviewData]
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                onClick={() => setReviewData(prev => ({ ...prev, [criteria]: star }))}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                      <div>
                        <Label>Nhận xét</Label>
                        <Textarea
                          value={reviewData.comment}
                          onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                          placeholder="Chia sẻ trải nghiệm của bạn..."
                          className="mt-1"
                        />
                      </div>
                      <Button onClick={handleReview} className="w-full" disabled={createReviewMutation.isPending}>
                        {createReviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-4">
                {reviewsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))
                ) : reviews?.length > 0 ? (
                  reviews.map((review: any) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.guest?.profileImageUrl} />
                          <AvatarFallback>
                            {review.guest?.firstName?.[0]}{review.guest?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">
                            {review.guest?.firstName} {review.guest?.lastName}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{review.rating}</span>
                            <span className="text-gray-500 text-xs ml-2">
                              {format(new Date(review.createdAt), 'dd/MM/yyyy', { locale: vi })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Chưa có đánh giá nào</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{formatPrice(property.pricePerNight)}/đêm</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{property.rating?.toFixed(1) || 'Mới'}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Nhận phòng</Label>
                  <Input
                    type="date"
                    value={bookingData.checkInDate}
                    onChange={(e) => setBookingData(prev => ({ ...prev, checkInDate: e.target.value }))}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Trả phòng</Label>
                  <Input
                    type="date"
                    value={bookingData.checkOutDate}
                    onChange={(e) => setBookingData(prev => ({ ...prev, checkOutDate: e.target.value }))}
                    min={bookingData.checkInDate || format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Số khách</Label>
                <Input
                  type="number"
                  min="1"
                  max={property.maxGuests}
                  value={bookingData.guests}
                  onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  className="mt-1"
                />
              </div>

              {bookingData.checkInDate && bookingData.checkOutDate && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>{formatPrice(property.pricePerNight)} x {differenceInDays(new Date(bookingData.checkOutDate), new Date(bookingData.checkInDate))} đêm</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              )}

              <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    Đặt phòng ngay
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Xác nhận đặt phòng</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">{property.title}</h4>
                      {bookingData.checkInDate && bookingData.checkOutDate && (
                        <p className="text-sm text-gray-600">
                          {format(new Date(bookingData.checkInDate), 'dd/MM/yyyy', { locale: vi })} - {format(new Date(bookingData.checkOutDate), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">{bookingData.guests} khách</p>
                      <p className="font-semibold text-lg mt-2">
                        Tổng: {formatPrice(calculateTotal())}
                      </p>
                    </div>
                    
                    <div>
                      <Label>Yêu cầu đặc biệt (tùy chọn)</Label>
                      <Textarea
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                        placeholder="Nhập yêu cầu đặc biệt nếu có..."
                        className="mt-1"
                      />
                    </div>
                    
                    <Button onClick={handleBooking} className="w-full" disabled={createBookingMutation.isPending}>
                      {createBookingMutation.isPending ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <p className="text-xs text-gray-500 text-center">
                Bạn sẽ chưa bị tính phí
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}