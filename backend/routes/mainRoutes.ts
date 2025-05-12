import { Router } from "@oak/oak/router";
import { getRoot } from "../controllers/mainControllers.ts";

const router = new Router();
router.get("/", getRoot);

export default router;
