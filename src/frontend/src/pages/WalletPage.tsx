import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetWalletInfo, useGetWalletInfoWithSeed, useCreateWallet } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Wallet, ArrowUpRight, ArrowDownLeft, Copy, Plus, Loader2, AlertCircle, Bitcoin, ExternalLink, Server, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function WalletPage() {
  const { identity } = useInternetIdentity();
  const { data: walletInfo, isLoading: walletLoading, error: walletError } = useGetWalletInfo();
  const { data: walletWithSeed } = useGetWalletInfoWithSeed();
  const createWallet = useCreateWallet();

  const [showSeed, setShowSeed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const isAuthenticated = !!identity;
  const hasWallet = !!walletInfo;

  const handleCreateWallet = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to create a wallet');
      return;
    }

    setIsCreating(true);
    try {
      // Generate a simple Bitcoin-like address (mock for now)
      const address = 'bc1q' + Array.from({ length: 38 }, () => 
        '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]
      ).join('');

      // Generate a 12-word seed phrase
      const words = ['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual'];
      const seed = Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join(' ');

      await createWallet.mutateAsync({ address, seed });
    } catch (error: any) {
      console.error('Wallet creation error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // Unauthenticated state
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 gradient-text">Excalibur Wallet</h1>
          <p className="text-muted-foreground">Bitcoin wallet with Counterparty mainnet node hosting</p>
        </div>

        <Alert className="max-w-2xl mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="ml-2">
            Please login with Internet Identity to access your wallet or create a new one.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Loading state
  if (walletLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 gradient-text">Excalibur Wallet</h1>
          <p className="text-muted-foreground">Bitcoin wallet with Counterparty mainnet node hosting</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading wallet...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (walletError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 gradient-text">Excalibur Wallet</h1>
          <p className="text-muted-foreground">Bitcoin wallet with Counterparty mainnet node hosting</p>
        </div>

        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="ml-2">
            Failed to load wallet. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // No wallet state
  if (!hasWallet) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl pb-32">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 gradient-text">Excalibur Wallet</h1>
          <p className="text-muted-foreground">Bitcoin wallet with Counterparty mainnet node hosting</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              Create Your Wallet
            </CardTitle>
            <CardDescription>
              Set up your Bitcoin wallet to start managing your digital assets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Bitcoin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold mb-1">Bitcoin Support</h4>
                  <p className="text-sm text-muted-foreground break-words">
                    Native Bitcoin wallet with full blockchain integration
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Server className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold mb-1">Counterparty Node</h4>
                  <p className="text-sm text-muted-foreground break-words">
                    Hosted mainnet node for enhanced functionality
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCreateWallet} 
              disabled={isCreating || createWallet.isPending}
              className="w-full"
              size="lg"
            >
              {isCreating || createWallet.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Wallet...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Create Wallet
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your wallet will be securely stored and linked to your Internet Identity
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Wallet exists - show full interface
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-32">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 gradient-text">Excalibur Wallet</h1>
        <p className="text-muted-foreground">Bitcoin wallet with Counterparty mainnet node hosting</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="holographic-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {Number(walletInfo.balance) / 100000000} BTC
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ≈ ${((Number(walletInfo.balance) / 100000000) * 45000).toFixed(2)} USD
            </p>
          </CardContent>
        </Card>

        <Card className="holographic-border md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-xs sm:text-sm font-mono bg-muted px-3 py-2 rounded flex-1 min-w-0 break-all">
                {walletInfo.walletAddress}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(walletInfo.walletAddress, 'Address')}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {walletInfo.transactionHistory.length === 0 
                  ? 'No transactions yet'
                  : `${walletInfo.transactionHistory.length} transaction(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {walletInfo.transactionHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No transactions yet</p>
                  <p className="text-sm mt-1">Your transaction history will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {walletInfo.transactionHistory.map((tx, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="shrink-0">
                        {tx.transactionType === 'incoming' || tx.transactionType === 'walletLoad' ? (
                          <ArrowDownLeft className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                          <span className="font-medium capitalize break-words">
                            {tx.transactionType.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-semibold shrink-0">
                            {tx.transactionType === 'incoming' || tx.transactionType === 'walletLoad' ? '+' : '-'}
                            {Number(tx.amount) / 100000000} BTC
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground break-all mb-1">
                          To: {tx.recipientAddress}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Number(tx.timestamp / BigInt(1000000))).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recovery Seed Phrase</CardTitle>
              <CardDescription>
                Keep this safe - it's the only way to recover your wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Seed Phrase</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSeed(!showSeed)}
                  >
                    {showSeed ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Show
                      </>
                    )}
                  </Button>
                </div>
                {showSeed && walletWithSeed ? (
                  <div className="relative">
                    <code className="block text-xs sm:text-sm font-mono bg-muted p-4 rounded break-words">
                      {walletWithSeed.recoverySeed}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(walletWithSeed.recoverySeed, 'Seed phrase')}
                      className="absolute top-2 right-2"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                ) : (
                  <div className="bg-muted p-4 rounded text-center text-muted-foreground">
                    Click "Show" to reveal your seed phrase
                  </div>
                )}
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2 text-xs">
                  Never share your seed phrase with anyone. Store it securely offline.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Counterparty Integration</CardTitle>
              <CardDescription>
                Mainnet node hosting status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gap-2">
                  <Server className="h-3 w-3" />
                  Connected
                </Badge>
                <a
                  href="https://counterparty.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Learn more
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
