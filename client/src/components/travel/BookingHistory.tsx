import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plane, 
  Bus, 
  MapPin, 
  Calendar, 
  Clock,
  Users,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { format } from 'date-fns';
import ModifyBookingDialog from './ModifyBookingDialog';
import CancelBookingDialog from './CancelBookingDialog';
import SupportDialog from './SupportDialog';
import TicketDialog from './TicketDialog';

export default function BookingHistory() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  const sampleBookings = [
    {
      id: 1,
      bookingNumber: 'FLT-2024-001234',
      type: 'flight',
      title: 'Vietnam Airlines VN123',
      route: 'Ho Chi Minh City → Hanoi',
      date: '2024-01-15',
      time: '08:00 - 10:30',
      passengers: 2,
      amount: 5000000,
      status: 'confirmed',
      paymentStatus: 'paid',
      checkInStatus: 'pending',
      details: {
        airline: 'Vietnam Airlines',
        flightNumber: 'VN123',
        departure: { airport: 'SGN', city: 'Ho Chi Minh City', time: '08:00' },
        arrival: { airport: 'HAN', city: 'Hanoi', time: '10:30' },
        passengers: [
          { name: 'Nguyen Van A', seat: '15A' },
          { name: 'Nguyen Thi B', seat: '15B' }
        ]
      },
      bookingDate: '2024-01-10',
      qrCode: 'QR123456789'
    },
    {
      id: 2,
      bookingNumber: 'BUS-2024-005678',
      type: 'transport',
      title: 'Phuong Trang PT001',
      route: 'Ho Chi Minh City → Da Nang',
      date: '2024-01-20',
      time: '06:00 - 12:30',
      passengers: 1,
      amount: 450000,
      status: 'confirmed',
      paymentStatus: 'paid',
      checkInStatus: 'completed',
      details: {
        operator: 'Phuong Trang',
        routeNumber: 'PT001',
        departure: { station: 'Ben Xe Mien Dong', city: 'Ho Chi Minh City', time: '06:00' },
        arrival: { station: 'Ben Xe Da Nang', city: 'Da Nang', time: '12:30' },
        passengers: [
          { name: 'Nguyen Van A', seat: '12A' }
        ]
      },
      bookingDate: '2024-01-15',
      qrCode: 'QR987654321'
    },
    {
      id: 3,
      bookingNumber: 'TOUR-2024-009876',
      type: 'tour',
      title: 'Ha Long Bay Premium Cruise',
      route: 'Ha Long Bay',
      date: '2024-02-01',
      time: '2 Days 1 Night',
      passengers: 4,
      amount: 14000000,
      status: 'confirmed',
      paymentStatus: 'paid',
      checkInStatus: 'pending',
      details: {
        provider: 'Halong Tourism',
        duration: '2 Days 1 Night',
        destination: 'Ha Long Bay',
        passengers: [
          { name: 'Nguyen Van A' },
          { name: 'Nguyen Thi B' },
          { name: 'Nguyen Van C' },
          { name: 'Nguyen Thi D' }
        ]
      },
      bookingDate: '2024-01-25',
      qrCode: 'QR555666777'
    },
    {
      id: 4,
      bookingNumber: 'FLT-2024-001111',
      type: 'flight',
      title: 'VietJet Air VJ456',
      route: 'Hanoi → Ho Chi Minh City',
      date: '2024-01-05',
      time: '14:15 - 16:45',
      passengers: 1,
      amount: 1800000,
      status: 'completed',
      paymentStatus: 'paid',
      checkInStatus: 'completed',
      details: {
        airline: 'VietJet Air',
        flightNumber: 'VJ456',
        departure: { airport: 'HAN', city: 'Hanoi', time: '14:15' },
        arrival: { airport: 'SGN', city: 'Ho Chi Minh City', time: '16:45' },
        passengers: [
          { name: 'Nguyen Van A', seat: '8C' }
        ]
      },
      bookingDate: '2024-01-01',
      qrCode: 'QR111222333'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-5 w-5 text-blue-600" />;
      case 'transport': return <Bus className="h-5 w-5 text-green-600" />;
      case 'tour': return <MapPin className="h-5 w-5 text-purple-600" />;
      default: return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredBookings = activeTab === 'all' 
    ? sampleBookings 
    : sampleBookings.filter(booking => booking.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('myBookings')}</h3>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('refresh')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{t('all')}</TabsTrigger>
          <TabsTrigger value="flight">{t('flights')}</TabsTrigger>
          <TabsTrigger value="transport">{t('transport')}</TabsTrigger>
          <TabsTrigger value="tour">{t('tours')}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {getTypeIcon(booking.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-lg">{booking.title}</h4>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-1">{booking.route}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(booking.date), 'dd MMM yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{booking.passengers} passengers</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Booking #{booking.bookingNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 mb-2">
                        {formatCurrency(booking.amount)}
                      </p>
                      <div className="flex items-center space-x-2 mb-3">
                        {getStatusIcon(booking.paymentStatus)}
                        <span className="text-sm capitalize">{booking.paymentStatus}</span>
                      </div>
                      <div className="space-y-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowTicketDialog(true);
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {t('downloadTicket')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowTicketDialog(true);
                          }}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          {t('showQR')}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">{t('bookingDetails')}</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Booked on: {format(new Date(booking.bookingDate), 'dd MMM yyyy')}</p>
                          <p>Check-in: {booking.checkInStatus}</p>
                          {booking.type === 'flight' && (
                            <>
                              <p>Flight: {booking.details.flightNumber}</p>
                              <p>Aircraft: {booking.details.airline}</p>
                            </>
                          )}
                          {booking.type === 'transport' && (
                            <>
                              <p>Route: {booking.details.routeNumber}</p>
                              <p>Operator: {booking.details.operator}</p>
                            </>
                          )}
                          {booking.type === 'tour' && (
                            <>
                              <p>Duration: {booking.details.duration}</p>
                              <p>Provider: {booking.details.provider}</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">{t('passengers')}</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          {booking.details.passengers.map((passenger, index) => (
                            <p key={index}>
                              {passenger.name}
                              {passenger.seat && ` (${passenger.seat})`}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">{t('actions')}</h5>
                        <div className="space-y-2">
                          {booking.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowModifyDialog(true);
                              }}
                            >
                              {t('modify')}
                            </Button>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full text-red-600"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowCancelDialog(true);
                              }}
                            >
                              {t('cancel')}
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowSupportDialog(true);
                            }}
                          >
                            {t('contactSupport')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredBookings.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500 mb-4">
                    {getTypeIcon(activeTab === 'all' ? 'flight' : activeTab)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t('noBookingsFound')}</h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'all' 
                      ? t('youHaveNoBookingsYet') 
                      : t('youHaveNoBookingsInThisCategory')
                    }
                  </p>
                  <Button>
                    {t('startBooking')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Components */}
      <ModifyBookingDialog
        open={showModifyDialog}
        onClose={() => setShowModifyDialog(false)}
        booking={selectedBooking}
        onConfirm={(modified) => {
          console.log('Booking modified:', modified);
          setShowModifyDialog(false);
        }}
      />

      <CancelBookingDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        booking={selectedBooking}
        onConfirm={(cancelled) => {
          console.log('Booking cancelled:', cancelled);
          setShowCancelDialog(false);
        }}
      />

      <SupportDialog
        open={showSupportDialog}
        onClose={() => setShowSupportDialog(false)}
        booking={selectedBooking}
      />

      <TicketDialog
        open={showTicketDialog}
        onClose={() => setShowTicketDialog(false)}
        booking={selectedBooking}
      />
    </div>
  );
}