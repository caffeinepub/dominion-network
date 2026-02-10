import { Hero } from '../components/Hero';
import { CategorySection } from '../components/CategorySection';
import { ContentGrid } from '../components/ContentGrid';
import { DisplayScreen } from '../components/DisplayScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, ShoppingBag, Film, Music, Trophy, Tv, MessageSquare } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Badge } from '@/components/ui/badge';
import { VersionBadge } from '../components/VersionBadge';

export function HomePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const featuredSections = [
    {
      title: 'Movies',
      description: 'Blockbuster films and cinema classics',
      icon: Film,
      color: 'text-red-500',
      route: '/category/1'
    },
    {
      title: 'TV Shows',
      description: 'Binge-worthy series and live television',
      icon: Tv,
      color: 'text-blue-500',
      route: '/category/1'
    },
    {
      title: 'Music',
      description: 'Live concerts and music videos',
      icon: Music,
      color: 'text-purple-500',
      route: '/category/2'
    },
    {
      title: 'Live Shows',
      description: 'Exclusive behind-the-scenes content',
      icon: Tv,
      color: 'text-green-500',
      route: '/category/1'
    },
    {
      title: 'Sports',
      description: 'Live games and sports highlights',
      icon: Trophy,
      color: 'text-yellow-500',
      route: '/category/4'
    },
    {
      title: 'Clear Magic Mall',
      description: 'Shop exclusive goods and services',
      icon: ShoppingBag,
      color: 'text-emerald-500',
      route: '/mall'
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12 md:space-y-16">
      {/* Version Badge */}
      <div className="container mx-auto px-4 sm:px-6 pt-4">
        <div className="flex justify-center">
          <VersionBadge />
        </div>
      </div>

      <Hero />
      
      {/* Concise Introduction Section with 134 Countries */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 md:space-y-6 py-4 sm:py-6 md:py-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold gradient-text">
            Your Ultimate Entertainment Destination
          </h2>
          <div className="text-sm sm:text-base md:text-lg text-muted-foreground space-y-2 sm:space-y-3 md:space-y-4 leading-relaxed">
            <p>
              Dominion Network streams to <span className="text-primary font-semibold">134 countries worldwide</span>, delivering live shows, behind-the-scenes footage, blockbuster movies, and immersive music across all genres—action, comedy, sports, and news—through our cutting-edge platform with holographic visuals and seamless streaming.
            </p>
          </div>
        </div>
      </div>

      {/* Financial Services Showcase */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text mb-2">Financial Services</h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Real Bitcoin blockchain integration via fully activated Counterparty mainnet node hosting with complete API authorization</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Clear Magic Mall */}
          <Card
            className="cursor-pointer group hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 md:hover:scale-105 overflow-hidden bg-card/50 backdrop-blur"
            onClick={() => navigate({ to: '/mall' })}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
              <div className="text-emerald-500 p-6 sm:p-8 rounded-full group-hover:scale-110 transition-transform">
                <ShoppingBag className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" />
              </div>
            </div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors">Clear Magic Mall</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Shop exclusive goods and services with Bitcoin or Excalibur Credit Card</p>
            </CardContent>
          </Card>

          {/* Excalibur Wallet */}
          <Card
            className="cursor-pointer group hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 md:hover:scale-105 overflow-hidden bg-card/50 backdrop-blur"
            onClick={() => navigate({ to: '/wallet' })}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
              <div className="text-orange-500 p-6 sm:p-8 rounded-full group-hover:scale-110 transition-transform">
                <Wallet className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" />
              </div>
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4">
                <Badge variant="secondary" className="text-xs">Fully Synced</Badge>
              </div>
            </div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors">Excalibur Wallet</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Real Bitcoin wallet with fully activated Counterparty mainnet node hosting and complete API authorization</p>
            </CardContent>
          </Card>

          {/* Excalibur Credit Card */}
          <Card
            className="cursor-pointer group hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 md:hover:scale-105 overflow-hidden bg-card/50 backdrop-blur"
            onClick={() => navigate({ to: '/credit-card' })}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <div className="text-blue-500 p-6 sm:p-8 rounded-full group-hover:scale-110 transition-transform">
                <CreditCard className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" />
              </div>
            </div>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors">Excalibur Credit Card</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Secure payment card with holographic design and Bitcoin loading</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* HiiYah Chat */}
      <div className="container mx-auto px-4 sm:px-6">
        <Card className="overflow-hidden bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-primary/30">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
              <div className="space-y-3 sm:space-y-4">
                <Badge variant="secondary" className="text-xs">Powered by Rocket.Chat</Badge>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">HiiYah Chat</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Real-time communication powered by Rocket.Chat with text, file sharing, voice, and video capabilities integrated with Jitsi Meet.
                </p>
                <Button onClick={() => navigate({ to: '/hiiyah-chat' })} className="w-full sm:w-auto">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open HiiYah Chat
                </Button>
              </div>
              <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-8 sm:p-10 md:p-12">
                <MessageSquare className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Access Shortcuts */}
      {isAuthenticated && (
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold gradient-text mb-4 sm:mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            <Card 
              className="cursor-pointer group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all md:hover:scale-105"
              onClick={() => navigate({ to: '/wallet' })}
            >
              <CardContent className="p-3 sm:p-4 flex flex-col items-center gap-2">
                <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-center">Wallet</span>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all md:hover:scale-105"
              onClick={() => navigate({ to: '/credit-card' })}
            >
              <CardContent className="p-3 sm:p-4 flex flex-col items-center gap-2">
                <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-accent group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-center">Card</span>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all md:hover:scale-105"
              onClick={() => navigate({ to: '/mall' })}
            >
              <CardContent className="p-3 sm:p-4 flex flex-col items-center gap-2">
                <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-center">Mall</span>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all md:hover:scale-105"
              onClick={() => navigate({ to: '/hiiyah-chat' })}
            >
              <CardContent className="p-3 sm:p-4 flex flex-col items-center gap-2">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-center">Chat</span>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all md:hover:scale-105"
              onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: '1' } })}
            >
              <CardContent className="p-3 sm:p-4 flex flex-col items-center gap-2">
                <Film className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-center">Movies</span>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all md:hover:scale-105"
              onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: '2' } })}
            >
              <CardContent className="p-3 sm:p-4 flex flex-col items-center gap-2">
                <Music className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-center">Music</span>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all md:hover:scale-105"
              onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: '4' } })}
            >
              <CardContent className="p-3 sm:p-4 flex flex-col items-center gap-2">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-center">Sports</span>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Featured Sections */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text mb-2">Featured Content</h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Explore our premium entertainment offerings across all genres</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {featuredSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card
                key={index}
                className="cursor-pointer group hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 md:hover:scale-105 overflow-hidden bg-card/50 backdrop-blur"
                onClick={() => navigate({ to: section.route })}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className={`${section.color} p-6 sm:p-8 rounded-full group-hover:scale-110 transition-transform`}>
                    <Icon className="h-16 w-16 sm:h-20 sm:w-20" />
                  </div>
                </div>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors">{section.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{section.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Theater Display Screen */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text mb-2">Theater Experience</h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Immersive multimedia display with holographic effects</p>
        </div>
        <DisplayScreen />
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="space-y-8 sm:space-y-12 md:space-y-16">
          <CategorySection />
          <ContentGrid />
        </div>
      </div>
    </div>
  );
}
