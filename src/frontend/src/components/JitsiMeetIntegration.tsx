import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Mic, MicOff, Monitor, Users, Settings, X, Play, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export function JitsiMeetIntegration() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [displayName, setDisplayName] = useState('Admin User');
  const [participants, setParticipants] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [heroAssistEnabled, setHeroAssistEnabled] = useState(false);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);

  useEffect(() => {
    // Load Jitsi Meet API script
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      toast.success('Jitsi Meet API loaded successfully');
    };
    script.onerror = () => {
      toast.error('Failed to load Jitsi Meet API');
    };
    document.body.appendChild(script);

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
      document.body.removeChild(script);
    };
  }, []);

  const startConference = () => {
    if (!isLoaded || !jitsiContainerRef.current) {
      toast.error('Jitsi Meet is not ready');
      return;
    }

    if (!roomName.trim()) {
      toast.error('Please enter a room name');
      return;
    }

    const domain = 'meet.jit.si';
    const options = {
      roomName: roomName.trim(),
      width: '100%',
      height: 600,
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
        ],
      },
      userInfo: {
        displayName: displayName,
      },
    };

    jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

    jitsiApiRef.current.addEventListener('videoConferenceJoined', () => {
      setIsActive(true);
      toast.success('Joined conference successfully');
    });

    jitsiApiRef.current.addEventListener('videoConferenceLeft', () => {
      setIsActive(false);
      setParticipants(0);
      toast.info('Left conference');
    });

    jitsiApiRef.current.addEventListener('participantJoined', () => {
      setParticipants(prev => prev + 1);
    });

    jitsiApiRef.current.addEventListener('participantLeft', () => {
      setParticipants(prev => Math.max(0, prev - 1));
    });

    jitsiApiRef.current.addEventListener('audioMuteStatusChanged', (event: any) => {
      setIsMuted(event.muted);
    });

    jitsiApiRef.current.addEventListener('videoMuteStatusChanged', (event: any) => {
      setIsVideoOff(event.muted);
    });
  };

  const endConference = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
      setIsActive(false);
      setParticipants(0);
      toast.info('Conference ended');
    }
  };

  const toggleMute = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleAudio');
    }
  };

  const toggleVideo = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleVideo');
    }
  };

  const toggleScreenShare = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleShareScreen');
      toast.info('Screen sharing toggled');
    }
  };

  const enableHeroAssist = () => {
    setHeroAssistEnabled(!heroAssistEnabled);
    toast.success(heroAssistEnabled ? 'Hero Helper disabled in conference' : 'Hero Helper enabled in conference');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Jitsi Meet Video Conferencing
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Professional video conferencing integrated with Hero Helper AI assistance
              </CardDescription>
            </div>
            {isActive && (
              <Badge variant="default" className="animate-pulse">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Live
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isActive ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room Name</label>
                  <Input
                    placeholder="Enter room name..."
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input
                    placeholder="Your name..."
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/30">
                <img 
                  src="/assets/generated/jitsi-meet-interface-no-people.dim_1000x600.png" 
                  alt="Jitsi Meet Interface" 
                  className="w-full rounded-lg opacity-70"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={startConference} disabled={!isLoaded} className="flex-1 sm:flex-none">
                  <Play className="h-4 w-4 mr-2" />
                  Start Conference
                </Button>
                <Button variant="outline" onClick={enableHeroAssist} className="flex-1 sm:flex-none">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {heroAssistEnabled ? 'Disable' : 'Enable'} Hero
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>✓ HD video and audio quality</p>
                <p>✓ Screen sharing and recording</p>
                <p>✓ Multi-participant support</p>
                <p>✓ Hero Helper AI assistance available</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    {participants} Participants
                  </Badge>
                  {heroAssistEnabled && (
                    <Badge variant="secondary" className="animate-pulse">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Hero Active
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant={isMuted ? 'destructive' : 'outline'} onClick={toggleMute}>
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant={isVideoOff ? 'destructive' : 'outline'} onClick={toggleVideo}>
                    {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={toggleScreenShare}>
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={endConference}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div 
                ref={jitsiContainerRef} 
                className="w-full rounded-lg overflow-hidden border border-border"
                style={{ minHeight: '600px' }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
