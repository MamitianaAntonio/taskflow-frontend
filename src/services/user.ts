import axiosClient from "../api/axios";

export const updateUserName = async (name: string) => {
  try {
    const response = await axiosClient.put("/api/users/update-name", { name });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to update name",
    );
  }
};

export const updateUserEmail = async (email: string) => {
  try {
    const response = await axiosClient.put("/api/users/update-email", { email });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to update email",
    );
  }
};

export const updateUserPassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  try {
    const response = await axiosClient.put("/api/users/update-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update password",
    );
  }
};

export const deleteUserAccount = async () => {
  try {
    const response = await axiosClient.delete("/api/users/delete-account");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to delete account",
    );
  }
};