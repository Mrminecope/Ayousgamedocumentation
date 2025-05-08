import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArchitecturePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">← Back to Home</Link>
        </Button>
        <h1 className="text-4xl font-bold">Game Architecture</h1>
        <p className="text-xl mt-2 text-muted-foreground">
          Overview of the Ayous Game codebase structure and organization
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="systems">Core Systems</TabsTrigger>
          <TabsTrigger value="gameplay">Gameplay</TabsTrigger>
          <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Architectural Overview</CardTitle>
              <CardDescription>
                High-level view of the game's architecture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Singleton-Based Manager Pattern</h3>
              <p>
                The game uses a singleton-based manager pattern for most of its systems. Almost every
                major system (Weather, Crafting, Skills, etc.) is implemented as a MonoBehaviour with a
                static Instance property, making them globally accessible from anywhere in the code.
              </p>

              <h3 className="text-xl font-semibold">Behavior Tree AI System</h3>
              <p>
                Enemy AI uses a behavior tree implementation with abstract nodes (BTNode) and concrete
                node types (Sequence, Selector, etc.). This allows for complex AI behaviors with a
                hierarchical structure.
              </p>

              <h3 className="text-xl font-semibold">Unity Networking Framework</h3>
              <p>
                Multiplayer features are implemented using Unity's Netcode for GameObjects, with
                ServerRpc and ClientRpc calls for network communication.
              </p>

              <h3 className="text-xl font-semibold">Region-Based Code Organization</h3>
              <p>
                The codebase is organized into regions (#region directives) that group related
                functionality: Core Systems, Player & Combat, UI/UX, Environment & Weather, etc.
              </p>

              <h3 className="text-xl font-semibold">Component Composition</h3>
              <p>
                Game entities are composed of multiple components (Rigidbody, NavMeshAgent,
                CharacterController, etc.) that are fetched at runtime with GetComponent.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="systems" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Core Systems</CardTitle>
              <CardDescription>
                Primary game systems and their relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Inventory System</h3>
              <p>
                Manages player items with basic methods for checking, adding, and removing items.
                Uses a simple List of ItemStack objects, with no persistence or UI interaction.
              </p>

              <h3 className="text-xl font-semibold">Crafting System</h3>
              <p>
                Allows crafting items from recipes. References the player's Inventory to check for
                required materials and add crafted items. Recipes are stored as a List with no external
                data source.
              </p>

              <h3 className="text-xl font-semibold">Skill Tree System</h3>
              <p>
                Manages player skills with prerequisites and unlocking logic. Uses a SkillNode class
                with a CanUnlock method to check prerequisites. Has basic synergy detection.
              </p>

              <h3 className="text-xl font-semibold">Weather System</h3>
              <p>
                Controls weather conditions (Clear, Rain, Snow, Storm) with particle effects and
                lighting changes. Uses a coroutine to periodically change weather.
              </p>

              <h3 className="text-xl font-semibold">Boss Encounter System</h3>
              <p>
                Manages boss health, phases, and attack patterns. Uses health thresholds to trigger
                phase transitions and changes in boss behavior.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gameplay" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gameplay Systems</CardTitle>
              <CardDescription>
                Player movement, combat, and interaction systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Player Controller</h3>
              <p>
                Handles player movement, jumping, and basic character control. Uses Unity's
                CharacterController component. Has direct input polling in Update method.
              </p>

              <h3 className="text-xl font-semibold">Combat System</h3>
              <p>
                Basic implementation with ammo tracking and attack method. Uses ParticleSystem for
                visual effects and AudioSource for sound effects. Missing hit detection and damage
                calculation.
              </p>

              <h3 className="text-xl font-semibold">Parkour & Movement</h3>
              <p>
                Implements climbing and enhanced movement features like grappling hook. Uses stamina
                cost for climbing. Grappling hook uses LineRenderer and SpringJoint.
              </p>

              <h3 className="text-xl font-semibold">Vehicle System</h3>
              <p>
                Hover vehicle implementation with raycast-based hovering physics. Uses multiple hover
                points for stability and applies forces at each point.
              </p>

              <h3 className="text-xl font-semibold">Quest System</h3>
              <p>
                Simple quest tracking with completion state. Missing quest objectives, rewards, and
                progression tracking.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multiplayer" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Multiplayer Architecture</CardTitle>
              <CardDescription>
                Networking, synchronization, and multiplayer features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Netcode Integration</h3>
              <p>
                Uses Unity's Netcode for GameObjects framework for networking. Components inherit from
                NetworkBehaviour and use ServerRpc/ClientRpc for communication.
              </p>

              <h3 className="text-xl font-semibold">Player Synchronization</h3>
              <p>
                Basic position synchronization using Server and Client RPCs. Missing proper
                interpolation, prediction, and lag compensation.
              </p>

              <h3 className="text-xl font-semibold">Guild System</h3>
              <p>
                Allows players to create guild bases with network synchronization. Uses RPCs to spawn
                guild base objects on the network.
              </p>

              <h3 className="text-xl font-semibold">Voice & Emote System</h3>
              <p>
                Stub implementation for voice chat and player emotes. Missing actual implementation
                details and integration with external voice services.
              </p>

              <h3 className="text-xl font-semibold">Matchmaking</h3>
              <p>
                Basic UI for host/join functionality. Missing proper matchmaking backend, server
                discovery, and lobby system.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
