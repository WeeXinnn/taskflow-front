import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth(); // Get the user information and logout function from the AuthContext
  const navigate = useNavigate(); // Get the navigate function from react-router-dom to programmatically navigate between routes

  const handleLogout = () => {
    logout(); // Call the logout function to clear the authentication token and user information
    navigate("/login"); // Redirect the user to the login page after logging out
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col py-8 px-4 shrink-0">
        <div className="mb-10 px-2">
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            Dashboard
          </span>
          <h2 className="text-xl font-bold text-white mt-1">TaskFlow</h2>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
            ${isActive ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`
            }
          >
            <span>🏠</span> Home
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
            ${isActive ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`
            }
          >
            <span>✅</span> Tasks
          </NavLink>
        </nav>

        {/* Bottom user section */}
        <div className="mt-auto px-2">
          <div className="border-t border-slate-700 pt-4">
            <p className="text-xs text-slate-400 mb-1">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">
              {user?.name}
            </p>
            <button
              onClick={handleLogout}
              className="mt-3 w-full text-xs text-slate-400 hover:text-red-400 
              border border-slate-700 hover:border-red-400 py-2 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
