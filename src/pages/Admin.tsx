// src/pages/Admin.tsx
import { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Users, Plus, Search, BookOpen, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  role: 'Admin' | 'Employee' | 'Manager';
  status: string;
  lastLogin: string;
};

type Question = {
  id: number;
  question: string;
  answers: { text: string; correct: boolean }[];
};

type TrainingModule = {
  id: number;
  title: string;
  subtitle: string;
  questions: Question[];
};

type Policy = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
};

const initialUsers: UserType[] = [
  {
    id: 'EMP001',
    firstName: 'Gunaratne',
    lastName: 'Wickrema',
    email: 'gunaratnewickrema@gmail.com',
    password: '••••••',
    address: 'Colombo, Sri Lanka',
    phone: '+94 71 1234567',
    role: 'Employee',
    status: 'active',
    lastLogin: '2025-09-15',
  },
];

const Admin = () => {
  const { toast } = useToast();

  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);

  const getRoleBadge = (role: string) => (
    <Badge className={role === 'Admin' ? 'bg-destructive' : role === 'Manager' ? 'bg-warning' : 'bg-secondary'}>
      {role}
    </Badge>
  );

  const getStatusBadge = (status: string) =>
    status === 'active'
      ? <Badge className="bg-success">Active</Badge>
      : <Badge variant="outline">Inactive</Badge>;

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addModule = (module: TrainingModule) => {
    setTrainingModules([...trainingModules, module]);
    toast({ title: 'Module Added', description: `${module.title} created` });
  };

  const addPolicy = (policy: Policy) => {
    setPolicies([...policies, policy]);
    toast({ title: 'Policy Added', description: `${policy.title} created` });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <p className="text-muted-foreground">Manage users, training & policies</p>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users"><Users className="h-4 w-4" /> Users</TabsTrigger>
          <TabsTrigger value="training"><BookOpen className="h-4 w-4" /> Training</TabsTrigger>
          <TabsTrigger value="policies"><FileText className="h-4 w-4" /> Policies</TabsTrigger>
        </TabsList>

        {/* ------------------- Users ------------------- */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Add, search, edit & delete user accounts</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* --- Buttons: Create / Edit / Delete --- */}
              <div className="flex gap-4 mb-6">
                {/* Create User */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline"><Plus className="h-4 w-4 mr-1" /> Create User</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>Create User</DialogTitle></DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const newUser: UserType = {
                          id: (form.elements.namedItem('id') as HTMLInputElement).value,
                          firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
                          lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
                          email: (form.elements.namedItem('email') as HTMLInputElement).value,
                          password: (form.elements.namedItem('password') as HTMLInputElement).value,
                          address: (form.elements.namedItem('address') as HTMLInputElement).value,
                          phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
                          role: (form.elements.namedItem('role') as HTMLSelectElement).value as UserType['role'],
                          status: 'active',
                          lastLogin: '-',
                        };
                        setUsers([...users, newUser]);
                        toast({ title: 'User Created', description: `${newUser.firstName} ${newUser.lastName}` });
                        form.reset();
                      }}
                      className="space-y-3"
                    >
                      <Label>Employee ID</Label>
                      <Input name="id" placeholder="EMP001" required />
                      <Label>First Name</Label>
                      <Input name="firstName" required />
                      <Label>Last Name</Label>
                      <Input name="lastName" required />
                      <Label>Email</Label>
                      <Input type="email" name="email" required />
                      <Label>Password</Label>
                      <Input type="password" name="password" required />
                      <Label>Address</Label>
                      <Input name="address" required />
                      <Label>Phone</Label>
                      <Input name="phone" required />
                      <Label>Role</Label>
                      <select name="role" className="w-full border rounded p-2" required>
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
                      </select>
                      <Button type="submit">Create User</Button>
                    </form>
                  </DialogContent>
                </Dialog>

   {/* Edit User */}
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit User</Button>
  </DialogTrigger>
  <DialogContent className="max-w-lg">
    <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const idInput = form.elements.namedItem('id') as HTMLInputElement;
        const user = users.find(u => u.id === idInput.value);
        if (!user) {
          toast({ title: 'Error', description: `User ID ${idInput.value} not found`, variant: 'destructive' });
          return;
        }

        // Update user
        const updatedUsers = users.map(u =>
          u.id === user.id
            ? {
                ...u,
                firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value || u.firstName,
                lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value || u.lastName,
                email: (form.elements.namedItem('email') as HTMLInputElement).value || u.email,
                address: (form.elements.namedItem('address') as HTMLInputElement).value || u.address,
                phone: (form.elements.namedItem('phone') as HTMLInputElement).value || u.phone,
                role: (form.elements.namedItem('role') as HTMLSelectElement).value as UserType['role'] || u.role,
              }
            : u
        );

        setUsers(updatedUsers);
        toast({ title: 'User Updated', description: `User ${user.id} updated` });
        form.reset();
      }}
      className="space-y-3"
    >
      <Label>Employee ID</Label>
      <Input
        name="id"
        placeholder="EMP001"
        required
        onBlur={(e) => {
          // When user leaves the ID input, autofill the rest
          const user = users.find(u => u.id === e.target.value);
          if (user) {
            const form = e.target.closest('form') as HTMLFormElement;
            (form.elements.namedItem('firstName') as HTMLInputElement).value = user.firstName;
            (form.elements.namedItem('lastName') as HTMLInputElement).value = user.lastName;
            (form.elements.namedItem('email') as HTMLInputElement).value = user.email;
            (form.elements.namedItem('address') as HTMLInputElement).value = user.address;
            (form.elements.namedItem('phone') as HTMLInputElement).value = user.phone;
            (form.elements.namedItem('role') as HTMLSelectElement).value = user.role;
          }
        }}
      />
      <Label>First Name</Label>
      <Input name="firstName" required />
      <Label>Last Name</Label>
      <Input name="lastName" required />
      <Label>Email</Label>
      <Input name="email" required />
      <Label>Address</Label>
      <Input name="address" required />
      <Label>Phone</Label>
      <Input name="phone" required />
      <Label>Role</Label>
      <select name="role" className="w-full border rounded p-2" required>
        <option value="">Select Role</option>
        <option value="Admin">Admin</option>
        <option value="Manager">Manager</option>
        <option value="Employee">Employee</option>
      </select>
      <Button type="submit">Save Changes</Button>
    </form>
  </DialogContent>
