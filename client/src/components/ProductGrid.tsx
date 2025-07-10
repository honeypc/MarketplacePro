import { useState } from "react";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "./ProductCard";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  filters?: any;
  searchQuery?: string;
  categoryId?: number;
}

export function ProductGrid({ filters, searchQuery, categoryId }: ProductGridProps) {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 24;

  // Build query parameters properly
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.append('search', searchQuery);
  if (categoryId) queryParams.append('categoryId', categoryId.toString());
  if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
  if (filters?.categories?.length) queryParams.append('categories', filters.categories.join(','));
  queryParams.append('limit', itemsPerPage.toString());
  queryParams.append('offset', ((currentPage - 1) * itemsPerPage).toString());
  queryParams.append('sortBy', sortBy);
  queryParams.append('sortOrder', sortOrder);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: [`/api/products?${queryParams.toString()}`],
  });

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleSortChange = (value: string) => {
    const [sortField, order] = value.split('-');
    setSortBy(sortField);
    setSortOrder(order as 'asc' | 'desc');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{t('common.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort and View Options */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600">
              {t('filters.showingResults', { count: products.length })}
            </p>
            
            <div className="flex items-center space-x-4">
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created-desc">{t('filters.newestFirst')}</SelectItem>
                  <SelectItem value="price-asc">{t('filters.priceLowToHigh')}</SelectItem>
                  <SelectItem value="price-desc">{t('filters.priceHighToLow')}</SelectItem>
                  <SelectItem value="rating-desc">{t('filters.customerRating')}</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {isLoading ? (
        <div className={`grid ${viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
        } gap-6`}>
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className={`grid ${viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
        } gap-6`}>
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
            const pageNumber = currentPage <= 3 
              ? index + 1 
              : currentPage >= totalPages - 2 
              ? totalPages - 4 + index 
              : currentPage - 2 + index;
            
            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? 'default' : 'outline'}
                size="icon"
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-500">...</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
