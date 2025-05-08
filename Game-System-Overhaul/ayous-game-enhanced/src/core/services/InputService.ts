import { ServiceLocator, ServiceTypes } from './ServiceLocator';

/**
 * Available input actions
 */
export enum InputActionType {
  // Movement
  MOVE_FORWARD = 'move-forward',
  MOVE_BACKWARD = 'move-backward',
  MOVE_LEFT = 'move-left',
  MOVE_RIGHT = 'move-right',
  JUMP = 'jump',
  SPRINT = 'sprint',
  CROUCH = 'crouch',

  // Combat
  ATTACK_PRIMARY = 'attack-primary',
  ATTACK_SECONDARY = 'attack-secondary',
  RELOAD = 'reload',
  AIM = 'aim',
  USE_ABILITY_1 = 'use-ability-1',
  USE_ABILITY_2 = 'use-ability-2',
  USE_ABILITY_3 = 'use-ability-3',

  // Interaction
  INTERACT = 'interact',
  USE_ITEM = 'use-item',
  PICK_UP = 'pick-up',
  DROP = 'drop',

  // UI Control
  MENU_TOGGLE = 'menu-toggle',
  INVENTORY_TOGGLE = 'inventory-toggle',
  MAP_TOGGLE = 'map-toggle',
  QUEST_LOG_TOGGLE = 'quest-log-toggle',
  PAUSE = 'pause',

  // Vehicle
  ENTER_EXIT_VEHICLE = 'enter-exit-vehicle',
  VEHICLE_ACCELERATE = 'vehicle-accelerate',
  VEHICLE_BRAKE = 'vehicle-brake',
  VEHICLE_TURN_LEFT = 'vehicle-turn-left',
  VEHICLE_TURN_RIGHT = 'vehicle-turn-right',

  // Camera
  CAMERA_LOOK = 'camera-look',
  CAMERA_ZOOM = 'camera-zoom',

  // Grappling Hook
  GRAPPLE = 'grapple',
  RELEASE_GRAPPLE = 'release-grapple',
}

/**
 * Input context (used to enable/disable groups of inputs)
 */
export enum InputContext {
  PLAYER = 'player',
  VEHICLE = 'vehicle',
  UI = 'ui',
  MENU = 'menu',
  DIALOG = 'dialog',
  CUTSCENE = 'cutscene',
}

/**
 * Possible input states
 */
export enum InputState {
  PRESSED = 'pressed',
  RELEASED = 'released',
  HELD = 'held',
}

/**
 * Input binding for a specific action
 */
export interface IInputBinding {
  action: InputActionType;
  primary: string;
  secondary?: string;
  context: InputContext;
  description: string;
  rebindable: boolean;
}

/**
 * Vector2 for input axes
 */
export interface InputVector2 {
  x: number;
  y: number;
}

/**
 * Handler for input events
 */
export type InputActionHandler = (state: InputState, value?: number | InputVector2) => void;

/**
 * Interface for the input service
 */
export interface IInputService {
  /**
   * Register a handler for an input action
   * @param action The action to listen for
   * @param handler The handler function
   * @returns A function to unregister the handler
   */
  registerActionHandler(action: InputActionType, handler: InputActionHandler): () => void;

  /**
   * Enable a specific input context
   * @param context The context to enable
   */
  enableContext(context: InputContext): void;

  /**
   * Disable a specific input context
   * @param context The context to disable
   */
  disableContext(context: InputContext): void;

  /**
   * Check if an input context is enabled
   * @param context The context to check
   */
  isContextEnabled(context: InputContext): boolean;

  /**
   * Get the current binding for an action
   * @param action The action to get the binding for
   * @returns The binding or null if not found
   */
  getBinding(action: InputActionType): IInputBinding | null;

  /**
   * Rebind an action to a new key
   * @param action The action to rebind
   * @param primary The new primary key
   * @param secondary Optional secondary key
   * @returns True if successful
   */
  rebindAction(action: InputActionType, primary: string, secondary?: string): boolean;

  /**
   * Reset all bindings to defaults
   */
  resetBindings(): void;

  /**
   * Save current bindings
   */
  saveBindings(): void;

  /**
   * Load saved bindings
   */
  loadBindings(): void;

  /**
   * Get the current value of an axis action
   * @param action The action to get the value for
   * @returns The current value (usually between -1 and 1)
   */
  getAxisValue(action: InputActionType): number;

  /**
   * Get the current value of a 2D input (like joystick)
   * @param horizontalAction The horizontal action
   * @param verticalAction The vertical action
   * @returns The current 2D vector value
   */
  getVector2Value(horizontalAction: InputActionType, verticalAction: InputActionType): InputVector2;

