import { ServiceLocator, ServiceTypes } from '../../core/services/ServiceLocator';
import type { ISaveData, IInventorySaveData, ISaveService, IItemStack } from '../../core/services/SaveService';

/**
 * Equipment slot types
 */
export enum EquipmentSlot {
  HEAD = 'head',
  CHEST = 'chest',
  LEGS = 'legs',
  FEET = 'feet',
  HANDS = 'hands',
  MAIN_HAND = 'main_hand',
  OFF_HAND = 'off_hand',
  ACCESSORY_1 = 'accessory_1',
  ACCESSORY_2 = 'accessory_2',
}

/**
 * Item types
 */
export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  CONSUMABLE = 'consumable',
  RESOURCE = 'resource',
  QUEST = 'quest',
  MISC = 'misc',
}

/**
 * Item rarity levels
 */
export enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

/**
 * Item data structure
 */
export interface IItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  stackable: boolean;
  maxStackSize: number;
  equipSlot?: EquipmentSlot;
  stats?: Record<string, number>;
  requirementLevel?: number;
  iconId?: string;
  modelId?: string;
  tags: string[];
}

/**
 * Event types for inventory
 */
export enum InventoryEventType {
  ITEM_ADDED = 'item-added',
  ITEM_REMOVED = 'item-removed',
  ITEM_USED = 'item-used',
  ITEM_EQUIPPED = 'item-equipped',
  ITEM_UNEQUIPPED = 'item-unequipped',
  INVENTORY_FULL = 'inventory-full',
  INVENTORY_CLEARED = 'inventory-cleared',
}

/**
 * Base structure for inventory events
 */
export interface IInventoryEvent {
  type: InventoryEventType;
  timestamp: number;
}

/**
 * Event data for item add/remove
 */
export interface IInventoryItemEvent extends IInventoryEvent {
  itemId: string;
  count: number;
  slotIndex?: number;
}

/**
 * Inventory event listener type
 */
export type InventoryEventListener = (event: IInventoryEvent) => void;

/**
 * Interface for inventory service
 */
export interface IInventoryService {
  // Item management methods
  addItem(itemId: string, count: number): boolean;
  removeItem(itemId: string, count: number): boolean;
  hasItem(itemId: string, count: number): boolean;
  getItemCount(itemId: string): number;
  clearInventory(): void;
  getInventoryItems(): IItemStack[];
  getInventorySize(): number;
  getMaxInventorySize(): number;
  setMaxInventorySize(size: number): void;

  // Equipment methods
  equipItem(itemId: string): boolean;
  unequipItem(slot: EquipmentSlot): boolean;
  getEquippedItem(slot: EquipmentSlot): string | null;
  isSlotEquipped(slot: EquipmentSlot): boolean;
  getAllEquippedItems(): Record<string, string>;

  // Resource methods (for common crafting materials)
  addResource(resourceId: string, count: number): boolean;
  removeResource(resourceId: string, count: number): boolean;
  hasResource(resourceId: string, count: number): boolean;
  getResourceCount(resourceId: string): number;
  getAllResources(): Record<string, number>;

  // Event system for UI updates
  addEventListener(listener: InventoryEventListener): () => void;
  removeEventListener(listener: InventoryEventListener): void;
}

/**
 * Implementation of the inventory service
 */
export class InventoryService implements IInventoryService {
  private items: IItemStack[] = [];
  private equippedItems: Record<string, string> = {};
  private resources: Record<string, number> = {};
  private maxSize = 50;
  private eventListeners: Set<InventoryEventListener> = new Set();

  constructor() {
    // Register with service locator
    ServiceLocator.register(ServiceTypes.INVENTORY, this);

    // Register with save system
    const saveService = ServiceLocator.get<ISaveService>(ServiceTypes.SAVE);
    if (saveService) {
      saveService.registerSaveDataProvider('inventory', this.getSaveData.bind(this));
      saveService.registerSaveDataConsumer('inventory', this.loadFromSaveData.bind(this));
    }

    // Initialize with some demo items
    this.initializeDemoItems();
  }

  /**
   * Add an item to the inventory
   * @param itemId The item ID
   * @param count The count to add
   * @returns True if added successfully
   */
  public addItem(itemId: string, count: number): boolean {
    if (count <= 0) {
      return false;
    }

    // Check if inventory is full
    if (this.items.length >= this.maxSize) {
      // See if we can stack with existing item
      const existingItemIndex = this.items.findIndex(item => item.id === itemId);
      if (existingItemIndex === -1) {
        this.dispatchEvent({
          type: InventoryEventType.INVENTORY_FULL,
          timestamp: Date.now(),
        });
        return false;
      }
    }

    // Find existing item stack
    const existingItem = this.items.find(item => item.id === itemId);

    if (existingItem) {
      // Add to existing stack
      existingItem.count += count;
    } else {
      // Add new stack
      this.items.push({
        id: itemId,
        count,
      });
    }

    // Dispatch event
    this.dispatchEvent({
      type: InventoryEventType.ITEM_ADDED,
      timestamp: Date.now(),
      itemId,
      count,
    } as IInventoryItemEvent);

    return true;
  }

