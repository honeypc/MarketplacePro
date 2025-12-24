import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Home,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Star,
  Truck,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOrders, useUpdateOrderStatus, type Order, type OrderItem } from "@/hooks/useOrders";

const statusFlow = ["processing", "shipping", "received", "awaiting_rating", "rated"] as const;
type NormalizedStatus = (typeof statusFlow)[number] | "cancelled";
type NormalizedOrder = Order & { normalizedStatus: NormalizedStatus; orderItems?: OrderItem[] };

const statusMeta: Record<NormalizedStatus, { label: string; color: string; description: string }> = {
  processing: {
    label: "Processing",
    color: "bg-slate-100 text-slate-800 border-slate-200",
    description: "Order received and being prepared",
  },
  shipping: {
    label: "Shipping",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    description: "On the way to your address",
  },
  received: {
    label: "Received",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Delivered successfully",
  },
  awaiting_rating: {
    label: "Wait Rate",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Please leave a rating",
  },
  rated: {
    label: "Rated",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    description: "Feedback submitted",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-100 text-rose-800 border-rose-200",
    description: "Order was cancelled",
  },
};

function normalizeStatus(status?: string): NormalizedStatus {
  switch (status?.toLowerCase()) {
    case "shipping":
    case "shipped":
    case "in_transit":
      return "shipping";
    case "delivered":
    case "received":
      return "received";
    case "wait_rate":
    case "waiting_review":
    case "awaiting_rating":
    case "pending_review":
      return "awaiting_rating";
    case "rated":
    case "reviewed":
    case "completed":
      return "rated";
    case "cancelled":
    case "canceled":
      return "cancelled";
    default:
      return "processing";
  }
}

function StatusBadge({ status }: { status: NormalizedStatus }) {
  const meta = statusMeta[status];
  return <Badge className={`border ${meta.color}`}>{meta.label}</Badge>;
}

function formatCurrency(value?: string | number) {
  const numeric = typeof value === "string" ? parseFloat(value) : value ?? 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(numeric);
}

