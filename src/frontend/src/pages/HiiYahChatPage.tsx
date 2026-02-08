import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Video, Phone, Users, Radio, Copy, Check, UserPlus, Film, Zap } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ChatRoomComponent } from '../components/ChatRoomComponent';
import { VideoCallComponent } from '../components/VideoCallComponent';
import { SharedPlaybackComponent } from '../components/SharedPlaybackComponent';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function HiiYahChatPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [connectionCodeInput, setConnectionCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<bigint | null>(null);
  const [selectedCall, setSelectedCall] = useState<bigint | null>(null);
  const [myConnectionCode] = useState<string>('');
  const [connections] = useState<any[]>([]);
  const [chatRooms] = useState<any[]>([]);
  const [activeCalls] = useState<any[]>([]);
  const [connectionRequests] = useState<any[]>([]);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
      toast.error('Please login to access HiiYah Chat');
    }
  }, [isAuthenticated, navigate]);

  const handleGenerateCode = async () => {
    toast.info('Connection code generation coming soon');
  };

  const handleCopyCode = () => {
    if (myConnectionCode) {
      navigator.clipboard.writeText(myConnectionCode);
      setCopiedCode(true);
      toast.success('Connection code copied!');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRequestConnection = async () => {
    if (!connectionCodeInput.trim()) {
      toast.error('Please enter a connection code');
      return;
    }
    toast.info('Connection request feature coming soon');
    setConnectionCodeInput('');
  };

  const handleApproveRequest = async (requestId: bigint) => {
    toast.info('Connection approval feature coming soon');
  };

  const handleRejectRequest = async (requestId: bigint) => {
    toast.info('Connection rejection feature coming soon');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Hero Section with Rocket.Chat Badge - using v2-verified-people-free version */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 p-6 sm:p-8 md:p-12">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="/assets/generated/rocket-chat-interface-v2-verified-people-free.dim_1000x600.png" 
            alt="Rocket.Chat Integration" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center space-y-3 sm:space-y-4">
          <div className="flex justify-center mb-3 sm:mb-4">
            <img 
              src="/assets/generated/hiiyah-chat-logo-transparent.dim_300x100.png" 
              alt="HiiYah Chat" 
              className="h-12 sm:h-16 md:h-20 w-auto"
            />
          </div>
          <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 mb-2">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Powered by Open-Source Rocket.Chat
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text px-2">
            Futuristic Real-Time Media Broadcast
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Authentic real-time communication powered by open-source <strong>Rocket.Chat</strong> code with video, voice, text chat, file sharing, and synchronized media playback
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4">
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
              <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Video & Voice
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Real-Time Chat
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
              <Film className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Shared Playback
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
              <Radio className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Live Broadcasting
            </Badge>
          </div>
        </div>
      </div>

      {/* Open-Source Rocket.Chat Integration Notice */}
      <Alert className="bg-primary/10 border-primary/30">
        <Zap className="h-5 w-5 text-primary" />
        <AlertDescription>
          <strong>Open-Source Rocket.Chat Integration:</strong> HiiYah Chat uses open-source Rocket.Chat code for enterprise-grade messaging infrastructure, providing authentic real-time communication with text, file sharing, voice, and video capabilities integrated with Jitsi Meet video conferencing.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="connections" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2 h-auto p-1">
          <TabsTrigger value="connections" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3">
            <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Connections</span>
            <span className="sm:hidden">Connect</span>
          </TabsTrigger>
          <TabsTrigger value="chats" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3">
            <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Chats
          </TabsTrigger>
          <TabsTrigger value="calls" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3">
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Calls
          </TabsTrigger>
          <TabsTrigger value="playback" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 col-span-2 sm:col-span-1">
            <Film className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Watch Together</span>
            <span className="sm:hidden">Watch</span>
          </TabsTrigger>
          <TabsTrigger value="broadcasts" className="text-xs sm:text-sm py-2 sm:py-2.5 px-2 sm:px-3 col-span-2 sm:col-span-1 lg:col-span-1">
            <Radio className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Broadcasts</span>
            <span className="sm:hidden">Live</span>
          </TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4 sm:space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* My Connection Code */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">My Connection Code</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Share this code with others to connect via open-source Rocket.Chat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {myConnectionCode ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input value={myConnectionCode} readOnly className="font-mono text-sm" />
                      <Button onClick={handleCopyCode} size="icon" variant="outline" className="shrink-0">
                        {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="p-3 sm:p-4 bg-muted rounded-lg">
                      <img 
                        src="/assets/generated/connection-code-display-transparent.dim_400x200.png" 
                        alt="Connection Code" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                ) : (
                  <Button onClick={handleGenerateCode} className="w-full text-sm sm:text-base">
                    Generate Connection Code
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Connect with Others */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Connect with Others</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Enter a connection code to send a Rocket.Chat request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Enter connection code..."
                    value={connectionCodeInput}
                    onChange={(e) => setConnectionCodeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRequestConnection()}
                    className="text-sm flex-1"
                  />
                  <Button onClick={handleRequestConnection} className="text-sm sm:text-base shrink-0">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connection Requests */}
          {connectionRequests.length > 0 && (
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Pending Requests</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Approve or reject connection requests</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] sm:h-[300px]">
                  <div className="space-y-3">
                    {connectionRequests.map((request) => (
                      <div key={request.id.toString()} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{request.requester.toString().slice(0, 20)}...</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">Code: {request.connectionCode}</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button size="sm" onClick={() => handleApproveRequest(request.id)} className="flex-1 sm:flex-none text-xs sm:text-sm">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRejectRequest(request.id)} className="flex-1 sm:flex-none text-xs sm:text-sm">
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* My Connections */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">My Connections ({connections.length})</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Users you're connected with via open-source Rocket.Chat</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm sm:text-base">No connections yet. Share your code to get started!</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chats Tab */}
        <TabsContent value="chats" className="space-y-4 sm:space-y-6 mt-4">
          {selectedRoom ? (
            <ChatRoomComponent roomId={selectedRoom} onClose={() => setSelectedRoom(null)} />
          ) : (
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">My Chat Rooms</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Active conversations and group chats powered by open-source Rocket.Chat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12 space-y-4">
                  <img 
                    src="/assets/generated/rocket-chat-interface-v2-verified-people-free.dim_1000x600.png" 
                    alt="Rocket.Chat Interface" 
                    className="w-full max-w-md mx-auto rounded-lg opacity-50"
                  />
                  <p className="text-muted-foreground text-sm sm:text-base px-4">No active chats. Start a conversation with your connections!</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Calls Tab */}
        <TabsContent value="calls" className="space-y-4 sm:space-y-6 mt-4">
          {selectedCall ? (
            <VideoCallComponent sessionId={selectedCall} onClose={() => setSelectedCall(null)} />
          ) : (
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Active Calls</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Ongoing audio and video calls via Jitsi Meet</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-6 sm:py-8 text-sm sm:text-base">No active calls</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Shared Playback Tab */}
        <TabsContent value="playback" className="space-y-4 sm:space-y-6 mt-4">
          <SharedPlaybackComponent />
        </TabsContent>

        {/* Broadcasts Tab */}
        <TabsContent value="broadcasts" className="space-y-4 sm:space-y-6 mt-4">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Live Broadcasts</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Watch live streams and broadcasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 sm:py-12 space-y-4">
                <img 
                  src="/assets/generated/live-broadcast-icon-transparent.dim_64x64.png" 
                  alt="Live Broadcast" 
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto"
                />
                <p className="text-muted-foreground text-sm sm:text-base px-4">No active broadcasts at the moment</p>
                <Button variant="outline" className="text-sm sm:text-base">Request to Go Live</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
