import { Router } from "@oak/oak/router";
import { getTipo_cosecha, createTipo_cosecha } from "../controllers/administradorControllers.ts";

const router = new Router();
router.get("/administrador/getTipo_cosecha", getTipo_cosecha);
router.get("/administrador/getTipo_cosecha", createTipo_cosecha);
//router.put("/encargados/:id", updateEncargado);
//router.delete("/encargados/:id", deleteEncargado);

export default router;