import { OpenFoodFactsProduct } from '../api/OpenFoodFacts';

const CACHE_EXPIRY_HOURS = 24; // Cache for 24 hours
const MAX_CACHE_SIZE = 500; // Maximum number of cached products

interface CacheEntry {
  data: OpenFoodFactsProduct;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

class ProductCacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheStats = {
    hits: 0,
    misses: 0,
    totalRequests: 0
  };

  // Get product from cache
  async getProduct(ean: string): Promise<OpenFoodFactsProduct | null> {
    try {
      this.cacheStats.totalRequests++;
      
      const cacheEntry = this.cache.get(ean);
      
      if (!cacheEntry) {
        console.log('Cache miss for product:', ean);
        this.cacheStats.misses++;
        return null;
      }

      // Check if cache is expired
      const now = Date.now();
      const ageInHours = (now - cacheEntry.timestamp) / (1000 * 60 * 60);
      
      if (ageInHours > CACHE_EXPIRY_HOURS) {
        console.log('Cache expired for product:', ean, 'Age:', ageInHours.toFixed(1), 'hours');
        this.cache.delete(ean);
        this.cacheStats.misses++;
        return null;
      }

      // Update access statistics
      cacheEntry.accessCount++;
      cacheEntry.lastAccessed = now;
      
      console.log('Cache hit for product:', ean, 'Access count:', cacheEntry.accessCount);
      this.cacheStats.hits++;
      return cacheEntry.data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      this.cacheStats.misses++;
      return null;
    }
  }

  // Store product in cache
  async setProduct(ean: string, product: OpenFoodFactsProduct): Promise<void> {
    try {
      const now = Date.now();
      
      const cacheEntry: CacheEntry = {
        data: product,
        timestamp: now,
        accessCount: 1,
        lastAccessed: now
      };

      this.cache.set(ean, cacheEntry);
      console.log('Product cached:', ean, 'Cache size:', this.cache.size);
      
      // Check cache size and cleanup if needed
      this.cleanupIfNeeded();
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }

  // Remove specific product from cache
  async removeProduct(ean: string): Promise<void> {
    try {
      const deleted = this.cache.delete(ean);
      if (deleted) {
        console.log('Product removed from cache:', ean);
      }
    } catch (error) {
      console.error('Error removing from cache:', error);
    }
  }

  // Get cache statistics
  async getCacheStats(): Promise<{
    totalItems: number;
    totalSize: string;
    oldestEntry: string;
    newestEntry: string;
    hitRate: string;
  }> {
    try {
      if (this.cache.size === 0) {
        return {
          totalItems: 0,
          totalSize: '0 B',
          oldestEntry: 'N/A',
          newestEntry: 'N/A',
          hitRate: '0%'
        };
      }

      let totalSize = 0;
      let oldestTimestamp = Date.now();
      let newestTimestamp = 0;

      for (const [ean, entry] of this.cache.entries()) {
        // Estimate size by JSON stringifying the entry
        totalSize += JSON.stringify(entry).length + ean.length;
        if (entry.timestamp < oldestTimestamp) oldestTimestamp = entry.timestamp;
        if (entry.timestamp > newestTimestamp) newestTimestamp = entry.timestamp;
      }

      const formatSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      const formatDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleString();
      };

      const hitRate = this.cacheStats.totalRequests > 0 
        ? ((this.cacheStats.hits / this.cacheStats.totalRequests) * 100).toFixed(1)
        : '0';

      return {
        totalItems: this.cache.size,
        totalSize: formatSize(totalSize),
        oldestEntry: formatDate(oldestTimestamp),
        newestEntry: formatDate(newestTimestamp),
        hitRate: `${hitRate}%`
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        totalItems: 0,
        totalSize: '0 B',
        oldestEntry: 'Error',
        newestEntry: 'Error',
        hitRate: '0%'
      };
    }
  }

  // Cleanup cache if it exceeds maximum size
  private cleanupIfNeeded(): void {
    try {
      if (this.cache.size <= MAX_CACHE_SIZE) {
        return;
      }

      console.log('Cache cleanup needed. Current size:', this.cache.size);

      // Convert to array for sorting
      const entries = Array.from(this.cache.entries());

      // Sort by score (combination of age and access frequency)
      // Lower score = less valuable, will be removed first
      entries.sort(([, a], [, b]) => {
        const now = Date.now();
        const ageA = now - a.lastAccessed;
        const ageB = now - b.lastAccessed;
        const scoreA = a.accessCount / (ageA / (1000 * 60 * 60)); // access per hour
        const scoreB = b.accessCount / (ageB / (1000 * 60 * 60));
        return scoreA - scoreB;
      });

      // Remove least valuable entries
      const itemsToRemove = this.cache.size - MAX_CACHE_SIZE + 50; // Remove extra to avoid frequent cleanup
      
      for (let i = 0; i < itemsToRemove && i < entries.length; i++) {
        const [ean] = entries[i];
        this.cache.delete(ean);
      }
      
      console.log('Cache cleanup completed. Removed', itemsToRemove, 'items. New size:', this.cache.size);
    } catch (error) {
      console.error('Error during cache cleanup:', error);
    }
  }

  // Clear all cached products
  async clearCache(): Promise<void> {
    try {
      const size = this.cache.size;
      this.cache.clear();
      this.cacheStats = { hits: 0, misses: 0, totalRequests: 0 };
      console.log('Cache cleared. Removed', size, 'items');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Preload popular products (could be called on app start)
  async preloadPopularProducts(eansToPreload: string[]): Promise<void> {
    console.log('Preloading', eansToPreload.length, 'popular products');
    
    for (const ean of eansToPreload) {
      const cached = await this.getProduct(ean);
      if (!cached) {
        // Product not in cache, could trigger background fetch
        console.log('Product not cached, could preload:', ean);
      }
    }
  }

  // Get cache hit rate
  async getCacheHitRate(): Promise<number> {
    if (this.cacheStats.totalRequests === 0) return 0;
    return (this.cacheStats.hits / this.cacheStats.totalRequests) * 100;
  }

  // Check if product is cached and not expired
  isProductCached(ean: string): boolean {
    const cacheEntry = this.cache.get(ean);
    if (!cacheEntry) return false;

    const now = Date.now();
    const ageInHours = (now - cacheEntry.timestamp) / (1000 * 60 * 60);
    return ageInHours <= CACHE_EXPIRY_HOURS;
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }
}

export const productCache = new ProductCacheService();
