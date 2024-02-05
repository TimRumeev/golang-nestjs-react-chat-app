const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://0.0.0.0:3001",
  SOCKET_SERVER_URL:
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "ws://0.0.0.0:3001",
};

export default env;
