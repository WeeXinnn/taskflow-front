import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import TaskForm from "./pages/TaskForm";
import Layout from "./components/Layout";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth(); // Get the authentication token from the AuthContext
  return token ? children : <Navigate to="/login" />; // If user is authenticated, render the children components, otherwise redirect to login page
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />{" "}
          {/* Route for the login page */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {" "}
            {/* Protected route for the main layout */}
            <Route index element={<Dashboard />} />{" "}
            {/* Default route for the dashboard */}
            <Route path="tasks" element={<Tasks />} />{" "}
            {/* Route for the tasks list */}
            <Route path="tasks/new" element={<TaskForm />} />{" "}
            {/* Route for creating a new task */}
            <Route path="tasks/:id/edit" element={<TaskForm />} />{" "}
            {/* Route for editing an existing task */}
          </Route>
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold text-slate-800">404</h1>
                <p className="text-slate-500 mt-2">Page not found</p>
                <a href="/" className="mt-4 text-indigo-500 hover:underline">
                  Go home
                </a>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
