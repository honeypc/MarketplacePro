import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductFilters } from "@/components/ProductFilters";
import { ShoppingCart } from "@/components/ShoppingCart";
import { ProductModal } from "@/components/ProductModal";
import { useI18n } from "@/lib/i18n";

export default function Products() {
  const { t } = useI18n();
  const [location] = useLocation();
  const [filters, setFilters] = useState({});
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search') || '';
  const categoryParam = urlParams.get('category');
  const categoryId = categoryParam ? parseInt(categoryParam) : undefined;

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            Discover amazing products from our marketplace
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters 
              onFiltersChange={handleFiltersChange}
              className="sticky top-4"
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid 
              filters={filters}
              searchQuery={searchQuery}
              categoryId={categoryId}
            />
          </div>
        </div>
      </main>

      <ShoppingCart />
      <ProductModal />
    </div>
  );
}
