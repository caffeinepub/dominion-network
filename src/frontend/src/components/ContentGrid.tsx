import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentCard } from './ContentCard';
import { ContentPlayer } from './ContentPlayer';
import { useGetAllContent } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import type { MediaContent } from '../backend';

export function ContentGrid() {
  const { data: allContent = [], isLoading } = useGetAllContent();
  const [selectedContent, setSelectedContent] = useState<MediaContent | null>(null);

  // Convert backend MediaContent to frontend format
  const convertContent = (content: MediaContent) => ({
    ...content,
    uploadedBy: content.uploadedBy.toString(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allContent.map((content) => (
              <ContentCard
                key={content.id.toString()}
                content={convertContent(content)}
                onClick={() => setSelectedContent(content)}
              />
            ))}
          </div>
          {allContent.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No content available</p>
          )}
        </TabsContent>
        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allContent
              .filter((c) => Number(c.views) > 100)
              .map((content) => (
                <ContentCard
                  key={content.id.toString()}
                  content={convertContent(content)}
                  onClick={() => setSelectedContent(content)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedContent && (
        <ContentPlayer
          content={convertContent(selectedContent)}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </>
  );
}
