import { useState, useEffect } from 'react';
import { useTranslation } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  Wallet,
  Plus,
  Edit,
  Trash2,
  Share2,
  Download,
  Star,
  Heart,
  Camera,
  ChevronRight,
  Globe,
  Plane,
  Car,
  Utensils,
  Bed,
  Activity,
  CheckCircle,
  Circle,
  DollarSign,
  Target,
  Lightbulb,
  Calendar,
  Route,
  Settings
} from 'lucide-react';

interface TravelItinerary {
  id: number;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  budget: number;
  currency: string;
  travelStyle: string;
  groupSize: number;
  interests: string[];
  isPublic: boolean;
  status: string;
  createdAt: string;
  days?: ItineraryDay[];
}

interface ItineraryDay {
  id: number;
  dayNumber: number;
  date: string;
  title: string;
  description: string;
  budget: number;
  activities: ItineraryActivity[];
}

interface ItineraryActivity {
  id: number;
  title: string;
  description: string;
  location: string;
  address: string;
  startTime: string;
  endTime: string;
  duration: number;
  cost: number;
  category: string;
  priority: number;
  isBooked: boolean;
  bookingReference: string;
  notes: string;
  images: string[];
}

const categoryIcons = {
  accommodation: Bed,
  food: Utensils,
  transport: Car,
  activity: Activity,
  attraction: Camera,
  flight: Plane,
};

const travelStyles = [
  { value: 'budget', label: 'Tiết kiệm', description: 'Tối ưu chi phí' },
  { value: 'mid-range', label: 'Tầm trung', description: 'Cân bằng giá cả và chất lượng' },
  { value: 'luxury', label: 'Cao cấp', description: 'Trải nghiệm sang trọng' }
];

const interests = [
  'culture', 'food', 'adventure', 'relaxation', 'nature', 'history', 
  'nightlife', 'shopping', 'photography', 'wellness', 'sports', 'art'
];

