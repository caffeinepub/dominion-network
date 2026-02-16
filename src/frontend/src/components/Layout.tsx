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

  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${getBackgroundClass()}`}>
      <Header />
      <main className={`flex-1 ${isAdminRoute ? '' : 'pb-24 sm:pb-28'}`}>
        <Outlet />
      </main>
      <Footer />
      {!isAdminRoute && <HeroHelper />}
    </div>
  );
}
