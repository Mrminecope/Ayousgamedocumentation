import { ServiceLocator, ServiceTypes } from './core/services/ServiceLocator';
import { InputService, InputActionType, type InputState } from './core/services/InputService';
import { ObjectPoolService } from './core/services/ObjectPoolService';
import { SaveService } from './core/services/SaveService';
import { InventoryService, InventoryEventType, type IInventoryEvent } from './gameplay/inventory/InventoryService';

// Create app div
const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) {
  const newAppElement = document.createElement('div');
  newAppElement.id = 'app';
  document.body.appendChild(newAppElement);
}

// Initialize services
ServiceLocator.setDebug(true); // Enable debug logging

// Create services
new InputService();
new ObjectPoolService();
new SaveService();
new InventoryService();

// Demo UI
const app = document.querySelector<HTMLDivElement>("#app");
if (app) {
  app.innerHTML = `
    <div class="game-demo">
      <h1>Ayous Game Enhanced</h1>
      <div class="service-panel">
        <h2>Services Demo</h2>
        <div class="service-card">
          <h3>Input System</h3>
          <div id="input-demo">
            <p>Press keys to see events:</p>
            <div id="key-events"></div>
            <div class="axis-display">
              <label>Movement Input:</label>
              <div class="axis-indicator">
                <div id="axis-marker"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="service-card">
          <h3>Save System</h3>
          <div id="save-demo">
            <button id="save-button">Save Game</button>
            <button id="load-button">Load Game</button>
            <div id="save-status"></div>
          </div>
        </div>

        <div class="service-card">
          <h3>Object Pooling</h3>
          <div id="pool-demo">
            <button id="create-objects">Create 10 Objects</button>
            <button id="return-objects">Return Objects</button>
            <div id="pool-stats"></div>
          </div>
        </div>

        <div class="service-card">
          <h3>Inventory System</h3>
          <div id="inventory-demo">
            <div id="inventory-actions">
              <button id="add-health-potion">Add Health Potion</button>
              <button id="add-wood">Add Wood</button>
              <button id="use-health-potion">Use Health Potion</button>
              <button id="equip-sword">Equip Sword</button>
            </div>
            <div id="inventory-display">
              <h4>Items:</h4>
              <div id="item-list"></div>
              <h4>Resources:</h4>
              <div id="resource-list"></div>
              <h4>Equipped:</h4>
              <div id="equipped-items"></div>
              <h4>Events:</h4>
              <div id="inventory-events"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  setupStyles();
  setupInputDemo();
  setupSaveDemo();
  setupPoolDemo();
  setupInventoryDemo();
}

// Setup CSS styles
function setupStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    body {
      font-family: 'Arial', sans-serif;
      background-color: #1a1a2e;
      color: #e6e6e6;
      margin: 0;
      padding: 20px;
    }

    .game-demo {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      color: #4cc9f0;
      margin-bottom: 30px;
    }

    h2 {
      color: #4361ee;
      border-bottom: 2px solid #4361ee;
      padding-bottom: 10px;
    }

    h3 {
      color: #3a86ff;
      margin-top: 0;
    }

    h4 {
      color: #4cc9f0;
      margin-top: 15px;
      margin-bottom: 5px;
    }

    .service-panel {
      background-color: #16213e;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .service-card {
      background-color: #0f3460;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }

    button {
      background-color: #4361ee;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      margin-right: 10px;
      margin-bottom: 10px;
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: #3a86ff;
    }

    #key-events, #inventory-events {
      height: 100px;
      overflow-y: auto;
      background-color: #1e2a4a;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 15px;
      font-family: monospace;
      font-size: 0.9em;
    }

    .axis-display {
      margin-top: 15px;
    }

    .axis-indicator {
      width: 100px;
      height: 100px;
      background-color: #1e2a4a;
      border-radius: 50%;
      position: relative;
      margin: 10px auto;
    }

    #axis-marker {
      width: 20px;
      height: 20px;
      background-color: #e63946;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.1s ease-out;
    }

    #save-status, #pool-stats {
      background-color: #1e2a4a;
      padding: 10px;
      border-radius: 5px;
      margin-top: 15px;
      font-family: monospace;
      min-height: 50px;
    }

    #inventory-display {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    #item-list, #resource-list, #equipped-items {
      background-color: #1e2a4a;
      padding: 10px;
      border-radius: 5px;
      min-height: 80px;
      font-family: monospace;
    }

    .item {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }

    .item-name {
      font-weight: bold;
    }

    .common { color: #b0b0b0; }
    .uncommon { color: #42b983; }
    .rare { color: #3a86ff; }
    .epic { color: #a56cc1; }
    .legendary { color: #e8a400; }
  `;
  document.head.appendChild(styleElement);
}

