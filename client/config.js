export const BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://yoga-api-five.vercel.app"
        : "http://localhost:8888";