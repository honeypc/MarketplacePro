import React, { useState, useEffect } from 'react';
import { HelpCircle, X, CheckCircle, ArrowRight, BookOpen, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  action?: string;
  completed?: boolean;
  optional?: boolean;
}

interface GuidanceFlow {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: GuidanceStep[];
  triggers: string[];
  userTypes: string[];
  priority: 'low' | 'medium' | 'high';
}

const guidanceFlows: GuidanceFlow[] = [
  {
    id: 'seller-onboarding',
    title: 'Seller Onboarding Guide',
    description: 'Get started as a seller on our marketplace',
    category: 'onboarding',
    userTypes: ['seller'],
    priority: 'high',
    triggers: ['/seller-dashboard', '/post-product'],
    steps: [
      {
        id: 'profile-setup',
        title: 'Set up your seller profile',
        description: 'Complete your profile information to build trust with customers',
        target: 'profile-section',
        action: 'Go to Profile Settings'
      },
      {
        id: 'first-product',
        title: 'Add your first product',
        description: 'Create a compelling product listing with high-quality images',
        target: 'add-product-btn',
        action: 'Add Product'
      },
      {
        id: 'pricing-strategy',
        title: 'Set competitive pricing',
        description: 'Research competitor prices and set competitive rates',
        target: 'pricing-section',
        action: 'View Pricing Tips'
      },
      {
        id: 'inventory-management',
        title: 'Manage your inventory',
        description: 'Keep track of stock levels and set up low-stock alerts',
        target: 'inventory-section',
        action: 'Configure Inventory'
      }
    ]
  },
  {
    id: 'buyer-shopping',
    title: 'Shopping Guide',
    description: 'Learn how to shop effectively on our platform',
    category: 'shopping',
    userTypes: ['user'],
    priority: 'medium',
    triggers: ['/products', '/product/*'],
    steps: [
      {
        id: 'search-products',
        title: 'Search for products',
        description: 'Use filters and search to find exactly what you need',
        target: 'search-bar',
        action: 'Try searching'
      },
      {
        id: 'compare-products',
        title: 'Compare products',
        description: 'Add items to wishlist to compare features and prices',
        target: 'wishlist-btn',
        action: 'Add to Wishlist'
      },
      {
        id: 'read-reviews',
        title: 'Read customer reviews',
        description: 'Check reviews and ratings before making a purchase',
        target: 'reviews-section',
        action: 'View Reviews'
      },
      {
        id: 'secure-checkout',
        title: 'Complete your purchase',
        description: 'Use our secure checkout process for safe transactions',
        target: 'checkout-btn',
        action: 'Proceed to Checkout'
      }
    ]
  },
  {
    id: 'travel-booking',
    title: 'Travel Booking Guide',
    description: 'Book flights, hotels, and tours with confidence',
    category: 'travel',
    userTypes: ['user', 'traveler'],
    priority: 'high',
    triggers: ['/travel-booking', '/properties', '/popular-destinations'],
    steps: [
      {
        id: 'select-destination',
        title: 'Choose your destination',
        description: 'Browse popular destinations or search for specific locations',
        target: 'destination-search',
        action: 'Search Destinations'
      },
      {
        id: 'book-accommodation',
        title: 'Book accommodation',
        description: 'Find hotels, villas, or homestays that match your preferences',
        target: 'accommodation-filters',
        action: 'Filter Properties'
      },
      {
        id: 'plan-activities',
        title: 'Plan your activities',
        description: 'Book tours, flights, and transportation for your trip',
        target: 'activities-section',
        action: 'Browse Activities'
      },
      {
        id: 'create-itinerary',
        title: 'Create travel itinerary',
        description: 'Organize your trip with our itinerary planner',
        target: 'itinerary-planner',
        action: 'Create Itinerary'
      }
    ]
  },
  {
    id: 'admin-management',
    title: 'Admin Panel Guide',
    description: 'Manage your platform efficiently',
    category: 'administration',
    userTypes: ['admin'],
    priority: 'high',
    triggers: ['/admin'],
    steps: [
      {
        id: 'dashboard-overview',
        title: 'Review system dashboard',
        description: 'Monitor key metrics and system health',
        target: 'dashboard-section',
        action: 'View Dashboard'
      },
      {
        id: 'user-management',
        title: 'Manage users',
        description: 'Handle user accounts, roles, and permissions',
        target: 'users-section',
        action: 'Manage Users'
      },
      {
        id: 'content-moderation',
        title: 'Moderate content',
        description: 'Review and approve products, reviews, and listings',
        target: 'content-section',
        action: 'Review Content'
      },
      {
        id: 'analytics-review',
        title: 'Analyze performance',
        description: 'Use analytics to understand platform performance',
        target: 'analytics-section',
        action: 'View Analytics'
      }
    ]
  }
];

