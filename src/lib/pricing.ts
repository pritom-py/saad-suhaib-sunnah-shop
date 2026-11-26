/**
 * The single rule for what an item costs. Pages and checkout both use it, so the price shown is the
 * price charged. A crossed-out price is only ever the product's own regular price.
 */
export interface Priced {
  regularPrice: number | null;
  salePrice?: number | null;
}

export interface Price {
  /** what the customer pays; null when the price is not set */
  price: number | null;
  /** the regular price to cross out, only while an offer applies */
  original: number | null;
  /** whole percent saved, rounded down so the saving is never overstated */
  percent: number;
}

export const isValidOffer = (regularPrice: number | null, salePrice: number | null | undefined) =>
  regularPrice !== null && salePrice !== null && salePrice !== undefined && salePrice > 0 && salePrice < regularPrice;

export function priceOf(product: Priced, variantPrice?: number | null): Price {
  const base = variantPrice ?? product.regularPrice;
  // a size with its own different price is not part of the product's offer
  if (isValidOffer(product.regularPrice, product.salePrice) && base === product.regularPrice) {
    const sale = product.salePrice as number;
    const original = product.regularPrice as number;
    return { price: sale, original, percent: Math.floor(((original - sale) / original) * 100) };
  }
  return { price: base, original: null, percent: 0 };
}
