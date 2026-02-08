import { Play, Eye, Star, Film, Music, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MediaContent, MediaType } from '../types/backend-extended';

interface ContentCardProps {
  content: MediaContent;
  onClick: () => void;
}

export function ContentCard({ content, onClick }: ContentCardProps) {
  const formatDuration = (seconds: bigint) => {
    const mins = Math.floor(Number(seconds) / 60);
    const secs = Number(seconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMediaTypeLabel = (type: MediaType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'video':
        return Film;
      case 'audio':
        return Music;
      case 'image':
        return ImageIcon;
      default:
        return Film;
    }
  };

  const MediaIcon = getMediaIcon(content.mediaType);

  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <MediaIcon className="h-16 w-16 text-primary/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-primary/90 rounded-full p-4">
            <Play className="h-8 w-8 text-primary-foreground" fill="currentColor" />
          </div>
        </div>
        <Badge className="absolute top-2 right-2" variant="secondary">
          {getMediaTypeLabel(content.mediaType)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {content.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {content.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {Number(content.views).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {Number(content.rating) / 10}
            </span>
          </div>
          <span>{formatDuration(content.duration)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
