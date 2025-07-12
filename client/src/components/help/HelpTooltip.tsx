import React, { useState } from 'react';
import { HelpCircle, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HelpStep {
  id: string;
  title: string;
  content: string;
  action?: string;
  nextStepId?: string;
  prevStepId?: string;
}

interface HelpTooltipProps {
  title: string;
  content: string;
  steps?: HelpStep[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'simple' | 'guided' | 'interactive';
  showProgress?: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  children: React.ReactNode;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  title,
  content,
  steps = [],
  position = 'top',
  variant = 'simple',
  showProgress = false,
  category,
  priority = 'medium',
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentStep = steps[currentStepIndex];
  const hasMultipleSteps = steps.length > 1;

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderSimpleTooltip = () => (
    <TooltipContent side={position} className="max-w-xs">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{title}</h4>
          {category && (
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{content}</p>
      </div>
    </TooltipContent>
  );

  const renderGuidedTooltip = () => (
    <TooltipContent side={position} className="max-w-md p-0">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="flex items-center gap-2">
              {category && (
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
              )}
              <Badge className={`text-xs ${getPriorityColor(priority)}`}>
                {priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{content}</p>
            
            {hasMultipleSteps && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  {showProgress && (
                    <div className="flex gap-1">
                      {steps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentStepIndex ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {currentStep && (
                  <div className="border rounded-lg p-3 bg-blue-50">
                    <h5 className="font-medium text-sm mb-1">{currentStep.title}</h5>
                    <p className="text-xs text-muted-foreground mb-2">{currentStep.content}</p>
                    {currentStep.action && (
                      <Badge variant="secondary" className="text-xs">
                        {currentStep.action}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    disabled={currentStepIndex === 0}
                  >
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextStep}
                    disabled={currentStepIndex === steps.length - 1}
                  >
                    Next
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipContent>
  );

  const renderInteractiveTooltip = () => (
    <div className="relative">
      {isExpanded && (
        <div className="absolute z-50 -top-2 -right-2 bg-white border rounded-lg shadow-lg p-4 w-80">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">{title}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{content}</p>
            
            {hasMultipleSteps && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Interactive Guide
                  </span>
                  <Badge className={`text-xs ${getPriorityColor(priority)}`}>
                    {priority}
                  </Badge>
                </div>
                
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        index === currentStepIndex
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentStepIndex(index)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          index === currentStepIndex ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <span className="text-sm font-medium">{step.title}</span>
                      </div>
                      {index === currentStepIndex && (
                        <p className="text-xs text-muted-foreground mt-1 ml-4">
                          {step.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <div className="relative inline-flex">
            {children}
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 hover:bg-blue-100"
              onClick={(e) => {
                e.stopPropagation();
                if (variant === 'interactive') {
                  setIsExpanded(!isExpanded);
                } else {
                  setIsOpen(!isOpen);
                }
              }}
            >
              <HelpCircle className="w-3 h-3 text-blue-600" />
            </Button>
          </div>
        </TooltipTrigger>
        
        {variant === 'simple' && renderSimpleTooltip()}
        {variant === 'guided' && renderGuidedTooltip()}
      </Tooltip>
      
      {variant === 'interactive' && renderInteractiveTooltip()}
    </TooltipProvider>
  );
};