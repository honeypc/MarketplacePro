import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Users, 
  Edit3, 
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';

interface ModifyBookingDialogProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  onModify: (modifiedBooking: any) => void;
}

export default function ModifyBookingDialog({ open, onClose, booking, onModify }: ModifyBookingDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Guard against null/undefined booking
  if (!booking) {
    return null;
  }
  
  const [activeTab, setActiveTab] = useState('passengers');
  const [modifiedBooking, setModifiedBooking] = useState(booking);
  const [modifications, setModifications] = useState<string[]>([]);

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updatedPassengers = [...modifiedBooking.details.passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setModifiedBooking({
      ...modifiedBooking,
      details: { ...modifiedBooking.details, passengers: updatedPassengers }
    });
    
    if (!modifications.includes('passengers')) {
      setModifications([...modifications, 'passengers']);
    }
  };

  const handleDateChange = (newDate: string) => {
    setModifiedBooking({
      ...modifiedBooking,
      date: newDate
    });
    
    if (!modifications.includes('date')) {
      setModifications([...modifications, 'date']);
    }
  };

  const handleContactChange = (field: string, value: string) => {
    setModifiedBooking({
      ...modifiedBooking,
      details: { 
        ...modifiedBooking.details, 
        contactInfo: { ...modifiedBooking.details.contactInfo, [field]: value }
      }
    });
    
    if (!modifications.includes('contact')) {
      setModifications([...modifications, 'contact']);
    }
  };

  const handleSaveModifications = () => {
    // Calculate modification fees
    const modificationFee = modifications.length * 50000; // 50,000 VND per modification
    const updatedBooking = {
      ...modifiedBooking,
      amount: modifiedBooking.amount + modificationFee,
      status: 'modified',
      modificationHistory: [
        ...(modifiedBooking.modificationHistory || []),
        {
          date: new Date().toISOString(),
          modifications: modifications,
          fee: modificationFee
        }
      ]
    };

    onModify(updatedBooking);
    toast({
      title: "Booking Modified Successfully",
      description: `Your booking has been updated. Modification fee: ${formatCurrency(modificationFee)}`,
    });
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const canModify = () => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    const timeDiff = bookingDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff > 1 && booking.status !== 'cancelled' && booking.status !== 'completed';
  };

  if (!canModify()) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Cannot Modify Booking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              This booking cannot be modified because:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              {booking.status === 'cancelled' && <li>Booking has been cancelled</li>}
              {booking.status === 'completed' && <li>Booking has been completed</li>}
              {new Date(booking.date) <= new Date() && <li>Booking date has passed</li>}
              {Math.ceil((new Date(booking.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) <= 1 && 
                <li>Modifications must be made at least 24 hours before departure</li>
              }
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Modify Booking #{booking.bookingNumber}
          </DialogTitle>
        </DialogHeader>

        {/* Booking Info */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{booking.title}</h3>
                <p className="text-sm text-gray-600">{booking.route}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {booking.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {booking.time}
                  </div>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">{booking.status}</Badge>
            </div>
          </CardContent>
        </Card>

        {modifications.length > 0 && (
          <Card className="mb-4 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Modifications Detected</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    You have modified: {modifications.join(', ')}. 
                    Modification fee: {formatCurrency(modifications.length * 50000)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="passengers">Passengers</TabsTrigger>
            <TabsTrigger value="dates">Dates</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="passengers" className="space-y-4">
            <h3 className="text-lg font-semibold">Passenger Information</h3>
            {modifiedBooking.details.passengers.map((passenger: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4">Passenger {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input 
                        value={passenger.name}
                        onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input 
                        type="email"
                        value={passenger.email}
                        onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input 
                        value={passenger.phone}
                        onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <Input 
                        type="date"
                        value={passenger.dateOfBirth}
                        onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="dates" className="space-y-4">
            <h3 className="text-lg font-semibold">Change Travel Date</h3>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current Date</Label>
                    <Input value={booking.date} disabled />
                  </div>
                  <div>
                    <Label>New Date</Label>
                    <Input 
                      type="date"
                      value={modifiedBooking.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Date changes may incur additional fees and are subject to availability.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Email</Label>
                    <Input 
                      type="email"
                      value={modifiedBooking.details.contactInfo?.email || ''}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Contact Phone</Label>
                    <Input 
                      value={modifiedBooking.details.contactInfo?.phone || ''}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Special Requests</Label>
                  <Textarea 
                    value={modifiedBooking.details.contactInfo?.specialRequests || ''}
                    onChange={(e) => handleContactChange('specialRequests', e.target.value)}
                    placeholder="Any special requests or notes"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveModifications} 
            disabled={modifications.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Save Modifications ({formatCurrency(modifications.length * 50000)})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}