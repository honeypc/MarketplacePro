import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Star,
  Download,
  AlertCircle,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { subDays } from 'date-fns';

const SellerAnalyticsSimple = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { toast } = useToast();

  // Analytics data queries
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/seller/analytics', user?.id, selectedPeriod],
    queryFn: () => apiRequest('GET', `/api/seller/analytics?period=${selectedPeriod}&sellerId=${user?.id}`).then(res => res.json()),
    enabled: !!user && (user.role === 'seller' || user.role === 'admin')
  });

  // Mock data for demonstration
  const mockAnalytics = {
    revenue: {
      total: 45780000,
      change: 12.5,
      trend: 'up'
    },
    orders: {
      total: 342,
      change: 8.3,
      trend: 'up',
      pending: 15,
      processing: 23,
      shipped: 28,
      delivered: 276
    },
    products: {
      total: 45,
      active: 42,
      inactive: 3,
      lowStock: 8,
      outOfStock: 2
    },
    customers: {
      total: 156,
      new: 12,
      returning: 144,
      satisfaction: 4.6
    },
    conversion: {
      rate: 3.2,
      change: 0.8,
      trend: 'up'
    },
    topProducts: [
      { name: 'iPhone 15 Pro Max', sales: 45, revenue: 67500000, views: 1250 },
      { name: 'Samsung Galaxy S24', sales: 32, revenue: 28800000, views: 890 },
      { name: 'MacBook Pro M3', sales: 18, revenue: 54000000, views: 650 },
      { name: 'iPad Air', sales: 25, revenue: 25000000, views: 780 },
      { name: 'AirPods Pro', sales: 38, revenue: 15200000, views: 920 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const exportData = (type: string) => {
    const data = mockAnalytics;
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seller-analytics-${type}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Data exported successfully' });
  };

  if (user?.role !== 'seller' && user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to be a seller to access analytics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Seller Analytics</h1>
          <p className="text-gray-600">Track your business performance and growth</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportData('complete')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockAnalytics.revenue.total)}</div>
            <div className="flex items-center gap-1 text-sm">
              {mockAnalytics.revenue.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={mockAnalytics.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {formatPercentage(mockAnalytics.revenue.change)}
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.orders.total}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600">{formatPercentage(mockAnalytics.orders.change)}</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.products.active}</div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="text-orange-600">
                {mockAnalytics.products.lowStock} Low Stock
              </Badge>
              <Badge variant="outline" className="text-red-600">
                {mockAnalytics.products.outOfStock} Out of Stock
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.customers.satisfaction}/5</div>
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-blue-600">{mockAnalytics.customers.total} customers</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {formatCurrency(mockAnalytics.revenue.total)}
                  </div>
                  <p className="text-gray-600">Total revenue for the selected period</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">+{mockAnalytics.revenue.change}%</span>
                    <span className="text-gray-600">vs previous period</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pending</span>
                    <Badge variant="outline" className="text-orange-600">
                      {mockAnalytics.orders.pending}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Processing</span>
                    <Badge variant="outline" className="text-blue-600">
                      {mockAnalytics.orders.processing}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Shipped</span>
                    <Badge variant="outline" className="text-purple-600">
                      {mockAnalytics.orders.shipped}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Delivered</span>
                    <Badge variant="outline" className="text-green-600">
                      {mockAnalytics.orders.delivered}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} sales • {product.views} views</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(product.revenue)}</p>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mockAnalytics.products.total}</div>
                  <p className="text-sm text-gray-600">Total Products</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{mockAnalytics.products.active}</div>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{mockAnalytics.products.lowStock}</div>
                  <p className="text-sm text-gray-600">Low Stock</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{mockAnalytics.products.outOfStock}</div>
                  <p className="text-sm text-gray-600">Out of Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Base</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Customers</span>
                      <span className="font-bold">{mockAnalytics.customers.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Customers</span>
                      <span className="font-bold text-green-600">{mockAnalytics.customers.new}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Returning Customers</span>
                      <span className="font-bold text-blue-600">{mockAnalytics.customers.returning}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Satisfaction</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-600 mb-2">
                      {mockAnalytics.customers.satisfaction}/5
                    </div>
                    <p className="text-gray-600">Average Rating</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerAnalyticsSimple;