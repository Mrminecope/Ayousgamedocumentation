import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight">Ayous Game Documentation</h1>
        <p className="text-xl mt-4 text-muted-foreground max-w-3xl mx-auto">
          Comprehensive technical documentation, code analysis, and enhancement roadmap for the Ayous Game codebase
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Code Architecture</CardTitle>
            <CardDescription>Explore the current structure and organization of the game</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Review the existing architecture, component relationships, and how systems interact with each other.</p>
          </CardContent>
          <CardFooter>
            <Link href="/architecture" className="w-full">
              <Button className="w-full">View Architecture</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Debt</CardTitle>
            <CardDescription>Identified issues and code problems</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Explore the technical debt, code smells, and architectural issues discovered in the codebase.</p>
          </CardContent>
          <CardFooter>
            <Link href="/technical-debt" className="w-full">
              <Button className="w-full">Review Issues</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enhancement Roadmap</CardTitle>
            <CardDescription>Planned improvements and new features</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View the proposed enhancements, feature additions, and optimization roadmap.</p>
          </CardContent>
          <CardFooter>
            <Link href="/enhancements" className="w-full">
              <Button className="w-full">See Roadmap</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
            <CardDescription>Before and after code improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Examine concrete examples of refactored code, with explanations of improvements and best practices.</p>
          </CardContent>
          <CardFooter>
            <Link href="/examples" className="w-full">
              <Button className="w-full">View Examples</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
