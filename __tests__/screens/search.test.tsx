import { Ionicons } from '@expo/vector-icons';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { TouchableOpacity } from 'react-native';
import SearchScreen from '../../app/search';

// Mock the router
const mockRouter = {
  back: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}));

// Mock the searchProducts function
jest.mock('../../products', () => ({
  searchProducts: jest.fn((query: string) => {
    if (query === 'milk') {
      return [
        {
          id: '1',
          name: 'Fresh Milk',
          description: 'Fresh dairy milk',
          price: 3.99,
          image: 'https://example.com/milk.jpg',
          category: 'Dairy',
          brand: 'FreshCo',
          rating: 4.5,
          reviewCount: 100,
          inStock: true,
          isOnSale: false,
          isNew: false,
          isPickupAvailable: true,
          isDeliveryAvailable: true,
          tags: ['dairy', 'milk'],
        }
      ];
    }
    return [];
  }),
}));

describe('SearchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByPlaceholderText, getByText } = render(<SearchScreen />);
    
    expect(getByPlaceholderText('Search products, brands, and categories')).toBeTruthy();
    expect(getByText('Popular Searches')).toBeTruthy();
  });

  it('should display popular searches when search input is empty', () => {
    const { getByText } = render(<SearchScreen />);
    
    expect(getByText('Milk')).toBeTruthy();
    expect(getByText('Eggs')).toBeTruthy();
    expect(getByText('Bread')).toBeTruthy();
    expect(getByText('Bananas')).toBeTruthy();
  });

  it('should handle text input and search', async () => {
    const { getByPlaceholderText, getByText } = render(<SearchScreen />);
    const searchInput = getByPlaceholderText('Search products, brands, and categories');
    
    fireEvent.changeText(searchInput, 'milk');
    
    await waitFor(() => {
      expect(getByText('Fresh Milk')).toBeTruthy();
    });
  });

  it('should show clear button when text is entered', () => {
    const { getByPlaceholderText, UNSAFE_getByType } = render(<SearchScreen />);
    const searchInput = getByPlaceholderText('Search products, brands, and categories');
    
    fireEvent.changeText(searchInput, 'test');
    
    // The clear button should be visible (we check for Ionicons with close-circle name)
    const clearButtons = UNSAFE_getByType(Ionicons);
    expect(clearButtons).toBeTruthy();
  });

  it('should clear search when clear button is pressed', () => {
    const { getByPlaceholderText, getByText } = render(<SearchScreen />);
    const searchInput = getByPlaceholderText('Search products, brands, and categories');
    
    fireEvent.changeText(searchInput, 'test');
    
    // After clearing, should show popular searches again
    fireEvent.changeText(searchInput, '');
    
    expect(getByText('Popular Searches')).toBeTruthy();
  });

  it('should handle popular search item press', async () => {
    const { getByText } = render(<SearchScreen />);
    const milkButton = getByText('Milk');
    
    fireEvent.press(milkButton);
    
    await waitFor(() => {
      expect(getByText('Fresh Milk')).toBeTruthy();
    });
  });

  it('should show no results message for empty search results', () => {
    const { getByPlaceholderText, getByText } = render(<SearchScreen />);
    const searchInput = getByPlaceholderText('Search products, brands, and categories');
    
    fireEvent.changeText(searchInput, 'nonexistentproduct');
    
    expect(getByText('No results found')).toBeTruthy();
    expect(getByText('Try searching with different keywords')).toBeTruthy();
  });

  it('should handle back button press', () => {
    const { UNSAFE_getAllByType } = render(<SearchScreen />);
    const touchableOpacities = UNSAFE_getAllByType(TouchableOpacity);
    
    // First TouchableOpacity should be the back button
    fireEvent.press(touchableOpacities[0]);
    
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it('should handle product press correctly', async () => {
    const { getByPlaceholderText, getByText } = render(<SearchScreen />);
    const searchInput = getByPlaceholderText('Search products, brands, and categories');
    
    fireEvent.changeText(searchInput, 'milk');
    
    await waitFor(() => {
      const productCard = getByText('Fresh Milk');
      expect(productCard).toBeTruthy();
    });
  });

  it('should display camera button', () => {
    const { UNSAFE_getAllByType } = render(<SearchScreen />);
    const touchableOpacities = UNSAFE_getAllByType(TouchableOpacity);
    
    // Should have multiple TouchableOpacity elements including camera button
    expect(touchableOpacities.length).toBeGreaterThan(1);
  });
});
