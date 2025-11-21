// lib/server-cache.ts
/**
 * 服务端通用缓存类
 * 支持内存缓存、TTL过期时间、缓存清理等功能
 */

export interface CacheOptions {
    defaultTTL?: number; // 默认缓存时间（毫秒）
    maxSize?: number; // 最大缓存条目数
    cleanupInterval?: number; // 自动清理间隔（毫秒）
}

export interface CacheItem<T> {
    data: T;
    timestamp: number;
    expires: number;
}

export class ServerCache<T = any> {
    private cache = new Map<string, CacheItem<T>>();
    private defaultTTL: number;
    private maxSize: number;
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor(options: CacheOptions = {}) {
        this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 默认5分钟
        this.maxSize = options.maxSize || 1000; // 默认1000条
        this.startCleanup(options.cleanupInterval || 60 * 1000); // 默认1分钟清理一次
    }

    /**
     * 设置缓存
     * @param key 缓存键
     * @param data 缓存数据
     * @param ttl 过期时间（毫秒）
     */
    set(key: string, data: T, ttl?: number): void {
        // 如果超过最大大小，清理最旧的条目
        if (this.cache.size >= this.maxSize) {
            this.evictOldest();
        }

        const now = Date.now();
        const expires = now + (ttl || this.defaultTTL);

        this.cache.set(key, {
            data,
            timestamp: now,
            expires
        });
    }

    /**
     * 获取缓存
     * @param key 缓存键
     * @returns 缓存数据或null
     */
    get(key: string): T | null {
        const item = this.cache.get(key);

        if (!item) {
            return null;
        }

        // 检查是否过期
        if (Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    /**
     * 获取缓存，如果不存在则设置
     * @param key 缓存键
     * @param factory 数据工厂函数
     * @param ttl 过期时间
     * @returns 缓存数据
     */
    async getOrSet(key: string, factory: () => Promise<T>, ttl?: number): Promise<T> {
        const cached = this.get(key);
        if (cached !== null) {
            // console.log('cache hit: ' + cached)
            return cached;
        }

        const data = await factory();
        this.set(key, data, ttl);
        return data;
    }

    /**
     * 删除缓存
     * @param key 缓存键
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * 检查缓存是否存在且未过期
     * @param key 缓存键
     */
    has(key: string): boolean {
        const item = this.cache.get(key);
        if (!item) return false;

        if (Date.now() > item.expires) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /**
     * 获取所有缓存键
     */
    keys(): string[] {
        return Array.from(this.cache.keys());
    }

    /**
     * 清空所有缓存
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * 获取缓存大小
     */
    size(): number {
        return this.cache.size;
    }

    /**
     * 获取缓存统计信息
     */
    getStats(): {
        size: number;
        keys: string[];
        hitRate?: number;
    } {
        return {
            size: this.cache.size,
            keys: this.keys()
        };
    }

    /**
     * 清理过期缓存
     */
    cleanup(): number {
        const now = Date.now();
        let deletedCount = 0;

        for (const [key, item] of this.cache.entries()) {
            if (now > item.expires) {
                this.cache.delete(key);
                deletedCount++;
            }
        }

        return deletedCount;
    }

    /**
     * 驱逐最旧的缓存条目
     */
    private evictOldest(): void {
        let oldestKey: string | null = null;
        let oldestTime = Date.now();

        for (const [key, item] of this.cache.entries()) {
            if (item.timestamp < oldestTime) {
                oldestTime = item.timestamp;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }

    /**
     * 启动自动清理
     * @param interval 清理间隔
     */
    private startCleanup(interval: number): void {
        this.cleanupInterval = setInterval(() => {
            const deleted = this.cleanup();
            if (deleted > 0) {
                console.log(`[ServerCache] Cleaned up ${deleted} expired items`);
            }
        }, interval);
    }

    /**
     * 停止自动清理
     */
    stopCleanup(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

    /**
     * 销毁缓存实例
     */
    destroy(): void {
        this.stopCleanup();
        this.clear();
    }
}

// 默认缓存实例
export const defaultCache = new ServerCache();

// 分类专用缓存实例
export const categoryCache = new ServerCache({
    defaultTTL: 2 * 60 * 1000, // 2分钟
    maxSize: 500,
    cleanupInterval: 30 * 1000 // 30秒清理一次
});

// 用户数据缓存实例
export const userCache = new ServerCache({
    defaultTTL: 10 * 60 * 1000, // 10分钟
    maxSize: 1000
});