import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Customize from "./pages/Customize";
import Index from "./pages/Index";
import CurrentUser from "./Hooks/CurrentUser";
import AssistantName from "./pages/AssistantName";

const App = () => {
  const { userData, loading } = useSelector((state) => state.user);

  return (
    <>
      <CurrentUser />


        <Routes>
          {/* Customize */}
          <Route
            path="/customize"
            element={
              userData ? <Customize /> : <Navigate to="/signup" replace />
            }
          />
             {/* Assistant Name */}
          <Route
            path="/assistant-name"
            element={
              userData ? <AssistantName/> : <Navigate to="/signup" replace />
            }
          />

          {/* Home */}
          <Route
            path="/"
            element={
              userData?.assistantName && userData?.assistantImage ? (
                <Index />
              ) : userData ? (
                <Navigate to="/customize" replace />
              ) : (
                <Navigate to="/signup" replace />
              )
            }
          />

          {/* Signup */}
          <Route
            path="/signup"
            element={
              !userData ? <SignUp /> : <Navigate to="/" replace />
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              !userData ? <LogIn /> : <Navigate to="/" replace />
            }
          />
        </Routes>
      
    </>
  );
};

export default App;

