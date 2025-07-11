import React from 'react';
import { useMobile } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestHooks() {
  const isMobile = useMobile();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Hooks Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span>Mobile Device:</span>
              <Badge variant={isMobile ? "default" : "secondary"}>
                {isMobile ? "Mobile" : "Desktop"}
              </Badge>
            </div>
            <Button>Test Button</Button>
            <p>If you can see this page, the hooks are working correctly!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}