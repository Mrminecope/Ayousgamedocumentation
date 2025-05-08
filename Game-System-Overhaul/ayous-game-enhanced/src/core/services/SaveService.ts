import { ServiceLocator, ServiceTypes } from './ServiceLocator';

/**
 * Base interface for saveable data
 */
export interface ISaveData {
  version: number;
}

/**
 * Main game save data container
 */
export interface IGameSaveData extends ISaveData {
  timestamp: number;
  playerData: IPlayerSaveData;
  worldData: IWorldSaveData;
  inventoryData: IInventorySaveData;
  questData: IQuestSaveData;
  progressData: IProgressSaveData;
}

/**
 * Player-specific save data
 */
export interface IPlayerSaveData extends ISaveData {
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  position: IVector3;
  rotation: IVector3;
  skills: string[];
  stats: Record<string, number>;
}

/**
 * World state save data
 */
export interface IWorldSaveData extends ISaveData {
  weather: string;
  time: number;
  events: Record<string, boolean>;
  territories: Record<string, string>;
  destructibles: string[];
}

/**
 * Inventory save data
 */
export interface IInventorySaveData extends ISaveData {
  items: IItemStack[];
  equippedItems: Record<string, string>;
  resources: Record<string, number>;
}

/**
 * Quest progress save data
 */
export interface IQuestSaveData extends ISaveData {
  completedQuests: string[];
  activeQuests: IQuestProgress[];
  questStates: Record<string, any>;
}

/**
 * General game progress save data
 */
export interface IProgressSaveData extends ISaveData {
  achievements: string[];
  discoveredLocations: string[];
  unlockedRecipes: string[];
  gameTime: number;
}

/**
 * Item stack for inventory
 */
export interface IItemStack {
  id: string;
  count: number;
  data?: Record<string, any>;
}

/**
 * Quest progress information
 */
export interface IQuestProgress {
  id: string;
  objectives: Record<string, number>;
  status: 'active' | 'completed' | 'failed';
  startTime: number;
}

/**
 * Vector3 for position/rotation
 */
export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Save service interface
 */
export interface ISaveService {
  /**
   * Save the current game state
   * @param slotId Optional slot ID (default: 'autosave')
   * @returns Promise resolving to success status
   */
  saveGame(slotId?: string): Promise<boolean>;

  /**
   * Load a saved game
   * @param slotId Optional slot ID (default: 'autosave')
   * @returns Promise resolving to success status
   */
  loadGame(slotId?: string): Promise<boolean>;

  /**
   * Get a list of available save slots
   * @returns Promise resolving to list of save metadata
   */
  listSaveSlots(): Promise<ISaveMetadata[]>;

  /**
   * Delete a save slot
   * @param slotId The slot ID to delete
   * @returns Promise resolving to success status
   */
  deleteSaveSlot(slotId: string): Promise<boolean>;

  /**
   * Create a backup of a save slot
   * @param slotId The slot ID to backup
   * @returns Promise resolving to success status
   */
  createBackup(slotId: string): Promise<boolean>;

  /**
   * Check if a save slot exists
   * @param slotId The slot ID to check
   * @returns Promise resolving to existence status
   */
  saveExists(slotId: string): Promise<boolean>;

  /**
   * Register a provider to collect saveable data
   * @param key Unique key for this provider
   * @param provider Function that returns saveable data
   */
  registerSaveDataProvider<T extends ISaveData>(key: string, provider: () => T): void;

  /**
   * Register a consumer to apply loaded data
   * @param key Unique key for this consumer
   * @param consumer Function that applies loaded data
   */
  registerSaveDataConsumer<T extends ISaveData>(key: string, consumer: (data: T) => void): void;
}

/**
 * Save slot metadata
 */
export interface ISaveMetadata {
  id: string;
  timestamp: number;
  version: number;
  playerLevel?: number;
  playtime?: number;
  thumbnail?: string;
  name?: string;
}

/**
 * Save service implementation
 */
export class SaveService implements ISaveService {
  private saveDataProviders: Map<string, () => ISaveData> = new Map();
  private saveDataConsumers: Map<string, (data: ISaveData) => void> = new Map();
  private readonly AUTO_SAVE_KEY = 'autosave';

  constructor() {
    // Register this service with the service locator
    ServiceLocator.register(ServiceTypes.SAVE, this);
  }

  /**
   * Register a provider to collect saveable data
   * @param key Unique key for this provider
   * @param provider Function that returns saveable data
   */
  public registerSaveDataProvider<T extends ISaveData>(key: string, provider: () => T): void {
    this.saveDataProviders.set(key, provider);
  }

  /**
   * Register a consumer to apply loaded data
   * @param key Unique key for this consumer
   * @param consumer Function that applies loaded data
   */
  public registerSaveDataConsumer<T extends ISaveData>(key: string, consumer: (data: T) => void): void {
    this.saveDataConsumers.set(key, consumer as (data: ISaveData) => void);
  }

