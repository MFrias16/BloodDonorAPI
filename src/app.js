import express from "express";
import bloodRoutes from "./modules/blood/routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { setServers } from "node:dns";

setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
    res.status(200).json({
        status: 200,
        message: "API funcionando correctamente.",
    });
});

app.use("/api", bloodRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
