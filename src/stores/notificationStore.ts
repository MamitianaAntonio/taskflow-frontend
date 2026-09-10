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

const PAGE_SIZE = 20;

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;

  fetchNotifications: (reset?: boolean) => Promise<void>;
  fetchUnread: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  loadMoreUnread: () => Promise<void>;
  fetchUnreadCount: () => Promise<number>;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteOne: (id: number) => Promise<void>;
  deleteAll: () => Promise<void>;
  reset: () => void;
}

const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  total: 0,
  hasMore: false,
  isLoading: false,
  isLoadingMore: false,
  error: null,

  fetchNotifications: async (reset = true) => {
    if (reset) {
      set({ isLoading: true, error: null });
    }
    try {
      const { notifications, total } = await getAllNotifications(PAGE_SIZE, 0);
      const unreadCount = notifications.filter((n) => !n.read).length;
      set({
        notifications,
        total,
        unreadCount,
        hasMore: notifications.length < total,
        isLoading: false,
        isLoadingMore: false,
      });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  fetchUnread: async (reset = true) => {
    if (reset) {
      set({ isLoading: true, error: null });
    }
    try {
      const { notifications, total } = await getUnreadNotifications(PAGE_SIZE, 0);
      set({
        notifications,
        total,
        unreadCount: notifications.length,
        hasMore: notifications.length < total,
        isLoading: false,
        isLoadingMore: false,
      });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
      throw error;
    }
  },

  loadMore: async () => {
    const { notifications, hasMore, isLoadingMore } = get();
    if (!hasMore || isLoadingMore) return;
    set({ isLoadingMore: true });
    try {
      const { notifications: more, total } = await getAllNotifications(PAGE_SIZE, notifications.length);
      const newNotifications = [...notifications, ...more];
      set({
        notifications: newNotifications,
        total,
        hasMore: newNotifications.length < total,
        isLoadingMore: false,
      });
    } catch (error) {
      set({ error: error as Error, isLoadingMore: false });
      throw error;
    }
  },

  loadMoreUnread: async () => {
    const { notifications, hasMore, isLoadingMore } = get();
    if (!hasMore || isLoadingMore) return;
    set({ isLoadingMore: true });
    try {
      const { notifications: more, total } = await getUnreadNotifications(PAGE_SIZE, notifications.length);
      const newNotifications = [...notifications, ...more];
      set({
        notifications: newNotifications,
        total,
        unreadCount: newNotifications.length,
        hasMore: newNotifications.length < total,
        isLoadingMore: false,
      });
    } catch (error) {
      set({ error: error as Error, isLoadingMore: false });
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
      set((state) => {
        const target = state.notifications.find((n) => n.id === id);
        return {
          notifications: state.notifications.map((n) => (n.id === id ? updated : n)),
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
          total: Math.max(0, state.total - 1),
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
      set({ notifications: [], unreadCount: 0, total: 0, hasMore: false });
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  reset: () => {
    set({ notifications: [], unreadCount: 0, total: 0, hasMore: false, isLoading: false, isLoadingMore: false, error: null });
  },
}));

export default useNotificationStore;
