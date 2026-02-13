import { useState, useEffect } from 'react';
import { Search, Menu, X, Wallet, CreditCard, Share2, Shield, ShoppingBag, Film, Music, Trophy, Laugh, Newspaper, Tv, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getOrderedAdminNavSections } from '../constants/adminNav';
import { useAdminStatus } from '../hooks/useAdminStatus';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { canShowAdminUI, refetchAdminStatus } = useAdminStatus();

  const isAuthenticated = !!identity;
  const adminNavSections = getOrderedAdminNavSections();

  // Refetch admin status when identity changes
  useEffect(() => {
    if (identity) {
      refetchAdminStatus();
    }
  }, [identity, refetchAdminStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/', search: { q: searchQuery } });
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleLogin = async () => {
    try {
      await login();
      // Refetch admin status after successful login
      setTimeout(() => {
        refetchAdminStatus();
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleAdminNavClick = (route: string) => {
    navigate({ to: route });
  };

  const handleMobileAdminNavClick = (route: string) => {
    navigate({ to: route });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-lg shadow-primary/5">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Logo */}
          <button 
            onClick={() => navigate({ to: '/' })} 
            className="shrink-0 flex items-center hover:opacity-80 transition-opacity min-w-0"
          >
            <img 
              src="/assets/generated/dominion-network-logo.dim_512x128.png" 
              alt="Dominion Network" 
              className="h-8 sm:h-10 w-auto object-contain max-w-[120px] sm:max-w-[180px] md:max-w-[220px]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="hidden items-center gap-1.5 sm:gap-2 min-w-0">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
              <span className="text-base sm:text-xl md:text-2xl font-bold gradient-text truncate">Dominion Network</span>
            </div>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center min-w-0">
            <button 
              onClick={() => navigate({ to: '/' })} 
              className="text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap px-2 py-1"
            >
              Home
            </button>
            <button 
              onClick={() => navigate({ to: '/streaming-partners' })} 
              className="text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap px-2 py-1"
            >
              Streaming
            </button>
            
            {/* Media Genres Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap px-2 py-1 flex items-center gap-1">
                  <Film className="h-3.5 w-3.5" />
                  Media
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-44">
                <DropdownMenuLabel>Browse Genres</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: '1' } })}>
                  <Film className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">Movies</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: '2' } })}>
                  <Music className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">Music</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: '3' } })}>
                  <Tv className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">Live TV</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: '4' } })}>
                  <Trophy className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">Sports</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: '5' } })}>
                  <Laugh className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">Comedy</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: '6' } })}>
                  <Newspaper className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">News</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated && (
              <>
                <button 
                  onClick={() => navigate({ to: '/hiiyah-chat' })} 
                  className="text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap px-2 py-1"
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden xl:inline">Chat</span>
                </button>
                <button 
                  onClick={() => navigate({ to: '/wallet' })} 
                  className="text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap px-2 py-1"
                >
                  <Wallet className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden xl:inline">Wallet</span>
                </button>
                <button 
                  onClick={() => navigate({ to: '/credit-card' })} 
                  className="text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap px-2 py-1"
                >
                  <CreditCard className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden xl:inline">Card</span>
                </button>
                <button 
                  onClick={() => navigate({ to: '/affiliate' })} 
                  className="text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap px-2 py-1"
                >
                  <Share2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden xl:inline">Affiliate</span>
                </button>
              </>
            )}

            <button 
              onClick={() => navigate({ to: '/mall' })} 
              className="text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap px-2 py-1"
            >
              <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden xl:inline">Mall</span>
            </button>

            {/* Admin Dropdown - Desktop */}
            {canShowAdminUI && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap px-2 py-1 flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 shrink-0" />
                    <span className="hidden xl:inline">Admin</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 max-h-[80vh]">
                  <ScrollArea className="h-full max-h-[70vh]">
                    {adminNavSections.map(({ section, items }, sectionIndex) => (
                      <div key={section}>
                        <DropdownMenuLabel className="text-xs font-semibold text-primary/80 px-2 py-1.5">
                          {section}
                        </DropdownMenuLabel>
                        {items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <DropdownMenuItem
                              key={item.route}
                              onClick={() => handleAdminNavClick(item.route)}
                              className="cursor-pointer px-2 py-1.5"
                            >
                              <Icon className="h-4 w-4 mr-2 shrink-0" />
                              <span className="text-sm break-words">{item.label}</span>
                            </DropdownMenuItem>
                          );
                        })}
                        {sectionIndex < adminNavSections.length - 1 && <DropdownMenuSeparator />}
                      </div>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-xs min-w-0">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm w-full"
              />
            </div>
          </form>

          {/* Auth Button - Desktop */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {userProfile && (
                  <span className="text-xs xl:text-sm text-muted-foreground truncate max-w-[100px] xl:max-w-[150px]">
                    {userProfile.name}
                  </span>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="text-xs xl:text-sm whitespace-nowrap"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                size="sm"
                className="text-xs xl:text-sm whitespace-nowrap"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-primary/20 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-1 px-2">
              <button
                onClick={() => {
                  navigate({ to: '/' });
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate({ to: '/streaming-partners' });
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
              >
                Streaming Partners
              </button>

              {/* Mobile Media Genres */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Media Genres</div>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '1' } });
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                >
                  <Film className="h-4 w-4" />
                  Movies
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '2' } });
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                >
                  <Music className="h-4 w-4" />
                  Music
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '3' } });
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                >
                  <Tv className="h-4 w-4" />
                  Live TV
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '4' } });
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                >
                  <Trophy className="h-4 w-4" />
                  Sports
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '5' } });
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                >
                  <Laugh className="h-4 w-4" />
                  Comedy
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '6' } });
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                >
                  <Newspaper className="h-4 w-4" />
                  News
                </button>
              </div>

              {isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      navigate({ to: '/hiiyah-chat' });
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    HiiYah Chat
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/wallet' });
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    <Wallet className="h-4 w-4" />
                    Excalibur Wallet
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/credit-card' });
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    <CreditCard className="h-4 w-4" />
                    Excalibur Card
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/affiliate' });
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Affiliate Program
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  navigate({ to: '/mall' });
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Clear Magic Mall
              </button>

              {/* Mobile Admin Menu */}
              {canShowAdminUI && (
                <div className="space-y-1 pt-2 border-t border-primary/20">
                  <div className="px-3 py-2 text-xs font-semibold text-primary flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </div>
                  {adminNavSections.map(({ section, items }) => (
                    <div key={section} className="space-y-1">
                      <div className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                        {section}
                      </div>
                      {items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.route}
                            onClick={() => handleMobileAdminNavClick(item.route)}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-accent rounded-md transition-colors"
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="break-words">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </nav>

            {/* Mobile Auth Button */}
            <div className="px-2 pt-2 border-t border-primary/20">
              {isAuthenticated ? (
                <div className="space-y-2">
                  {userProfile && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Logged in as: <span className="font-medium text-foreground">{userProfile.name}</span>
                    </div>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full"
                >
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
