import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  AlertTriangle, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  CheckCircle, 
  Clock,
  Plus,
  Minus,
  RefreshCw,
  History,
  AlertCircle,
  XCircle
} from "lucide-react";

interface InventoryAlert {
  id: number;
  productId: number;
  sellerId: string;
  alertType: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  isResolved: boolean;
  resolvedAt: string | null;
  createdAt: string;
}

interface StockMovement {
  id: number;
  productId: number;
  sellerId: string;
  movementType: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  notes: string;
  createdAt: string;
}

interface Product {
  id: number;
  title: string;
  stock: number;
  lowStockThreshold: number;
  reservedStock: number;
  lastRestocked: string;
  price: string;
  status: string;
}

export default function InventoryManagement() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockUpdateData, setStockUpdateData] = useState({
    newStock: 0,
    movementType: 'adjustment',
    reason: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory alerts
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/inventory/alerts'],
  });

  // Fetch low stock products
  const { data: lowStockProducts = [], isLoading: lowStockLoading } = useQuery({
    queryKey: ['/api/inventory/low-stock'],
  });

  // Fetch seller products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/seller/products'],
  });

  // Fetch stock movements for selected product
  const { data: stockMovements = [], isLoading: movementsLoading } = useQuery({
    queryKey: ['/api/inventory/stock-movements', selectedProduct?.id],
    enabled: !!selectedProduct,
  });

  // Mark alert as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest(`/api/inventory/alerts/${alertId}/read`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/alerts'] });
      toast({
        title: "Alert marked as read",
        description: "The alert has been marked as read successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark alert as read",
        variant: "destructive",
      });
    },
  });

  // Mark alert as resolved mutation
  const markAsResolvedMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest(`/api/inventory/alerts/${alertId}/resolve`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/alerts'] });
      toast({
        title: "Alert resolved",
        description: "The alert has been resolved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to resolve alert",
        variant: "destructive",
      });
    },
  });

  // Update stock mutation
  const updateStockMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('/api/inventory/update-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seller/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/low-stock'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/stock-movements', selectedProduct?.id] });
      toast({
        title: "Stock updated",
        description: "Product stock has been updated successfully.",
      });
      setStockUpdateData({ newStock: 0, movementType: 'adjustment', reason: '' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    },
  });

  const handleUpdateStock = () => {
    if (!selectedProduct) return;
    
    updateStockMutation.mutate({
      productId: selectedProduct.id,
      newStock: stockUpdateData.newStock,
      movementType: stockUpdateData.movementType,
      reason: stockUpdateData.reason || `Stock ${stockUpdateData.movementType}`,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getMovementIcon = (movementType: string) => {
    switch (movementType) {
      case 'sale': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'restock': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'adjustment': return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'return': return <Plus className="h-4 w-4 text-green-500" />;
      case 'damaged': return <Minus className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const unreadAlerts = alerts.filter((alert: InventoryAlert) => !alert.isRead);
  const criticalAlerts = alerts.filter((alert: InventoryAlert) => alert.severity === 'critical' && !alert.isResolved);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {unreadAlerts.length} Unread Alerts
          </Badge>
          <Badge variant="destructive" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            {criticalAlerts.length} Critical
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="stock-management">Stock Management</TabsTrigger>
          <TabsTrigger value="movements">Stock History</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Inventory Alerts
              </CardTitle>
              <CardDescription>
                Monitor and manage your inventory alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : alerts.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No inventory alerts at the moment. Great job managing your stock!
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert: InventoryAlert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${alert.isRead ? 'bg-gray-50' : 'bg-white'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)} text-white`}>
                            {getSeverityIcon(alert.severity)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {alert.alertType.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <Badge variant={alert.isResolved ? 'default' : 'destructive'} className="text-xs">
                                {alert.isResolved ? 'Resolved' : 'Active'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-900">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(alert.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!alert.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsReadMutation.mutate(alert.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          {!alert.isResolved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsResolvedMutation.mutate(alert.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Low Stock Products
              </CardTitle>
              <CardDescription>
                Products that need restocking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockLoading ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : lowStockProducts.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All products are adequately stocked. No action needed!
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid gap-4">
                  {lowStockProducts.map((product: Product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.title}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="destructive" className="text-xs">
                            {product.stock} remaining
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Threshold: {product.lowStockThreshold}
                          </span>
                          <span className="text-sm text-gray-600">
                            Reserved: {product.reservedStock}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Restock
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Stock Management
              </CardTitle>
              <CardDescription>
                Update product stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-select">Select Product</Label>
                    <Select
                      value={selectedProduct?.id?.toString() || ''}
                      onValueChange={(value) => {
                        const product = products.find((p: Product) => p.id === parseInt(value));
                        setSelectedProduct(product || null);
                        setStockUpdateData(prev => ({ ...prev, newStock: product?.stock || 0 }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product: Product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.title} (Stock: {product.stock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="movement-type">Movement Type</Label>
                    <Select
                      value={stockUpdateData.movementType}
                      onValueChange={(value) => setStockUpdateData(prev => ({ ...prev, movementType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restock">Restock</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                        <SelectItem value="return">Return</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-stock">New Stock Level</Label>
                    <Input
                      id="new-stock"
                      type="number"
                      value={stockUpdateData.newStock}
                      onChange={(e) => setStockUpdateData(prev => ({ ...prev, newStock: parseInt(e.target.value) || 0 }))}
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (optional)</Label>
                  <Input
                    id="reason"
                    value={stockUpdateData.reason}
                    onChange={(e) => setStockUpdateData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Enter reason for stock update"
                  />
                </div>
                
                {selectedProduct && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Current Stock: {selectedProduct.stock}</p>
                      <p className="text-sm text-gray-600">
                        Change: {stockUpdateData.newStock - selectedProduct.stock > 0 ? '+' : ''}{stockUpdateData.newStock - selectedProduct.stock}
                      </p>
                    </div>
                    <Button
                      onClick={handleUpdateStock}
                      disabled={updateStockMutation.isPending}
                    >
                      {updateStockMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Update Stock
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Stock Movement History
              </CardTitle>
              <CardDescription>
                View detailed stock movement history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedProduct ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Select a product from the Stock Management tab to view its movement history.
                  </AlertDescription>
                </Alert>
              ) : movementsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : stockMovements.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No stock movements found for this product.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold">Movement History for: {selectedProduct.title}</h3>
                  <div className="space-y-3">
                    {stockMovements.map((movement: StockMovement) => (
                      <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getMovementIcon(movement.movementType)}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {movement.movementType.toUpperCase()}
                              </Badge>
                              <span className="text-sm font-medium">
                                {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{movement.reason}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(movement.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {movement.previousStock} → {movement.newStock}
                          </p>
                          <p className="text-xs text-gray-500">Stock Level</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}