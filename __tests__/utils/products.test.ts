import { products, searchProducts } from '../../products';

describe('searchProducts', () => {
  it('should return all products when query is empty', () => {
    const result = searchProducts('');
    expect(result).toEqual(products);
  });

  it('should return products matching by name (case insensitive)', () => {
    const result = searchProducts('glue');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name.toLowerCase()).toContain('glue');
  });

  it('should return products matching by brand', () => {
    const result = searchProducts('pidilite');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].brand.toLowerCase()).toContain('pidilite');
  });

  it('should return products matching by description', () => {
    const result = searchProducts('adhesive');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(product => 
      product.description.toLowerCase().includes('adhesive')
    )).toBe(true);
  });

  it('should return products matching by tags', () => {
    const result = searchProducts('office');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(product => 
      product.tags.some(tag => tag.toLowerCase().includes('office'))
    )).toBe(true);
  });

  it('should return empty array when no products match', () => {
    const result = searchProducts('nonexistentproduct123');
    expect(result).toEqual([]);
  });

  it('should handle partial matches', () => {
    const result = searchProducts('pen');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(product => 
      product.name.toLowerCase().includes('pen') ||
      product.description.toLowerCase().includes('pen') ||
      product.tags.some(tag => tag.toLowerCase().includes('pen'))
    )).toBe(true);
  });

  it('should be case insensitive', () => {
    const lowerResult = searchProducts('glue');
    const upperResult = searchProducts('GLUE');
    const mixedResult = searchProducts('Glue');
    
    expect(lowerResult).toEqual(upperResult);
    expect(upperResult).toEqual(mixedResult);
  });
});

describe('Product interface', () => {
  it('should have valid product structure', () => {
    const product = products[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('image');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('brand');
    expect(product).toHaveProperty('rating');
    expect(product).toHaveProperty('reviewCount');
    expect(product).toHaveProperty('inStock');
    expect(product).toHaveProperty('isOnSale');
    expect(product).toHaveProperty('isNew');
    expect(product).toHaveProperty('isPickupAvailable');
    expect(product).toHaveProperty('isDeliveryAvailable');
    expect(product).toHaveProperty('tags');
  });

  it('should have valid data types', () => {
    const product = products[0];
    expect(typeof product.id).toBe('string');
    expect(typeof product.name).toBe('string');
    expect(typeof product.description).toBe('string');
    expect(typeof product.price).toBe('number');
    expect(typeof product.image).toBe('string');
    expect(typeof product.category).toBe('string');
    expect(typeof product.brand).toBe('string');
    expect(typeof product.rating).toBe('number');
    expect(typeof product.reviewCount).toBe('number');
    expect(typeof product.inStock).toBe('boolean');
    expect(typeof product.isOnSale).toBe('boolean');
    expect(typeof product.isNew).toBe('boolean');
    expect(typeof product.isPickupAvailable).toBe('boolean');
    expect(typeof product.isDeliveryAvailable).toBe('boolean');
    expect(Array.isArray(product.tags)).toBe(true);
  });
});
