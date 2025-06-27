import { LRUCache } from 'lru-cache';

// Cache configuration for analytics and frequently accessed data
const analyticsCache = new LRUCache<string, any>({
  max: 100,
  ttl: 5 * 60 * 1000, // 5 minutes TTL
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
});

const leadCache = new LRUCache<string, any>({
  max: 500,
  ttl: 2 * 60 * 1000, // 2 minutes TTL for lead data
  allowStale: false,
  updateAgeOnGet: true,
  updateAgeOnHas: false,
});

const mcpCache = new LRUCache<string, any>({
  max: 50,
  ttl: 1 * 60 * 1000, // 1 minute TTL for MCP responses
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
});

export class CacheManager {
  static getAnalytics(key: string): any {
    return analyticsCache.get(key);
  }

  static setAnalytics(key: string, value: any): void {
    analyticsCache.set(key, value);
  }

  static getLeads(key: string): any {
    return leadCache.get(key);
  }

  static setLeads(key: string, value: any): void {
    leadCache.set(key, value);
  }

  static getMCP(key: string): any {
    return mcpCache.get(key);
  }

  static setMCP(key: string, value: any): void {
    mcpCache.set(key, value);
  }

  static invalidateAnalytics(): void {
    analyticsCache.clear();
  }

  static invalidateLeads(): void {
    leadCache.clear();
  }

  static invalidateMCP(): void {
    mcpCache.clear();
  }

  static invalidateAll(): void {
    analyticsCache.clear();
    leadCache.clear();
    mcpCache.clear();
  }

  static getCacheStats() {
    return {
      analytics: {
        size: analyticsCache.size,
        max: analyticsCache.max,
        calculatedSize: analyticsCache.calculatedSize,
      },
      leads: {
        size: leadCache.size,
        max: leadCache.max,
        calculatedSize: leadCache.calculatedSize,
      },
      mcp: {
        size: mcpCache.size,
        max: mcpCache.max,
        calculatedSize: mcpCache.calculatedSize,
      },
    };
  }
}