</Dialog>


                {/* Delete User */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete User</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Delete User</DialogTitle></DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const id = (form.elements.namedItem('id') as HTMLInputElement).value;
                        const exists = users.find(u => u.id === id);
                        if (!exists) {
                          toast({ title: 'Error', description: `User ID ${id} not found`, variant: 'destructive' });
                          return;
                        }
                        setUsers(users.filter(u => u.id !== id));
                        toast({ title: 'User Deleted', description: `User ${id} removed` });
                        form.reset();
                      }}
                      className="space-y-3"
                    >
                      <Label>Employee ID</Label>
                      <Input name="id" placeholder="EMP001" required />
                      <Button type="submit" variant="destructive">Confirm Delete</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* --- Search & Table --- */}
              <div className="flex gap-2 mb-4 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Address</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="p-2">{u.id}</td>
                      <td className="p-2">{u.firstName} {u.lastName}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{getRoleBadge(u.role)}</td>
                      <td className="p-2">{u.address}</td>
                      <td className="p-2">{u.phone}</td>
                      <td className="p-2">{getStatusBadge(u.status)}</td>
                      <td className="p-2">{u.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------- Training ------------------- */}
<TabsContent value="training">
  <Card>
    <CardHeader className="flex justify-between items-center gap-2">
      <div>
        <CardTitle>Training Modules</CardTitle>
        <CardDescription>Create and manage training modules</CardDescription>
      </div>

      <div className="flex gap-2">
        {/* Add Module */}
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add Module</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Training Module</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;

                const newModule: TrainingModule = {
                  id: Number((form.elements.namedItem("id") as HTMLInputElement).value),
                  title: (form.elements.namedItem("title") as HTMLInputElement).value,
                  subtitle: (form.elements.namedItem("subtitle") as HTMLInputElement).value,
                  questions: [1, 2, 3].map((q) => ({
                    id: q,
                    question: (form.elements.namedItem(`q${q}`) as HTMLInputElement).value,
                    answers: [1, 2, 3].map((a) => ({
                      text: (form.elements.namedItem(`q${q}a${a}`) as HTMLInputElement).value,
                      correct:
                        (form.elements.namedItem(`q${q}correct`) as HTMLSelectElement).value === `a${a}`,
                    })),
                  })),
                };

                addModule(newModule);
                form.reset();
              }}
              className="space-y-4"
            >
              <div>
                <Label>Module ID</Label>
                <Input name="id" type="number" placeholder="Enter Module ID" required />
              </div>
              <div>
                <Label>Module Title</Label>
                <Input name="title" required />
              </div>
              <div>
                <Label>Subtitle / Description</Label>
                <Input name="subtitle" required />
              </div>

              {[1, 2, 3].map((q) => (
                <div key={q} className="border p-3 rounded-md space-y-2">
                  <Label>Question {q}</Label>
                  <Input name={`q${q}`} placeholder={`Enter question ${q}`} required />

                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((a) => (
                      <Input
                        key={a}
                        name={`q${q}a${a}`}
                        placeholder={`Answer ${a}`}
                        required
                      />
                    ))}
                  </div>

                  <div>
                    <Label>Correct Answer</Label>
                    <select
                      name={`q${q}correct`}
                      className="w-full border rounded p-2"
                      required
                    >
                      <option value="">Select Correct Answer</option>
                      <option value="a1">Answer 1</option>
                      <option value="a2">Answer 2</option>
                      <option value="a3">Answer 3</option>
                    </select>
                  </div>
                </div>
              ))}

              <Button type="submit">Save Module</Button>
            </form>
          </DialogContent>
        </Dialog>

        

        {/* Delete Module */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Module</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Training Module</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const id = Number((form.elements.namedItem('id') as HTMLInputElement).value);
                const exists = trainingModules.find(m => m.id === id);
                if (!exists) {
                  toast({ title: 'Error', description: `Module ID ${id} not found`, variant: 'destructive' });
                  return;
                }
                setTrainingModules(trainingModules.filter(m => m.id !== id));
                toast({ title: 'Module Deleted', description: `Module ID ${id} removed` });
                form.reset();
              }}
              className="space-y-3"
            >
              <Label>Module ID</Label>
              <Input name="id" type="number" placeholder="Enter Module ID" required />
              <Button type="submit" variant="destructive">Confirm Delete</Button>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </CardHeader>

    <CardContent className="space-y-3">
      {trainingModules.map((m) => (
        <div key={m.id} className="border rounded-lg p-4">
          <h4 className="font-medium">{m.title} (ID: {m.id})</h4>
          <p className="text-sm text-muted-foreground">{m.subtitle}</p>
          <p className="text-xs text-muted-foreground">{m.questions.length} questions</p>
        </div>
      ))}
    </CardContent>
  </Card>
