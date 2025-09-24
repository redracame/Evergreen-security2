import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Calendar, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const policies = [
  {
    id: 1,
    title: 'Code of Conduct',
    version: '2.1',
    effectiveDate: '2024-01-01',
    status: 'acknowledged',
    acknowledgedDate: '2024-01-15',
    description: 'Guidelines for professional behavior and ethical standards in the workplace.',
    content: `This Code of Conduct establishes the standards of behavior expected from all employees of Evergreen Group. 

Key Points:
• Treat all colleagues with respect and dignity
• Maintain confidentiality of sensitive information
• Report any violations through proper channels
• Comply with all applicable laws and regulations
• Act in the best interest of the company and stakeholders

Violations of this code may result in disciplinary action up to and including termination.`
  },
  {
    id: 2,
    title: 'Data Protection Policy',
    version: '1.3',
    effectiveDate: '2024-02-01',
    status: 'pending',
    description: 'Comprehensive guidelines for handling personal and sensitive data in compliance with GDPR.',
    content: `This policy outlines how Evergreen Group collects, processes, and protects personal data.

Data Protection Principles:
• Lawfulness, fairness, and transparency
• Purpose limitation
• Data minimization
• Accuracy
• Storage limitation
• Integrity and confidentiality

All employees must:
• Only access data necessary for their role
• Report data breaches immediately
• Complete annual data protection training
• Follow secure data handling procedures`
  },
  {
    id: 3,
    title: 'Health & Safety Policy',
    version: '3.0',
    effectiveDate: '2024-01-15',
    status: 'pending',
    description: 'Workplace safety procedures and emergency protocols.',
    content: `Our commitment to maintaining a safe and healthy work environment for all employees.

Safety Responsibilities:
• Employees must follow all safety procedures
• Report hazards and incidents immediately
• Use personal protective equipment when required
• Participate in safety training programs

Emergency Procedures:
• Fire evacuation routes and assembly points
• First aid procedures and contact information
• Incident reporting requirements
• Emergency contact numbers`
  },
  {
    id: 4,
    title: 'Remote Work Policy',
    version: '1.0',
    effectiveDate: '2024-03-01',
    status: 'acknowledged',
    acknowledgedDate: '2024-03-05',
    description: 'Guidelines for remote work arrangements and expectations.',
    content: `This policy establishes guidelines for remote work to ensure productivity and security.

Remote Work Requirements:
• Secure internet connection and appropriate workspace
• Adherence to company security protocols
• Regular communication with team members
• Availability during core business hours

Equipment and Security:
• Company-provided equipment must be secured
• Use of approved software and applications only
• Regular software updates and security patches
• Secure storage of confidential information`
  }
];

const Policies = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const { toast } = useToast();

  const handleAcknowledge = (policyId: number) => {
    // In a real app, this would make an API call
    const updatedPolicies = policies.map(policy => 
      policy.id === policyId 
        ? { ...policy, status: 'acknowledged', acknowledgedDate: new Date().toISOString().split('T')[0] }
        : policy
    );
    
    toast({
      title: "Policy Acknowledged",
      description: "Thank you for acknowledging this policy.",
    });
    
    setSelectedPolicy(null);
    setAcknowledged(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'acknowledged':
        return <Badge className="bg-success">Acknowledged</Badge>;
      case 'pending':
        return <Badge variant="destructive">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'acknowledged':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const pendingCount = policies.filter(p => p.status === 'pending').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Company Policies</h1>
          <p className="text-muted-foreground">Review and acknowledge company policies</p>
        </div>
        {pendingCount > 0 && (
          <Alert className="max-w-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have {pendingCount} pending policy acknowledgment{pendingCount > 1 ? 's' : ''}.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {policies.map((policy) => (
          <Card key={policy.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(policy.status)}
                    {policy.title}
                  </CardTitle>
                  <CardDescription>{policy.description}</CardDescription>
                </div>
                {getStatusBadge(policy.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Version:</span>
                  <span className="ml-2 text-muted-foreground">{policy.version}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className="text-muted-foreground">{policy.effectiveDate}</span>
                </div>
              </div>

              {policy.status === 'acknowledged' && policy.acknowledgedDate && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Acknowledged on {policy.acknowledgedDate}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Read Policy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{policy.title} v{policy.version}</DialogTitle>
                      <DialogDescription>
                        Effective from {policy.effectiveDate}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 whitespace-pre-line text-sm">
                      {policy.content}
                    </div>
                  </DialogContent>
                </Dialog>

                {policy.status === 'pending' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Acknowledge
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Acknowledge Policy</DialogTitle>
                        <DialogDescription>
                          Please confirm that you have read and understood the {policy.title}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">{policy.title} v{policy.version}</h4>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="acknowledge" 
                            checked={acknowledged}
                            onCheckedChange={(checked) => setAcknowledged(checked === true)}
                          />
                          <Label htmlFor="acknowledge" className="text-sm">
                            I have read, understood, and agree to comply with this policy
                          </Label>
                        </div>
                        
                        <Button 
                          onClick={() => handleAcknowledge(policy.id)}
                          disabled={!acknowledged}
                          className="w-full"
                        >
                          Acknowledge Policy
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default Policies;