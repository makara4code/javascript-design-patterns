/**
 * MVP (Model-View-Presenter) PATTERN
 *
 * MVP is similar to MVC but with a key difference:
 * - The Presenter has a reference to the View (through an interface)
 * - The Presenter updates the View directly
 * - View is passive and doesn't know about Model
 *
 * Flow: User → View → Presenter → Model → Presenter → View
 *
 * Benefits:
 * - Better testability (Presenter can be tested without View)
 * - Clear separation between View and business logic
 * - View is passive (only handles UI rendering)
 * - One-to-one relationship between View and Presenter
 */

import { mockApi } from "../../api/mockApi";

// ============================================
// MODEL - Pure Data and Data Operations
// ============================================

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  isActive: boolean;
}

export class UserModel {
  private users: UserData[] = [];

  async fetchUsers(): Promise<UserData[]> {
    const apiUsers = await mockApi.users.getAll();
    this.users = apiUsers.map((user) => ({
      ...user,
      isActive: true,
    }));
    return this.users;
  }

  getUsers(): UserData[] {
    return [...this.users];
  }

  getUserById(id: number): UserData | undefined {
    return this.users.find((u) => u.id === id);
  }

  addUser(user: Omit<UserData, "id">): UserData {
    const newUser: UserData = {
      ...user,
      id: Math.max(...this.users.map((u) => u.id), 0) + 1,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(
    id: number,
    updates: Partial<Omit<UserData, "id">>
  ): UserData | undefined {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      Object.assign(user, updates);
      return user;
    }
    return undefined;
  }

  deleteUser(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  searchUsers(query: string): UserData[] {
    const lowerQuery = query.toLowerCase();
    return this.users.filter(
      (u) =>
        u.name.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery)
    );
  }

  filterByRole(role: UserData["role"] | "all"): UserData[] {
    if (role === "all") return this.users;
    return this.users.filter((u) => u.role === role);
  }
}

// ============================================
// VIEW INTERFACE - Contract for View
// ============================================

export interface IUserView {
  // Display methods
  showUsers(users: UserData[]): void;
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
  clearError(): void;
  showSuccess(message: string): void;

  // Form methods
  showAddUserForm(): void;
  hideAddUserForm(): void;
  showEditUserForm(user: UserData): void;
  hideEditUserForm(): void;
  clearForm(): void;

  // Selection
  highlightUser(id: number): void;
  clearHighlight(): void;

  // Stats
  updateStats(stats: {
    total: number;
    admins: number;
    users: number;
    guests: number;
  }): void;
}

// ============================================
// PRESENTER - Business Logic and View Updates
// ============================================

export class UserPresenter {
  private model: UserModel;
  private view: IUserView;
  private currentFilter: UserData["role"] | "all" = "all";
  private searchQuery: string = "";

  constructor(model: UserModel, view: IUserView) {
    this.model = model;
    this.view = view;
  }

  // Initialize
  async initialize(): Promise<void> {
    this.view.showLoading();
    try {
      await this.model.fetchUsers();
      this.refreshView();
      this.view.hideLoading();
    } catch {
      this.view.hideLoading();
      this.view.showError("Failed to load users");
    }
  }

  // Refresh view with current filters
  private refreshView(): void {
    let users = this.model.filterByRole(this.currentFilter);

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    this.view.showUsers(users);
    this.updateStats();
  }

  private updateStats(): void {
    const allUsers = this.model.getUsers();
    this.view.updateStats({
      total: allUsers.length,
      admins: allUsers.filter((u) => u.role === "admin").length,
      users: allUsers.filter((u) => u.role === "user").length,
      guests: allUsers.filter((u) => u.role === "guest").length,
    });
  }

  // User actions
  onAddUserClick(): void {
    this.view.showAddUserForm();
  }

  onCancelAddUser(): void {
    this.view.hideAddUserForm();
    this.view.clearForm();
  }

  onSubmitAddUser(userData: Omit<UserData, "id">): void {
    try {
      this.model.addUser(userData);
      this.view.hideAddUserForm();
      this.view.clearForm();
      this.view.showSuccess("User added successfully");
      this.refreshView();
    } catch {
      this.view.showError("Failed to add user");
    }
  }

  onEditUserClick(id: number): void {
    const user = this.model.getUserById(id);
    if (user) {
      this.view.showEditUserForm(user);
    }
  }

  onCancelEditUser(): void {
    this.view.hideEditUserForm();
    this.view.clearForm();
  }

  onSubmitEditUser(id: number, updates: Partial<Omit<UserData, "id">>): void {
    try {
      this.model.updateUser(id, updates);
      this.view.hideEditUserForm();
      this.view.clearForm();
      this.view.showSuccess("User updated successfully");
      this.refreshView();
    } catch {
      this.view.showError("Failed to update user");
    }
  }

  onDeleteUser(id: number): void {
    try {
      this.model.deleteUser(id);
      this.view.showSuccess("User deleted");
      this.refreshView();
    } catch {
      this.view.showError("Failed to delete user");
    }
  }

  onToggleUserStatus(id: number): void {
    const user = this.model.getUserById(id);
    if (user) {
      this.model.updateUser(id, { isActive: !user.isActive });
      this.refreshView();
    }
  }

  // Filter and search
  onFilterChange(filter: UserData["role"] | "all"): void {
    this.currentFilter = filter;
    this.refreshView();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.refreshView();
  }

  onUserSelect(id: number): void {
    this.view.highlightUser(id);
  }

  onClearSelection(): void {
    this.view.clearHighlight();
  }

  // Getters for view state
  getCurrentFilter(): UserData["role"] | "all" {
    return this.currentFilter;
  }

  getSearchQuery(): string {
    return this.searchQuery;
  }
}
