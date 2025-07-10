import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

interface HelpStep {
  id: string;
  title: string;
  description: string;
  element?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'auto';
  delay?: number;
  priority?: 'low' | 'medium' | 'high';
  conditions?: {
    isNewUser?: boolean;
    hasCompletedSteps?: string[];
    isOnPage?: string;
  };
}

interface ContextualHelpState {
  activeHelp: string | null;
  completedSteps: string[];
  dismissedHelp: string[];
  userProgress: Record<string, number>;
  showGuidance: boolean;
}

const HELP_FLOWS = {
  'new-seller-onboarding': {
    id: 'new-seller-onboarding',
    title: 'Welcome to Selling!',
    description: 'Let us guide you through creating your first product listing',
    steps: [
      {
        id: 'welcome-greeting',
        title: 'Welcome to MarketPlace Pro!',
        description: 'You\'re about to create your first product listing. We\'ll guide you through each step.',
        trigger: 'auto',
        priority: 'high'
      },
      {
        id: 'product-title-help',
        title: 'Write a Great Title',
        description: 'Your title is the first thing buyers see. Make it descriptive and searchable.',
        element: '[data-help="product-title"]',
        position: 'bottom',
        trigger: 'hover',
        priority: 'high'
      },
      {
        id: 'category-selection-help',
        title: 'Choose the Right Category',
        description: 'Selecting the correct category helps buyers find your product.',
        element: '[data-help="category-select"]',
        position: 'right',
        trigger: 'click',
        priority: 'medium'
      },
      {
        id: 'image-upload-help',
        title: 'Add High-Quality Photos',
        description: 'Great photos increase your chances of selling. Upload multiple angles.',
        element: '[data-help="image-upload"]',
        position: 'top',
        trigger: 'hover',
        priority: 'high'
      },
      {
        id: 'pricing-help',
        title: 'Set Your Price',
        description: 'Research similar items to price competitively.',
        element: '[data-help="pricing"]',
        position: 'left',
        trigger: 'click',
        priority: 'high'
      },
      {
        id: 'shipping-help',
        title: 'Configure Shipping',
        description: 'Clear shipping options build buyer confidence.',
        element: '[data-help="shipping"]',
        position: 'bottom',
        trigger: 'hover',
        priority: 'medium'
      }
    ]
  },
  'inventory-management': {
    id: 'inventory-management',
    title: 'Manage Your Inventory',
    description: 'Learn how to track and manage your product inventory effectively',
    steps: [
      {
        id: 'inventory-overview',
        title: 'Inventory Dashboard',
        description: 'Monitor your stock levels and get alerts for low inventory.',
        trigger: 'auto',
        priority: 'medium'
      },
      {
        id: 'low-stock-alerts',
        title: 'Low Stock Alerts',
        description: 'Set up alerts to know when to restock popular items.',
        element: '[data-help="low-stock"]',
        position: 'right',
        trigger: 'hover',
        priority: 'medium'
      },
      {
        id: 'bulk-operations',
        title: 'Bulk Operations',
        description: 'Update multiple products at once to save time.',
        element: '[data-help="bulk-update"]',
        position: 'top',
        trigger: 'click',
        priority: 'low'
      }
    ]
  },
  'buyer-experience': {
    id: 'buyer-experience',
    title: 'Shopping Guide',
    description: 'Learn how to find and purchase the best products',
    steps: [
      {
        id: 'search-filters',
        title: 'Use Search Filters',
        description: 'Narrow down results to find exactly what you need.',
        element: '[data-help="filters"]',
        position: 'right',
        trigger: 'hover',
        priority: 'medium'
      },
      {
        id: 'product-comparison',
        title: 'Compare Products',
        description: 'Add items to your wishlist to compare features and prices.',
        element: '[data-help="wishlist"]',
        position: 'bottom',
        trigger: 'click',
        priority: 'low'
      },
      {
        id: 'seller-ratings',
        title: 'Check Seller Ratings',
        description: 'Look at seller ratings and reviews before making a purchase.',
        element: '[data-help="seller-rating"]',
        position: 'top',
        trigger: 'hover',
        priority: 'high'
      }
    ]
  }
};

