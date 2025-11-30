import { Outlet, NavLink, useLocation } from "react-router";
import {
  Code2,
  Layers,
  GithubIcon,
  Boxes,
  GitBranch,
  Eye,
  Fingerprint,
  Monitor,
  Puzzle,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const jsPatterns = [
  {
    title: "Module",
    href: "/patterns/module",
    description: "Encapsulates private data using closures",
    icon: Boxes,
  },
  {
    title: "Prototype",
    href: "/patterns/prototype",
    description: "Creates objects by cloning existing prototypes",
    icon: GitBranch,
  },
  {
    title: "Observer",
    href: "/patterns/observer",
    description: "One-to-many dependency for event handling",
    icon: Eye,
  },
  {
    title: "Singleton",
    href: "/patterns/singleton",
    description: "Ensures only one instance exists globally",
    icon: Fingerprint,
  },
];

const archPatterns = [
  {
    title: "MVC",
    href: "/patterns/mvc",
    description: "Model-View-Controller separation",
    icon: Layers,
  },
  {
    title: "MVP",
    href: "/patterns/mvp",
    description: "Model-View-Presenter with interface",
    icon: Monitor,
  },
  {
    title: "MVVM",
    href: "/patterns/mvvm",
    description: "Model-View-ViewModel with data binding",
    icon: Puzzle,
  },
];

function ListItem({
  className,
  title,
  href,
  children,
  icon: Icon,
}: {
  className?: string;
  title: string;
  href: string;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <li>
      <NavigationMenuLink asChild active={isActive}>
        <NavLink
          to={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            isActive && "bg-accent",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium leading-none">{title}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </NavLink>
      </NavigationMenuLink>
    </li>
  );
}

export function Layout() {
  const location = useLocation();

  const isJsPatternActive = jsPatterns.some(
    (p) => location.pathname === p.href
  );
  const isArchPatternActive = archPatterns.some(
    (p) => location.pathname === p.href
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="max-w-4xl flex h-16 items-center mx-auto px-4">
          {/* Left - Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline-block">
              Design Patterns
            </span>
          </NavLink>

          {/* Center - Navigation Menu */}
          <div className="flex-1 flex justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {/* JS Patterns Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      isJsPatternActive &&
                        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                    )}
                  >
                    Javascript Patterns
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {jsPatterns.map((pattern) => (
                        <ListItem
                          key={pattern.title}
                          title={pattern.title}
                          href={pattern.href}
                          icon={pattern.icon}
                        >
                          {pattern.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Architectural Patterns Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      isArchPatternActive &&
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    )}
                  >
                    Architectural Patterns
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {archPatterns.map((pattern) => (
                        <ListItem
                          key={pattern.title}
                          title={pattern.title}
                          href={pattern.href}
                          icon={pattern.icon}
                        >
                          {pattern.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right - Mode Toggle */}
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl py-6 mx-auto px-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Design Patterns Demo — Built with React, TypeScript & shadcn/ui
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubIcon className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>7 Patterns</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
