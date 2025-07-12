import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Heart, User, Menu, Settings as SettingsIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSelector } from "@/components/ui/language-selector";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { useTranslation } from "@/lib/i18n";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
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

  const mainNavigation = [
    { name: 'Sản phẩm', href: '/products' },
    { name: 'Chỗ ở', href: '/properties' },
    { name: 'Du lịch', href: '/travel' },
    { name: 'Bán hàng', href: '/sell' },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MarketPlace Pro
              </h1>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Button
                type="submit"
                className="absolute inset-y-0 right-0 px-4 bg-primary hover:bg-primary/90 text-white rounded-r-lg transition-all duration-200"
              >
                {t('common.search')}
              </Button>
            </form>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {mainNavigation.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.href === '/sell' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.href === '/sell' && <Plus className="h-4 w-4 mr-1 inline" />}
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-3">{/* Additional Actions */}
              
              <Link href="/wishlist" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-all duration-200 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Heart className="h-4 w-4" />
                <span className="ml-1 hidden xl:inline">{t('header.wishlist')}</span>
                {wishlistCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>

              <Button
                variant="ghost"
                onClick={toggleCart}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-all duration-200 relative px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="ml-1 hidden xl:inline">{t('header.cart')}</span>
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu - Simplified for mobile */}
              {isAuthenticated ? (
                <div className="hidden lg:flex items-center space-x-2">
                  <Link href="/profile" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-all duration-200 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <User className="h-4 w-4" />
                    <span className="ml-1 hidden xl:inline">{t('header.profile')}</span>
                  </Link>
                  <Link href="/dashboard" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-all duration-200 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="text-sm">{t('header.dashboard')}</span>
                  </Link>
                  <Link href="/seller" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-all duration-200 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="text-sm">{t('header.sellOnMarketplace')}</span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/support" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary transition-all duration-200 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <span className="text-sm">Support</span>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => window.location.href = '/api/logout'}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary text-sm px-2 py-1"
                  >
                    {t('header.logout')}
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
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
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <nav className="flex flex-col space-y-4">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative mb-6">
                    <Input
                      type="text"
                      placeholder={t('header.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </form>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-3">
                    {mainNavigation.map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                          item.href === '/sell' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg' 
                            : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.href === '/sell' && <Plus className="h-5 w-5" />}
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                  
                  <Link href="/wishlist" className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">{t('header.wishlist')}</span>
                    {wishlistCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">{wishlistCount}</Badge>
                    )}
                  </Link>

                  <Button
                    variant="ghost"
                    onClick={toggleCart}
                    className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 justify-start w-full"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="font-medium">{t('header.cart')}</span>
                    {cartCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">{cartCount}</Badge>
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
                      <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register">
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
