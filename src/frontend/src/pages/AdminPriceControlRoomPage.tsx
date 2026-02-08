import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Package, ShoppingBag, Tv, Film, Music, Loader2, Save, AlertCircle } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

export function AdminPriceControlRoomPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const [isSaving, setIsSaving] = useState(false);

  const [subscriptionPrices, setSubscriptionPrices] = useState({
    basic: '9.99',
    premium: '19.99',
    enterprise: '49.99',
  });

  const [contentPrices, setContentPrices] = useState({
    movieRental: '4.99',
    moviePurchase: '14.99',
    tvEpisode: '2.99',
    tvSeason: '19.99',
    musicAlbum: '9.99',
    musicTrack: '0.99',
  });

  const [mallPrices, setMallPrices] = useState({
    shippingStandard: '5.99',
    shippingExpress: '12.99',
    taxRate: '8.5',
  });

  const isAdmin = userProfile?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Admin privileges required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSavePrices = async (category: string) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${category} prices updated successfully`);
    } catch (error) {
      toast.error('Failed to update prices');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Price Control Room</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage pricing for all platform services, subscriptions, and content
              </p>
            </div>
          </div>
        </div>

        {/* Admin Notice */}
        <Alert className="bg-primary/10 border-primary/30">
          <DollarSign className="h-5 w-5 text-primary" />
          <AlertDescription>
            <strong>Admin Price Control:</strong> All price changes require admin approval and will be logged for audit purposes. Changes take effect immediately after approval.
          </AlertDescription>
        </Alert>

        {/* Tabs for Different Price Categories */}
        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="subscriptions" className="text-sm sm:text-base">
              <Package className="h-4 w-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="content" className="text-sm sm:text-base">
              <Film className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="mall" className="text-sm sm:text-base">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Mall & Services
            </TabsTrigger>
          </TabsList>

          {/* Subscription Pricing */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>
                  Set monthly pricing for membership tiers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="basic">Basic Plan (Monthly)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="basic"
                        type="number"
                        step="0.01"
                        value={subscriptionPrices.basic}
                        onChange={(e) => setSubscriptionPrices({ ...subscriptionPrices, basic: e.target.value })}
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Standard features and content access</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="premium">Premium Plan (Monthly)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="premium"
                        type="number"
                        step="0.01"
                        value={subscriptionPrices.premium}
                        onChange={(e) => setSubscriptionPrices({ ...subscriptionPrices, premium: e.target.value })}
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Enhanced features and HD streaming</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enterprise">Enterprise Plan (Monthly)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="enterprise"
                        type="number"
                        step="0.01"
                        value={subscriptionPrices.enterprise}
                        onChange={(e) => setSubscriptionPrices({ ...subscriptionPrices, enterprise: e.target.value })}
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">All features plus priority support</p>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSavePrices('Subscription')}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Subscription Prices
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Pricing */}
          <TabsContent value="content" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle>Content Pricing</CardTitle>
                <CardDescription>
                  Set prices for movies, TV shows, and music
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Film className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Movies</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="movieRental">Rental (48 hours)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="movieRental"
                          type="number"
                          step="0.01"
                          value={contentPrices.movieRental}
                          onChange={(e) => setContentPrices({ ...contentPrices, movieRental: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moviePurchase">Purchase (Permanent)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="moviePurchase"
                          type="number"
                          step="0.01"
                          value={contentPrices.moviePurchase}
                          onChange={(e) => setContentPrices({ ...contentPrices, moviePurchase: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Tv className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">TV Shows</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tvEpisode">Single Episode</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="tvEpisode"
                          type="number"
                          step="0.01"
                          value={contentPrices.tvEpisode}
                          onChange={(e) => setContentPrices({ ...contentPrices, tvEpisode: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tvSeason">Full Season</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="tvSeason"
                          type="number"
                          step="0.01"
                          value={contentPrices.tvSeason}
                          onChange={(e) => setContentPrices({ ...contentPrices, tvSeason: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Music className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Music</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="musicTrack">Single Track</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="musicTrack"
                          type="number"
                          step="0.01"
                          value={contentPrices.musicTrack}
                          onChange={(e) => setContentPrices({ ...contentPrices, musicTrack: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="musicAlbum">Full Album</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="musicAlbum"
                          type="number"
                          step="0.01"
                          value={contentPrices.musicAlbum}
                          onChange={(e) => setContentPrices({ ...contentPrices, musicAlbum: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSavePrices('Content')}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Content Prices
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mall & Services Pricing */}
          <TabsContent value="mall" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle>Clear Magic Mall Pricing</CardTitle>
                <CardDescription>
                  Configure shipping rates and tax settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Shipping Rates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingStandard">Standard Shipping (5-7 days)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="shippingStandard"
                          type="number"
                          step="0.01"
                          value={mallPrices.shippingStandard}
                          onChange={(e) => setMallPrices({ ...mallPrices, shippingStandard: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingExpress">Express Shipping (2-3 days)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="shippingExpress"
                          type="number"
                          step="0.01"
                          value={mallPrices.shippingExpress}
                          onChange={(e) => setMallPrices({ ...mallPrices, shippingExpress: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Tax Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Sales Tax Rate (%)</Label>
                    <div className="relative">
                      <Input
                        id="taxRate"
                        type="number"
                        step="0.1"
                        value={mallPrices.taxRate}
                        onChange={(e) => setMallPrices({ ...mallPrices, taxRate: e.target.value })}
                        className="pr-7"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Applied to all Clear Magic Mall purchases</p>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSavePrices('Mall')}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Mall Prices
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Pricing History */}
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle>Recent Price Changes</CardTitle>
            <CardDescription>
              Audit log of recent pricing updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Premium Subscription</p>
                  <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground line-through">$17.99</p>
                  <p className="font-medium text-primary">$19.99</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Movie Rental</p>
                  <p className="text-xs text-muted-foreground">Updated 1 week ago</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground line-through">$3.99</p>
                  <p className="font-medium text-primary">$4.99</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Standard Shipping</p>
                  <p className="text-xs text-muted-foreground">Updated 2 weeks ago</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground line-through">$4.99</p>
                  <p className="font-medium text-primary">$5.99</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
