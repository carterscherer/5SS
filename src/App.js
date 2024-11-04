import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";
import Home from "./components/Home";
import Lockpage from "./components/Lockpage";
import { AuthProvider } from "./context/authContext";
import { useRoutes } from "react-router-dom";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/38bW9E04dBO8fWKE0m",
      element: <Lockpage />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      {/* <Header /> */}
      <div>{routesElement}</div>
    </AuthProvider>
  );
}

export default App;