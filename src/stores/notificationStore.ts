import { create } from "zustand";
import {
  deleteAllNotifications as deleteAllService,
  deleteNotification as deleteOneService,
  getAllNotifications,
  getUnreadCount,
  getUnreadNotifications,
  markAllAsRead as markAllReadService,
  markAsRead as markReadService,
} from "../services/notification";
import type { AppNotification } from "../types/notification";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;

  fetchNotifications: () => Promise<AppNotification[]>;
  fetchUnread: () => Promise<AppNotification[]>;
  fetchUnreadCount: () => Promise<number>;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteOne: (id: number) => Promise<void>;
  deleteAll: () => Promise<void>;
}

const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await getAllNotifications();
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({ notifications, unreadCount, isLoading: false });
      return notifications;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  fetchUnread: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await getUnreadNotifications();
      const unreadCount = notifications.length;
      set({ notifications, unreadCount, isLoading: false });
      return notifications;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  fetchUnreadCount: async () => {
    try {
      const unreadCount = await getUnreadCount();
      set({ unreadCount });
      return unreadCount;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  markRead: async (id) => {
    try {
      const updated = await markReadService(id);
      set((state) => ({
        notifications: state.notifications.map((n) => (n.id === id ? updated : n)),
        unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0,
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  markAllRead: async () => {
    try {
      await markAllReadService();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteOne: async (id) => {
    try {
      await deleteOneService(id);
      set((state) => {
        const target = state.notifications.find((n) => n.id === id);
        return {
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount:
            target && !target.read
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
        };
      });
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteAll: async () => {
    try {
      await deleteAllService();
      set({ notifications: [], unreadCount: 0 });
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },
}));

export default useNotificationStore;