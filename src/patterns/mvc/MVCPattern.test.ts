import { describe, it, expect, vi, beforeEach } from "vitest";
import { TodoModel, TodoController } from "./MVCPattern";

describe("MVC Pattern", () => {
  describe("TodoModel", () => {
    let model: TodoModel;

    beforeEach(() => {
      model = new TodoModel();
    });

    it("should add a new todo", () => {
      const todo = model.addTodo("Test todo");

      expect(todo.title).toBe("Test todo");
      expect(todo.completed).toBe(false);
      expect(todo.priority).toBe("medium");
      expect(model.getAllTodos()).toHaveLength(1);
    });

    it("should add todo with custom priority", () => {
      const todo = model.addTodo("High priority task", "high");

      expect(todo.priority).toBe("high");
    });

    it("should remove a todo", () => {
      const todo = model.addTodo("To be removed");

      const result = model.removeTodo(todo.id);

      expect(result).toBe(true);
      expect(model.getAllTodos()).toHaveLength(0);
    });

    it("should return false when removing non-existent todo", () => {
      const result = model.removeTodo(999);

      expect(result).toBe(false);
    });

    it("should toggle todo completion", () => {
      const todo = model.addTodo("Toggle me");

      expect(todo.completed).toBe(false);

      model.toggleTodo(todo.id);
      expect(model.getTodoById(todo.id)?.completed).toBe(true);

      model.toggleTodo(todo.id);
      expect(model.getTodoById(todo.id)?.completed).toBe(false);
    });

    it("should update todo properties", () => {
      const todo = model.addTodo("Original title");

      model.updateTodo(todo.id, { title: "Updated title", priority: "high" });

      const updated = model.getTodoById(todo.id);
      expect(updated?.title).toBe("Updated title");
      expect(updated?.priority).toBe("high");
    });

    it("should notify listeners on changes", () => {
      const listener = vi.fn();
      model.addChangeListener(listener);

      model.addTodo("Test");

      expect(listener).toHaveBeenCalled();
    });

    it("should unsubscribe listeners", () => {
      const listener = vi.fn();
      const unsubscribe = model.addChangeListener(listener);

      unsubscribe();
      model.addTodo("Test");

      expect(listener).not.toHaveBeenCalled();
    });

    it("should get todo by id", () => {
      const todo = model.addTodo("Find me");

      const found = model.getTodoById(todo.id);

      expect(found).toEqual(todo);
    });

    it("should return undefined for non-existent todo", () => {
      const found = model.getTodoById(999);

      expect(found).toBeUndefined();
    });

    it("should clear all todos", () => {
      model.addTodo("Todo 1");
      model.addTodo("Todo 2");

      model.clearAll();

      expect(model.getAllTodos()).toHaveLength(0);
    });

    it("should clear completed todos", () => {
      const todo1 = model.addTodo("Completed");
      model.addTodo("Not completed");

      model.toggleTodo(todo1.id);
      model.clearCompleted();

      expect(model.getAllTodos()).toHaveLength(1);
      expect(model.getAllTodos()[0].title).toBe("Not completed");
    });
  });

  describe("TodoController", () => {
    let model: TodoModel;
    let controller: TodoController;

    beforeEach(() => {
      model = new TodoModel();
      controller = new TodoController(model);
    });

    it("should add todo through controller", () => {
      controller.handleAddTodo("New todo", "low");

      expect(model.getAllTodos()).toHaveLength(1);
      expect(model.getAllTodos()[0].priority).toBe("low");
    });

    it("should not add empty todo", () => {
      controller.handleAddTodo("", "medium");
      controller.handleAddTodo("   ", "medium");

      expect(model.getAllTodos()).toHaveLength(0);
    });

    it("should toggle todo through controller", () => {
      const todo = model.addTodo("Toggle me");

      controller.handleToggleTodo(todo.id);

      expect(model.getTodoById(todo.id)?.completed).toBe(true);
    });

    it("should set and apply filter", () => {
      model.addTodo("Active todo");
      const completedTodo = model.addTodo("Completed todo");
      model.toggleTodo(completedTodo.id);

      controller.setFilter("active");
      expect(controller.getFilteredTodos()).toHaveLength(1);
      expect(controller.getFilteredTodos()[0].title).toBe("Active todo");

      controller.setFilter("completed");
      expect(controller.getFilteredTodos()).toHaveLength(1);
      expect(controller.getFilteredTodos()[0].title).toBe("Completed todo");

      controller.setFilter("all");
      expect(controller.getFilteredTodos()).toHaveLength(2);
    });

    it("should search todos", () => {
      model.addTodo("Learn TypeScript");
      model.addTodo("Learn React");
      model.addTodo("Build project");

      controller.setSearchQuery("Learn");

      const filtered = controller.getFilteredTodos();
      expect(filtered).toHaveLength(2);
    });

    it("should get stats", () => {
      model.addTodo("Todo 1");
      const todo2 = model.addTodo("Todo 2");
      model.addTodo("Todo 3");
      model.toggleTodo(todo2.id);

      const stats = controller.getStats();

      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(2);
    });
  });
});
