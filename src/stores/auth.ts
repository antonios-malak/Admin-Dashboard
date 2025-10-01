import { defineStore } from "pinia";
import router from "../router";
import { notify } from "@/utils/notify";
import api from "@/utils/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user") || "null"),
    loading: false,
  }),
  getters: { isLoggedIn: (s) => !!s.token },
  actions: {
    async login(email: string, password: string) {
      try {
        this.loading = true;
        const response = await api.post("/auth/login", {
          email, 
          password,
        });

        const { user, token } = response.data;
        this.token = token;
        this.user = user;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        notify("success", `Welcome back, ${user.name}!`, "Login Successful");
        router.push("/");
      } catch (error: any) {
        notify("error", error?.response?.data?.message, "Login Failed");
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    },
    async forgotPassword(email: string) {
      try {
        this.loading = true;
        await api.post("/auth/forgot-password", { email });
        notify("success", "Password reset link sent to your email", "Success");
        const param = new URLSearchParams({ email });
        router.push("/otp?" + param.toString());
      } catch (error: any) {
        notify("error", error?.response?.data?.message, "Error");
      } finally {
        this.loading = false;
        const param = new URLSearchParams({ email });
        router.push("/otp?" + param.toString());

      }
    },
    async verifyOtp(email: string, otp: string) {
      try {
        this.loading = true;
        await api.post("/auth/verify-otp", { email, otp });
        notify("success", "OTP verified successfully", "Success");
        const param = new URLSearchParams({ email });
        router.push("/resetpassword?" + param.toString());
      } catch (error: any) {
        notify("error", error?.response?.data?.message, "Error");
      } finally {
        this.loading = false;
        const param = new URLSearchParams({ email });
        console.log(param);
        router.push("/resetpassword?" + param.toString());
      }
    },
    async resetPassword (formData: object) {
      try {
        this.loading = true;
        await api.post("/auth/reset-password", formData);
        notify("success", "Password reset successfully", "Success");
        router.push("/login");
      } catch (error: any) {
        notify("error", error?.response?.data?.message, "Error");
      } finally {
        this.loading = false;
        router.push("/login");
      }
    },
    async changePassword(formData: object) {
      try {
        this.loading = true;
        console.log(formData);
        await api.post("/auth/reset-password", formData);
        notify("success", "Password changed successfully", "Success");
      } catch (error: any) {
        notify("error", error?.response?.data?.message, "Error");
        throw error; // Re-throw to handle in component
      } finally {
        this.loading = false;
      }
    }
  },
});
