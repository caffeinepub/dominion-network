import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { useQuery } from '@tanstack/react-query';
import type { UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

interface UserProfileInfo {
  principal: Principal;
  profile: UserProfile;
}

export function AdminMemberDirectoryPage() {
  const { actor } = useActor();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data: userProfiles = [], isLoading } = useQuery<UserProfileInfo[]>({
    queryKey: ['allUserProfiles'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const profiles = await (actor as any).getAllUserProfiles();
      return profiles;
    },
    enabled: !!actor,
  });

  const filteredProfiles = userProfiles.filter((userInfo) => {
    const matchesSearch =
      userInfo.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userInfo.profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userInfo.principal.toString().toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || userInfo.profile.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Users className="h-8 w-8" />
            Member Directory
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all registered users ({userProfiles.length} total)
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
          <CardDescription>Find members by name, email, or principal ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or principal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Badge
                variant={roleFilter === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setRoleFilter('all')}
              >
                All
              </Badge>
              <Badge
                variant={roleFilter === 'admin' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setRoleFilter('admin')}
              >
                Admin
              </Badge>
              <Badge
                variant={roleFilter === 'subscriber' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setRoleFilter('subscriber')}
              >
                Subscriber
              </Badge>
              <Badge
                variant={roleFilter === 'member' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setRoleFilter('member')}
              >
                Member
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members ({filteredProfiles.length})</CardTitle>
          <CardDescription>All registered users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading members...</p>
          ) : filteredProfiles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No members found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Principal ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((userInfo) => (
                    <TableRow key={userInfo.principal.toString()}>
                      <TableCell className="font-medium">{userInfo.profile.name}</TableCell>
                      <TableCell>{userInfo.profile.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            userInfo.profile.role === 'admin'
                              ? 'default'
                              : userInfo.profile.role === 'subscriber'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {userInfo.profile.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={userInfo.profile.isOnline ? 'default' : 'outline'}>
                          {userInfo.profile.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs">
                        {userInfo.principal.toString().slice(0, 20)}...
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
