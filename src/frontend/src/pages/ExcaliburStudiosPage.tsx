import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Video, Music, Film, Wand2, Settings, Users, Play, Pause, Upload } from 'lucide-react';
import { JitsiMeetIntegration } from '../components/JitsiMeetIntegration';
import { WAN22Integration } from '../components/WAN22Integration';

export function ExcaliburStudiosPage() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Hero Section - using no-people version */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 p-6 sm:p-8 md:p-12">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="/assets/generated/excalibur-studios-workspace-no-people.dim_1200x800.png" 
            alt="Excalibur Studios" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center space-y-3 sm:space-y-4">
          <div className="flex justify-center mb-3 sm:mb-4">
            <img 
              src="/assets/generated/excalibur-studios-logo-transparent.dim_300x100.png" 
              alt="Excalibur Studios" 
              className="h-12 sm:h-16 md:h-20 w-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text px-2">
            Excalibur Studios
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Professional creative workspace with integrated Jitsi Meet video conferencing and WAN 2.2 AI content creation
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4">
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
              <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Jitsi Meet
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
              <Wand2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              WAN 2.2 AI
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Admin Only
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 h-auto p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="jitsi" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3">
            <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Jitsi Meet
          </TabsTrigger>
          <TabsTrigger value="wan22" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3">
            <Wand2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            WAN 2.2
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3">
            <Film className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Projects
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <Video className="h-8 w-8 text-primary" />
                  <Badge>Active</Badge>
                </div>
                <CardTitle className="text-base sm:text-lg mt-2">Jitsi Meet Integration</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Professional video conferencing for creative collaboration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>✓ HD video & audio conferencing</li>
                  <li>✓ Screen sharing & recording</li>
                  <li>✓ Multi-participant support</li>
                  <li>✓ Hero Helper integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <Wand2 className="h-8 w-8 text-accent" />
                  <Badge>Active</Badge>
                </div>
                <CardTitle className="text-base sm:text-lg mt-2">WAN 2.2 AI Engine</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Advanced AI content creation for music, commercials, and motion pictures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>✓ Music composition</li>
                  <li>✓ Commercial production</li>
                  <li>✓ Motion picture creation</li>
                  <li>✓ Hero Helper powered</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <Settings className="h-8 w-8 text-secondary" />
                  <Badge variant="outline">Admin</Badge>
                </div>
                <CardTitle className="text-base sm:text-lg mt-2">Creative Workspace</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Unified interface for all creative production tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>✓ Project management</li>
                  <li>✓ Asset organization</li>
                  <li>✓ Collaboration tools</li>
                  <li>✓ Approval workflows</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Quick Start Guide</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Get started with Excalibur Studios in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary" />
                    Start Video Conference
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Launch Jitsi Meet for team collaboration, creative reviews, or client presentations
                  </p>
                  <Button size="sm" className="w-full mt-2">
                    Open Jitsi Meet
                  </Button>
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-accent" />
                    Create with AI
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Use WAN 2.2 to generate music, commercials, or motion pictures with AI assistance
                  </p>
                  <Button size="sm" className="w-full mt-2">
                    Open WAN 2.2
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jitsi Meet Tab */}
        <TabsContent value="jitsi" className="space-y-4 sm:space-y-6 mt-4">
          <JitsiMeetIntegration />
        </TabsContent>

        {/* WAN 2.2 Tab */}
        <TabsContent value="wan22" className="space-y-4 sm:space-y-6 mt-4">
          <WAN22Integration />
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4 sm:space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Creative Projects</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Manage your ongoing creative productions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 sm:py-12 space-y-4">
                <img 
                  src="/assets/generated/creative-tools-interface-no-people.dim_1000x600.png" 
                  alt="Creative Projects" 
                  className="w-full max-w-2xl mx-auto rounded-lg opacity-50"
                />
                <p className="text-muted-foreground text-sm sm:text-base px-4">
                  No active projects. Start creating with Jitsi Meet or WAN 2.2!
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Project
                  </Button>
                  <Button size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
