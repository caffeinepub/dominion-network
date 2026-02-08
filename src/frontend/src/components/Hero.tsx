import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden">
      {/* Animated background with theater theme - gradient only */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-accent/10 to-background z-10" />
      
      {/* Holographic glow effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-20 container mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/30 rounded-full text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-4 animate-pulse-glow">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Streaming to 134 Countries Worldwide</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight px-2">
            <span className="gradient-text block mb-1 sm:mb-2">Welcome to</span>
            <span className="gradient-text">Dominion Network</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Your premier destination for live shows, exclusive behind-the-scenes footage, blockbuster movies, and immersive music experiences. 
            Discover a revolutionary streaming platform combining cutting-edge entertainment with integrated financial services, 
            all wrapped in a stunning futuristic theater aesthetic.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 px-4">
            <Button 
              onClick={() => navigate({ to: '/streaming-partners' })}
              size="lg"
              className="w-full sm:w-auto px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 group"
            >
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
              Explore Streaming
            </Button>
            <Button 
              onClick={() => navigate({ to: '/wallet' })}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg rounded-xl font-semibold border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all hover:scale-105"
            >
              Access Wallet
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
