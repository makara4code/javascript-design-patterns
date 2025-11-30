/**
 * OBSERVER PATTERN
 *
 * The Observer Pattern defines a one-to-many dependency between objects.
 * When the subject (observable) changes state, all its observers are notified
 * and updated automatically.
 *
 * Benefits:
 * - Loose coupling between subject and observers
 * - Support for broadcast communication
 * - Dynamic subscription/unsubscription
 * - Foundation for event-driven programming
 */

// ============================================
// EXAMPLE 1: Basic Observer Interface
// ============================================

export interface Observer<T> {
  update(data: T): void;
}

export interface Subject<T> {
  subscribe(observer: Observer<T>): void;
  unsubscribe(observer: Observer<T>): void;
  notify(data: T): void;
}

// ============================================
// EXAMPLE 2: Event Emitter (Pub/Sub Pattern)
// ============================================

type EventCallback<T = unknown> = (data: T) => void;

export class EventEmitter {
  private events: Map<string, Set<EventCallback>> = new Map();

  on<T>(event: string, callback: EventCallback<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback as EventCallback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  off<T>(event: string, callback: EventCallback<T>): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback as EventCallback);
    }
  }

  emit<T>(event: string, data: T): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  once<T>(event: string, callback: EventCallback<T>): () => void {
    const wrapper: EventCallback<T> = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

// ============================================
// EXAMPLE 3: Observable Store (State Management)
// ============================================

export class ObservableStore<T> implements Subject<T> {
  private observers: Set<Observer<T>> = new Set();
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: T | ((prev: T) => T)): void {
    const previousState = this.state;

    if (typeof newState === "function") {
      this.state = (newState as (prev: T) => T)(previousState);
    } else {
      this.state = newState;
    }

    // Only notify if state actually changed
    if (this.state !== previousState) {
      this.notify(this.state);
    }
  }

  subscribe(observer: Observer<T>): void {
    this.observers.add(observer);
    // Immediately notify with current state
    observer.update(this.state);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  notify(data: T): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}

// ============================================
// EXAMPLE 4: News Publisher Example
// ============================================

export interface NewsArticle {
  id: number;
  title: string;
  category: string;
  content: string;
  publishedAt: Date;
}

export interface NewsSubscriber {
  id: string;
  name: string;
  categories: string[];
  onNews: (article: NewsArticle) => void;
}

export class NewsPublisher {
  private subscribers: Map<string, NewsSubscriber> = new Map();
  private articles: NewsArticle[] = [];
  private articleIdCounter = 0;

  subscribe(subscriber: NewsSubscriber): () => void {
    this.subscribers.set(subscriber.id, subscriber);

    // Return unsubscribe function
    return () => this.unsubscribe(subscriber.id);
  }

  unsubscribe(subscriberId: string): void {
    this.subscribers.delete(subscriberId);
  }

  publish(article: Omit<NewsArticle, "id" | "publishedAt">): NewsArticle {
    const newArticle: NewsArticle = {
      ...article,
      id: ++this.articleIdCounter,
      publishedAt: new Date(),
    };

    this.articles.push(newArticle);

    // Notify only subscribers interested in this category
    this.subscribers.forEach((subscriber) => {
      if (
        subscriber.categories.includes("all") ||
        subscriber.categories.includes(article.category)
      ) {
        subscriber.onNews(newArticle);
      }
    });

    return newArticle;
  }

  getArticles(): readonly NewsArticle[] {
    return [...this.articles];
  }

  getSubscriberCount(): number {
    return this.subscribers.size;
  }
}

// ============================================
// EXAMPLE 5: Stock Price Observer
// ============================================

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  timestamp: Date;
}

export type StockObserver = (stock: StockPrice) => void;

export class StockTicker {
  private observers: Map<string, Set<StockObserver>> = new Map();
  private prices: Map<string, StockPrice> = new Map();

  // Subscribe to a specific stock
  watch(symbol: string, observer: StockObserver): () => void {
    if (!this.observers.has(symbol)) {
      this.observers.set(symbol, new Set());
    }
    this.observers.get(symbol)!.add(observer);

    // If we have a current price, immediately notify
    const currentPrice = this.prices.get(symbol);
    if (currentPrice) {
      observer(currentPrice);
    }

    return () => this.unwatch(symbol, observer);
  }

  unwatch(symbol: string, observer: StockObserver): void {
    const observers = this.observers.get(symbol);
    if (observers) {
      observers.delete(observer);
    }
  }

  // Update stock price and notify observers
  updatePrice(symbol: string, price: number): void {
    const previousPrice = this.prices.get(symbol);
    const change = previousPrice ? price - previousPrice.price : 0;

    const stockPrice: StockPrice = {
      symbol,
      price,
      change,
      timestamp: new Date(),
    };

    this.prices.set(symbol, stockPrice);

    // Notify all observers watching this stock
    const observers = this.observers.get(symbol);
    if (observers) {
      observers.forEach((observer) => observer(stockPrice));
    }
  }

  getPrice(symbol: string): StockPrice | undefined {
    return this.prices.get(symbol);
  }

  getAllPrices(): Map<string, StockPrice> {
    return new Map(this.prices);
  }
}

// ============================================
// EXAMPLE 6: Form Validation Observer
// ============================================

export interface ValidationResult {
  field: string;
  isValid: boolean;
  errors: string[];
}

export interface FormState {
  values: Record<string, string>;
  validations: Record<string, ValidationResult>;
  isValid: boolean;
  isDirty: boolean;
}

type FormObserver = (state: FormState) => void;

export class FormValidator {
  private observers: Set<FormObserver> = new Set();
  private state: FormState;
  private validators: Map<string, ((value: string) => string[])[]> = new Map();

  constructor(initialValues: Record<string, string> = {}) {
    this.state = {
      values: { ...initialValues },
      validations: {},
      isValid: true,
      isDirty: false,
    };
  }

  addValidator(field: string, validator: (value: string) => string[]): void {
    if (!this.validators.has(field)) {
      this.validators.set(field, []);
    }
    this.validators.get(field)!.push(validator);
  }

  setValue(field: string, value: string): void {
    this.state.values[field] = value;
    this.state.isDirty = true;

    // Run validation for this field
    this.validateField(field);
    this.updateFormValidity();
    this.notifyObservers();
  }

  private validateField(field: string): void {
    const validators = this.validators.get(field) || [];
    const value = this.state.values[field] || "";
    const errors: string[] = [];

    validators.forEach((validator) => {
      errors.push(...validator(value));
    });

    this.state.validations[field] = {
      field,
      isValid: errors.length === 0,
      errors,
    };
  }

  private updateFormValidity(): void {
    this.state.isValid = Object.values(this.state.validations).every(
      (v) => v.isValid
    );
  }

  validateAll(): void {
    Object.keys(this.state.values).forEach((field) => {
      this.validateField(field);
    });
    this.updateFormValidity();
    this.notifyObservers();
  }

  subscribe(observer: FormObserver): () => void {
    this.observers.add(observer);
    observer(this.state);
    return () => this.unsubscribe(observer);
  }

  unsubscribe(observer: FormObserver): void {
    this.observers.delete(observer);
  }

  private notifyObservers(): void {
    this.observers.forEach((observer) => observer({ ...this.state }));
  }

  getState(): FormState {
    return { ...this.state };
  }

  reset(values: Record<string, string> = {}): void {
    this.state = {
      values: { ...values },
      validations: {},
      isValid: true,
      isDirty: false,
    };
    this.notifyObservers();
  }
}

// Common validators
export const validators = {
  required:
    (fieldName: string) =>
    (value: string): string[] =>
      value.trim() ? [] : [`${fieldName} is required`],

  minLength:
    (min: number, fieldName: string) =>
    (value: string): string[] =>
      value.length >= min
        ? []
        : [`${fieldName} must be at least ${min} characters`],

  email:
    () =>
    (value: string): string[] => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? [] : ["Invalid email format"];
    },

  pattern:
    (regex: RegExp, message: string) =>
    (value: string): string[] =>
      regex.test(value) ? [] : [message],
};
