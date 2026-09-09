import axiosClient from "../api/axios";
import type { AppNotification } from "../types/notification";

export const getAllNotifications = (): Promise<AppNotification[]> =>
  axiosClient
    .get<{ notifications: AppNotification[] }>("/api/notifications")
    .then((r) => r.data.notifications);

export const getUnreadNotifications = (): Promise<AppNotification[]> =>
  axiosClient
    .get<{ notifications: AppNotification[] }>("/api/notifications/unread")
    .then((r) => r.data.notifications);

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