export const GuidanceSystem: React.FC = () => {
  const { user } = useAuth();
  const [location] = useLocation();
  const [activeFlow, setActiveFlow] = useState<GuidanceFlow | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Find relevant guidance flows based on current page and user type
  useEffect(() => {
    if (!user) return;

    const relevantFlows = guidanceFlows.filter(flow => {
      const userTypeMatch = flow.userTypes.includes(user.role || 'user');
      const pageMatch = flow.triggers.some(trigger => {
        if (trigger.includes('*')) {
          const baseRoute = trigger.replace('*', '');
          return location.startsWith(baseRoute);
        }
        return location === trigger;
      });
      return userTypeMatch && pageMatch;
    });

    if (relevantFlows.length > 0) {
      // Sort by priority and select the most relevant one
      const sortedFlows = relevantFlows.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      
      setActiveFlow(sortedFlows[0]);
      setIsVisible(true);
    } else {
      setActiveFlow(null);
      setIsVisible(false);
    }
  }, [location, user]);

  const completeStep = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    // Move to next step
    if (activeFlow && currentStepIndex < activeFlow.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const skipStep = () => {
    if (activeFlow && currentStepIndex < activeFlow.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const dismissGuidance = () => {
    setIsVisible(false);
    setActiveFlow(null);
  };

  const getProgressPercentage = () => {
    if (!activeFlow) return 0;
    return (completedSteps.length / activeFlow.steps.length) * 100;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'onboarding': return <Target className="w-4 h-4" />;
      case 'shopping': return <BookOpen className="w-4 h-4" />;
      case 'travel': return <Zap className="w-4 h-4" />;
      case 'administration': return <HelpCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  if (!isVisible || !activeFlow) return null;

  const currentStep = activeFlow.steps[currentStepIndex];
  const isStepCompleted = completedSteps.includes(currentStep?.id);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-2 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getCategoryIcon(activeFlow.category)}
              <CardTitle className="text-sm font-medium">{activeFlow.title}</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <ArrowRight className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 rotate-90" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissGuidance}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{activeFlow.description}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Step {currentStepIndex + 1} of {activeFlow.steps.length}
              </span>
              <Badge variant="outline" className="text-xs">
                {Math.round(getProgressPercentage())}% Complete
              </Badge>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              {currentStep && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isStepCompleted
                        ? 'bg-green-100 border-green-500'
                        : 'border-blue-500'
                    }`}>
                      {isStepCompleted ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <span className="text-xs font-medium text-blue-600">
                          {currentStepIndex + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{currentStep.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {currentStep.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={skipStep}
                      disabled={currentStepIndex === activeFlow.steps.length - 1}
                    >
                      Skip
                    </Button>
                    <div className="flex gap-2">
                      {currentStep.action && (
                        <Button
                          size="sm"
                          onClick={() => completeStep(currentStep.id)}
                          disabled={isStepCompleted}
                        >
                          {isStepCompleted ? 'Completed' : currentStep.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {completedSteps.length === activeFlow.steps.length && (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Guide Completed!
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Great job! You've completed all steps in this guide.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={dismissGuidance}
                  >
                    Close Guide
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};