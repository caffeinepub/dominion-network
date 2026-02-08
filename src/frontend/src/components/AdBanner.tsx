import { useEffect } from 'react';
import { useGetAdvertisementsByPlacement, useTrackAdView, useTrackAdClick } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import type { AdPlacement } from '../types/backend-extended';

interface AdBannerProps {
  placement: AdPlacement;
}

export function AdBanner({ placement }: AdBannerProps) {
  const { data: ads = [] } = useGetAdvertisementsByPlacement(placement);
  const trackView = useTrackAdView();
  const trackClick = useTrackAdClick();

  const bannerAds = ads.filter(ad => ad.adType === 'banner' && ad.active);
  const currentAd = bannerAds[0];

  useEffect(() => {
    if (currentAd) {
      trackView.mutate(currentAd.id);
    }
  }, [currentAd?.id]);

  if (!currentAd) return null;

  const handleClick = () => {
    trackClick.mutate(currentAd.id);
    if (currentAd.targetUrl) {
      window.open(currentAd.targetUrl, '_blank');
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{currentAd.title}</h3>
        <p className="text-sm text-muted-foreground">{currentAd.content}</p>
      </CardContent>
    </Card>
  );
}
