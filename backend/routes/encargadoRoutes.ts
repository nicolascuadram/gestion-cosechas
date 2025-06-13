import { Router } from "@oak/oak/router";
import { getEncargados, createEncargado, updateEncargado, deleteEncargado } from "../controllers/encargadoControllers.ts";

const router = new Router();
router.post("/encargados", createEncargado);
router.get("/encargados", getEncargados);
router.put("/encargados/:id", updateEncargado);
router.delete("/encargados/:id", deleteEncargado);

export default router;