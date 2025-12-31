import { api } from "@/lib/backendUrl";
import { create } from "zustand";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

interface authState {
  user: User | null;
  loading: boolean;
  error: string | null;

  signupUser: (data: SignupData) => Promise<void>;
  loginUser: (data: LoginData) => Promise<void>;
  getUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  updateProfile: (data: UpdateProfileData, id: string) => Promise<void>;
}

export const useUserStore = create<authState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signupUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/api/user/signup", data);
      console.log(res);
      set({ user: res.data.data, loading: false });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "An error occurred during signup";
      console.log("Error in signup user store: ", error);
      set({ error: errorMessage, loading: false });
    }
  },

  loginUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/api/user/login", data);
      set({ user: res.data.data, loading: false });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "An error occurred during login";
      console.log("Error in login user store: ", error);
      set({ error: errorMessage, loading: false });
    }
  },

  getUser: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/api/user/profile");
      console.log(res.data.data);
      set({ user: res.data.data, loading: false });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || "An error occurred";
      console.log("Error in get user store: ", error);
      // If unauthorized (401), clear user
      if (error?.response?.status === 401) {
        set({ user: null, error: null, loading: false });
      } else {
        set({ error: errorMessage, loading: false });
      }
    }
  },

  logoutUser: async () => {
    set({ loading: true, error: null });
    try {
      await api.post("/api/user/logout");
      set({ user: null, loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.log("error in logout store: ", error);
        set({ error: error.message, loading: false });
      }
    }
  },

  updateProfile: async (data, id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/api/user/${id}`, data);
      set({
        user: res.data.data,
        loading: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error in update profile: ", error);
        set({ error: error.message, loading: false });
      }
    }
  },

  deleteAccount: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/user/${id}`);
      set({
        user: null,
        loading: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error in delete account store: ", error);
        set({ error: error.message, loading: false });
      }
    }
  },
}));
