import { beforeEach, describe, expect, it, vi } from "vitest";

const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));
vi.mock("../lib/prisma", () => ({ prisma: { order: { findFirst } } }));
vi.mock("@/lib/prisma", () => ({ prisma: { order: { findFirst } } }));

import { trackOrderAction } from "../actions/tracking.action";

describe("trackOrderAction phone check", () => {
  beforeEach(() => findFirst.mockReset().mockResolvedValue(null));

  it("never queries with a partial phone number", async () => {
    for (const phone of ["0", "00", "1000000", "0171100000", "   ", "abc"]) {
      const res = await trackOrderAction("SS-DEMO-1001", phone);
      expect(res.success).toBe(false);
    }
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("matches a full number on its last 10 digits, whatever the format", async () => {
    for (const phone of ["01711000000", "+880 1711-000000", "০১৭১১০০০০০০"]) {
      await trackOrderAction("SS-DEMO-1001", phone);
      expect(findFirst.mock.lastCall?.[0].where.guestPhone).toEqual({ endsWith: "1711000000" });
    }
  });
});
