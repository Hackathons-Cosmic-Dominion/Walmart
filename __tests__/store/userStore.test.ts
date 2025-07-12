import { act, renderHook } from '@testing-library/react-native';
import { User, useUserStore } from '../../store/userStore';

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  preferences: {
    notifications: true,
    emailUpdates: true,
    location: 'Test City',
  },
};

describe('User Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useUserStore());
    act(() => {
      result.current.logout();
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useUserStore());
      
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('login', () => {
    it('should set loading state during login', async () => {
      const { result } = renderHook(() => useUserStore());
      
      act(() => {
        result.current.login('test@example.com', 'password');
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should authenticate user after successful login', async () => {
      const { result } = renderHook(() => useUserStore());
      
      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBe('test@example.com');
      expect(result.current.isLoading).toBe(false);
    });

    it('should create user with correct data structure', async () => {
      const { result } = renderHook(() => useUserStore());
      
      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      const user = result.current.user;
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('avatar');
      expect(user).toHaveProperty('preferences');
      expect(user?.preferences).toHaveProperty('notifications');
      expect(user?.preferences).toHaveProperty('emailUpdates');
      expect(user?.preferences).toHaveProperty('location');
    });
  });

  describe('logout', () => {
    it('should clear user data on logout', async () => {
      const { result } = renderHook(() => useUserStore());
      
      // First login
      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('updateUser', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useUserStore());
      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });
    });

    it('should update user data', async () => {
      const { result } = renderHook(() => useUserStore());
      
      act(() => {
        result.current.updateUser({ name: 'Updated Name' });
      });

      expect(result.current.user?.name).toBe('Updated Name');
      expect(result.current.user?.email).toBe('test@example.com'); // Should remain unchanged
    });

    it('should not update user when not authenticated', () => {
      const { result } = renderHook(() => useUserStore());
      
      // Logout first
      act(() => {
        result.current.logout();
      });

      // Try to update
      act(() => {
        result.current.updateUser({ name: 'Updated Name' });
      });

      expect(result.current.user).toBeNull();
    });

    it('should update multiple fields', async () => {
      const { result } = renderHook(() => useUserStore());
      
      act(() => {
        result.current.updateUser({ 
          name: 'New Name',
          avatar: 'https://newavatar.com/image.jpg'
        });
      });

      expect(result.current.user?.name).toBe('New Name');
      expect(result.current.user?.avatar).toBe('https://newavatar.com/image.jpg');
    });
  });

  describe('updatePreferences', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useUserStore());
      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });
    });

    it('should update user preferences', async () => {
      const { result } = renderHook(() => useUserStore());
      
      act(() => {
        result.current.updatePreferences({ notifications: false });
      });

      expect(result.current.user?.preferences.notifications).toBe(false);
      expect(result.current.user?.preferences.emailUpdates).toBe(true); // Should remain unchanged
    });

    it('should not update preferences when not authenticated', () => {
      const { result } = renderHook(() => useUserStore());
      
      // Logout first
      act(() => {
        result.current.logout();
      });

      // Try to update preferences
      act(() => {
        result.current.updatePreferences({ notifications: false });
      });

      expect(result.current.user).toBeNull();
    });

    it('should update multiple preferences', async () => {
      const { result } = renderHook(() => useUserStore());
      
      act(() => {
        result.current.updatePreferences({ 
          notifications: false,
          emailUpdates: false,
          location: 'New Location'
        });
      });

      expect(result.current.user?.preferences.notifications).toBe(false);
      expect(result.current.user?.preferences.emailUpdates).toBe(false);
      expect(result.current.user?.preferences.location).toBe('New Location');
    });
  });
});