  /**
   * Check if an action is currently in a specific state
   * @param action The action to check
   * @param state The state to check for
   * @returns True if the action is in the specified state
   */
  isActionInState(action: InputActionType, state: InputState): boolean;
}

/**
 * Input service implementation
 */
export class InputService implements IInputService {
  private actionHandlers: Map<InputActionType, Set<InputActionHandler>> = new Map();
  private bindings: Map<InputActionType, IInputBinding> = new Map();
  private activeContexts: Set<InputContext> = new Set();
  private keyStates: Map<string, boolean> = new Map();
  private actionStates: Map<InputActionType, InputState> = new Map();

  // Input values for continuous actions (like axes)
  private axisValues: Map<InputActionType, number> = new Map();

  // Default bindings to use when resetting
  private defaultBindings: IInputBinding[] = [
    // Movement bindings
    {
      action: InputActionType.MOVE_FORWARD,
      primary: 'w',
      secondary: 'arrowup',
      context: InputContext.PLAYER,
      description: 'Move Forward',
      rebindable: true,
    },
    {
      action: InputActionType.MOVE_BACKWARD,
      primary: 's',
      secondary: 'arrowdown',
      context: InputContext.PLAYER,
      description: 'Move Backward',
      rebindable: true,
    },
    {
      action: InputActionType.MOVE_LEFT,
      primary: 'a',
      secondary: 'arrowleft',
      context: InputContext.PLAYER,
      description: 'Move Left',
      rebindable: true,
    },
    {
      action: InputActionType.MOVE_RIGHT,
      primary: 'd',
      secondary: 'arrowright',
      context: InputContext.PLAYER,
      description: 'Move Right',
      rebindable: true,
    },
    {
      action: InputActionType.JUMP,
      primary: ' ',
      context: InputContext.PLAYER,
      description: 'Jump',
      rebindable: true,
    },
    {
      action: InputActionType.SPRINT,
      primary: 'shift',
      context: InputContext.PLAYER,
      description: 'Sprint',
      rebindable: true,
    },
    {
      action: InputActionType.CROUCH,
      primary: 'control',
      context: InputContext.PLAYER,
      description: 'Crouch',
      rebindable: true,
    },

    // Combat bindings
    {
      action: InputActionType.ATTACK_PRIMARY,
      primary: 'mouse0',
      context: InputContext.PLAYER,
      description: 'Attack (Primary)',
      rebindable: true,
    },
    {
      action: InputActionType.ATTACK_SECONDARY,
      primary: 'mouse1',
      context: InputContext.PLAYER,
      description: 'Attack (Secondary)',
      rebindable: true,
    },
    {
      action: InputActionType.RELOAD,
      primary: 'r',
      context: InputContext.PLAYER,
      description: 'Reload',
      rebindable: true,
    },
    {
      action: InputActionType.AIM,
      primary: 'mouse1',
      context: InputContext.PLAYER,
      description: 'Aim',
      rebindable: true,
    },

    // Ability bindings
    {
      action: InputActionType.USE_ABILITY_1,
      primary: 'q',
      context: InputContext.PLAYER,
      description: 'Use Ability 1',
      rebindable: true,
    },
    {
      action: InputActionType.USE_ABILITY_2,
      primary: 'e',
      context: InputContext.PLAYER,
      description: 'Use Ability 2',
      rebindable: true,
    },
    {
      action: InputActionType.USE_ABILITY_3,
      primary: 'f',
      context: InputContext.PLAYER,
      description: 'Use Ability 3',
      rebindable: true,
    },

    // Interaction bindings
    {
      action: InputActionType.INTERACT,
      primary: 'e',
      context: InputContext.PLAYER,
      description: 'Interact',
      rebindable: true,
    },
    {
      action: InputActionType.USE_ITEM,
      primary: 'f',
      context: InputContext.PLAYER,
      description: 'Use Item',
      rebindable: true,
    },

    // UI bindings
    {
      action: InputActionType.MENU_TOGGLE,
      primary: 'escape',
      context: InputContext.PLAYER,
      description: 'Toggle Menu',
      rebindable: false,
    },
    {
      action: InputActionType.INVENTORY_TOGGLE,
      primary: 'i',
      context: InputContext.PLAYER,
      description: 'Toggle Inventory',
      rebindable: true,
    },
    {
      action: InputActionType.MAP_TOGGLE,
      primary: 'm',
      context: InputContext.PLAYER,
      description: 'Toggle Map',
      rebindable: true,
    },

    // Grappling hook bindings
    {
      action: InputActionType.GRAPPLE,
      primary: 'mouse1',
      context: InputContext.PLAYER,
      description: 'Grapple',
      rebindable: true,
    },
    {
      action: InputActionType.RELEASE_GRAPPLE,
      primary: ' ',
      context: InputContext.PLAYER,
      description: 'Release Grapple',
      rebindable: true,
    },
  ];

