import { Application } from "@oak/oak/application";
import mainRoutes from "./routes/mainRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";

const app = new Application();
const port = 8080;

app.use(mainRoutes.routes());
app.use(mainRoutes.allowedMethods());
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.listen({ port: port });
console.log(`Server running on http://localhost:${port}`);
