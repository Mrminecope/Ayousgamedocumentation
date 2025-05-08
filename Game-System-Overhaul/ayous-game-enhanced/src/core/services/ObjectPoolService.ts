import { ServiceLocator, ServiceTypes } from './ServiceLocator';

/**
 * Generic object pool for efficiently reusing objects instead of creating and destroying them
 * @template T The type of component to pool
 */
export class ObjectPool<T> {
  private prefab: T;
  private createFn: (prefab: T) => T;
  private resetFn: (obj: T) => void;
  private pool: T[] = [];
  private active: Set<T> = new Set();
  private name: string;

  /**
   * Create a new object pool
   * @param prefab The original object to clone
   * @param initialSize Initial size of the pool
   * @param createFn Function to create a new instance (usually a clone function)
   * @param resetFn Function to reset an object to its initial state
   */
  constructor(
    prefab: T,
    initialSize: number,
    name: string,
    createFn: (prefab: T) => T,
    resetFn: (obj: T) => void
  ) {
    this.prefab = prefab;
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.name = name;

    // Pre-populate the pool
    this.populate(initialSize);
  }

  /**
   * Add objects to the pool
   * @param count Number of objects to add
   */
  private populate(count: number): void {
    for (let i = 0; i < count; i++) {
      const obj = this.createFn(this.prefab);
      this.pool.push(obj);
    }
  }

  /**
   * Get an object from the pool
   * @returns An object from the pool
   */
  public get(): T {
    if (this.pool.length === 0) {
      // If pool is empty, create a new object
      this.populate(1);
    }

    const obj = this.pool.pop() as T;
    this.active.add(obj);
    return obj;
  }

  /**
   * Return an object to the pool
   * @param obj The object to return
   */
  public release(obj: T): void {
    if (this.active.has(obj)) {
      this.active.delete(obj);
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }

  /**
   * Get the name of this pool
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Get the number of objects in the pool
   */
  public getPoolSize(): number {
    return this.pool.length;
  }

  /**
   * Get the number of active objects
   */
  public getActiveCount(): number {
    return this.active.size;
  }

  /**
   * Clear the pool and release all objects
   */
  public clear(): void {
    this.pool = [];
    this.active.clear();
  }
}

/**
 * Interface for the Object Pool Service
 */
export interface IObjectPoolService {
  /**
   * Register a new object pool
   * @param name Unique name for the pool
   * @param prefab The original object to clone
   * @param initialSize Initial size of the pool
   * @param createFn Function to create a new instance
   * @param resetFn Function to reset an object to its initial state
   */
  registerPool<T>(
    name: string,
    prefab: T,
    initialSize: number,
    createFn: (prefab: T) => T,
    resetFn: (obj: T) => void
  ): void;

  /**
   * Get an object from a pool
   * @param name The name of the pool
   */
  get<T>(name: string): T;

  /**
   * Return an object to its pool
   * @param name The name of the pool
   * @param obj The object to return
   */
  release<T>(name: string, obj: T): void;

  /**
   * Check if a pool exists
   * @param name The name of the pool
   */
  hasPool(name: string): boolean;

  /**
   * Get pool statistics
   */
  getStats(): Record<string, { poolSize: number, activeCount: number }>;

  /**
   * Clear all pools
   */
  clearAll(): void;
}

/**
 * Service for managing object pools
 * This service helps reduce garbage collection by reusing objects instead of
 * creating and destroying them repeatedly.
 */
export class ObjectPoolService implements IObjectPoolService {
  private pools: Map<string, ObjectPool<any>> = new Map();

  constructor() {
    // Register this service with the ServiceLocator
    ServiceLocator.register(ServiceTypes.POOL, this);
  }

  public registerPool<T>(
    name: string,
    prefab: T,
    initialSize: number,
    createFn: (prefab: T) => T,
    resetFn: (obj: T) => void
  ): void {
    if (this.pools.has(name)) {
      console.warn(`Pool with name ${name} already exists. Overwriting.`);
    }

    const pool = new ObjectPool<T>(prefab, initialSize, name, createFn, resetFn);
    this.pools.set(name, pool);
  }

  public get<T>(name: string): T {
    const pool = this.pools.get(name) as ObjectPool<T> | undefined;

    if (!pool) {
      throw new Error(`Pool with name ${name} does not exist.`);
    }

    return pool.get();
  }

  public release<T>(name: string, obj: T): void {
    const pool = this.pools.get(name) as ObjectPool<T> | undefined;

    if (!pool) {
      console.warn(`Pool with name ${name} does not exist. Object will not be pooled.`);
      return;
    }

    pool.release(obj);
  }

  public hasPool(name: string): boolean {
    return this.pools.has(name);
  }

  public getStats(): Record<string, { poolSize: number, activeCount: number }> {
    const stats: Record<string, { poolSize: number, activeCount: number }> = {};

    this.pools.forEach((pool, name) => {
      stats[name] = {
        poolSize: pool.getPoolSize(),
        activeCount: pool.getActiveCount()
      };
    });

    return stats;
  }

  public clearAll(): void {
    this.pools.forEach(pool => pool.clear());
    this.pools.clear();
  }
}
