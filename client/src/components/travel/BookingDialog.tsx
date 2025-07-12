import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  MapPin, 
  Clock, 
  Plane,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  bookingData: any;
  onConfirm: (booking: any) => void;
}

export default function BookingDialog({ open, onClose, bookingData, onConfirm }: BookingDialogProps) {
  // Guard against null/undefined bookingData - must be before any hooks
  if (!bookingData) {
    return null;
  }
  
  const { t } = useTranslation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState([
    { name: '', email: '', phone: '', dateOfBirth: '', nationality: 'VN' }
  ]);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit_card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: ''
  });

  const addPassenger = () => {
    setPassengers([...passengers, { name: '', email: '', phone: '', dateOfBirth: '', nationality: 'VN' }]);
  };

  const removePassenger = (index: number) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const updatePassenger = (index: number, field: string, value: string) => {
    const updated = passengers.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    );
    setPassengers(updated);
  };

  const handleBooking = () => {
    // Validate form
    if (passengers.some(p => !p.name || !p.email)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required passenger information",
        variant: "destructive"
      });
      return;
    }

    // Simulate booking process
    const bookingId = `${bookingData.type?.toUpperCase()}-${Date.now()}`;
    const booking = {
      id: bookingId,
      bookingNumber: bookingId,
      type: bookingData.type,
      title: bookingData.title,
      route: bookingData.route,
      date: bookingData.date,
      time: bookingData.time,
      passengers: passengers.length,
      amount: bookingData.price * passengers.length,
      status: 'confirmed',
      paymentStatus: 'paid',
      checkInStatus: 'pending',
      details: {
        ...bookingData,
        passengers: passengers,
        contactInfo: contactInfo,
        paymentInfo: { ...paymentInfo, cardNumber: '****' + paymentInfo.cardNumber.slice(-4) }
      },
      bookingDate: new Date().toISOString(),
      qrCode: `QR${Date.now()}`
    };

    onConfirm(booking);
    toast({
      title: "Booking Confirmed!",
      description: `Your booking ${bookingId} has been confirmed successfully.`,
    });
    onClose();
    setStep(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {bookingData.type === 'flight' && <Plane className="h-5 w-5" />}
            {bookingData.type === 'transport' && <MapPin className="h-5 w-5" />}
            Book {bookingData.title}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepNum ? <CheckCircle className="h-4 w-4" /> : stepNum}
              </div>
              <div className="ml-2 text-sm font-medium text-gray-600">
                {stepNum === 1 ? 'Passenger Info' : stepNum === 2 ? 'Contact & Payment' : 'Confirmation'}
              </div>
              {stepNum < 3 && <div className="w-16 h-px bg-gray-300 mx-4" />}
            </div>
          ))}
        </div>

        {/* Booking Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{bookingData.title}</h3>
                <p className="text-sm text-gray-600">{bookingData.route}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {bookingData.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {bookingData.time}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(bookingData.price)}</p>
                <p className="text-sm text-gray-500">per person</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Passenger Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Passenger Information</h3>
              <Button variant="outline" size="sm" onClick={addPassenger}>
                Add Passenger
              </Button>
            </div>
            
            {passengers.map((passenger, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Passenger {index + 1}</h4>
                    {passengers.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => removePassenger(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name *</Label>
                      <Input 
                        value={passenger.name}
                        onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input 
                        type="email"
                        value={passenger.email}
                        onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input 
                        value={passenger.phone}
                        onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <Input 
                        type="date"
                        value={passenger.dateOfBirth}
                        onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Nationality</Label>
                      <Select value={passenger.nationality} onValueChange={(value) => updatePassenger(index, 'nationality', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VN">Vietnam</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step 2: Contact & Payment */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Contact Email</Label>
                  <Input 
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    placeholder="Enter contact email"
                  />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input 
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    placeholder="Enter contact phone"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label>Special Requests</Label>
                <Textarea 
                  value={contactInfo.specialRequests}
                  onChange={(e) => setContactInfo({...contactInfo, specialRequests: e.target.value})}
                  placeholder="Any special requests or notes"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Payment Method</Label>
                  <Select value={paymentInfo.method} onValueChange={(value) => setPaymentInfo({...paymentInfo, method: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="debit_card">Debit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Card Holder Name</Label>
                  <Input 
                    value={paymentInfo.holderName}
                    onChange={(e) => setPaymentInfo({...paymentInfo, holderName: e.target.value})}
                    placeholder="Enter card holder name"
                  />
                </div>
                <div>
                  <Label>Card Number</Label>
                  <Input 
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Month</Label>
                    <Select value={paymentInfo.expiryMonth} onValueChange={(value) => setPaymentInfo({...paymentInfo, expiryMonth: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 12}, (_, i) => (
                          <SelectItem key={i} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Year</Label>
                    <Select value={paymentInfo.expiryYear} onValueChange={(value) => setPaymentInfo({...paymentInfo, expiryYear: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="YY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 10}, (_, i) => (
                          <SelectItem key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                            {String(new Date().getFullYear() + i).slice(-2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input 
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Booking Summary</h3>
              <p className="text-gray-600">Please review your booking details before confirming</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Base Price ({passengers.length} passengers)</span>
                <span>{formatCurrency(bookingData.price * passengers.length)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>{formatCurrency(bookingData.price * passengers.length * 0.1)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-blue-600">{formatCurrency(bookingData.price * passengers.length * 1.1)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Booking Terms</p>
                  <p className="text-sm text-blue-700 mt-1">
                    By confirming this booking, you agree to our terms and conditions. 
                    Cancellation policy applies as per the service provider's policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleBooking} className="bg-blue-600 hover:bg-blue-700">
              <CreditCard className="h-4 w-4 mr-2" />
              Confirm Booking
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}