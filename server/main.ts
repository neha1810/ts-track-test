// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";
import { createTable } from "./tables/insights.ts"
console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
db.run(createTable);
console.log("Initialising server");

const router = new oak.Router();


const app = new oak.Application();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
router.get("/", (ctx) => {
  ctx.response.body = "Hello, server is working!";
});


router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights/create", async (ctx) => {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Missing  body..." };
    return;
  }

  try {
    const data = await ctx.request.body.json();

    console.log("Parsed body data:", data);

    const insight = createInsight({
      db,
      insight: {
        brand: Number(data.brand),
        text: data.text,
      },
    });

    ctx.response.status = 201;
    ctx.response.body = { message: "Insight created!", insight };
  } catch (err) {
    console.error("Error parsing body:", err);
    ctx.response.status = 400;
    ctx.response.body = { message: "Invalid JSON body" };
  }
});


router.delete("/insights/delete/:id", (ctx) => {
  const id = Number(ctx.params.id);
  if (isNaN(id)) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Invalid insight ID" };
    return;
  }


  const deleted = deleteInsight({ db, id });

  if (!deleted) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Insight not found" };
    return;
  }


  ctx.response.status = 200;
  ctx.response.body = { message: `Insight with id ${id} deleted` };
});