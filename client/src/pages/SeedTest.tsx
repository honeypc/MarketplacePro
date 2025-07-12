import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, CheckCircle } from 'lucide-react';

export default function SeedTest() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSeedProperties = async () => {
    setIsSeeding(true);
    try {
      const response = await apiRequest('POST', '/api/seed/properties', {});
      const result = await response.json();
      setSeedResult(result);
      toast({
        title: 'Seeding Successful!',
        description: `Created ${result.data.propertyCount} properties and ${result.data.bookingCount} bookings`,
      });
    } catch (error: any) {
      console.error('Seeding error:', error);
      toast({
        title: 'Seeding Failed',
        description: error.message || 'Failed to seed properties and bookings',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Database Seeding Test</h1>
        <p className="text-gray-600">Test the seeding of properties and bookings data</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Seed Properties & Bookings
          </CardTitle>
          <CardDescription>
            This will create sample properties and bookings in the database. Only works in development mode.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSeedProperties}
            disabled={isSeeding}
            className="w-full"
          >
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Data...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Seed Properties & Bookings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {seedResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Seeding Completed Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Properties Created:</strong> {seedResult.data.propertyCount}</p>
              <p><strong>Bookings Created:</strong> {seedResult.data.bookingCount}</p>
              <p><strong>Message:</strong> {seedResult.message}</p>
              
              {seedResult.data.properties && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Sample Properties:</h4>
                  <div className="space-y-1">
                    {seedResult.data.properties.map((property: any) => (
                      <div key={property.id} className="text-xs bg-white p-2 rounded border">
                        <p><strong>{property.title}</strong> - {property.city}</p>
                        <p>Price: ${property.pricePerNight}/night | Rating: {property.rating}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}