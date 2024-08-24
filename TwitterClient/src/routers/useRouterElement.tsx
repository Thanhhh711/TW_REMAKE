import { useRoutes } from "react-router-dom";
import { path } from "../constants/path";
import Home from "../pages/Home";
import Login from "../pages/Login";

export default function useRouterElement() {
  const routesElement = useRoutes([
    {
      path: path.home,
      element: <Home />,
      index: true,
    },
    {
      path: path.login,
      element: <Login />,
    },
  ]);

  return routesElement;
}
