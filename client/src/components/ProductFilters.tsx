import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void;
  className?: string;
}

export function ProductFilters({ onFiltersChange, className }: ProductFiltersProps) {
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    applyFilters();
  };

  const handleCategoryToggle = (categoryId: number) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newCategories);
    applyFilters();
  };

  const applyFilters = () => {
    const filters = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      categories: selectedCategories,
      rating: selectedRating,
      location: selectedLocation,
    };
    
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedRating('');
    setSelectedLocation('');
    onFiltersChange({});
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            {t('filters.title')}
          </span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            {t('filters.clearFilters')}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('filters.priceRange')}
          </Label>
          <div className="px-3">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">${priceRange[0]}</span>
              <span className="text-sm text-gray-600">${priceRange[1]}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-20"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
              className="w-20"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('filters.category')}
          </Label>
          <div className="space-y-2">
            {categoriesLoading ? (
              <div className="text-sm text-gray-500">Loading categories...</div>
            ) : (
              safeCategories.map((category: any) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('filters.rating')}
          </Label>
          <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="rating-5" />
              <Label htmlFor="rating-5" className="flex items-center cursor-pointer">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm text-gray-500 ml-1">& up</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="rating-4" />
              <Label htmlFor="rating-4" className="flex items-center cursor-pointer">
                <span className="text-yellow-400">★★★★</span>
                <span className="text-gray-300">☆</span>
                <span className="text-sm text-gray-500 ml-1">& up</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="rating-3" />
              <Label htmlFor="rating-3" className="flex items-center cursor-pointer">
                <span className="text-yellow-400">★★★</span>
                <span className="text-gray-300">☆☆</span>
                <span className="text-sm text-gray-500 ml-1">& up</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Location */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('filters.location')}
          </Label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="eu">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Apply Filters Button */}
        <Button 
          onClick={applyFilters}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          {t('filters.applyFilters')}
        </Button>
      </CardContent>
    </Card>
  );
}
