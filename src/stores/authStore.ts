import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'employee' | 'manager' | 'compliance_officer' | 'admin';
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, otp: string) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    username: 'employee',
    email: 'employee@evergreen.com',
    role: 'employee',
    name: 'John Employee'
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@evergreen.com',
    role: 'manager',
    name: 'Sarah Manager'
  },
  {
    id: '3',
    username: 'compliance',
    email: 'compliance@evergreen.com',
    role: 'compliance_officer',
    name: 'Mike Compliance'
  },
  {
    id: '4',
    username: 'admin',
    email: 'admin@evergreen.com',
    role: 'admin',
    name: 'Lisa Admin'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string, otp: string) => {
        // Mock login - in real app, this would call an API
        const user = mockUsers.find(u => u.username === username);
        
        if (user && password === 'password' && otp === '123456') {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);