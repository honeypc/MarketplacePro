import { ChangeEvent, useMemo, useRef, useState } from "react";
import {
  Building2,
  CalendarRange,
  CheckCircle,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  Package,
  Percent,
  Phone,
  Plane,
  Save,
  ShieldCheck,
  Sparkles,
  Store,
  Ticket,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface DiscountProgram {
  id: string;
  name: string;
  code: string;
  type: "percentage" | "amount";
  value: number;
  appliesTo: string;
  active: boolean;
}

const initialDiscounts: DiscountProgram[] = [
  {
    id: "1",
    name: "Welcome offer",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    appliesTo: "First product or ticket purchase",
    active: true,
  },
  {
    id: "2",
    name: "Weekday trips",
    code: "MIDWEEK50",
    type: "amount",
    value: 50,
    appliesTo: "Trips booked Monday - Thursday",
    active: true,
  },
  {
    id: "3",
    name: "VIP partners",
    code: "PARTNER15",
    type: "percentage",
    value: 15,
    appliesTo: "Approved partner accounts",
    active: false,
  },
];

export default function HostSettings() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [basicInfo, setBasicInfo] = useState({
    brandName: "Sunset Shores Travel",
    tagline: "Your trusted partner for products, tickets, and immersive trips",
    email: "hello@sunsetshores.io",
    phone: "+1 (555) 204-1122",
    website: "https://sunsetshores.io",
    industry: "Travel & Experiences",
    description:
      "We help guests discover curated trips, local tickets, and seasonal products backed by reliable support.",
    logoPreview: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    address: {
      line1: "88 Market Street",
      line2: "Suite 402",
      city: "San Francisco",
      state: "CA",
      country: "United States",
      postalCode: "94103",
    } as Address,
  });

  const [offerings, setOfferings] = useState({
    products: true,
    tickets: true,
    trips: true,
    experiences: false,
  });

  const [serviceDetails, setServiceDetails] = useState({
    fulfillmentTime: "Same-day processing for in-stock products",
    ticketPolicy: "Instant digital delivery with QR validation",
    tripPolicy: "Free reschedule up to 72 hours before departure",
  });

  const [discounts, setDiscounts] = useState<DiscountProgram[]>(initialDiscounts);
  const [newDiscount, setNewDiscount] = useState<Omit<DiscountProgram, "id">>({
    name: "",
    code: "",
    type: "percentage",
    value: 10,
    appliesTo: "",
    active: true,
  });

  const completion = useMemo(() => {
    const requiredFields = [
      basicInfo.brandName,
      basicInfo.email,
      basicInfo.phone,
      basicInfo.address.line1,
      basicInfo.address.city,
      basicInfo.address.country,
    ];

    const filled = requiredFields.filter(Boolean).length;
    return Math.round((filled / requiredFields.length) * 100);
  }, [basicInfo]);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setBasicInfo((prev) => ({ ...prev, logoPreview: preview }));
  };

  const handleSave = () => {
    toast({
      title: "Host settings saved",
      description: "Your business details and offers were updated successfully.",
    });
  };

  const handleAddDiscount = () => {
    if (!newDiscount.name || !newDiscount.code || !newDiscount.appliesTo) {
      toast({
        title: "Missing details",
        description: "Please provide a name, code, and where the discount applies.",
        variant: "destructive",
      });
      return;
    }

    setDiscounts((prev) => [
      ...prev,
      {
        ...newDiscount,
        id: crypto.randomUUID(),
      },
    ]);

    setNewDiscount({
      name: "",
      code: "",
      type: "percentage",
      value: 10,
      appliesTo: "",
      active: true,
    });

    toast({
      title: "Discount added",
      description: "A new promotion is ready to share with guests.",
    });
  };

  const toggleOffering = (key: keyof typeof offerings) => {
    setOfferings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              Host settings are protected
            </CardTitle>
            <CardDescription className="text-center">
              Please log in to manage your business information and offers.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Securely update your address, contact information, and booking preferences.
            </p>
            <Button onClick={() => (window.location.href = "/auth")}>
              Go to login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-y-0 right-0 opacity-20">
            <Sparkles className="h-full w-32" />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-blue-100">
                <ShieldCheck className="h-4 w-4" />
                Host settings
              </div>
              <h1 className="text-3xl font-bold">Manage your host identity</h1>
              <p className="text-blue-100 max-w-2xl">
                Keep your business details, listings, and promotions aligned across products, tickets, and trips.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <CheckCircle className="h-4 w-4" />
                Completion score: <span className="font-semibold text-white">{completion}%</span>
              </div>
            </div>
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-blue-50" onClick={handleSave}>
              <Save className="h-5 w-5 mr-2" /> Save changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-indigo-600" />
                    Basic business information
                  </CardTitle>
                  <CardDescription>
                    This information appears on invoices, trip vouchers, and partner-facing pages.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                  {completion}% complete
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brandName">Brand name</Label>
                        <Input
                          id="brandName"
                          value={basicInfo.brandName}
                          onChange={(e) => setBasicInfo((prev) => ({ ...prev, brandName: e.target.value }))}
                          placeholder="Example Travel Co."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Category</Label>
                        <Input
                          id="industry"
                          value={basicInfo.industry}
                          onChange={(e) => setBasicInfo((prev) => ({ ...prev, industry: e.target.value }))}
                          placeholder="Tours, tickets, retail"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={basicInfo.tagline}
                        onChange={(e) => setBasicInfo((prev) => ({ ...prev, tagline: e.target.value }))}
                        placeholder="Short statement guests will see"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">About your business</Label>
                      <Textarea
                        id="description"
                        value={basicInfo.description}
                        onChange={(e) => setBasicInfo((prev) => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        placeholder="Share what makes your experience unique, the regions you serve, and how guests can reach you."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          Support email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={basicInfo.email}
                          onChange={(e) => setBasicInfo((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          Phone number
                        </Label>
                        <Input
                          id="phone"
                          value={basicInfo.phone}
                          onChange={(e) => setBasicInfo((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website" className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={basicInfo.website}
                          onChange={(e) => setBasicInfo((prev) => ({ ...prev, website: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addressLine1" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          Primary address
                        </Label>
                        <Input
                          id="addressLine1"
                          value={basicInfo.address.line1}
                          onChange={(e) =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              address: { ...prev.address, line1: e.target.value },
                            }))
                          }
                          placeholder="Street and number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addressLine2">Unit or building</Label>
                        <Input
                          id="addressLine2"
                          value={basicInfo.address.line2}
                          onChange={(e) =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              address: { ...prev.address, line2: e.target.value },
                            }))
                          }
                          placeholder="Suite, floor, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={basicInfo.address.city}
                          onChange={(e) =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              address: { ...prev.address, city: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State / Province</Label>
                        <Input
                          id="state"
                          value={basicInfo.address.state}
                          onChange={(e) =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              address: { ...prev.address, state: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={basicInfo.address.country}
                          onChange={(e) =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              address: { ...prev.address, country: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal code</Label>
                        <Input
                          id="postalCode"
                          value={basicInfo.address.postalCode}
                          onChange={(e) =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              address: { ...prev.address, postalCode: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-64">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-4 h-full flex flex-col items-center justify-center text-center gap-4">
                      <div className="relative h-32 w-32 rounded-xl overflow-hidden border border-indigo-100 bg-white">
                        {basicInfo.logoPreview ? (
                          <img src={basicInfo.logoPreview} alt="Brand logo" className="object-cover h-full w-full" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-indigo-900">Brand logo</p>
                        <p className="text-sm text-gray-500">Use a square image, at least 400x400.</p>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                      <Button variant="outline" className="w-full" onClick={handleLogoClick}>
                        <ImageIcon className="h-4 w-4 mr-2" /> Upload new logo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  Products, tickets, and trips
                </CardTitle>
                <CardDescription>
                  Control what you sell, how you fulfill bookings, and highlight seasonal experiences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 space-y-4 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold">Physical products</p>
                          <Switch checked={offerings.products} onCheckedChange={() => toggleOffering("products")}/>
                        </div>
                        <p className="text-sm text-gray-500">Manage stock-keeping units, gift boxes, and add-ons.</p>
                      </div>
                    </div>
                    <Textarea
                      value={serviceDetails.fulfillmentTime}
                      onChange={(e) => setServiceDetails((prev) => ({ ...prev, fulfillmentTime: e.target.value }))}
                      placeholder="Fulfillment notes or delivery promise"
                    />
                  </div>
                  <div className="border rounded-lg p-4 space-y-4 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                        <Ticket className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold">Tickets & attractions</p>
                          <Switch checked={offerings.tickets} onCheckedChange={() => toggleOffering("tickets")}/>
                        </div>
                        <p className="text-sm text-gray-500">Issue timed tickets, festival passes, and seat upgrades.</p>
                      </div>
                    </div>
                    <Textarea
                      value={serviceDetails.ticketPolicy}
                      onChange={(e) => setServiceDetails((prev) => ({ ...prev, ticketPolicy: e.target.value }))}
                      placeholder="Delivery steps, QR policies, redemption rules"
                    />
                  </div>
                  <div className="border rounded-lg p-4 space-y-4 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                        <Plane className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold">Trips & packages</p>
                          <Switch checked={offerings.trips} onCheckedChange={() => toggleOffering("trips")}/>
                        </div>
                        <p className="text-sm text-gray-500">Set itinerary rules, lead time, and cancellation terms.</p>
                      </div>
                    </div>
                    <Textarea
                      value={serviceDetails.tripPolicy}
                      onChange={(e) => setServiceDetails((prev) => ({ ...prev, tripPolicy: e.target.value }))}
                      placeholder="Refund windows, reschedule policies, cutoff times"
                    />
                  </div>
                  <div className="border rounded-lg p-4 space-y-4 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold">Hosted experiences</p>
                          <Switch checked={offerings.experiences} onCheckedChange={() => toggleOffering("experiences")}/>
                        </div>
                        <p className="text-sm text-gray-500">Workshops, tastings, seasonal pop-ups, and VIP meetups.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="leadTime">Lead time</Label>
                        <Input id="leadTime" placeholder="e.g., 24 hours" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="groupSize">Max group size</Label>
                        <Input id="groupSize" placeholder="e.g., 12 guests" />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-indigo-50 border-indigo-100">
                    <CardHeader>
                      <CardTitle className="text-sm text-indigo-700">Launch readiness</CardTitle>
                      <CardDescription className="text-xs text-indigo-600">
                        Confirm payout, taxes, and verified documents before going live.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-indigo-900">
                      <div className="flex items-center gap-2 text-sm">
                        <ShieldCheck className="h-4 w-4" /> Payout account connected
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarRange className="h-4 w-4" /> Seasonal calendars updated
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Service regions</CardTitle>
                      <CardDescription className="text-xs">List every country or city where you fulfill bookings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {basicInfo.address.country && (
                          <Badge variant="secondary" className="capitalize">
                            {basicInfo.address.country}
                          </Badge>
                        )}
                        {basicInfo.address.city && (
                          <Badge variant="secondary" className="capitalize">
                            {basicInfo.address.city}
                          </Badge>
                        )}
                        <Badge variant="outline">Remote & digital delivery</Badge>
                      </div>
                      <Input placeholder="Add another market" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Support coverage</CardTitle>
                      <CardDescription className="text-xs">Pick response times for each channel.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Email</span>
                        <Badge variant="outline">Under 12h</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Phone / SMS</span>
                        <Badge variant="outline">Business hours</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">On-trip support</span>
                        <Badge variant="outline">24/7</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-indigo-600" />
                  Discounts & campaigns
                </CardTitle>
                <CardDescription>
                  Offer targeted incentives for products, ticketed events, or trips.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-4 md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {discounts.map((discount) => (
                        <div key={discount.id} className="border rounded-lg p-4 bg-white space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{discount.name}</p>
                              <p className="text-sm text-gray-500">{discount.appliesTo}</p>
                            </div>
                            <Badge variant={discount.active ? "default" : "outline"}>
                              {discount.active ? "Active" : "Draft"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Code: <span className="font-mono text-gray-800">{discount.code}</span></span>
                            <span className="font-semibold text-gray-900">
                              {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 bg-white space-y-4">
                    <div className="space-y-1">
                      <p className="font-semibold">Create a discount</p>
                      <p className="text-sm text-gray-500">Share codes with partners or embed on landing pages.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountName">Name</Label>
                      <Input
                        id="discountName"
                        value={newDiscount.name}
                        onChange={(e) => setNewDiscount((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Spring launch"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountCode">Code</Label>
                      <Input
                        id="discountCode"
                        value={newDiscount.code}
                        onChange={(e) => setNewDiscount((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="SPRING25"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="discountValue">Value</Label>
                        <Input
                          id="discountValue"
                          type="number"
                          value={newDiscount.value}
                          onChange={(e) => setNewDiscount((prev) => ({ ...prev, value: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discountType">Type</Label>
                        <select
                          id="discountType"
                          className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          value={newDiscount.type}
                          onChange={(e) =>
                            setNewDiscount((prev) => ({ ...prev, type: e.target.value as DiscountProgram["type"] }))
                          }
                        >
                          <option value="percentage">Percentage</option>
                          <option value="amount">Fixed amount</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appliesTo">Applies to</Label>
                      <Input
                        id="appliesTo"
                        value={newDiscount.appliesTo}
                        onChange={(e) => setNewDiscount((prev) => ({ ...prev, appliesTo: e.target.value }))}
                        placeholder="All tickets, custom trips, add-ons"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={newDiscount.active}
                          onCheckedChange={(checked) => setNewDiscount((prev) => ({ ...prev, active: checked }))}
                        />
                        <Label className="text-sm">Activate immediately</Label>
                      </div>
                      <Button onClick={handleAddDiscount}>
                        <Percent className="h-4 w-4 mr-2" /> Add discount
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                  Contact & location
                </CardTitle>
                <CardDescription>
                  Share your primary support channels and business hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700">
                <div className="space-y-2">
                  <p className="font-semibold">Support channels</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" /> {basicInfo.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" /> {basicInfo.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" /> {basicInfo.website}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="font-semibold">Registered address</p>
                  <p>{basicInfo.address.line1}</p>
                  {basicInfo.address.line2 && <p>{basicInfo.address.line2}</p>}
                  <p>
                    {basicInfo.address.city}, {basicInfo.address.state} {basicInfo.address.postalCode}
                  </p>
                  <p>{basicInfo.address.country}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="font-semibold">Featured listing types</p>
                  <div className="flex flex-wrap gap-2">
                    {offerings.products && <Badge variant="secondary">Products</Badge>}
                    {offerings.tickets && <Badge variant="secondary">Tickets</Badge>}
                    {offerings.trips && <Badge variant="secondary">Trips</Badge>}
                    {offerings.experiences && <Badge variant="secondary">Experiences</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-indigo-50 border-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-800">
                  <Store className="h-5 w-5" />
                  Host checklist
                </CardTitle>
                <CardDescription className="text-indigo-700">
                  Quick wins to keep your storefront and trips conversion-ready.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-indigo-900">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-semibold">Add a storefront logo</p>
                    <p className="text-indigo-700">Use a high-contrast logo that works on light and dark backgrounds.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-semibold">Confirm pickup instructions</p>
                    <p className="text-indigo-700">Set clear meeting points for trip departures and ticket redemption.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-semibold">Publish a discount</p>
                    <p className="text-indigo-700">Drive early bookings with limited-time codes or partner pricing.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
