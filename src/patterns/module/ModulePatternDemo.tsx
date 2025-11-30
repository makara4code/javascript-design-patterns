import { useState } from "react";
import {
  CounterModule,
  createShoppingCart,
  LoggerModule,
  createApiService,
} from "./ModulePattern";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
 * Module Pattern Demo Component
 *
 * Demonstrates the Module Pattern in action with interactive examples.
 */
export const ModulePatternDemo = () => {
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const [cart] = useState(() => createShoppingCart());
  const [apiService] = useState(() =>
    createApiService("https://api.example.com")
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Module Pattern"
        description="Encapsulates private data and exposes only a public API using closures."
        badge={{ text: "JavaScript", variant: "js" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>What is the Module Pattern?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The <strong>Module Pattern</strong> encapsulates private data and
            exposes only a public API. It uses closures to create private scope,
            preventing external access to internal implementation details.
          </p>
          <div>
            <h4 className="font-semibold mb-2">Key Benefits:</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Encapsulation of private variables and functions</li>
              <li>Clean public API without exposing internals</li>
              <li>Namespace management to avoid global pollution</li>
              <li>Self-contained, reusable modules</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Counter Module Demo */}
      <Card>
        <CardHeader>
          <CardTitle>1. Counter Module (IIFE Pattern)</CardTitle>
          <CardDescription>
            The count variable is private - you can only interact with it
            through the exposed methods.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Count: {CounterModule.getCount()}
            </Badge>
            <Button
              variant="outline"
              onClick={() => {
                CounterModule.increment();
                refresh();
              }}
            >
              Increment
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                CounterModule.decrement();
                refresh();
              }}
            >
              Decrement
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                CounterModule.reset();
                refresh();
              }}
            >
              Reset
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <strong>History:</strong> [{CounterModule.getHistory().join(", ")}]
          </div>

          <CodeBlock
            language="typescript"
            code={`const CounterModule = (() => {
  let count = 0;  // Private variable

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; }
  };
})();`}
          />
        </CardContent>
      </Card>

      {/* Shopping Cart Module Demo */}
      <Card>
        <CardHeader>
          <CardTitle>2. Shopping Cart Module</CardTitle>
          <CardDescription>
            A factory function that creates independent cart instances with
            encapsulated state.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                cart.addItem({ id: Date.now(), name: "Product", price: 29.99 });
                refresh();
              }}
            >
              Add Item ($29.99)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                cart.setDiscount(10);
                refresh();
              }}
            >
              Apply 10% Discount
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                cart.clear();
                refresh();
              }}
            >
              Clear Cart
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p>
              <strong>Items:</strong> {cart.getItemCount()}
            </p>
            <p>
              <strong>Total:</strong> ${cart.getTotal().toFixed(2)}
            </p>
            <ul className="space-y-2 mt-2">
              {cart.getItems().map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-background p-2 rounded"
                >
                  <span>
                    {item.name} x{item.quantity} - $
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      cart.removeItem(item.id);
                      refresh();
                    }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Logger Module Demo */}
      <Card>
        <CardHeader>
          <CardTitle>3. Logger Module</CardTitle>
          <CardDescription>
            A singleton logger with configurable log levels. Check the browser
            console!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Select
              defaultValue="info"
              onValueChange={(value) => {
                LoggerModule.setLevel(
                  value as "debug" | "info" | "warn" | "error"
                );
                refresh();
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Log Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warn</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                LoggerModule.debug("Debug message");
                refresh();
              }}
            >
              Log Debug
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                LoggerModule.info("Info message");
                refresh();
              }}
            >
              Log Info
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                LoggerModule.warn("Warning message");
                refresh();
              }}
            >
              Log Warn
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                LoggerModule.error("Error message");
                refresh();
              }}
            >
              Log Error
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <strong>Logs ({LoggerModule.getLogs().length}):</strong>
            <ul className="mt-2 font-mono text-sm max-h-40 overflow-y-auto space-y-1">
              {LoggerModule.getLogs()
                .slice(-5)
                .map((log, i) => (
                  <li
                    key={i}
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
                    [{log.level.toUpperCase()}] {log.message}
                  </li>
                ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* API Service Module Demo */}
      <Card>
        <CardHeader>
          <CardTitle>4. API Service Module (Revealing Module)</CardTitle>
          <CardDescription>
            The Revealing Module Pattern explicitly maps private methods to
            public ones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                apiService.setToken("abc123");
                refresh();
              }}
            >
              Set Auth Token
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                apiService.get("/users");
                refresh();
              }}
            >
              GET /users
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                apiService.post("/users", { name: "John" });
                refresh();
              }}
            >
              POST /users
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <strong>Request Stats:</strong>
            <pre className="bg-zinc-900 text-zinc-100 p-3 rounded mt-2 text-sm overflow-x-auto">
              {JSON.stringify(apiService.getStats(), null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModulePatternDemo;
