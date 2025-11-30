/**
 * MODULE PATTERN
 *
 * The Module Pattern is used to encapsulate private data and expose
 * only what's necessary through a public API. It uses closures to
 * create private scope.
 *
 * Benefits:
 * - Encapsulation: Hide internal implementation details
 * - Namespace management: Avoid global scope pollution
 * - Reusability: Create self-contained modules
 * - Maintainability: Clear separation of concerns
 */

// ============================================
// EXAMPLE 1: Counter Module (IIFE Pattern)
// ============================================

export const CounterModule = (() => {
  // Private variables - not accessible from outside
  let count = 0;
  const history: number[] = [];

  // Private function
  const logChange = (action: string, value: number) => {
    console.log(`[CounterModule] ${action}: ${value}`);
    history.push(value);
  };

  // Public API - only these methods are exposed
  return {
    increment(): number {
      count++;
      logChange('Incremented to', count);
      return count;
    },

    decrement(): number {
      count--;
      logChange('Decremented to', count);
      return count;
    },

    getCount(): number {
      return count;
    },

    reset(): void {
      count = 0;
      logChange('Reset to', count);
    },

    getHistory(): readonly number[] {
      // Return copy to prevent external mutation
      return [...history];
    },
  };
})();


// ============================================
// EXAMPLE 2: Shopping Cart Module
// ============================================

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export const createShoppingCart = () => {
  // Private state
  const items: CartItem[] = [];
  let discount = 0;

  // Private helper functions
  const findItemIndex = (id: number): number => {
    return items.findIndex(item => item.id === id);
  };

  const calculateSubtotal = (): number => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Public API
  return {
    addItem(item: Omit<CartItem, 'quantity'>, quantity = 1): void {
      const existingIndex = findItemIndex(item.id);

      if (existingIndex !== -1) {
        items[existingIndex].quantity += quantity;
      } else {
        items.push({ ...item, quantity });
      }
    },

    removeItem(id: number): boolean {
      const index = findItemIndex(id);
      if (index !== -1) {
        items.splice(index, 1);
        return true;
      }
      return false;
    },

    updateQuantity(id: number, quantity: number): boolean {
      const index = findItemIndex(id);
      if (index !== -1) {
        if (quantity <= 0) {
          items.splice(index, 1);
        } else {
          items[index].quantity = quantity;
        }
        return true;
      }
      return false;
    },

    setDiscount(percentage: number): void {
      discount = Math.max(0, Math.min(100, percentage));
    },

    getItems(): readonly CartItem[] {
      return items.map(item => ({ ...item }));
    },

    getTotal(): number {
      const subtotal = calculateSubtotal();
      return subtotal - (subtotal * discount / 100);
    },

    getItemCount(): number {
      return items.reduce((count, item) => count + item.quantity, 0);
    },

    clear(): void {
      items.length = 0;
      discount = 0;
    },
  };
};


// ============================================
// EXAMPLE 3: Logger Module with Levels
// ============================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const LoggerModule = (() => {
  // Private configuration
  const logs: { level: LogLevel; message: string; timestamp: Date }[] = [];
  let currentLevel: LogLevel = 'info';
  let isEnabled = true;

  const levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  // Private helper
  const shouldLog = (level: LogLevel): boolean => {
    return isEnabled && levels[level] >= levels[currentLevel];
  };

  const formatMessage = (level: LogLevel, message: string): string => {
    return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
  };

  // Public API
  return {
    setLevel(level: LogLevel): void {
      currentLevel = level;
    },

    enable(): void {
      isEnabled = true;
    },

    disable(): void {
      isEnabled = false;
    },

    debug(message: string): void {
      if (shouldLog('debug')) {
        const formatted = formatMessage('debug', message);
        console.log(formatted);
        logs.push({ level: 'debug', message, timestamp: new Date() });
      }
    },

    info(message: string): void {
      if (shouldLog('info')) {
        const formatted = formatMessage('info', message);
        console.info(formatted);
        logs.push({ level: 'info', message, timestamp: new Date() });
      }
    },

    warn(message: string): void {
      if (shouldLog('warn')) {
        const formatted = formatMessage('warn', message);
        console.warn(formatted);
        logs.push({ level: 'warn', message, timestamp: new Date() });
      }
    },

    error(message: string): void {
      if (shouldLog('error')) {
        const formatted = formatMessage('error', message);
        console.error(formatted);
        logs.push({ level: 'error', message, timestamp: new Date() });
      }
    },

    getLogs(): readonly { level: LogLevel; message: string; timestamp: Date }[] {
      return [...logs];
    },

    clearLogs(): void {
      logs.length = 0;
    },
  };
})();


// ============================================
// EXAMPLE 4: API Service Module (Revealing Module Pattern)
// ============================================

export const createApiService = (baseUrl: string) => {
  // Private state
  let authToken: string | null = null;
  const requestCount = { get: 0, post: 0, put: 0, delete: 0 };

  // Private methods
  const makeRequest = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: unknown
  ): Promise<T> => {
    const url = `${baseUrl}${endpoint}`;

    // Track request count
    requestCount[method.toLowerCase() as keyof typeof requestCount]++;

    // Simulate API call (in real app, use fetch with headers)
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    console.log(`[API] ${method} ${url}`, { headers, body: body || '' });

    // Return mock response for demo
    return { success: true, method, endpoint } as T;
  };

  // Public API (Revealing Module Pattern)
  const setToken = (token: string): void => {
    authToken = token;
  };

  const clearToken = (): void => {
    authToken = null;
  };

  const get = <T>(endpoint: string): Promise<T> => {
    return makeRequest<T>('GET', endpoint);
  };

  const post = <T>(endpoint: string, data: unknown): Promise<T> => {
    return makeRequest<T>('POST', endpoint, data);
  };

  const put = <T>(endpoint: string, data: unknown): Promise<T> => {
    return makeRequest<T>('PUT', endpoint, data);
  };

  const del = <T>(endpoint: string): Promise<T> => {
    return makeRequest<T>('DELETE', endpoint);
  };

  const getStats = () => ({ ...requestCount });

  // Reveal public methods
  return {
    setToken,
    clearToken,
    get,
    post,
    put,
    delete: del,
    getStats,
  };
};
