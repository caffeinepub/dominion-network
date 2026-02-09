import { useState } from 'react';
import { Search, Menu, X, Wallet, CreditCard, Share2, Shield, ShoppingBag, Film, Music, Trophy, Laugh, Newspaper, Tv, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ADMIN_NAV_ITEMS, getAdminNavSections } from '../constants/adminNav';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const showAdminMenu = isAuthenticated && isAdmin === true && !isAdminLoading;

  const adminNavSections = getAdminNavSections();

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
                  <span className="hidden xl:inline">HiiYah Chat</span>
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
                  onClick={() => navigate({ to: '/mall' })} 
                  className="text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap px-2 py-1"
                >
                  <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden xl:inline">Mall</span>
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
          </nav>

          {/* Search and Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
            <form onSubmit={handleSearch} className="hidden md:flex items-center min-w-0">
              <div className="relative min-w-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-32 lg:w-40 xl:w-48 h-9 bg-muted/50 border-border/50 focus:border-primary text-sm"
                />
              </div>
            </form>

            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                {userProfile && (
                  <span className="hidden xl:block text-sm text-muted-foreground max-w-[100px] truncate">
                    {userProfile.name}
                  </span>
                )}
                {showAdminMenu && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1 sm:gap-1.5 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3 shrink-0">
                        <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                        <span className="hidden sm:inline">Admin</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 max-h-[80vh]">
                      <ScrollArea className="max-h-[70vh]">
                        {Object.entries(adminNavSections).map(([section, items], sectionIndex) => (
                          <div key={section}>
                            {sectionIndex > 0 && <DropdownMenuSeparator />}
                            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                              {section}
                            </DropdownMenuLabel>
                            {items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <DropdownMenuItem 
                                  key={item.route} 
                                  onClick={() => handleAdminNavClick(item.route)}
                                  className="min-w-0 cursor-pointer"
                                >
                                  <Icon className="h-4 w-4 mr-2 shrink-0" />
                                  <span className="truncate">{item.label}</span>
                                </DropdownMenuItem>
                              );
                            })}
                          </div>
                        ))}
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3 shrink-0"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                size="sm"
                className="h-8 sm:h-9 text-xs sm:text-sm px-3 sm:px-4 shrink-0"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 max-h-[70vh] overflow-y-auto">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate({ to: '/' });
                  setMobileMenuOpen(false);
                }}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate({ to: '/streaming-partners' });
                  setMobileMenuOpen(false);
                }}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50"
              >
                Streaming Partners
              </button>

              {/* Mobile Media Genres */}
              <div className="space-y-1 mt-2">
                <p className="text-xs font-semibold text-muted-foreground px-2 py-1">Browse Genres</p>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '1' } });
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 w-full flex items-center gap-2"
                >
                  <Film className="h-4 w-4" />
                  Movies
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '2' } });
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 w-full flex items-center gap-2"
                >
                  <Music className="h-4 w-4" />
                  Music
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '3' } });
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 w-full flex items-center gap-2"
                >
                  <Tv className="h-4 w-4" />
                  Live TV
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '4' } });
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 w-full flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  Sports
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '5' } });
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 w-full flex items-center gap-2"
                >
                  <Laugh className="h-4 w-4" />
                  Comedy
                </button>
                <button
                  onClick={() => {
                    navigate({ to: '/category/$categoryId', params: { categoryId: '6' } });
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 w-full flex items-center gap-2"
                >
                  <Newspaper className="h-4 w-4" />
                  News
                </button>
              </div>

              {isAuthenticated && (
                <>
                  <div className="border-t border-border/50 my-2" />
                  <button
                    onClick={() => {
                      navigate({ to: '/hiiyah-chat' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    HiiYah Chat
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/wallet' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 flex items-center gap-2"
                  >
                    <Wallet className="h-4 w-4" />
                    Excalibur Wallet
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/credit-card' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 flex items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Excalibur Card
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/mall' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 flex items-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Clear Magic Mall
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/affiliate' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Affiliate Program
                  </button>

                  {/* Mobile Admin Menu */}
                  {showAdminMenu && (
                    <>
                      <div className="border-t border-border/50 my-2" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 px-2 py-2">
                          <Shield className="h-5 w-5 text-primary" />
                          <p className="text-sm font-bold text-primary">Admin Menu</p>
                        </div>
                        {Object.entries(adminNavSections).map(([section, items]) => (
                          <div key={section} className="space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground px-2 py-1 mt-2">
                              {section}
                            </p>
                            {items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.route}
                                  onClick={() => handleMobileAdminNavClick(item.route)}
                                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors text-left px-2 py-2 rounded hover:bg-muted/50 w-full flex items-center gap-2"
                                >
                                  <Icon className="h-4 w-4 shrink-0" />
                                  <span className="truncate">{item.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
