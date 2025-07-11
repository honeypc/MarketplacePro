import React, { useState } from 'react';
import { useBookingHistory, useUpdateBookingStatus } from '@/hooks/useBookingHistory';
import { useAuth } from '@/hooks/useAuth';
import BookingHistoryCard from '@/components/BookingHistoryCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Download,
  BarChart3
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BookingHistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userType, setUserType] = useState<'guest' | 'host'>('guest');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: bookings = [], isLoading, error } = useBookingHistory(userType);
  const updateStatusMutation = useUpdateBookingStatus();

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast({
            title: 'Cập nhật thành công',
            description: `Trạng thái đặt phòng đã được cập nhật thành ${getStatusText(status)}`,
          });
        },
        onError: (error) => {
          toast({
            title: 'Lỗi cập nhật',
            description: 'Không thể cập nhật trạng thái đặt phòng',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleViewDetails = (id: number) => {
    // Navigate to booking details page
    window.location.href = `/booking-details/${id}`;
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

  const getStatusCount = (status: string) => {
    if (status === 'all') return bookings.length;
    return bookings.filter(booking => booking.status === status).length;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.propertyCity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateStats = () => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const avgRating = bookings.reduce((sum, b) => sum + (b.rating || 0), 0) / totalBookings || 0;

    return { totalBookings, confirmedBookings, totalRevenue, avgRating };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Lỗi tải dữ liệu</h1>
          <p className="text-gray-600 mt-2">Không thể tải lịch sử đặt phòng. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lịch sử đặt phòng</h1>
            <p className="text-gray-600 mt-1">
              Quản lý và theo dõi các đặt phòng của bạn
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Thống kê
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng đặt phòng</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã xác nhận</p>
                  <p className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND',
                      minimumFractionDigits: 0 
                    }).format(stats.totalRevenue)}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đánh giá TB</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.avgRating.toFixed(1)}/5
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Type Toggle */}
        <Tabs value={userType} onValueChange={(value) => setUserType(value as 'guest' | 'host')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="guest" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Khách hàng
            </TabsTrigger>
            <TabsTrigger value="host" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Chủ nhà
            </TabsTrigger>
          </TabsList>

          <TabsContent value={userType} className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Tìm kiếm theo tên khách sạn, địa điểm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('all')}
                    >
                      Tất cả ({getStatusCount('all')})
                    </Button>
                    <Button
                      variant={statusFilter === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('pending')}
                    >
                      Chờ xác nhận ({getStatusCount('pending')})
                    </Button>
                    <Button
                      variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('confirmed')}
                    >
                      Đã xác nhận ({getStatusCount('confirmed')})
                    </Button>
                    <Button
                      variant={statusFilter === 'completed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('completed')}
                    >
                      Hoàn thành ({getStatusCount('completed')})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking List */}
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Không tìm thấy đặt phòng phù hợp' 
                        : 'Chưa có đặt phòng nào'
                      }
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                        : userType === 'guest' 
                          ? 'Hãy bắt đầu khám phá và đặt phòng ngay hôm nay!'
                          : 'Chưa có khách nào đặt phòng của bạn'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredBookings.map((booking) => (
                  <BookingHistoryCard
                    key={booking.id}
                    booking={booking}
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={handleUpdateStatus}
                    userType={userType}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}