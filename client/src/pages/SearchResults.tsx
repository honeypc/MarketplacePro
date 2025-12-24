import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PropertyCard } from "@/components/PropertyCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, ShoppingBag, Ticket } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/lib/i18n";
import type { Product, Property, TourDetail } from "@shared/schema";

interface SearchResponse {
  query: string;
  products: Product[];
  properties: Property[];
  tours: TourDetail[];
}

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const { searchQuery, setSearchQuery } = useStore();
  const { t } = useTranslation();

  const queryFromUrl = useMemo(() => new URLSearchParams(window.location.search).get("q") || "", [
    window.location.search
  ]);
  const [localQuery, setLocalQuery] = useState(queryFromUrl || searchQuery);

  useEffect(() => {
    setLocalQuery(queryFromUrl || searchQuery);
    if (queryFromUrl && queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl);
    }
  }, [queryFromUrl, searchQuery, setSearchQuery]);

  const activeQuery = (queryFromUrl || searchQuery || "").trim();

  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: [`/api/search?q=${encodeURIComponent(activeQuery)}`],
    enabled: !!activeQuery,
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = localQuery.trim();
    if (!trimmed) return;
    setSearchQuery(trimmed);
    setLocation(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const products = data?.products || [];
  const properties = data?.properties || [];
  const tours = data?.tours || [];
  const hasResults = products.length + properties.length + tours.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">{t("common.search", "Search")}</p>
            <h1 className="text-3xl font-bold text-gray-900">{t('common.searchResults', 'Search Results')}</h1>
            <p className="text-gray-600 mt-2">
              {activeQuery
                ? `${t('common.showingResultsFor', 'Showing results for')} "${activeQuery}"`
                : t('common.searchAcrossMarketplace', 'Search across products, stays, and trips')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">{/* Search input */}
            <div className="relative max-w-2xl">
              <Input
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder={t('header.searchPlaceholder') || 'Search for anything...'}
                className="pl-10 pr-24 h-12 rounded-2xl shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl">
                {t('common.search') || 'Search'}
              </Button>
            </div>
          </form>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              {t('common.error', 'Something went wrong while searching.')}
            </div>
          )}

          {!activeQuery && (
            <Card>
              <CardContent className="py-6 text-gray-600">
                {t('common.startTypingToSearch', 'Start typing to search across MarketplacePro.')}
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                {t('common.loading', 'Loading results...')}
              </CardContent>
            </Card>
          )}
        </div>

        {hasResults && (
          <div className="grid gap-6">
            <SummaryRow
              products={products.length}
              properties={properties.length}
              tours={tours.length}
            />

            {products.length > 0 && (
              <Section
                title={t('header.products', 'Products')}
                icon={<ShoppingBag className="h-5 w-5" />}
                badgeLabel={products.length}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={`product-${product.id}`} product={product} />
                  ))}
                </div>
              </Section>
            )}

            {properties.length > 0 && (
              <Section
                title={t('header.accommodation', 'Accommodation')}
                icon={<Home className="h-5 w-5" />}
                badgeLabel={properties.length}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={`property-${property.id}`} property={property as any} />
                  ))}
                </div>
              </Section>
            )}

            {tours.length > 0 && (
              <Section
                title={t('header.travel', 'Travel & Tours')}
                icon={<Ticket className="h-5 w-5" />}
                badgeLabel={tours.length}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tours.map((tour) => (
                    <Card key={`tour-${tour.id}`} className="h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{tour.title}</CardTitle>
                          {tour.location && <Badge variant="secondary">{tour.location}</Badge>}
                        </div>
                        {tour.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{tour.description}</p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-gray-700">
                        {tour.duration && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{t('common.duration', 'Duration')}:</span>
                            <span>{tour.duration}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{t('common.from', 'From')}:</span>
                          <span className="text-primary font-semibold">${Number(tour.basePrice).toFixed(2)}</span>
                        </div>
                        {tour.tags?.length ? (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {tour.tags.map((tag) => (
                              <Badge key={tag} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}

        {!isLoading && activeQuery && !hasResults && (
          <Card>
            <CardContent className="py-10 text-center text-gray-600">
              {t('common.noResultsFound', 'No results matched your search. Try another keyword.')}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

interface SummaryRowProps {
  products: number;
  properties: number;
  tours: number;
}

function SummaryRow({ products, properties, tours }: SummaryRowProps) {
  const total = products + properties + tours;
  return (
    <Card className="bg-white">
      <CardContent className="py-4">
        <div className="flex flex-wrap gap-3 items-center">
          <p className="text-sm text-gray-600">{total} total matches</p>
          <Badge variant="secondary">{products} products</Badge>
          <Badge variant="secondary">{properties} stays</Badge>
          <Badge variant="secondary">{tours} tours</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface SectionProps {
  title: string;
  icon: ReactNode;
  badgeLabel?: string | number;
  children: ReactNode;
}

function Section({ title, icon, badgeLabel, children }: SectionProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        {badgeLabel !== undefined && (
          <Badge variant="secondary" className="text-sm px-3 py-1 rounded-full">
            {badgeLabel}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
