import { Tv, Laugh, Zap, Trophy, Newspaper, Film, Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';

const categories = [
  { id: 1, name: 'Movies', icon: Film, color: 'text-red-500' },
  { id: 2, name: 'Music', icon: Music, color: 'text-purple-500' },
  { id: 3, name: 'Live TV', icon: Tv, color: 'text-orange-500' },
  { id: 4, name: 'Sports', icon: Trophy, color: 'text-green-500' },
  { id: 5, name: 'Comedy', icon: Laugh, color: 'text-yellow-500' },
  { id: 6, name: 'News', icon: Newspaper, color: 'text-blue-500' },
];

export function CategorySection() {
  const navigate = useNavigate();

  return (
    <section className="py-6 sm:py-8">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 sm:mb-8 gradient-text">Browse by Genre</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              className="cursor-pointer group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all hover:scale-105 bg-card/50 backdrop-blur"
              onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: category.id.toString() } })}
            >
              <CardContent className="p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3">
                <div className={`${category.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-10 w-10 sm:h-12 sm:w-12" />
                </div>
                <h3 className="font-semibold text-center text-sm sm:text-base">{category.name}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
