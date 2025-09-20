import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NoteEditor from "./pages/NoteEditor";
import { useAuth } from "./auth/AuthContext";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/notes/new"
          element={
            <Protected>
              <NoteEditor />
            </Protected>
          }
        />
        <Route
          path="/notes/:id"
          element={
            <Protected>
              <NoteEditor />
            </Protected>
          }
        />
      </Routes>
    </div>
  );
}
