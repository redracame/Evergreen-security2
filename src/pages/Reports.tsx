import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, Calendar as CalendarIcon, FileText, BarChart3, Filter, Plus, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const savedReports = [
  {
    id: 1,
    name: 'Monthly Compliance Summary',
    type: 'compliance',
    lastGenerated: '2024-01-15',
    status: 'ready',
    description: 'Overall compliance metrics and trends'
  },
  {
    id: 2,
    name: 'Training Completion Report',
    type: 'training',
    lastGenerated: '2024-01-14', 
    status: 'ready',
    description: 'Employee training progress and completions'
  },
  {
    id: 3,
    name: 'Policy Acknowledgment Status',
    type: 'policy',
    lastGenerated: '2024-01-13',
    status: 'generating',
    description: 'Policy acknowledgment tracking and pending items'
  },
  {
    id: 4,
    name: 'Department Risk Assessment',
    type: 'risk',
    lastGenerated: '2024-01-10',
    status: 'ready',
    description: 'Risk analysis by department and role'
  }
];

const reportTemplates = [
  { id: 'compliance_summary', name: 'Compliance Summary', category: 'Compliance' },
  { id: 'training_progress', name: 'Training Progress', category: 'Training' },
  { id: 'policy_acknowledgments', name: 'Policy Acknowledgments', category: 'Policy' },
  { id: 'employee_certifications', name: 'Employee Certifications', category: 'Training' },
  { id: 'department_overview', name: 'Department Overview', category: 'Management' },
  { id: 'risk_assessment', name: 'Risk Assessment', category: 'Compliance' }
];

const Reports = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-success">Ready</Badge>;
      case 'generating':
        return <Badge variant="secondary">Generating</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const downloadReport = (reportId: number, format: string) => {
    const report = savedReports.find(r => r.id === reportId);
    toast({
      title: "Download Started",
      description: `${report?.name} is being downloaded as ${format.toUpperCase()}.`,
    });
  };

  const generateReport = () => {
    if (!selectedTemplate || !reportName) {
      toast({
        title: "Missing Information",
        description: "Please select a template and provide a report name.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Report Generation Started",
      description: `${reportName} is being generated. You'll be notified when it's ready.`,
    });

    // Reset form
    setSelectedTemplate('');
    setReportName('');
    setReportDescription('');
    setStartDate(undefined);
    setEndDate(undefined);
    setFilterDepartment('');
  };

  const scheduleReport = () => {
    toast({
      title: "Report Scheduled",
      description: "Your report has been scheduled for regular generation.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate and manage compliance and training reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Generate New Report
              </CardTitle>
              <CardDescription>Create custom reports with specific parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Report Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} ({template.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department Filter</Label>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportName">Report Name</Label>
                <Input
                  id="reportName"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Brief description of the report"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={generateReport} className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline" onClick={scheduleReport} className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Saved Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Previously generated and saved reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <h4 className="font-medium">{report.name}</h4>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Last generated: {report.lastGenerated}
                      </p>
                    </div>
                    {report.status === 'ready' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadReport(report.id, 'pdf')}
                          className="gap-1"
                        >
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadReport(report.id, 'csv')}
                          className="gap-1"
                        >
                          <Download className="h-3 w-3" />
                          CSV
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Reports This Month</div>
              </div>
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">85%</div>
                <div className="text-sm text-muted-foreground">Avg Compliance Rate</div>
              </div>
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">3</div>
                <div className="text-sm text-muted-foreground">Pending Actions</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                Export All Data
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <CalendarIcon className="h-4 w-4" />
                Schedule Reports
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Available report types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reportTemplates.slice(0, 4).map((template) => (
                  <div key={template.id} className="p-2 text-sm border rounded">
                    <div className="font-medium">{template.name}</div>
                    <div className="text-muted-foreground text-xs">{template.category}</div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;