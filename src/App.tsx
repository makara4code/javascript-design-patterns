import { useState } from "react";

// Pattern components
import { Introduction } from "./patterns/Introduction";
import { ModulePatternDemo } from "./patterns/module/ModulePatternDemo";
import { PrototypePatternDemo } from "./patterns/prototype/PrototypePatternDemo";
import { ObserverPatternDemo } from "./patterns/observer/ObserverPatternDemo";
import { SingletonPatternDemo } from "./patterns/singleton/SingletonPatternDemo";
import { MVCPatternDemo } from "./patterns/mvc/MVCPatternDemo";
import { MVPPatternDemo } from "./patterns/mvp/MVPPatternDemo";
import { MVVMPatternDemo } from "./patterns/mvvm/MVVMPatternDemo";

type PatternView =
  | "intro"
  | "module"
  | "prototype"
  | "observer"
  | "singleton"
  | "mvc"
  | "mvp"
  | "mvvm";

interface NavItem {
  id: PatternView;
  label: string;
  category: "intro" | "js" | "arch";
}

const navItems: NavItem[] = [
  { id: "intro", label: "Introduction", category: "intro" },
  { id: "module", label: "Module", category: "js" },
  { id: "prototype", label: "Prototype", category: "js" },
  { id: "observer", label: "Observer", category: "js" },
  { id: "singleton", label: "Singleton", category: "js" },
  { id: "mvc", label: "MVC", category: "arch" },
  { id: "mvp", label: "MVP", category: "arch" },
  { id: "mvvm", label: "MVVM", category: "arch" },
];

function App() {
  const [currentView, setCurrentView] = useState<PatternView>("intro");

  const renderPattern = () => {
    switch (currentView) {
      case "intro":
        return <Introduction />;
      case "module":
        return <ModulePatternDemo />;
      case "prototype":
        return <PrototypePatternDemo />;
      case "observer":
        return <ObserverPatternDemo />;
      case "singleton":
        return <SingletonPatternDemo />;
      case "mvc":
        return <MVCPatternDemo />;
      case "mvp":
        return <MVPPatternDemo />;
      case "mvvm":
        return <MVVMPatternDemo />;
      default:
        return <Introduction />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>JavaScript Design Patterns</h1>
        <p>Interactive demonstrations of common design patterns</p>
      </header>

      <nav className="app-nav">
        <div className="nav-section">
          {navItems
            .filter((item) => item.category === "intro")
            .map((item) => (
              <button
                key={item.id}
                className={`nav-btn intro ${
                  currentView === item.id ? "active" : ""
                }`}
                onClick={() => setCurrentView(item.id)}
              >
                {item.label}
              </button>
            ))}
        </div>

        <div className="nav-section">
          <span className="nav-label">JS Patterns:</span>
          {navItems
            .filter((item) => item.category === "js")
            .map((item) => (
              <button
                key={item.id}
                className={`nav-btn js ${
                  currentView === item.id ? "active" : ""
                }`}
                onClick={() => setCurrentView(item.id)}
              >
                {item.label}
              </button>
            ))}
        </div>

        <div className="nav-section">
          <span className="nav-label">Architectural:</span>
          {navItems
            .filter((item) => item.category === "arch")
            .map((item) => (
              <button
                key={item.id}
                className={`nav-btn arch ${
                  currentView === item.id ? "active" : ""
                }`}
                onClick={() => setCurrentView(item.id)}
              >
                {item.label}
              </button>
            ))}
        </div>
      </nav>

      <main className="app-content">{renderPattern()}</main>

      <footer className="app-footer">
        <p>Design Patterns Demo - Built with React + TypeScript</p>
      </footer>
    </div>
  );
}

export default App;
