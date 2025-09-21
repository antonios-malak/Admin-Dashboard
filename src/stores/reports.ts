import { defineStore } from "pinia";
import api from "@/utils/api";
import { notify } from "@/utils/notify";

export const useReportsStore = defineStore("reports", {
  state: () => ({
    reports: [] as any[],
    loading: false,
  }),
  actions: {
    async fetchReports() {
      try {
        this.loading = true;
        const response = await api.get("/api/reports");
        this.reports = response.data;
      } catch (error: any) {
        notify("error", "Failed to fetch reports", "Error");
        console.error("Reports error:", error);
      } finally {
        this.loading = false;
      }
    },

    async updateReportStatus(reportId: number, newStatus: string) {
      try {
        this.loading = true;
        await api.post(`/api/reports/${reportId}/status`, {
          status: newStatus,
        });

        // Update the report status in the local state
        const reportIndex = this.reports.findIndex(
          (report) => report.id === reportId
        );
        if (reportIndex !== -1) {
          this.reports[reportIndex].status = newStatus;
        }

        notify("success", "Report status updated successfully", "Success");
      } catch (error: any) {
        notify("error", "Failed to update report status", "Error");
        console.error("Update report status error:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
