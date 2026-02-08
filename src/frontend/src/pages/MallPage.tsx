import { ShoppingBag, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function MallPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Header with Clear Magic Mall Branding */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <img 
              src="/assets/generated/clear-magic-mall-banner-enhanced.dim_800x300.png" 
              alt="Clear Magic Mall" 
              className="h-16 sm:h-20 w-auto object-contain"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight gradient-text">Clear Magic Mall</h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">Shop for exclusive goods and services</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base"
            />
          </div>

          {/* Coming Soon */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl">Mall Coming Soon</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Browse and purchase goods and services with your Excalibur Credit Card or Bitcoin</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                The Clear Magic Mall is currently under development. Soon you'll be able to shop for a wide variety of products and services, all purchasable with your Excalibur Credit Card or Bitcoin via Excalibur Wallet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
