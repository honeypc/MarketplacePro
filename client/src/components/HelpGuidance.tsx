import React, { useState, useEffect } from 'react';
import { Lightbulb, X, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';

interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  action?: string;
  completed?: boolean;
  optional?: boolean;
}

interface HelpGuidanceProps {
  context: string;
  steps: GuidanceStep[];
  onStepComplete?: (stepId: string) => void;
  onDismiss?: () => void;
  className?: string;
}

export function HelpGuidance({ 
  context, 
  steps, 
  onStepComplete, 
  onDismiss, 
  className = '' 
}: HelpGuidanceProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const completedCount = steps.filter(step => 
    completedSteps.includes(step.id) || step.completed
  ).length;
  const progress = (completedCount / steps.length) * 100;

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
      onStepComplete?.(stepId);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepCompleted = (stepId: string) => {
    return completedSteps.includes(stepId) || steps.find(s => s.id === stepId)?.completed;
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Help ({completedCount}/{steps.length})
        </Button>
      </div>
    );
  }

  return (
    <Card className={`w-full max-w-md bg-white border-l-4 border-l-blue-500 shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-sm font-semibold text-gray-900">
              Getting Started Guide
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Progress: {completedCount} of {steps.length} completed</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Current Step */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isStepCompleted(steps[currentStep].id)
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {isStepCompleted(steps[currentStep].id) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    currentStep + 1
                  )}
                </div>
                <h4 className="font-semibold text-sm text-gray-900">
                  {steps[currentStep].title}
                </h4>
                {steps[currentStep].optional && (
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                )}
              </div>
              {!isStepCompleted(steps[currentStep].id) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStepComplete(steps[currentStep].id)}
                  className="text-xs"
                >
                  Mark Complete
                </Button>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {steps[currentStep].description}
            </p>
            
            {steps[currentStep].action && (
              <div className="bg-white border border-blue-200 rounded p-2">
                <p className="text-xs text-blue-700 font-medium">
                  💡 {steps[currentStep].action}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : isStepCompleted(steps[index].id)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </Button>
          </div>

          {/* All Steps List */}
          <div className="border-t pt-3">
            <h5 className="text-xs font-semibold text-gray-700 mb-2">All Steps</h5>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                    index === currentStep ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    isStepCompleted(step.id)
                      ? 'bg-green-500'
                      : index === currentStep
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}>
                    {isStepCompleted(step.id) ? (
                      <CheckCircle className="h-3 w-3 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className={`text-xs flex-1 ${
                    isStepCompleted(step.id) ? 'line-through text-gray-500' : 'text-gray-700'
                  }`}>
                    {step.title}
                  </span>
                  {step.optional && (
                    <Badge variant="outline" className="text-xs">
                      Optional
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Predefined guidance flows for different contexts
export const guidanceFlows = {
  newSeller: [
    {
      id: 'setup-profile',
      title: 'Complete Your Profile',
      description: 'Add your personal information and profile picture to build trust with buyers.',
      action: 'Go to Settings > Profile to update your information',
    },
    {
      id: 'add-first-product',
      title: 'Add Your First Product',
      description: 'Create your first product listing with high-quality photos and detailed description.',
      action: 'Click "Add Product" in your seller dashboard',
    },
    {
      id: 'set-competitive-price',
      title: 'Set Competitive Pricing',
      description: 'Research similar products and set prices that attract buyers while maintaining profit.',
      action: 'Use the price comparison tool to research market rates',
    },
    {
      id: 'optimize-listing',
      title: 'Optimize Your Listing',
      description: 'Use relevant keywords in your title and description to improve search visibility.',
      action: 'Include key features and benefits in your product description',
    },
    {
      id: 'setup-shipping',
      title: 'Configure Shipping Options',
      description: 'Set up shipping methods and costs to provide clear delivery information.',
      action: 'Go to Seller Settings > Shipping Options',
      optional: true,
    },
  ],
  
  newBuyer: [
    {
      id: 'browse-products',
      title: 'Browse Products',
      description: 'Explore our marketplace using categories and search filters to find what you need.',
      action: 'Try using the search bar or browse by category',
    },
    {
      id: 'compare-options',
      title: 'Compare Options',
      description: 'Check product details, prices, and seller ratings before making a decision.',
      action: 'Click on products to view detailed information',
    },
    {
      id: 'add-to-cart',
      title: 'Add to Cart',
      description: 'Add items to your cart and review your selections before checkout.',
      action: 'Click "Add to Cart" on products you want to purchase',
    },
    {
      id: 'secure-checkout',
      title: 'Complete Checkout',
      description: 'Provide shipping information and payment details to complete your order.',
      action: 'Review your cart and proceed to checkout',
    },
    {
      id: 'track-order',
      title: 'Track Your Order',
      description: 'Monitor your order status and estimated delivery date.',
      action: 'Check your order history in your account dashboard',
    },
  ],
  
  productCreation: [
    {
      id: 'product-photos',
      title: 'Upload Product Photos',
      description: 'Add high-quality images showing your product from multiple angles.',
      action: 'Drag and drop or click to upload up to 10 images',
    },
    {
      id: 'product-details',
      title: 'Fill Product Details',
      description: 'Provide title, description, price, and category information.',
      action: 'Complete all required fields for better visibility',
    },
    {
      id: 'inventory-management',
      title: 'Set Stock Quantity',
      description: 'Enter the number of items you have available for sale.',
      action: 'Update stock levels to avoid overselling',
    },
    {
      id: 'preview-listing',
      title: 'Preview Your Listing',
      description: 'Review how your product will appear to potential buyers.',
      action: 'Click "Preview" to see your listing before publishing',
    },
  ],
};

// Hook for managing guidance state
export function useGuidanceFlow(context: string) {
  const [isVisible, setIsVisible] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [dismissedFlows, setDismissedFlows] = useState<string[]>([]);

  useEffect(() => {
    const dismissed = localStorage.getItem('dismissedGuidanceFlows');
    if (dismissed) {
      setDismissedFlows(JSON.parse(dismissed));
    }
    
    const completed = localStorage.getItem(`guidanceSteps_${context}`);
    if (completed) {
      setCompletedSteps(JSON.parse(completed));
    }
  }, [context]);

  const showGuidance = () => {
    if (!dismissedFlows.includes(context)) {
      setIsVisible(true);
    }
  };

  const hideGuidance = () => {
    setIsVisible(false);
  };

  const dismissFlow = () => {
    const newDismissed = [...dismissedFlows, context];
    setDismissedFlows(newDismissed);
    localStorage.setItem('dismissedGuidanceFlows', JSON.stringify(newDismissed));
    setIsVisible(false);
  };

  const completeStep = (stepId: string) => {
    const newCompleted = [...completedSteps, stepId];
    setCompletedSteps(newCompleted);
    localStorage.setItem(`guidanceSteps_${context}`, JSON.stringify(newCompleted));
  };

  return {
    isVisible,
    completedSteps,
    showGuidance,
    hideGuidance,
    dismissFlow,
    completeStep,
    isDismissed: dismissedFlows.includes(context),
  };
}