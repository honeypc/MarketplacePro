import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  Globe2,
  Link,
  Package,
  Percent,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ManagedProduct {
  id: string;
  name: string;
  type: "product" | "experience" | "ticket";
  price: number;
  stock: number;
  visible: boolean;
  fulfillment: "standard" | "express" | "dropship";
  affiliatePercent: number;
  resellers: number;
  orders: number;
}

interface OrderRecord {
  id: string;
  title: string;
  buyer: string;
  total: number;
  status: "paid" | "fulfilled" | "pending";
}

interface ShippingProfile {
  id: string;
  name: string;
  carrier: string;
  eta: string;
  cost: string;
  active: boolean;
}

interface Reseller {
  id: string;
  name: string;
  productId: string;
  commission: number;
  tier: "standard" | "premium" | "exclusive";
}

const defaultProducts: ManagedProduct[] = [
  {
    id: "p-1",
    name: "Sunset Villas Premium Stay",
    type: "experience",
    price: 420,
    stock: 12,
    visible: true,
    fulfillment: "standard",
    affiliatePercent: 12,
    resellers: 4,
    orders: 38,
  },
  {
    id: "p-2",
    name: "Kayak Adventure Bundle",
    type: "product",
    price: 189,
    stock: 28,
    visible: true,
    fulfillment: "dropship",
    affiliatePercent: 8,
    resellers: 3,
    orders: 54,
  },
  {
    id: "p-3",
    name: "VIP Concert Tickets",
    type: "ticket",
    price: 129,
    stock: 220,
    visible: false,
    fulfillment: "express",
    affiliatePercent: 15,
    resellers: 5,
    orders: 112,
  },
];

const defaultOrders: OrderRecord[] = [
  { id: "o-1", title: "Sunset Villas Premium Stay", buyer: "Chloe Park", total: 1260, status: "fulfilled" },
  { id: "o-2", title: "Kayak Adventure Bundle", buyer: "Ravi Patel", total: 189, status: "paid" },
  { id: "o-3", title: "VIP Concert Tickets", buyer: "Sven Müller", total: 774, status: "pending" },
];

const defaultShipping: ShippingProfile[] = [
  { id: "s-1", name: "Standard", carrier: "GroundPro", eta: "4-6 days", cost: "$12", active: true },
  { id: "s-2", name: "Express", carrier: "SwiftAir", eta: "1-2 days", cost: "$29", active: true },
  { id: "s-3", name: "Dropship", carrier: "Partner Freight", eta: "2-5 days", cost: "Dynamic", active: false },
];

const defaultResellers: Reseller[] = [
  { id: "r-1", name: "Coastal Collective", productId: "p-1", commission: 10, tier: "premium" },
  { id: "r-2", name: "Adventure Allies", productId: "p-2", commission: 12, tier: "exclusive" },
  { id: "r-3", name: "TicketHub", productId: "p-3", commission: 9, tier: "standard" },
];

