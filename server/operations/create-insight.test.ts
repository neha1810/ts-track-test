import { assertEquals, assertThrows } from "https://deno.land/std@0.203.0/assert/mod.ts";
import createInsight from "./create-insight.ts";
import type { HasDBClient } from "../shared.ts";


function insertStatement({ brand, text, createdAt }: { brand: string; text: string; createdAt: string }) {

    return `INSERT INTO insights (brand, text, createdAt) VALUES (${brand}, '${text}', '${createdAt}')`;
}
function createMockDb(row?: any): HasDBClient["db"] {
    return {
        run: (sql: string, ...params: unknown[]) => 1,
        lastInsertRowId: 1,
        sql: () => row ? [row] : [],
    } as unknown as HasDBClient["db"];
};


Deno.test("createInsight successfully", () => {
    const mockRow = {
        id: 1,
        brand: 1,
        text: "shoes",
        createdAt: new Date().toISOString(),
    };

    const mockDb = createMockDb(mockRow);

    const insight = createInsight({
        db: mockDb,
        insight: {
            brand: 1,
            text: "shoes",
        },
    });

    assertEquals(insight.id, mockRow.id);
    assertEquals(insight.brand, mockRow.brand);
    assertEquals(insight.text, mockRow.text);
    assertEquals(insight.createdAt instanceof Date, true);
});

Deno.test("createInsight throws error if insert fails", () => {
    const mockDb = createMockDb(undefined);

    assertThrows(() => {
        createInsight({
            db: mockDb,
            insight: {
                brand: 2,
                text: "Stylish",
            },
        });
    }, Error, "Insert failed");
});
