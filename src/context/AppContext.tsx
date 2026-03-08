"use client";
import { AppContextType, AppProviderProps, User } from "@/lib/type";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";

export const Utils_Service = "http://localhost:5002";
export const Auth_Service = "http://localhost:5001";
export const User_Service = "http://localhost:5003";
export const Job_Service = "http://localhost:5004";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(true);

  const token = Cookies.get("token");
  async function fetchUser() {
    try {
      const { data } = await axios.get(`${User_Service}/api/users/myProfile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(`Error in fetchUser :, ${error}`);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  async function logOutUser() {
    Cookies.set("token", "");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        btnLoading,
        isAuth,
        setUser,
        setLoading,
        setIsAuth,
        logOutUser,
      }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }
  return context;
};
