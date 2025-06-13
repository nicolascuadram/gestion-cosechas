import { Router } from "@oak/oak/router";
import {
  getCuadrillas,
  createCuadrilla,
  updateCuadrilla,
  deleteCuadrilla,
  asignarCosechador,
  quitarCosechador
} from "../controllers/cuadrillaControllers.ts";

const router = new Router();

router.get("/cuadrillas", getCuadrillas);
router.post("/cuadrillas", createCuadrilla);
router.put("/cuadrillas/:id", updateCuadrilla);
router.delete("/cuadrillas/:id", deleteCuadrilla);

// Asignar/quitar cosechador a cuadrilla
router.put("/cosechadores/:id/asignar", asignarCosechador);
router.put("/cosechadores/:id/quitar", quitarCosechador);

export default router;