import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { ContextualHelpProvider } from "@/components/ContextualHelpProvider";
import { ChatWidget } from "@/components/ChatWidget";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/lib/i18n";
import { Footer } from "@/components/Footer";
import { GuidanceSystem } from "@/components/help/GuidanceSystem";
import { ContextualHelpPanel } from "@/components/help/ContextualHelpPanel";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import Dashboard from "@/pages/Dashboard";
import SellerDashboard from "@/pages/SellerDashboard";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import AdvancedAnalyticsDashboard from "@/pages/AdvancedAnalyticsDashboard";
import SellerAnalyticsSimple from "@/pages/SellerAnalyticsSimple";
import InventoryManagement from "@/pages/InventoryManagement";
import PostProduct from "@/pages/PostProduct";
import Profile from "@/pages/Profile";
import UserSettings from "@/pages/Settings";
import OrderHistoryPage from "@/pages/OrderHistoryPage";
import SupportDashboard from "@/pages/SupportDashboard";
import Wishlist from "@/pages/Wishlist";
import AffiliateDashboard from "@/pages/AffiliateDashboard";
import TestHooks from "@/pages/TestHooks";
import TestCart from "@/pages/TestCart";
import SeedTest from "@/pages/SeedTest";
import SkeletonDemo from "@/pages/SkeletonDemo";
import Properties from "@/pages/PropertiesImproved";
import PropertyDetail from "@/pages/PropertyDetail";
import BookingHistoryPage from "@/pages/BookingHistoryPage";
import PaymentManagement from "@/pages/PaymentManagement";
import TravelBooking from "@/pages/TravelBooking";
import TravelItineraryPlanner from "@/pages/TravelItineraryPlanner";
import TravelBookingDemo from "@/pages/TravelBookingDemo";
import PopularDestinations from "@/pages/PopularDestinations";
import DestinationDetail from "@/pages/DestinationDetail";
import RecommendationsDashboard from "@/pages/RecommendationsDashboard";
import Tours from "@/pages/Tours";
import NotificationCenter from "@/pages/NotificationCenter";
import SearchResults from "@/pages/SearchResults";
import AdminPanel from "@/pages/AdminPanel";
import FormManagement from "@/pages/FormManagement";
import NotFound from "@/pages/not-found";
import { HelpCenter } from "@/components/help/HelpCenter";
import HostSettings from "@/pages/HostSettings";
import HostManagement from "@/pages/HostManagement";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-sm">
        <div className="container flex h-16 items-center justify-center px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MarketplacePro
            </h1>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        {/* Contextual Help Components */}
        <GuidanceSystem />
        <ContextualHelpPanel />
        
        <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/auth" component={Auth} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/search" component={SearchResults} />
          <Route path="/properties" component={Properties} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/travel" component={TravelBooking} />
          <Route path="/tours" component={Tours} />
          <Route path="/itinerary" component={TravelItineraryPlanner} />
          <Route path="/travel-demo" component={TravelBookingDemo} />
          <Route path="/destinations/:id" component={DestinationDetail} />
          <Route path="/destinations" component={PopularDestinations} />
          <Route path="/recommendations" component={RecommendationsDashboard} />
          <Route path="/host-settings" component={HostSettings} />
          <Route path="/host-management" component={HostManagement} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/sell" component={PostProduct} />
          <Route path="/test-hooks" component={TestHooks} />
          <Route path="/test-cart" component={TestCart} />
          <Route path="/seed-test" component={SeedTest} />
          <Route path="/skeleton-demo" component={SkeletonDemo} />
          <Route path="/help" component={HelpCenter} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/search" component={SearchResults} />
          <Route path="/properties" component={Properties} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/travel" component={TravelBooking} />
          <Route path="/tours" component={Tours} />
          <Route path="/itinerary" component={TravelItineraryPlanner} />
          <Route path="/travel-demo" component={TravelBookingDemo} />
          <Route path="/destinations/:id" component={DestinationDetail} />
          <Route path="/destinations" component={PopularDestinations} />
          <Route path="/recommendations" component={RecommendationsDashboard} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/seller" component={SellerDashboard} />
          <Route path="/orders" component={OrderHistoryPage} />
          <Route path="/analytics" component={AnalyticsDashboard} />
          <Route path="/advanced-analytics" component={AdvancedAnalyticsDashboard} />
          <Route path="/seller-analytics" component={SellerAnalyticsSimple} />
          <Route path="/inventory" component={InventoryManagement} />
          <Route path="/sell" component={PostProduct} />
          <Route path="/profile" component={Profile} />
          <Route path="/host-settings" component={HostSettings} />
          <Route path="/host-management" component={HostManagement} />
          <Route path="/affiliate" component={AffiliateDashboard} />
          <Route path="/settings" component={UserSettings} />
          <Route path="/support" component={SupportDashboard} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/admin/forms" component={FormManagement} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/booking-history" component={BookingHistoryPage} />
          <Route path="/payments" component={PaymentManagement} />
          <Route path="/notifications" component={NotificationCenter} />
          <Route path="/test-hooks" component={TestHooks} />
          <Route path="/test-cart" component={TestCart} />
          <Route path="/seed-test" component={SeedTest} />
          <Route path="/skeleton-demo" component={SkeletonDemo} />
          <Route path="/help" component={HelpCenter} />
        </>
      )}
          <Route component={NotFound} />
        </Switch>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
