import axios from "axios";

export type ApiErrorBody = {
  status?: string;
  statusCode?: number;
  message?: string;
};

export type ApiErrorState = {
  status: string;
  statusCode: number;
  message: string;
};

export function getErrorMessage(error: unknown, fallback = "Unexpected error"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as ApiErrorBody).message;
      if (typeof message === "string") return message;
    }
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function toApiErrorState(error: unknown): ApiErrorState | null {
  if (!axios.isAxiosError(error)) return null;
  const data = error.response?.data;
  if (data && typeof data === "object" && "message" in data) {
    const body = data as ApiErrorBody;
    return {
      status: body.status || "error",
      statusCode: body.statusCode || error.response?.status || 500,
      message: body.message || error.message,
    };
  }
  return {
    status: "error",
    statusCode: error.response?.status || 500,
    message: typeof data === "string" ? data : error.message,
  };
}
