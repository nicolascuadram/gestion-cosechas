import { Application } from "@oak/oak/application";
import mainRoutes from "./routes/mainRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import encargadoRoutes from "./routes/encargadoRoutes.ts";
import cuadrillaRoutes from "./routes/cuadrillaRoutes.ts";
import administradorRoutes from "./routes/administradorRoutes.ts";
import cosechadorRoutes from "./routes/cosechadorRoutes.ts";
import registroRoutes from "./routes/registroRoutes.ts";

const app = new Application();
const port = 8080;

// Define orígenes permitidos (frontend PC y teléfono)
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.0.2:3000",  // IP PC frontend
  "http://192.168.0.3:3000",  // IP teléfono frontend
];

app.use(async (ctx, next) => {
  const origin = ctx.request.headers.get("Origin") ?? "";
  if (allowedOrigins.includes(origin)) {
    ctx.response.headers.set("Access-Control-Allow-Origin", origin);
  }
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // Responder rápido a preflight OPTIONS
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }
  await next();
});

// Usa tus rutas
app.use(mainRoutes.routes());
app.use(mainRoutes.allowedMethods());

app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.use(encargadoRoutes.routes());
app.use(encargadoRoutes.allowedMethods());

app.use(cuadrillaRoutes.routes());
app.use(cuadrillaRoutes.allowedMethods());

app.use(cosechadorRoutes.routes());
app.use(cosechadorRoutes.allowedMethods());

app.use(administradorRoutes.routes());
app.use(administradorRoutes.allowedMethods());

app.use(registroRoutes.routes());
app.use(registroRoutes.allowedMethods());

// Inicia servidor en 0.0.0.0:8080 para permitir conexiones externas
app.listen({ port: port });
console.log(`Server running on http://localhost:${port}`);

