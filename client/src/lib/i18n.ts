import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  rtl: boolean;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', rtl: false },
  { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
];

const translations: Record<string, Translation> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      search: 'Search',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      viewAll: 'View All',
      showMore: 'Show More',
      showLess: 'Show Less',
    },
    header: {
      searchPlaceholder: 'Search for products, brands, and more...',
      wishlist: 'Wishlist',
      cart: 'Cart',
      account: 'Account',
      login: 'Login',
      logout: 'Logout',
      sellOnMarketplace: 'Sell on MarketPlace',
      allCategories: 'All Categories',
      electronics: 'Electronics',
      fashion: 'Fashion',
      homeGarden: 'Home & Garden',
      sports: 'Sports',
      books: 'Books',
    },
    hero: {
      title: 'Discover Amazing Products',
      subtitle: 'Shop from millions of products or start selling your own. Join the marketplace that connects buyers and sellers worldwide.',
      startShopping: 'Start Shopping',
      becomeSeller: 'Become a Seller',
    },
    product: {
      addToCart: 'Add to Cart',
      addToWishlist: 'Add to Wishlist',
      removeFromWishlist: 'Remove from Wishlist',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      freeShipping: 'Free shipping on orders over $50',
      returnPolicy: '30-day return policy',
      soldBy: 'Sold by',
      reviews: 'reviews',
      verifiedPurchase: 'Verified Purchase',
      writeReview: 'Write a Review',
      quantity: 'Quantity',
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      total: 'Total',
      proceedToCheckout: 'Proceed to Checkout',
      updateQuantity: 'Update Quantity',
      removeItem: 'Remove Item',
      continueShopping: 'Continue Shopping',
    },
    checkout: {
      title: 'Checkout',
      shippingInfo: 'Shipping Information',
      paymentInfo: 'Payment Information',
      orderSummary: 'Order Summary',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP Code',
      placeOrder: 'Place Order',
      orderTotal: 'Order Total',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
    },
    dashboard: {
      title: 'Seller Dashboard',
      overview: 'Overview',
      products: 'Products',
      orders: 'Orders',
      analytics: 'Analytics',
      settings: 'Settings',
      totalProducts: 'Total Products',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      averageRating: 'Average Rating',
      addProduct: 'Add New Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete Product',
      productTitle: 'Product Title',
      productDescription: 'Product Description',
      productPrice: 'Price',
      productStock: 'Stock',
      productCategory: 'Category',
      productStatus: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      draft: 'Draft',
    },
    filters: {
      title: 'Filters',
      priceRange: 'Price Range',
      category: 'Category',
      rating: 'Rating',
      location: 'Location',
      brand: 'Brand',
      condition: 'Condition',
      availability: 'Availability',
      clearFilters: 'Clear Filters',
      applyFilters: 'Apply Filters',
      showingResults: 'Showing {{count}} results',
      sortBy: 'Sort by',
      bestMatch: 'Best Match',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
      newestFirst: 'Newest First',
      customerRating: 'Customer Rating',
    },
    auth: {
      welcomeBack: 'Welcome back!',
      signInToContinue: 'Sign in to continue',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      createAccount: 'Create Account',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
    },
    footer: {
      description: 'Your trusted e-commerce platform connecting buyers and sellers worldwide.',
      shop: 'Shop',
      bestSellers: 'Best Sellers',
      newArrivals: 'New Arrivals',
      deals: 'Deals',
      sell: 'Sell',
      startSelling: 'Start Selling',
      sellerHub: 'Seller Hub',
      sellerProtection: 'Seller Protection',
      feesCharges: 'Fees & Charges',
      support: 'Support',
      helpCenter: 'Help Center',
      contactUs: 'Contact Us',
      shippingInfo: 'Shipping Info',
      returns: 'Returns',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      cookiePolicy: 'Cookie Policy',
      allRightsReserved: 'All rights reserved.',
    },
  },
  es: {
    common: {
      loading: 'Cargando...',
      error: 'Ocurrió un error',
      search: 'Buscar',
      add: 'Agregar',
      edit: 'Editar',
      delete: 'Eliminar',
      save: 'Guardar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      close: 'Cerrar',
      viewAll: 'Ver Todo',
      showMore: 'Mostrar Más',
      showLess: 'Mostrar Menos',
    },
    header: {
      searchPlaceholder: 'Buscar productos, marcas y más...',
      wishlist: 'Lista de Deseos',
      cart: 'Carrito',
      account: 'Cuenta',
      login: 'Iniciar Sesión',
      logout: 'Cerrar Sesión',
      sellOnMarketplace: 'Vender en MarketPlace',
      allCategories: 'Todas las Categorías',
      electronics: 'Electrónicos',
      fashion: 'Moda',
      homeGarden: 'Hogar y Jardín',
      sports: 'Deportes',
      books: 'Libros',
    },
    hero: {
      title: 'Descubre Productos Increíbles',
      subtitle: 'Compra entre millones de productos o comienza a vender los tuyos. Únete al mercado que conecta compradores y vendedores en todo el mundo.',
      startShopping: 'Comenzar a Comprar',
      becomeSeller: 'Convertirse en Vendedor',
    },
    // Add more Spanish translations...
  },
  fr: {
    common: {
      loading: 'Chargement...',
      error: 'Une erreur s\'est produite',
      search: 'Rechercher',
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      close: 'Fermer',
      viewAll: 'Voir Tout',
      showMore: 'Afficher Plus',
      showLess: 'Afficher Moins',
    },
    header: {
      searchPlaceholder: 'Rechercher des produits, marques et plus...',
      wishlist: 'Liste de Souhaits',
      cart: 'Panier',
      account: 'Compte',
      login: 'Se Connecter',
      logout: 'Se Déconnecter',
      sellOnMarketplace: 'Vendre sur MarketPlace',
      allCategories: 'Toutes les Catégories',
      electronics: 'Électronique',
      fashion: 'Mode',
      homeGarden: 'Maison et Jardin',
      sports: 'Sports',
      books: 'Livres',
    },
    hero: {
      title: 'Découvrez des Produits Incroyables',
      subtitle: 'Achetez parmi des millions de produits ou commencez à vendre les vôtres. Rejoignez le marché qui connecte acheteurs et vendeurs du monde entier.',
      startShopping: 'Commencer à Acheter',
      becomeSeller: 'Devenir Vendeur',
    },
    // Add more French translations...
  },
  de: {
    common: {
      loading: 'Wird geladen...',
      error: 'Ein Fehler ist aufgetreten',
      search: 'Suchen',
      add: 'Hinzufügen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Zurück',
      close: 'Schließen',
      viewAll: 'Alle Anzeigen',
      showMore: 'Mehr Anzeigen',
      showLess: 'Weniger Anzeigen',
    },
    header: {
      searchPlaceholder: 'Produkte, Marken und mehr suchen...',
      wishlist: 'Wunschliste',
      cart: 'Warenkorb',
      account: 'Konto',
      login: 'Anmelden',
      logout: 'Abmelden',
      sellOnMarketplace: 'Auf MarketPlace verkaufen',
      allCategories: 'Alle Kategorien',
      electronics: 'Elektronik',
      fashion: 'Mode',
      homeGarden: 'Haus & Garten',
      sports: 'Sport',
      books: 'Bücher',
    },
    hero: {
      title: 'Entdecken Sie Erstaunliche Produkte',
      subtitle: 'Kaufen Sie aus Millionen von Produkten oder beginnen Sie, Ihre eigenen zu verkaufen. Treten Sie dem Marktplatz bei, der Käufer und Verkäufer weltweit verbindet.',
      startShopping: 'Mit dem Einkaufen beginnen',
      becomeSeller: 'Verkäufer werden',
    },
    // Add more German translations...
  },
  ar: {
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      search: 'بحث',
      add: 'إضافة',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      close: 'إغلاق',
      viewAll: 'عرض الكل',
      showMore: 'عرض المزيد',
      showLess: 'عرض أقل',
    },
    header: {
      searchPlaceholder: 'البحث عن المنتجات والعلامات التجارية والمزيد...',
      wishlist: 'قائمة الأمنيات',
      cart: 'السلة',
      account: 'الحساب',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      sellOnMarketplace: 'البيع على MarketPlace',
      allCategories: 'جميع الفئات',
      electronics: 'الإلكترونيات',
      fashion: 'الأزياء',
      homeGarden: 'المنزل والحديقة',
      sports: 'الرياضة',
      books: 'الكتب',
    },
    hero: {
      title: 'اكتشف منتجات مذهلة',
      subtitle: 'تسوق من بين ملايين المنتجات أو ابدأ في بيع منتجاتك. انضم إلى السوق الذي يربط المشترين والبائعين في جميع أنحاء العالم.',
      startShopping: 'ابدأ التسوق',
      becomeSeller: 'كن بائعاً',
    },
    // Add more Arabic translations...
  },
};

