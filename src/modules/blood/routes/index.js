import { Router } from "express";
import bloodRequestRoutes from "./bloodRequest.routes.js";
import donorRoutes from "./donor.routes.js";

const router = Router();

router.use("/blood-requests", bloodRequestRoutes);
router.use("/donors", donorRoutes);

export default router;
