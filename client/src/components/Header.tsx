import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Heart, User, Menu, Settings as SettingsIcon, Plus, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const { user, isAuthenticated, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userInitials = `${user?.firstName?.[0] || "U"}${user?.lastName?.[0] || ""}`.toUpperCase();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => setLocation("/"),
    });
  };

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
    { name: t('header.products'), href: '/products' },
    { name: t('header.accommodation'), href: '/properties' },
    { name: t('header.travel'), href: '/travel' },
    { name: t('header.sell'), href: '/sell' },
  ];

  const adminNavigation = user?.role === 'admin' ? [
    { name: 'Admin Panel', href: '/admin' },
  ] : [];

  const sellerNavigation = (user?.role === 'seller' || user?.role === 'admin') ? [
    { name: 'Seller Analytics', href: '/seller-analytics' },
  ] : [];

  return (
    <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-lg border-b border-gray-200/20 dark:border-gray-700/20 sticky top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md group-hover:shadow-xl">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-700 group-hover:to-purple-700">
                MarketPlace Pro
              </h1>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t('header.searchPlaceholder') || 'Search for anything...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  title={t('common.search') || 'Search'}
                >
                  <Search className="h-5 w-5" />
                </button>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </form>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1.5 flex-nowrap">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    item.href === '/sell'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:shadow-md'
                  }`}
                >
                  {item.href === '/sell' && <Plus className="h-4 w-4 mr-1 inline" />}
                  {item.name}
                </Link>
              ))}
              {sellerNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
                >
                  <SettingsIcon className="h-4 w-4 mr-1 inline" />
                  {item.name}
                </Link>
              ))}
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl"
                >
                  <SettingsIcon className="h-4 w-4 mr-1 inline" />
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-2">{/* Actions */}

              <Link href="/wishlist" className="group relative p-2 text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-all duration-200">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 text-xs min-w-[16px] p-0 flex items-center justify-center">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </Badge>
                )}
              </Link>

              <Button
                variant="ghost"
                onClick={toggleCart}
                className="group relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-all duration-200"
                title={t('header.cart')}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 text-xs min-w-[16px] p-0 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu - Simplified */}
              {isAuthenticated ? (
                <div className="hidden lg:flex items-center space-x-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                          <AvatarFallback>{userInitials || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="hidden xl:flex flex-col items-start leading-tight">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user?.firstName || t('header.account')}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{t('header.account')}</span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{user?.firstName} {user?.lastName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t('header.account')}</div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{t('header.dashboard')}</span>
                        </Link>
                      </DropdownMenuItem>
                      {(user?.role === 'seller' || user?.role === 'admin') && (
                        <DropdownMenuItem asChild>
                          <Link href="/seller-analytics" className="flex items-center gap-2">
                            <SettingsIcon className="h-4 w-4" />
                            <span>{t('header.analytics')}</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/host-settings" className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          <span>{t('header.host') || 'Host'}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{t('header.account') || 'Profile'}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4" />
                          <span>{t('header.settings') || 'Settings'}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onSelect={(event) => {
                          event.preventDefault();
                          handleLogout();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('header.logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-all duration-200"
                    >
                      {t('header.signIn')}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
                    >
                      {t('header.getStarted')}
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
                    {sellerNavigation.map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        className="flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 shadow-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <SettingsIcon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                    {adminNavigation.map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        className="flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <SettingsIcon className="h-5 w-5" />
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
                      <Link href="/host-settings" className="flex items-center space-x-2 py-2">
                        <Home className="h-5 w-5" />
                        <span>{t('header.host') || 'Host'}</span>
                      </Link>
                      <Link href="/profile" className="flex items-center space-x-2 py-2">
                        <User className="h-5 w-5" />
                        <span>{t('header.account')}</span>
                      </Link>
                      <Link href="/settings" className="flex items-center space-x-2 py-2">
                        <SettingsIcon className="h-5 w-5" />
                        <span>{t('header.settings') || 'Settings'}</span>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="justify-start"
                      >
                        {t('header.logout')}
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start">
                          {t('header.signIn')}
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                          {t('header.getStarted')}
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Categories Navigation - Simplified */}
        <nav className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30">
          <div className="py-2 px-4">
            <div className="flex items-center justify-center space-x-6 overflow-x-auto">
              {categories.slice(0, 5).map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
