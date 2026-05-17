import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Newspaper, 
  Eye, 
  ListTree, 
  Users 
} from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';

export default async function AdminDashboard() {
  // Fetch stats from Supabase
  const { count: articlesCount } = await supabaseAdmin
    .from('articles')
    .select('*', { count: 'exact', head: true });

  const { count: categoriesCount } = await supabaseAdmin
    .from('categories')
    .select('*', { count: 'exact', head: true });

  const { data: viewsData } = await supabaseAdmin
    .from('articles')
    .select('view_count');
  
  const totalViews = viewsData?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0;

  const stats = [
    { label: 'Total Articles', value: articlesCount || 0, icon: Newspaper, color: 'text-blue-600' },
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'text-green-600' },
    { label: 'Total Categories', value: categoriesCount || 0, icon: ListTree, color: 'text-purple-600' },
    { label: 'Admins', value: 1, icon: Users, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase">
                {stat.label}
              </CardTitle>
              <stat.icon className={stat.color} size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity / Recent Articles could go here */}
    </div>
  );
}
