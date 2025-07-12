import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  QrCode, 
  Plane, 
  Bus, 
  MapPin, 
  Calendar, 
  Clock, 
  Users,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';

interface TicketDialogProps {
  open: boolean;
  onClose: () => void;
  booking: any;
}

export default function TicketDialog({ open, onClose, booking }: TicketDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  
  // Guard against null/undefined booking
  if (!booking) {
    return null;
  }

  const handleDownload = async (format: 'pdf' | 'png') => {
    setDownloading(true);
    
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real app, this would generate and download the actual file
    toast({
      title: "Ticket Downloaded",
      description: `Your ticket has been downloaded as ${format.toUpperCase()}`,
    });
    
    setDownloading(false);
  };

  const handleEmailTicket = () => {
    toast({
      title: "Ticket Sent",
      description: "Your ticket has been sent to your email address",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-6 w-6 text-blue-600" />;
      case 'transport': return <Bus className="h-6 w-6 text-green-600" />;
      case 'tour': return <MapPin className="h-6 w-6 text-purple-600" />;
      default: return <Calendar className="h-6 w-6 text-gray-600" />;
    }
  };

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

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            E-Ticket - {booking.bookingNumber}
          </DialogTitle>
        </DialogHeader>

        {/* Main Ticket */}
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {getTypeIcon(booking.type)}
                <div>
                  <h2 className="text-2xl font-bold">MarketplacePro</h2>
                  <p className="text-gray-600">Travel Services</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
                <p className="text-sm text-gray-500 mt-1">
                  Booking #{booking.bookingNumber}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Booking Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold mb-4">{booking.title}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Travel Date</span>
                    </div>
                    <p className="text-gray-600">{booking.date}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Time</span>
                    </div>
                    <p className="text-gray-600">{booking.time}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Route</span>
                    </div>
                    <p className="text-gray-600">{booking.route}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Passengers</span>
                    </div>
                    <p className="text-gray-600">{booking.passengers}</p>
                  </div>
                </div>

                {/* Passenger Details */}
                {booking.details?.passengers && booking.details.passengers.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Passenger Information</h4>
                    <div className="space-y-2">
                      {booking.details.passengers.map((passenger: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{passenger.name}</p>
                            <p className="text-sm text-gray-600">{passenger.email}</p>
                          </div>
                          {passenger.seat && (
                            <Badge variant="outline">Seat {passenger.seat}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                {booking.status === 'confirmed' && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Booking Confirmed</p>
                        <p className="text-sm text-green-700 mt-1">
                          Please arrive at the departure point at least 30 minutes before departure time. 
                          Bring a valid ID and this ticket for boarding.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* QR Code & Payment Info */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Scan for digital access</p>
                  <p className="text-xs text-gray-500 mt-1">{booking.qrCode}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(booking.amount * 0.9)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Fees</span>
                      <span>{formatCurrency(booking.amount * 0.1)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Paid</span>
                      <span>{formatCurrency(booking.amount)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Badge className="bg-blue-100 text-blue-800">
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium mb-2">Important Information</p>
                <ul className="space-y-1 text-xs">
                  <li>• This is your official e-ticket</li>
                  <li>• Valid ID required for boarding</li>
                  <li>• Arrive 30 minutes early</li>
                  <li>• No refund for no-show</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Contact Support</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>+84 (0) 123 456 789</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>support@marketplacepro.com</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => handleDownload('pdf')} 
            disabled={downloading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {downloading ? 'Downloading...' : 'Download PDF'}
          </Button>
          
          <Button 
            onClick={() => handleDownload('png')} 
            disabled={downloading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {downloading ? 'Downloading...' : 'Download Image'}
          </Button>
          
          <Button 
            onClick={handleEmailTicket}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email Ticket
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}