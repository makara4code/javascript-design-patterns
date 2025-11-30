import { useState, useEffect, useCallback, useMemo } from "react";
import { UserModel, UserPresenter } from "./MVPPattern";
import type { IUserView, UserData } from "./MVPPattern";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * MVP Pattern Demo Component
 *
 * This component implements the IUserView interface.
 * The Presenter calls methods on this View to update the UI.
 */
export const MVPPatternDemo = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    users: 0,
    guests: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as UserData["role"],
    isActive: true,
  });

  const [currentFilter, setCurrentFilter] = useState<UserData["role"] | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const viewImplementation: IUserView = useMemo(
    () => ({
      showUsers: (userData: UserData[]) => setUsers(userData),
      showLoading: () => setLoading(true),
      hideLoading: () => setLoading(false),
      showError: (message: string) => {
        setError(message);
        setTimeout(() => setError(null), 3000);
      },
      clearError: () => setError(null),
      showSuccess: (message: string) => {
        setSuccess(message);
        setTimeout(() => setSuccess(null), 3000);
      },
      showAddUserForm: () => setShowAddForm(true),
      hideAddUserForm: () => setShowAddForm(false),
      showEditUserForm: (user: UserData) => {
        setEditingUser(user);
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        });
      },
      hideEditUserForm: () => setEditingUser(null),
      clearForm: () =>
        setFormData({ name: "", email: "", role: "user", isActive: true }),
      highlightUser: (id: number) => setHighlightedId(id),
      clearHighlight: () => setHighlightedId(null),
      updateStats: (newStats) => setStats(newStats),
    }),
    []
  );

  const [model] = useState(() => new UserModel());
  const presenter = useMemo(
    () => new UserPresenter(model, viewImplementation),
    [model, viewImplementation]
  );

  useEffect(() => {
    presenter.initialize();
  }, [presenter]);

  const handleAddClick = useCallback(() => {
    presenter.onAddUserClick();
  }, [presenter]);

  const handleCancelAdd = useCallback(() => {
    presenter.onCancelAddUser();
  }, [presenter]);

  const handleSubmitAdd = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      presenter.onSubmitAddUser(formData);
    },
    [presenter, formData]
  );

  const handleEditClick = useCallback(
    (id: number) => {
      presenter.onEditUserClick(id);
    },
    [presenter]
  );

  const handleCancelEdit = useCallback(() => {
    presenter.onCancelEditUser();
  }, [presenter]);

  const handleSubmitEdit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (editingUser) {
        presenter.onSubmitEditUser(editingUser.id, formData);
      }
    },
    [presenter, editingUser, formData]
  );

  const handleDelete = useCallback(
    (id: number) => {
      presenter.onDeleteUser(id);
    },
    [presenter]
  );

  const handleToggleStatus = useCallback(
    (id: number) => {
      presenter.onToggleUserStatus(id);
    },
    [presenter]
  );

  const handleFilterChange = useCallback(
    (filter: UserData["role"] | "all") => {
      setCurrentFilter(filter);
      presenter.onFilterChange(filter);
    },
    [presenter]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      presenter.onSearchChange(query);
    },
    [presenter]
  );

  const getRoleBadgeVariant = (role: UserData["role"]) => {
    switch (role) {
      case "admin":
        return "default";
      case "user":
        return "secondary";
      case "guest":
        return "outline";
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="MVP (Model-View-Presenter)"
        description="Presenter directly updates the View through an interface contract."
        badge={{ text: "Architecture", variant: "arch" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>What is MVP?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            <strong>MVP</strong> differs from MVC in that the Presenter directly
            updates the View through an interface:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>
              <strong>Model:</strong> Pure data operations (UserModel)
            </li>
            <li>
              <strong>View:</strong> Passive UI implementing IUserView interface
            </li>
            <li>
              <strong>Presenter:</strong> Contains all logic, calls View methods
            </li>
          </ul>
          <div className="flex flex-wrap items-center justify-center gap-2 py-4">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              User
            </Badge>
            <span className="text-muted-foreground">→</span>
            <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
              View
            </Badge>
            <span className="text-muted-foreground">↔</span>
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
              Presenter
            </Badge>
            <span className="text-muted-foreground">↔</span>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              Model
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground italic">
            Note: View ↔ Presenter is bidirectional. Presenter calls View
            methods to update UI.
          </p>
        </CardContent>
      </Card>

      {/* Notifications */}
      {error && (
        <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 p-4 rounded-lg text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 p-4 rounded-lg text-center">
          {success}
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-muted-foreground text-sm">Total</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">{stats.admins}</div>
            <div className="text-muted-foreground text-sm">Admins</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">{stats.users}</div>
            <div className="text-muted-foreground text-sm">Users</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold">{stats.guests}</div>
            <div className="text-muted-foreground text-sm">Guests</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Button onClick={handleAddClick}>+ Add User</Button>

            <div className="flex gap-1">
              {(["all", "admin", "user", "guest"] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={currentFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>

            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-56"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add User Form */}
      {showAddForm && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAdd} className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      role: value as UserData["role"],
                    })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button type="submit">Add User</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelAdd}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Edit User: {editingUser.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      role: value as UserData["role"],
                    })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button type="submit">Save Changes</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>User List (View receives data from Presenter)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground italic">
              No users found
            </p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    highlightedId === user.id
                      ? "border-primary ring-2 ring-primary/20"
                      : ""
                  } ${!user.isActive ? "opacity-60" : ""}`}
                  onClick={() => presenter.onUserSelect(user.id)}
                >
                  <div className="flex-1">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>

                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>

                  <Badge
                    variant={user.isActive ? "default" : "destructive"}
                    className="min-w-20 justify-center"
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(user.id);
                      }}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(user.id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle>MVP vs MVC Key Difference</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock
            language="typescript"
            code={`// VIEW INTERFACE - Contract between View and Presenter
interface IUserView {
  showUsers(users: UserData[]): void;
  showLoading(): void;
  showError(message: string): void;
  // ... other view methods
}

// PRESENTER - Directly updates View
class UserPresenter {
  constructor(model: UserModel, view: IUserView) {
    this.model = model;
    this.view = view;  // Presenter has reference to View
  }

  async initialize() {
    this.view.showLoading();  // Presenter calls View methods
    const users = await this.model.fetchUsers();
    this.view.showUsers(users);  // Direct View update
  }

  onDeleteUser(id: number) {
    this.model.deleteUser(id);
    this.view.showSuccess('User deleted');
    this.refreshView();  // Presenter controls View updates
  }
}

// VIEW - Implements interface, delegates to Presenter
const UserView = () => {
  const viewImpl: IUserView = {
    showUsers: (users) => setUsers(users),
    showLoading: () => setLoading(true),
    // ...
  };

  const presenter = new UserPresenter(model, viewImpl);

  // View delegates all actions to Presenter
  const handleDelete = (id) => presenter.onDeleteUser(id);
};`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MVPPatternDemo;
