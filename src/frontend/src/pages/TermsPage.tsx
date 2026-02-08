import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { useGetActiveTerms } from '../hooks/useQueries';

export function TermsPage() {
  const navigate = useNavigate();
  const { data: terms, isLoading } = useGetActiveTerms();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Terms and Conditions</h1>
            <p className="text-muted-foreground mt-1">Platform usage terms and policies</p>
          </div>
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>Platform Terms</CardTitle>
            {terms && (
              <CardDescription>
                Version {terms.version} - Last updated: {new Date(Number(terms.createdAt) / 1000000).toLocaleDateString()}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading terms...</p>
            ) : terms ? (
              <div className="prose prose-invert max-w-none">
                <h2 className="text-xl font-bold mb-4">{terms.title}</h2>
                <div className="whitespace-pre-wrap text-muted-foreground">{terms.content}</div>
              </div>
            ) : (
              <div className="space-y-4 text-muted-foreground">
                <p>Terms and conditions will be available soon.</p>
                <p>Please check back later for our platform usage policies.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
