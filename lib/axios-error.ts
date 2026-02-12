import axios, { AxiosError } from 'axios';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; status_message?: string }>;
    if (axiosError.response?.data) {
        return axiosError.response.data.message || axiosError.response.data.status_message || axiosError.message;
    }
    return axiosError.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}
