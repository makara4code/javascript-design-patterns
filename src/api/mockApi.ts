// Mock API with static data for demo purposes
// Simulates async API calls with artificial delay

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  assignedTo: number;
}

// Static mock data
const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
  { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "user" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "guest" },
];

const products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    inStock: true,
  },
  {
    id: 2,
    name: "Headphones",
    price: 149.99,
    category: "Electronics",
    inStock: true,
  },
  {
    id: 3,
    name: "Desk Chair",
    price: 299.99,
    category: "Furniture",
    inStock: false,
  },
  {
    id: 4,
    name: "Monitor",
    price: 399.99,
    category: "Electronics",
    inStock: true,
  },
  {
    id: 5,
    name: "Keyboard",
    price: 79.99,
    category: "Electronics",
    inStock: true,
  },
];

const tasks: Task[] = [
  {
    id: 1,
    title: "Complete project setup",
    completed: true,
    priority: "high",
    assignedTo: 1,
  },
  {
    id: 2,
    title: "Write documentation",
    completed: false,
    priority: "medium",
    assignedTo: 2,
  },
  {
    id: 3,
    title: "Review pull requests",
    completed: false,
    priority: "high",
    assignedTo: 1,
  },
  {
    id: 4,
    title: "Fix bug #123",
    completed: true,
    priority: "low",
    assignedTo: 3,
  },
  {
    id: 5,
    title: "Deploy to staging",
    completed: false,
    priority: "medium",
    assignedTo: 2,
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // User endpoints
  users: {
    getAll: async (): Promise<User[]> => {
      await delay(300);
      return [...users];
    },
    getById: async (id: number): Promise<User | undefined> => {
      await delay(200);
      return users.find((u) => u.id === id);
    },
    create: async (user: Omit<User, "id">): Promise<User> => {
      await delay(300);
      const newUser = { ...user, id: users.length + 1 };
      users.push(newUser);
      return newUser;
    },
    update: async (
      id: number,
      data: Partial<User>
    ): Promise<User | undefined> => {
      await delay(300);
      const index = users.findIndex((u) => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...data };
        return users[index];
      }
      return undefined;
    },
    delete: async (id: number): Promise<boolean> => {
      await delay(200);
      const index = users.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.splice(index, 1);
        return true;
      }
      return false;
    },
  },

  // Product endpoints
  products: {
    getAll: async (): Promise<Product[]> => {
      await delay(300);
      return [...products];
    },
    getById: async (id: number): Promise<Product | undefined> => {
      await delay(200);
      return products.find((p) => p.id === id);
    },
    getByCategory: async (category: string): Promise<Product[]> => {
      await delay(250);
      return products.filter((p) => p.category === category);
    },
    search: async (query: string): Promise<Product[]> => {
      await delay(300);
      const lowerQuery = query.toLowerCase();
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
      );
    },
  },

  // Task endpoints
  tasks: {
    getAll: async (): Promise<Task[]> => {
      await delay(300);
      return [...tasks];
    },
    getById: async (id: number): Promise<Task | undefined> => {
      await delay(200);
      return tasks.find((t) => t.id === id);
    },
    getByUser: async (userId: number): Promise<Task[]> => {
      await delay(250);
      return tasks.filter((t) => t.assignedTo === userId);
    },
    create: async (task: Omit<Task, "id">): Promise<Task> => {
      await delay(300);
      const newTask = { ...task, id: tasks.length + 1 };
      tasks.push(newTask);
      return newTask;
    },
    toggleComplete: async (id: number): Promise<Task | undefined> => {
      await delay(200);
      const task = tasks.find((t) => t.id === id);
      if (task) {
        task.completed = !task.completed;
        return { ...task };
      }
      return undefined;
    },
    delete: async (id: number): Promise<boolean> => {
      await delay(200);
      const index = tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        tasks.splice(index, 1);
        return true;
      }
      return false;
    },
  },
};

export default mockApi;
