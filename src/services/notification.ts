import axiosClient from "../api/axios";
import type { AppNotification } from "../types/notification";

export interface PaginatedNotifications {
  notifications: AppNotification[];
  total: number;
}

export const getAllNotifications = (limit = 20, offset = 0): Promise<PaginatedNotifications> =>
  axiosClient
    .get<{ notifications: AppNotification[]; total: number }>("/api/notifications", {
      params: { limit, offset },
    })
    .then((r) => ({ notifications: r.data.notifications, total: r.data.total }));

export const getUnreadNotifications = (limit = 20, offset = 0): Promise<PaginatedNotifications> =>
  axiosClient
    .get<{ notifications: AppNotification[]; total: number }>("/api/notifications/unread", {
      params: { limit, offset },
    })
    .then((r) => ({ notifications: r.data.notifications, total: r.data.total }));

export const getUnreadCount = (): Promise<number> =>
  axiosClient.get<{ count: number }>("/api/notifications/unread/count").then((r) => r.data.count);

export const markAsRead = (id: number): Promise<AppNotification> =>
  axiosClient
    .patch<{ notification: AppNotification }>(`/api/notifications/${id}/read`)
    .then((r) => r.data.notification);

export const markAllAsRead = async (): Promise<void> => {
  await axiosClient.patch("/api/notifications/read-all");
};

export const deleteNotification = async (id: number): Promise<void> => {
  await axiosClient.delete(`/api/notifications/${id}`);
};

export const deleteAllNotifications = async (): Promise<void> => {
  await axiosClient.delete("/api/notifications/delete-all");
};
