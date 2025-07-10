import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { 
  Shield, 
  Zap, 
  UserCheck, 
  Globe, 
  ArrowRight, 
  CheckCircle,
  User,
  Mail,
  Lock,
  Github,
  Chrome
} from "lucide-react";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MarketPlace Pro</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Secure Authentication</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Welcome to MarketPlace Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our global marketplace with secure, one-click authentication. 
            No passwords to remember, no lengthy forms to fill out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Login Card */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Sign In / Sign Up</CardTitle>
              <CardDescription className="text-base">
                Access your account or create a new one instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-800 text-sm">
                    Existing users: Instant access to your account
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-blue-800 text-sm">
                    New users: Account created automatically
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleLogin}
                size="lg" 
                className="w-full text-base font-medium"
              >
                <Zap className="h-5 w-5 mr-2" />
                Continue with Replit
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Powered by <Badge variant="outline" className="ml-1">Replit Auth</Badge>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Choose Our Authentication?
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-white/60 rounded-lg border">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Enterprise Security</h3>
                  <p className="text-gray-600 text-sm">
                    Bank-level encryption and security protocols protect your data
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white/60 rounded-lg border">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Lightning Fast</h3>
                  <p className="text-gray-600 text-sm">
                    One-click authentication - no forms, no waiting
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white/60 rounded-lg border">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Universal Access</h3>
                  <p className="text-gray-600 text-sm">
                    Works across all devices and platforms seamlessly
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white/60 rounded-lg border">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Privacy First</h3>
                  <p className="text-gray-600 text-sm">
                    Your personal information stays private and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Click Sign In</h3>
              <p className="text-gray-600 text-sm">
                Simply click the "Continue with Replit" button above
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Authenticate</h3>
              <p className="text-gray-600 text-sm">
                Verify your identity through Replit's secure system
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start Shopping</h3>
              <p className="text-gray-600 text-sm">
                Access your account and start buying or selling immediately
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white/60">
              <CardHeader>
                <CardTitle className="text-lg">Do I need a Replit account?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  No! If you don't have a Replit account, one will be created for you automatically 
                  during the sign-in process. It's completely free and takes just seconds.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60">
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Absolutely! We use Replit's enterprise-grade authentication system with 
                  industry-standard encryption and security protocols to protect your information.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60">
              <CardHeader>
                <CardTitle className="text-lg">Can I use this on mobile?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Yes! Our authentication system works seamlessly across all devices - 
                  desktop, tablet, and mobile browsers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60">
              <CardHeader>
                <CardTitle className="text-lg">What about password reset?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Since we use Replit Auth, password management is handled by Replit. 
                  You can manage your account settings directly through Replit's platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}