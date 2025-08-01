import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type { Insert, Row } from "$tables/insights.ts";
import { insertStatement } from "$tables/insights.ts";

type Input = HasDBClient & {
  insight: {
    brand: number;
    text: string;
  };
};

export default function createInsight({ db, insight }: Input): Insight {
  const createdAt = new Date().toISOString();

  // Insert 
  db.run(insertStatement({ ...insight, createdAt }));

  // Get the newly inserted row
  const [row] = db.sql<Row>`SELECT * FROM insights WHERE id = ${db.lastInsertRowId}`;

  if (!row) {
    throw new Error("Insert failed");
  }

  return {
    ...row,
    createdAt: new Date(row.createdAt),
  };
}