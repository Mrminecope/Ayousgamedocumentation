/**
 * Service Locator Pattern implementation
 *
 * This class provides a centralized registry for game services that can be
 * accessed throughout the application. It replaces the direct singleton access
 * pattern with a more flexible approach that allows for easier testing and
 * better dependency management.
 */
export class ServiceLocator {
  private static services: Map<string, any> = new Map();
  private static debug = false;

  /**
   * Enable or disable debug logging
   */
  public static setDebug(debug: boolean): void {
    ServiceLocator.debug = debug;
  }

  /**
   * Register a service with the locator
   * @param serviceType The interface/type of the service
   * @param implementation The concrete implementation
   */
  public static register<T>(serviceType: string, implementation: T): void {
    if (ServiceLocator.debug) {
      console.log(`Registering service: ${serviceType}`);
    }

    ServiceLocator.services.set(serviceType, implementation);
  }

  /**
   * Get a service from the locator
   * @param serviceType The interface/type of the service to retrieve
   * @returns The service implementation or null if not found
   */
  public static get<T>(serviceType: string): T | null {
    const service = ServiceLocator.services.get(serviceType);

    if (!service && ServiceLocator.debug) {
      console.warn(`Service not found: ${serviceType}`);
    }

    return service as T || null;
  }

  /**
   * Check if a service is registered
   * @param serviceType The interface/type of the service
   */
  public static has(serviceType: string): boolean {
    return ServiceLocator.services.has(serviceType);
  }

  /**
   * Unregister a service
   * @param serviceType The interface/type of the service to unregister
   */
  public static unregister(serviceType: string): void {
    if (ServiceLocator.services.has(serviceType)) {
      ServiceLocator.services.delete(serviceType);

      if (ServiceLocator.debug) {
        console.log(`Unregistered service: ${serviceType}`);
      }
    }
  }

  /**
   * Clear all registered services
   * Useful for testing or when switching scenes
   */
  public static clear(): void {
    ServiceLocator.services.clear();

    if (ServiceLocator.debug) {
      console.log('All services cleared');
    }
  }
}

// Service type constants to avoid magic strings
export class ServiceTypes {
  // Core services
  public static readonly INPUT = 'input-service';
  public static readonly SAVE = 'save-service';
  public static readonly POOL = 'object-pool-service';
  public static readonly AUDIO = 'audio-service';
  public static readonly ANALYTICS = 'analytics-service';
  public static readonly LOGGER = 'logger-service';

  // Gameplay services
  public static readonly PLAYER = 'player-service';
  public static readonly INVENTORY = 'inventory-service';
  public static readonly CRAFTING = 'crafting-service';
  public static readonly SKILL_TREE = 'skill-tree-service';
  public static readonly QUEST = 'quest-service';
  public static readonly WEATHER = 'weather-service';
  public static readonly WORLD_STATE = 'world-state-service';

  // Network services
  public static readonly NETWORK = 'network-service';
  public static readonly VOICE = 'voice-service';
}
