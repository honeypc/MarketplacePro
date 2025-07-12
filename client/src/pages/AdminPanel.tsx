import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
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
  Activity
} from 'lucide-react';
import { useProducts, useCategories, useAuth, useOrders, useReviews, useProperties, useItineraries } from '@/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'seller' | 'user';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  firstName?: string;
  lastName?: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

interface TableData {
  id: string | number;
  [key: string]: any;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedTableData, setSelectedTableData] = useState<TableData[]>([]);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [managingTable, setManagingTable] = useState<string>('');
  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user' as const
  });
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Data fetching hooks
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews();
  const { data: properties = [], isLoading: propertiesLoading } = useProperties();
  const { data: itineraries = [], isLoading: itinerariesLoading } = useItineraries();

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: () => apiRequest('GET', '/api/admin/users').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  // Fetch roles
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['/api/admin/roles'],
    queryFn: () => apiRequest('GET', '/api/admin/roles').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  // Fetch system stats
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/stats').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  // Available permissions
  const availablePermissions = [
    'users.read', 'users.write', 'users.delete',
    'products.read', 'products.write', 'products.delete',
    'orders.read', 'orders.write', 'orders.delete',
    'reviews.read', 'reviews.write', 'reviews.delete',
    'properties.read', 'properties.write', 'properties.delete',
    'categories.read', 'categories.write', 'categories.delete',
    'analytics.read', 'admin.access'
  ];

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: (userData: typeof newUser) => 
      apiRequest('POST', '/api/admin/users', userData).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsCreateUserOpen(false);
      setNewUser({ email: '', username: '', password: '', firstName: '', lastName: '', role: 'user' });
      toast({ title: 'User created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating user', description: error.message, variant: 'destructive' });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...userData }: { id: string; [key: string]: any }) => 
      apiRequest('PUT', `/api/admin/users/${id}`, userData).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast({ title: 'User updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating user', description: error.message, variant: 'destructive' });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest('DELETE', `/api/admin/users/${id}`).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
      toast({ title: 'User deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting user', description: error.message, variant: 'destructive' });
    }
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => 
      apiRequest('PUT', `/api/admin/users/${id}/status`, { isActive }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: 'User status updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating user status', description: error.message, variant: 'destructive' });
    }
  });

  const updateUserPermissionsMutation = useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) => 
      apiRequest('PUT', `/api/admin/users/${id}/permissions`, { permissions }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsPermissionDialogOpen(false);
      setEditingItem(null);
      setUserPermissions([]);
      toast({ title: 'User permissions updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating permissions', description: error.message, variant: 'destructive' });
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: ({ table, ids }: { table: string; ids: (string | number)[] }) => 
      apiRequest('DELETE', `/api/admin/bulk-delete`, { table, ids }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries();
      setSelectedTableData([]);
      toast({ title: 'Selected items deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting items', description: error.message, variant: 'destructive' });
    }
  });

  // Filter users based on search and role
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (user.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Handle table management
  const handleManageTable = (tableName: string) => {
    setManagingTable(tableName);
    setActiveTab('data-tables');
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDeleteItem = (item: any) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handlePermissionManagement = (user: User) => {
    setEditingItem(user);
    setUserPermissions(user.permissions || []);
    setIsPermissionDialogOpen(true);
  };

  const handleTogglePermission = (permission: string) => {
    setUserPermissions(prev => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleBulkDelete = () => {
    if (selectedTableData.length === 0) return;
    
    const ids = selectedTableData.map(item => item.id);
    bulkDeleteMutation.mutate({ table: managingTable, ids });
  };

  const exportData = (data: any[], filename: string) => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get table data based on selected table
  const getTableData = () => {
    switch (managingTable) {
      case 'users': return users;
      case 'products': return products;
      case 'orders': return orders;
      case 'reviews': return reviews;
      case 'properties': return properties;
      case 'categories': return categories;
      case 'itineraries': return itineraries;
      default: return [];
    }
  };

  const tableData = getTableData();

  // System overview cards
  const overviewCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      description: `${stats?.newUsersThisMonth || 0} new this month`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => handleManageTable('users')
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      description: `${stats?.activeProducts || 0} active products`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => handleManageTable('products')
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      description: `$${stats?.totalRevenue || 0} total revenue`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => handleManageTable('orders')
    },
    {
      title: 'Properties',
      value: stats?.totalProperties || 0,
      icon: Building,
      description: `${stats?.activeProperties || 0} active properties`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => handleManageTable('properties')
    },
    {
      title: 'Reviews',
      value: reviews.length,
      icon: Star,
      description: 'Customer feedback',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      action: () => handleManageTable('reviews')
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: Filter,
      description: 'Product categories',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      action: () => handleManageTable('categories')
    },
    {
      title: 'Travel Itineraries',
      value: itineraries.length,
      icon: Plane,
      description: 'Travel bookings',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      action: () => handleManageTable('itineraries')
    },
    {
      title: 'System Health',
      value: '98.5%',
      icon: Activity,
      description: 'Server uptime',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => {}
    }
  ];

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
            <p>You don't have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">Manage your platform data and users</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => queryClient.invalidateQueries()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button onClick={() => setIsCreateUserOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="data-tables">Data Tables</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewCards.map((card, index) => (
              <Card key={index} className={`${card.bgColor} border-l-4 border-l-current ${card.color}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={card.action}
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={() => exportData(users, 'users')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </Button>
              <Button onClick={() => exportData(products, 'products')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Products
              </Button>
              <Button onClick={() => exportData(orders, 'orders')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Orders
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-muted-foreground">@{user.username}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : user.role === 'seller' ? 'secondary' : 'outline'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.isActive}
                              onCheckedChange={(checked) => 
                                updateUserStatusMutation.mutate({ id: user.id, isActive: checked })
                              }
                            />
                            <span className="text-sm">
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditItem(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePermissionManagement(user)}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-tables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Table Management</CardTitle>
              <CardDescription>
                {managingTable ? `Managing ${managingTable} table` : 'Select a table to manage'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!managingTable ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['users', 'products', 'orders', 'reviews', 'properties', 'categories', 'itineraries'].map((table) => (
                    <Button
                      key={table}
                      variant="outline"
                      className="h-20"
                      onClick={() => handleManageTable(table)}
                    >
                      <div className="text-center">
                        <div className="font-medium capitalize">{table}</div>
                        <div className="text-sm text-muted-foreground">
                          {getTableData().length} items
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setManagingTable('')}
                    >
                      ← Back to Tables
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => exportData(tableData, managingTable)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      {selectedTableData.length > 0 && (
                        <Button
                          variant="destructive"
                          onClick={handleBulkDelete}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Selected ({selectedTableData.length})
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedTableData.length === tableData.length}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTableData(tableData);
                                } else {
                                  setSelectedTableData([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedTableData.some(selected => selected.id === item.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedTableData(prev => [...prev, item]);
                                  } else {
                                    setSelectedTableData(prev => prev.filter(selected => selected.id !== item.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate">
                                {item.title || item.name || item.email || item.description || 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={item.isActive !== false ? 'default' : 'secondary'}>
                                {item.isActive !== false ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role & Permission Management</CardTitle>
              <CardDescription>Configure user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role: Role) => (
                  <Card key={role.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5" />
                        {role.name}
                      </CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Permissions:</Label>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission: string) => (
                            <Badge key={permission} variant="outline">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create User Dialog */}
      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">Username</Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">First Name</Label>
              <Input
                id="firstName"
                value={newUser.firstName}
                onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">Last Name</Label>
              <Input
                id="lastName"
                value={newUser.lastName}
                onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as any }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => createUserMutation.mutate(newUser)} disabled={createUserMutation.isPending}>
              Create User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">ID</Label>
                <Input value={editingItem.id} disabled className="col-span-3" />
              </div>
              {Object.entries(editingItem).map(([key, value]) => {
                if (key === 'id' || key === 'createdAt' || key === 'updatedAt') return null;
                return (
                  <div key={key} className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right capitalize">{key}</Label>
                    <Input
                      value={value as string}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, [key]: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => updateUserMutation.mutate(editingItem)} disabled={updateUserMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteUserMutation.mutate(deletingItem?.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permission Management Dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage User Permissions</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label>User: {editingItem.firstName} {editingItem.lastName}</Label>
                <p className="text-sm text-muted-foreground">{editingItem.email}</p>
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={userPermissions.includes(permission)}
                        onCheckedChange={() => handleTogglePermission(permission)}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button 
              onClick={() => updateUserPermissionsMutation.mutate({ 
                id: editingItem?.id, 
                permissions: userPermissions 
              })}
              disabled={updateUserPermissionsMutation.isPending}
            >
              Save Permissions
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;