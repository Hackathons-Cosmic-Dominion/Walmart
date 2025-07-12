import { act, renderHook } from '@testing-library/react-native';
import { CartItem, useCartStore } from '../../store/cartStore';

// Mock cart item for testing
const mockCartItem: Omit<CartItem, 'quantity'> = {
  id: '1',
  name: 'Test Product',
  price: 10.99,
  originalPrice: 15.99,
  image: 'https://example.com/image.jpg',
  category: 'Test Category',
  inStock: true,
};

const mockCartItem2: Omit<CartItem, 'quantity'> = {
  id: '2',
  name: 'Second Product',
  price: 5.50,
  image: 'https://example.com/image2.jpg',
  category: 'Test Category',
  inStock: true,
};

describe('Cart Store', () => {
  beforeEach(() => {
    // Clear cart before each test
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  describe('addItem', () => {
    it('should add new item to cart', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toEqual({
        ...mockCartItem,
        quantity: 1,
      });
    });

    it('should increase quantity when adding existing item', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem);
        result.current.addItem(mockCartItem);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should add multiple different items', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem);
        result.current.addItem(mockCartItem2);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].id).toBe('1');
      expect(result.current.items[1].id).toBe('2');
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem);
        result.current.removeItem('1');
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should not affect cart when removing non-existent item', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem);
        result.current.removeItem('999');
      });

      expect(result.current.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem);
        result.current.updateQuantity('1', 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0 or less', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem);
        result.current.updateQuantity('1', 0);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should remove item when quantity is negative', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem);
        result.current.updateQuantity('1', -1);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem);
        result.current.addItem(mockCartItem2);
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('getTotalItems', () => {
    it('should return total number of items', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem); // quantity: 1
        result.current.addItem(mockCartItem2); // quantity: 1
        result.current.updateQuantity('1', 3); // quantity: 3
      });

      expect(result.current.getTotalItems()).toBe(4); // 3 + 1
    });

    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCartStore());
      
      expect(result.current.getTotalItems()).toBe(0);
    });
  });

  describe('getTotalPrice', () => {
    it('should calculate total price correctly', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem); // 10.99
        result.current.addItem(mockCartItem2); // 5.50
        result.current.updateQuantity('1', 2); // 10.99 * 2 = 21.98
      });

      const expectedTotal = (10.99 * 2) + 5.50; // 27.48
      expect(result.current.getTotalPrice()).toBeCloseTo(expectedTotal, 2);
    });

    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCartStore());
      
      expect(result.current.getTotalPrice()).toBe(0);
    });
  });

  describe('getTotalSavings', () => {
    it('should calculate total savings correctly', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem); // savings: 15.99 - 10.99 = 5.00
        result.current.updateQuantity('1', 2); // savings: 5.00 * 2 = 10.00
      });

      expect(result.current.getTotalSavings()).toBeCloseTo(10.00, 2);
    });

    it('should return 0 when no original prices are set', () => {
      const { result } = renderHook(() => useCartStore());
      
      act(() => {
        result.current.addItem(mockCartItem2); // no originalPrice
      });

      expect(result.current.getTotalSavings()).toBe(0);
    });

    it('should return 0 for empty cart', () => {
      const { result } = renderHook(() => useCartStore());
      
      expect(result.current.getTotalSavings()).toBe(0);
    });
  });
});
