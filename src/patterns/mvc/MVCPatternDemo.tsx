import { useState, useEffect, useCallback } from "react";
import { TodoModel, TodoController } from "./MVCPattern";
import type { TodoItem, FilterType } from "./MVCPattern";
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
import { Checkbox } from "@/components/ui/checkbox";

/**
 * MVC Pattern Demo Component
 *
 * This component acts as the VIEW in MVC pattern.
 * It renders the UI based on Model data and delegates user actions to Controller.
 */
export const MVCPatternDemo = () => {
  const [model] = useState(() => new TodoModel());
  const [controller] = useState(() => new TodoController(model));

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [controllerState, setControllerState] = useState(controller.getState());

  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoPriority, setNewTodoPriority] =
    useState<TodoItem["priority"]>("medium");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const updateView = useCallback(() => {
    setTodos(controller.getFilteredTodos());
    setStats(controller.getStats());
    setControllerState(controller.getState());
  }, [controller]);

  useEffect(() => {
    const unsubModel = model.addChangeListener(updateView);
    const unsubController = controller.addStateListener(updateView);
    controller.initialize();

    return () => {
      unsubModel();
      unsubController();
    };
  }, [model, controller, updateView]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    controller.handleAddTodo(newTodoTitle, newTodoPriority);
    setNewTodoTitle("");
  };

  const handleToggle = (id: number) => {
    controller.handleToggleTodo(id);
  };

  const handleDelete = (id: number) => {
    controller.handleRemoveTodo(id);
  };

  const handleEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleSaveEdit = (id: number) => {
    controller.handleUpdateTodo(id, { title: editingTitle });
    setEditingId(null);
    setEditingTitle("");
  };

  const handlePriorityChange = (id: number, priority: TodoItem["priority"]) => {
    controller.handleUpdateTodo(id, { priority });
  };

  const getPriorityColor = (priority: TodoItem["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="MVC (Model-View-Controller)"
        description="Separates application into Model, View, and Controller components."
        badge={{ text: "Architecture", variant: "arch" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>What is MVC?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            <strong>MVC</strong> separates an application into three components:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>
              <strong>Model:</strong> Manages data and business logic
              (TodoModel)
            </li>
            <li>
              <strong>View:</strong> Visual representation (This React
              component)
            </li>
            <li>
              <strong>Controller:</strong> Handles user input (TodoController)
            </li>
          </ul>
          <div className="flex flex-wrap items-center justify-center gap-2 py-4">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              User
            </Badge>
            <span className="text-muted-foreground">→</span>
            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
              Controller
            </Badge>
            <span className="text-muted-foreground">→</span>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              Model
            </Badge>
            <span className="text-muted-foreground">→</span>
            <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
              View
            </Badge>
            <span className="text-muted-foreground">→</span>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              User
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-muted-foreground text-sm">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{stats.pending}</div>
            <div className="text-muted-foreground text-sm">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{stats.completed}</div>
            <div className="text-muted-foreground text-sm">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Todo Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTodo} className="flex gap-3">
            <Input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1"
            />
            <Select
              value={newTodoPriority}
              onValueChange={(value) =>
                setNewTodoPriority(value as TodoItem["priority"])
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      {/* Filter and Sort Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Sort (Controller Actions)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter:</span>
              <div className="flex gap-1">
                {(["all", "active", "completed"] as FilterType[]).map(
                  (filter) => (
                    <Button
                      key={filter}
                      variant={
                        controllerState.filter === filter
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => controller.setFilter(filter)}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  )
                )}
              </div>
            </div>

            <Input
              type="text"
              value={controllerState.searchQuery}
              onChange={(e) => controller.setSearchQuery(e.target.value)}
              placeholder="Search todos..."
              className="w-48"
            />

            <div className="flex items-center gap-2">
              <Select
                value={controllerState.sortBy}
                onValueChange={(value) =>
                  controller.setSortBy(
                    value as "createdAt" | "priority" | "title"
                  )
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Sort by Date</SelectItem>
                  <SelectItem value="priority">Sort by Priority</SelectItem>
                  <SelectItem value="title">Sort by Title</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => controller.toggleSortOrder()}
              >
                {controllerState.sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Todo List (View) */}
      <Card>
        <CardHeader>
          <CardTitle>Todo List (View - Renders Model Data)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {todos.length === 0 ? (
              <p className="text-center text-muted-foreground italic py-8">
                No todos found
              </p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${todo.completed ? "opacity-60 bg-muted/50" : "bg-background"}`}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggle(todo.id)}
                    className="h-5 w-5"
                  />

                  {editingId === todo.id ? (
                    <Input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => handleSaveEdit(todo.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSaveEdit(todo.id)
                      }
                      className="flex-1"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`flex-1 cursor-pointer ${todo.completed ? "line-through" : ""}`}
                      onDoubleClick={() => handleEdit(todo)}
                    >
                      {todo.title}
                    </span>
                  )}

                  <Badge variant={getPriorityColor(todo.priority)}>
                    {todo.priority}
                  </Badge>

                  <Select
                    value={todo.priority}
                    onValueChange={(value) =>
                      handlePriorityChange(
                        todo.id,
                        value as TodoItem["priority"]
                      )
                    }
                  >
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(todo.id)}
                  >
                    ×
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => controller.handleClearCompleted()}
            >
              Clear Completed
            </Button>
            <Button
              variant="outline"
              onClick={() => controller.handleClearAll()}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Code Example */}
      <Card>
        <CardHeader>
          <CardTitle>Code Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock
            language="typescript"
            code={`// MODEL - Data and business logic
class TodoModel {
  private todos: TodoItem[] = [];

  addTodo(title: string): TodoItem { ... }
  toggleTodo(id: number): void { ... }
  getAllTodos(): TodoItem[] { ... }
}

// CONTROLLER - Handles user input
class TodoController {
  constructor(model: TodoModel) { ... }

  handleAddTodo(title: string): void {
    this.model.addTodo(title);
  }

  getFilteredTodos(): TodoItem[] { ... }
}

// VIEW - React Component
const TodoView = () => {
  const [model] = useState(() => new TodoModel());
  const [controller] = useState(() => new TodoController(model));

  // Delegate actions to controller
  const handleAdd = () => controller.handleAddTodo(title);

  // Render model data
  return <ul>{controller.getFilteredTodos().map(...)}</ul>;
};`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MVCPatternDemo;
