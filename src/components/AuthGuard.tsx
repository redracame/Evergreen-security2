import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Login from '@/pages/Login';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: string[];
}

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  if (requiredRole && !requiredRole.includes(user?.role || '')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};