export default function HostManagement() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState<ManagedProduct[]>(defaultProducts);
  const [orders] = useState<OrderRecord[]>(defaultOrders);
  const [shippingProfiles, setShippingProfiles] = useState<ShippingProfile[]>(defaultShipping);
  const [resellers, setResellers] = useState<Reseller[]>(defaultResellers);
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "product" as ManagedProduct["type"],
    price: 0,
    stock: 0,
    fulfillment: "standard" as ManagedProduct["fulfillment"],
    affiliatePercent: 10,
  });
  const [newReseller, setNewReseller] = useState({
    name: "",
    productId: defaultProducts[0].id,
    commission: 10,
    tier: "standard" as Reseller["tier"],
  });

  const fulfillmentPerformance = useMemo(() => {
    const visibleProducts = products.filter((product) => product.visible);
    const averageAffiliate =
      visibleProducts.reduce((sum, item) => sum + item.affiliatePercent, 0) /
      Math.max(visibleProducts.length, 1);

    const fulfillmentMix = products.reduce(
      (acc, product) => {
        acc[product.fulfillment] = (acc[product.fulfillment] || 0) + 1;
        return acc;
      },
      { standard: 0, express: 0, dropship: 0 } as Record<ManagedProduct["fulfillment"], number>
    );

    const totalProducts = products.length || 1;

    return {
      averageAffiliate: Math.round(averageAffiliate),
      expressCoverage: Math.round((fulfillmentMix.express / totalProducts) * 100),
      dropshipCoverage: Math.round((fulfillmentMix.dropship / totalProducts) * 100),
    };
  }, [products]);

  const handleAddProduct = () => {
    if (!newProduct.name || newProduct.price <= 0) {
      toast({
        title: "Add a product name and price",
        description: "Provide the basics so we can publish this item for your store.",
        variant: "destructive",
      });
      return;
    }

    setProducts((prev) => [
      {
        id: crypto.randomUUID(),
        orders: 0,
        resellers: 0,
        stock: newProduct.stock,
        visible: true,
        ...newProduct,
      },
      ...prev,
    ]);

    setNewProduct({ name: "", type: "product", price: 0, stock: 0, fulfillment: "standard", affiliatePercent: 10 });
    toast({
      title: "Product added",
      description: "Draft saved. You can refine details or publish immediately.",
    });
  };

  const toggleVisibility = (id: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, visible: !product.visible } : product
      )
    );
  };

  const updateAffiliate = (id: string, value: number) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, affiliatePercent: value } : product)));
  };

  const toggleShippingProfile = (id: string) => {
    setShippingProfiles((prev) => prev.map((profile) => (profile.id === id ? { ...profile, active: !profile.active } : profile)));
  };

  const handleAddReseller = () => {
    if (!newReseller.name) {
      toast({ title: "Reseller name required", variant: "destructive", description: "Add a company or partner contact." });
      return;
    }

    setResellers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...newReseller },
    ]);

    setNewReseller({ name: "", productId: products[0]?.id || "", commission: 10, tier: "standard" });
    toast({ title: "Reseller added", description: "Partner was connected to the selected listing." });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white shadow px-4 py-2 text-primary">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Host workspace</span>
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Sign in to manage your listings</h1>
          <p className="mt-2 text-muted-foreground">Create products, coordinate shipping, and manage affiliates from one place.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => (window.location.href = "/auth")}>Sign in</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/register")}>Create an account</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary text-sm font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Host Management
            </div>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900">Operate your products like a pro</h1>
            <p className="text-muted-foreground">Create products, supervise resellers, and keep every listing ready for guests.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Link className="h-4 w-4" />
              Share store
            </Button>
            <Button className="gap-2" onClick={handleAddProduct}>
              <Plus className="h-4 w-4" />
              Quick add product
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live listings</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.filter((p) => p.visible).length}</div>
              <p className="text-xs text-muted-foreground">Visible products across your storefront</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders this week</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">Latest paid or in-transit orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg affiliate</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fulfillmentPerformance.averageAffiliate}%</div>
              <p className="text-xs text-muted-foreground">Across live products</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Express coverage</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fulfillmentPerformance.expressCoverage}%</div>
              <p className="text-xs text-muted-foreground">Listings with fast shipping enabled</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create or import a product</CardTitle>
            <CardDescription>Capture the essentials to add a product or experience to your catalog.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="product-name">Product title</Label>
              <Input
                id="product-name"
                placeholder="Oceanfront escape bundle"
                value={newProduct.name}
                onChange={(event) => setNewProduct((prev) => ({ ...prev, name: event.target.value }))}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={newProduct.type} onValueChange={(value: ManagedProduct["type"]) => setNewProduct((prev) => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Physical product</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="ticket">Ticket or pass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-price">Price</Label>
                  <Input
                    id="product-price"
                    type="number"
                    min={0}
                    value={newProduct.price}
                    onChange={(event) => setNewProduct((prev) => ({ ...prev, price: Number(event.target.value) }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product-stock">Inventory</Label>
                  <Input
                    id="product-stock"
                    type="number"
                    min={0}
                    value={newProduct.stock}
                    onChange={(event) => setNewProduct((prev) => ({ ...prev, stock: Number(event.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fulfillment</Label>
                  <Select
                    value={newProduct.fulfillment}
                    onValueChange={(value: ManagedProduct["fulfillment"]) => setNewProduct((prev) => ({ ...prev, fulfillment: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fulfillment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="dropship">Dropship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="affiliate">Affiliate percent</Label>
                <Input
                  id="affiliate"
                  type="number"
                  min={0}
                  max={40}
                  value={newProduct.affiliatePercent}
                  onChange={(event) => setNewProduct((prev) => ({ ...prev, affiliatePercent: Number(event.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">Set the default commission for shareable links before publishing.</p>
              </div>
              <Button className="w-full sm:w-auto" onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Add to catalog
              </Button>
            </div>
            <div className="space-y-4 rounded-xl border bg-white/80 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Package className="h-4 w-4" />
                Publishing checklist
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Content readiness</span>
                    <Badge variant="secondary">Media</Badge>
                  </div>
                  <Progress value={70} />
                  <p className="text-xs text-muted-foreground">Add gallery images and set key attributes before approval.</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping configured
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Reseller links ready
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Affiliate split
                  </div>
                  <span className="font-semibold">{newProduct.affiliatePercent}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Product list</CardTitle>
              <CardDescription>Control visibility, fulfillment profiles, and affiliate payouts per listing.</CardDescription>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => setProducts(defaultProducts)}>
              <RefreshCw className="h-4 w-4" />
              Reset to defaults
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Shipping</TableHead>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="space-y-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground capitalize flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">{product.type}</Badge>
                        <span>${product.price.toFixed(2)}</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <ShoppingBag className="h-3.5 w-3.5" /> {product.orders}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-semibold">{product.orders}</div>
                      <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={product.fulfillment}
                        onValueChange={(value: ManagedProduct["fulfillment"]) =>
                          setProducts((prev) =>
                            prev.map((item) => (item.id === product.id ? { ...item, fulfillment: value } : item))
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="dropship">Dropship</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="mt-1 text-xs text-muted-foreground">Preferred route for this listing.</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={40}
                          value={product.affiliatePercent}
                          onChange={(event) => updateAffiliate(product.id, Number(event.target.value))}
                          className="w-20"
                        />
                        <Badge variant="outline">{product.affiliatePercent}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Reseller share for this link.</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={product.visible} onCheckedChange={() => toggleVisibility(product.id)} />
                        <span className="text-xs text-muted-foreground">{product.visible ? "Visible" : "Hidden"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" /> Preview
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Orders & fulfillment</CardTitle>
              <CardDescription>Track payments, fulfillment states, and shipping promises.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border bg-white/70 p-3">
                  <div className="space-y-1">
                    <div className="font-semibold">{order.title}</div>
                    <p className="text-xs text-muted-foreground">Buyer: {order.buyer}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">${order.total.toFixed(2)}</Badge>
                    <Badge className={order.status === "fulfilled" ? "bg-emerald-600" : order.status === "paid" ? "bg-blue-600" : "bg-amber-500"}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">View full order list</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping controls</CardTitle>
              <CardDescription>Enable the right carriers and timelines for each host-managed item.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shippingProfiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between rounded-lg border bg-white/70 p-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Truck className="h-4 w-4" />
                      {profile.name}
                    </div>
                    <p className="text-xs text-muted-foreground">{profile.carrier} • {profile.eta} • {profile.cost}</p>
                  </div>
                  <Switch checked={profile.active} onCheckedChange={() => toggleShippingProfile(profile.id)} />
                </div>
              ))}
              <Button className="w-full" variant="outline">Add shipping profile</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resellers & affiliate links</CardTitle>
            <CardDescription>Invite partners, set commission tiers, and decide which products they can represent.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="reseller-name">Partner name</Label>
              <Input
                id="reseller-name"
                placeholder="Coastal Collective"
                value={newReseller.name}
                onChange={(event) => setNewReseller((prev) => ({ ...prev, name: event.target.value }))}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Assign product</Label>
                  <Select
                    value={newReseller.productId}
                    onValueChange={(value) => setNewReseller((prev) => ({ ...prev, productId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a listing" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission">Commission %</Label>
                  <Input
                    id="commission"
                    type="number"
                    min={0}
                    max={30}
                    value={newReseller.commission}
                    onChange={(event) => setNewReseller((prev) => ({ ...prev, commission: Number(event.target.value) }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tier</Label>
                <Select value={newReseller.tier} onValueChange={(value: Reseller["tier"]) => setNewReseller((prev) => ({ ...prev, tier: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="exclusive">Exclusive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea placeholder="Add handoff notes or promo requirements" />
              <Button className="w-full sm:w-auto" onClick={handleAddReseller}>
                <Users className="mr-2 h-4 w-4" />
                Add reseller
              </Button>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border bg-white/70 p-4">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Active partners</span>
                  <Badge variant="secondary">{resellers.length}</Badge>
                </div>
                <Separator className="my-3" />
                <div className="space-y-3">
                  {resellers.map((reseller) => {
                    const product = products.find((item) => item.id === reseller.productId);
                    return (
                      <div key={reseller.id} className="flex items-start justify-between gap-3 rounded-md bg-slate-50 p-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Globe2 className="h-4 w-4" />
                            {reseller.name}
                            <Badge variant="outline" className="capitalize">{reseller.tier}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Listing: {product?.name || "Removed"}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{reseller.commission}%</div>
                          <p className="text-xs text-muted-foreground">Affiliate split</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-lg border bg-white/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Link className="h-4 w-4" />
                  Affiliate performance
                </div>
                <div className="mt-3 space-y-3">
                  {products.map((product) => (
                    <div key={product.id} className="space-y-1 rounded-md border p-3">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span>{product.name}</span>
                        <Badge variant={product.visible ? "secondary" : "outline"}>{product.visible ? "Live" : "Hidden"}</Badge>
                      </div>
                      <Progress value={product.affiliatePercent * 2} />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Resellers: {product.resellers}</span>
                        <span>Commission: {product.affiliatePercent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
