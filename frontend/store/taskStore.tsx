import { api } from "@/lib/backendUrl";
import { create } from "zustand";

export type Status = "pending" | "progress" | "completed";

export type Priority = "low" | "medium" | "high";

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: Priority;
  status?: Status;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
}

interface TaskState {
  tasks: Task[];
  task: Task | null;
  loading: boolean;
  error: string | null;

  createTask: (data: CreateTaskData) => Promise<void>;
  getTasks: () => Promise<void>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  task: null,
  loading: false,
  error: null,

  createTask: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/api/task`, data);
      set((state) => ({
        tasks: [res.data.data, ...state.tasks],
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Error occurred during task creation";
      console.log("Error in create task store: ", error);
      set({ error: errorMessage, loading: false });
    }
  },

  getTasks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/api/task`);
      set({ tasks: res.data.data, loading: false });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Error occurred while fetching tasks";
      console.log("Error in get tasks store: ", error);
      set({ error: errorMessage, loading: false });
    }
  },

  updateTask: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/api/task/${id}`, data);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? res.data.data : task
        ),
        task: state.task?._id === id ? res.data.data : state.task,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Error occurred while updating task";
      console.log("Error in update task store: ", error);
      set({ error: errorMessage, loading: false });
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/task/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
        task: state.task?._id === id ? null : state.task,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Error occurred while deleting task";
      console.log("Error in delete task store: ", error);
      set({ error: errorMessage, loading: false });
    }
  },
}));
