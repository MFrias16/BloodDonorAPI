import { MongoClient } from "mongodb";
import { MONGO_DB, MONGO_URL } from "./env.js";

let client = null;
let connection = null;

async function connect() {
    if (!MONGO_URL || !MONGO_DB) {
        throw new Error("Configura MONGO_URL y MONGO_DB en el archivo .env.");
    }

    client = new MongoClient(MONGO_URL);

    try {
        await client.connect();
        const db = client.db(MONGO_DB);
        console.log("Conexión con MongoDB exitosa.");
        return db;
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error);
        try {
            await client.close();
        } catch (closeError) {
            console.error("Error al cerrar el cliente de MongoDB:", closeError);
        }
        client = null;
        connection = null;
        throw error;
    }
}

export default function getMongoDb() {
    connection ??= connect();
    return connection;
}

export async function closeMongoDb() {
    try {
        await client?.close();
    } finally {
        client = null;
        connection = null;
    }
}