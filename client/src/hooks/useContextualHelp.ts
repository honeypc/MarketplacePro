import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useLocation } from 'wouter';

interface HelpContext {
  page: string;
  section?: string;
  userType: string;
  isNewUser: boolean;
  hasSeenOnboarding: boolean;
}

interface HelpTip {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  triggers: string[];
  userTypes: string[];
  showOnce?: boolean;
  dismissible?: boolean;
}

const contextualTips: HelpTip[] = [
  {
    id: 'search-filters',
    title: 'Use Advanced Filters',
    content: 'Narrow down your search using price range, categories, and ratings to find exactly what you need.',
    category: 'search',
    priority: 'medium',
    triggers: ['/products', '/properties'],
    userTypes: ['user', 'traveler'],
    showOnce: true
  },
  {
    id: 'seller-pricing',
    title: 'Competitive Pricing Strategy',
    content: 'Research similar products and set competitive prices. Consider offering discounts for bulk purchases.',
    category: 'selling',
    priority: 'high',
    triggers: ['/post-product', '/seller-dashboard'],
    userTypes: ['seller'],
    showOnce: false
  },
  {
    id: 'wishlist-compare',
    title: 'Compare Items in Wishlist',
    content: 'Add items to your wishlist to compare prices, features, and reviews before making a decision.',
    category: 'shopping',
    priority: 'medium',
    triggers: ['/product/*'],
    userTypes: ['user'],
    showOnce: true
  },
  {
    id: 'travel-booking-tips',
    title: 'Book Early for Better Deals',
    content: 'Booking accommodation and flights in advance often results in better prices and availability.',
    category: 'travel',
    priority: 'high',
    triggers: ['/travel-booking', '/properties'],
    userTypes: ['user', 'traveler'],
    showOnce: false
  },
  {
    id: 'admin-bulk-operations',
    title: 'Bulk Operations Available',
    content: 'Select multiple items and perform bulk actions like delete, update status, or export data.',
    category: 'administration',
    priority: 'medium',
    triggers: ['/admin'],
    userTypes: ['admin'],
    showOnce: true
  },
  {
    id: 'inventory-alerts',
    title: 'Set Up Low Stock Alerts',
    content: 'Configure automatic alerts when your inventory runs low to avoid stockouts.',
    category: 'inventory',
    priority: 'high',
    triggers: ['/inventory-management', '/seller-dashboard'],
    userTypes: ['seller'],
    showOnce: true
  },
  {
    id: 'review-importance',
    title: 'Reviews Build Trust',
    content: 'Encourage satisfied customers to leave reviews. Good reviews significantly increase sales.',
    category: 'selling',
    priority: 'high',
    triggers: ['/seller-analytics', '/seller-dashboard'],
    userTypes: ['seller'],
    showOnce: false
  },
  {
    id: 'mobile-optimization',
    title: 'Mobile-Friendly Listings',
    content: 'Ensure your product images and descriptions look great on mobile devices for better reach.',
    category: 'selling',
    priority: 'medium',
    triggers: ['/post-product'],
    userTypes: ['seller'],
    showOnce: true
  }
];

export const useContextualHelp = () => {
  const { user } = useAuth();
  const [location] = useLocation();
  const [shownTips, setShownTips] = useState<string[]>([]);
  const [currentTips, setCurrentTips] = useState<HelpTip[]>([]);
  const [helpContext, setHelpContext] = useState<HelpContext | null>(null);

  // Update help context when user or location changes
  useEffect(() => {
    if (!user) return;

    const context: HelpContext = {
      page: location,
      userType: user.role || 'user',
      isNewUser: checkIfNewUser(user),
      hasSeenOnboarding: checkOnboardingStatus(user)
    };

    setHelpContext(context);
  }, [user, location]);

  // Get relevant tips based on current context
  useEffect(() => {
    if (!helpContext) return;

    const relevantTips = contextualTips.filter(tip => {
      // Check if tip is relevant to current user type
      const userTypeMatch = tip.userTypes.includes(helpContext.userType);
      
      // Check if tip is relevant to current page
      const pageMatch = tip.triggers.some(trigger => {
        if (trigger.includes('*')) {
          const baseRoute = trigger.replace('*', '');
          return helpContext.page.startsWith(baseRoute);
        }
        return helpContext.page === trigger;
      });

      // Check if tip should be shown only once
      const shouldShow = !tip.showOnce || !shownTips.includes(tip.id);

      return userTypeMatch && pageMatch && shouldShow;
    });

    // Sort by priority
    const sortedTips = relevantTips.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    setCurrentTips(sortedTips);
  }, [helpContext, shownTips]);

  const checkIfNewUser = (user: any): boolean => {
    if (!user.createdAt) return true;
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const daysSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 7; // Consider new if registered within last 7 days
  };

  const checkOnboardingStatus = (user: any): boolean => {
    // Check if user has completed onboarding
    return user.onboardingCompleted || false;
  };

  const markTipAsShown = (tipId: string) => {
    setShownTips(prev => [...prev, tipId]);
    
    // Store in localStorage for persistence
    const stored = localStorage.getItem('contextual-help-shown');
    const shownTipsStored = stored ? JSON.parse(stored) : [];
    if (!shownTipsStored.includes(tipId)) {
      shownTipsStored.push(tipId);
      localStorage.setItem('contextual-help-shown', JSON.stringify(shownTipsStored));
    }
  };

  const dismissTip = (tipId: string) => {
    setCurrentTips(prev => prev.filter(tip => tip.id !== tipId));
    markTipAsShown(tipId);
  };

  const getTipsByCategory = (category: string) => {
    return currentTips.filter(tip => tip.category === category);
  };

  const getHighPriorityTips = () => {
    return currentTips.filter(tip => tip.priority === 'high');
  };

  const resetShownTips = () => {
    setShownTips([]);
    localStorage.removeItem('contextual-help-shown');
  };

  // Load shown tips from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('contextual-help-shown');
    if (stored) {
      setShownTips(JSON.parse(stored));
    }
  }, []);

  return {
    currentTips,
    helpContext,
    markTipAsShown,
    dismissTip,
    getTipsByCategory,
    getHighPriorityTips,
    resetShownTips,
    hasActiveTips: currentTips.length > 0
  };
};