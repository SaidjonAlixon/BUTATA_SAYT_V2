import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InsertApplication } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

/** Safely parse JSON from text; never throw on parse error. */
function safeParseJson<T>(text: string): T | null {
  if (!text || !text.trim()) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function useCreateApplication() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertApplication) => {
      const validated = api.applications.create.input.parse(data);
      const res = await fetch(api.applications.create.path, {
        method: api.applications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      const text = await res.text();
      const json = safeParseJson<{ message?: string; field?: string }>(text);

      if (!res.ok) {
        if (res.status === 400 && json?.message) {
          throw new Error(json.message);
        }
        if (res.status === 405) {
          throw new Error("Server does not allow this request. Please try again.");
        }
        throw new Error(json?.message || `Request failed (${res.status}). Please try again.`);
      }

      if (res.status === 201 && json) {
        return api.applications.create.responses[201].parse(json);
      }
      throw new Error("Invalid response from server. Please try again.");
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "We have received your application and will contact you shortly.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message,
      });
    },
  });
}
