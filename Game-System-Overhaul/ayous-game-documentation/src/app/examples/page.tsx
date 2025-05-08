import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CodeExamplesPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">← Back to Home</Link>
        </Button>
        <h1 className="text-4xl font-bold">Code Examples</h1>
        <p className="text-xl mt-2 text-muted-foreground">
          Before and after code improvements for the Ayous Game
        </p>
      </div>

      <Tabs defaultValue="singleton">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="singleton">Singleton Pattern</TabsTrigger>
          <TabsTrigger value="save-system">Save System</TabsTrigger>
          <TabsTrigger value="input">Input System</TabsTrigger>
          <TabsTrigger value="object-pooling">Object Pooling</TabsTrigger>
        </TabsList>

        <TabsContent value="singleton" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Replacing Singletons with Service Locator</CardTitle>
              <CardDescription>
                Moving from tight coupling with singletons to a more flexible service locator pattern
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Problem</h3>
                <p className="mb-4">
                  In the current codebase, almost every manager class is implemented as a singleton
                  with direct static access. This creates tight coupling between systems and makes
                  testing difficult.
                </p>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Before:</h4>
                  <pre className="overflow-x-auto text-sm">
{`public class WeatherManager : MonoBehaviour
{
    public static WeatherManager Instance;
    public ParticleSystem rain, snow; public Light sun;
    public enum Weather { Clear, Rain, Snow, Storm }
    public Weather current;
    void Awake() { Instance = this; DontDestroyOnLoad(gameObject); }

    // Weather methods...
}

// Accessed directly from other classes:
public class PlayerController : MonoBehaviour
{
    void Update()
    {
        // Direct access to other singleton
        if (WeatherManager.Instance.current == WeatherManager.Weather.Rain)
        {
            walkSpeed = 4f; // Reduced speed in rain
        }
    }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Solution</h3>
                <p className="mb-4">
                  Implement a service locator pattern that allows systems to register and request services.
                  This maintains the convenience of global access but allows for better testing and flexibility.
                </p>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">After:</h4>
                  <pre className="overflow-x-auto text-sm">
{`// ServiceLocator implementation
public static class ServiceLocator
{
    private static readonly Dictionary<Type, object> services = new Dictionary<Type, object>();

    public static void Register<T>(T service)
    {
        services[typeof(T)] = service;
    }

    public static T Get<T>()
    {
        if (services.TryGetValue(typeof(T), out var service))
        {
            return (T)service;
        }

        Debug.LogWarning($"Service {typeof(T).Name} not found!");
        return default;
    }

    public static void Reset()
    {
        services.Clear();
    }
}

// Weather manager using service locator
public class WeatherManager : MonoBehaviour, IWeatherService
{
    public ParticleSystem rain, snow; public Light sun;
    public enum Weather { Clear, Rain, Snow, Storm }
    public Weather current;

    void Awake()
    {
        // Register this instance as the weather service
        ServiceLocator.Register<IWeatherService>(this);
    }

    // Weather methods...
}

// Interface for easier testing/mocking
public interface IWeatherService
{
    WeatherManager.Weather current { get; }
    // Other methods...
}

// Usage in other classes:
public class PlayerController : MonoBehaviour
{
    private IWeatherService weatherService;

    void Start()
    {
        // Get the service reference once
        weatherService = ServiceLocator.Get<IWeatherService>();
    }

    void Update()
    {
        // Use the service through its interface
        if (weatherService != null && weatherService.current == WeatherManager.Weather.Rain)
        {
            walkSpeed = 4f; // Reduced speed in rain
        }
    }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Benefits</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Decouples systems through service interfaces</li>
                  <li>Makes testing easier by allowing service replacement</li>
                  <li>Provides a central registration point for services</li>
                  <li>Maintains some convenience of global access</li>
                  <li>Makes dependencies explicit with clearer error messages</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Implementation Steps</h3>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Create ServiceLocator class with Register/Get methods</li>
                  <li>Create interfaces for each manager service</li>
                  <li>Modify managers to implement their interfaces</li>
                  <li>Register services in Awake methods</li>
                  <li>Replace direct singleton access with service requests</li>
                  <li>Add null checks when using services</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="save-system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementing a Save/Load System</CardTitle>
              <CardDescription>
                Adding data persistence to the game with JSON serialization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Problem</h3>
                <p className="mb-4">
                  The current game has no save system. Player progress, inventory, and world state are lost
                  when the game is closed or a scene is reloaded.
                </p>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Before:</h4>
                  <pre className="overflow-x-auto text-sm">
{`// Empty stub methods for saving/loading
public class SaveManager : MonoBehaviour
{
    public static SaveManager Instance;
    public Dictionary<string, int> legacyData = new Dictionary<string, int>();

    void Awake()
    {
        if (Instance == null) { Instance = this; DontDestroyOnLoad(gameObject); }
        else { Destroy(gameObject); }
    }

    public void SaveGame()
    {
        // Save logic - empty
    }

    public void LoadGame()
    {
        // Load logic - empty
    }
}

// Inventory with no serialization
public class Inventory : MonoBehaviour
{
    public List<ItemStack> items = new();

    // Methods to add/remove items...
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Solution</h3>
                <p className="mb-4">
                  Implement a comprehensive save/load system using JSON serialization and file I/O.
                  Create serializable data containers for each game system.
                </p>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">After:</h4>
                  <pre className="overflow-x-auto text-sm">
{`// Define serializable data containers
[System.Serializable]
public class GameSaveData
{
    public PlayerSaveData player = new();
    public InventorySaveData inventory = new();
    public QuestSaveData quests = new();
    public WorldSaveData world = new();
}

[System.Serializable]
public class PlayerSaveData
{
    public float health;
    public float stamina;
    public Vector3Position position;
    public int[] unlockedSkills;
}

[System.Serializable]
public class Vector3Position
{
    public float x, y, z;

    public Vector3Position(Vector3 v)
    {
        x = v.x;
        y = v.y;
        z = v.z;
    }

    public Vector3 ToVector3() => new Vector3(x, y, z);
}

[System.Serializable]
public class InventorySaveData
{
    public List<ItemStack> items = new();
}

// Enhanced SaveManager
public class SaveManager : MonoBehaviour, ISaveService
{
    // Interface for better testing
    public interface ISaveService
    {
        void SaveGame();
        bool LoadGame();
        bool HasSaveFile();
    }

    private const string SaveFileName = "gamesave.json";
    private GameSaveData currentSaveData = new();

    void Awake()
    {
        ServiceLocator.Register<ISaveService>(this);
    }

    public void SaveGame()
    {
        try
        {
            // Collect data from game systems
            CollectSaveData();

            // Serialize to JSON
            string json = JsonUtility.ToJson(currentSaveData, true);

            // Write to file
            string savePath = Path.Combine(Application.persistentDataPath, SaveFileName);
            File.WriteAllText(savePath, json);

            Debug.Log($"Game saved to {savePath}");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to save game: {e.Message}");
        }
    }

    public bool LoadGame()
    {
        try
        {
            string savePath = Path.Combine(Application.persistentDataPath, SaveFileName);
            if (!File.Exists(savePath))
            {
                Debug.Log("No save file found.");
                return false;
            }

            // Read and deserialize JSON
            string json = File.ReadAllText(savePath);
            currentSaveData = JsonUtility.FromJson<GameSaveData>(json);

            // Apply to game systems
            ApplySaveData();

            Debug.Log("Game loaded successfully.");
            return true;
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to load game: {e.Message}");
            return false;
        }
    }

    public bool HasSaveFile()
    {
        string savePath = Path.Combine(Application.persistentDataPath, SaveFileName);
        return File.Exists(savePath);
    }

    private void CollectSaveData()
    {
        // Get player data
        var player = ServiceLocator.Get<IPlayerService>();
        if (player != null)
        {
            currentSaveData.player.health = player.health;
            currentSaveData.player.stamina = player.stamina;
            currentSaveData.player.position = new Vector3Position(player.transform.position);
        }

        // Get inventory data
        var inventory = ServiceLocator.Get<IInventoryService>();
        if (inventory != null)
        {
            currentSaveData.inventory.items = new List<ItemStack>(inventory.items);
        }

        // Get quest data
        var quests = ServiceLocator.Get<IQuestService>();
        // Quest saving logic...

        // Get world state
        var world = ServiceLocator.Get<IWorldStateService>();
        // World state saving logic...
    }

    private void ApplySaveData()
    {
        // Apply player data
        var player = ServiceLocator.Get<IPlayerService>();
        if (player != null)
        {
            player.health = currentSaveData.player.health;
            player.stamina = currentSaveData.player.stamina;
            player.transform.position = currentSaveData.player.position.ToVector3();
        }

        // Apply inventory data
        var inventory = ServiceLocator.Get<IInventoryService>();
        if (inventory != null)
        {
            inventory.items.Clear();
            inventory.items.AddRange(currentSaveData.inventory.items);
        }

        // Apply quest data
        // Apply world state
    }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Benefits</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Persistent game state across sessions</li>
                  <li>Clearly defined data model for saved state</li>
                  <li>Error handling for save/load operations</li>
                  <li>Separation of data format from game logic</li>
                  <li>System architecture that supports multiple save slots</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Implementation Steps</h3>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Create serializable data classes for each game system</li>
                  <li>Implement JSON serialization and file I/O</li>
                  <li>Create interfaces for systems that need to save/load data</li>
                  <li>Add logic to collect data from game systems</li>
                  <li>Add logic to apply loaded data to game systems</li>
                  <li>Implement error handling for save/load operations</li>
                  <li>Add UI for save/load functionality</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="object-pooling" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementing Object Pooling</CardTitle>
              <CardDescription>
                Optimizing performance by reusing objects instead of creating and destroying them
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Problem</h3>
                <p className="mb-4">
                  The current code frequently creates and destroys objects (UI elements, projectiles, etc.),
                  causing garbage collection spikes and performance issues.
                </p>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Before:</h4>
                  <pre className="overflow-x-auto text-sm">
{`// UI that creates and destroys popup objects
public class CraftingUI : MonoBehaviour
{
    public GameObject popupPrefab;

    public void ShowResult(bool success)
    {
        var go = Instantiate(popupPrefab, transform);
        go.GetComponentInChildren<Text>().text = success ? "Craft Success!" : "Craft Failed";
        Destroy(go, 2f); // Destroy after 2 seconds
    }
}

// DestructibleEnvironment that creates objects
public class DestructibleEnvironment : MonoBehaviour
{
    public GameObject fracturedPrefab;
    public GameObject secretItem;
    public float explosionForce = 500f;
    public float explosionRadius = 5f;

    public void Explode()
    {
        if (fracturedPrefab != null)
        {
            var pieces = Instantiate(fracturedPrefab, transform.position, transform.rotation);
            foreach (var rb in pieces.GetComponentsInChildren<Rigidbody>())
            {
                if (rb != null)
                    rb.AddExplosionForce(explosionForce, transform.position, explosionRadius);
            }
        }
        if (secretItem != null)
            Instantiate(secretItem, transform.position + Vector3.up, Quaternion.identity);

        Destroy(gameObject);
    }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Solution</h3>
                <p className="mb-4">
                  Implement an object pooling system that reuses objects instead of creating and destroying them.
                  This reduces garbage collection and improves performance.
                </p>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">After:</h4>
                  <pre className="overflow-x-auto text-sm">
{`// Generic object pool implementation
public class ObjectPool<T> where T : Component
{
    private T prefab;
    private Queue<T> pool = new Queue<T>();
    private Transform parent;

    public ObjectPool(T prefab, int initialSize, Transform parent = null)
    {
        this.prefab = prefab;
        this.parent = parent;

        // Pre-instantiate objects for the pool
        for (int i = 0; i < initialSize; i++)
        {
            T obj = Create();
            obj.gameObject.SetActive(false);
            pool.Enqueue(obj);
        }
    }

    private T Create()
    {
        T obj = Object.Instantiate(prefab, parent);
        obj.gameObject.name = $"{prefab.name}_pooled";
        return obj;
    }

    public T Get()
    {
        T obj;
        if (pool.Count == 0)
        {
            obj = Create();
        }
        else
        {
            obj = pool.Dequeue();
        }

        obj.gameObject.SetActive(true);
        return obj;
    }

    public void Return(T obj)
    {
        obj.gameObject.SetActive(false);
        pool.Enqueue(obj);
    }
}

// ObjectPoolManager to handle all pools
public class ObjectPoolManager : MonoBehaviour, IPoolService
{
    private Dictionary<string, object> pools = new Dictionary<string, object>();

    public interface IPoolService
    {
        ObjectPool<T> GetPool<T>(T prefab, int initialSize = 10) where T : Component;
        T Get<T>(T prefab) where T : Component;
        void Return<T>(T obj) where T : Component;
    }

    void Awake()
    {
        ServiceLocator.Register<IPoolService>(this);
    }

    public ObjectPool<T> GetPool<T>(T prefab, int initialSize = 10) where T : Component
    {
        string key = $"{prefab.name}_{typeof(T).Name}";

        if (!pools.TryGetValue(key, out var pool))
        {
            pool = new ObjectPool<T>(prefab, initialSize, transform);
            pools[key] = pool;
        }

        return (ObjectPool<T>)pool;
    }

    public T Get<T>(T prefab) where T : Component
    {
        return GetPool(prefab).Get();
    }

    public void Return<T>(T obj) where T : Component
    {
        string key = $"{obj.name.Replace("_pooled", "")}_{typeof(T).Name}";

        if (pools.TryGetValue(key, out var pool))
        {
            ((ObjectPool<T>)pool).Return(obj);
        }
        else
        {
            Debug.LogWarning($"Trying to return object to non-existent pool: {key}");
            Destroy(obj.gameObject);
        }
    }
}

// UI with object pooling
public class CraftingUI : MonoBehaviour
{
    public Text popupTextPrefab;
    private IPoolService poolService;

    void Start()
    {
        poolService = ServiceLocator.Get<IPoolService>();
    }

    public void ShowResult(bool success)
    {
        Text popup = poolService.Get(popupTextPrefab);
        popup.transform.SetParent(transform, false);
        popup.text = success ? "Craft Success!" : "Craft Failed";

        // Instead of destroying, return to pool after delay
        StartCoroutine(ReturnAfterDelay(popup, 2f));
    }

    private IEnumerator ReturnAfterDelay(Text obj, float delay)
    {
        yield return new WaitForSeconds(delay);
        poolService.Return(obj);
    }
}

// DestructibleEnvironment with object pooling
public class DestructibleEnvironment : MonoBehaviour
{
    public GameObject fracturedPrefab;
    public GameObject secretItemPrefab;
    public float explosionForce = 500f;
    public float explosionRadius = 5f;
    private IPoolService poolService;

    void Start()
    {
        poolService = ServiceLocator.Get<IPoolService>();
    }

    public void Explode()
    {
        if (fracturedPrefab != null)
        {
            var pieces = poolService.Get<Transform>(fracturedPrefab.transform);
            pieces.position = transform.position;
            pieces.rotation = transform.rotation;

            foreach (var rb in pieces.GetComponentsInChildren<Rigidbody>())
            {
                if (rb != null)
                    rb.AddExplosionForce(explosionForce, transform.position, explosionRadius);
            }

            // Return to pool after delay
            StartCoroutine(ReturnAfterDelay(pieces, 5f));
        }

        if (secretItemPrefab != null)
        {
            var item = poolService.Get<Transform>(secretItemPrefab.transform);
            item.position = transform.position + Vector3.up;
            item.rotation = Quaternion.identity;
        }

        gameObject.SetActive(false);
        poolService.Return(transform);
    }

    private IEnumerator ReturnAfterDelay(Transform obj, float delay)
    {
        yield return new WaitForSeconds(delay);
        poolService.Return(obj);
    }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Benefits</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Reduces garbage collection spikes for smoother performance</li>
                  <li>Improves memory usage by reusing objects</li>
                  <li>Centralized management of pooled objects</li>
                  <li>More efficient for frequently created/destroyed objects</li>
                  <li>Reduces CPU overhead for instantiation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Implementation Steps</h3>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Create a generic ObjectPool class</li>
                  <li>Implement a pool manager service</li>
                  <li>Register the pool manager with ServiceLocator</li>
                  <li>Identify frequently instantiated objects in the code</li>
                  <li>Replace Instantiate/Destroy calls with Get/Return from pool</li>
                  <li>Use coroutines to return objects to pool after delays</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="input" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Modernizing Input Handling</CardTitle>
              <CardDescription>
                Moving from direct input polling to Unity's new Input System for better flexibility and device support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Problem</h3>
                <p className="mb-4">
                  The current code uses direct input polling with Input.GetKey, Input.GetAxis, etc.,
                  spread across multiple classes. This makes input remapping difficult and lacks
                  support for different input devices.
                </p>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Before:</h4>
                  <pre className="overflow-x-auto text-sm">
{`// Player controller with direct input polling
public class PlayerController : MonoBehaviour
{
    public float walkSpeed = 5f;
    private CharacterController controller;
    private Vector3 velocity;

    void Start()
    {
        controller = GetComponent<CharacterController>();
    }

    void Update()
    {
        if (controller.isGrounded && velocity.y < 0)
        {
            velocity.y = -2f;
        }

        // Direct input polling
        float x = Input.GetAxis("Horizontal");
        float z = Input.GetAxis("Vertical");
        Vector3 move = transform.right * x + transform.forward * z;
        controller.Move(move * walkSpeed * Time.deltaTime);

        if (Input.GetButtonDown("Jump") && controller.isGrounded)
        {
            velocity.y = Mathf.Sqrt(2f * -2f * Physics.gravity.y);
        }

        velocity.y += Physics.gravity.y * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);
    }
}

// Grappling hook with direct input polling
public class GrapplingHook : NetworkBehaviour
{
    public float maxDistance = 20f;
    public LineRenderer rope;
    public LayerMask grappleMask;
    private Vector3 grapplePoint;
    private SpringJoint joint;

    void Update()
    {
        if (!IsOwner) return;

        // Direct mouse button polling
        if (Input.GetMouseButtonDown(1))
        {
            StartGrappleServerRpc();
        }

        if (joint)
        {
            rope.SetPosition(0, transform.position);
            rope.SetPosition(1, grapplePoint);

            // Direct key polling
            if (Input.GetKeyDown(KeyCode.Space))
            {
                StopGrappleServerRpc();
            }
        }
    }

    // RPC methods...
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Solution</h3>
                <p className="mb-4">
                  Implement Unity's new Input System with action-based input handling. This provides better
                  abstraction, device support, and remapping capabilities.
                </p>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">After:</h4>
                  <pre className="overflow-x-auto text-sm">
{`// Create a centralized input manager with event-based inputs
[CreateAssetMenu(fileName = "GameInputActions", menuName = "Game/Input Actions")]
public class GameInputActions : ScriptableObject
{
    // Generated by Unity's Input System
    [SerializeField] private InputActionAsset inputActionAsset;

    // Player controls
    public InputAction playerMove;
    public InputAction playerJump;
    public InputAction playerAttack;
    public InputAction playerGrapple;
    public InputAction playerInteract;

    // UI controls
    public InputAction uiNavigate;
    public InputAction uiSubmit;
    public InputAction uiCancel;

    // Camera controls
    public InputAction cameraLook;
    public InputAction cameraZoom;

    private bool isInitialized = false;

    public void Initialize()
    {
        if (isInitialized) return;

        var playerMap = inputActionAsset.FindActionMap("Player");
        playerMove = playerMap.FindAction("Move");
        playerJump = playerMap.FindAction("Jump");
        playerAttack = playerMap.FindAction("Attack");
        playerGrapple = playerMap.FindAction("Grapple");
        playerInteract = playerMap.FindAction("Interact");

        var uiMap = inputActionAsset.FindActionMap("UI");
        uiNavigate = uiMap.FindAction("Navigate");
        uiSubmit = uiMap.FindAction("Submit");
        uiCancel = uiMap.FindAction("Cancel");

        var cameraMap = inputActionAsset.FindActionMap("Camera");
        cameraLook = cameraMap.FindAction("Look");
        cameraZoom = cameraMap.FindAction("Zoom");

        isInitialized = true;
    }

    public void EnablePlayerInput()
    {
        inputActionAsset.FindActionMap("Player").Enable();
        inputActionAsset.FindActionMap("Camera").Enable();
        inputActionAsset.FindActionMap("UI").Disable();
    }

    public void EnableUIInput()
    {
        inputActionAsset.FindActionMap("Player").Disable();
        inputActionAsset.FindActionMap("Camera").Disable();
        inputActionAsset.FindActionMap("UI").Enable();
    }
}

// Input Service for dependency injection
public interface IInputService
{
    GameInputActions Actions { get; }
    void EnablePlayerInput();
    void EnableUIInput();
    void SaveBindings();
    void LoadBindings();
}

// Input Manager implementation
public class InputManager : MonoBehaviour, IInputService
{
    [SerializeField] private GameInputActions inputActions;
    private const string BINDINGS_KEY = "input_bindings";

    public GameInputActions Actions => inputActions;

    private void Awake()
    {
        inputActions.Initialize();
        LoadBindings();
        ServiceLocator.Register<IInputService>(this);
    }

    private void OnEnable()
    {
        EnablePlayerInput();
    }

    private void OnDisable()
    {
        // Disable all input maps when the manager is disabled
        foreach (var actionMap in inputActions.asset.actionMaps)
        {
            actionMap.Disable();
        }
    }

    public void EnablePlayerInput()
    {
        inputActions.EnablePlayerInput();
    }

    public void EnableUIInput()
    {
        inputActions.EnableUIInput();
    }

    public void SaveBindings()
    {
        string bindingsJson = inputActions.asset.SaveBindingOverridesAsJson();
        PlayerPrefs.SetString(BINDINGS_KEY, bindingsJson);
        PlayerPrefs.Save();
    }

    public void LoadBindings()
    {
        if (PlayerPrefs.HasKey(BINDINGS_KEY))
        {
            string bindingsJson = PlayerPrefs.GetString(BINDINGS_KEY);
            inputActions.asset.LoadBindingOverridesFromJson(bindingsJson);
        }
    }
}

// Player controller with Input System
public class PlayerController : MonoBehaviour
{
    public float walkSpeed = 5f;
    private CharacterController controller;
    private Vector3 velocity;
    private IInputService inputService;

    // References to input actions for better performance
    private InputAction moveAction;
    private InputAction jumpAction;

    // Response to jump input
    private void OnJump(InputAction.CallbackContext context)
    {
        if (context.performed && controller.isGrounded)
        {
            velocity.y = Mathf.Sqrt(2f * -2f * Physics.gravity.y);
        }
    }

    void Start()
    {
        controller = GetComponent<CharacterController>();
        inputService = ServiceLocator.Get<IInputService>();

        if (inputService != null)
        {
            // Cache references to input actions
            moveAction = inputService.Actions.playerMove;
            jumpAction = inputService.Actions.playerJump;

            // Register for jump events
            jumpAction.performed += OnJump;
        }
        else
        {
            Debug.LogError("Input Service not found!");
        }
    }

    void OnDestroy()
    {
        // Unregister event handlers
        if (jumpAction != null)
        {
            jumpAction.performed -= OnJump;
        }
    }

    void Update()
    {
        if (controller.isGrounded && velocity.y < 0)
        {
            velocity.y = -2f;
        }

        if (moveAction != null)
        {
            // Read input from action
            Vector2 moveInput = moveAction.ReadValue<Vector2>();
            Vector3 move = transform.right * moveInput.x + transform.forward * moveInput.y;
            controller.Move(move * walkSpeed * Time.deltaTime);
        }

        velocity.y += Physics.gravity.y * Time.deltaTime;
        controller.Move(velocity * Time.deltaTime);
    }
}

// Grappling hook with Input System
public class GrapplingHook : NetworkBehaviour
{
    public float maxDistance = 20f;
    public LineRenderer rope;
    public LayerMask grappleMask;
    private Vector3 grapplePoint;
    private SpringJoint joint;
    private IInputService inputService;

    // Input actions
    private InputAction grappleAction;
    private InputAction jumpAction;

    public override void OnNetworkSpawn()
    {
        base.OnNetworkSpawn();

        if (!IsOwner) return;

        inputService = ServiceLocator.Get<IInputService>();
        if (inputService != null)
        {
            grappleAction = inputService.Actions.playerGrapple;
            jumpAction = inputService.Actions.playerJump;

            // Register for input events
            grappleAction.performed += OnGrapple;
            jumpAction.performed += OnJump;
        }
        else
        {
            Debug.LogError("Input Service not found!");
        }
    }

    public override void OnNetworkDespawn()
    {
        base.OnNetworkDespawn();

        // Unregister event handlers
        if (grappleAction != null)
        {
            grappleAction.performed -= OnGrapple;
        }

        if (jumpAction != null)
        {
            jumpAction.performed -= OnJump;
        }
    }

    private void OnGrapple(InputAction.CallbackContext context)
    {
        if (IsOwner && context.performed)
        {
            StartGrappleServerRpc();
        }
    }

    private void OnJump(InputAction.CallbackContext context)
    {
        if (IsOwner && context.performed && joint != null)
        {
            StopGrappleServerRpc();
        }
    }

    void Update()
    {
        if (!IsOwner) return;

        if (joint)
        {
            rope.SetPosition(0, transform.position);
            rope.SetPosition(1, grapplePoint);
        }
    }

    // RPC methods...
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Benefits</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Support for multiple input devices (keyboard, gamepad, touch)</li>
                  <li>Easy remapping of controls</li>
                  <li>Event-based input handling</li>
                  <li>Centralized input configuration</li>
                  <li>Input contextual enabling/disabling (player, UI, etc.)</li>
                  <li>Persistence of user's custom bindings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Implementation Steps</h3>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Install Unity's Input System package</li>
                  <li>Create Input Action asset with action maps for different contexts</li>
                  <li>Create GameInputActions ScriptableObject wrapper</li>
                  <li>Implement InputManager service</li>
                  <li>Register the input service with ServiceLocator</li>
                  <li>Refactor existing code to use input actions instead of direct polling</li>
                  <li>Add binding persistence with PlayerPrefs</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
