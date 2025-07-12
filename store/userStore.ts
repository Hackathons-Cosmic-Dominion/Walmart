import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    location?: string;
  };
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/150',
      preferences: {
        notifications: true,
        emailUpdates: true,
        location: 'New York, NY',
      },
    };
    
    set({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  },
  
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
  
  updateUser: (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },
  
  updatePreferences: (preferences) => {
    set((state) => ({
      user: state.user ? {
        ...state.user,
        preferences: { ...state.user.preferences, ...preferences },
      } : null,
    }));
  },
})); 