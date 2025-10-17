"use client";

import { create } from "zustand";
import Cookies from "js-cookie";
import { toast } from "sonner";
import ApiHelper from "@/lib/api-helper";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: Cookies.get("token") || null,
  loading: false,

  login: async (credentials) => {
    const api = new ApiHelper("login");
    set({ loading: true });

    try {
      const res = await new Promise<any>((resolve, reject) => {
        api.post("", credentials, set, {}, (response: any) => {
          if (api.isSuccess(response)) resolve(response);
          else reject(response);
        }, "Login");
      });

      const token = res.data?.data?.token;
      const user = res.data?.data?.user || null;

      if (token) {
        Cookies.set("token", token);
        set({ user, token, loading: false });
        toast.success("Login berhasil");
        return true;
      } else {
        toast.error("Token tidak ditemukan");
        set({ loading: false });
        return false;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Login gagal");
      set({ loading: false });
      return false;
    }
  },

  logout: () => {
    Cookies.remove("token");
    set({ user: null, token: null });
    toast.success("Logout berhasil");
    if (typeof window !== "undefined") window.location.href = "/login";
  },

  checkAuth: () => {
    const token = Cookies.get("token");
    if (!token) {
      get().logout();
      return false;
    }
    return true;
  },
}));
