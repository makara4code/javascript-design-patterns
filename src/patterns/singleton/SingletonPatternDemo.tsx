import { useState, useEffect } from "react";
import {
  ConfigurationManager,
  Logger,
  CacheManager,
  ConnectionPool,
  AppStore,
} from "./SingletonPattern";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { CodeBlock } from "@/components/ui/code-block";

/**
 * Singleton Pattern Demo Component
 */
export const SingletonPatternDemo = () => {
  const config = ConfigurationManager.getInstance();
  const logger = Logger.getInstance();
  const cache = CacheManager.getInstance();
  const connectionPool = ConnectionPool.getInstance();
  const appStore = AppStore.getInstance();

  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const [storeState, setStoreState] = useState(appStore.getState());

  useEffect(() => {
    const unsubscribe = appStore.subscribe(setStoreState);
    return unsubscribe;
  }, []);

  const [newConfigKey, setNewConfigKey] = useState("");
  const [newConfigValue, setNewConfigValue] = useState("");

  const addConfig = () => {
    if (newConfigKey && newConfigValue) {
      config.set(newConfigKey, newConfigValue);
      setNewConfigKey("");
      setNewConfigValue("");
      refresh();
    }
  };

  const logMessage = (level: "debug" | "info" | "warn" | "error") => {
    const messages = {
      debug: "Debug information for developers",
      info: "User performed an action",
      warn: "Something might be wrong",
      error: "An error occurred!",
    };
    logger[level](messages[level], "Demo");
    refresh();
  };

  const [cacheKey, setCacheKey] = useState("");
  const [cacheValue, setCacheValue] = useState("");

  const addToCache = () => {
    if (cacheKey && cacheValue) {
      cache.set(cacheKey, cacheValue, 30000);
      setCacheKey("");
      setCacheValue("");
      refresh();
    }
  };

  const [activeConnections, setActiveConnections] = useState<string[]>([]);

  const acquireConnection = async () => {
    const conn = await connectionPool.acquire();
    setActiveConnections((prev) => [...prev, conn.id]);
    refresh();
  };

  const releaseConnection = (connId: string) => {
    connectionPool.release(connId);
    setActiveConnections((prev) => prev.filter((id) => id !== connId));
    refresh();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Singleton Pattern"
        description="Ensures a class has only one instance and provides a global point of access."
        badge={{ text: "JavaScript", variant: "js" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>What is the Singleton Pattern?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The <strong>Singleton Pattern</strong> ensures a class has only one
            instance and provides a global point of access to it. It's useful
            for managing shared resources.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Key Benefits:</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Controlled access to sole instance</li>
                <li>Lazy initialization (created only when needed)</li>
                <li>Reduced namespace pollution</li>
                <li>Global state management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Common Use Cases:</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Configuration managers</li>
                <li>Logger instances</li>
                <li>Cache managers</li>
                <li>Database connection pools</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Manager Demo */}
      <Card>
        <CardHeader>
          <CardTitle>1. Configuration Manager</CardTitle>
          <CardDescription>
            A single configuration instance shared across the entire
            application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Key"
              value={newConfigKey}
              onChange={(e) => setNewConfigKey(e.target.value)}
              className="w-32"
            />
            <Input
              placeholder="Value"
              value={newConfigValue}
              onChange={(e) => setNewConfigValue(e.target.value)}
              className="w-32"
            />
            <Button onClick={addConfig}>Add Config</Button>
            <Button
              variant="outline"
              onClick={() => {
                config.reset();
                refresh();
              }}
            >
              Reset
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <strong>Current Configuration:</strong>
            <pre className="bg-zinc-900 text-zinc-100 p-3 rounded mt-2 text-sm overflow-x-auto">
              {JSON.stringify(config.getAll(), null, 2)}
            </pre>
          </div>

          <CodeBlock
            language="typescript"
            code={`class ConfigurationManager {
  private static instance: ConfigurationManager;

  private constructor() { }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }
}`}
          />
        </CardContent>
      </Card>

      {/* Logger Demo */}
      <Card>
        <CardHeader>
          <CardTitle>2. Logger Singleton</CardTitle>
          <CardDescription>
            A centralized logging system with configurable log levels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Select
              value={logger.getLevel()}
              onValueChange={(value) => {
                logger.setLevel(value as "debug" | "info" | "warn" | "error");
                refresh();
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warn</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => logMessage("debug")}>
              Log Debug
            </Button>
            <Button variant="outline" onClick={() => logMessage("info")}>
              Log Info
            </Button>
            <Button variant="outline" onClick={() => logMessage("warn")}>
              Log Warn
            </Button>
            <Button variant="outline" onClick={() => logMessage("error")}>
              Log Error
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                logger.clearLogs();
                refresh();
              }}
            >
              Clear
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <strong>Log Entries ({logger.getLogs().length}):</strong>
            <div className="mt-2 max-h-48 overflow-y-auto space-y-1 font-mono text-sm">
              {logger
                .getLogs()
                .slice(-10)
                .map((log, i) => (
                  <div
                    key={i}
                    className="flex gap-2 py-1 border-b border-border/50"
                  >
                    <span className="text-muted-foreground">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <span
                      className={
                        log.level === "debug"
                          ? "text-muted-foreground"
                          : log.level === "info"
                            ? "text-blue-500"
                            : log.level === "warn"
                              ? "text-yellow-500"
                              : "text-red-500"
                      }
                    >
                      {log.level.toUpperCase()}
                    </span>
                    {log.context && (
                      <span className="text-purple-500">[{log.context}]</span>
                    )}
                    <span>{log.message}</span>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cache Manager Demo */}
      <Card>
        <CardHeader>
          <CardTitle>3. Cache Manager</CardTitle>
          <CardDescription>
            A single cache instance with TTL support for application-wide
            caching.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Cache Key"
              value={cacheKey}
              onChange={(e) => setCacheKey(e.target.value)}
              className="w-32"
            />
            <Input
              placeholder="Cache Value"
              value={cacheValue}
              onChange={(e) => setCacheValue(e.target.value)}
              className="w-32"
            />
            <Button onClick={addToCache}>Add to Cache</Button>
            <Button
              variant="destructive"
              onClick={() => {
                cache.clear();
                refresh();
              }}
            >
              Clear Cache
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <strong>Cache Stats:</strong>
            <pre className="bg-zinc-900 text-zinc-100 p-3 rounded mt-2 text-sm overflow-x-auto">
              {JSON.stringify(cache.getStats(), null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Connection Pool Demo */}
      <Card>
        <CardHeader>
          <CardTitle>4. Connection Pool</CardTitle>
          <CardDescription>
            Manages a pool of database connections, reusing them efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={acquireConnection}>Acquire Connection</Button>
            <Button
              variant="destructive"
              onClick={() => {
                connectionPool.closeAll();
                setActiveConnections([]);
                refresh();
              }}
            >
              Close All
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-4">
            <div>
              <strong>Pool Stats:</strong>
              <pre className="bg-zinc-900 text-zinc-100 p-3 rounded mt-2 text-sm overflow-x-auto">
                {JSON.stringify(connectionPool.getStats(), null, 2)}
              </pre>
            </div>

            <div>
              <strong>Active Connections:</strong>
              <div className="mt-2 space-y-2">
                {activeConnections.map((connId) => (
                  <div
                    key={connId}
                    className="flex justify-between items-center bg-background p-3 rounded border"
                  >
                    <span className="font-mono text-sm">{connId}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => releaseConnection(connId)}
                    >
                      Release
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Store Demo */}
      <Card>
        <CardHeader>
          <CardTitle>5. Application State Store</CardTitle>
          <CardDescription>
            A centralized store that fetches and manages application data using
            the mock API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => appStore.loadUsers()}>
              Load Users
            </Button>
            <Button variant="outline" onClick={() => appStore.loadProducts()}>
              Load Products
            </Button>
            <Button variant="outline" onClick={() => appStore.loadTasks()}>
              Load Tasks
            </Button>
            <Button onClick={() => appStore.loadAll()}>Load All</Button>
            <Button variant="secondary" onClick={() => appStore.reset()}>
              Reset
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-4">
            {storeState.loading && (
              <p className="text-blue-500 italic">Loading...</p>
            )}
            {storeState.error && (
              <p className="text-red-500">{storeState.error}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-background p-3 rounded border text-center">
                <div className="text-2xl font-bold">
                  {storeState.users.length}
                </div>
                <div className="text-muted-foreground text-sm">Users</div>
              </div>
              <div className="bg-background p-3 rounded border text-center">
                <div className="text-2xl font-bold">
                  {storeState.products.length}
                </div>
                <div className="text-muted-foreground text-sm">Products</div>
              </div>
              <div className="bg-background p-3 rounded border text-center">
                <div className="text-2xl font-bold">
                  {storeState.tasks.length}
                </div>
                <div className="text-muted-foreground text-sm">Tasks</div>
              </div>
              <div className="bg-background p-3 rounded border text-center">
                <div className="text-sm font-medium">
                  {storeState.lastUpdated?.toLocaleTimeString() || "Never"}
                </div>
                <div className="text-muted-foreground text-sm">
                  Last Updated
                </div>
              </div>
            </div>

            {storeState.users.length > 0 && (
              <div>
                <strong>Users:</strong>
                <ul className="mt-2 space-y-1">
                  {storeState.users.slice(0, 3).map((user) => (
                    <li key={user.id} className="text-muted-foreground">
                      {user.name} ({user.role})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {storeState.products.length > 0 && (
              <div>
                <strong>Products:</strong>
                <ul className="mt-2 space-y-1">
                  {storeState.products.slice(0, 3).map((product) => (
                    <li key={product.id} className="text-muted-foreground">
                      {product.name} - ${product.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingletonPatternDemo;
