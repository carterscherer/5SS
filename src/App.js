import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Pending from "./components/Pending";
import Bulletin from "./components/Bulletin";
import Contact from "./components/Contact";
import Lockpage from "./components/Lockpage";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

import { AuthProvider } from "./context/authContext";
import { useRoutes, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";

// Define ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { userLoggedIn, isApproved } = useAuth();

  if (!userLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (!isApproved) {
    return <Navigate to="/pending" />;
  }

  return children;
};

const AppRoutes = () => {
  const { userLoggedIn, isApproved, loading } = useAuth();

  // Define routes array before using useRoutes
  const routesArray = [
    {
      path: "/",
      element: userLoggedIn
        ? (isApproved ? <Navigate to="/menu" /> : <Pending />)
        : <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: userLoggedIn
        ? (isApproved ? <Navigate to="/menu" /> : <Pending />)
        : <Login />,
    },
    {
      path: "/register",
      element: userLoggedIn
        ? (isApproved ? <Navigate to="/menu" /> : <Pending />)
        : <Register />,
    },
    {
      path: "/pending",
      element: userLoggedIn
        ? (isApproved ? <Navigate to="/menu" /> : <Pending />)
        : <Navigate to="/login" />,
    },
    {
      path: "/menu",
      element: userLoggedIn
        ? (isApproved ? <Menu /> : <Navigate to="/pending" />)
        : <Navigate to="/login" />,
    },
    {
      path: "/home",
      element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
      path: "/bulletin",
      element: <ProtectedRoute><Bulletin /></ProtectedRoute>,
    },
    {
      path: "/contact",
      element: <ProtectedRoute><Contact /></ProtectedRoute>,
    },
    {
      path: "/38bW9E04dBO8fWKE0m",
      element: <Lockpage />,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    }
  ];

  // Use useRoutes after defining routes array
  const element = useRoutes(routesArray);

  if (loading) {
    return null; // or a loading spinner
  }

  return element;
};

function App() {
  return (
    <AuthProvider>
      <div>
        <Header />
        <AppRoutes />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;