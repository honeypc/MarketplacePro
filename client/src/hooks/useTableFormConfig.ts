import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { TableFormConfig } from "@/lib/tableFormConfig";

export function useTableFormConfig() {
  return useQuery<TableFormConfig>({
    queryKey: ["/api/config/table-forms"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/config/table-forms");
      return response.json();
    }
  });
}
