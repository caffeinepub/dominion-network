import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetActiveTerms } from '../hooks/useQueries';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export function TermsPage() {
  const navigate = useNavigate();
  const { data: activeTerms, isLoading } = useGetActiveTerms();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            ← Back to Home
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="h-6 w-6" />
              Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !activeTerms ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Terms and conditions are not currently available. Please check back later or contact support.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{activeTerms.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Version {activeTerms.version} • Last updated:{' '}
                    {new Date(Number(activeTerms.createdAt) / 1000000).toLocaleDateString()}
                  </p>
                </div>

                <div 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: activeTerms.content }}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