  /**
   * Save the current game state
   * @param slotId Optional slot ID (default: 'autosave')
   * @returns Promise resolving to success status
   */
  public async saveGame(slotId: string = this.AUTO_SAVE_KEY): Promise<boolean> {
    try {
      // Collect all save data from providers
      const saveData: IGameSaveData = {
        version: 1,
        timestamp: Date.now(),
        playerData: this.collectData('player') as IPlayerSaveData,
        worldData: this.collectData('world') as IWorldSaveData,
        inventoryData: this.collectData('inventory') as IInventorySaveData,
        questData: this.collectData('quest') as IQuestSaveData,
        progressData: this.collectData('progress') as IProgressSaveData
      };

      // Serialize data to JSON
      const json = JSON.stringify(saveData);

      // In a real game, we would write to a file or storage
      // For this example, we'll use localStorage
      localStorage.setItem(`save_${slotId}`, json);

      console.log(`Game saved to slot: ${slotId}`);
      return true;
    } catch (error) {
      console.error('Error saving game:', error);
      return false;
    }
  }

  /**
   * Load a saved game
   * @param slotId Optional slot ID (default: 'autosave')
   * @returns Promise resolving to success status
   */
  public async loadGame(slotId: string = this.AUTO_SAVE_KEY): Promise<boolean> {
    try {
      // Check if save exists
      const exists = await this.saveExists(slotId);
      if (!exists) {
        console.warn(`No save found in slot: ${slotId}`);
        return false;
      }

      // In a real game, we would read from a file or storage
      // For this example, we'll use localStorage
      const json = localStorage.getItem(`save_${slotId}`);
      if (!json) {
        return false;
      }

      // Parse JSON data
      const saveData: IGameSaveData = JSON.parse(json);

      // Apply data to all registered consumers
      this.applyData('player', saveData.playerData);
      this.applyData('world', saveData.worldData);
      this.applyData('inventory', saveData.inventoryData);
      this.applyData('quest', saveData.questData);
      this.applyData('progress', saveData.progressData);

      console.log(`Game loaded from slot: ${slotId}`);
      return true;
    } catch (error) {
      console.error('Error loading game:', error);
      return false;
    }
  }

  /**
   * Get a list of available save slots
   * @returns Promise resolving to list of save metadata
   */
  public async listSaveSlots(): Promise<ISaveMetadata[]> {
    const result: ISaveMetadata[] = [];

    // In a real game, we would scan a directory or storage
    // For this example, we'll use localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('save_')) {
        const slotId = key.substring(5);
        const json = localStorage.getItem(key);

        if (json) {
          try {
            const saveData: IGameSaveData = JSON.parse(json);
            result.push({
              id: slotId,
              timestamp: saveData.timestamp,
              version: saveData.version,
              playerLevel: saveData.playerData.stats?.level,
              playtime: saveData.progressData.gameTime
            });
          } catch (error) {
            console.warn(`Error parsing save data for slot ${slotId}:`, error);
          }
        }
      }
    }

    // Sort by timestamp (newest first)
    result.sort((a, b) => b.timestamp - a.timestamp);

    return result;
  }

  /**
   * Delete a save slot
   * @param slotId The slot ID to delete
   * @returns Promise resolving to success status
   */
  public async deleteSaveSlot(slotId: string): Promise<boolean> {
    try {
      // In a real game, we would delete a file or storage entry
      // For this example, we'll use localStorage
      localStorage.removeItem(`save_${slotId}`);

      console.log(`Save slot deleted: ${slotId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting save slot ${slotId}:`, error);
      return false;
    }
  }

  /**
   * Create a backup of a save slot
   * @param slotId The slot ID to backup
   * @returns Promise resolving to success status
   */
  public async createBackup(slotId: string): Promise<boolean> {
    try {
      // In a real game, we would copy a file or storage entry
      // For this example, we'll use localStorage
      const json = localStorage.getItem(`save_${slotId}`);
      if (!json) {
        return false;
      }

      const backupId = `${slotId}_backup_${Date.now()}`;
      localStorage.setItem(`save_${backupId}`, json);

      console.log(`Backup created: ${backupId}`);
      return true;
    } catch (error) {
      console.error(`Error creating backup for slot ${slotId}:`, error);
      return false;
    }
  }

  /**
   * Check if a save slot exists
   * @param slotId The slot ID to check
   * @returns Promise resolving to existence status
   */
  public async saveExists(slotId: string): Promise<boolean> {
    // In a real game, we would check if a file or storage entry exists
    // For this example, we'll use localStorage
    return localStorage.getItem(`save_${slotId}`) !== null;
  }

  /**
   * Collect data from a specific provider
   * @param key Provider key
   * @returns The collected data
   */
  private collectData(key: string): ISaveData {
    const provider = this.saveDataProviders.get(key);
    if (!provider) {
      console.warn(`No save data provider found for key: ${key}`);
      return { version: 1 };
    }

    try {
      return provider();
    } catch (error) {
      console.error(`Error collecting save data for ${key}:`, error);
      return { version: 1 };
    }
  }

  /**
   * Apply data to a specific consumer
   * @param key Consumer key
   * @param data The data to apply
   */
  private applyData(key: string, data: ISaveData): void {
    const consumer = this.saveDataConsumers.get(key);
    if (!consumer) {
      console.warn(`No save data consumer found for key: ${key}`);
      return;
    }

    try {
      consumer(data);
    } catch (error) {
      console.error(`Error applying save data for ${key}:`, error);
    }
  }
}
