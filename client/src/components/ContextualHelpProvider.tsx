import React, { createContext, useContext, useEffect, useState } from 'react';
import { useContextualHelpSystem } from '@/hooks/useContextualHelpSystem';
import { HelpGuidance } from '@/components/HelpGuidance';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'wouter';

interface ContextualHelpContextType {
  showHelp: (helpId: string) => void;
  hideHelp: () => void;
  completeStep: (stepId: string) => void;
  isStepCompleted: (stepId: string) => boolean;
  markElement: (element: string, helpId: string) => void;
}

const ContextualHelpContext = createContext<ContextualHelpContextType | null>(null);

export function useContextualHelp() {
  const context = useContext(ContextualHelpContext);
  if (!context) {
    throw new Error('useContextualHelp must be used within ContextualHelpProvider');
  }
  return context;
}

interface ContextualHelpProviderProps {
  children: React.ReactNode;
}

export function ContextualHelpProvider({ children }: ContextualHelpProviderProps) {
  const [location] = useLocation();
  const {
    helpState,
    activeFlow,
    showContextualHelp,
    completeStep,
    dismissHelp,
    getNextStep,
    getFlowProgress,
    isStepCompleted,
    shouldShowHelp
  } = useContextualHelpSystem();

  const [markedElements, setMarkedElements] = useState<Record<string, string>>({});

  // Add help indicators to marked elements
  useEffect(() => {
    Object.entries(markedElements).forEach(([selector, helpId]) => {
      const element = document.querySelector(selector);
      if (element && !element.hasAttribute('data-help-marked')) {
        element.setAttribute('data-help-marked', 'true');
        element.classList.add('relative');
        
        // Add help indicator
        const indicator = document.createElement('div');
        indicator.className = 'absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse pointer-events-none z-10';
        indicator.setAttribute('data-help-indicator', helpId);
        element.appendChild(indicator);
      }
    });

    // Cleanup function
    return () => {
      document.querySelectorAll('[data-help-indicator]').forEach(indicator => {
        indicator.remove();
      });
      document.querySelectorAll('[data-help-marked]').forEach(element => {
        element.removeAttribute('data-help-marked');
      });
    };
  }, [markedElements, location]);

  const contextValue: ContextualHelpContextType = {
    showHelp: showContextualHelp,
    hideHelp: () => {
      if (activeFlow) {
        dismissHelp(activeFlow.id);
      }
    },
    completeStep,
    isStepCompleted,
    markElement: (element: string, helpId: string) => {
      setMarkedElements(prev => ({ ...prev, [element]: helpId }));
    }
  };

  const nextStep = getNextStep();
  const progress = getFlowProgress();

  return (
    <ContextualHelpContext.Provider value={contextValue}>
      {children}
      
      <AnimatePresence>
        {shouldShowHelp() && activeFlow && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm"
          >
            <HelpGuidance
              context={activeFlow.id}
              steps={activeFlow.steps.map(step => ({
                id: step.id,
                title: step.title,
                description: step.description,
                completed: isStepCompleted(step.id),
                optional: step.priority === 'low'
              }))}
              onStepComplete={completeStep}
              onDismiss={() => dismissHelp(activeFlow.id)}
              className="shadow-2xl border-2 border-blue-200"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contextual tooltips that appear on element hover/click */}
      <AnimatePresence>
        {nextStep && nextStep.element && nextStep.trigger === 'hover' && (
          <ContextualTooltip
            step={nextStep}
            onComplete={() => completeStep(nextStep.id)}
          />
        )}
      </AnimatePresence>
    </ContextualHelpContext.Provider>
  );
}

interface ContextualTooltipProps {
  step: any;
  onComplete: () => void;
}

function ContextualTooltip({ step, onComplete }: ContextualTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const element = document.querySelector(step.element);
    if (!element) return;

    const handleMouseEnter = () => {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      let top = rect.top + scrollTop;
      let left = rect.left + scrollLeft;

      // Adjust position based on step.position
      switch (step.position) {
        case 'top':
          top -= 100;
          left += rect.width / 2;
          break;
        case 'bottom':
          top += rect.height + 10;
          left += rect.width / 2;
          break;
        case 'left':
          top += rect.height / 2;
          left -= 250;
          break;
        case 'right':
          top += rect.height / 2;
          left += rect.width + 10;
          break;
      }

      setPosition({ top, left });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [step]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs"
      style={{ top: position.top, left: position.left }}
    >
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-gray-900">{step.title}</h4>
        <p className="text-sm text-gray-600">{step.description}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsVisible(false)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              onComplete();
              setIsVisible(false);
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Got it!
          </button>
        </div>
      </div>
    </motion.div>
  );
}