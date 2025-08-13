// authService.ts
export const authService = {
  signup: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    department: string;
    accountType: string;
    gender: string;
    address: string;
  }) => {
    try {
      const response = await fetch(
        "https://689c2ef5a27b1807d282f.mockapi.io/api/v1/users/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) throw new Error("Đăng ký thất bại");
      return await response.json();
    } catch (error) {
      throw error instanceof Error ? error : new Error("Lỗi không xác định");
    }
  },

  signin: async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch(
        "https://689c2ef5a27b1807d282f.mockapi.io/api/v1/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );
      if (!response.ok) throw new Error("Đăng nhập thất bại");
      return await response.json();
    } catch (error) {
      throw error instanceof Error ? error : new Error("Lỗi không xác định");
    }
  },
};