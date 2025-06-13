import { Router } from "@oak/oak/router";
import { getCosechadores, createCosechador, updateCosechador, deleteCosechador } from "../controllers/cosechadorControllers.ts";

const router = new Router();
router
  .get("/cosechadores", getCosechadores)
  .post("/cosechadores", createCosechador)
  .put("/cosechadores/:id", updateCosechador)
  .delete("/cosechadores/:id", deleteCosechador);

export default router;