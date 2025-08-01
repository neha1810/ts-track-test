import { assertEquals, assertThrows } from "https://deno.land/std@0.203.0/assert/mod.ts";
import { HasDBClient } from "../shared.ts";
import deleteInsight from "./delete-insight.ts";


function createMockDb(result: number): HasDBClient["db"] {
    return {
        run: (_sql: string, _id: number) => result,
    } as unknown as HasDBClient["db"];
}

Deno.test("successfully deleted insight", () => {

    const input = {
        id: 1,
        db: createMockDb(1)
    }
    const result = deleteInsight(input);
    assertEquals(result, true)
})

Deno.test("unable to delete", () => {
    const input = {
        id: 999,
        db: createMockDb(0),
    };

    const result = deleteInsight(input);
    assertEquals(result, false);
});
