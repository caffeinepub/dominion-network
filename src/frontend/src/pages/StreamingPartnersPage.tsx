import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Tv, Play, Music } from 'lucide-react';
import { SiNetflix } from 'react-icons/si';
import { useNavigate } from '@tanstack/react-router';

export function StreamingPartnersPage() {
  const navigate = useNavigate();

  const platforms = [
    { 
      name: 'Flixiod', 
      url: 'https://www.flixiod.com', 
      route: '/streaming-partners/flixiod',
      icon: Play, 
      color: 'text-red-500', 
      description: 'Test streaming of movies and TV shows' 
    },
    { 
      name: 'iHeartRadio', 
      url: 'https://www.iheart.com', 
      route: '/streaming-partners/iheartradio',
      icon: Music, 
      color: 'text-pink-500', 
      description: 'Test streaming of music and radio' 
    },
    { 
      name: 'Netflix', 
      url: 'https://www.netflix.com', 
      icon: SiNetflix, 
      color: 'text-red-600', 
      description: 'Stream movies, TV shows, and more' 
    },
    { 
      name: 'Hulu', 
      url: 'https://www.hulu.com', 
      icon: Tv, 
      color: 'text-green-500', 
      description: 'Watch current TV shows and movies' 
    },
    { 
      name: 'Disney+', 
      url: 'https://www.disneyplus.com', 
      icon: Tv, 
      color: 'text-blue-500', 
      description: 'Disney, Pixar, Marvel, Star Wars' 
    },
    { 
      name: 'Local TV', 
      url: '#', 
      icon: Tv, 
      color: 'text-purple-500', 
      description: 'Free local television channels' 
    },
    { 
      name: 'Global News', 
      url: '#', 
      icon: Tv, 
      color: 'text-cyan-500', 
      description: 'Latest news from around the world' 
    },
  ];

  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight gradient-text mb-3 sm:mb-4">Streaming Partners</h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Access popular streaming platforms and free local TV/news sources
          </p>
        </div>

        <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-8 sm:p-10 md:p-12 flex items-center justify-center">
          <Tv className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 text-primary" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            
            return (
              <Card key={index} className="hover:border-primary/50 hover:shadow-lg transition-all border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${platform.color} shrink-0`} />
                    <span className="truncate">{platform.name}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{platform.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {platform.route ? (
                    <>
                      <Button 
                        className="w-full text-xs sm:text-sm" 
                        onClick={() => navigate({ to: platform.route })}
                      >
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Test {platform.name}
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full text-xs sm:text-sm" 
                        onClick={() => window.open(platform.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Open in New Tab
                      </Button>
                    </>
                  ) : (
                    <Button 
                      className="w-full text-xs sm:text-sm" 
                      onClick={() => window.open(platform.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Visit {platform.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">Integration Benefits</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Seamless access to premium streaming services</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">•</span>
                <span>Quick links to popular streaming platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">•</span>
                <span>In-app testing for Flixiod and iHeartRadio streaming</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">•</span>
                <span>Access to free local TV and news sources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">•</span>
                <span>Pay for subscriptions using Excalibur Credit Card or Bitcoin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">•</span>
                <span>Centralized hub for all your streaming needs</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
