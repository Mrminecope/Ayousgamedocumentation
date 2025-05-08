import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TechnicalDebtPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">← Back to Home</Link>
        </Button>
        <h1 className="text-4xl font-bold">Technical Debt</h1>
        <p className="text-xl mt-2 text-muted-foreground">
          Identified issues and code problems in the Ayous Game codebase
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Technical Debt Summary</CardTitle>
          <CardDescription>
            A high-level overview of the technical debt in the codebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The Ayous Game codebase contains several categories of technical debt and architectural issues
            that should be addressed to improve stability, maintainability, and scalability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-100 dark:bg-yellow-950 p-4 rounded-lg">
              <h3 className="font-bold text-lg">High Priority</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Singleton abuse (global state)</li>
                <li>Missing error handling</li>
                <li>Direct input polling</li>
                <li>No data persistence</li>
              </ul>
            </div>

            <div className="bg-blue-100 dark:bg-blue-950 p-4 rounded-lg">
              <h3 className="font-bold text-lg">Medium Priority</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Magic numbers</li>
                <li>UI performance issues</li>
                <li>Network authority gaps</li>
                <li>Coroutine lifecycle issues</li>
              </ul>
            </div>

            <div className="bg-green-100 dark:bg-green-950 p-4 rounded-lg">
              <h3 className="font-bold text-lg">Low Priority</h3>
              <ul className="list-disc pl-5 mt-2">
                <li>Inconsistent naming</li>
                <li>Region organization</li>
                <li>Code duplication</li>
                <li>Unused variables</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="coupling" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-semibold">Tight Coupling via Singletons</AccordionTrigger>
          <AccordionContent className="mt-2">
            <div className="space-y-4">
              <p>
                Almost every manager class in the game is implemented as a singleton with a static Instance property.
                This creates tight coupling between systems and makes testing and modularization difficult.
              </p>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <code>PlayerController.Instance</code> - Accessed directly from WeatherManager, Mount, and other classes
                  </li>
                  <li>
                    <code>SkillTreeManager.Instance</code> - Used in SkillNode.CanUnlock without dependency injection
                  </li>
                  <li>
                    <code>CraftingManager.Instance</code> - Global access to crafting functionality
                  </li>
                </ul>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Impact:</h4>
                <ul className="list-disc pl-5">
                  <li>Hard to unit test individual components</li>
                  <li>Difficult to reuse components in different contexts</li>
                  <li>Hidden dependencies between systems</li>
                  <li>Order of initialization problems</li>
                  <li>Scene loading/unloading issues with DontDestroyOnLoad</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dependency-injection" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-semibold">Lack of Dependency Injection</AccordionTrigger>
          <AccordionContent className="mt-2">
            <div className="space-y-4">
              <p>
                Critical subsystems fetch components via GetComponent or assume scene objects exist instead of
                explicitly declaring dependencies and injecting them.
              </p>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <code>CraftingManager</code> - Getting inventory component in Awake method
                  </li>
                  <li>
                    <code>PlayerController</code> - Finding components at runtime
                  </li>
                  <li>
                    <code>AdvancedEnemyAI</code> - Finding player via tag
                  </li>
                </ul>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Impact:</h4>
                <ul className="list-disc pl-5">
                  <li>Runtime errors when components are missing</li>
                  <li>Unclear dependencies between systems</li>
                  <li>Difficult to test in isolation</li>
                  <li>Performance cost of runtime component lookups</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="error-handling" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-semibold">No Error Handling / Logging</AccordionTrigger>
          <AccordionContent className="mt-2">
            <div className="space-y-4">
              <p>
                Instantiates and RPC calls rarely check for null or network failures; missing try-catches or robust callbacks.
              </p>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <code>GuildBaseManager.CreateBaseServerRpc</code> - No error handling for invalid player ID
                  </li>
                  <li>
                    <code>GrapplingHook</code> - No fallback when raycast fails
                  </li>
                  <li>
                    <code>DestructibleEnvironment.Explode</code> - No null checks for fracturedPrefab
                  </li>
                </ul>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Impact:</h4>
                <ul className="list-disc pl-5">
                  <li>Crashes in production</li>
                  <li>Hard to diagnose issues</li>
                  <li>Poor player experience when errors occur</li>
                  <li>No error recovery mechanisms</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="persistence" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-semibold">Missing Data Persistence</AccordionTrigger>
          <AccordionContent className="mt-2">
            <div className="space-y-4">
              <p>
                There's no save/load system: player progress, world state, inventory—all reset on scene reload.
              </p>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <code>SaveManager</code> - Methods are stubbed with no implementation
                  </li>
                  <li>
                    <code>Inventory</code> - No serialization of items
                  </li>
                  <li>
                    <code>QuestManager</code> - No persistence of quest progress
                  </li>
                </ul>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Impact:</h4>
                <ul className="list-disc pl-5">
                  <li>Player progress is lost on game restart</li>
                  <li>No cross-session persistence</li>
                  <li>Unable to save game state</li>
                  <li>Poor player experience without saves</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ui-performance" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-semibold">UI Performance & Memory Leaks</AccordionTrigger>
          <AccordionContent className="mt-2">
            <div className="space-y-4">
              <p>
                Frequent Instantiate/Destroy in CraftingUI without pooling; tooltips flip panels on every hover without throttling.
              </p>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <code>CraftingUI.ShowResult</code> - Creates and destroys popup objects
                  </li>
                  <li>
                    <code>Tooltip</code> - Activates/deactivates panel on every pointer event
                  </li>
                </ul>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Impact:</h4>
                <ul className="list-disc pl-5">
                  <li>Garbage collection spikes causing frame drops</li>
                  <li>Potential memory leaks</li>
                  <li>UI responsiveness issues</li>
                  <li>Performance degradation over time</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="input" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-semibold">Sparse Input Abstraction</AccordionTrigger>
          <AccordionContent className="mt-2">
            <div className="space-y-4">
              <p>
                Direct polling of keyboard/mouse in multiple scripts—no central Input Action map, leading to inconsistent control remapping.
              </p>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <code>PlayerController.Update</code> - Direct Input.GetAxis calls
                  </li>
                  <li>
                    <code>GrapplingHook.Update</code> - Input.GetMouseButtonDown check
                  </li>
                  <li>
                    <code>ParkourController.Update</code> - Input.GetKey checks
                  </li>
                </ul>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Impact:</h4>
                <ul className="list-disc pl-5">
                  <li>Can't remap controls easily</li>
                  <li>Inconsistent handling across different systems</li>
                  <li>No support for different input devices</li>
                  <li>Difficult to add new input methods</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="network" className="border rounded-lg p-2">
          <AccordionTrigger className="text-lg font-semibold">Network Authority Gaps</AccordionTrigger>
          <AccordionContent className="mt-2">
            <div className="space-y-4">
              <p>
                Several ServerRpc calls lack validation of caller's ownership or permissions, opening potential cheating vectors.
              </p>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <code>GuildBaseManager.CreateBaseServerRpc</code> - No verification of player's permissions
                  </li>
                  <li>
                    <code>WorldEventManager.TriggerEventServerRpc</code> - Any client can trigger events
                  </li>
                </ul>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Impact:</h4>
                <ul className="list-disc pl-5">
                  <li>Potential for cheating or griefing</li>
                  <li>Security vulnerabilities</li>
                  <li>Inconsistent game state across clients</li>
                  <li>Server authority bypasses</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
