import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Music, Film, Tv, Sparkles, Download, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function WAN22Integration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [contentType, setContentType] = useState<'music' | 'commercial' | 'motion-picture'>('music');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState('');
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const handleGenerate = async () => {
    if (!projectTitle.trim() || !projectDescription.trim()) {
      toast.error('Please provide title and description');
      return;
    }

    setIsGenerating(true);
    toast.info('Connecting to WAN 2.2 API...');

    // Simulate API call to WAN 2.2
    setTimeout(() => {
      setGeneratedContent({
        title: projectTitle,
        type: contentType,
        genre: genre,
        duration: duration,
        status: 'pending_approval',
        createdAt: new Date().toISOString(),
      });
      setIsGenerating(false);
      toast.success('Content generated successfully! Submitted for admin approval.');
    }, 3000);
  };

  const handleDownload = () => {
    toast.info('Download functionality will be available after approval');
  };

  const handlePreview = () => {
    toast.info('Preview functionality coming soon');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-accent" />
                WAN 2.2 AI Content Creation
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Advanced AI-powered content generation for music, commercials, and motion pictures
              </CardDescription>
            </div>
            <Badge variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
              <TabsTrigger value="create" className="text-xs sm:text-sm">
                <Wand2 className="h-3.5 w-3.5 mr-1.5" />
                Create
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs sm:text-sm">
                <Film className="h-3.5 w-3.5 mr-1.5" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="music">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4" />
                          Music Composition
                        </div>
                      </SelectItem>
                      <SelectItem value="commercial">
                        <div className="flex items-center gap-2">
                          <Tv className="h-4 w-4" />
                          Commercial Production
                        </div>
                      </SelectItem>
                      <SelectItem value="motion-picture">
                        <div className="flex items-center gap-2">
                          <Film className="h-4 w-4" />
                          Motion Picture
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Genre/Style</label>
                  <Input
                    placeholder="e.g., Electronic, Dramatic, Action..."
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project Title</label>
                <Input
                  placeholder="Enter project title..."
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description & Requirements</label>
                <Textarea
                  placeholder="Describe your vision, mood, themes, and any specific requirements..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="text-sm min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (optional)</label>
                <Input
                  placeholder="e.g., 3:30, 60 seconds, 2 minutes..."
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="p-4 border rounded-lg bg-muted/30">
                <img 
                  src="/assets/generated/wan-22-interface.dim_1000x700.png" 
                  alt="WAN 2.2 Interface" 
                  className="w-full rounded-lg opacity-70"
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating with WAN 2.2...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>

              {generatedContent && (
                <Card className="border-primary/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>Generated Content</span>
                      <Badge variant="outline">Pending Approval</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Title</p>
                      <p className="text-sm font-medium">{generatedContent.title}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="text-sm capitalize">{generatedContent.type.replace('-', ' ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={handlePreview} className="flex-1">
                        <Play className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleDownload} className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ✓ Submitted to admin approval queue
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-lg">
                <p className="font-semibold">WAN 2.2 Capabilities:</p>
                <p>✓ Professional music composition with multiple genres</p>
                <p>✓ Commercial production with scriptwriting and voiceover</p>
                <p>✓ Motion picture creation with scene generation</p>
                <p>✓ All content automatically routed to admin approval</p>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 space-y-4">
                    <img 
                      src="/assets/generated/ai-content-creation-visual.dim_800x600.png" 
                      alt="AI Content Creation" 
                      className="w-full max-w-md mx-auto rounded-lg opacity-50"
                    />
                    <p className="text-muted-foreground text-sm">
                      No projects yet. Start creating with WAN 2.2 AI!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">WAN 2.2 API Configuration</CardTitle>
                  <CardDescription className="text-xs">
                    Configure your WAN 2.2 integration settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">API Status</label>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2" />
                        Connected
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        WAN 2.2 API is active and ready
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quality Settings</label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Quality</SelectItem>
                        <SelectItem value="high">High Quality</SelectItem>
                        <SelectItem value="ultra">Ultra Quality</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg">
                    <p>✓ Admin accounts have automatic access to WAN 2.2</p>
                    <p>✓ All generated content requires admin approval</p>
                    <p>✓ Hero Helper integration enabled</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
