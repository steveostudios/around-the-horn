import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { PageScreen } from "./routes/screen";
import { PageControl } from "./routes/control";
import { PageRemote } from "./routes/remote";
import { panelists, topics, scores } from "./helpers/fakedata";
import { Header } from "./components/Header";

const router = createBrowserRouter([
  {
    path: "/remote",
    element: (
      <PageRemote
        panelists={panelists}
        topics={topics}
        currentTopicId="1"
        scores={scores}
      />
    ),
  },
  {
    path: "/control",
    element: <PageControl>children</PageControl>,
  },
  {
    path: "/",
    element: (
      <PageScreen
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
      <Header />
      <RouterProvider router={router} />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
