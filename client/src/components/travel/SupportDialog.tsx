import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HeadphonesIcon, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Send
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
  booking?: any;
}

export default function SupportDialog({ open, onClose, booking }: SupportDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('contact');
  const [supportForm, setSupportForm] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    message: '',
    email: '',
    phone: ''
  });

  const supportCategories = [
    'Booking Issue',
    'Payment Problem',
    'Cancellation Request',
    'Schedule Change',
    'Special Assistance',
    'General Inquiry'
  ];

  const handleSubmitSupport = () => {
    if (!supportForm.category || !supportForm.subject || !supportForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create support ticket
    const ticketId = `SUP-${Date.now()}`;
    
    toast({
      title: "Support Ticket Created",
      description: `Your support ticket ${ticketId} has been created. We'll respond within 24 hours.`,
    });
    
    // Reset form
    setSupportForm({
      category: '',
      priority: 'medium',
      subject: '',
      message: '',
      email: '',
      phone: ''
    });
    
    onClose();
  };

  const supportOptions = [
    {
      type: 'Live Chat',
      icon: MessageSquare,
      description: 'Get instant help from our support team',
      available: true,
      response: 'Usually responds in 5-10 minutes'
    },
    {
      type: 'Phone Support',
      icon: Phone,
      description: 'Call our customer service hotline',
      available: true,
      response: 'Available 24/7',
      number: '+84 (0) 123 456 789'
    },
    {
      type: 'Email Support',
      icon: Mail,
      description: 'Send us an email with your inquiry',
      available: true,
      response: 'Usually responds within 24 hours',
      email: 'support@marketplacepro.com'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5" />
            Customer Support
          </DialogTitle>
        </DialogHeader>

        {booking && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{booking.title}</h3>
                  <p className="text-sm text-gray-600">Booking #{booking.bookingNumber}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-blue-100 text-blue-800">{booking.status}</Badge>
                    <span className="text-sm text-gray-500">{booking.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Need help with this booking?</p>
                  <p className="text-sm text-gray-400">We're here to assist you</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact">Contact Options</TabsTrigger>
            <TabsTrigger value="ticket">Create Ticket</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-4">
            <h3 className="text-lg font-semibold">Choose how you'd like to get help</h3>
            
            <div className="grid gap-4">
              {supportOptions.map((option) => (
                <Card key={option.type} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <option.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{option.type}</h4>
                          {option.available && (
                            <Badge className="bg-green-100 text-green-800">Available</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{option.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {option.response}
                        </div>
                        {option.number && (
                          <p className="text-sm text-blue-600 mt-2 font-medium">{option.number}</p>
                        )}
                        {option.email && (
                          <p className="text-sm text-blue-600 mt-2 font-medium">{option.email}</p>
                        )}
                      </div>
                      <Button 
                        onClick={() => {
                          if (option.type === 'Live Chat') {
                            // Open chat widget
                            toast({
                              title: "Opening Live Chat",
                              description: "Connecting you to our support team...",
                            });
                          } else if (option.type === 'Phone Support') {
                            window.open(`tel:${option.number}`);
                          } else if (option.type === 'Email Support') {
                            window.open(`mailto:${option.email}`);
                          }
                        }}
                      >
                        {option.type === 'Live Chat' ? 'Start Chat' : 
                         option.type === 'Phone Support' ? 'Call Now' : 'Send Email'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ticket" className="space-y-4">
            <h3 className="text-lg font-semibold">Create Support Ticket</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <RadioGroup value={supportForm.category} onValueChange={(value) => setSupportForm({...supportForm, category: value})}>
                  {supportCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <RadioGroupItem value={category} id={category} />
                      <Label htmlFor={category}>{category}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Priority</Label>
                <RadioGroup value={supportForm.priority} onValueChange={(value) => setSupportForm({...supportForm, priority: value})}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low - General question</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium - Booking issue</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High - Urgent assistance needed</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Contact Email *</Label>
                <Input 
                  type="email"
                  value={supportForm.email}
                  onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input 
                  value={supportForm.phone}
                  onChange={(e) => setSupportForm({...supportForm, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <Label>Subject *</Label>
              <Input 
                value={supportForm.subject}
                onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <Label>Message *</Label>
              <Textarea 
                value={supportForm.message}
                onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                placeholder="Please provide detailed information about your issue"
                rows={6}
              />
            </div>

            <Button onClick={handleSubmitSupport} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Submit Support Ticket
            </Button>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              {[
                {
                  question: "How can I modify my booking?",
                  answer: "You can modify your booking up to 24 hours before departure. Go to 'My Bookings' and click 'Modify'. Note that modification fees may apply."
                },
                {
                  question: "What is the cancellation policy?",
                  answer: "Cancellation refunds depend on when you cancel: 7+ days (80% refund), 3-7 days (50% refund), 1-3 days (25% refund), <24 hours (no refund)."
                },
                {
                  question: "How do I download my ticket?",
                  answer: "Go to 'My Bookings', find your confirmed booking, and click 'Download Ticket'. You can also scan the QR code for digital access."
                },
                {
                  question: "What payment methods are accepted?",
                  answer: "We accept all major credit cards, debit cards, and bank transfers. Payment is processed securely through our payment partners."
                },
                {
                  question: "Can I get a refund for cancelled bookings?",
                  answer: "Yes, refunds are processed according to our cancellation policy. The refund amount depends on how far in advance you cancel."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      {faq.question}
                    </h4>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}