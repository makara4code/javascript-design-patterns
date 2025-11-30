import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Boxes,
  Eye,
  Fingerprint,
  GitBranch,
  Layers,
  Monitor,
  Puzzle,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const patternCards = [
  {
    title: "Module Pattern",
    description:
      "Encapsulates private variables and functions using closures, exposing only a public API.",
    icon: Boxes,
    path: "/patterns/module",
    keywords: ["IIFE", "Revealing Module", "ES6 Modules"],
    category: "js" as const,
  },
  {
    title: "Prototype Pattern",
    description:
      "Creates new objects by cloning existing prototypes. Enables runtime configuration.",
    icon: GitBranch,
    path: "/patterns/prototype",
    keywords: ["Object.create()", "clone()", "Registry"],
    category: "js" as const,
  },
  {
    title: "Observer Pattern",
    description:
      "Defines a one-to-many dependency. When the subject changes, all observers are notified.",
    icon: Eye,
    path: "/patterns/observer",
    keywords: ["Subscribe", "Publish", "Event Emitter"],
    category: "js" as const,
  },
  {
    title: "Singleton Pattern",
    description:
      "Ensures a class has only one instance and provides a global point of access.",
    icon: Fingerprint,
    path: "/patterns/singleton",
    keywords: ["getInstance()", "Config", "Logger"],
    category: "js" as const,
  },
  {
    title: "MVC Pattern",
    description:
      "Separates application into Model (data), View (UI), and Controller (logic).",
    icon: Layers,
    path: "/patterns/mvc",
    keywords: ["Model", "View", "Controller"],
    category: "arch" as const,
  },
  {
    title: "MVP Pattern",
    description:
      "Similar to MVC, but Presenter has direct reference to View through an interface.",
    icon: Monitor,
    path: "/patterns/mvp",
    keywords: ["View Interface", "Presenter", "Passive View"],
    category: "arch" as const,
  },
  {
    title: "MVVM Pattern",
    description:
      "Uses data binding between View and ViewModel. ViewModel exposes data and commands.",
    icon: Puzzle,
    path: "/patterns/mvvm",
    keywords: ["Two-way Binding", "Commands", "ViewModel"],
    category: "arch" as const,
  },
];

const categories = [
  {
    title: "Creational Patterns",
    description: "Deal with object creation mechanisms",
    items: [
      { name: "Singleton", highlighted: true },
      { name: "Prototype", highlighted: true },
      { name: "Factory", highlighted: false },
      { name: "Builder", highlighted: false },
    ],
  },
  {
    title: "Structural Patterns",
    description: "Deal with object composition",
    items: [
      { name: "Module", highlighted: true },
      { name: "Adapter", highlighted: false },
      { name: "Decorator", highlighted: false },
      { name: "Facade", highlighted: false },
    ],
  },
  {
    title: "Behavioral Patterns",
    description: "Deal with object communication",
    items: [
      { name: "Observer", highlighted: true },
      { name: "Strategy", highlighted: false },
      { name: "Command", highlighted: false },
      { name: "State", highlighted: false },
    ],
  },
  {
    title: "Architectural Patterns",
    description: "High-level application structure",
    items: [
      { name: "MVC", highlighted: true },
      { name: "MVP", highlighted: true },
      { name: "MVVM", highlighted: true },
      { name: "Flux/Redux", highlighted: false },
    ],
  },
];

export function Introduction() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8">
        <Badge variant="secondary" className="mb-2">
          Interactive Learning
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          JavaScript Design Patterns
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore reusable solutions to common software design problems through
          interactive demonstrations and real code examples.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button asChild size="lg">
            <Link to="/patterns/module">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#patterns">View All Patterns</a>
          </Button>
        </div>
      </section>

      {/* What are Design Patterns */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">What are Design Patterns?</h2>
        </div>
        <Card>
          <CardContent className="">
            <p className="text-muted-foreground leading-relaxed">
              Design patterns are reusable solutions to common problems in
              software design. They represent best practices evolved over time
              by experienced developers. A design pattern is not a finished
              design that can be transformed directly into code—it's a
              description or template for how to solve a problem that can be
              used in many different situations.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Why Use Design Patterns */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Why Use Design Patterns?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Proven Solutions",
              description:
                "Time-tested solutions that have evolved to solve recurring design problems.",
            },
            {
              title: "Common Vocabulary",
              description:
                "A shared language for developers to communicate complex designs efficiently.",
            },
            {
              title: "Best Practices",
              description:
                "Capture expert knowledge and encapsulate best practices in design.",
            },
            {
              title: "Code Reusability",
              description:
                "Promote code reuse, reducing development time and effort.",
            },
            {
              title: "Maintainability",
              description:
                "Well-structured code using patterns is easier to understand and maintain.",
            },
            {
              title: "Scalability",
              description:
                "Patterns help build scalable architectures that grow with your needs.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pattern Categories */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Types of Design Patterns</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li
                      key={item.name}
                      className={`text-sm ${
                        item.highlighted
                          ? "font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.highlighted && (
                        <span className="text-primary mr-1">•</span>
                      )}
                      {item.name}
                      {item.highlighted && (
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          Demo
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Patterns Grid */}
      <section id="patterns" className="space-y-4 scroll-mt-20">
        <h2 className="text-2xl font-semibold">Patterns Covered</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {patternCards.map((pattern) => (
            <Card
              key={pattern.path}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <pattern.icon className="h-8 w-8 text-primary" />
                  <Badge variant={pattern.category}>
                    {pattern.category === "js" ? "JS" : "Arch"}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{pattern.title}</CardTitle>
                <CardDescription>{pattern.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {pattern.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="text-xs"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to={pattern.path}>
                    Explore Pattern
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* When to Use */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">When to Use Design Patterns</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                Do Use When
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• You recognize a recurring problem pattern</li>
                <li>• The pattern fits your specific use case</li>
                <li>• It improves code readability and maintainability</li>
                <li>• Your team is familiar with the pattern</li>
                <li>• The complexity is justified by the benefits</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <XCircle className="h-5 w-5" />
                Avoid When
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• The problem is simple and doesn't need it</li>
                <li>• You're forcing a pattern where it doesn't fit</li>
                <li>• It adds unnecessary complexity</li>
                <li>• A simpler solution would work just as well</li>
                <li>• You're using it just to show off</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <Card className="bg-linear-to-r from-primary/10 to-primary/5 border-none">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-2">Ready to Explore?</h3>
            <p className="text-muted-foreground mb-4">
              Navigate through the patterns using the menu above to see
              interactive demonstrations with real code examples!
            </p>
            <Button asChild>
              <Link to="/patterns/module">
                Start with Module Pattern
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default Introduction;
