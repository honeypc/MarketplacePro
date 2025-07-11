import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContextualHelpProvider } from "@/components/ContextualHelpProvider";
import { ChatWidget } from "@/components/ChatWidget";
import { useAuth } from "@/hooks/useAuth";
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
import InventoryManagement from "@/pages/InventoryManagement";
import PostProduct from "@/pages/PostProduct";
import Profile from "@/pages/Profile";
import UserSettings from "@/pages/Settings";
import SupportDashboard from "@/pages/SupportDashboard";
import Wishlist from "@/pages/Wishlist";
import TestHooks from "@/pages/TestHooks";
import TestCart from "@/pages/TestCart";
import Properties from "@/pages/PropertiesImproved";
import PropertyDetail from "@/pages/PropertyDetail";
import BookingHistoryPage from "@/pages/BookingHistoryPage";
import PaymentManagement from "@/pages/PaymentManagement";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
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
          <Route path="/properties" component={Properties} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/test-hooks" component={TestHooks} />
          <Route path="/test-cart" component={TestCart} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/properties" component={Properties} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/seller" component={SellerDashboard} />
          <Route path="/inventory" component={InventoryManagement} />
          <Route path="/sell" component={PostProduct} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={UserSettings} />
          <Route path="/support" component={SupportDashboard} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/booking-history" component={BookingHistoryPage} />
          <Route path="/payments" component={PaymentManagement} />
          <Route path="/test-hooks" component={TestHooks} />
          <Route path="/test-cart" component={TestCart} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ContextualHelpProvider>
          <Toaster />
          <Router />
          <ChatWidget />
        </ContextualHelpProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
