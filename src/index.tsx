import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { PageScreen } from "./routes/screen";
import { PageControl } from "./routes/control";
import { PageRemote } from "./routes/remote";
import { panelists, topics, scores } from "./helpers/fakedata";

const router = createBrowserRouter([
  {
    path: "/control",
    element: <PageControl>children</PageControl>,
  },
  {
    path: "/screenview",
    element: (
      <PageScreen
        panelists={panelists}
        topics={topics}
        currentTopicId="1"
        scores={scores}
      />
    ),
  },
  {
    path: "/",
    element: (
      <PageRemote
        panelists={panelists}
        topics={topics}
        currentTopicId="1"
        scores={scores}
      />
    ),
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
