import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, 
  Bus, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  QrCode,
  Edit3,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { format } from 'date-fns';
import FlightSearch from '@/components/travel/FlightSearch';
import BusSearch from '@/components/travel/BusSearch';
import BookingHistory from '@/components/travel/BookingHistory';
import BookingDialog from '@/components/travel/BookingDialog';
import ModifyBookingDialog from '@/components/travel/ModifyBookingDialog';
import CancelBookingDialog from '@/components/travel/CancelBookingDialog';
import SupportDialog from '@/components/travel/SupportDialog';
import TicketDialog from '@/components/travel/TicketDialog';

export default function TravelBookingDemo() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('flights');
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showModifyDialog, setShowModifyDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const sampleBooking = {
    id: 1,
    type: 'flight',
    title: 'Vietnam Airlines VN123',
    airline: 'Vietnam Airlines',
    route: 'Ho Chi Minh City → Hanoi',
    date: '2024-01-15',
    time: '08:00 - 10:30',
    price: 5000000,
    passengers: 2,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingNumber: 'FLT-2024-001234',
    qrCode: 'QR123456789',
    details: {
      flightNumber: 'VN123',
      airline: 'Vietnam Airlines',
      departure: { airport: 'SGN', city: 'Ho Chi Minh City', time: '08:00' },
      arrival: { airport: 'HAN', city: 'Hanoi', time: '10:30' },
      passengers: [
        { name: 'Nguyen Van A', seat: '15A' },
        { name: 'Nguyen Thi B', seat: '15B' }
      ]
    }
  };

  const sampleFlightData = {
    id: 'VN123',
    airline: 'Vietnam Airlines',
    flightNumber: 'VN123',
    departure: { 
      city: 'Ho Chi Minh City', 
      airport: 'SGN', 
      time: '08:00' 
    },
    arrival: { 
      city: 'Hanoi', 
      airport: 'HAN', 
      time: '10:30' 
    },
    duration: '2h 30m',
    stops: 0,
    price: 5000000,
    originalPrice: 5500000,
    rating: 4.5,
    class: 'Economy',
    baggage: '23kg',
    amenities: ['wifi', 'meal', 'entertainment']
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('travelBookingSystem')}</h1>
        <p className="text-gray-600">
          Complete functional travel booking system with all dialog components working
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="flights">
            <Plane className="h-4 w-4 mr-2" />
            {t('flights')}
          </TabsTrigger>
          <TabsTrigger value="buses">
            <Bus className="h-4 w-4 mr-2" />
            {t('buses')}
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="h-4 w-4 mr-2" />
            {t('bookingHistory')}
          </TabsTrigger>
          <TabsTrigger value="demo">
            <Star className="h-4 w-4 mr-2" />
            Dialog Demo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights" className="space-y-6">
          <FlightSearch />
        </TabsContent>

        <TabsContent value="buses" className="space-y-6">
          <BusSearch />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <BookingHistory />
        </TabsContent>

        <TabsContent value="demo" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Dialog</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Test the booking dialog with sample flight data
                </p>
                <Button 
                  onClick={() => {
                    setSelectedBooking({
                      ...sampleFlightData,
                      type: 'flight',
                      route: `${sampleFlightData.departure.city} → ${sampleFlightData.arrival.city}`,
                      date: '2024-01-15',
                      time: `${sampleFlightData.departure.time} - ${sampleFlightData.arrival.time}`
                    });
                    setShowBookingDialog(true);
                  }}
                  className="w-full"
                >
                  Test Booking Dialog
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modify Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Test the modify booking dialog with sample booking
                </p>
                <Button 
                  onClick={() => {
                    setSelectedBooking(sampleBooking);
                    setShowModifyDialog(true);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Test Modify Dialog
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cancel Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Test the cancel booking dialog with sample booking
                </p>
                <Button 
                  onClick={() => {
                    setSelectedBooking(sampleBooking);
                    setShowCancelDialog(true);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Test Cancel Dialog
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Support Dialog</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Test the support dialog with sample booking
                </p>
                <Button 
                  onClick={() => {
                    setSelectedBooking(sampleBooking);
                    setShowSupportDialog(true);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Test Support Dialog
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ticket Dialog</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Test the ticket dialog with sample booking
                </p>
                <Button 
                  onClick={() => {
                    setSelectedBooking(sampleBooking);
                    setShowTicketDialog(true);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Test Ticket Dialog
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sample Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{sampleBooking.title}</p>
                    <p className="text-sm text-gray-600">{sampleBooking.route}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(sampleBooking.status)}>
                      {sampleBooking.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{sampleBooking.date}</span>
                  <span>{formatCurrency(sampleBooking.price)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{sampleBooking.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{sampleBooking.passengers} passengers</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Components */}
      <BookingDialog
        open={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        bookingData={selectedBooking}
        onConfirm={(booking) => {
          console.log('Booking confirmed:', booking);
          setShowBookingDialog(false);
        }}
      />

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