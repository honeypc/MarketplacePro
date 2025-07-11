import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard, 
  Clock, 
  Star,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BookingHistoryCardProps {
  booking: any;
  onViewDetails: (id: number) => void;
  onUpdateStatus?: (id: number, status: string) => void;
  userType: 'guest' | 'host';
}

export function BookingHistoryCard({ booking, onViewDetails, onUpdateStatus, userType }: BookingHistoryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'completed': return <Star className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'cancelled': return 'Đã hủy';
      case 'completed': return 'Đã hoàn thành';
      default: return 'Không xác định';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      default: return 'Chưa thanh toán';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{booking.propertyTitle}</CardTitle>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{booking.propertyCity}, {booking.propertyCountry}</span>
            </div>
            {userType === 'host' && (
              <div className="text-sm text-gray-600">
                Khách: {booking.guestFirstName} {booking.guestLastName}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
              {getStatusIcon(booking.status)}
              <span>{getStatusText(booking.status)}</span>
            </Badge>
            {booking.paymentStatus && (
              <Badge className={`${getPaymentStatusColor(booking.paymentStatus)} flex items-center gap-1`}>
                <CreditCard className="h-3 w-3" />
                <span className="text-xs">{getPaymentStatusText(booking.paymentStatus)}</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {format(new Date(booking.checkInDate), 'dd/MM/yyyy', { locale: vi })} - 
              {format(new Date(booking.checkOutDate), 'dd/MM/yyyy', { locale: vi })}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{booking.guests} khách</span>
          </div>
        </div>

        {/* Promotion & Pricing */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tổng tiền:</span>
            <span className="font-semibold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}
            </span>
          </div>
          {booking.discountAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600">Giảm giá:</span>
              <span className="text-sm text-green-600">
                -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.discountAmount)}
              </span>
            </div>
          )}
          {booking.promotionTitle && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-600">Khuyến mãi:</span>
              <span className="text-sm text-blue-600">{booking.promotionTitle}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(booking.id)}
            className="flex-1"
          >
            Xem chi tiết
          </Button>
          {userType === 'host' && booking.status === 'pending' && onUpdateStatus && (
            <>
              <Button 
                size="sm" 
                onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                className="bg-green-600 hover:bg-green-700"
              >
                Xác nhận
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onUpdateStatus(booking.id, 'cancelled')}
              >
                Từ chối
              </Button>
            </>
          )}
          {userType === 'guest' && booking.status === 'pending' && onUpdateStatus && (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onUpdateStatus(booking.id, 'cancelled')}
            >
              Hủy đặt phòng
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingHistoryCard;