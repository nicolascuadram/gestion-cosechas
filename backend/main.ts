import { Application } from "@oak/oak/application";
import mainRoutes from "./routes/mainRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";

import cosechadorRoutes from "./routes/cosechadorRoutes.ts"; // Add this line

const app = new Application();
const port = 8080;

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }
  await next();
});

app.use(mainRoutes.routes());
app.use(mainRoutes.allowedMethods());
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.use(cosechadorRoutes.routes()); // Add this line
app.use(cosechadorRoutes.allowedMethods()); // Add this line

app.listen({ port: port });
console.log(`Server running on http://localhost:${port}`);
