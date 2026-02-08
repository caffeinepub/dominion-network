import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Play, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function FlixiodTestPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate({ to: '/streaming-partners' })}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Streaming Partners
        </Button>

        <div className="relative">
          <img 
            src="/assets/generated/flixiod-banner.dim_800x200.png" 
            alt="Flixiod Streaming" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <div className="flex items-center gap-4 mb-4">
            <img 
              src="/assets/generated/flixiod-icon.dim_256x256.png" 
              alt="Flixiod" 
              className="h-16 w-16 rounded-lg"
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tight gradient-text">Flixiod</h1>
              <p className="text-muted-foreground text-lg">
                Test streaming integration for movies and TV shows
              </p>
            </div>
          </div>
        </div>

        <Alert className="bg-primary/10 border-primary/30">
          <Play className="h-5 w-5 text-primary" />
          <AlertDescription>
            <strong>Streaming Test Integration:</strong> This page allows you to test Flixiod streaming capabilities. Use the embedded player below or open in a new tab for full-screen experience.
          </AlertDescription>
        </Alert>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>Flixiod Streaming Player</CardTitle>
            <CardDescription>Test movies and TV shows streaming integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              <iframe
                src="https://www.flixiod.com"
                className="w-full h-full"
                title="Flixiod Streaming"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1" 
                onClick={() => window.open('https://www.flixiod.com', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Flixiod in New Tab
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>About Flixiod Integration</CardTitle>
            <CardDescription>Testing streaming capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Test streaming of movies and TV shows through Flixiod platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Embedded player for in-app testing experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Open in new tab option for full-screen streaming</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Integration testing for Dominion Network streaming partners</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
