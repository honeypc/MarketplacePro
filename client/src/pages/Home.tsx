import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ProductGrid } from "@/components/ProductGrid";
import { ShoppingCart } from "@/components/ShoppingCart";
import { RecommendedProducts, RecommendedProperties, RecommendedDestinations } from "@/components/RecommendationWidget";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back!
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing products from our marketplace
          </p>
        </div>

        {/* Personalized Recommendations */}
        <div className="space-y-8 mb-12">
          <RecommendedProducts title="Just for You" limit={4} />
          <RecommendedProperties title="Your Perfect Stay" limit={4} />
          <RecommendedDestinations title="Explore Amazing Places" limit={5} />
        </div>

        <ProductGrid />
      </main>

      <ShoppingCart />
    </div>
  );
}
