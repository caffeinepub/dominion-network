import { AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdminCapabilityNoticeProps {
  type: 'unavailable' | 'empty' | 'error';
  title?: string;
  message: string;
  className?: string;
}

export function AdminCapabilityNotice({ 
  type, 
  title, 
  message, 
  className = '' 
}: AdminCapabilityNoticeProps) {
  const getIcon = () => {
    switch (type) {
      case 'unavailable':
        return <AlertTriangle className="h-5 w-5" />;
      case 'empty':
        return <Info className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'unavailable':
        return 'Feature Unavailable';
      case 'empty':
        return 'No Data';
      case 'error':
        return 'Error';
      default:
        return 'Notice';
    }
  };

  return (
    <Alert variant={getVariant()} className={className}>
      {getIcon()}
      <AlertTitle>{title || getDefaultTitle()}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
