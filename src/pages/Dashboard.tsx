import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Extend User type with optional joinedAt
interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  joinedAt?: string; // optional to avoid TS errors
}

const policies = [
  {
    title: "Data Privacy & GDPR",
    short: "Understand global data protection regulations.",
    full: "GDPR is a European Union law on data protection and privacy. Employees must ensure safe handling of personal data...",
  },
  {
    title: "Workplace Safety",
    short: "Learn essential safety practices.",
    full: "Workplace safety involves training on emergency exits, hazard awareness, reporting unsafe conditions...",
  },
  {
    title: "Cybersecurity Awareness",
    short: "Protect company and customer data.",
    full: "Cybersecurity requires strong passwords, avoiding phishing links, keeping software updated...",
  },
  {
    title: "Anti-Harassment & Inclusion",
    short: "Promote a respectful and inclusive environment.",
    full: "Employees should respect diversity, avoid discriminatory behavior, and foster a culture of inclusion...",
  },
];

const Dashboard = () => {
  const { user } = useAuthStore() as { user: User | null };
  const [selectedPolicy, setSelectedPolicy] = useState<null | typeof policies[0]>(
    null
  );

  // Awareness progress (hardcoded for now)
  const awarenessProgress = 65;

  // Check if employee is new (joined within last 30 days)
  const isNewEmployee =
    user?.joinedAt &&
    Date.now() - new Date(user.joinedAt).getTime() <
      30 * 24 * 60 * 60 * 1000;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">
          Stay updated and aware of company and global policies
        </p>
      </div>

      {/* Awareness Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Awareness Progress</CardTitle>
          <CardDescription>Your current learning status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{awarenessProgress}%</div>
          <Progress value={awarenessProgress} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Keep going! Complete your awareness training.
          </p>
        </CardContent>
      </Card>

      {/* New Employee Notice */}
      {isNewEmployee && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary">
          <CardHeader>
            <CardTitle>Welcome Aboard!</CardTitle>
            <CardDescription>
              As a new employee, start by reviewing essential policies.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Current Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Current Policies in the World</CardTitle>
          <CardDescription>
            Stay informed and study important regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((policy, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg hover:shadow-md transition"
              >
                <h3 className="font-semibold">{policy.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {policy.short}
                </p>
                <Button
                  size="sm"
                  onClick={() => setSelectedPolicy(policy)}
                >
                  Study Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
              <h3 className="font-semibold">Learn Policies</h3>
              <p className="text-sm text-muted-foreground">
                Study training material
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">Read Updates</h3>
              <p className="text-sm text-muted-foreground">
                Stay current with news
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold">Stay Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Review your compliance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Modal */}
      <Dialog open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPolicy?.title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{selectedPolicy?.full}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
