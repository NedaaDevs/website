import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Privacy from "./components/Privacy";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/privacy",
      element: <Privacy />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
