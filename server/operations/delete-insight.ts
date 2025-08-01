import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): boolean => {
  console.log(`Deleting insight id=${input.id}`);

  const result = input.db.run(`DELETE FROM insights WHERE id = ?`, input.id);

  console.log(`Deleted count: ${result}`);

  return result > 0; // returns true if successfully deleted
};