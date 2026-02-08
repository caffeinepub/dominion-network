import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Music, Radio } from 'lucide-react';
import { useGetActiveDisplayContent } from '../hooks/useQueries';
import type { DisplayScreenContent } from '../types/backend-extended';

export function DisplayScreen() {
  const { data: activeContent } = useGetActiveDisplayContent();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (activeContent) {
      setIsPlaying(true);
    }
  }, [activeContent]);

  if (!activeContent) {
    return (
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No content currently playing</p>
        </CardContent>
      </Card>
    );
  }

  const getIcon = () => {
    switch (activeContent.contentType) {
      case 'movie':
        return <Play className="h-6 w-6" />;
      case 'music':
        return <Music className="h-6 w-6" />;
      case 'advertisement':
        return <Radio className="h-6 w-6" />;
      default:
        return <Play className="h-6 w-6" />;
    }
  };

  return (
    <Card className="border-primary/20 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video bg-black">
          {activeContent.file && (
            <video
              className="w-full h-full object-contain"
              controls
              autoPlay={isPlaying}
              src={String(activeContent.file)}
            />
          )}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              {getIcon()}
              {activeContent.contentType}
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{activeContent.title}</h3>
          <p className="text-muted-foreground">{activeContent.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
