import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, otp: string) => Promise<boolean>;
  logout: () => void;
}

// Real users
const mockUsers: User[] = [
  {
    id: '1',
    username: 'employee1',
    email: 'gunaratnewickrama@gmail.com',
    role: 'employee',
    name: 'Gunaratne Wickrama'
  },
  {
    id: '2',
    username: 'employee2',
    email: 'kaluuathal@gmail.com',
    role: 'employee',
    name: 'Kalu Athal'
  },
  {
    id: '3',
    username: 'manager',
    email: 'yasas.nawanjana@gmail.com',
    role: 'manager',
    name: 'Yasas Nawanjana'
  },
  {
    id: '4',
    username: 'admin1',
    email: 'linukaauchithya@gmail.com',
    role: 'admin',
    name: 'Linuka Auchithya'
  },
  {
    id: '5',
    username: 'admin2',
    email: 'nlokuvithana71@gmail.com',
    role: 'admin',
    name: 'N Lokuvithana'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string, otp: string) => {
        // Real authentication with specific passwords
        const user = mockUsers.find(u => u.username === username || u.email === username);
        
        // Check credentials with real passwords
        const validCredentials = user && (
          (user.email === 'linukaauchithya@gmail.com' && password === 'Linuka1@3') ||
          (user.email === 'gunaratnewickrama@gmail.com' && password === 'Sandul1@3') ||
          (user.email === 'kaluuathal@gmail.com' && password === 'Kalu1@3') ||
          (user.email === 'nlokuvithana71@gmail.com' && password === 'Nisith1@3') ||
          (user.email === 'yasas.nawanjana@gmail.com' && password === 'Yasas1@3')
        ) && otp === '123456';
        
        if (validCredentials) {
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