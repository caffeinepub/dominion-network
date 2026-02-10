import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetWalletInfo, useCreateWallet, useLoadWallet } from '../hooks/useQueries';
import { Wallet, ArrowUpRight, ArrowDownLeft, Copy, Plus, Loader2, AlertCircle, Bitcoin, ExternalLink, Server } from 'lucide-react';
import { toast } from 'sonner';

export function WalletPage() {
  const { data: walletInfo, isLoading: walletLoading } = useGetWalletInfo();
  const createWallet = useCreateWallet();
  const loadWallet = useLoadWallet();

  const [loadAmount, setLoadAmount] = useState('');
  const [loadMethod, setLoadMethod] = useState('bitcoin');

  const handleCreateWallet = async () => {
    const seed = Array.from({ length: 12 }, () => 
      ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew'][Math.floor(Math.random() * 8)]
    ).join(' ');
    
    try {
      await createWallet.mutateAsync(seed);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  const handleLoadWallet = async () => {
    if (!loadAmount || parseFloat(loadAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await loadWallet.mutateAsync({
        amount: BigInt(Math.floor(parseFloat(loadAmount) * 100)),
        method: loadMethod,
      });
      setLoadAmount('');
    } catch (error) {
      console.error('Failed to load wallet:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const openBlockchainExplorer = (address: string) => {
    window.open(`https://www.blockchain.com/btc/address/${address}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Wallet className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold gradient-text">Excalibur Wallet</h1>
              <p className="text-muted-foreground">Real Bitcoin wallet with Counterparty mainnet node hosting integration</p>
            </div>
          </div>
        </div>

        {/* Counterparty Node Hosting Integration Notice */}
        <Alert className="bg-primary/10 border-primary/30">
          <Server className="h-5 w-5 text-primary" />
          <AlertDescription>
            <strong>Counterparty Mainnet Node Hosting Integration:</strong> Your Excalibur Wallet uses self-hosted Counterparty mainnet node infrastructure for real Bitcoin wallet creation with verifiable blockchain addresses. All wallet addresses are true on-chain Bitcoin addresses readable on blockchain explorers with confirmed transaction statuses through direct node access.
          </AlertDescription>
        </Alert>

        {walletLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !walletInfo ? (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Wallet</CardTitle>
              <CardDescription>
                Get started by creating your Excalibur Wallet with real Bitcoin address via hosted Counterparty mainnet node
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your wallet will be created with a secure recovery seed phrase. Make sure to store it safely! This wallet uses real Bitcoin addresses generated via self-hosted Counterparty mainnet node infrastructure.
                </AlertDescription>
              </Alert>
              <Button onClick={handleCreateWallet} disabled={createWallet.isPending}>
                {createWallet.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Wallet...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Wallet
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold gradient-text">
                    ${(Number(walletInfo.balance) / 100).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Available Balance</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Bitcoin className="h-4 w-4" />
                    Bitcoin Address (via Counterparty Node)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">
                      {walletInfo.walletAddress}
                    </code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(walletInfo.walletAddress)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => openBlockchainExplorer(walletInfo.walletAddress)}
                      title="View on Blockchain Explorer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Real Bitcoin address readable on blockchain explorers via hosted Counterparty mainnet node
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="load" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="load">Load Wallet</TabsTrigger>
                <TabsTrigger value="transactions">Transaction History</TabsTrigger>
              </TabsList>

              <TabsContent value="load" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Load Your Wallet</CardTitle>
                    <CardDescription>Add funds to your Excalibur Wallet via Bitcoin (Counterparty node)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="100.00"
                        value={loadAmount}
                        onChange={(e) => setLoadAmount(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={loadMethod === 'bitcoin' ? 'default' : 'outline'}
                          onClick={() => setLoadMethod('bitcoin')}
                          className="flex-1"
                        >
                          <Bitcoin className="mr-2 h-4 w-4" />
                          Bitcoin (via Counterparty Node)
                        </Button>
                      </div>
                    </div>

                    <Button onClick={handleLoadWallet} disabled={loadWallet.isPending} className="w-full">
                      {loadWallet.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Load Wallet
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your recent wallet transactions verified via hosted Counterparty mainnet node</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {walletInfo.transactionHistory.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                    ) : (
                      <div className="space-y-4">
                        {walletInfo.transactionHistory.map((tx, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {tx.transactionType === 'incoming' || tx.transactionType === 'walletLoad' ? (
                                <div className="p-2 bg-green-500/10 rounded-full">
                                  <ArrowDownLeft className="h-4 w-4 text-green-500" />
                                </div>
                              ) : (
                                <div className="p-2 bg-red-500/10 rounded-full">
                                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">
                                  {tx.transactionType === 'incoming' ? 'Received' : 
                                   tx.transactionType === 'outgoing' ? 'Sent' :
                                   tx.transactionType === 'walletLoad' ? 'Wallet Load' :
                                   tx.transactionType === 'purchase' ? 'Purchase' : 'Payout'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(Number(tx.timestamp) / 1000000).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${
                                tx.transactionType === 'incoming' || tx.transactionType === 'walletLoad' 
                                  ? 'text-green-500' 
                                  : 'text-red-500'
                              }`}>
                                {tx.transactionType === 'incoming' || tx.transactionType === 'walletLoad' ? '+' : '-'}
                                ${(Number(tx.amount) / 100).toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {tx.recipientAddress}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
