import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Film, Users, Play, Pause } from 'lucide-react';
import { useState } from 'react';

export function SharedPlaybackComponent() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Watch Together</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Create shared playback rooms to watch content with friends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
          <img 
            src="/assets/generated/shared-playback-room-no-people.dim_800x600.png" 
            alt="Shared Playback" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="text-center space-y-3 sm:space-y-4 px-4">
              <Film className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-primary" />
              <p className="text-base sm:text-lg font-semibold">No active playback room</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Create a room to watch content together</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs sm:text-sm">
              <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              0 viewers
            </Badge>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setIsPlaying(!isPlaying)} className="flex-1 sm:flex-none text-xs sm:text-sm">
              {isPlaying ? <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" /> : <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button className="flex-1 sm:flex-none text-xs sm:text-sm">Create Room</Button>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2 text-sm sm:text-base">How it works:</h4>
          <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <li>• Create a playback room and invite connections</li>
            <li>• Watch movies, shows, or listen to music together</li>
            <li>• Synchronized playback across all devices</li>
            <li>• Real-time chat while watching</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
