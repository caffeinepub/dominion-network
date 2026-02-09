import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, FileText } from 'lucide-react';
import { useGetActiveTermsAndConditions } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export function TermsPage() {
  const navigate = useNavigate();
  const { data: terms, isLoading } = useGetActiveTermsAndConditions();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl gradient-text">
                {isLoading ? <Skeleton className="h-8 w-64" /> : terms?.title || 'Terms and Conditions'}
              </CardTitle>
              {!isLoading && terms?.version && (
                <CardDescription className="text-sm mt-1">
                  Version {terms.version}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : terms ? (
            <div 
              className="text-foreground/80 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: terms.content }}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Terms and Conditions are not currently available. Please contact support for more information.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
