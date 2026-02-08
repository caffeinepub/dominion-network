import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { CreditCard, Bitcoin, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';

export function CreditCardPage() {
  const { identity } = useInternetIdentity();
  const [amount, setAmount] = useState('');

  if (!identity) {
    return (
      <div className="container py-12">
        <Alert>
          <AlertDescription>Please login to access your Excalibur Credit Card.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleLoadBalance = async () => {
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    toast.info('Credit card functionality coming soon');
  };

  // Mock card number starting with 74
  const mockCardNumber = '7412 3456 7890 1234';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <CreditCard className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">Excalibur Secured Credit Card</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Standalone credit system, not Visa-branded</p>
            </div>
          </div>

          <Card className="border-primary/20 shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Your Excalibur Card
              </CardTitle>
              <CardDescription>Card numbers beginning with "74" • Expiration: 2033</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-6">
                <div className="relative group">
                  {/* Holographic effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                  
                  {/* Card image with hologram effect - using v36-tech version */}
                  <div className="relative">
                    <img 
                      src="/assets/generated/excalibur-card-v36-tech.dim_400x250.png" 
                      alt="Excalibur Card with Hologram" 
                      className="w-full max-w-md mx-auto rounded-xl shadow-2xl shadow-primary/30 transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Animated holographic glow */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-holographic pointer-events-none" />
                    
                    {/* Card details overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="font-mono text-lg sm:text-xl tracking-wider drop-shadow-lg">{mockCardNumber}</p>
                      <div className="flex justify-between mt-2 text-xs sm:text-sm drop-shadow-lg">
                        <span>Exp: 2033-03</span>
                        <span className="font-semibold">Excalibur</span>
                      </div>
                    </div>
                    
                    {/* Sword-in-cube logo hologram indicator */}
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                      <span className="text-xs text-white/80 drop-shadow-lg">Hologram Active</span>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-primary/5 border-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    This card features an animated sword-in-the-cube hologram for enhanced security. Card automatically generated for applications before March 1, 2027.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5" />
                Load Card Balance
              </CardTitle>
              <CardDescription>Add funds using Bitcoin, WealthTicket, or Perfectcerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-base"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button onClick={handleLoadBalance} className="w-full">
                  Load with Bitcoin
                </Button>
                <Button onClick={handleLoadBalance} variant="outline" className="w-full">
                  Load with WealthTicket
                </Button>
                <Button onClick={handleLoadBalance} variant="outline" className="w-full">
                  Load with Perfectcerts
                </Button>
              </div>
              <Alert>
                <AlertDescription className="text-xs sm:text-sm">
                  All card load requests require admin approval for security verification.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
              <CardDescription>Use your Excalibur Card or Bitcoin for purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm sm:text-base">Excalibur Credit Card</span>
                  </div>
                  <span className="text-xs sm:text-sm text-green-500 font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bitcoin className="h-5 w-5 text-orange-500" />
                    <span className="font-medium text-sm sm:text-base">Bitcoin Payment</span>
                  </div>
                  <span className="text-xs sm:text-sm text-green-500 font-semibold">Available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
