import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from './components/Layout';
import { AdminRouteGuard } from './components/AdminRouteGuard';
import { HomePage } from './pages/HomePage';
import { WalletPage } from './pages/WalletPage';
import { CreditCardPage } from './pages/CreditCardPage';
import { StreamingPartnersPage } from './pages/StreamingPartnersPage';
import { FlixiodTestPage } from './pages/FlixiodTestPage';
import { IHeartRadioTestPage } from './pages/IHeartRadioTestPage';
import { CategoryPage } from './pages/CategoryPage';
import { AdminAdsPage } from './pages/AdminAdsPage';
import { AdminAffiliatePage } from './pages/AdminAffiliatePage';
import { AffiliateDashboardPage } from './pages/AffiliateDashboardPage';
import { AdminContentPage } from './pages/AdminContentPage';
import { AdminMallPage } from './pages/AdminMallPage';
import { AdminDisplayPage } from './pages/AdminDisplayPage';
import { AdminApprovalPage } from './pages/AdminApprovalPage';
import { MallPage } from './pages/MallPage';
import { AdminWalletManagementPage } from './pages/AdminWalletManagementPage';
import { SignUpPage } from './pages/SignUpPage';
import { TermsPage } from './pages/TermsPage';
import { AdminPricingTermsPage } from './pages/AdminPricingTermsPage';
import { HiiYahChatPage } from './pages/HiiYahChatPage';
import { AdminHiiYahChatPage } from './pages/AdminHiiYahChatPage';
import { ExcaliburStudiosPage } from './pages/ExcaliburStudiosPage';
import { AdminEditingRoomPage } from './pages/AdminEditingRoomPage';
import { AdminPriceControlRoomPage } from './pages/AdminPriceControlRoomPage';
import { AdminMediaUploadRoomPage } from './pages/AdminMediaUploadRoomPage';
import { AdminImageLibraryPage } from './pages/AdminImageLibraryPage';
import { AdminInviteLinksPage } from './pages/AdminInviteLinksPage';
import { AdminInviteAcceptPage } from './pages/AdminInviteAcceptPage';
import { AdminMemberDirectoryPage } from './pages/AdminMemberDirectoryPage';
import { AdminRoomsPage } from './pages/AdminRoomsPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallet',
  component: WalletPage,
});

const creditCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/credit-card',
  component: CreditCardPage,
});

const streamingPartnersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/streaming-partners',
  component: StreamingPartnersPage,
});

const flixiodTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/streaming-partners/flixiod',
  component: FlixiodTestPage,
});

const iheartradioTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/streaming-partners/iheartradio',
  component: IHeartRadioTestPage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$categoryId',
  component: CategoryPage,
});

const adminRoomsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/rooms',
  component: () => <AdminRouteGuard><AdminRoomsPage /></AdminRouteGuard>,
});

const adminAdsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/ads',
  component: () => <AdminRouteGuard><AdminAdsPage /></AdminRouteGuard>,
});

const adminAffiliateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/affiliate',
  component: () => <AdminRouteGuard><AdminAffiliatePage /></AdminRouteGuard>,
});

const affiliateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/affiliate',
  component: AffiliateDashboardPage,
});

const adminContentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/content',
  component: () => <AdminRouteGuard><AdminContentPage /></AdminRouteGuard>,
});

const adminMallRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/mall',
  component: () => <AdminRouteGuard><AdminMallPage /></AdminRouteGuard>,
});

const adminDisplayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/display',
  component: () => <AdminRouteGuard><AdminDisplayPage /></AdminRouteGuard>,
});

const adminApprovalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/approvals',
  component: () => <AdminRouteGuard><AdminApprovalPage /></AdminRouteGuard>,
});

const mallRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mall',
  component: MallPage,
});

const adminWalletManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/wallet-management',
  component: () => <AdminRouteGuard><AdminWalletManagementPage /></AdminRouteGuard>,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignUpPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

const adminPricingTermsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/pricing-terms',
  component: () => <AdminRouteGuard><AdminPricingTermsPage /></AdminRouteGuard>,
});

const hiiYahChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hiiyah-chat',
  component: HiiYahChatPage,
});

const adminHiiYahChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/hiiyah-chat',
  component: () => <AdminRouteGuard><AdminHiiYahChatPage /></AdminRouteGuard>,
});

const excaliburStudiosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/excalibur-studios',
  component: () => <AdminRouteGuard><ExcaliburStudiosPage /></AdminRouteGuard>,
});

const adminEditingRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/editing-room',
  component: () => <AdminRouteGuard><AdminEditingRoomPage /></AdminRouteGuard>,
});

const adminPriceControlRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/price-control',
  component: () => <AdminRouteGuard><AdminPriceControlRoomPage /></AdminRouteGuard>,
});

const adminMediaUploadRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/media-upload',
  component: () => <AdminRouteGuard><AdminMediaUploadRoomPage /></AdminRouteGuard>,
});

const adminImageLibraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/image-library',
  component: () => <AdminRouteGuard><AdminImageLibraryPage /></AdminRouteGuard>,
});

const adminInviteLinksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/invite-links',
  component: () => <AdminRouteGuard><AdminInviteLinksPage /></AdminRouteGuard>,
});

const adminInviteAcceptRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invite/accept',
  component: AdminInviteAcceptPage,
});

const adminMemberDirectoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/members',
  component: () => <AdminRouteGuard><AdminMemberDirectoryPage /></AdminRouteGuard>,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  walletRoute,
  creditCardRoute,
  streamingPartnersRoute,
  flixiodTestRoute,
  iheartradioTestRoute,
  categoryRoute,
  adminRoomsRoute,
  adminAdsRoute,
  adminAffiliateRoute,
  affiliateRoute,
  adminContentRoute,
  adminMallRoute,
  adminDisplayRoute,
  adminApprovalRoute,
  mallRoute,
  adminWalletManagementRoute,
  signUpRoute,
  termsRoute,
  adminPricingTermsRoute,
  hiiYahChatRoute,
  adminHiiYahChatRoute,
  excaliburStudiosRoute,
  adminEditingRoomRoute,
  adminPriceControlRoomRoute,
  adminMediaUploadRoomRoute,
  adminImageLibraryRoute,
  adminInviteLinksRoute,
  adminInviteAcceptRoute,
  adminMemberDirectoryRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
