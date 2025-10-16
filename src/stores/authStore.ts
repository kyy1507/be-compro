"use client";

import { create } from "zustand";
import Cookies from "js-cookie";
import ApiHelper from "@/lib/apiHelper";
import type { User } from "@/types/user";

const apiHelper = new ApiHelper("");

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (formData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  clearLoginData: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: Cookies.get("token") || null,
  loading: false,
  isAuthenticated: !!Cookies.get("token"),

  login: async (formData) => {
    set({ loading: true });
    try {
      const res = await apiHelper.post(
        "login",
        formData,
        (v) => set({ loading: v }),
        { headers: { "Content-Type": "application/json" } },
        "Login"
      );

      if (res?.data?.data?.token) {
        const token = res.data.data.token;
        const user = res.data.data.user;
        Cookies.set("token", token);
        set({ token, user, isAuthenticated: true });
        return true;
      }

      return false;
    } catch (err) {
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const res = await apiHelper.get("logout", {}, (v) => set({ loading: v }));
      if (res?.data?.code === 200) {
        Cookies.remove("token");
        set({ token: null, user: null, isAuthenticated: false });
      }
    } finally {
      set({ loading: false });
    }
  },

  getProfile: async () => {
    const token = Cookies.get("token");
    if (!token) return;

    set({ loading: true });
    try {
      const res = await apiHelper.get("user/current-profile", {}, (v) => set({ loading: v }));
      if (res?.data?.data) {
        set({ user: res.data.data, isAuthenticated: true });
      }
    } finally {
      set({ loading: false });
    }
  },

  clearLoginData: () => {
    Cookies.remove("token");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
