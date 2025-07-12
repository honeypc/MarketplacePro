import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  Star,
  ThumbsUp,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  rating: number;
  helpful: number;
  lastUpdated: Date;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const helpArticles: HelpArticle[] = [
  {
    id: 'seller-getting-started',
    title: 'Getting Started as a Seller',
    content: 'Learn how to set up your seller account, create compelling product listings, and start selling on our marketplace.',
    category: 'Selling',
    tags: ['onboarding', 'seller', 'setup'],
    difficulty: 'beginner',
    readTime: 5,
    rating: 4.8,
    helpful: 156,
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: 'advanced-search-tips',
    title: 'Advanced Search Techniques',
    content: 'Master our search filters and find exactly what you need with these advanced search tips and tricks.',
    category: 'Shopping',
    tags: ['search', 'filters', 'tips'],
    difficulty: 'intermediate',
    readTime: 3,
    rating: 4.6,
    helpful: 89,
    lastUpdated: new Date('2024-01-10')
  },
  {
    id: 'travel-booking-guide',
    title: 'Complete Travel Booking Guide',
    content: 'Step-by-step guide to booking flights, hotels, and activities for your perfect trip.',
    category: 'Travel',
    tags: ['booking', 'travel', 'guide'],
    difficulty: 'beginner',
    readTime: 8,
    rating: 4.9,
    helpful: 234,
    lastUpdated: new Date('2024-01-12')
  },
  {
    id: 'admin-panel-overview',
    title: 'Admin Panel Overview',
    content: 'Comprehensive guide to using the admin panel for managing users, content, and system settings.',
    category: 'Administration',
    tags: ['admin', 'management', 'overview'],
    difficulty: 'advanced',
    readTime: 12,
    rating: 4.7,
    helpful: 67,
    lastUpdated: new Date('2024-01-08')
  },
  {
    id: 'inventory-management',
    title: 'Inventory Management Best Practices',
    content: 'Learn how to effectively manage your inventory, set up alerts, and optimize stock levels.',
    category: 'Selling',
    tags: ['inventory', 'management', 'optimization'],
    difficulty: 'intermediate',
    readTime: 6,
    rating: 4.5,
    helpful: 112,
    lastUpdated: new Date('2024-01-05')
  }
];

const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking the "Forgot Password" link on the login page and following the instructions sent to your email.',
    category: 'Account',
    helpful: 45
  },
  {
    id: 'faq-2',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers. Some regions may have additional payment options available.',
    category: 'Payments',
    helpful: 78
  },
  {
    id: 'faq-3',
    question: 'How do I become a verified seller?',
    answer: 'To become a verified seller, complete your profile, provide business documentation, and maintain good ratings. The verification process takes 2-3 business days.',
    category: 'Selling',
    helpful: 156
  },
  {
    id: 'faq-4',
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking according to the cancellation policy. Check your booking details for specific terms and conditions.',
    category: 'Travel',
    helpful: 89
  },
  {
    id: 'faq-5',
    question: 'How do I contact customer support?',
    answer: 'You can contact our customer support through the live chat widget, email support@marketplace.com, or visit our contact page.',
    category: 'Support',
    helpful: 134
  }
];

export const HelpCenter: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories = ['all', ...new Set(helpArticles.map(article => article.category))];
  const faqCategories = ['all', ...new Set(faqs.map(faq => faq.category))];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <HelpCircle className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Help Center</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to your questions, learn how to use our platform, and get the most out of your experience.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search for help articles, FAQs, or topics..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium">User Guide</h3>
            <p className="text-sm text-muted-foreground">Step-by-step tutorials</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-medium">Video Tutorials</h3>
            <p className="text-sm text-muted-foreground">Watch and learn</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium">Live Chat</h3>
            <p className="text-sm text-muted-foreground">Get instant help</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <ExternalLink className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-medium">Contact Support</h3>
            <p className="text-sm text-muted-foreground">Email or phone</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map(article => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getDifficultyColor(article.difficulty)}>
                          {article.difficulty}
                        </Badge>
                        <Badge variant="outline">{article.category}</Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{article.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-yellow-500" />
                        {article.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {article.helpful}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          {/* FAQ Category Filter */}
          <div className="flex flex-wrap gap-2">
            {faqCategories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>

          {/* FAQs List */}
          <div className="space-y-2">
            {filteredFAQs.map(faq => (
              <Card key={faq.id}>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{faq.category}</Badge>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        expandedFAQ === faq.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                </CardHeader>
                {expandedFAQ === faq.id && (
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {faq.helpful} found this helpful
                      </span>
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Helpful
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Chat Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get instant help from our support team. Available 24/7 for urgent issues.
                </p>
                <Button className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  support@marketplace.com
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};