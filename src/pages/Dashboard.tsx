import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { BookOpen, FileText, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const trainingData = [
  { name: 'Completed', value: 75, color: 'hsl(var(--success))' },
  { name: 'In Progress', value: 15, color: 'hsl(var(--warning))' },
  { name: 'Not Started', value: 10, color: 'hsl(var(--muted))' }
];

const complianceData = [
  { month: 'Jan', completion: 85 },
  { month: 'Feb', completion: 88 },
  { month: 'Mar', completion: 92 },
  { month: 'Apr', completion: 90 },
  { month: 'May', completion: 95 },
  { month: 'Jun', completion: 98 }
];

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's your training and compliance overview</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              15 of 20 modules completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">Continue Training</h3>
              <p className="text-sm text-muted-foreground">Resume your current modules</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">Review Policies</h3>
              <p className="text-sm text-muted-foreground">Check pending acknowledgments</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">Compliance Report</h3>
              <p className="text-sm text-muted-foreground">View your status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;