import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Music, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function IHeartRadioTestPage() {
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
            src="/assets/generated/iheartradio-banner.dim_800x200.png" 
            alt="iHeartRadio Streaming" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <div className="flex items-center gap-4 mb-4">
            <img 
              src="/assets/generated/iheartradio-icon.dim_256x256.png" 
              alt="iHeartRadio" 
              className="h-16 w-16 rounded-lg"
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tight gradient-text">iHeartRadio</h1>
              <p className="text-muted-foreground text-lg">
                Test streaming integration for music and radio
              </p>
            </div>
          </div>
        </div>

        <Alert className="bg-primary/10 border-primary/30">
          <Music className="h-5 w-5 text-primary" />
          <AlertDescription>
            <strong>Music Streaming Test Integration:</strong> This page allows you to test iHeartRadio streaming capabilities. Use the embedded player below or open in a new tab for full-screen experience.
          </AlertDescription>
        </Alert>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>iHeartRadio Streaming Player</CardTitle>
            <CardDescription>Test music and radio streaming integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              <iframe
                src="https://www.iheart.com"
                className="w-full h-full"
                title="iHeartRadio Streaming"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1" 
                onClick={() => window.open('https://www.iheart.com', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open iHeartRadio in New Tab
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>About iHeartRadio Integration</CardTitle>
            <CardDescription>Testing music streaming capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Test streaming of music and radio stations through iHeartRadio platform</span>
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
                <span>Integration testing for Dominion Network music streaming partners</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
