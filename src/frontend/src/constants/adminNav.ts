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
  MessageSquare,
  LayoutGrid
} from 'lucide-react';

export interface AdminNavItem {
  label: string;
  route: string;
  icon: any;
  section: string;
  order: number;
}

// Define section ordering for Version 42 consistency - exported for external use
export const SECTION_ORDER = [
  'Admin Dashboard',
  'Admin Rooms',
  'User Management',
  'Content Management',
  'Commerce',
  'Marketing',
  'HiiYah Chat'
];

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  // Admin Dashboard
  {
    label: 'Excalibur Studios',
    route: '/admin/excalibur-studios',
    icon: Sparkles,
    section: 'Admin Dashboard',
    order: 0,
  },
  
  // Admin Rooms
  {
    label: 'Rooms',
    route: '/admin/rooms',
    icon: LayoutGrid,
    section: 'Admin Rooms',
    order: 1,
  },
  {
    label: 'Content Approval & Editing',
    route: '/admin/editing-room',
    icon: Edit,
    section: 'Admin Rooms',
    order: 2,
  },
  {
    label: 'Wallet Management',
    route: '/admin/wallet-management',
    icon: Wallet,
    section: 'Admin Rooms',
    order: 3,
  },
  {
    label: 'Price Control',
    route: '/admin/price-control',
    icon: DollarSign,
    section: 'Admin Rooms',
    order: 4,
  },
  {
    label: 'Media Upload',
    route: '/admin/media-upload',
    icon: Upload,
    section: 'Admin Rooms',
    order: 5,
  },
  {
    label: 'Image Library',
    route: '/admin/image-library',
    icon: Image,
    section: 'Admin Rooms',
    order: 6,
  },
  
  // User Management
  {
    label: 'Approvals',
    route: '/admin/approvals',
    icon: CheckCircle,
    section: 'User Management',
    order: 7,
  },
  {
    label: 'Member Directory',
    route: '/admin/members',
    icon: Users,
    section: 'User Management',
    order: 8,
  },
  {
    label: 'Admin Invite Links',
    route: '/admin/invite-links',
    icon: LinkIcon,
    section: 'User Management',
    order: 9,
  },
  {
    label: 'Pricing & Terms',
    route: '/admin/pricing-terms',
    icon: FileText,
    section: 'User Management',
    order: 10,
  },
  
  // Content Management
  {
    label: 'Uploads & Downloads',
    route: '/admin/content',
    icon: Package,
    section: 'Content Management',
    order: 11,
  },
  {
    label: 'Display Screen',
    route: '/admin/display',
    icon: Monitor,
    section: 'Content Management',
    order: 12,
  },
  
  // Commerce
  {
    label: 'Clear Magic Mall',
    route: '/admin/mall',
    icon: ShoppingBag,
    section: 'Commerce',
    order: 13,
  },
  
  // Marketing
  {
    label: 'Manage Ads',
    route: '/admin/ads',
    icon: Film,
    section: 'Marketing',
    order: 14,
  },
  {
    label: 'Manage Affiliate',
    route: '/admin/affiliate',
    icon: Share2,
    section: 'Marketing',
    order: 15,
  },
  
  // HiiYah Chat
  {
    label: 'Chat Administration',
    route: '/admin/hiiyah-chat',
    icon: MessageSquare,
    section: 'HiiYah Chat',
    order: 16,
  },
];

// Requested Admin Rooms Route Mapping (for documentation and verification)
export const REQUESTED_ADMIN_ROOMS_ROUTE_MAP: Record<string, string> = {
  'Rooms': '/admin/rooms',
  'Content Approval & Editing': '/admin/editing-room',
  'Wallet Management': '/admin/wallet-management',
  'Price Control': '/admin/price-control',
  'Media Upload': '/admin/media-upload',
  'Image Library': '/admin/image-library',
  'Approvals': '/admin/approvals',
  'Member Directory': '/admin/members',
  'Admin Invite Links': '/admin/invite-links',
  'Pricing & Terms': '/admin/pricing-terms',
  'Uploads & Downloads': '/admin/content',
  'Display Screen': '/admin/display',
  'Clear Magic Mall': '/admin/mall',
  'Manage Ads': '/admin/ads',
  'Manage Affiliate': '/admin/affiliate',
  'Chat Administration': '/admin/hiiyah-chat',
  'Excalibur Studios': '/admin/excalibur-studios',
};

// Group items by section with deterministic ordering for Version 42 behavior
export function getAdminNavSections(): Record<string, AdminNavItem[]> {
  const sections: Record<string, AdminNavItem[]> = {};
  
  // Initialize sections in the correct order
  SECTION_ORDER.forEach(sectionName => {
    sections[sectionName] = [];
  });
  
  // Populate sections with items, maintaining item order
  ADMIN_NAV_ITEMS.forEach(item => {
    if (sections[item.section]) {
      sections[item.section].push(item);
    }
  });
  
  // Sort items within each section by order
  Object.keys(sections).forEach(sectionName => {
    sections[sectionName].sort((a, b) => a.order - b.order);
  });
  
  // Remove empty sections
  Object.keys(sections).forEach(sectionName => {
    if (sections[sectionName].length === 0) {
      delete sections[sectionName];
    }
  });
  
  return sections;
}

// Helper function to get ordered sections as an array for iteration
export function getOrderedAdminNavSections(): Array<{ section: string; items: AdminNavItem[] }> {
  const sections = getAdminNavSections();
  return SECTION_ORDER
    .filter(sectionName => sections[sectionName] && sections[sectionName].length > 0)
    .map(sectionName => ({
      section: sectionName,
      items: sections[sectionName],
    }));
}
