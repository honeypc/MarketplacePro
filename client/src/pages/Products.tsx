import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductFilters } from "@/components/ProductFilters";
import { ShoppingCart } from "@/components/ShoppingCart";
import { ProductModal } from "@/components/ProductModal";
import { useTranslation } from "@/lib/i18n";
import { HelpTooltip } from "@/components/help/HelpTooltip";

export default function Products() {
  const { t } = useTranslation();
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
            <HelpTooltip
              title="Product Filters"
              content="Use these filters to narrow down your search. You can filter by category, price range, ratings, and more to find exactly what you're looking for."
              variant="guided"
              category="shopping"
              priority="medium"
              steps={[
                {
                  id: 'select-category',
                  title: 'Select Category',
                  content: 'Choose a product category to filter your search results.',
                  action: 'Browse Categories'
                },
                {
                  id: 'set-price-range',
                  title: 'Set Price Range',
                  content: 'Use the price slider to set your budget range.',
                  action: 'Adjust Price Range'
                },
                {
                  id: 'filter-by-rating',
                  title: 'Filter by Rating',
                  content: 'Select minimum rating to see only highly-rated products.',
                  action: 'Select Rating'
                }
              ]}
            >
              <ProductFilters 
                onFiltersChange={handleFiltersChange}
                className="sticky top-4"
              />
            </HelpTooltip>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <HelpTooltip
              title="Product Grid"
              content="Browse through our extensive product catalog. Click on any product to view detailed information, reviews, and purchase options."
              variant="simple"
              category="shopping"
              priority="low"
            >
              <ProductGrid 
                filters={filters}
                searchQuery={searchQuery}
                categoryId={categoryId}
              />
            </HelpTooltip>
          </div>
        </div>
      </main>

      <ShoppingCart />
      <ProductModal />
    </div>
  );
}
