import axiosClient from "../api/axios";
import useUserStore from "../stores/userStore";
import toast from "react-hot-toast";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// function to handle user signup
export const signUp = async (data: SignUpData) => {
  try {
    const response = await axiosClient.post("/api/users/register", data);

    if (response.status === 201) {
      toast.success("Signup successful!");
      return {
        success: true,
        status: response.status,
        message: response.data.message,
      };
    }
  } catch (error) {
    toast.error("Signup failed. Please try again.");
    console.log("Signup error:", error);
    throw new Error("Failed to sign up");
  }
};

// function to handle user login
export const login = async (data: LoginData) => {
  try {
    const response = await axiosClient.post("/api/users/login", data);

    if (response.status === 200) {
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      if (user) {
        useUserStore.getState().setUser(user);
      }
      toast.success("Login successful!");
      return {
        success: true,
        status: response.status,
        message: response.data.message,
      };
    }
  } catch (error : any) {
    throw new Error(error.response?.data?.message || "Failed to log in");
  }
}
