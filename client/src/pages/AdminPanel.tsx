import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
  Activity,
  Database,
  Home,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Row,
} from '@tanstack/react-table';

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
  permissions?: string[];
}

interface TableData {
  id: string | number;
  [key: string]: any;
}

interface SidebarItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  description?: string;
  category: 'overview' | 'users' | 'content' | 'commerce' | 'travel' | 'settings';
}

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<TableData[]>([]);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
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

  // Data fetching hooks - Use individual queries instead of complex hooks
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest('GET', '/api/products').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => apiRequest('GET', '/api/categories').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: () => apiRequest('GET', '/api/orders').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: () => apiRequest('GET', '/api/reviews').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: () => apiRequest('GET', '/api/properties').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: itineraries = [], isLoading: itinerariesLoading } = useQuery({
    queryKey: ['/api/travel/itineraries'],
    queryFn: () => apiRequest('GET', '/api/travel/itineraries').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  // Fetch hotels and accommodations
  const { data: hotels = [], isLoading: hotelsLoading } = useQuery({
    queryKey: ['/api/admin/hotels'],
    queryFn: () => apiRequest('GET', '/api/admin/hotels').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: roomTypes = [], isLoading: roomTypesLoading } = useQuery({
    queryKey: ['/api/admin/room-types'],
    queryFn: () => apiRequest('GET', '/api/admin/room-types').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: villas = [], isLoading: villasLoading } = useQuery({
    queryKey: ['/api/admin/villas'],
    queryFn: () => apiRequest('GET', '/api/admin/villas').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: homestays = [], isLoading: homestaysLoading } = useQuery({
    queryKey: ['/api/admin/homestays'],
    queryFn: () => apiRequest('GET', '/api/admin/homestays').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  // Fetch travel stations and providers
  const { data: airports = [], isLoading: airportsLoading } = useQuery({
    queryKey: ['/api/admin/airports'],
    queryFn: () => apiRequest('GET', '/api/admin/airports').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: stations = [], isLoading: stationsLoading } = useQuery({
    queryKey: ['/api/admin/stations'],
    queryFn: () => apiRequest('GET', '/api/admin/stations').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: providers = [], isLoading: providersLoading } = useQuery({
    queryKey: ['/api/admin/providers'],
    queryFn: () => apiRequest('GET', '/api/admin/providers').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: flights = [], isLoading: flightsLoading } = useQuery({
    queryKey: ['/api/admin/flights'],
    queryFn: () => apiRequest('GET', '/api/admin/flights').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  const { data: tours = [], isLoading: toursLoading } = useQuery({
    queryKey: ['/api/admin/tours'],
    queryFn: () => apiRequest('GET', '/api/admin/tours').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: () => apiRequest('GET', '/api/admin/users').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  // Fetch system stats
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/stats').then(res => res.json()),
    enabled: user?.role === 'admin'
  });

  // Sidebar items configuration
  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: Home,
      description: 'System overview and analytics',
      category: 'overview'
    },
    {
      id: 'users',
      title: 'Users',
      icon: Users,
      count: users.length,
      description: 'User management and permissions',
      category: 'users'
    },
    {
      id: 'products',
      title: 'Products',
      icon: Package,
      count: products.length,
      description: 'Product catalog management',
      category: 'content'
    },
    {
      id: 'categories',
      title: 'Categories',
      icon: Filter,
      count: categories.length,
      description: 'Product categorization',
      category: 'content'
    },
    {
      id: 'orders',
      title: 'Orders',
      icon: ShoppingCart,
      count: orders.length,
      description: 'Order processing and tracking',
      category: 'commerce'
    },
    {
      id: 'reviews',
      title: 'Reviews',
      icon: Star,
      count: reviews.length,
      description: 'Customer feedback management',
      category: 'commerce'
    },
    {
      id: 'properties',
      title: 'Properties',
      icon: Building,
      count: properties.length,
      description: 'Property listings and bookings',
      category: 'travel'
    },
    {
      id: 'itineraries',
      title: 'Travel Plans',
      icon: Plane,
      count: itineraries.length,
      description: 'Travel itinerary management',
      category: 'travel'
    },
    {
      id: 'hotels',
      title: 'Hotels',
      icon: Building,
      count: hotels.length,
      description: 'Hotel management and facilities',
      category: 'travel'
    },
    {
      id: 'room-types',
      title: 'Room Types',
      icon: Home,
      count: roomTypes.length,
      description: 'Room type and pricing management',
      category: 'travel'
    },
    {
      id: 'villas',
      title: 'Villas',
      icon: Home,
      count: villas.length,
      description: 'Villa rental management',
      category: 'travel'
    },
    {
      id: 'homestays',
      title: 'Homestays',
      icon: Heart,
      count: homestays.length,
      description: 'Homestay accommodation management',
      category: 'travel'
    },
    {
      id: 'airports',
      title: 'Airports',
      icon: Plane,
      count: airports.length,
      description: 'Airport and flight station management',
      category: 'travel'
    },
    {
      id: 'stations',
      title: 'Travel Stations',
      icon: MapPin,
      count: stations.length,
      description: 'Bus, train, and transport stations',
      category: 'travel'
    },
    {
      id: 'providers',
      title: 'Travel Providers',
      icon: Crown,
      count: providers.length,
      description: 'Airlines, bus companies, and tour operators',
      category: 'travel'
    },
    {
      id: 'flights',
      title: 'Flights',
      icon: Plane,
      count: flights.length,
      description: 'Flight schedule and route management',
      category: 'travel'
    },
    {
      id: 'tours',
      title: 'Tours',
      icon: MapPin,
      count: tours.length,
      description: 'Tour package and destination management',
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
      setSelectedItems([]);
      toast({ title: 'Selected items deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting items', description: error.message, variant: 'destructive' });
    }
  });

  // Get current data based on active section
  const getCurrentData = () => {
    switch (activeSection) {
      case 'users': return users;
      case 'products': return products;
      case 'orders': return orders;
      case 'reviews': return reviews;
      case 'properties': return properties;
      case 'categories': return categories;
      case 'itineraries': return itineraries;
      case 'hotels': return hotels;
      case 'room-types': return roomTypes;
      case 'villas': return villas;
      case 'homestays': return homestays;
      case 'airports': return airports;
      case 'stations': return stations;
      case 'providers': return providers;
      case 'flights': return flights;
      case 'tours': return tours;
      default: return [];
    }
  };

  // Create table columns based on data type
  const createTableColumns = (data: any[]): ColumnDef<any>[] => {
    if (!data || data.length === 0) return [];

    const sample = data[0];
    const columns: ColumnDef<any>[] = [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      }
    ];

    // Add ID column
    if (sample.id) {
      columns.push({
        accessorKey: 'id',
        header: 'ID',
        size: 80,
        cell: ({ row }) => (
          <div className="font-mono text-sm">{row.getValue('id')}</div>
        ),
      });
    }

    // Add common columns based on data type
    if (activeSection === 'users') {
      columns.push(
        {
          accessorKey: 'email',
          header: 'Email',
          cell: ({ row }) => (
            <div className="font-medium">{row.getValue('email')}</div>
          ),
        },
        {
          accessorKey: 'username',
          header: 'Username',
          cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">@{row.getValue('username')}</div>
          ),
        },
        {
          accessorKey: 'role',
          header: 'Role',
          cell: ({ row }) => (
            <Badge variant={row.getValue('role') === 'admin' ? 'default' : 'secondary'}>
              {row.getValue('role')}
            </Badge>
          ),
        },
        {
          accessorKey: 'isActive',
          header: 'Status',
          cell: ({ row }) => (
            <Switch
              checked={row.getValue('isActive')}
              onCheckedChange={(checked) => 
                updateUserStatusMutation.mutate({ id: row.getValue('id'), isActive: checked })
              }
            />
          ),
        }
      );
    } else {
      // Generic columns for other data types
      Object.keys(sample).forEach(key => {
        if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
          columns.push({
            accessorKey: key,
            header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            cell: ({ row }) => {
              const value = row.getValue(key);
              if (typeof value === 'boolean') {
                return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Active' : 'Inactive'}</Badge>;
              }
              if (Array.isArray(value)) {
                return <div className="max-w-xs truncate">{JSON.stringify(value)}</div>;
              }
              return <div className="max-w-xs truncate">{String(value)}</div>;
            },
          });
        }
      });
    }

    // Add actions column
    columns.push({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditItem(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {activeSection === 'users' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePermissionManagement(row.original)}
            >
              <Shield className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteItem(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 120,
    });

    return columns;
  };

  const currentData = getCurrentData();
  const columns = createTableColumns(currentData);

  const table = useReactTable({
    data: currentData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

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
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    
    const ids = selectedRows.map(row => row.original.id);
    bulkDeleteMutation.mutate({ table: activeSection, ids });
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <h1 className="font-bold text-lg">Admin Panel</h1>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {['overview', 'users', 'content', 'commerce', 'travel', 'settings'].map(category => (
              <div key={category}>
                {isSidebarOpen && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                )}
                <div className="space-y-1">
                  {sidebarItems
                    .filter(item => item.category === category)
                    .map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          activeSection === item.id
                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${activeSection === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                        {isSidebarOpen && (
                          <>
                            <div className="flex-1 text-left">
                              <div className="font-medium">{item.title}</div>
                              {item.description && (
                                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                              )}
                            </div>
                            {item.count !== undefined && (
                              <Badge variant="secondary" className="text-xs">
                                {item.count}
                              </Badge>
                            )}
                          </>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold capitalize">{activeSection}</h2>
              <p className="text-sm text-gray-600">
                {sidebarItems.find(item => item.id === activeSection)?.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {activeSection !== 'dashboard' && activeSection !== 'analytics' && activeSection !== 'settings' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData(currentData, activeSection)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({table.getFilteredSelectedRowModel().rows.length})
                    </Button>
                  )}
                  {activeSection === 'users' && (
                    <Button
                      size="sm"
                      onClick={() => setIsCreateUserOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  )}
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => queryClient.invalidateQueries()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeSection === 'dashboard' ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.newUsersThisMonth || 0} new this month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.activeProducts || 0} active
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      ${stats?.totalRevenue || 0} revenue
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Health</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                    <p className="text-xs text-muted-foreground">
                      Server uptime
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Search and Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder={`Search ${activeSection}...`}
                    value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                      table.getColumn('email')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                  />
                </div>
                {activeSection === 'users' && (
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
                )}
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-b">
                          {headerGroup.headers.map((header) => (
                            <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50">
                            {row.getVisibleCells().map((cell) => (
                              <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            No results found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-3 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                      Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                      {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                      )}{' '}
                      of {table.getFilteredRowModel().rows.length} results
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
                if (key === 'id' || key === 'createdAt' || key === 'updatedAt' || key === 'permissions') return null;
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