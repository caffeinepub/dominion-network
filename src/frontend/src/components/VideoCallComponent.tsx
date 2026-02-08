import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Mic, MicOff, VideoOff, PhoneOff, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface VideoCallComponentProps {
  sessionId: bigint;
  onClose: () => void;
}

export function VideoCallComponent({ sessionId, onClose }: VideoCallComponentProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const handleEndCall = async () => {
    toast.success('Call ended');
    onClose();
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Call
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="animate-pulse">Live</Badge>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
          <img 
            src="/assets/generated/video-chat-interface-people-free.dim_800x600.png" 
            alt="Video Call" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Video call interface</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant={isMuted ? 'destructive' : 'outline'}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            variant={isVideoOff ? 'destructive' : 'outline'}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
