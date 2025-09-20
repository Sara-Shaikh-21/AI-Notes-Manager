import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", user.token);
        } else {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }, [user]);

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        if (res?.data?.token) {
            setUser({ ...res.data.user, token: res.data.token });
            return true;
        }
        return false;
    };

    const register = async (email, password) => {
        const res = await api.post("/auth/register", { email, password });
        return res.data;
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
