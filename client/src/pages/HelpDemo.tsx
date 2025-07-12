import React, { useState } from 'react';
import { HelpTooltip } from '@/components/help/HelpTooltip';
import { HelpCenter } from '@/components/help/HelpCenter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Filter, 
  Search, 
  Settings, 
  Users, 
  BarChart3,
  Package,
  MessageCircle
} from 'lucide-react';

export default function HelpDemo() {
  const [activeDemo, setActiveDemo] = useState('tooltips');

  const sellerOnboardingSteps = [
    {
      id: 'profile-setup',
      title: 'Complete Your Profile',
      content: 'Add your business information, contact details, and profile picture to build trust with customers.',
      action: 'Edit Profile'
    },
    {
      id: 'product-listing',
      title: 'Create Your First Product',
      content: 'Add high-quality photos, detailed descriptions, and competitive pricing for your products.',
      action: 'Add Product'
    },
    {
      id: 'inventory-setup',
      title: 'Set Up Inventory Management',
      content: 'Configure stock levels, low-stock alerts, and automatic inventory tracking.',
      action: 'Manage Inventory'
    },
    {
      id: 'payment-setup',
      title: 'Configure Payment Settings',
      content: 'Set up your payment methods and tax settings to start receiving payments.',
      action: 'Setup Payments'
    }
  ];

  const shoppingGuideSteps = [
    {
      id: 'search-products',
      title: 'Search and Filter',
      content: 'Use the search bar and filters to find products that match your needs and budget.',
      action: 'Start Searching'
    },
    {
      id: 'compare-items',
      title: 'Compare Products',
      content: 'Add items to your wishlist to compare features, prices, and reviews.',
      action: 'Add to Wishlist'
    },
    {
      id: 'read-reviews',
      title: 'Check Reviews',
      content: 'Read customer reviews and ratings to make informed purchase decisions.',
      action: 'View Reviews'
    },
    {
      id: 'secure-checkout',
      title: 'Complete Purchase',
      content: 'Use our secure checkout process with multiple payment options.',
      action: 'Checkout'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Contextual Help System Demo
            </h1>
            <p className="text-gray-600 mt-2">
              Explore our interactive help features and guided user experiences
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeDemo === 'tooltips' ? 'default' : 'outline'}
            onClick={() => setActiveDemo('tooltips')}
          >
            Help Tooltips
          </Button>
          <Button
            variant={activeDemo === 'guidance' ? 'default' : 'outline'}
            onClick={() => setActiveDemo('guidance')}
          >
            Guided Workflows
          </Button>
          <Button
            variant={activeDemo === 'help-center' ? 'default' : 'outline'}
            onClick={() => setActiveDemo('help-center')}
          >
            Help Center
          </Button>
        </div>

        {/* Content */}
        {activeDemo === 'tooltips' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Interactive Help Tooltips</h2>
              <p className="text-gray-600 mb-6">
                Hover over the help icons to see contextual help tooltips in action
              </p>
            </div>

            {/* Simple Tooltip Examples */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpTooltip
                      title="Search Products"
                      content="Use advanced search filters to find exactly what you're looking for. You can filter by category, price, rating, and more."
                      variant="simple"
                      category="shopping"
                      priority="medium"
                    >
                      <Search className="w-5 h-5" />
                    </HelpTooltip>
                    Product Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input placeholder="Search products..." className="mb-4" />
                  <div className="flex gap-2">
                    <Badge variant="outline">Electronics</Badge>
                    <Badge variant="outline">Fashion</Badge>
                    <Badge variant="outline">Home</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpTooltip
                      title="Shopping Cart"
                      content="Add items to your cart and checkout securely. You can modify quantities and remove items before purchasing."
                      variant="simple"
                      category="shopping"
                      priority="high"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </HelpTooltip>
                    Shopping Cart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span>3 items</span>
                    <Badge>$249.99</Badge>
                  </div>
                  <Button className="w-full mt-4">View Cart</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpTooltip
                      title="Wishlist"
                      content="Save products you're interested in for later. You can compare items and get notified of price drops."
                      variant="simple"
                      category="shopping"
                      priority="low"
                    >
                      <Heart className="w-5 h-5" />
                    </HelpTooltip>
                    Wishlist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span>12 saved items</span>
                    <Badge variant="outline">2 on sale</Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-4">View Wishlist</Button>
                </CardContent>
              </Card>
            </div>

            {/* Guided Tooltip Examples */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Guided Help Tooltips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpTooltip
                        title="Advanced Filters"
                        content="Use multiple filters to narrow down your search results and find exactly what you need."
                        variant="guided"
                        category="shopping"
                        priority="medium"
                        showProgress={true}
                        steps={[
                          {
                            id: 'select-category',
                            title: 'Select Category',
                            content: 'Choose a product category to start filtering.',
                            action: 'Browse Categories'
                          },
                          {
                            id: 'set-price-range',
                            title: 'Set Price Range',
                            content: 'Use the price slider to set your budget.',
                            action: 'Adjust Price'
                          },
                          {
                            id: 'apply-filters',
                            title: 'Apply Filters',
                            content: 'Click apply to see filtered results.',
                            action: 'Apply Filters'
                          }
                        ]}
                      >
                        <Filter className="w-5 h-5" />
                      </HelpTooltip>
                      Product Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Price Range</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input placeholder="Min" className="w-20" />
                          <span>-</span>
                          <Input placeholder="Max" className="w-20" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Rating</label>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpTooltip
                        title="Seller Dashboard"
                        content="Manage your products, track sales, and analyze performance from your seller dashboard."
                        variant="guided"
                        category="selling"
                        priority="high"
                        showProgress={true}
                        steps={sellerOnboardingSteps}
                      >
                        <BarChart3 className="w-5 h-5" />
                      </HelpTooltip>
                      Seller Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">24</div>
                        <div className="text-sm text-gray-600">Products</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">$1,234</div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'guidance' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Guided User Workflows</h2>
              <p className="text-gray-600 mb-6">
                Step-by-step guidance for common tasks and workflows
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Seller Onboarding */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Seller Onboarding Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sellerOnboardingSteps.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{step.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{step.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">Start Onboarding</Button>
                </CardContent>
              </Card>

              {/* Shopping Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Shopping Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shoppingGuideSteps.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                          <span className="text-xs font-medium text-green-600">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{step.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{step.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">Start Shopping</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeDemo === 'help-center' && (
          <div>
            <HelpCenter />
          </div>
        )}
      </div>
    </div>
  );
}