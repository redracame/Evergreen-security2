import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, BookOpen, FileText, Activity, Plus, Edit, Trash2, Search, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialUsers = [
  { id: 1, name: 'John Employee', email: 'john@evergreen.com', role: 'employee', department: 'Operations', status: 'active', lastLogin: '2024-01-15' },
  { id: 2, name: 'Sarah Manager', email: 'sarah@evergreen.com', role: 'manager', department: 'HR', status: 'active', lastLogin: '2024-01-15' },
  { id: 3, name: 'Mike Compliance', email: 'mike@evergreen.com', role: 'compliance_officer', department: 'Compliance', status: 'active', lastLogin: '2024-01-14' },
  { id: 4, name: 'Lisa Admin', email: 'lisa@evergreen.com', role: 'admin', department: 'IT', status: 'active', lastLogin: '2024-01-15' },
  { id: 5, name: 'Tom Wilson', email: 'tom@evergreen.com', role: 'employee', department: 'Sales', status: 'inactive', lastLogin: '2024-01-10' }
];

const initialTrainingModules = [
  { id: 1, title: 'Workplace Safety Fundamentals', description: 'Essential safety protocols and procedures', status: 'active', enrolled: 145 },
  { id: 2, title: 'Data Protection & GDPR', description: 'Data handling and privacy regulations', status: 'active', enrolled: 132 },
  { id: 3, title: 'Environmental Sustainability', description: 'Green practices and environmental responsibility', status: 'draft', enrolled: 0 },
  { id: 4, title: 'Diversity & Inclusion', description: 'Building inclusive workplace culture', status: 'active', enrolled: 98 }
];

const initialPolicies = [
  { id: 1, title: 'Code of Conduct', version: '2.1', status: 'active', acknowledgments: 189 },
  { id: 2, title: 'Data Protection Policy', version: '1.3', status: 'active', acknowledgments: 156 },
  { id: 3, title: 'Remote Work Policy', version: '1.0', status: 'active', acknowledgments: 123 },
  { id: 4, title: 'Health & Safety Policy', version: '3.0', status: 'draft', acknowledgments: 0 }
];

