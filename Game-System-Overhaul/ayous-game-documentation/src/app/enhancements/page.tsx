import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EnhancementsPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">← Back to Home</Link>
        </Button>
        <h1 className="text-4xl font-bold">Enhancement Roadmap</h1>
        <p className="text-xl mt-2 text-muted-foreground">
          Planned improvements and new features for the Ayous Game
        </p>
      </div>

      <Tabs defaultValue="architecture">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="gameplay">Gameplay</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="ui">UI/UX</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Architectural Enhancements</CardTitle>
              <CardDescription>
                Core system improvements and architectural changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Service Locator Pattern</h3>
                <p className="mt-2">
                  Replace direct singleton access with a service locator pattern to decouple systems
                  while maintaining global access when needed. This provides a middle ground between
                  full dependency injection and current tight coupling.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">Phase 1</span>
                  <span className="ml-2 text-muted-foreground">High Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">ScriptableObject-Based Data Model</h3>
                <p className="mt-2">
                  Move hardcoded game data (items, recipes, skills, quests) into ScriptableObjects
                  to decouple data from logic. This allows designers to modify content without code changes
                  and makes the system more extensible.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">Phase 1</span>
                  <span className="ml-2 text-muted-foreground">High Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Event-Driven Communication</h3>
                <p className="mt-2">
                  Implement a central event bus for communication between systems instead of direct
                  method calls. This allows for looser coupling between components and makes it easier
                  to extend or replace subsystems.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2 py-1 rounded">Phase 2</span>
                  <span className="ml-2 text-muted-foreground">Medium Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Centralized Input System</h3>
                <p className="mt-2">
                  Replace direct input polling with a centralized input system using the new Input System
                  package. This enables input rebinding, support for multiple input devices, and
                  cleaner input logic.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">Phase 1</span>
                  <span className="ml-2 text-muted-foreground">High Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Component Factories</h3>
                <p className="mt-2">
                  Create factory classes for instantiating game objects to centralize object creation
                  logic. This allows for object pooling, dependency injection, and easier testing.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2 py-1 rounded">Phase 2</span>
                  <span className="ml-2 text-muted-foreground">Medium Priority</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gameplay" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gameplay Enhancements</CardTitle>
              <CardDescription>
                New gameplay features and refinements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Enhanced Combat System</h3>
                <p className="mt-2">
                  Implement a more robust combat system with hit detection, damage types, status effects,
                  and cooldowns. Replace simple ammo counting with actual projectile physics and
                  impact detection.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">Phase 1</span>
                  <span className="ml-2 text-muted-foreground">High Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Advanced AI Behavior</h3>
                <p className="mt-2">
                  Enhance AI behavior with memory of player positions, group tactics, and more
                  dynamic decision making. Implement perception systems (sight, hearing) and
                  more intelligent pathing.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2 py-1 rounded">Phase 2</span>
                  <span className="ml-2 text-muted-foreground">Medium Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Dynamic Quest System</h3>
                <p className="mt-2">
                  Create a dynamic quest system with procedurally generated objectives, branching narratives,
                  and meaningful player choices. Support for quest chains, reputation impact, and
                  world state changes.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded">Phase 3</span>
                  <span className="ml-2 text-muted-foreground">Low Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Procedural World Generation</h3>
                <p className="mt-2">
                  Implement procedural generation for world elements like dungeons, resource nodes, and
                  enemy spawns. Create a more dynamic and replayable world with persistent changes.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded">Phase 3</span>
                  <span className="ml-2 text-muted-foreground">Low Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Enhanced Crafting & Economy</h3>
                <p className="mt-2">
                  Expand the crafting system with blueprints, quality levels, specializations, and
                  a player-driven economy. Add crafting stations, resource gathering tools, and
                  recipe discovery.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2 py-1 rounded">Phase 2</span>
                  <span className="ml-2 text-muted-foreground">Medium Priority</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Enhancements</CardTitle>
              <CardDescription>
                Technical improvements and optimizations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Save/Load System</h3>
                <p className="mt-2">
                  Implement a comprehensive save/load system using JSON serialization and encryption.
                  Support for saving player data, world state, inventory, and quest progress.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">Phase 1</span>
                  <span className="ml-2 text-muted-foreground">High Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Object Pooling</h3>
                <p className="mt-2">
                  Implement object pooling for frequently instantiated objects like projectiles,
                  particles, and UI elements. This reduces garbage collection and improves performance.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">Phase 1</span>
                  <span className="ml-2 text-muted-foreground">High Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Networking Improvements</h3>
                <p className="mt-2">
                  Enhance networking with proper authority validation, interpolation/prediction,
                  and bandwidth optimization. Implement a robust server-authoritative model
                  and connection recovery.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2 py-1 rounded">Phase 2</span>
                  <span className="ml-2 text-muted-foreground">Medium Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Robust Error Handling</h3>
                <p className="mt-2">
                  Add comprehensive error handling, logging, and recovery mechanisms throughout
                  the codebase. Implement try/catch blocks, null checking, and graceful fallbacks.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">Phase 1</span>
                  <span className="ml-2 text-muted-foreground">High Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Analytics & Telemetry</h3>
                <p className="mt-2">
                  Implement real analytics and telemetry for player behavior tracking,
                  performance monitoring, and feature usage. Use Unity Analytics or a
                  custom solution for data collection.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded">Phase 3</span>
                  <span className="ml-2 text-muted-foreground">Low Priority</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ui" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>UI/UX Enhancements</CardTitle>
              <CardDescription>
                User interface and experience improvements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">UI Framework Upgrade</h3>
                <p className="mt-2">
                  Migrate from legacy UI system to UI Toolkit for better performance, layout control,
                  and styling options. Create a comprehensive UI component library.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2 py-1 rounded">Phase 2</span>
                  <span className="ml-2 text-muted-foreground">Medium Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Accessibility Features</h3>
                <p className="mt-2">
                  Implement comprehensive accessibility features including UI scaling, color blind modes,
                  text-to-speech, subtitles, and input remapping. Conform to WCAG guidelines where applicable.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">Phase 1</span>
                  <span className="ml-2 text-muted-foreground">High Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Localization System</h3>
                <p className="mt-2">
                  Develop a comprehensive localization system supporting multiple languages,
                  dynamic text replacement, and locale-specific formatting. Use Unity's Localization package.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2 py-1 rounded">Phase 2</span>
                  <span className="ml-2 text-muted-foreground">Medium Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Advanced HUD System</h3>
                <p className="mt-2">
                  Create a modular, customizable HUD system with drag-and-drop UI elements,
                  transparency options, and size adjustments. Support for different game modes and contexts.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded">Phase 3</span>
                  <span className="ml-2 text-muted-foreground">Low Priority</span>
                </div>
              </div>

              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h3 className="text-xl font-semibold">Tutorial & Onboarding</h3>
                <p className="mt-2">
                  Develop a comprehensive tutorial and onboarding system with interactive guides,
                  tooltips, and contextual help. Support for new player experience and feature discovery.
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 px-2 py-1 rounded">Phase 2</span>
                  <span className="ml-2 text-muted-foreground">Medium Priority</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Implementation Phases</CardTitle>
            <CardDescription>
              Prioritized roadmap for implementing enhancements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Phase 1: Foundation</h3>
              <p className="mb-4">
                The first phase focuses on addressing critical technical debt and establishing a solid foundation
                for future development. These changes are high priority and should be implemented first.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service Locator Pattern implementation</li>
                <li>ScriptableObject-based data model</li>
                <li>Centralized Input System using new Input System package</li>
                <li>Save/Load System with JSON serialization</li>
                <li>Object Pooling for frequent instantiations</li>
                <li>Enhanced Combat System with hit detection</li>
                <li>Accessibility Features</li>
                <li>Robust Error Handling</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Phase 2: Expansion</h3>
              <p className="mb-4">
                The second phase builds on the foundation to expand gameplay features and system capabilities.
                These changes are medium priority and can be implemented after Phase 1.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Event-Driven Communication system</li>
                <li>Component Factories</li>
                <li>Advanced AI Behavior</li>
                <li>Enhanced Crafting & Economy</li>
                <li>Networking Improvements</li>
                <li>UI Framework Upgrade to UI Toolkit</li>
                <li>Localization System</li>
                <li>Tutorial & Onboarding</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Phase 3: Polish & Innovation</h3>
              <p className="mb-4">
                The final phase focuses on polish, advanced features, and innovation. These changes are lower
                priority and can be implemented after Phases 1 and 2.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dynamic Quest System</li>
                <li>Procedural World Generation</li>
                <li>Analytics & Telemetry</li>
                <li>Advanced HUD System</li>
                <li>User-Generated Content Tools</li>
                <li>Cross-Platform Support</li>
                <li>VR/AR Support (if applicable)</li>
                <li>Live Service Features</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
