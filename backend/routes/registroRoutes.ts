import { Router } from "@oak/oak/router";
import * as registroControllers from "../controllers/registroControllers.ts";

const router = new Router();
router.post("/registro", registroControllers.postRegistro);
router.get("/registros", registroControllers.getRegistros);

export default router;