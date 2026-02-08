import { Outlet, useLocation } from '@tanstack/react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { HeroHelper } from './HeroHelper';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';

export function Layout() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const location = useLocation();

  const isAuthenticated = !!identity;

  // Don't show profile setup modal - simplified for now
  const showProfileSetup = false;

  // Determine background class based on current route
  const getBackgroundClass = () => {
    const path = location.pathname;
    
    if (path.startsWith('/admin')) {
      return 'bg-admin-area';
    }
    if (path.startsWith('/wallet') || path.startsWith('/credit-card')) {
      return 'bg-finance-area';
    }
    if (path.startsWith('/mall')) {
      return 'bg-commerce-area';
    }
    if (path.startsWith('/hiiyah-chat')) {
      return 'bg-chat-area';
    }
    
    return 'bg-default-area';
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm sm:text-base text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col overflow-x-hidden ${getBackgroundClass()}`}>
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <HeroHelper />
    </div>
  );
}
