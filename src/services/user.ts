import axiosClient, { getErrorMessage } from "../api/axios";
import type { User } from "../types/user";

export const updateUserName = async (name: string): Promise<User> => {
  try {
    const response = await axiosClient.put<{ user: User }>("/api/users/update-name", { name });
    return response.data.user;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update name"));
  }
};

export const updateUserEmail = async (email: string): Promise<User> => {
  try {
    const response = await axiosClient.put<{ user: User }>("/api/users/update-email", { email });
    return response.data.user;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update email"));
  }
};

export const updateUserPassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<void> => {
  try {
    await axiosClient.put("/api/users/update-password", { oldPassword, newPassword });
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update password"));
  }
};

export const deleteUserAccount = async (): Promise<void> => {
  try {
    await axiosClient.delete("/api/users/delete-account");
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete account"));
  }
};