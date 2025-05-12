import { Client } from "@db/postgres";
import "@std/dotenv/load";

const client = new Client({ 
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: Deno.env.get("DB_NAME"),
  hostname: Deno.env.get("DB_HOST"),
  port: Deno.env.get("DB_PORT"),
});

await client.connect();

export default client;
