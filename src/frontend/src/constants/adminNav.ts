import { 
  Sparkles, 
  Edit, 
  Wallet, 
  DollarSign, 
  Upload, 
  Image, 
  CheckCircle, 
  Users, 
  Link as LinkIcon, 
  FileText, 
  Package, 
  Monitor, 
  ShoppingBag, 
  Film, 
  Share2, 
  MessageSquare 
} from 'lucide-react';

export interface AdminNavItem {
  label: string;
  route: string;
  icon: any;
  section: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  // Admin Dashboard
  {
    label: 'Excalibur Studios',
    route: '/admin/excalibur-studios',
    icon: Sparkles,
    section: 'Admin Dashboard',
  },
  
  // Admin Rooms
  {
    label: 'Content Approval & Editing',
    route: '/admin/editing-room',
    icon: Edit,
    section: 'Admin Rooms',
  },
  {
    label: 'Wallet Management',
    route: '/admin/wallet-management',
    icon: Wallet,
    section: 'Admin Rooms',
  },
  {
    label: 'Price Control',
    route: '/admin/price-control',
    icon: DollarSign,
    section: 'Admin Rooms',
  },
  {
    label: 'Media Upload',
    route: '/admin/media-upload',
    icon: Upload,
    section: 'Admin Rooms',
  },
  {
    label: 'Image Library',
    route: '/admin/image-library',
    icon: Image,
    section: 'Admin Rooms',
  },
  
  // User Management
  {
    label: 'Approvals',
    route: '/admin/approvals',
    icon: CheckCircle,
    section: 'User Management',
  },
  {
    label: 'Member Directory',
    route: '/admin/members',
    icon: Users,
    section: 'User Management',
  },
  {
    label: 'Admin Invite Links',
    route: '/admin/invite-links',
    icon: LinkIcon,
    section: 'User Management',
  },
  {
    label: 'Pricing & Terms',
    route: '/admin/pricing-terms',
    icon: FileText,
    section: 'User Management',
  },
  
  // Content Management
  {
    label: 'Uploads & Downloads',
    route: '/admin/content',
    icon: Package,
    section: 'Content Management',
  },
  {
    label: 'Display Screen',
    route: '/admin/display',
    icon: Monitor,
    section: 'Content Management',
  },
  
  // Commerce
  {
    label: 'Clear Magic Mall',
    route: '/admin/mall',
    icon: ShoppingBag,
    section: 'Commerce',
  },
  
  // Marketing
  {
    label: 'Manage Ads',
    route: '/admin/ads',
    icon: Film,
    section: 'Marketing',
  },
  {
    label: 'Manage Affiliate',
    route: '/admin/affiliate',
    icon: Share2,
    section: 'Marketing',
  },
  
  // HiiYah Chat
  {
    label: 'Chat Administration',
    route: '/admin/hiiyah-chat',
    icon: MessageSquare,
    section: 'HiiYah Chat',
  },
];

// Group items by section for organized display
export function getAdminNavSections(): Record<string, AdminNavItem[]> {
  const sections: Record<string, AdminNavItem[]> = {};
  
  ADMIN_NAV_ITEMS.forEach(item => {
    if (!sections[item.section]) {
      sections[item.section] = [];
    }
    sections[item.section].push(item);
  });
  
  return sections;
}
