import { useState, useEffect, useCallback } from "react";
import {
  EventEmitter,
  ObservableStore,
  NewsPublisher,
  StockTicker,
  FormValidator,
  validators,
} from "./ObserverPattern";

import type { StockPrice, FormState, NewsArticle } from "./ObserverPattern";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { CodeBlock } from "@/components/ui/code-block";

/**
 * Observer Pattern Demo Component
 */
export const ObserverPatternDemo = () => {
  const [eventEmitter] = useState(() => new EventEmitter());
  const [eventLog, setEventLog] = useState<string[]>([]);

  const [store] = useState(
    () => new ObservableStore({ count: 0, message: "Hello" })
  );
  const [storeState, setStoreState] = useState(store.getState());

  const [newsPublisher] = useState(() => new NewsPublisher());
  const [receivedNews, setReceivedNews] = useState<
    { subscriber: string; article: NewsArticle }[]
  >([]);

  const [stockTicker] = useState(() => new StockTicker());
  const [stockPrices, setStockPrices] = useState<Map<string, StockPrice>>(
    new Map()
  );

  const [formValidator] = useState(() => {
    const validator = new FormValidator({ email: "", password: "" });
    validator.addValidator("email", validators.required("Email"));
    validator.addValidator("email", validators.email());
    validator.addValidator("password", validators.required("Password"));
    validator.addValidator("password", validators.minLength(8, "Password"));
    return validator;
  });
  const [formState, setFormState] = useState<FormState>(
    formValidator.getState()
  );

  useEffect(() => {
    const storeObserver = { update: setStoreState };
    store.subscribe(storeObserver);

    const unsubForm = formValidator.subscribe(setFormState);

    const stocks = ["AAPL", "GOOGL", "MSFT"];
    const unsubscribers = stocks.map((symbol) =>
      stockTicker.watch(symbol, (price) => {
        setStockPrices((prev) => new Map(prev).set(symbol, price));
      })
    );

    stockTicker.updatePrice("AAPL", 178.5);
    stockTicker.updatePrice("GOOGL", 141.25);
    stockTicker.updatePrice("MSFT", 378.9);

    return () => {
      store.unsubscribe(storeObserver);
      unsubForm();
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [store, formValidator, stockTicker]);

  const subscribeToEvent = useCallback(() => {
    const unsub = eventEmitter.on<string>("message", (data) => {
      setEventLog((prev) => [...prev, `Received: ${data}`]);
    });
    setEventLog((prev) => [...prev, 'Subscribed to "message" event']);
    return unsub;
  }, [eventEmitter]);

  const emitEvent = () => {
    const message = `Event at ${new Date().toLocaleTimeString()}`;
    eventEmitter.emit("message", message);
  };

  const subscribeToNews = (subscriberName: string, categories: string[]) => {
    newsPublisher.subscribe({
      id: `sub_${Date.now()}`,
      name: subscriberName,
      categories,
      onNews: (article) => {
        setReceivedNews((prev) => [
          ...prev,
          { subscriber: subscriberName, article },
        ]);
      },
    });
  };

  const publishNews = (category: string) => {
    const titles: Record<string, string> = {
      tech: "New AI Breakthrough Announced",
      sports: "Championship Finals Results",
      business: "Market Hits Record High",
    };
    newsPublisher.publish({
      title: titles[category] || "Breaking News",
      category,
      content: `This is a ${category} news article published at ${new Date().toLocaleTimeString()}`,
    });
  };

  const updateStock = (symbol: string) => {
    const current = stockTicker.getPrice(symbol)?.price || 100;
    const change = (Math.random() - 0.5) * 10;
    stockTicker.updatePrice(symbol, Math.max(0, current + change));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Observer Pattern"
        description="Defines a one-to-many dependency between objects for event-driven communication."
        badge={{ text: "JavaScript", variant: "js" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>What is the Observer Pattern?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The <strong>Observer Pattern</strong> defines a one-to-many
            dependency between objects. When the subject changes state, all
            observers are notified automatically.
          </p>
          <div>
            <h4 className="font-semibold mb-2">Key Benefits:</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Loose coupling between subject and observers</li>
              <li>Support for broadcast communication</li>
              <li>Dynamic subscription/unsubscription at runtime</li>
              <li>Foundation for event-driven and reactive programming</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Event Emitter Demo */}
      <Card>
        <CardHeader>
          <CardTitle>1. Event Emitter (Pub/Sub)</CardTitle>
          <CardDescription>
            A classic publish/subscribe implementation. Subscribers register
            callbacks for specific events.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={subscribeToEvent}>
              Subscribe to Event
            </Button>
            <Button onClick={emitEvent}>Emit Event</Button>
            <Button variant="secondary" onClick={() => setEventLog([])}>
              Clear Log
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <strong>Event Log:</strong>
            <div className="mt-2 font-mono text-sm max-h-36 overflow-y-auto">
              {eventLog.length === 0 ? (
                <p className="text-muted-foreground italic">No events yet</p>
              ) : (
                eventLog.map((log, i) => (
                  <div key={i} className="py-0.5">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <CodeBlock
            language="typescript"
            code={`const emitter = new EventEmitter();

// Subscribe
emitter.on('message', (data) => {
  console.log('Received:', data);
});

// Publish
emitter.emit('message', 'Hello World');`}
          />
        </CardContent>
      </Card>

      {/* Observable Store Demo */}
      <Card>
        <CardHeader>
          <CardTitle>2. Observable Store (State Management)</CardTitle>
          <CardDescription>
            A reactive store that notifies observers when state changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() =>
                store.setState((s) => ({ ...s, count: s.count + 1 }))
              }
            >
              Increment Count
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                store.setState((s) => ({
                  ...s,
                  message: `Updated at ${Date.now() % 10000}`,
                }))
              }
            >
              Update Message
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p>
              <strong>Count:</strong> {storeState.count}
            </p>
            <p>
              <strong>Message:</strong> {storeState.message}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* News Publisher Demo */}
      <Card>
        <CardHeader>
          <CardTitle>3. News Publisher</CardTitle>
          <CardDescription>
            Subscribers only receive news from categories they're interested in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => subscribeToNews("Tech Fan", ["tech"])}
            >
              Subscribe: Tech
            </Button>
            <Button
              variant="outline"
              onClick={() => subscribeToNews("Sports Fan", ["sports"])}
            >
              Subscribe: Sports
            </Button>
            <Button
              variant="outline"
              onClick={() => subscribeToNews("All News", ["all"])}
            >
              Subscribe: All
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => publishNews("tech")}>
              Publish Tech News
            </Button>
            <Button onClick={() => publishNews("sports")}>
              Publish Sports News
            </Button>
            <Button onClick={() => publishNews("business")}>
              Publish Business News
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="mb-2">
              <strong>Subscribers:</strong> {newsPublisher.getSubscriberCount()}
            </p>
            <div className="space-y-2">
              {receivedNews.slice(-5).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-background p-2 rounded border"
                >
                  <Badge variant="secondary">{item.subscriber}</Badge>
                  <strong className="flex-1">{item.article.title}</strong>
                  <Badge variant="outline">{item.article.category}</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Ticker Demo */}
      <Card>
        <CardHeader>
          <CardTitle>4. Stock Ticker</CardTitle>
          <CardDescription>
            Watch specific stocks and get notified on price changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => updateStock("AAPL")}>
              Update AAPL
            </Button>
            <Button variant="outline" onClick={() => updateStock("GOOGL")}>
              Update GOOGL
            </Button>
            <Button variant="outline" onClick={() => updateStock("MSFT")}>
              Update MSFT
            </Button>
            <Button
              onClick={() => {
                updateStock("AAPL");
                updateStock("GOOGL");
                updateStock("MSFT");
              }}
            >
              Update All
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {Array.from(stockPrices.entries()).map(([symbol, stock]) => (
              <Card key={symbol}>
                <CardContent className="pt-6 text-center">
                  <h4 className="font-bold text-lg">{symbol}</h4>
                  <p className="text-2xl font-bold text-primary mt-2">
                    ${stock.price.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Validator Demo */}
      <Card>
        <CardHeader>
          <CardTitle>5. Form Validation Observer</CardTitle>
          <CardDescription>
            Real-time form validation with observer-based updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="font-semibold text-sm">Email:</label>
              <Input
                type="email"
                value={formState.values.email || ""}
                onChange={(e) =>
                  formValidator.setValue("email", e.target.value)
                }
                className={
                  formState.validations.email?.isValid === false
                    ? "border-red-500"
                    : ""
                }
              />
              {formState.validations.email?.errors.map((err, i) => (
                <span key={i} className="text-red-500 text-sm">
                  {err}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-sm">Password:</label>
              <Input
                type="password"
                value={formState.values.password || ""}
                onChange={(e) =>
                  formValidator.setValue("password", e.target.value)
                }
                className={
                  formState.validations.password?.isValid === false
                    ? "border-red-500"
                    : ""
                }
              />
              {formState.validations.password?.errors.map((err, i) => (
                <span key={i} className="text-red-500 text-sm">
                  {err}
                </span>
              ))}
            </div>

            <div className="flex gap-4 p-3 bg-muted rounded-lg">
              <span>Form Valid: {formState.isValid ? "Yes" : "No"}</span>
              <span>Dirty: {formState.isDirty ? "Yes" : "No"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObserverPatternDemo;
