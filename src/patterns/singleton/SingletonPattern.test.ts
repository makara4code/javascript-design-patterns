import { describe, it, expect, beforeEach } from "vitest";
import { ConfigurationManager, Logger } from "./SingletonPattern";

describe("Singleton Pattern", () => {
  describe("ConfigurationManager", () => {
    beforeEach(() => {
      // Reset configuration before each test
      ConfigurationManager.getInstance().reset();
    });

    it("should return the same instance", () => {
      const instance1 = ConfigurationManager.getInstance();
      const instance2 = ConfigurationManager.getInstance();

      expect(instance1).toBe(instance2);
    });

    it("should have default configuration values", () => {
      const config = ConfigurationManager.getInstance();

      expect(config.get("apiUrl")).toBe("https://api.example.com");
      expect(config.get("timeout")).toBe(5000);
      expect(config.get("maxRetries")).toBe(3);
    });

    it("should set and get configuration values", () => {
      const config = ConfigurationManager.getInstance();

      config.set("customKey", "customValue");
      expect(config.get("customKey")).toBe("customValue");

      config.set("timeout", 10000);
      expect(config.get("timeout")).toBe(10000);
    });

    it("should return all configuration as object", () => {
      const config = ConfigurationManager.getInstance();
      const all = config.getAll();

      expect(all).toHaveProperty("apiUrl");
      expect(all).toHaveProperty("timeout");
      expect(typeof all).toBe("object");
    });

    it("should reset to default values", () => {
      const config = ConfigurationManager.getInstance();

      config.set("timeout", 99999);
      config.reset();

      expect(config.get("timeout")).toBe(5000);
    });
  });

  describe("Logger", () => {
    beforeEach(() => {
      // Clear logs before each test
      Logger.getInstance().clearLogs();
    });

    it("should return the same instance", () => {
      const logger1 = Logger.getInstance();
      const logger2 = Logger.getInstance();

      expect(logger1).toBe(logger2);
    });

    it("should log messages at different levels", () => {
      const logger = Logger.getInstance();
      logger.setLevel("debug");

      logger.debug("Debug message");
      logger.info("Info message");
      logger.warn("Warning message");
      logger.error("Error message");

      const logs = logger.getLogs();
      expect(logs.length).toBe(4);
    });

    it("should filter logs by level", () => {
      const logger = Logger.getInstance();
      logger.setLevel("warn");

      logger.debug("Debug message");
      logger.info("Info message");
      logger.warn("Warning message");
      logger.error("Error message");

      const logs = logger.getLogs();
      // Only warn and error should be logged when level is 'warn'
      expect(logs.length).toBe(2);
      expect(logs[0].level).toBe("warn");
      expect(logs[1].level).toBe("error");
    });

    it("should include context in log entries", () => {
      const logger = Logger.getInstance();
      logger.setLevel("info");

      logger.info("Test message", "TestContext");

      const logs = logger.getLogs();
      expect(logs[0].context).toBe("TestContext");
    });

    it("should clear all logs", () => {
      const logger = Logger.getInstance();
      logger.setLevel("debug");

      logger.info("Message 1");
      logger.info("Message 2");
      logger.clearLogs();

      expect(logger.getLogs().length).toBe(0);
    });
  });
});
