import { describe, expect, it } from "vitest";
import { isValidOffer, priceOf } from "../lib/pricing";

describe("priceOf", () => {
  it("shows the regular price when there is no offer", () => {
    expect(priceOf({ regularPrice: 500, salePrice: null })).toEqual({ price: 500, original: null, percent: 0 });
  });

  it("charges the offer price and crosses out the real regular price", () => {
    expect(priceOf({ regularPrice: 500, salePrice: 400 })).toEqual({ price: 400, original: 500, percent: 20 });
  });

  it("rounds the saving down", () => {
    expect(priceOf({ regularPrice: 70, salePrice: 47 }).percent).toBe(32); // 32.86%
  });

  it("ignores an offer that is not cheaper", () => {
    for (const salePrice of [500, 600, 0, -5]) {
      expect(priceOf({ regularPrice: 500, salePrice })).toEqual({ price: 500, original: null, percent: 0 });
      expect(isValidOffer(500, salePrice)).toBe(false);
    }
  });

  it("applies the offer to sizes that follow the regular price only", () => {
    const product = { regularPrice: 70, salePrice: 60 };
    expect(priceOf(product, 70).price).toBe(60);
    expect(priceOf(product, null).price).toBe(60);
    expect(priceOf(product, 85)).toEqual({ price: 85, original: null, percent: 0 });
  });

  it("keeps an unset price unset", () => {
    expect(priceOf({ regularPrice: null, salePrice: 50 }).price).toBeNull();
  });
});
