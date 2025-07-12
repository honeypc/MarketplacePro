import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, Star, Calendar, Eye } from 'lucide-react';
import { useTranslation } from "@/lib/i18n";
import { useSellerAnalytics, useSellerSalesData, useSellerProductPerformance, useSellerCustomerInsights, useSellerRevenueBreakdown } from "@/hooks/useAnalytics";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AnalyticsDashboard() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('30d');
  
  const { data: analytics, isLoading: analyticsLoading } = useSellerAnalytics(period);
  const { data: salesData, isLoading: salesLoading } = useSellerSalesData(period);
  const { data: productPerformance, isLoading: performanceLoading } = useSellerProductPerformance();
  const { data: customerInsights, isLoading: customersLoading } = useSellerCustomerInsights();
  const { data: revenueBreakdown, isLoading: revenueLoading } = useSellerRevenueBreakdown(period);

  if (analyticsLoading || salesLoading || performanceLoading || customersLoading || revenueLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('analytics.title')}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Tổng doanh thu',
      value: `${analytics?.totalRevenue?.toLocaleString() || 0}đ`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Tổng đơn hàng',
      value: analytics?.totalOrders || 0,
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Sản phẩm bán',
      value: analytics?.totalItems || 0,
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      color: 'text-purple-600'
    },
    {
      title: 'Khách hàng',
      value: customerInsights?.totalCustomers || 0,
      change: '+6.7%',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bảng điều khiển phân tích</h1>
        <div className="flex items-center gap-4">
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
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {kpi.change}
                </span>
                <span className="ml-1">so với kỳ trước</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="sales">Bán hàng</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="customers">Khách hàng</TabsTrigger>
          <TabsTrigger value="breakdown">Phân tích</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ doanh thu theo ngày</CardTitle>
              <CardDescription>Doanh thu hàng ngày trong {period}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.dailyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}đ`, 'Doanh thu']} />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Giá trị đơn hàng trung bình</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {analytics?.averageOrderValue?.toLocaleString() || 0}đ
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tăng 5.2% so với kỳ trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Doanh thu ròng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {revenueBreakdown?.netRevenue?.toLocaleString() || 0}đ
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sau khi trừ phí nền tảng ({revenueBreakdown?.platformFees?.toLocaleString() || 0}đ)
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doanh số theo danh mục</CardTitle>
              <CardDescription>Phân tích doanh số bán hàng theo từng danh mục</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData?.categoryBreakdown || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Doanh thu']} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hiệu quả sản phẩm</CardTitle>
              <CardDescription>Top 10 sản phẩm có doanh thu cao nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance?.slice(0, 10).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.category} • {product.totalSales} đã bán
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{product.totalRevenue.toLocaleString()}đ</p>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {product.avgRating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{customerInsights?.totalCustomers || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Khách hàng quay lại</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{customerInsights?.repeatCustomers || 0}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {customerInsights?.totalCustomers ? 
                    Math.round((customerInsights.repeatCustomers / customerInsights.totalCustomers) * 100) : 0}% 
                  của tổng khách hàng
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tỷ lệ khách hàng trung thành</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {customerInsights?.totalCustomers ? 
                    Math.round((customerInsights.repeatCustomers / customerInsights.totalCustomers) * 100) : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top khách hàng VIP</CardTitle>
              <CardDescription>Khách hàng có tổng chi tiêu cao nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customerInsights?.customers.slice(0, 5).map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {customer.totalOrders} đơn hàng
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{customer.totalSpent.toLocaleString()}đ</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        TB: {customer.averageOrderValue.toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích doanh thu theo danh mục</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueBreakdown?.categoryBreakdown || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ category, percentage }) => `${category} (${percentage.toFixed(1)}%)`}
                    >
                      {revenueBreakdown?.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}đ`, 'Doanh thu']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chi phí & Lợi nhuận</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Tổng doanh thu</span>
                  <span className="font-semibold">{revenueBreakdown?.totalRevenue?.toLocaleString() || 0}đ</span>
                </div>
                <div className="flex justify-between items-center text-red-600">
                  <span>Phí nền tảng (5%)</span>
                  <span className="font-semibold">-{revenueBreakdown?.platformFees?.toLocaleString() || 0}đ</span>
                </div>
                <hr />
                <div className="flex justify-between items-center text-green-600 font-semibold">
                  <span>Doanh thu ròng</span>
                  <span>{revenueBreakdown?.netRevenue?.toLocaleString() || 0}đ</span>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    💡 Mẹo: Tối ưu hóa danh mục có tỷ lệ lợi nhuận cao nhất để tăng doanh thu
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}