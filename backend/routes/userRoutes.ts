import { Router } from "@oak/oak/router";
import { getUsers } from "../controllers/userControllers.ts";

const router = new Router();

router.get("/users", getUsers);

export default router;
