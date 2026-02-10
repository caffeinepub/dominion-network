import { Badge } from '@/components/ui/badge';
import { APP_VERSION } from '../constants/appVersion';

export function VersionBadge() {
  return (
    <Badge 
      variant="outline" 
      className="text-primary border-primary/50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold"
    >
      {APP_VERSION}
    </Badge>
  );
}
