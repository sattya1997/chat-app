import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { SocketProvider } from "./utils/SocketProvider";
import { useLocalStorage } from "@mantine/hooks";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Home = lazy(() => import("./components/Home"));
function App() {
  const [user] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });
  return (
    <div className="App">
      <Toaster />
      <Suspense>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              element={
                <SocketProvider>
                  <ProtectedRoute user={user} />
                </SocketProvider>
              }
            >
              <Route path="/" element={<Home />} />
            </Route>
            <Route path="*" element={ <Home/>}/>
          </Routes>
      </Suspense>
    </div>
  );
}

export default App;
