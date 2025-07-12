import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Star,
  Eye,
  Calendar as CalendarIcon,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { subDays } from 'date-fns';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  AreaChart,
  Area,
  ComposedChart,
  Legend
} from 'recharts';

const SellerAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { toast } = useToast();

  // Analytics data queries
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/seller/analytics', user?.id, selectedPeriod],
    queryFn: () => apiRequest('GET', `/api/seller/analytics?period=${selectedPeriod}&sellerId=${user?.id}`).then(res => res.json()),
    enabled: !!user && (user.role === 'seller' || user.role === 'admin')
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/seller/products', user?.id],
    queryFn: () => apiRequest('GET', `/api/seller/products?sellerId=${user?.id}`).then(res => res.json()),
    enabled: !!user && (user.role === 'seller' || user.role === 'admin')
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/seller/orders', user?.id],
    queryFn: () => apiRequest('GET', `/api/seller/orders?sellerId=${user?.id}`).then(res => res.json()),
    enabled: !!user && (user.role === 'seller' || user.role === 'admin')
  });

  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ['/api/seller/inventory', user?.id],
    queryFn: () => apiRequest('GET', `/api/seller/inventory?sellerId=${user?.id}`).then(res => res.json()),
    enabled: !!user && (user.role === 'seller' || user.role === 'admin')
  });

  // Mock data for demonstration (replace with real data from API)
  const mockAnalytics = {
    revenue: {
      total: 45780000,
      change: 12.5,
      trend: 'up',
      data: [
        { name: 'Jan', value: 3200000 },
        { name: 'Feb', value: 3800000 },
        { name: 'Mar', value: 4100000 },
        { name: 'Apr', value: 3900000 },
        { name: 'May', value: 4500000 },
        { name: 'Jun', value: 5200000 },
        { name: 'Jul', value: 4800000 },
        { name: 'Aug', value: 5500000 },
        { name: 'Sep', value: 6200000 },
        { name: 'Oct', value: 5800000 },
        { name: 'Nov', value: 6500000 },
        { name: 'Dec', value: 7200000 }
      ]
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
    ],
    categoryPerformance: [
      { name: 'Electronics', value: 45, color: '#8884d8' },
      { name: 'Fashion', value: 25, color: '#82ca9d' },
      { name: 'Home & Garden', value: 20, color: '#ffc658' },
      { name: 'Sports', value: 10, color: '#ff7300' }
    ],
    trafficSources: [
      { name: 'Organic Search', value: 40, color: '#8884d8' },
      { name: 'Direct', value: 30, color: '#82ca9d' },
      { name: 'Social Media', value: 20, color: '#ffc658' },
      { name: 'Referral', value: 10, color: '#ff7300' }
    ],
    dailyMetrics: [
      { date: '2025-01-01', orders: 12, revenue: 1800000, views: 450 },
      { date: '2025-01-02', orders: 15, revenue: 2250000, views: 520 },
      { date: '2025-01-03', orders: 18, revenue: 2700000, views: 680 },
      { date: '2025-01-04', orders: 22, revenue: 3300000, views: 750 },
      { date: '2025-01-05', orders: 19, revenue: 2850000, views: 620 },
      { date: '2025-01-06', orders: 25, revenue: 3750000, views: 890 },
      { date: '2025-01-07', orders: 28, revenue: 4200000, views: 920 }
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
              <SelectItem value="custom">Custom range</SelectItem>
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={mockAnalytics.revenue.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={mockAnalytics.categoryPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockAnalytics.categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Daily Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={mockAnalytics.dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Orders" />
                  <Line yAxisId="right" type="monotone" dataKey="views" stroke="#82ca9d" name="Views" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.sales} sales • {product.views} views</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{formatCurrency(product.revenue)}</p>
                        <p className="text-xs text-gray-600">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Products</span>
                    <Badge>{mockAnalytics.products.total}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active</span>
                    <Badge variant="outline" className="text-green-600">
                      {mockAnalytics.products.active}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Low Stock</span>
                    <Badge variant="outline" className="text-orange-600">
                      {mockAnalytics.products.lowStock}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Out of Stock</span>
                    <Badge variant="outline" className="text-red-600">
                      {mockAnalytics.products.outOfStock}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={mockAnalytics.topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Customers</span>
                    <Badge>{mockAnalytics.customers.total}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Customers</span>
                    <Badge variant="outline" className="text-green-600">
                      {mockAnalytics.customers.new}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Returning Customers</span>
                    <Badge variant="outline" className="text-blue-600">
                      {mockAnalytics.customers.returning}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Rating</span>
                    <Badge variant="outline" className="text-yellow-600">
                      {mockAnalytics.customers.satisfaction}/5
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {mockAnalytics.conversion.rate}%
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">
                      {formatPercentage(mockAnalytics.conversion.change)}
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={mockAnalytics.trafficSources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockAnalytics.trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerAnalytics;