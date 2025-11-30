/**
 * SINGLETON PATTERN
 *
 * The Singleton Pattern ensures a class has only one instance and provides
 * a global point of access to it. Useful for managing shared resources
 * like configurations, caches, or connection pools.
 *
 * Benefits:
 * - Controlled access to sole instance
 * - Reduced namespace pollution
 * - Permits refinement of operations and representation
 * - Lazy initialization (create only when needed)
 *
 * Cautions:
 * - Can make unit testing difficult
 * - Violates Single Responsibility Principle (manages own lifecycle)
 * - Can hide dependencies
 */

import { mockApi } from '../../api/mockApi';
import type { User, Product, Task } from '../../api/mockApi';

// ============================================
// EXAMPLE 1: Basic Singleton (ES6 Class)
// ============================================

export class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: Map<string, unknown> = new Map();

  // Private constructor prevents direct instantiation
  private constructor() {
    // Initialize with defaults
    this.config.set('apiUrl', 'https://api.example.com');
    this.config.set('timeout', 5000);
    this.config.set('maxRetries', 3);
    this.config.set('theme', 'light');
    this.config.set('language', 'en');
  }

  // Static method to get the single instance
  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  get<T>(key: string): T | undefined {
    return this.config.get(key) as T | undefined;
  }

  set<T>(key: string, value: T): void {
    this.config.set(key, value);
  }

  getAll(): Record<string, unknown> {
    return Object.fromEntries(this.config);
  }

  reset(): void {
    this.config.clear();
    this.config.set('apiUrl', 'https://api.example.com');
    this.config.set('timeout', 5000);
    this.config.set('maxRetries', 3);
  }
}


// ============================================
// EXAMPLE 2: Logger Singleton
// ============================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
}

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private level: LogLevel = 'info';
  private maxLogs = 1000;

  private readonly levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.level];
  }

  private log(level: LogLevel, message: string, context?: string): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
    };

    this.logs.push(entry);

    // Keep logs within limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    const formattedMessage = `[${entry.timestamp.toISOString()}] [${level.toUpperCase()}]${context ? ` [${context}]` : ''} ${message}`;

    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }
  }

  debug(message: string, context?: string): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: string): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: string): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: string): void {
    this.log('error', message, context);
  }

  getLogs(filter?: { level?: LogLevel; context?: string }): LogEntry[] {
    let filtered = [...this.logs];

    if (filter?.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    if (filter?.context) {
      filtered = filtered.filter(log => log.context === filter.context);
    }

    return filtered;
  }

  clearLogs(): void {
    this.logs = [];
  }
}


// ============================================
// EXAMPLE 3: Cache Manager Singleton
// ============================================

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    // Cleanup expired entries periodically
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expiresAt });
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
}


// ============================================
// EXAMPLE 4: Database Connection Pool Singleton
// ============================================

export interface Connection {
  id: string;
  createdAt: Date;
  lastUsed: Date;
  inUse: boolean;
}

export class ConnectionPool {
  private static instance: ConnectionPool;
  private connections: Connection[] = [];
  private maxConnections = 10;
  private connectionIdCounter = 0;

  private constructor() {}

  public static getInstance(): ConnectionPool {
    if (!ConnectionPool.instance) {
      ConnectionPool.instance = new ConnectionPool();
    }
    return ConnectionPool.instance;
  }

  async acquire(): Promise<Connection> {
    // Try to find an available connection
    const available = this.connections.find(conn => !conn.inUse);

    if (available) {
      available.inUse = true;
      available.lastUsed = new Date();
      Logger.getInstance().debug(`Reusing connection ${available.id}`, 'ConnectionPool');
      return available;
    }

    // Create new connection if pool isn't full
    if (this.connections.length < this.maxConnections) {
      const newConnection: Connection = {
        id: `conn_${++this.connectionIdCounter}`,
        createdAt: new Date(),
        lastUsed: new Date(),
        inUse: true,
      };

      this.connections.push(newConnection);
      Logger.getInstance().info(`Created new connection ${newConnection.id}`, 'ConnectionPool');
      return newConnection;
    }

    // Wait and retry
    Logger.getInstance().warn('Pool exhausted, waiting for available connection', 'ConnectionPool');
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.acquire();
  }

  release(connectionId: string): void {
    const connection = this.connections.find(conn => conn.id === connectionId);
    if (connection) {
      connection.inUse = false;
      Logger.getInstance().debug(`Released connection ${connectionId}`, 'ConnectionPool');
    }
  }

  getStats(): {
    total: number;
    inUse: number;
    available: number;
    maxConnections: number;
  } {
    const inUse = this.connections.filter(conn => conn.inUse).length;
    return {
      total: this.connections.length,
      inUse,
      available: this.connections.length - inUse,
      maxConnections: this.maxConnections,
    };
  }

  setMaxConnections(max: number): void {
    this.maxConnections = max;
  }

  closeAll(): void {
    this.connections = [];
    Logger.getInstance().info('All connections closed', 'ConnectionPool');
  }
}


// ============================================
// EXAMPLE 5: Application State Store (Using Mock API)
// ============================================

interface AppState {
  users: User[];
  products: Product[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

type StateListener = (state: AppState) => void;

export class AppStore {
  private static instance: AppStore;
  private state: AppState = {
    users: [],
    products: [],
    tasks: [],
    loading: false,
    error: null,
    lastUpdated: null,
  };
  private listeners: Set<StateListener> = new Set();

  private constructor() {}

  public static getInstance(): AppStore {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore();
    }
    return AppStore.instance;
  }

  getState(): AppState {
    return { ...this.state };
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  private setState(partial: Partial<AppState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  async loadUsers(): Promise<void> {
    this.setState({ loading: true, error: null });
    try {
      const users = await mockApi.users.getAll();
      this.setState({ users, loading: false, lastUpdated: new Date() });
      Logger.getInstance().info('Users loaded successfully', 'AppStore');
    } catch {
      this.setState({ error: 'Failed to load users', loading: false });
      Logger.getInstance().error('Failed to load users', 'AppStore');
    }
  }

  async loadProducts(): Promise<void> {
    this.setState({ loading: true, error: null });
    try {
      const products = await mockApi.products.getAll();
      this.setState({ products, loading: false, lastUpdated: new Date() });
      Logger.getInstance().info('Products loaded successfully', 'AppStore');
    } catch {
      this.setState({ error: 'Failed to load products', loading: false });
      Logger.getInstance().error('Failed to load products', 'AppStore');
    }
  }

  async loadTasks(): Promise<void> {
    this.setState({ loading: true, error: null });
    try {
      const tasks = await mockApi.tasks.getAll();
      this.setState({ tasks, loading: false, lastUpdated: new Date() });
      Logger.getInstance().info('Tasks loaded successfully', 'AppStore');
    } catch {
      this.setState({ error: 'Failed to load tasks', loading: false });
      Logger.getInstance().error('Failed to load tasks', 'AppStore');
    }
  }

  async loadAll(): Promise<void> {
    this.setState({ loading: true, error: null });
    try {
      const [users, products, tasks] = await Promise.all([
        mockApi.users.getAll(),
        mockApi.products.getAll(),
        mockApi.tasks.getAll(),
      ]);
      this.setState({
        users,
        products,
        tasks,
        loading: false,
        lastUpdated: new Date(),
      });
      Logger.getInstance().info('All data loaded successfully', 'AppStore');
    } catch {
      this.setState({ error: 'Failed to load data', loading: false });
      Logger.getInstance().error('Failed to load data', 'AppStore');
    }
  }

  clearError(): void {
    this.setState({ error: null });
  }

  reset(): void {
    this.state = {
      users: [],
      products: [],
      tasks: [],
      loading: false,
      error: null,
      lastUpdated: null,
    };
    this.notify();
  }
}
