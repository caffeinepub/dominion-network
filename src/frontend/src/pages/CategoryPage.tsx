import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { ContentCard } from '../components/ContentCard';
import { ContentPlayer } from '../components/ContentPlayer';
import { useGetContentByCategory } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import type { MediaContent } from '../types/backend-extended';

export function CategoryPage() {
  const { categoryId } = useParams({ from: '/category/$categoryId' });
  const [selectedContent, setSelectedContent] = useState<MediaContent | null>(null);
  
  const { data: content = [], isLoading } = useGetContentByCategory(BigInt(categoryId));

  const getCategoryName = (id: string) => {
    const categories: Record<string, string> = {
      '1': 'Movies',
      '2': 'Music',
      '3': 'Live TV',
      '4': 'Sports',
      '5': 'Comedy',
      '6': 'News',
    };
    return categories[id] || 'Content';
  };

  return (
    <div className="container py-8 space-y-8 max-w-7xl mx-auto px-4">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">{getCategoryName(categoryId)}</h1>
        <p className="text-muted-foreground">Browse content in this category</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : content.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No content available in this category yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {content.map((item) => (
            <ContentCard
              key={item.id.toString()}
              content={item}
              onClick={() => setSelectedContent(item)}
            />
          ))}
        </div>
      )}

      {selectedContent && (
        <ContentPlayer
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </div>
  );
}
