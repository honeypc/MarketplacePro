import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  Clock, 
  DollarSign,
  Info
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';

interface CancelBookingDialogProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  onCancel: (cancelledBooking: any) => void;
}

export default function CancelBookingDialog({ open, onClose, booking, onCancel }: CancelBookingDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);

  // Guard against null/undefined booking
  if (!booking) {
    return null;
  }

  const cancellationReasons = [
    'Change of plans',
    'Emergency situation',
    'Found better option',
    'Schedule conflict',
    'Personal reasons',
    'Other'
  ];

  const calculateRefund = () => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    const timeDiff = bookingDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    let refundPercentage = 0;
    if (daysDiff > 7) {
      refundPercentage = 80; // 80% refund if cancelled 7+ days before
    } else if (daysDiff > 3) {
      refundPercentage = 50; // 50% refund if cancelled 3-7 days before
    } else if (daysDiff > 1) {
      refundPercentage = 25; // 25% refund if cancelled 1-3 days before
    } else {
      refundPercentage = 0; // No refund if cancelled within 24 hours
    }
    
    return {
      refundPercentage,
      refundAmount: (booking.amount * refundPercentage) / 100,
      cancellationFee: booking.amount - ((booking.amount * refundPercentage) / 100)
    };
  };

  const handleCancelBooking = () => {
    if (!reason) {
      toast({
        title: "Please select a reason",
        description: "Please select a reason for cancellation",
        variant: "destructive"
      });
      return;
    }

    const refundInfo = calculateRefund();
    const cancelledBooking = {
      ...booking,
      status: 'cancelled',
      cancellationInfo: {
        reason: reason === 'Other' ? customReason : reason,
        cancelledAt: new Date().toISOString(),
        refundPercentage: refundInfo.refundPercentage,
        refundAmount: refundInfo.refundAmount,
        cancellationFee: refundInfo.cancellationFee
      }
    };

    onCancel(cancelledBooking);
    toast({
      title: "Booking Cancelled",
      description: `Your booking has been cancelled. Refund amount: ${formatCurrency(refundInfo.refundAmount)}`,
    });
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const canCancel = () => {
    return booking.status !== 'cancelled' && booking.status !== 'completed';
  };

  const refundInfo = calculateRefund();

  if (!canCancel()) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Cannot Cancel Booking
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              This booking cannot be cancelled because:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              {booking.status === 'cancelled' && <li>Booking has already been cancelled</li>}
              {booking.status === 'completed' && <li>Booking has been completed</li>}
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Cancel Booking #{booking.bookingNumber}
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

        {/* Cancellation Policy */}
        <Card className="mb-4 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Cancellation Policy
            </h3>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>• More than 7 days: 80% refund</p>
              <p>• 3-7 days: 50% refund</p>
              <p>• 1-3 days: 25% refund</p>
              <p>• Less than 24 hours: No refund</p>
            </div>
          </CardContent>
        </Card>

        {/* Refund Calculation */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Refund Calculation
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Original Amount</span>
                <span>{formatCurrency(booking.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Refund ({refundInfo.refundPercentage}%)</span>
                <span className="text-green-600">+{formatCurrency(refundInfo.refundAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cancellation Fee</span>
                <span className="text-red-600">-{formatCurrency(refundInfo.cancellationFee)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Net Refund</span>
                  <span className="text-green-600">{formatCurrency(refundInfo.refundAmount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Reason */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Reason for Cancellation</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2">
              {cancellationReasons.map((reasonOption) => (
                <div key={reasonOption} className="flex items-center space-x-2">
                  <RadioGroupItem value={reasonOption} id={reasonOption} />
                  <Label htmlFor={reasonOption}>{reasonOption}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {reason === 'Other' && (
            <div>
              <Label>Please specify</Label>
              <Textarea 
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please provide more details about your reason for cancellation"
              />
            </div>
          )}
        </div>

        {/* Confirmation Warning */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Warning</p>
                <p className="text-sm text-red-700 mt-1">
                  This action cannot be undone. Once cancelled, you will need to make a new booking if you change your mind.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Keep Booking
          </Button>
          <Button 
            onClick={handleCancelBooking} 
            disabled={!reason}
            className="bg-red-600 hover:bg-red-700"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}