import { useEffect } from 'react';
import { useGetAdsByPlacement, useTrackAdView, useTrackAdClick } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import type { AdPlacement } from '../types/backend-extended';

interface AdSidebarProps {
  placement: AdPlacement;
}

export function AdSidebar({ placement }: AdSidebarProps) {
  const { data: ads = [] } = useGetAdsByPlacement(placement);
  const trackView = useTrackAdView();
  const trackClick = useTrackAdClick();

  const sidebarAds = ads.filter(ad => ad.adType === 'sidebar' && ad.active).slice(0, 3);

  useEffect(() => {
    sidebarAds.forEach(ad => {
      trackView.mutate(ad.id);
    });
  }, [sidebarAds.map(ad => ad.id).join(',')]);

  if (sidebarAds.length === 0) return null;

  const handleClick = (ad: typeof sidebarAds[0]) => {
    trackClick.mutate(ad.id);
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {sidebarAds.map(ad => (
        <Card 
          key={ad.id.toString()}
          className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
          onClick={() => handleClick(ad)}
        >
          <CardContent className="p-3">
            <h4 className="font-semibold text-sm mb-1">{ad.title}</h4>
            <p className="text-xs text-muted-foreground">{ad.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
