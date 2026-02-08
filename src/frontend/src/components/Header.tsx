import { useState } from 'react';
import { Search, Menu, X, Wallet, CreditCard, Share2, Shield, Upload, ShoppingBag, Monitor, CheckCircle, Film, Music, Trophy, Laugh, Newspaper, Key, FileText, Tv, DollarSign, Package, MessageSquare, Sparkles, Edit, Image, Users, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched: isAdminFetched } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const showAdminMenu = isAuthenticated && isAdminFetched && isAdmin === true;

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
              <Monitor className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
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
              <DropdownMenuContent align="center" className="w-44 max-h-[400px] overflow-y-auto">
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
                    <DropdownMenuContent align="end" className="w-56 max-h-[500px] overflow-y-auto">
                      <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/approvals' })}>
                        <CheckCircle className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Approvals</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/content' })}>
                        <Upload className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Content Upload</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/editing-room' })}>
                        <Edit className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Editing Room</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/media-upload' })}>
                        <Upload className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Media Upload</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/image-library' })}>
                        <Image className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Image Library</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/ads' })}>
                        <Monitor className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Advertisements</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/affiliate' })}>
                        <Share2 className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Affiliate Program</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/mall' })}>
                        <ShoppingBag className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Mall Management</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/price-control' })}>
                        <DollarSign className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Price Control</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/display' })}>
                        <Monitor className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Display Screen</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/wallet-management' })}>
                        <Wallet className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Wallet Management</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/pricing-terms' })}>
                        <FileText className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Pricing & Terms</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/hiiyah-chat' })}>
                        <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">HiiYah Chat Admin</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/excalibur-studios' })}>
                        <Sparkles className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Excalibur Studios</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/members' })}>
                        <Users className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Member Directory</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin/invite-links' })}>
                        <LinkIcon className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">Invite Links</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
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
          <div className="lg:hidden py-4 border-t border-border/50 space-y-2 max-h-[70vh] overflow-y-auto">
            <button 
              onClick={() => { navigate({ to: '/' }); setMobileMenuOpen(false); }} 
              className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => { navigate({ to: '/streaming-partners' }); setMobileMenuOpen(false); }} 
              className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
            >
              Streaming Partners
            </button>
            
            {isAuthenticated && (
              <>
                <button 
                  onClick={() => { navigate({ to: '/hiiyah-chat' }); setMobileMenuOpen(false); }} 
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                >
                  HiiYah Chat
                </button>
                <button 
                  onClick={() => { navigate({ to: '/wallet' }); setMobileMenuOpen(false); }} 
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                >
                  Excalibur Wallet
                </button>
                <button 
                  onClick={() => { navigate({ to: '/credit-card' }); setMobileMenuOpen(false); }} 
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                >
                  Excalibur Card
                </button>
                <button 
                  onClick={() => { navigate({ to: '/mall' }); setMobileMenuOpen(false); }} 
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                >
                  Clear Magic Mall
                </button>
                <button 
                  onClick={() => { navigate({ to: '/affiliate' }); setMobileMenuOpen(false); }} 
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                >
                  Affiliate Dashboard
                </button>

                {showAdminMenu && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Admin Panel
                    </div>
                    <button 
                      onClick={() => { navigate({ to: '/admin/approvals' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Approvals
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/content' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Content Upload
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/editing-room' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Editing Room
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/media-upload' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Media Upload
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/image-library' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Image Library
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/ads' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Advertisements
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/affiliate' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Affiliate Program
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/mall' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Mall Management
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/price-control' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Price Control
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/display' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Display Screen
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/wallet-management' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Wallet Management
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/pricing-terms' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Pricing & Terms
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/hiiyah-chat' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      HiiYah Chat Admin
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/excalibur-studios' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Excalibur Studios
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/members' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Member Directory
                    </button>
                    <button 
                      onClick={() => { navigate({ to: '/admin/invite-links' }); setMobileMenuOpen(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                    >
                      Invite Links
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
