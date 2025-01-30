export const BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://financely-api.vercel.app"
        : "http://localhost:8888";