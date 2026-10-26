const apiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

if (!apiUrl) {
  console.warn("VITE_API_BASE_URL is not configured.");
}

export const env = {
  apiUrl: apiUrl || "http://localhost:8000/api",
  appName:
    import.meta.env.VITE_APP_NAME || "Campus Facility Booking System",
};