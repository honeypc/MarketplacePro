import React, { useState, useEffect } from 'react';
import { HelpCircle, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/lib/i18n';

interface HelpContent {
  id: string;
  title: string;
  description: string;
  tips?: string[];
  videoUrl?: string;
  relatedTopics?: string[];
}

interface HelpTooltipProps {
  content: HelpContent;
  trigger?: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  showOnHover?: boolean;
  className?: string;
}

export function HelpTooltip({ 
  content, 
  trigger, 
  placement = 'top', 
  size = 'md',
  showOnHover = true,
  className = ''
}: HelpTooltipProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-sm',
    lg: 'max-w-md'
  };

  const defaultTrigger = (
    <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
  );

  const handleNext = () => {
    if (content.tips && currentTip < content.tips.length - 1) {
      setCurrentTip(currentTip + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTip > 0) {
      setCurrentTip(currentTip - 1);
    }
  };

  const tooltipContent = (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="p-3 space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-sm text-gray-900">{content.title}</h4>
          {!showOnHover && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed">
          {content.description}
        </p>

        {content.tips && content.tips.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                💡 Tip {currentTip + 1} of {content.tips.length}
              </Badge>
              {content.tips.length > 1 && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentTip === 0}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentTip === content.tips.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            <p className="text-sm text-blue-700">
              {content.tips[currentTip]}
            </p>
          </div>
        )}

        {content.relatedTopics && content.relatedTopics.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Related help topics:</p>
            <div className="flex flex-wrap gap-1">
              {content.relatedTopics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (showOnHover) {
    return (
      <TooltipProvider>
        <Tooltip open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            {trigger || defaultTrigger}
          </TooltipTrigger>
          <TooltipContent side={placement} className="p-0 bg-white border shadow-lg">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger || defaultTrigger}
      </div>
      {isOpen && (
        <div className={`absolute z-50 mt-2 bg-white border shadow-lg rounded-lg ${sizeClasses[size]}`}>
          {tooltipContent}
        </div>
      )}
    </div>
  );
}

// Predefined help content for common scenarios
export const helpContent = {
  productUpload: {
    id: 'product-upload',
    title: 'Product Image Upload',
    description: 'Upload high-quality images to showcase your product effectively.',
    tips: [
      'Use well-lit, clear photos from multiple angles',
      'Include close-ups of important details or features',
      'Keep backgrounds simple and uncluttered',
      'Maximum 10 images per product, 5MB each'
    ],
    relatedTopics: ['Product Creation', 'Image Guidelines', 'SEO Tips']
  },
  
  productPricing: {
    id: 'product-pricing',
    title: 'Pricing Your Product',
    description: 'Set competitive prices that attract buyers while maintaining profitability.',
    tips: [
      'Research similar products to understand market rates',
      'Consider your costs: materials, time, and platform fees',
      'Use psychological pricing (e.g., $19.99 instead of $20)',
      'Offer discounts for bulk purchases or first-time buyers'
    ],
    relatedTopics: ['Market Research', 'Profit Margins', 'Promotional Strategies']
  },
  
  productDescription: {
    id: 'product-description',
    title: 'Writing Product Descriptions',
    description: 'Create compelling descriptions that inform and persuade potential buyers.',
    tips: [
      'Start with the most important benefits and features',
      'Use bullet points for easy scanning',
      'Include dimensions, materials, and care instructions',
      'Address common questions or concerns'
    ],
    relatedTopics: ['SEO Keywords', 'Product Photography', 'Customer Reviews']
  },
  
  orderManagement: {
    id: 'order-management',
    title: 'Managing Orders',
    description: 'Keep track of your orders and provide excellent customer service.',
    tips: [
      'Process orders quickly to maintain good ratings',
      'Communicate shipping updates to customers',
      'Package items securely to prevent damage',
      'Follow up after delivery to ensure satisfaction'
    ],
    relatedTopics: ['Shipping Options', 'Customer Service', 'Return Policy']
  },
  
  customerReviews: {
    id: 'customer-reviews',
    title: 'Customer Reviews',
    description: 'Encourage and manage customer reviews to build trust and credibility.',
    tips: [
      'Provide excellent service to earn positive reviews',
      'Follow up with customers after purchase',
      'Respond professionally to all reviews',
      'Use feedback to improve your products and service'
    ],
    relatedTopics: ['Customer Service', 'Product Quality', 'Seller Reputation']
  },
  
  marketplaceNavigation: {
    id: 'marketplace-navigation',
    title: 'Navigating the Marketplace',
    description: 'Learn how to efficiently browse and find products in our marketplace.',
    tips: [
      'Use filters to narrow down search results',
      'Check seller ratings and reviews before buying',
      'Compare prices across different sellers',
      'Add items to your wishlist for later purchase'
    ],
    relatedTopics: ['Search Filters', 'Seller Ratings', 'Price Comparison']
  },
  
  accountSafety: {
    id: 'account-safety',
    title: 'Account Safety',
    description: 'Keep your account secure and protect your personal information.',
    tips: [
      'Use a strong, unique password for your account',
      'Enable two-factor authentication if available',
      'Never share your login credentials with others',
      'Be cautious of phishing emails or suspicious links'
    ],
    relatedTopics: ['Password Security', 'Privacy Settings', 'Fraud Prevention']
  }
};

// Hook for dynamic help content based on user context
export function useContextualHelp() {
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);

  useEffect(() => {
    // Load dismissed tips from localStorage
    const dismissed = localStorage.getItem('dismissedHelpTips');
    if (dismissed) {
      setDismissedTips(JSON.parse(dismissed));
    }
  }, []);

  const dismissTip = (tipId: string) => {
    const newDismissed = [...dismissedTips, tipId];
    setDismissedTips(newDismissed);
    localStorage.setItem('dismissedHelpTips', JSON.stringify(newDismissed));
  };

  const isDismissed = (tipId: string) => {
    return dismissedTips.includes(tipId);
  };

  const markProgress = (stepId: string) => {
    setUserProgress(prev => ({ ...prev, [stepId]: true }));
  };

  const getContextualContent = (context: string): HelpContent | null => {
    // Return relevant help content based on current context
    switch (context) {
      case 'product-creation':
        return helpContent.productUpload;
      case 'pricing':
        return helpContent.productPricing;
      case 'description':
        return helpContent.productDescription;
      case 'orders':
        return helpContent.orderManagement;
      case 'reviews':
        return helpContent.customerReviews;
      case 'browsing':
        return helpContent.marketplaceNavigation;
      case 'account':
        return helpContent.accountSafety;
      default:
        return null;
    }
  };

  return {
    userProgress,
    dismissedTips,
    dismissTip,
    isDismissed,
    markProgress,
    getContextualContent
  };
}