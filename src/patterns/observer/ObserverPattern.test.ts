import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventEmitter, ObservableStore } from "./ObserverPattern";

describe("Observer Pattern", () => {
  describe("EventEmitter", () => {
    let emitter: EventEmitter;

    beforeEach(() => {
      emitter = new EventEmitter();
    });

    it("should subscribe and receive events", () => {
      const callback = vi.fn();

      emitter.on("test", callback);
      emitter.emit("test", { data: "hello" });

      expect(callback).toHaveBeenCalledWith({ data: "hello" });
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should allow multiple subscribers", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      emitter.on("test", callback1);
      emitter.on("test", callback2);
      emitter.emit("test", "data");

      expect(callback1).toHaveBeenCalledWith("data");
      expect(callback2).toHaveBeenCalledWith("data");
    });

    it("should unsubscribe using returned function", () => {
      const callback = vi.fn();

      const unsubscribe = emitter.on("test", callback);
      emitter.emit("test", "first");

      unsubscribe();
      emitter.emit("test", "second");

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith("first");
    });

    it("should unsubscribe using off method", () => {
      const callback = vi.fn();

      emitter.on("test", callback);
      emitter.off("test", callback);
      emitter.emit("test", "data");

      expect(callback).not.toHaveBeenCalled();
    });

    it("should handle once subscriptions", () => {
      const callback = vi.fn();

      emitter.once("test", callback);
      emitter.emit("test", "first");
      emitter.emit("test", "second");

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith("first");
    });

    it("should count listeners correctly", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      expect(emitter.listenerCount("test")).toBe(0);

      emitter.on("test", callback1);
      expect(emitter.listenerCount("test")).toBe(1);

      emitter.on("test", callback2);
      expect(emitter.listenerCount("test")).toBe(2);

      emitter.off("test", callback1);
      expect(emitter.listenerCount("test")).toBe(1);
    });

    it("should remove all listeners for an event", () => {
      emitter.on("test1", vi.fn());
      emitter.on("test1", vi.fn());
      emitter.on("test2", vi.fn());

      emitter.removeAllListeners("test1");

      expect(emitter.listenerCount("test1")).toBe(0);
      expect(emitter.listenerCount("test2")).toBe(1);
    });

    it("should remove all listeners when no event specified", () => {
      emitter.on("test1", vi.fn());
      emitter.on("test2", vi.fn());

      emitter.removeAllListeners();

      expect(emitter.listenerCount("test1")).toBe(0);
      expect(emitter.listenerCount("test2")).toBe(0);
    });
  });

  describe("ObservableStore", () => {
    it("should initialize with initial state", () => {
      const store = new ObservableStore({ count: 0 });

      expect(store.getState()).toEqual({ count: 0 });
    });

    it("should update state with object", () => {
      const store = new ObservableStore({ count: 0 });

      store.setState({ count: 5 });

      expect(store.getState()).toEqual({ count: 5 });
    });

    it("should update state with function", () => {
      const store = new ObservableStore({ count: 0 });

      store.setState((prev) => ({ count: prev.count + 1 }));

      expect(store.getState()).toEqual({ count: 1 });
    });

    it("should notify observers on state change", () => {
      const store = new ObservableStore({ count: 0 });
      const observer = { update: vi.fn() };

      store.subscribe(observer);
      store.setState({ count: 1 });

      expect(observer.update).toHaveBeenCalledWith({ count: 1 });
    });

    it("should not notify unsubscribed observers on state changes", () => {
      const store = new ObservableStore({ count: 0 });
      const observer = { update: vi.fn() };

      store.subscribe(observer);
      // subscribe immediately notifies with current state
      expect(observer.update).toHaveBeenCalledTimes(1);

      store.unsubscribe(observer);
      store.setState({ count: 1 });

      // Should still only have been called once (from subscribe)
      expect(observer.update).toHaveBeenCalledTimes(1);
    });

    it("should notify multiple observers", () => {
      const store = new ObservableStore({ count: 0 });
      const observer1 = { update: vi.fn() };
      const observer2 = { update: vi.fn() };

      store.subscribe(observer1);
      store.subscribe(observer2);
      store.setState({ count: 1 });

      expect(observer1.update).toHaveBeenCalledWith({ count: 1 });
      expect(observer2.update).toHaveBeenCalledWith({ count: 1 });
    });
  });
});
