import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, Star, Image as ImageIcon } from 'lucide-react';
import type { MediaContent } from '../types/backend-extended';

interface ContentPlayerProps {
  content: MediaContent;
  onClose: () => void;
}

export function ContentPlayer({ content, onClose }: ContentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [rating, setRating] = useState(0);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {content.mediaType === 'video' ? (
              <video
                className="w-full h-full"
                controls
                autoPlay
                src={String(content.file)}
              />
            ) : content.mediaType === 'audio' ? (
              <div className="flex items-center justify-center h-full">
                <audio
                  className="w-full"
                  controls
                  autoPlay
                  src={String(content.file)}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-muted">
                <div className="text-center space-y-4">
                  <ImageIcon className="h-24 w-24 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Image display disabled</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="outline">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= rating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{content.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Views: {Number(content.views).toLocaleString()}</span>
            <span>Rating: {Number(content.rating) / 10}/10</span>
            <span>Duration: {Math.floor(Number(content.duration) / 60)}:{(Number(content.duration) % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