function ItemList({ items }: { items?: OrderItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-lg border bg-muted/40 flex items-center justify-center">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{item.product?.title || "Product"}</p>
              <p className="text-sm text-muted-foreground">x{item.quantity}</p>
            </div>
            <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusTimeline({ status }: { status: NormalizedStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 text-rose-700">
        <XCircle className="h-5 w-5" />
        <span className="text-sm">This order was cancelled.</span>
      </div>
    );
  }

  const activeIndex = statusFlow.indexOf(status as any);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
      {statusFlow.map((step, index) => {
        const isActive = index <= activeIndex;
        const Icon =
          step === "processing"
            ? RefreshCw
            : step === "shipping"
              ? Truck
              : step === "received"
                ? Home
                : step === "awaiting_rating"
                  ? Clock
                  : Star;

        return (
          <div
            key={step}
            className={`flex flex-col gap-2 p-3 rounded-lg border ${
              isActive ? "border-primary bg-primary/5" : "border-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center border ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{statusMeta[step].label}</p>
                <p className="text-xs text-muted-foreground">{statusMeta[step].description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({
  order,
  onStatusChange,
}: {
  order: NormalizedOrder;
  onStatusChange: (id: number, status: NormalizedStatus) => void;
}) {
  const normalizedStatus = normalizeStatus(order.status);
  const total = formatCurrency(order.totalAmount);
  const createdAt = new Date(order.createdAt).toLocaleDateString();
  const orderItems = order.orderItems ?? order.items ?? [];

  const actionButtons: { label: string; status: NormalizedStatus; variant?: "default" | "outline" }[] = [];
  if (normalizedStatus === "shipping") {
    actionButtons.push({ label: "Mark as received", status: "received" });
  } else if (normalizedStatus === "received") {
    actionButtons.push({ label: "Wait for rating", status: "awaiting_rating" });
  } else if (normalizedStatus === "awaiting_rating") {
    actionButtons.push({ label: "Mark as rated", status: "rated", variant: "outline" });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
          <CardDescription>Placed on {createdAt}</CardDescription>
        </div>
        <StatusBadge status={normalizedStatus} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>{orderItems?.length || 0} items</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>{order.paymentMethod || "Card"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>{order.shippingAddress || "Shipping address pending"}</span>
          </div>
        </div>

        <Separator />

        <ItemList items={orderItems} />

        <Separator />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-semibold">{total}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {actionButtons.map((action) => (
              <Button
                key={action.label}
                variant={action.variant || "default"}
                onClick={() => onStatusChange(order.id, action.status)}
                disabled={normalizedStatus === "cancelled"}
              >
                {action.label}
              </Button>
            ))}
            {normalizedStatus !== "cancelled" && normalizedStatus !== "rated" && (
              <Button
                variant="outline"
                className="border-rose-200 text-rose-700"
                onClick={() => onStatusChange(order.id, "cancelled")}
              >
                Cancel order
              </Button>
            )}
          </div>
        </div>

        <StatusTimeline status={normalizedStatus} />
      </CardContent>
    </Card>
  );
}

export default function OrderHistoryPage() {
  const { toast } = useToast();
  const { data: orders = [], isLoading, error } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const [statusFilter, setStatusFilter] = useState<"all" | NormalizedStatus>("all");
  const [search, setSearch] = useState("");

  const normalizedOrders: NormalizedOrder[] = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      normalizedStatus: normalizeStatus(order.status),
      orderItems: order.orderItems ?? order.items,
    }));
  }, [orders]);

  const filteredOrders = normalizedOrders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.normalizedStatus === statusFilter;
    const matchesSearch =
      search.trim().length === 0 ||
      order.orderItems?.some((item) => item.product?.title?.toLowerCase().includes(search.toLowerCase())) ||
      `${order.id}`.includes(search.trim());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = normalizedOrders.reduce<
    Record<NormalizedStatus, number>
  >(
    (acc, order) => {
      acc[order.normalizedStatus] = (acc[order.normalizedStatus] || 0) + 1;
      return acc;
    },
    {
      processing: 0,
      shipping: 0,
      received: 0,
      awaiting_rating: 0,
      rated: 0,
      cancelled: 0,
    }
  );

  const handleStatusChange = (id: number, status: NormalizedStatus) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast({
            title: "Status updated",
            description: `Order #${id} marked as ${statusMeta[status].label.toLowerCase()}.`,
          });
        },
        onError: () => {
          toast({
            title: "Failed to update",
            description: "Please try again later",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Failed to load orders</CardTitle>
            <CardDescription>We could not load your order history right now.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalOrders = normalizedOrders.length;
  const awaitingRating = statusCounts.awaiting_rating;
  const shippingOrders = statusCounts.shipping;
  const cancelledOrders = statusCounts.cancelled;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Order History</h1>
        <p className="text-muted-foreground">
          Track your purchases from processing to rating with real-time status updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total orders</CardDescription>
            <CardTitle className="text-2xl">{totalOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Shipping</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{shippingOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Waiting to rate</CardDescription>
            <CardTitle className="text-2xl text-amber-600">{awaitingRating}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cancelled</CardDescription>
            <CardTitle className="text-2xl text-rose-600">{cancelledOrders}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardContent className="py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {["all", "shipping", "received", "awaiting_rating", "rated", "cancelled"].map((statusKey) => (
              <Button
                key={statusKey}
                size="sm"
                variant={statusFilter === statusKey ? "default" : "outline"}
                onClick={() => setStatusFilter(statusKey as any)}
              >
                {statusKey === "all" ? "All" : statusMeta[statusKey as NormalizedStatus].label}
                {statusKey !== "all" && ` (${statusCounts[statusKey as NormalizedStatus] || 0})`}
              </Button>
            ))}
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product or order #"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center space-y-3">
            <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-lg font-semibold">No orders to show</p>
            <p className="text-muted-foreground">Start shopping to see your orders here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
