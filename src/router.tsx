import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/layout";
import { Introduction } from "@/patterns/Introduction";
import { ModulePatternDemo } from "@/patterns/module/ModulePatternDemo";
import { PrototypePatternDemo } from "@/patterns/prototype/PrototypePatternDemo";
import { ObserverPatternDemo } from "@/patterns/observer/ObserverPatternDemo";
import { SingletonPatternDemo } from "@/patterns/singleton/SingletonPatternDemo";
import { MVCPatternDemo } from "@/patterns/mvc/MVCPatternDemo";
import { MVPPatternDemo } from "@/patterns/mvp/MVPPatternDemo";
import { MVVMPatternDemo } from "@/patterns/mvvm/MVVMPatternDemo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Introduction />,
      },
      {
        path: "patterns",
        children: [
          {
            path: "module",
            element: <ModulePatternDemo />,
          },
          {
            path: "prototype",
            element: <PrototypePatternDemo />,
          },
          {
            path: "observer",
            element: <ObserverPatternDemo />,
          },
          {
            path: "singleton",
            element: <SingletonPatternDemo />,
          },
          {
            path: "mvc",
            element: <MVCPatternDemo />,
          },
          {
            path: "mvp",
            element: <MVPPatternDemo />,
          },
          {
            path: "mvvm",
            element: <MVVMPatternDemo />,
          },
        ],
      },
    ],
  },
]);

// Route configuration for navigation
export const navConfig = {
  intro: [{ path: "/", label: "Introduction" }],
  js: [
    { path: "/patterns/module", label: "Module" },
    { path: "/patterns/prototype", label: "Prototype" },
    { path: "/patterns/observer", label: "Observer" },
    { path: "/patterns/singleton", label: "Singleton" },
  ],
  arch: [
    { path: "/patterns/mvc", label: "MVC" },
    { path: "/patterns/mvp", label: "MVP" },
    { path: "/patterns/mvvm", label: "MVVM" },
  ],
} as const;