export default function TravelItineraryPlanner() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedItinerary, setSelectedItinerary] = useState<TravelItinerary | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my-itineraries');
  const [newItinerary, setNewItinerary] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 0,
    travelStyle: 'mid-range',
    groupSize: 1,
    interests: [] as string[],
    isPublic: false
  });

  // Fetch user's itineraries
  const { data: itineraries = [], isLoading } = useQuery({
    queryKey: ['/api/travel/itineraries'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/travel/itineraries');
      return response.json();
    },
    enabled: !!user
  });

  // Fetch public templates
  const { data: templates = [] } = useQuery({
    queryKey: ['/api/travel/templates'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/travel/templates');
      return response.json();
    }
  });

  // Create itinerary mutation
  const createItineraryMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/travel/itineraries', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel/itineraries'] });
      setIsCreateDialogOpen(false);
      setNewItinerary({
        title: '',
        description: '',
        destination: '',
        startDate: '',
        endDate: '',
        budget: 0,
        travelStyle: 'mid-range',
        groupSize: 1,
        interests: [],
        isPublic: false
      });
      toast({
        title: "Thành công",
        description: "Đã tạo lịch trình du lịch mới!"
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể tạo lịch trình du lịch",
        variant: "destructive"
      });
    }
  });

  // Calculate duration when dates change
  useEffect(() => {
    if (newItinerary.startDate && newItinerary.endDate) {
      const start = new Date(newItinerary.startDate);
      const end = new Date(newItinerary.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // Duration is auto-calculated, no need to set it manually
    }
  }, [newItinerary.startDate, newItinerary.endDate]);

  const handleCreateItinerary = () => {
    if (!newItinerary.title || !newItinerary.destination || !newItinerary.startDate || !newItinerary.endDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    const start = new Date(newItinerary.startDate);
    const end = new Date(newItinerary.endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    createItineraryMutation.mutate({
      ...newItinerary,
      duration,
      userId: user?.id
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Đăng nhập để sử dụng Lịch trình Du lịch
          </h1>
          <p className="text-gray-600 mb-8">
            Tạo và quản lý lịch trình du lịch cá nhân của bạn
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            Đăng nhập ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lịch trình Du lịch
              </h1>
              <p className="text-gray-600">
                Lên kế hoạch và quản lý chuyến đi của bạn
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo lịch trình mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tạo lịch trình du lịch mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Tên lịch trình *</Label>
                      <Input
                        id="title"
                        value={newItinerary.title}
                        onChange={(e) => setNewItinerary({...newItinerary, title: e.target.value})}
                        placeholder="Ví dụ: Khám phá Đà Nẵng 4 ngày"
                      />
                    </div>
                    <div>
                      <Label htmlFor="destination">Điểm đến *</Label>
                      <Input
                        id="destination"
                        value={newItinerary.destination}
                        onChange={(e) => setNewItinerary({...newItinerary, destination: e.target.value})}
                        placeholder="Ví dụ: Đà Nẵng, Việt Nam"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={newItinerary.description}
                      onChange={(e) => setNewItinerary({...newItinerary, description: e.target.value})}
                      placeholder="Mô tả về chuyến đi của bạn..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newItinerary.startDate}
                        onChange={(e) => setNewItinerary({...newItinerary, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Ngày kết thúc *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newItinerary.endDate}
                        onChange={(e) => setNewItinerary({...newItinerary, endDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="budget">Ngân sách (VND)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={newItinerary.budget}
                        onChange={(e) => setNewItinerary({...newItinerary, budget: parseInt(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="travelStyle">Phong cách du lịch</Label>
                      <Select value={newItinerary.travelStyle} onValueChange={(value) => setNewItinerary({...newItinerary, travelStyle: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {travelStyles.map(style => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="groupSize">Số người</Label>
                      <Input
                        id="groupSize"
                        type="number"
                        min="1"
                        value={newItinerary.groupSize}
                        onChange={(e) => setNewItinerary({...newItinerary, groupSize: parseInt(e.target.value) || 1})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Sở thích</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {interests.map(interest => (
                        <Button
                          key={interest}
                          variant={newItinerary.interests.includes(interest) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (newItinerary.interests.includes(interest)) {
                              setNewItinerary({
                                ...newItinerary,
                                interests: newItinerary.interests.filter(i => i !== interest)
                              });
                            } else {
                              setNewItinerary({
                                ...newItinerary,
                                interests: [...newItinerary.interests, interest]
                              });
                            }
                          }}
                        >
                          {interest}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button onClick={handleCreateItinerary} disabled={createItineraryMutation.isPending}>
                      {createItineraryMutation.isPending ? 'Đang tạo...' : 'Tạo lịch trình'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-itineraries">Lịch trình của tôi</TabsTrigger>
            <TabsTrigger value="templates">Mẫu lịch trình</TabsTrigger>
            <TabsTrigger value="discover">Khám phá</TabsTrigger>
          </TabsList>

          <TabsContent value="my-itineraries" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : itineraries.length === 0 ? (
              <div className="text-center py-12">
                <Route className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có lịch trình nào
                </h3>
                <p className="text-gray-500 mb-4">
                  Bắt đầu tạo lịch trình du lịch đầu tiên của bạn
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo lịch trình mới
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itineraries.map((itinerary: TravelItinerary) => (
                  <Card key={itinerary.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{itinerary.title}</CardTitle>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {itinerary.destination}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarDays className="w-4 h-4 mr-1" />
                            {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                          </div>
                        </div>
                        <Badge variant={itinerary.status === 'draft' ? 'secondary' : 'default'}>
                          {itinerary.status === 'draft' ? 'Bản nháp' : 'Đã xuất bản'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-gray-400" />
                            <span>{itinerary.duration} ngày</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-gray-400" />
                            <span>{itinerary.groupSize} người</span>
                          </div>
                        </div>
                        
                        {itinerary.budget > 0 && (
                          <div className="flex items-center text-sm">
                            <Wallet className="w-4 h-4 mr-1 text-gray-400" />
                            <span>{formatCurrency(itinerary.budget)}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {itinerary.interests.slice(0, 3).map(interest => (
                            <Badge key={interest} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {itinerary.interests.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{itinerary.interests.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button size="sm" onClick={() => setSelectedItinerary(itinerary)}>
                            Xem chi tiết
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template: any) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {template.destination}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-yellow-600">
                        <Star className="w-4 h-4 mr-1" />
                        {template.rating}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>{template.duration} ngày</span>
                        <span className="font-medium">{formatCurrency(template.estimatedBudget)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Đã sử dụng {template.usageCount} lần</span>
                        <Badge variant="outline">{template.travelStyle}</Badge>
                      </div>
                      
                      <Button className="w-full">
                        Sử dụng mẫu này
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discover" className="mt-6">
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Khám phá lịch trình từ cộng đồng
              </h3>
              <p className="text-gray-500">
                Tính năng này sẽ sớm được ra mắt
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}