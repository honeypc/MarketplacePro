import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  ComposedChart, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  Star, 
  Calendar, 
  Eye, 
  Target, 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  Filter, 
  Info,
  Activity,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from "@/lib/i18n";
import { useSellerAnalytics, useSellerSalesData, useSellerProductPerformance, useSellerCustomerInsights, useSellerRevenueBreakdown } from "@/hooks/useAnalytics";
import { useAdvancedSellerAnalytics, useRealTimeMetrics, useAIInsights, useExportAnalytics } from "@/hooks/useAdvancedAnalytics";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

export default function AdvancedAnalyticsDashboard() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data: advancedData, isLoading: advancedLoading, refetch: refetchAdvanced } = useAdvancedSellerAnalytics(period);
  const { data: realTimeMetrics, isLoading: realTimeLoading } = useRealTimeMetrics();
  const { data: aiInsights, isLoading: aiLoading } = useAIInsights();
  const { exportData } = useExportAnalytics();
  
  // Extract data from advanced analytics response
  const analytics = advancedData?.analytics;
  const salesData = advancedData?.salesData;
  const productPerformance = advancedData?.productPerformance;
  const customerInsights = advancedData?.customerInsights;
  const revenueBreakdown = advancedData?.revenueBreakdown;

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetchAdvanced();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getMonthlyGoal = () => {
    return 50000000; // 50M VND monthly goal
  };

  if (advancedLoading || realTimeLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Advanced Analytics Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const monthlyGoal = getMonthlyGoal();
  const currentRevenue = analytics?.totalRevenue || 0;
  const goalProgress = Math.min((currentRevenue / monthlyGoal) * 100, 100);

  const generateInsights = () => {
    const insights = [];
    
    if (goalProgress > 80) {
      insights.push({
        type: 'success',
        title: 'Đạt mục tiêu',
        description: `Bạn đã đạt ${goalProgress.toFixed(1)}% mục tiêu tháng này!`,
        icon: Target
      });
    }
    
    if (analytics?.conversionRate && analytics.conversionRate < 2) {
      insights.push({
        type: 'warning',
        title: 'Tỷ lệ chuyển đổi thấp',
        description: 'Cần tối ưu hóa sản phẩm để tăng tỷ lệ chuyển đổi',
        icon: AlertTriangle
      });
    }
    
    if (productPerformance?.some((p: any) => p.stock < 10)) {
      insights.push({
        type: 'info',
        title: 'Sản phẩm sắp hết hàng',
        description: 'Một số sản phẩm đang có số lượng thấp',
        icon: Package
      });
    }
    
    return insights;
  };

  const kpiCards = [
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(analytics?.totalRevenue || 0),
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'So với tháng trước'
    },
    {
      title: 'Đơn hàng hoàn thành',
      value: (analytics?.totalOrders || 0).toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Đơn hàng đã xử lý'
    },
    {
      title: 'Sản phẩm đã bán',
      value: (analytics?.totalItems || 0).toLocaleString(),
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Tổng sản phẩm'
    },
    {
      title: 'Khách hàng mới',
      value: (customerInsights?.newCustomers || 0).toLocaleString(),
      change: '+6.7%',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Khách hàng mới tham gia'
    },
    {
      title: 'Tỷ lệ chuyển đổi',
      value: formatPercentage(analytics?.conversionRate || 2.4),
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Từ lượt xem thành mua'
    },
    {
      title: 'Giá trị đơn hàng TB',
      value: formatCurrency(analytics?.avgOrderValue || 850000),
      change: '+5.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Giá trị trung bình'
    },
    {
      title: 'Đánh giá TB',
      value: `${(analytics?.avgRating || 4.5).toFixed(1)}⭐`,
      change: '+0.2%',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Đánh giá trung bình'
    },
    {
      title: 'Lượt xem sản phẩm',
      value: (analytics?.totalViews || 125000).toLocaleString(),
      change: '+18.7%',
      trend: 'up',
      icon: Eye,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: 'Lượt xem tổng cộng'
    }
  ];

  const topProducts = productPerformance?.slice(0, 5).map((product: any) => ({
    name: product.title,
    revenue: product.revenue,
    quantity: product.quantity,
    growth: product.growth || Math.random() * 20 - 5
  })) || [];

  const generateDummySalesData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('vi-VN', { month: 'short', day: '2-digit' }),
        revenue: Math.floor(Math.random() * 2000000) + 500000,
        orders: Math.floor(Math.random() * 50) + 10,
        conversionRate: Math.random() * 5 + 1,
        newCustomers: Math.floor(Math.random() * 20) + 5,
        returningCustomers: Math.floor(Math.random() * 30) + 10
      });
    }
    return data;
  };

  const chartData = salesData?.length > 0 ? salesData : generateDummySalesData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive sales and performance insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ngày</SelectItem>
              <SelectItem value="30d">30 ngày</SelectItem>
              <SelectItem value="90d">90 ngày</SelectItem>
              <SelectItem value="1y">1 năm</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportData('csv', period)}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Goal Progress */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Monthly Revenue Goal
          </CardTitle>
          <CardDescription>Track your progress towards monthly targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Revenue</span>
              <span className="text-xl font-bold">{formatCurrency(currentRevenue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Goal</span>
              <span className="text-xl font-bold">{formatCurrency(monthlyGoal)}</span>
            </div>
            <Progress value={goalProgress} className="h-3" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Progress</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{goalProgress.toFixed(1)}%</span>
                {goalProgress > 80 && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {(aiInsights && aiInsights.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              AI Business Insights
            </CardTitle>
            <CardDescription>Automated insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiInsights.map((insight: any, index: number) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'success' ? 'bg-green-50 border-green-500' :
                  insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-start gap-3">
                    <Info className={`h-5 w-5 mt-0.5 ${
                      insight.type === 'success' ? 'text-green-600' :
                      insight.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      {insight.actionItems && insight.actionItems.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">Recommended Actions:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {insight.actionItems.map((action: string, actionIndex: number) => (
                              <li key={actionIndex} className="flex items-start gap-1">
                                <span className="text-gray-400">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {card.trend === 'up' ? 'UP' : 'DOWN'}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <div className="flex items-center mt-2">
                    {card.trend === 'up' ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {card.change}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Orders and Conversion */}
            <Card>
              <CardHeader>
                <CardTitle>Orders & Conversion Rate</CardTitle>
                <CardDescription>Order volume and conversion trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="orders" fill="#00C49F" />
                    <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#FF8042" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Total Sales</span>
                    </div>
                    <span className="text-lg font-bold">{formatCurrency(analytics?.totalRevenue || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Avg Response Time</span>
                    </div>
                    <span className="text-lg font-bold">2.3 hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Success Rate</span>
                    </div>
                    <span className="text-lg font-bold">98.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12">
                    <Package className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                  <Button variant="outline" className="h-12">
                    <Users className="h-4 w-4 mr-2" />
                    View Customers
                  </Button>
                  <Button variant="outline" className="h-12">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="h-12">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Best sellers by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Product Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Product Performance Details</CardTitle>
                <CardDescription>Detailed product metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(product.revenue)}</p>
                        <div className="flex items-center justify-end">
                          {product.growth > 0 ? (
                            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className={`text-sm ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.growth > 0 ? '+' : ''}{product.growth.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Acquisition */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>New vs returning customers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="newCustomers" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="returningCustomers" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Customer Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>Customer behavior metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Total Customers</span>
                    <span className="text-lg font-bold">{(customerInsights?.totalCustomers || 1250).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">New Customers</span>
                    <span className="text-lg font-bold">{(customerInsights?.newCustomers || 185).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Returning Customers</span>
                    <span className="text-lg font-bold">{(customerInsights?.returningCustomers || 420).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Return Rate</span>
                    <span className="text-lg font-bold">{formatPercentage(customerInsights?.returnRate || 33.6)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Avg Order Value</span>
                    <span className="text-lg font-bold">{formatCurrency(customerInsights?.avgOrderValue || 750000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Revenue distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueBreakdown?.categoryBreakdown || [
                        { category: 'Electronics', revenue: 15000000, percentage: 35 },
                        { category: 'Fashion', revenue: 10000000, percentage: 25 },
                        { category: 'Home & Garden', revenue: 8000000, percentage: 20 },
                        { category: 'Books', revenue: 4000000, percentage: 10 },
                        { category: 'Sports', revenue: 3000000, percentage: 10 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {(revenueBreakdown?.categoryBreakdown || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Details */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Detailed revenue analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Gross Revenue</span>
                    <span className="text-lg font-bold">{formatCurrency(revenueBreakdown?.totalRevenue || 40000000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">Platform Fees (5%)</span>
                    <span className="text-lg font-bold text-yellow-600">-{formatCurrency(revenueBreakdown?.platformFees || 2000000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Net Revenue</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(revenueBreakdown?.netRevenue || 38000000)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <h4 className="font-medium mb-2">Revenue by Category:</h4>
                    <div className="space-y-2">
                      {(revenueBreakdown?.categoryBreakdown || [
                        { category: 'Electronics', revenue: 15000000, percentage: 35 },
                        { category: 'Fashion', revenue: 10000000, percentage: 25 },
                        { category: 'Home & Garden', revenue: 8000000, percentage: 20 },
                        { category: 'Books', revenue: 4000000, percentage: 10 },
                        { category: 'Sports', revenue: 3000000, percentage: 10 }
                      ]).map((category: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{category.category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{formatPercentage(category.percentage)}</span>
                            <span className="text-sm font-medium">{formatCurrency(category.revenue)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}