export function useContextualHelpSystem() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [helpState, setHelpState] = useState<ContextualHelpState>({
    activeHelp: null,
    completedSteps: [],
    dismissedHelp: [],
    userProgress: {},
    showGuidance: false
  });

  // Load help state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('contextual-help-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setHelpState(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse saved help state:', error);
      }
    }
  }, []);

  // Save help state to localStorage
  const saveHelpState = useCallback((newState: Partial<ContextualHelpState>) => {
    const updatedState = { ...helpState, ...newState };
    setHelpState(updatedState);
    localStorage.setItem('contextual-help-state', JSON.stringify(updatedState));
  }, [helpState]);

  // Determine which help flow to show based on context
  const getContextualFlow = useCallback(() => {
    if (!isAuthenticated) return null;

    const path = location;
    const isNewUser = user && !helpState.completedSteps.includes('new-seller-onboarding');

    // Seller contexts
    if (path === '/sell' && isNewUser) {
      return HELP_FLOWS['new-seller-onboarding'];
    }
    
    if (path === '/inventory') {
      return HELP_FLOWS['inventory-management'];
    }

    // Buyer contexts
    if (path === '/' || path.startsWith('/products')) {
      return HELP_FLOWS['buyer-experience'];
    }

    return null;
  }, [location, user, isAuthenticated, helpState.completedSteps]);

  // Show contextual help for current page
  const showContextualHelp = useCallback(() => {
    const flow = getContextualFlow();
    if (flow && !helpState.dismissedHelp.includes(flow.id)) {
      saveHelpState({ activeHelp: flow.id, showGuidance: true });
    }
  }, [getContextualFlow, helpState.dismissedHelp, saveHelpState]);

  // Complete a help step
  const completeStep = useCallback((stepId: string) => {
    const newCompletedSteps = [...helpState.completedSteps, stepId];
    saveHelpState({ completedSteps: newCompletedSteps });
  }, [helpState.completedSteps, saveHelpState]);

  // Dismiss help flow
  const dismissHelp = useCallback((helpId: string) => {
    const newDismissedHelp = [...helpState.dismissedHelp, helpId];
    saveHelpState({ 
      dismissedHelp: newDismissedHelp, 
      activeHelp: null, 
      showGuidance: false 
    });
  }, [helpState.dismissedHelp, saveHelpState]);

  // Update user progress
  const updateProgress = useCallback((context: string, progress: number) => {
    const newProgress = { ...helpState.userProgress, [context]: progress };
    saveHelpState({ userProgress: newProgress });
  }, [helpState.userProgress, saveHelpState]);

  // Get help step by ID
  const getHelpStep = useCallback((stepId: string): HelpStep | null => {
    for (const flow of Object.values(HELP_FLOWS)) {
      const step = flow.steps.find(s => s.id === stepId);
      if (step) return step;
    }
    return null;
  }, []);

  // Check if help should be shown automatically
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && helpState.showGuidance === false) {
        showContextualHelp();
      }
    }, 1000); // Show help after 1 second

    return () => clearTimeout(timer);
  }, [location, isAuthenticated, showContextualHelp, helpState.showGuidance]);

  // Get current active flow
  const activeFlow = helpState.activeHelp ? HELP_FLOWS[helpState.activeHelp as keyof typeof HELP_FLOWS] : null;

  // Get next suggested step
  const getNextStep = useCallback(() => {
    if (!activeFlow) return null;
    
    const uncompletedSteps = activeFlow.steps.filter(
      step => !helpState.completedSteps.includes(step.id)
    );
    
    return uncompletedSteps.length > 0 ? uncompletedSteps[0] : null;
  }, [activeFlow, helpState.completedSteps]);

  // Get progress percentage for current flow
  const getFlowProgress = useCallback(() => {
    if (!activeFlow) return 0;
    
    const completedInFlow = activeFlow.steps.filter(
      step => helpState.completedSteps.includes(step.id)
    ).length;
    
    return (completedInFlow / activeFlow.steps.length) * 100;
  }, [activeFlow, helpState.completedSteps]);

  return {
    // State
    helpState,
    activeFlow,
    
    // Actions
    showContextualHelp,
    completeStep,
    dismissHelp,
    updateProgress,
    
    // Getters
    getHelpStep,
    getNextStep,
    getFlowProgress,
    getContextualFlow,
    
    // Utils
    isStepCompleted: (stepId: string) => helpState.completedSteps.includes(stepId),
    isHelpDismissed: (helpId: string) => helpState.dismissedHelp.includes(helpId),
    shouldShowHelp: () => helpState.showGuidance && activeFlow !== null,
  };
}