const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  SOCKET_SERVER_URL:
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3002",
};

export default env;
