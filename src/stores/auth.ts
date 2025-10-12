import { defineStore } from "pinia";
import router from "../router";
import { notify } from "@/utils/notify";
import api from "@/utils/api";

export interface Permission {
  id: number;
  name: string;
  display_name: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: (() => {
      try {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
      } catch {
        return null;
      }
    })(),
    permissions: (() => {
      try {
        const permissionsData = localStorage.getItem("permissions");
        return permissionsData ? JSON.parse(permissionsData) : [];
      } catch {
        return [];
      }
    })(),
    resetToken: localStorage.getItem("reset_token") || "",
    loading: false,
  }),
  getters: { 
    isLoggedIn: (s) => !!s.token,
    isResetAuthorized: (s) => !!s.resetToken,
    hasPermission: (s) => (permissionName: string) => {
      return s.permissions.some((permission: Permission) => permission.name === permissionName);
    },
    getUserPermissions: (s) => s.permissions,
  },
  actions: {
    async login(formData:object) {
      try {
        this.loading = true;
        const response = await api.post("/login", formData);

        const { admin: user, token } = response.data.data;
        const permissions = user.role?.permissions || [];
        
        this.token = token;
        this.user = user;
        this.permissions = permissions;
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("permissions", JSON.stringify(permissions));

        notify("success", `Welcome back, ${user.name}!`, response.data.message || "Login Successful");
        router.push("/");
      } catch (error: any) {
        notify("error", error?.response?.data?.message, "Login Failed");
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        this.loading = true;
        const response = await api.delete("/logout", {
        });
        this.token = "";
        this.user = null;
        this.permissions = [];
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("permissions");
        notify("success", "Logged out successfully", response?.data?.message);
        router.push("/login");
      }
      catch (error: any) {
        notify("error", error?.response?.data?.message, "Logout Failed");
      } finally {
        this.loading = false;
      }
    },

  // Clear auth data without API call (for session expiry)
  clearAuthData() {
    this.token = "";
    this.user = null;
    this.permissions = [];
    this.resetToken = "";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("reset_token");
  },
    async resetPassword (formData: { email: string }) {
      try {
        this.loading = true;
        const response =await api.post("reset-password-code", formData);
        notify("success", response?.data?.message, "Success");
        router.push({ path: "/otp", query: { email: formData.email } });
      } catch (error: any) {
        notify("error", error?.response?.data?.message, "Error");
      } finally {
        this.loading = false;
      }
    },
    async confirmCode(formData: { email: string, code: string }){
      try{ 
        this.loading = true;
        const response = await api.post("verify-reset-code", formData);
        
        // Save reset token for password reset authorization
        if (response.data.data?.reset_token) {
          this.resetToken = response.data.data.reset_token;
          localStorage.setItem("reset_token", this.resetToken);
        }
        
        notify("success", response?.data?.message, "Success");
        router.push({ path: "/resetpassword", query: { email: formData.email } });
      } catch (error: any) {
        notify("error", error?.response?.data?.message, "Error");
      } finally {
        this.loading = false;
      } 
    },
  


    async changePassword(formData: object) {
      try {
        this.loading = true;
        console.log(formData);
        const response = await api.post("/reset-password", formData);
        notify("success", response?.data?.message, "Success");
        
        // Clear reset token after successful password change
        this.resetToken = "";
        localStorage.removeItem("reset_token");
        
        router.push("/login");
      } catch (error: any) {
        notify("error", error?.response?.data?.message, "Error");
        throw error; // Re-throw to handle in component
      } finally {
        this.loading = false;
      }
    }
  },
});
