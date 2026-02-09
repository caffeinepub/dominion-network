import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { 
  useGetActiveTermsAndConditions, 
  useCreateTermsAndConditions, 
  useUpdateTermsAndConditions 
} from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';

export function AdminPricingTermsPage() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: activeTerms, isLoading: termsLoading } = useGetActiveTermsAndConditions();
  const createTerms = useCreateTermsAndConditions();
  const updateTerms = useUpdateTermsAndConditions();

  const [termsData, setTermsData] = useState({
    title: '',
    content: '',
    version: '',
    isActive: true,
  });

  const [pricingData, setPricingData] = useState({
    basicPrice: '',
    premiumPrice: '',
    enterprisePrice: '',
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

  const handleLoadActiveTerms = () => {
    if (activeTerms) {
      setTermsData({
        title: activeTerms.title,
        content: activeTerms.content,
        version: activeTerms.version,
        isActive: activeTerms.isActive,
      });
    }
  };

  const handleSaveTerms = async () => {
    try {
      if (activeTerms) {
        await updateTerms.mutateAsync({
          id: activeTerms.id,
          title: termsData.title,
          content: termsData.content,
          version: termsData.version,
          isActive: termsData.isActive,
        });
      } else {
        await createTerms.mutateAsync({
          title: termsData.title,
          content: termsData.content,
          version: termsData.version,
          isActive: termsData.isActive,
        });
      }
    } catch (error) {
      console.error('Failed to save terms:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Pricing & Terms Management</h1>
        <p className="text-muted-foreground">
          Manage subscription pricing and platform terms and conditions
        </p>
      </div>

      <Tabs defaultValue="terms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="terms">
            <FileText className="h-4 w-4 mr-2" />
            Terms & Conditions
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <DollarSign className="h-4 w-4 mr-2" />
            Pricing Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Terms and Conditions Editor</CardTitle>
              <CardDescription>
                Create or update the platform's terms and conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {activeTerms && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Active terms found (Version {activeTerms.version}).{' '}
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={handleLoadActiveTerms}
                    >
                      Load for editing
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Dominion Network Terms and Conditions"
                  value={termsData.title}
                  onChange={(e) => setTermsData({ ...termsData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  placeholder="e.g., 1.0"
                  value={termsData.version}
                  onChange={(e) => setTermsData({ ...termsData, version: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter the full terms and conditions text..."
                  value={termsData.content}
                  onChange={(e) => setTermsData({ ...termsData, content: e.target.value })}
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  You can use HTML formatting for better presentation
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Active Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this version visible to users
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={termsData.isActive}
                  onCheckedChange={(checked) => setTermsData({ ...termsData, isActive: checked })}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveTerms}
                  disabled={createTerms.isPending || updateTerms.isPending || !termsData.title || !termsData.content}
                  className="flex-1"
                >
                  {(createTerms.isPending || updateTerms.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Terms
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/terms' })}
                >
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Subscription Pricing</CardTitle>
              <CardDescription>
                Configure pricing for membership tiers and subscription plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Pricing management is coming soon. This feature will allow you to set and update subscription prices for different membership tiers.
                </AlertDescription>
              </Alert>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="basic">Basic Plan (Monthly)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="basic"
                      type="number"
                      placeholder="9.99"
                      value={pricingData.basicPrice}
                      onChange={(e) => setPricingData({ ...pricingData, basicPrice: e.target.value })}
                      className="pl-7"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="premium">Premium Plan (Monthly)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="premium"
                      type="number"
                      placeholder="19.99"
                      value={pricingData.premiumPrice}
                      onChange={(e) => setPricingData({ ...pricingData, premiumPrice: e.target.value })}
                      className="pl-7"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enterprise">Enterprise Plan (Monthly)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="enterprise"
                      type="number"
                      placeholder="49.99"
                      value={pricingData.enterprisePrice}
                      onChange={(e) => setPricingData({ ...pricingData, enterprisePrice: e.target.value })}
                      className="pl-7"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <Button disabled className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Pricing (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