</TabsContent>


        {/* ------------------- Policies ------------------- */}
   <TabsContent value="policies">
  <Card>
    <CardHeader className="flex justify-between items-center gap-2">
      <div>
        <CardTitle>Policy Management</CardTitle>
        <CardDescription>Create, edit & delete company policies</CardDescription>
      </div>

      <div className="flex gap-2">
        {/* Add Policy */}
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add Policy</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Policy</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const newPolicy: Policy = {
                  id: Number((form.elements.namedItem('id') as HTMLInputElement).value),
                  title: (form.elements.namedItem('title') as HTMLInputElement).value,
                  subtitle: (form.elements.namedItem('subtitle') as HTMLInputElement).value,
                  description: (form.elements.namedItem('description') as HTMLInputElement).value,
                };
                addPolicy(newPolicy);
                form.reset();
              }}
              className="space-y-3"
            >
              <Label>Policy ID</Label>
              <Input name="id" type="number" placeholder="Enter Policy ID" required />
              <Label>Title</Label>
              <Input name="title" required />
              <Label>Subtitle</Label>
              <Input name="subtitle" required />
              <Label>Description</Label>
              <Input name="description" required />
              <Button type="submit">Save Policy</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Policy */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Policy</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Policy</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const id = Number((form.elements.namedItem('id') as HTMLInputElement).value);
                const index = policies.findIndex(p => p.id === id);
                if (index === -1) {
                  toast({ title: 'Error', description: `Policy ID ${id} not found`, variant: 'destructive' });
                  return;
                }
                const updatedPolicies = [...policies];
                updatedPolicies[index] = {
                  ...updatedPolicies[index],
                  title: (form.elements.namedItem('title') as HTMLInputElement).value || updatedPolicies[index].title,
                  subtitle: (form.elements.namedItem('subtitle') as HTMLInputElement).value || updatedPolicies[index].subtitle,
                  description: (form.elements.namedItem('description') as HTMLInputElement).value || updatedPolicies[index].description,
                };
                setPolicies(updatedPolicies);
                toast({ title: 'Policy Updated', description: `Policy ID ${id} updated` });
                form.reset();
              }}
              className="space-y-3"
            >
              <Label>Policy ID</Label>
              <Input name="id" type="number" placeholder="Enter Policy ID to edit" required />
              <Label>Title</Label>
              <Input name="title" placeholder="Leave blank to keep current" />
              <Label>Subtitle</Label>
              <Input name="subtitle" placeholder="Leave blank to keep current" />
              <Label>Description</Label>
              <Input name="description" placeholder="Leave blank to keep current" />
              <Button type="submit">Save Changes</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Policy */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Policy</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Policy</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const id = Number((form.elements.namedItem('id') as HTMLInputElement).value);
                const exists = policies.find(p => p.id === id);
                if (!exists) {
                  toast({ title: 'Error', description: `Policy ID ${id} not found`, variant: 'destructive' });
                  return;
                }
                setPolicies(policies.filter(p => p.id !== id));
                toast({ title: 'Policy Deleted', description: `Policy ID ${id} removed` });
                form.reset();
              }}
              className="space-y-3"
            >
              <Label>Policy ID</Label>
              <Input name="id" type="number" placeholder="Enter Policy ID" required />
              <Button type="submit" variant="destructive">Confirm Delete</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>

    <CardContent className="space-y-3">
      {policies.map((p) => (
        <div key={p.id} className="border rounded-lg p-4">
          <h4 className="font-medium">{p.title} (ID: {p.id})</h4>
          <p className="text-sm text-muted-foreground">{p.subtitle}</p>
          <p className="text-xs text-muted-foreground">{p.description}</p>
        </div>
      ))}
    </CardContent>
  </Card>
</TabsContent>


      </Tabs>
    </div>
  );
};

export default Admin;
