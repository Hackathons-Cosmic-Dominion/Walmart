import { Ionicons } from '@expo/vector-icons';
import { fireEvent, render } from '@testing-library/react-native';
import { Image } from 'react-native';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../products';

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product description',
  price: 19.99,
  originalPrice: 24.99,
  image: 'https://example.com/product.jpg',
  category: 'Test Category',
  subcategory: 'Test Subcategory',
  brand: 'Test Brand',
  rating: 4.5,
  reviewCount: 125,
  inStock: true,
  isOnSale: true,
  isNew: false,
  isPickupAvailable: true,
  isDeliveryAvailable: true,
  tags: ['test', 'product'],
};

const mockProductOutOfStock: Product = {
  ...mockProduct,
  id: '2',
  inStock: false,
  isOnSale: false,
};

const mockOnPress = jest.fn();

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render product information correctly', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={mockOnPress} />
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$19.99')).toBeTruthy();
    expect(getByText('$24.99')).toBeTruthy();
    expect(getByText('125')).toBeTruthy();
  });

  it('should display sale badge when product is on sale', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={mockOnPress} />
    );

    expect(getByText('SALE')).toBeTruthy();
  });

  it('should not display sale badge when product is not on sale', () => {
    const { queryByText } = render(
      <ProductCard product={mockProductOutOfStock} onPress={mockOnPress} />
    );

    expect(queryByText('SALE')).toBeNull();
  });

  it('should call onPress when product card is pressed', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={mockOnPress} />
    );

    const productCard = getByText('Test Product');
    fireEvent.press(productCard);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should display correct rating stars', () => {
    const { UNSAFE_getAllByType } = render(
      <ProductCard product={mockProduct} onPress={mockOnPress} />
    );

    // Should render star icons for rating
    const ionicons = UNSAFE_getAllByType(Ionicons);
    expect(ionicons.length).toBeGreaterThan(0);
  });

  it('should format price correctly', () => {
    const productWithNoOriginalPrice = {
      ...mockProduct,
      originalPrice: undefined,
    };

    const { getByText } = render(
      <ProductCard product={productWithNoOriginalPrice} onPress={mockOnPress} />
    );

    expect(getByText('$19.99')).toBeTruthy();
  });

  it('should display product image', () => {
    const { UNSAFE_getByType } = render(
      <ProductCard product={mockProduct} onPress={mockOnPress} />
    );

    const image = UNSAFE_getByType(Image);
    expect(image.props.source.uri).toBe('https://example.com/product.jpg');
  });

  it('should display out of stock state correctly', () => {
    const { getByText } = render(
      <ProductCard product={mockProductOutOfStock} onPress={mockOnPress} />
    );

    // The component should still render the product name and price
    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$19.99')).toBeTruthy();
  });

  it('should display review count', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={mockOnPress} />
    );

    expect(getByText('125')).toBeTruthy();
  });

  it('should handle product with zero rating', () => {
    const productWithZeroRating = {
      ...mockProduct,
      rating: 0,
    };

    const { getByText } = render(
      <ProductCard product={productWithZeroRating} onPress={mockOnPress} />
    );

    expect(getByText('Test Product')).toBeTruthy();
  });

  it('should handle product with decimal rating', () => {
    const productWithDecimalRating = {
      ...mockProduct,
      rating: 3.7,
    };

    const { getByText } = render(
      <ProductCard product={productWithDecimalRating} onPress={mockOnPress} />
    );

    expect(getByText('Test Product')).toBeTruthy();
  });
});