  /**
   * Remove an item from the inventory
   * @param itemId The item ID
   * @param count The count to remove
   * @returns True if removed successfully
   */
  public removeItem(itemId: string, count: number): boolean {
    if (count <= 0) {
      return false;
    }

    // Check if we have enough
    if (!this.hasItem(itemId, count)) {
      return false;
    }

    // Find item stack
    const itemIndex = this.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return false;
    }

    // Remove from stack
    this.items[itemIndex].count -= count;

    // Remove stack if empty
    if (this.items[itemIndex].count <= 0) {
      this.items.splice(itemIndex, 1);
    }

    // Dispatch event
    this.dispatchEvent({
      type: InventoryEventType.ITEM_REMOVED,
      timestamp: Date.now(),
      itemId,
      count,
    } as IInventoryItemEvent);

    return true;
  }

  /**
   * Check if the inventory has enough of an item
   * @param itemId The item ID
   * @param count The count to check
   * @returns True if the inventory has enough
   */
  public hasItem(itemId: string, count: number): boolean {
    if (count <= 0) {
      return true;
    }

    const itemCount = this.getItemCount(itemId);
    return itemCount >= count;
  }

  /**
   * Get the count of an item in the inventory
   * @param itemId The item ID
   * @returns The count (0 if none)
   */
  public getItemCount(itemId: string): number {
    const item = this.items.find(item => item.id === itemId);
    return item ? item.count : 0;
  }

  /**
   * Clear the entire inventory
   */
  public clearInventory(): void {
    this.items = [];

    // Dispatch event
    this.dispatchEvent({
      type: InventoryEventType.INVENTORY_CLEARED,
      timestamp: Date.now(),
    });
  }

  /**
   * Get all inventory items
   * @returns Array of item stacks
   */
  public getInventoryItems(): IItemStack[] {
    return [...this.items];
  }

  /**
   * Get the current inventory size
   * @returns Number of item stacks
   */
  public getInventorySize(): number {
    return this.items.length;
  }

  /**
   * Get the maximum inventory size
   * @returns Maximum number of item stacks
   */
  public getMaxInventorySize(): number {
    return this.maxSize;
  }

  /**
   * Set the maximum inventory size
   * @param size The new maximum size
   */
  public setMaxInventorySize(size: number): void {
    this.maxSize = size;
  }

  /**
   * Equip an item to the appropriate slot
   * @param itemId The item ID to equip
   * @returns True if equipped successfully
   */
  public equipItem(itemId: string): boolean {
    // In a real implementation, we would:
    // 1. Check if the player has the item
    // 2. Check if the item is equipable
    // 3. Determine the correct equipment slot
    // 4. Unequip any existing item in that slot
    // 5. Equip the new item

    // For this demo, we'll just simulate it with a fixed slot
    const slot = EquipmentSlot.MAIN_HAND;

    // Check if item exists in inventory
    if (!this.hasItem(itemId, 1)) {
      return false;
    }

    // Unequip current item in this slot if any
    const currentEquipped = this.equippedItems[slot];
    if (currentEquipped) {
      this.unequipItem(slot);
    }

    // Equip the new item
    this.equippedItems[slot] = itemId;

    // Dispatch event
    this.dispatchEvent({
      type: InventoryEventType.ITEM_EQUIPPED,
      timestamp: Date.now(),
      itemId,
      count: 1,
    } as IInventoryItemEvent);

    return true;
  }

  /**
   * Unequip an item from a slot
   * @param slot The equipment slot
   * @returns True if unequipped successfully
   */
  public unequipItem(slot: EquipmentSlot): boolean {
    const equippedItemId = this.equippedItems[slot];
    if (!equippedItemId) {
      return false;
    }

    // Remove the equipped item
    delete this.equippedItems[slot];

    // Dispatch event
    this.dispatchEvent({
      type: InventoryEventType.ITEM_UNEQUIPPED,
      timestamp: Date.now(),
      itemId: equippedItemId,
      count: 1,
    } as IInventoryItemEvent);

    return true;
  }

  /**
   * Get the item equipped in a slot
   * @param slot The equipment slot
   * @returns The item ID or null if empty
   */
  public getEquippedItem(slot: EquipmentSlot): string | null {
    return this.equippedItems[slot] || null;
  }

  /**
   * Check if a slot has an item equipped
   * @param slot The equipment slot
   * @returns True if the slot has an item
   */
  public isSlotEquipped(slot: EquipmentSlot): boolean {
    return !!this.equippedItems[slot];
  }

  /**
   * Get all equipped items
   * @returns Record of slot to item ID mappings
   */
  public getAllEquippedItems(): Record<string, string> {
    return { ...this.equippedItems };
  }

  /**
   * Add a resource
   * @param resourceId The resource ID
   * @param count The amount to add
   * @returns True if added successfully
   */
  public addResource(resourceId: string, count: number): boolean {
    if (count <= 0) {
      return false;
    }

    // Add to existing resource or initialize
    const currentCount = this.resources[resourceId] || 0;
    this.resources[resourceId] = currentCount + count;

    // Dispatch event
    this.dispatchEvent({
      type: InventoryEventType.ITEM_ADDED,
      timestamp: Date.now(),
      itemId: resourceId,
      count,
    } as IInventoryItemEvent);

    return true;
  }

  /**
   * Remove a resource
   * @param resourceId The resource ID
   * @param count The amount to remove
   * @returns True if removed successfully
   */
  public removeResource(resourceId: string, count: number): boolean {
    if (count <= 0) {
      return false;
    }

    // Check if we have enough
    if (!this.hasResource(resourceId, count)) {
      return false;
    }

    // Remove from resource
    const currentCount = this.resources[resourceId];
    this.resources[resourceId] = currentCount - count;

    // Remove entry if zero
    if (this.resources[resourceId] <= 0) {
      delete this.resources[resourceId];
    }

    // Dispatch event
    this.dispatchEvent({
      type: InventoryEventType.ITEM_REMOVED,
      timestamp: Date.now(),
      itemId: resourceId,
      count,
    } as IInventoryItemEvent);

    return true;
  }

  /**
   * Check if we have enough of a resource
   * @param resourceId The resource ID
   * @param count The amount to check
   * @returns True if we have enough
   */
  public hasResource(resourceId: string, count: number): boolean {
    if (count <= 0) {
      return true;
    }

    const resourceCount = this.getResourceCount(resourceId);
    return resourceCount >= count;
  }

  /**
   * Get the amount of a resource
   * @param resourceId The resource ID
   * @returns The amount (0 if none)
   */
  public getResourceCount(resourceId: string): number {
    return this.resources[resourceId] || 0;
  }

  /**
   * Get all resources
   * @returns Record of resource ID to amount mappings
   */
  public getAllResources(): Record<string, number> {
    return { ...this.resources };
  }

  /**
   * Add an event listener
   * @param listener The listener function
   * @returns Function to remove the listener
   */
  public addEventListener(listener: InventoryEventListener): () => void {
    this.eventListeners.add(listener);

    // Return function to remove listener
    return () => {
      this.removeEventListener(listener);
    };
  }

  /**
   * Remove an event listener
   * @param listener The listener to remove
   */
  public removeEventListener(listener: InventoryEventListener): void {
    this.eventListeners.delete(listener);
  }

  /**
   * Dispatch an event to all listeners
   * @param event The event to dispatch
   */
  private dispatchEvent(event: IInventoryEvent): void {
    for (const listener of this.eventListeners) {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in inventory event listener:', error);
      }
    }
  }

  /**
   * Get save data for this inventory
   * @returns Save data for the inventory
   */
  private getSaveData(): IInventorySaveData {
    return {
      version: 1,
      items: [...this.items],
      equippedItems: { ...this.equippedItems },
      resources: { ...this.resources },
    };
  }

  /**
   * Load from save data
   * @param data The save data to load from
   */
  private loadFromSaveData(data: ISaveData): void {
    // Type cast to our expected type
    const inventoryData = data as IInventorySaveData;

    // Check version and handle migrations if needed
    if (inventoryData.version !== 1) {
      console.warn(`Unknown inventory save data version: ${inventoryData.version}`);
      return;
    }

    // Load the data
    this.items = [...inventoryData.items];
    this.equippedItems = { ...inventoryData.equippedItems };
    this.resources = { ...inventoryData.resources };
  }

  /**
   * Initialize with some demo items
   */
  private initializeDemoItems(): void {
    // Add some demo items
    this.addItem('weapon_sword', 1);
    this.addItem('potion_health', 5);
    this.addItem('armor_chest', 1);

    // Add some demo resources
    this.addResource('wood', 50);
    this.addResource('stone', 25);
    this.addResource('iron_ore', 10);
  }
}
