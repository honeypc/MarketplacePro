import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Package,
  Building,
  MapPin,
  Plane,
  ShoppingCart,
  Heart,
  MessageSquare,
  Star,
  Settings,
  Shield,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  RefreshCw,
  UserPlus,
  Crown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  Database,
  Home,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

const AdminPanelSimple = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user'
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Data queries
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: () => apiRequest('GET', '/api/admin/users').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/stats').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  // Access control
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need administrator privileges to access this panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sidebar menu items
  const menuItems = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Home,
      description: 'System overview and statistics',
      category: 'overview'
    },
    {
      id: 'users',
      title: 'Users',
      icon: Users,
      count: users.length,
      description: 'User account management',
      category: 'management'
    },
    {
      id: 'products',
      title: 'Products',
      icon: Package,
      count: stats.totalProducts || 0,
      description: 'Product catalog management',
      category: 'content'
    },
    {
      id: 'orders',
      title: 'Orders',
      icon: ShoppingCart,
      count: stats.totalOrders || 0,
      description: 'Order processing and tracking',
      category: 'commerce'
    },
    {
      id: 'reviews',
      title: 'Reviews',
      icon: Star,
      count: stats.totalReviews || 0,
      description: 'Customer feedback management',
      category: 'commerce'
    },
    {
      id: 'properties',
      title: 'Properties',
      icon: Building,
      count: stats.totalProperties || 0,
      description: 'Property listings and bookings',
      category: 'travel'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      description: 'Performance metrics and insights',
      category: 'overview'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      description: 'System configuration',
      category: 'settings'
    }
  ];

  // Filter users based on search and role
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">Active user accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">Listed products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">Orders processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(stats.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Database: Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">API: Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Cache: Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsCreateUserOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user: User) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.role === 'admin' ? 'default' : user.role === 'seller' ? 'secondary' : 'outline'}>
                    {user.role}
                  </Badge>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant={user.isVerified ? 'default' : 'destructive'}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(45780000)}
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +8.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +0.8% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <Activity className="h-4 w-4" />
              +156 new this month
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Electronics</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Fashion</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-3/5 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">32%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Home & Garden</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/4 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">23%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New order completed</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Product updated</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'products':
        return <div className="p-8 text-center text-gray-500">Product management coming soon...</div>;
      case 'orders':
        return <div className="p-8 text-center text-gray-500">Order management coming soon...</div>;
      case 'reviews':
        return <div className="p-8 text-center text-gray-500">Review management coming soon...</div>;
      case 'properties':
        return <div className="p-8 text-center text-gray-500">Property management coming soon...</div>;
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return <div className="p-8 text-center text-gray-500">Settings panel coming soon...</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
                {item.count !== undefined && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold capitalize">{activeSection}</h2>
            <p className="text-gray-600">
              {menuItems.find(item => item.id === activeSection)?.description}
            </p>
          </div>

          {renderContent()}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Create User Dialog */}
      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setIsCreateUserOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={() => {
                // Add creation logic here
                toast({ title: 'User creation functionality coming soon' });
              }}>
                Create User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanelSimple;