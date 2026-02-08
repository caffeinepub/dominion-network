import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentCard } from './ContentCard';
import { ContentPlayer } from './ContentPlayer';
import { useGetAllContent, useGetPopularContent } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import type { MediaContent } from '../types/backend-extended';

export function ContentGrid() {
  const [selectedContent, setSelectedContent] = useState<MediaContent | null>(null);
  const { data: allContent = [], isLoading: allLoading } = useGetAllContent();
  const { data: popularContent = [], isLoading: popularLoading } = useGetPopularContent();

  return (
    <>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {allLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : allContent.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No content available yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allContent.map((content) => (
                <ContentCard
                  key={content.id.toString()}
                  content={content}
                  onClick={() => setSelectedContent(content)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          {popularLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : popularContent.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No popular content yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularContent.map((content) => (
                <ContentCard
                  key={content.id.toString()}
                  content={content}
                  onClick={() => setSelectedContent(content)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedContent && (
        <ContentPlayer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </>
  );
}
