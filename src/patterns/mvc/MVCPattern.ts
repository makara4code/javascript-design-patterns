/**
 * MVC (Model-View-Controller) PATTERN
 *
 * MVC separates an application into three interconnected components:
 * - Model: Manages data, logic, and rules of the application
 * - View: Visual representation of the model (UI)
 * - Controller: Handles user input and updates Model/View accordingly
 *
 * Flow: User → Controller → Model → View → User
 *
 * Benefits:
 * - Separation of concerns
 * - Parallel development
 * - Code reusability
 * - Easier testing
 */

import { mockApi } from "../../api/mockApi";

// ============================================
// MODEL - Data and Business Logic
// ============================================

export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

export type ModelChangeListener = () => void;

export class TodoModel {
  private todos: TodoItem[] = [];
  private listeners: Set<ModelChangeListener> = new Set();
  private idCounter = 0;

  // Observer pattern for model changes
  addChangeListener(listener: ModelChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  // CRUD Operations
  async loadFromApi(): Promise<void> {
    const tasks = await mockApi.tasks.getAll();
    this.todos = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      priority: task.priority,
      createdAt: new Date(),
    }));
    this.idCounter = Math.max(...this.todos.map((t) => t.id), 0);
    this.notifyListeners();
  }

  addTodo(title: string, priority: TodoItem["priority"] = "medium"): TodoItem {
    const newTodo: TodoItem = {
      id: ++this.idCounter,
      title,
      completed: false,
      priority,
      createdAt: new Date(),
    };
    this.todos.push(newTodo);
    this.notifyListeners();
    return newTodo;
  }

  removeTodo(id: number): boolean {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  toggleTodo(id: number): TodoItem | null {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.notifyListeners();
      return todo;
    }
    return null;
  }

  updateTodo(
    id: number,
    updates: Partial<Omit<TodoItem, "id" | "createdAt">>
  ): TodoItem | null {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      Object.assign(todo, updates);
      this.notifyListeners();
      return todo;
    }
    return null;
  }

  // Query methods
  getAllTodos(): TodoItem[] {
    return [...this.todos];
  }

  getTodoById(id: number): TodoItem | undefined {
    return this.todos.find((t) => t.id === id);
  }

  getCompletedTodos(): TodoItem[] {
    return this.todos.filter((t) => t.completed);
  }

  getPendingTodos(): TodoItem[] {
    return this.todos.filter((t) => !t.completed);
  }

  getTodosByPriority(priority: TodoItem["priority"]): TodoItem[] {
    return this.todos.filter((t) => t.priority === priority);
  }

  // Statistics
  getStats(): { total: number; completed: number; pending: number } {
    return {
      total: this.todos.length,
      completed: this.getCompletedTodos().length,
      pending: this.getPendingTodos().length,
    };
  }

  clearCompleted(): number {
    const completedCount = this.getCompletedTodos().length;
    this.todos = this.todos.filter((t) => !t.completed);
    this.notifyListeners();
    return completedCount;
  }

  clearAll(): void {
    this.todos = [];
    this.notifyListeners();
  }
}

// ============================================
// CONTROLLER - Handles User Input
// ============================================

export type FilterType = "all" | "active" | "completed";

export interface ControllerState {
  filter: FilterType;
  searchQuery: string;
  sortBy: "createdAt" | "priority" | "title";
  sortOrder: "asc" | "desc";
}

export class TodoController {
  private model: TodoModel;
  private state: ControllerState = {
    filter: "all",
    searchQuery: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  };
  private stateListeners: Set<() => void> = new Set();

  constructor(model: TodoModel) {
    this.model = model;
  }

  // State management
  addStateListener(listener: () => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private notifyStateListeners(): void {
    this.stateListeners.forEach((listener) => listener());
  }

  getState(): ControllerState {
    return { ...this.state };
  }

  // User actions
  async initialize(): Promise<void> {
    await this.model.loadFromApi();
  }

  handleAddTodo(
    title: string,
    priority: TodoItem["priority"] = "medium"
  ): void {
    if (title.trim()) {
      this.model.addTodo(title.trim(), priority);
    }
  }

  handleRemoveTodo(id: number): void {
    this.model.removeTodo(id);
  }

  handleToggleTodo(id: number): void {
    this.model.toggleTodo(id);
  }

  handleUpdateTodo(
    id: number,
    updates: Partial<Omit<TodoItem, "id" | "createdAt">>
  ): void {
    this.model.updateTodo(id, updates);
  }

  handleClearCompleted(): void {
    this.model.clearCompleted();
  }

  handleClearAll(): void {
    this.model.clearAll();
  }

  // Filter and sort actions
  setFilter(filter: FilterType): void {
    this.state.filter = filter;
    this.notifyStateListeners();
  }

  setSearchQuery(query: string): void {
    this.state.searchQuery = query;
    this.notifyStateListeners();
  }

  setSortBy(sortBy: ControllerState["sortBy"]): void {
    this.state.sortBy = sortBy;
    this.notifyStateListeners();
  }

  toggleSortOrder(): void {
    this.state.sortOrder = this.state.sortOrder === "asc" ? "desc" : "asc";
    this.notifyStateListeners();
  }

  // Get filtered and sorted todos for view
  getFilteredTodos(): TodoItem[] {
    let todos = this.model.getAllTodos();

    // Apply filter
    switch (this.state.filter) {
      case "active":
        todos = todos.filter((t) => !t.completed);
        break;
      case "completed":
        todos = todos.filter((t) => t.completed);
        break;
    }

    // Apply search
    if (this.state.searchQuery) {
      const query = this.state.searchQuery.toLowerCase();
      todos = todos.filter((t) => t.title.toLowerCase().includes(query));
    }

    // Apply sort
    todos.sort((a, b) => {
      let comparison = 0;

      switch (this.state.sortBy) {
        case "createdAt":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "priority": {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return this.state.sortOrder === "asc" ? comparison : -comparison;
    });

    return todos;
  }

  getStats() {
    return this.model.getStats();
  }
}
