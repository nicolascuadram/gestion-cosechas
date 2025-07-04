// File: administradorRoutes.ts
import { Router } from "@oak/oak/router";
import { getTipo_cosecha, createTipo_cosecha, updateTipo_cosecha, deleteTipo_cosecha, getReportes } from "../controllers/administradorControllers.ts";

const router = new Router();
router.get("/administrador/getTipo_cosecha", getTipo_cosecha);
router.post("/administrador/getTipo_cosecha", createTipo_cosecha);
router.put("/administrador/tipo_cosecha/:id", updateTipo_cosecha);
router.delete("/administrador/tipo_cosecha/:id", deleteTipo_cosecha);
router.get("/administrador/reportes", getReportes);

export default router;

 