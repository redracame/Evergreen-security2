import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { AlertTriangle, CheckCircle, TrendingUp, Download, Users, FileText, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const complianceData = [
  { name: 'Compliant', value: 85, color: 'hsl(var(--success))' },
  { name: 'At Risk', value: 10, color: 'hsl(var(--warning))' },
  { name: 'Non-Compliant', value: 5, color: 'hsl(var(--destructive))' }
];


const trendData = [
  { month: 'Jan', compliance: 82 },
  { month: 'Feb', compliance: 85 },
  { month: 'Mar', compliance: 87 },
  { month: 'Apr', compliance: 84 },
  { month: 'May', compliance: 89 },
  { month: 'Jun', compliance: 92 }
];

const alerts = [
  {
    id: 1,
    type: 'overdue_training',
    severity: 'high',
    message: '3 employees have overdue safety training',
  },
  {
    id: 2,
    type: 'policy_acknowledgment',
    severity: 'medium',
    message: '2 pending policy acknowledgments for Data Protection Policy',
  },
];

const Compliance = () => {
  const { toast } = useToast();

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const exportReport = (type: string) => {
    toast({
      title: "Report Exported",
      description: `${type} report has been downloaded successfully.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Monitor organizational compliance and manage risks</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportReport('PDF')} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">85%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees Tracked</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Compliance Alerts
          </CardTitle>
          <CardDescription>Items requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={alert.severity === 'high' ? 'border-destructive' : ''}>
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start gap-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="space-y-1">
                    <p className="font-medium">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(alert.severity)}
                  <Button variant="outline" size="sm">
                    Resolve
                  </Button>
                </div>
              </div>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Compliance;