import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ADMIN_NAV_ITEMS } from '@/constants/adminNav';
import { navigateToAdminRoute } from '@/utils/adminNavScroll';

export function AdminRoomsPage() {
  const navigate = useNavigate();

  // Filter out the Rooms page itself to avoid self-linking
  const allRooms = ADMIN_NAV_ITEMS.filter(item => item.route !== '/admin/rooms');

  const handleRoomClick = (route: string) => {
    navigateToAdminRoute(navigate, route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Rooms</h1>
          <p className="text-slate-300">Access all administrative areas and management tools</p>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
            {allRooms.map((room) => {
              const IconComponent = room.icon;
              return (
                <Card
                  key={room.route}
                  className="group hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/80 flex flex-col"
                  onClick={() => handleRoomClick(room.route)}
                >
                  <CardHeader className="pb-3 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors shrink-0">
                        <IconComponent className="h-6 w-6 text-purple-400 group-hover:text-purple-300" />
                      </div>
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-purple-300 transition-colors break-words">
                      {room.label}
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-sm break-words">
                      {room.section}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant="ghost"
                      className="w-full text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoomClick(room.route);
                      }}
                    >
                      Open Room →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Total Admin Rooms: {allRooms.length}</p>
        </div>
      </div>
    </div>
  );
}
