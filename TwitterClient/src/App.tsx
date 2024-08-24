import "./App.css";
import useRouterElement from "./routers/useRouterElement";

function App() {
  const routes = useRouterElement();

  return <div>{routes}</div>;
}

export default App;
