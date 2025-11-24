import { Link } from "wouter";
import { Github, Twitter, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { LanguageSelector } from "@/components/ui/language-selector";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MarketPlace Pro
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                {t('footer.description', 'Your trusted marketplace for products, accommodations, and travel experiences.')}
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                {t('footer.quickLinks', 'Quick Links')}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    {t('header.products', 'Products')}
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    {t('header.accommodation', 'Accommodation')}
                  </Link>
                </li>
                <li>
                  <Link href="/travel" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    {t('header.travel', 'Travel')}
                  </Link>
                </li>
                <li>
                  <Link href="/sell" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    {t('header.sell', 'Sell')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                {t('footer.support', 'Support')}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    {t('footer.helpCenter', 'Help Center')}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    {t('footer.dashboard', 'Dashboard')}
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    {t('footer.profile', 'Profile')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                    {t('footer.contact', 'Contact Us')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                {t('footer.settings', 'Settings')}
              </h4>

              {/* Language and Theme Selectors */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('footer.language', 'Language')}
                  </label>
                  <LanguageSelector />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('footer.theme', 'Theme')}
                  </label>
                  <ThemeSelector />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>support@marketplacepro.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>New York, NY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 MarketPlace Pro. {t('footer.allRightsReserved', 'All rights reserved.')}.
            </div>
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                {t('footer.privacy', 'Privacy Policy')}
              </Link>
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                {t('footer.terms', 'Terms of Service')}
              </Link>
              <Link href="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                {t('footer.cookies', 'Cookie Policy')}
              </Link>
              <Link href="/sitemap" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                {t('footer.sitemap', 'Sitemap')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}