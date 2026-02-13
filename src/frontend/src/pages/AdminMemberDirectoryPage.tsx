import { useState } from 'react';
import { Search, Loader2, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useActor } from '../hooks/useActor';
import { useQuery } from '@tanstack/react-query';
import { AdminCapabilityNotice } from '../components/admin/AdminCapabilityNotice';

export function AdminMemberDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { actor, isFetching: actorFetching } = useActor();

  const { data: profiles = [], isLoading, error } = useQuery({
    queryKey: ['allUserProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      // Check if method exists
      if (typeof (actor as any).getAllUserProfiles !== 'function') {
        return [];
      }
      try {
        return await (actor as any).getAllUserProfiles();
      } catch (error) {
        console.error('Error fetching user profiles:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });

  const hasCapability = actor && typeof (actor as any).getAllUserProfiles === 'function';

  const filteredProfiles = profiles.filter((profile: any) => {
    const matchesSearch = 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.principal.toString().toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || profile.role.__kind__.toLowerCase() === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (isLoading || actorFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasCapability) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AdminCapabilityNotice
          type="unavailable"
          message="Member directory is not available in the current backend configuration. The getAllUserProfiles method is not implemented."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AdminCapabilityNotice
          type="error"
          message="Failed to load member directory. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          Member Directory
        </h1>
        <p className="text-muted-foreground">View and manage all registered users</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find members by name, email, or principal ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or principal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="subscriber">Subscriber</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredProfiles.length === 0 ? (
        <AdminCapabilityNotice
          type="empty"
          message={searchQuery || roleFilter !== 'all' 
            ? "No members found matching your search criteria." 
            : "No members registered yet."}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Members ({filteredProfiles.length})</CardTitle>
            <CardDescription>All registered users in the system</CardDescription>
          </CardHeader>
          <CardContent>
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
                  {filteredProfiles.map((profile: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{profile.name}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <Badge variant={profile.role.__kind__ === 'admin' ? 'default' : 'secondary'}>
                          {profile.role.__kind__}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.isOnline ? 'default' : 'outline'}>
                          {profile.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs">
                        {profile.principal?.toString() || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
