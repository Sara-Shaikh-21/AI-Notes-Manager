import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../lib/api"; // ✅ updated import

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
        const res = await api.login({ email, password }); // ✅ use named export
        if (res?.token) {
            setUser({ ...res.user, token: res.token });
            return true;
        }
        return false;
    };

    const register = async (email, password) => {
        const res = await api.register({ email, password }); // ✅ use named export
        return res;
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
