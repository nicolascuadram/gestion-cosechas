import { Router } from "@oak/oak/router";
import { getUsers, login } from "../controllers/userControllers.ts";

const router = new Router();

router.get("/users", getUsers);
router.post("/login", login);

export default router;