  constructor() {
    // Register with service locator
    ServiceLocator.register(ServiceTypes.INPUT, this);

    // Initialize with default bindings
    this.resetBindings();

    // Try to load saved bindings
    this.loadBindings();

    // Enable player context by default
    this.enableContext(InputContext.PLAYER);

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Register a handler for an input action
   * @param action The action to listen for
   * @param handler The handler function
   * @returns A function to unregister the handler
   */
  public registerActionHandler(action: InputActionType, handler: InputActionHandler): () => void {
    if (!this.actionHandlers.has(action)) {
      this.actionHandlers.set(action, new Set());
    }

    const handlers = this.actionHandlers.get(action)!;
    handlers.add(handler);

    // Return a function to unregister the handler
    return () => {
      const handlers = this.actionHandlers.get(action);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  /**
   * Enable a specific input context
   * @param context The context to enable
   */
  public enableContext(context: InputContext): void {
    this.activeContexts.add(context);
  }

  /**
   * Disable a specific input context
   * @param context The context to disable
   */
  public disableContext(context: InputContext): void {
    this.activeContexts.delete(context);
  }

  /**
   * Check if an input context is enabled
   * @param context The context to check
   */
  public isContextEnabled(context: InputContext): boolean {
    return this.activeContexts.has(context);
  }

  /**
   * Get the current binding for an action
   * @param action The action to get the binding for
   * @returns The binding or null if not found
   */
  public getBinding(action: InputActionType): IInputBinding | null {
    return this.bindings.get(action) || null;
  }

  /**
   * Rebind an action to a new key
   * @param action The action to rebind
   * @param primary The new primary key
   * @param secondary Optional secondary key
   * @returns True if successful
   */
  public rebindAction(action: InputActionType, primary: string, secondary?: string): boolean {
    const binding = this.bindings.get(action);
    if (!binding || !binding.rebindable) {
      return false;
    }

    binding.primary = primary.toLowerCase();
    if (secondary) {
      binding.secondary = secondary.toLowerCase();
    } else {
      binding.secondary = undefined;
    }

    this.bindings.set(action, binding);
    return true;
  }

  /**
   * Reset all bindings to defaults
   */
  public resetBindings(): void {
    this.bindings.clear();

    // Set all default bindings
    for (const binding of this.defaultBindings) {
      this.bindings.set(binding.action, { ...binding });
    }
  }

  /**
   * Save current bindings
   */
  public saveBindings(): void {
    try {
      const bindingsData = Array.from(this.bindings.values());
      localStorage.setItem('input_bindings', JSON.stringify(bindingsData));
    } catch (error) {
      console.error('Error saving input bindings:', error);
    }
  }

  /**
   * Load saved bindings
   */
  public loadBindings(): void {
    try {
      const bindingsJson = localStorage.getItem('input_bindings');
      if (bindingsJson) {
        const bindingsData = JSON.parse(bindingsJson) as IInputBinding[];

        for (const binding of bindingsData) {
          if (this.bindings.has(binding.action)) {
            this.bindings.set(binding.action, binding);
          }
        }
      }
    } catch (error) {
      console.error('Error loading input bindings:', error);
    }
  }

  /**
   * Get the current value of an axis action
   * @param action The action to get the value for
   * @returns The current value (usually between -1 and 1)
   */
  public getAxisValue(action: InputActionType): number {
    return this.axisValues.get(action) || 0;
  }

  /**
   * Get the current value of a 2D input (like joystick)
   * @param horizontalAction The horizontal action
   * @param verticalAction The vertical action
   * @returns The current 2D vector value
   */
  public getVector2Value(
    horizontalAction: InputActionType,
    verticalAction: InputActionType
  ): InputVector2 {
    return {
      x: this.getAxisValue(horizontalAction),
      y: this.getAxisValue(verticalAction),
    };
  }

  /**
   * Check if an action is currently in a specific state
   * @param action The action to check
   * @param state The state to check for
   * @returns True if the action is in the specified state
   */
  public isActionInState(action: InputActionType, state: InputState): boolean {
    return this.actionStates.get(action) === state;
  }

  /**
   * Set up event listeners for keyboard and mouse
   */
  private setupEventListeners(): void {
    // Keyboard event listeners
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));

    // Mouse event listeners
    window.addEventListener('mousedown', this.handleMouseDown.bind(this));
    window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));

