import { SiFacebook, SiX, SiInstagram, SiYoutube } from 'react-icons/si';
import { Heart, Shield } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';

export function Footer() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();

  const handleAdminLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img 
              src="/assets/generated/dominion-logo-network-readable-transparent.dim_300x100.png" 
              alt="Dominion Network" 
              className="h-10 w-auto"
              style={{ imageRendering: 'crisp-edges' }}
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              The future of multimedia streaming with integrated financial services.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-base">Platform</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <button onClick={() => navigate({ to: '/' })} className="hover:text-primary transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ to: '/streaming-partners' })} className="hover:text-primary transition-colors">
                  Streaming Partners
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ to: '/wallet' })} className="hover:text-primary transition-colors">
                  Wallet
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ to: '/credit-card' })} className="hover:text-primary transition-colors">
                  Credit Card
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ to: '/affiliate' })} className="hover:text-primary transition-colors">
                  Affiliate Program
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-base">Support</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-base">Connect</h3>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <SiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <SiX className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <SiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <SiYoutube className="h-5 w-5" />
              </a>
            </div>
            {!identity && (
              <div>
                <h4 className="text-sm font-medium mb-2">Admin Access</h4>
                <Button 
                  onClick={handleAdminLogin} 
                  disabled={isLoggingIn}
                  variant="outline" 
                  size="sm" 
                  className="gap-2 w-full sm:w-auto"
                >
                  <Shield className="h-4 w-4" />
                  {isLoggingIn ? 'Connecting...' : 'Admin Login'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              Excalibur Wallet, Excalibur Secured Credit Card, Clear Magic Mall, and HiiYAH Chat
            </p>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2 flex-wrap">
              © 2025. Built with <Heart className="h-4 w-4 text-red-500 fill-current" /> using{' '}
              <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
