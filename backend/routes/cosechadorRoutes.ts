import { Router } from "@oak/oak/router";
import { getCosechadores, createCosechador, updateCosechador, deleteCosechador, getCosechadorById} from "../controllers/cosechadorControllers.ts";

const router = new Router();
router
  .get("/cosechadores", getCosechadores)
  .post("/cosechadores", createCosechador)
  .put("/cosechadores/:id", updateCosechador)
  .delete("/cosechadores/:id", deleteCosechador);
router.get("/cosechadores/:id", getCosechadorById);

export default router;