import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        try {
            const ok = await login(email, password);
            if (ok) nav("/dashboard");
            else setErr("Invalid credentials");
        } catch (e) {
            setErr(e.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-6 rounded shadow">
                <h2 className="text-2xl mb-4">Login</h2>
                {err && <div className="text-red-600 mb-2">{err}</div>}
                <form onSubmit={submit} className="space-y-3">
                    <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className="btn btn-primary w-full" type="submit">Login</button>
                </form>
                <p className="mt-3 text-sm">
                    No account? <Link to="/register" className="text-blue-600">Register</Link>
                </p>
            </div>
        </div>
    );
}
