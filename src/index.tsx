import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { PageScreen } from "./routes/screen";
import { PageControl } from "./routes/control";
import { PageRemote } from "./routes/remote";
import { PageModerator } from "./routes/moderator";

const router = createBrowserRouter([
  {
    path: "/control",
    element: <PageControl />,
  },
  {
    path: "/screenview",
    element: <PageScreen />,
  },
  {
    path: "/moderator",
    element: <PageModerator />,
  },
  {
    path: "/",
    element: <PageRemote />,
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