// Setup input demo
function setupInputDemo() {
  const keyEvents = document.getElementById('key-events');
  const axisMarker = document.getElementById('axis-marker');

  if (!keyEvents || !axisMarker) return;

  const inputService = ServiceLocator.get<InputService>(ServiceTypes.INPUT);
  if (!inputService) return;

  // Register handlers for movement keys
  inputService.registerActionHandler(
    InputActionType.MOVE_FORWARD,
    (state) => {
      logKeyEvent('FORWARD', state);
      updateAxisVisual();
    }
  );

  inputService.registerActionHandler(
    InputActionType.MOVE_BACKWARD,
    (state) => {
      logKeyEvent('BACKWARD', state);
      updateAxisVisual();
    }
  );

  inputService.registerActionHandler(
    InputActionType.MOVE_LEFT,
    (state) => {
      logKeyEvent('LEFT', state);
      updateAxisVisual();
    }
  );

  inputService.registerActionHandler(
    InputActionType.MOVE_RIGHT,
    (state) => {
      logKeyEvent('RIGHT', state);
      updateAxisVisual();
    }
  );

  inputService.registerActionHandler(
    InputActionType.JUMP,
    (state) => {
      logKeyEvent('JUMP', state);
    }
  );

  function logKeyEvent(action: string, state: InputState) {
    const timestamp = new Date().toLocaleTimeString();
    keyEvents.innerHTML = `<div>[${timestamp}] Action: ${action}, State: ${state}</div>${keyEvents.innerHTML}`;

    // Only keep the latest 10 events
    const events = keyEvents.querySelectorAll('div');
    if (events.length > 10) {
      for (let i = 10; i < events.length; i++) {
        events[i].remove();
      }
    }
  }

  function updateAxisVisual() {
    if (!inputService || !axisMarker) return;

    // Get movement vector
    const vector = inputService.getVector2Value(
      InputActionType.MOVE_RIGHT,
      InputActionType.MOVE_FORWARD
    );

    // Update marker position (convert from -1,1 to 0,100 range)
    const x = 50 + vector.x * 40;
    const y = 50 - vector.y * 40; // Invert Y for visual representation

    axisMarker.style.left = `${x}%`;
    axisMarker.style.top = `${y}%`;
  }
}

// Setup save system demo
function setupSaveDemo() {
  const saveButton = document.getElementById('save-button');
  const loadButton = document.getElementById('load-button');
  const saveStatus = document.getElementById('save-status');

  if (!saveButton || !loadButton || !saveStatus) return;

  const saveService = ServiceLocator.get<SaveService>(ServiceTypes.SAVE);
  if (!saveService) return;

  // Register demo data providers and consumers
  saveService.registerSaveDataProvider('player', () => ({
    version: 1,
    health: 75,
    maxHealth: 100,
    stamina: 50,
    maxStamina: 100,
    position: { x: 100, y: 20, z: 300 },
    rotation: { x: 0, y: 90, z: 0 },
    skills: ['jump', 'sprint', 'swim'],
    stats: { level: 5, experience: 1250 }
  }));

  saveService.registerSaveDataConsumer('player', (data) => {
    console.log('Player data loaded:', data);
  });

  saveButton.addEventListener('click', async () => {
    const success = await saveService.saveGame('demo');
    saveStatus.textContent = success
      ? `Game saved successfully at ${new Date().toLocaleTimeString()}`
      : 'Failed to save game';
  });

  loadButton.addEventListener('click', async () => {
    const success = await saveService.loadGame('demo');
    saveStatus.textContent = success
      ? `Game loaded successfully at ${new Date().toLocaleTimeString()}`
      : 'Failed to load game (no save found)';
  });
}

