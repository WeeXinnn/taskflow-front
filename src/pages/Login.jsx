import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Get the login function from the AuthContext to update authentication state
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true); // Set loading state to true when starting the login process
    setError(""); // Clear any previous error messages
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        form,
      ); // Send a POST request to the login endpoint with the form data
      login(data.user, data.token); // Update the authentication state with the received token and user information
      navigate("/"); // Redirect the user to the home page after successful login
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed"); // Set an error message for invalid credentials
    } finally {
      setLoading(false); // Set loading state to false when the login process is complete
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">TaskFlow</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Sign in to your dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
          {error && (
            <div
              className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 
              text-red-400 rounded-lg text-sm"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@test.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 text-white 
                  placeholder-slate-500 rounded-lg px-4 py-3 text-sm 
                  focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-slate-900 border border-slate-600 text-white 
                  placeholder-slate-500 rounded-lg px-4 py-3 text-sm 
                  focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 
                text-white font-semibold py-3 rounded-lg transition-all mt-2 text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
