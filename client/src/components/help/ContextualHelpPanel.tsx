import React, { useState } from 'react';
import { HelpCircle, X, Lightbulb, ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useContextualHelp } from '@/hooks/useContextualHelp';

export const ContextualHelpPanel: React.FC = () => {
  const {
    currentTips,
    dismissTip,
    getTipsByCategory,
    getHighPriorityTips,
    hasActiveTips
  } = useContextualHelp();

  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  if (!hasActiveTips) return null;

  const categories = [...new Set(currentTips.map(tip => tip.category))];
  const highPriorityTips = getHighPriorityTips();

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low': return <HelpCircle className="w-4 h-4 text-blue-500" />;
      default: return <HelpCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'search': return '🔍';
      case 'selling': return '💰';
      case 'shopping': return '🛒';
      case 'travel': return '✈️';
      case 'administration': return '⚙️';
      case 'inventory': return '📦';
      default: return '💡';
    }
  };

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="fixed top-20 right-4 z-40 w-80">
      <Card className="shadow-lg border-2 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-sm font-medium">
                Helpful Tips
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {currentTips.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* High Priority Tips */}
              {highPriorityTips.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-700">
                      Important Tips
                    </span>
                  </div>
                  {highPriorityTips.map(tip => (
                    <div key={tip.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-red-800">{tip.title}</h4>
                          <p className="text-xs text-red-600 mt-1">{tip.content}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissTip(tip.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tips by Category */}
              <div className="space-y-3">
                {categories.map(category => {
                  const categoryTips = getTipsByCategory(category);
                  const isExpanded = expandedCategories.includes(category);
                  
                  return (
                    <div key={category} className="space-y-2">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getCategoryIcon(category)}</span>
                          <span className="text-sm font-medium">{formatCategoryName(category)}</span>
                          <Badge variant="outline" className="text-xs">
                            {categoryTips.length}
                          </Badge>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="space-y-2 ml-4">
                          {categoryTips.map(tip => (
                            <div key={tip.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {getPriorityIcon(tip.priority)}
                                    <h4 className="font-medium text-sm text-blue-800">{tip.title}</h4>
                                  </div>
                                  <p className="text-xs text-blue-600">{tip.content}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => dismissTip(tip.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {currentTips.length} tips available
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => currentTips.forEach(tip => dismissTip(tip.id))}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Dismiss All
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};