export function getErrorMessage(error) {
  if (!error) return "Unknown error";
  return error.message || "Unexpected error occurred";
}

export const handleApiError = (error) => {
  if (error.response) {
    return new Error(error.response.data?.message || "Server error occurred");
  }
  return new Error("Network error. Please check your connection.");
};