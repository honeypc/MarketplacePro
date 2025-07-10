import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Heart, User, Menu, Settings as SettingsIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSelector } from "@/components/ui/language-selector";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { 
    cartCount, 
    wishlistCount, 
    toggleCart, 
    searchQuery, 
    setSearchQuery 
  } = useStore();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: t('header.allCategories'), href: '/products' },
    { name: t('header.electronics'), href: '/products?category=electronics' },
    { name: t('header.fashion'), href: '/products?category=fashion' },
    { name: t('header.homeGarden'), href: '/products?category=home-garden' },
    { name: t('header.sports'), href: '/products?category=sports' },
    { name: t('header.books'), href: '/products?category=books' },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary dark:text-white">MarketPlace Pro</h1>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Button
                type="submit"
                className="absolute inset-y-0 right-0 px-4 bg-primary hover:bg-primary/90 text-white rounded-r-lg"
              >
                {t('common.search')}
              </Button>
            </form>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Theme Selector */}
            <ThemeSelector />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/sell" className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Sell
              </Link>
              
              <Link href="/wishlist" className="flex items-center text-gray-700 hover:text-primary transition-colors">
                <Heart className="h-5 w-5" />
                <span className="ml-1">{t('header.wishlist')}</span>
                {wishlistCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>

              <Button
                variant="ghost"
                onClick={toggleCart}
                className="flex items-center text-gray-700 hover:text-primary transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="ml-1">{t('header.cart')}</span>
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link href="/profile" className="flex items-center text-gray-700 hover:text-primary transition-colors">
                    <User className="h-5 w-5" />
                    <span className="ml-1">{t('header.profile')}</span>
                  </Link>
                  <Link href="/dashboard" className="flex items-center text-gray-700 hover:text-primary transition-colors">
                    <span className="ml-1">{t('header.dashboard')}</span>
                  </Link>
                  <Link href="/seller" className="flex items-center text-gray-700 hover:text-primary transition-colors">
                    <span className="ml-1">{t('header.sellOnMarketplace')}</span>
                  </Link>
                  <Link href="/inventory" className="flex items-center text-gray-700 hover:text-primary transition-colors">
                    <span className="ml-1">Inventory</span>
                  </Link>
                  <Link href="/settings" className="flex items-center text-gray-700 hover:text-primary transition-colors">
                    <SettingsIcon className="h-5 w-5" />
                    <span className="ml-1">{t('header.settings')}</span>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => window.location.href = '/api/logout'}
                    className="text-gray-700 hover:text-primary"
                  >
                    {t('header.logout')}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder={t('header.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </form>

                  {/* Mobile Navigation Links */}
                  <Link href="/wishlist" className="flex items-center space-x-2 py-2">
                    <Heart className="h-5 w-5" />
                    <span>{t('header.wishlist')}</span>
                    {wishlistCount > 0 && (
                      <Badge variant="destructive">{wishlistCount}</Badge>
                    )}
                  </Link>

                  <Button
                    variant="ghost"
                    onClick={toggleCart}
                    className="flex items-center space-x-2 py-2 justify-start"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>{t('header.cart')}</span>
                    {cartCount > 0 && (
                      <Badge variant="destructive">{cartCount}</Badge>
                    )}
                  </Button>

                  {isAuthenticated ? (
                    <>
                      <Link href="/dashboard" className="flex items-center space-x-2 py-2">
                        <User className="h-5 w-5" />
                        <span>{t('header.account')}</span>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => window.location.href = '/api/logout'}
                        className="justify-start"
                      >
                        {t('header.logout')}
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/auth">
                        <Button variant="ghost" className="w-full justify-start">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className="border-t border-gray-200 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8 overflow-x-auto">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-700 hover:text-primary transition-colors font-medium whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <Link
              href="/dashboard"
              className="text-primary hover:text-primary/80 font-medium whitespace-nowrap"
            >
              {t('header.sellOnMarketplace')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