const activityLogs = [
  { id: 1, user: 'John Employee', action: 'Completed training module', details: 'Workplace Safety Fundamentals', timestamp: '2024-01-15 14:30' },
  { id: 2, user: 'Sarah Manager', action: 'Acknowledged policy', details: 'Data Protection Policy v1.3', timestamp: '2024-01-15 13:45' },
  { id: 3, user: 'Admin System', action: 'User role updated', details: 'Tom Wilson promoted to Manager', timestamp: '2024-01-15 12:20' },
  { id: 4, user: 'Mike Compliance', action: 'Generated report', details: 'Monthly Compliance Summary', timestamp: '2024-01-15 11:15' }
];

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(initialUsers);
  const [trainingModules, setTrainingModules] = useState(initialTrainingModules);
  const [policies, setPolicies] = useState(initialPolicies);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', role: 'employee', department: '' });
  const [newModuleData, setNewModuleData] = useState({ title: '', description: '' });
  const [newPolicyData, setNewPolicyData] = useState({ title: '', version: '', description: '' });
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);
  const { toast } = useToast();

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: 'bg-destructive',
      compliance_officer: 'bg-primary', 
      manager: 'bg-warning text-warning-foreground',
      employee: 'bg-secondary'
    };
    return <Badge className={roleColors[role] || 'bg-secondary'}>{role.replace('_', ' ')}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 
      <Badge className="bg-success">Active</Badge> : 
      <Badge variant="outline">Inactive</Badge>;
  };

  const getModuleStatusBadge = (status: string) => {
    return status === 'active' ? 
      <Badge className="bg-success">Published</Badge> : 
      <Badge variant="secondary">Draft</Badge>;
  };

  const createUser = () => {
    if (!newUserData.name || !newUserData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newUser = {
      ...newUserData,
      id: Math.max(...users.map(u => u.id)) + 1,
      status: 'active',
      lastLogin: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);

    toast({
      title: "User Created",
      description: `${newUserData.name} has been added successfully.`,
    });
    
    setNewUserData({ name: '', email: '', role: 'employee', department: '' });
  };

  const createModule = () => {
    if (!newModuleData.title || !newModuleData.description) {
      toast({
        title: "Missing Information", 
        description: "Please provide both title and description.",
        variant: "destructive"
      });
      return;
    }

    const newModule = {
      ...newModuleData,
      id: Math.max(...trainingModules.map(m => m.id)) + 1,
      status: 'draft',
      enrolled: 0
    };
    setTrainingModules([...trainingModules, newModule]);

    toast({
      title: "Training Module Created",
      description: `${newModuleData.title} has been created as a draft.`,
    });
    
    setNewModuleData({ title: '', description: '' });
  };

  const createPolicy = () => {
    if (!newPolicyData.title || !newPolicyData.version) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and version.",
        variant: "destructive"
      });
      return;
    }

    const newPolicy = {
      ...newPolicyData,
      id: Math.max(...policies.map(p => p.id)) + 1,
      status: 'draft',
      acknowledgments: 0
    };
    setPolicies([...policies, newPolicy]);

    toast({
      title: "Policy Uploaded",
      description: `${newPolicyData.title} v${newPolicyData.version} has been uploaded successfully.`,
    });
    
    setNewPolicyData({ title: '', version: '', description: '' });
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "User Deleted",
      description: "User has been removed successfully.",
    });
  };

  const deleteModule = (id: number) => {
    setTrainingModules(trainingModules.filter(module => module.id !== id));
    toast({
      title: "Module Deleted",
      description: "Training module has been removed successfully.",
    });
  };

  const deletePolicy = (id: number) => {
    setPolicies(policies.filter(policy => policy.id !== id));
    toast({
      title: "Policy Deleted",
      description: "Policy has been removed successfully.",
    });
  };

  const updateUser = () => {
    if (!editingUser.name || !editingUser.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
    setEditingUser(null);
    toast({
      title: "User Updated",
      description: "User information has been updated successfully.",
    });
  };

  const updateModule = () => {
    if (!editingModule.title || !editingModule.description) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and description.",
        variant: "destructive"
      });
      return;
    }

    setTrainingModules(trainingModules.map(module => module.id === editingModule.id ? editingModule : module));
    setEditingModule(null);
    toast({
      title: "Module Updated",
      description: "Training module has been updated successfully.",
    });
  };

  const updatePolicy = () => {
    if (!editingPolicy.title || !editingPolicy.version) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and version.",
        variant: "destructive"
      });
      return;
    }

    setPolicies(policies.map(policy => policy.id === editingPolicy.id ? editingPolicy : policy));
    setEditingPolicy(null);
    toast({
      title: "Policy Updated",
      description: "Policy has been updated successfully.",
    });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users, content, and system settings</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="training" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="policies" className="gap-2">
            <FileText className="h-4 w-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <Activity className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and roles</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>Add a new user to the system</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newUserData.name}
                        onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUserData.role} onValueChange={(value) => setNewUserData({...newUserData, role: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={newUserData.department}
                        onChange={(e) => setNewUserData({...newUserData, department: e.target.value})}
                        placeholder="Enter department"
                      />
                    </div>
                    <Button onClick={createUser} className="w-full">
                      Create User
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-2 max-w-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Last Login</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-2 font-medium">{user.name}</td>
                        <td className="p-2 text-muted-foreground">{user.email}</td>
                        <td className="p-2">{getRoleBadge(user.role)}</td>
                        <td className="p-2">{user.department}</td>
                        <td className="p-2">{getStatusBadge(user.status)}</td>
                        <td className="p-2 text-sm text-muted-foreground">{user.lastLogin}</td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Training Modules</CardTitle>
                <CardDescription>Create and manage training content</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Module
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Training Module</DialogTitle>
                    <DialogDescription>Add a new training module</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="moduleTitle">Title</Label>
                      <Input
                        id="moduleTitle"
                        value={newModuleData.title}
                        onChange={(e) => setNewModuleData({...newModuleData, title: e.target.value})}
                        placeholder="Enter module title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moduleDescription">Description</Label>
                      <Textarea
                        id="moduleDescription"
                        value={newModuleData.description}
                        onChange={(e) => setNewModuleData({...newModuleData, description: e.target.value})}
                        placeholder="Enter module description"
                        rows={4}
                      />
                    </div>
                    <Button onClick={createModule} className="w-full">
                      Create Module
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {trainingModules.map((module) => (
                  <div key={module.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{module.title}</h4>
                          {getModuleStatusBadge(module.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {module.enrolled} employees enrolled
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingModule(module)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteModule(module.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Policy Management</CardTitle>
                <CardDescription>Upload and manage company policies</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Upload Policy
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Policy</DialogTitle>
                    <DialogDescription>Add a new company policy</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="policyTitle">Policy Title</Label>
                      <Input
                        id="policyTitle"
                        value={newPolicyData.title}
                        onChange={(e) => setNewPolicyData({...newPolicyData, title: e.target.value})}
                        placeholder="Enter policy title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyVersion">Version</Label>
                      <Input
                        id="policyVersion"
                        value={newPolicyData.version}
                        onChange={(e) => setNewPolicyData({...newPolicyData, version: e.target.value})}
                        placeholder="e.g., 1.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyDescription">Description (Optional)</Label>
                      <Textarea
                        id="policyDescription"
                        value={newPolicyData.description}
                        onChange={(e) => setNewPolicyData({...newPolicyData, description: e.target.value})}
                        placeholder="Enter policy description"
                        rows={3}
                      />
                    </div>
                    <Button onClick={createPolicy} className="w-full">
                      Upload Policy
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{policy.title}</h4>
                          <Badge variant="outline">v{policy.version}</Badge>
                          {getModuleStatusBadge(policy.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {policy.acknowledgments} acknowledgments
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingPolicy(policy)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deletePolicy(policy.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Activity Logs
              </CardTitle>
              <CardDescription>Monitor system activities and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Shield className="h-4 w-4 text-primary mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.user}</span>
                        <span className="text-sm text-muted-foreground">{log.action}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                      <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Full Name</Label>
                <Input
                  id="editName"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Select value={editingUser.role} onValueChange={(value) => setEditingUser({...editingUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDepartment">Department</Label>
                <Input
                  id="editDepartment"
                  value={editingUser.department}
                  onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                />
              </div>
              <Button onClick={updateUser} className="w-full">
                Update User
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Module Dialog */}
      <Dialog open={!!editingModule} onOpenChange={() => setEditingModule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Training Module</DialogTitle>
            <DialogDescription>Update module information</DialogDescription>
          </DialogHeader>
          {editingModule && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editModuleTitle">Title</Label>
                <Input
                  id="editModuleTitle"
                  value={editingModule.title}
                  onChange={(e) => setEditingModule({...editingModule, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editModuleDescription">Description</Label>
                <Textarea
                  id="editModuleDescription"
                  value={editingModule.description}
                  onChange={(e) => setEditingModule({...editingModule, description: e.target.value})}
                  rows={4}
                />
              </div>
              <Button onClick={updateModule} className="w-full">
                Update Module
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Policy Dialog */}
      <Dialog open={!!editingPolicy} onOpenChange={() => setEditingPolicy(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
            <DialogDescription>Update policy information</DialogDescription>
          </DialogHeader>
          {editingPolicy && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editPolicyTitle">Policy Title</Label>
                <Input
                  id="editPolicyTitle"
                  value={editingPolicy.title}
                  onChange={(e) => setEditingPolicy({...editingPolicy, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPolicyVersion">Version</Label>
                <Input
                  id="editPolicyVersion"
                  value={editingPolicy.version}
                  onChange={(e) => setEditingPolicy({...editingPolicy, version: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPolicyDescription">Description</Label>
                <Textarea
                  id="editPolicyDescription"
                  value={editingPolicy.description || ''}
                  onChange={(e) => setEditingPolicy({...editingPolicy, description: e.target.value})}
                  rows={3}
                />
              </div>
              <Button onClick={updatePolicy} className="w-full">
                Update Policy
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;