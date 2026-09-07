const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export class ApiError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: "include", // Essential for HTTP-only cookies
  };

  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.message || `Request failed with status ${response.status}`;
      const errors = data?.errors || [];
      throw new ApiError(errorMessage, response.status, errors);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      err.message || "Network error. Please check your connection.",
      0
    );
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options) =>
    request(endpoint, { ...options, method: "DELETE" }),
};

export default api;