    // Handle lost focus
    window.addEventListener('blur', this.handleWindowBlur.bind(this));
  }

  /**
   * Handle key down events
   * @param event Keyboard event
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();

    // Ignore if already pressed (avoid repeat events)
    if (this.keyStates.get(key)) {
      return;
    }

    this.keyStates.set(key, true);
    this.processInputChange(key, true);

    // Update axis values based on key presses
    this.updateAxisValues();
  }

  /**
   * Handle key up events
   * @param event Keyboard event
   */
  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();

    this.keyStates.set(key, false);
    this.processInputChange(key, false);

    // Update axis values based on key presses
    this.updateAxisValues();
  }

  /**
   * Handle mouse down events
   * @param event Mouse event
   */
  private handleMouseDown(event: MouseEvent): void {
    const button = `mouse${event.button}`;

    this.keyStates.set(button, true);
    this.processInputChange(button, true);
  }

  /**
   * Handle mouse up events
   * @param event Mouse event
   */
  private handleMouseUp(event: MouseEvent): void {
    const button = `mouse${event.button}`;

    this.keyStates.set(button, false);
    this.processInputChange(button, false);
  }

  /**
   * Handle mouse move events
   * @param event Mouse event
   */
  private handleMouseMove(event: MouseEvent): void {
    // Update axis values for mouse movement
    // This would be more complex with actual mouse look implementation
    this.axisValues.set(InputActionType.CAMERA_LOOK, 0); // Placeholder
  }

  /**
   * Handle window blur (release all keys)
   */
  private handleWindowBlur(): void {
    // Release all keys when window loses focus
    for (const [key, pressed] of this.keyStates.entries()) {
      if (pressed) {
        this.keyStates.set(key, false);
        this.processInputChange(key, false);
      }
    }

    // Reset all axis values
    for (const action of this.axisValues.keys()) {
      this.axisValues.set(action, 0);
    }
  }

  /**
   * Process input state changes
   * @param key The key that changed
   * @param pressed Whether the key is now pressed
   */
  private processInputChange(key: string, pressed: boolean): void {
    // Find all actions that match this key
    for (const [actionType, binding] of this.bindings.entries()) {
      // Skip if context is not active
      if (!this.activeContexts.has(binding.context)) {
        continue;
      }

      // Check if this key is bound to this action
      if (binding.primary === key || binding.secondary === key) {
        // Update action state
        const newState = pressed ? InputState.PRESSED : InputState.RELEASED;
        this.actionStates.set(actionType, newState);

        // Notify handlers
        this.notifyActionHandlers(actionType, newState);
      }
    }
  }

  /**
   * Update continuous axis values based on current key states
   */
  private updateAxisValues(): void {
    // Horizontal movement axis (left/right)
    let horizontalValue = 0;
    if (this.isKeyForActionPressed(InputActionType.MOVE_RIGHT)) {
      horizontalValue += 1;
    }
    if (this.isKeyForActionPressed(InputActionType.MOVE_LEFT)) {
      horizontalValue -= 1;
    }
    this.axisValues.set(InputActionType.MOVE_RIGHT, horizontalValue);

    // Vertical movement axis (forward/backward)
    let verticalValue = 0;
    if (this.isKeyForActionPressed(InputActionType.MOVE_FORWARD)) {
      verticalValue += 1;
    }
    if (this.isKeyForActionPressed(InputActionType.MOVE_BACKWARD)) {
      verticalValue -= 1;
    }
    this.axisValues.set(InputActionType.MOVE_FORWARD, verticalValue);
  }

  /**
   * Check if a key for a specific action is currently pressed
   * @param action The action to check
   * @returns True if the key for this action is pressed
   */
  private isKeyForActionPressed(action: InputActionType): boolean {
    const binding = this.bindings.get(action);
    if (!binding) {
      return false;
    }

    return (
      (this.keyStates.get(binding.primary) === true) ||
      (binding.secondary && this.keyStates.get(binding.secondary) === true)
    );
  }

  /**
   * Notify all handlers for an action
   * @param action The action that changed
   * @param state The new state
   */
  private notifyActionHandlers(action: InputActionType, state: InputState): void {
    const handlers = this.actionHandlers.get(action);
    if (!handlers) {
      return;
    }

    // Calculate value based on action type
    let value: number | InputVector2 | undefined;

    if (
      action === InputActionType.MOVE_FORWARD ||
      action === InputActionType.MOVE_BACKWARD ||
      action === InputActionType.MOVE_LEFT ||
      action === InputActionType.MOVE_RIGHT
    ) {
      value = this.getAxisValue(action);
    } else if (action === InputActionType.CAMERA_LOOK) {
      value = {
        x: this.getAxisValue(InputActionType.CAMERA_LOOK),
        y: 0, // Placeholder
      };
    }

    // Notify all handlers
    for (const handler of handlers) {
      handler(state, value);
    }
  }
}
