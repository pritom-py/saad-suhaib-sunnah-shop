import { describe, expect, it } from "vitest";
import { bengaliVariants } from "../lib/bengali-text";

describe("bengaliVariants", () => {
  const single = "মাকড়া"; // মাকড়া with U+09DC
  const combined = "মাকড়া"; // same word, ড + nukta

  it("returns both spellings from either input", () => {
    for (const input of [single, combined]) {
      expect(bengaliVariants(input)).toEqual(expect.arrayContaining([single, combined]));
    }
  });

  it("leaves other text as a single variant", () => {
    expect(bengaliVariants("makra")).toEqual(["makra"]);
  });
});