// Setup object pooling demo
function setupPoolDemo() {
  const createButton = document.getElementById('create-objects');
  const returnButton = document.getElementById('return-objects');
  const poolStats = document.getElementById('pool-stats');

  if (!createButton || !returnButton || !poolStats) return;

  const poolService = ServiceLocator.get<ObjectPoolService>(ServiceTypes.POOL);
  if (!poolService) return;

  // Define a simple demo object
  class DemoObject {
    id: number;
    name: string;

    constructor(id: number) {
      this.id = id;
      this.name = `Object_${id}`;
    }

    reset(): void {
      // Reset the object state
      console.log(`Reset ${this.name}`);
    }
  }

  // Create a demo pool
  poolService.registerPool<DemoObject>(
    'demo-objects',
    new DemoObject(0),
    5,
    (prefab) => new DemoObject(Math.floor(Math.random() * 1000)),
    (obj) => obj.reset()
  );

  const activeObjects: DemoObject[] = [];

  createButton.addEventListener('click', () => {
    // Get 10 objects from the pool
    for (let i = 0; i < 10; i++) {
      try {
        const obj = poolService.get<DemoObject>('demo-objects');
        activeObjects.push(obj);
      } catch (error) {
        console.error('Error getting object from pool:', error);
      }
    }

    updateStats();
  });

  returnButton.addEventListener('click', () => {
    // Return all active objects to the pool
    while (activeObjects.length > 0) {
      const obj = activeObjects.pop();
      if (obj) {
        poolService.release('demo-objects', obj);
      }
    }

    updateStats();
  });

  function updateStats() {
    const stats = poolService.getStats();

    poolStats.innerHTML = `
      <div>Active Objects: ${activeObjects.length}</div>
      <div>Pool Size: ${stats['demo-objects']?.poolSize || 0}</div>
      <div>Total Objects: ${(stats['demo-objects']?.poolSize || 0) + activeObjects.length}</div>
    `;
  }

  // Initial stats update
  updateStats();
}

// Setup inventory demo
function setupInventoryDemo() {
  const addHealthButton = document.getElementById('add-health-potion');
  const addWoodButton = document.getElementById('add-wood');
  const useHealthButton = document.getElementById('use-health-potion');
  const equipSwordButton = document.getElementById('equip-sword');
  const itemList = document.getElementById('item-list');
  const resourceList = document.getElementById('resource-list');
  const equippedItems = document.getElementById('equipped-items');
  const inventoryEvents = document.getElementById('inventory-events');

  if (!addHealthButton || !addWoodButton || !useHealthButton ||
      !equipSwordButton || !itemList || !resourceList ||
      !equippedItems || !inventoryEvents) return;

  const inventoryService = ServiceLocator.get<InventoryService>(ServiceTypes.INVENTORY);
  if (!inventoryService) return;

  // Add event listener for inventory events
  inventoryService.addEventListener((event: IInventoryEvent) => {
    const timestamp = new Date().toLocaleTimeString();
    const eventInfo = JSON.stringify(event, null, 2);
    inventoryEvents.innerHTML = `<div>[${timestamp}] ${event.type}</div>${inventoryEvents.innerHTML}`;

    // Only keep the latest 5 events
    const events = inventoryEvents.querySelectorAll('div');
    if (events.length > 5) {
      for (let i = 5; i < events.length; i++) {
        events[i].remove();
      }
    }

    // Update displays
    updateInventoryDisplay();
  });

  // Button event handlers
  addHealthButton.addEventListener('click', () => {
    inventoryService.addItem('potion_health', 1);
  });

  addWoodButton.addEventListener('click', () => {
    inventoryService.addResource('wood', 10);
  });

  useHealthButton.addEventListener('click', () => {
    if (inventoryService.hasItem('potion_health', 1)) {
      inventoryService.removeItem('potion_health', 1);
      console.log('Used health potion');
    } else {
      console.log('No health potions available');
    }
  });

  equipSwordButton.addEventListener('click', () => {
    inventoryService.equipItem('weapon_sword');
  });

  function updateInventoryDisplay() {
    // Update items
    const items = inventoryService.getInventoryItems();
    itemList.innerHTML = items.length === 0
      ? '<div>No items</div>'
      : items.map(item => `
          <div class="item">
            <span class="item-name uncommon">${formatItemName(item.id)}</span>
            <span>x${item.count}</span>
          </div>
        `).join('');

    // Update resources
    const resources = inventoryService.getAllResources();
    resourceList.innerHTML = Object.keys(resources).length === 0
      ? '<div>No resources</div>'
      : Object.entries(resources).map(([id, count]) => `
          <div class="item">
            <span class="item-name common">${formatItemName(id)}</span>
            <span>x${count}</span>
          </div>
        `).join('');

    // Update equipped items
    const equipped = inventoryService.getAllEquippedItems();
    equippedItems.innerHTML = Object.keys(equipped).length === 0
      ? '<div>Nothing equipped</div>'
      : Object.entries(equipped).map(([slot, itemId]) => `
          <div class="item">
            <span class="slot-name">${formatSlotName(slot)}:</span>
            <span class="item-name rare">${formatItemName(itemId)}</span>
          </div>
        `).join('');
  }

  function formatItemName(id: string): string {
    // Simple utility to make item IDs more readable
    return id
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function formatSlotName(slot: string): string {
    // Simple utility to make slot IDs more readable
    return slot
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Initial display update
  updateInventoryDisplay();
}
