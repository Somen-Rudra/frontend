import { createContext, useContext, useEffect, useState } from "react";
import {API} from "../config/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app mount, check if session is alive
  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    return res.data; // { success, message }
  };

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    return res.data; // triggers OTP email
  };

  const verifyOtp = async (email, otp) => {
    const res = await API.post("/auth/verify", { email, otp });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);