interface I18nStore {
  currentLanguage: string;
  isRTL: boolean;
  setLanguage: (language: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

export const useI18n = create<I18nStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      isRTL: false,
      setLanguage: (language: string) => {
        const lang = languages.find(l => l.code === language);
        set({ 
          currentLanguage: language,
          isRTL: lang?.rtl || false
        });
        
        // Update document direction
        document.documentElement.dir = lang?.rtl ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
      },
      t: (key: string, params?: Record<string, any>) => {
        const { currentLanguage } = get();
        const keys = key.split('.');
        let value: any = translations[currentLanguage];
        
        for (const k of keys) {
          value = value?.[k];
        }
        
        if (typeof value !== 'string') {
          // Fallback to English if translation not found
          value = translations.en;
          for (const k of keys) {
            value = value?.[k];
          }
        }
        
        if (typeof value !== 'string') {
          return key; // Return key if no translation found
        }
        
        // Replace parameters
        if (params) {
          return value.replace(/\{\{(\w+)\}\}/g, (match: string, param: string) => {
            return params[param] || match;
          });
        }
        
        return value;
      },
    }),
    {
      name: 'i18n-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const lang = languages.find(l => l.code === state.currentLanguage);
          document.documentElement.dir = lang?.rtl ? 'rtl' : 'ltr';
          document.documentElement.lang = state.currentLanguage;
        }
      },
    }
  )
);
