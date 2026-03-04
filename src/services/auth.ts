import axiosClient from "../api/axios";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// function to handle user login
export const signUp = async (data: SignUpData) => {
  try {
    const response = await axiosClient.post("/api/users/register", data);

    if (response.status === 201) {
      return {
        success: true,
        status: response.status,
        message: response.data.message,
      };
    }
  } catch (error) {
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
      localStorage.setItem("user", JSON.stringify(user));
      return {
        success: true,
        status: response.status,
        message: response.data.message,
      };
    }
  } catch (error) {
    throw new Error("Failed to login");
  }
}
