import "dotenv/config";

export const PORT = Number(process.env.PORT) || 3000;
export const MONGO_URL = process.env.MONGO_URL;
export const MONGO_DB = process.env.MONGO_DB;
export const BLOOD_REQUESTS_COLLECTION =
    process.env.BLOOD_REQUESTS_COLLECTION || "bloodRequests";
export const DONORS_COLLECTION = process.env.DONORS_COLLECTION || "donors";
