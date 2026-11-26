export interface Testimonial {
  name: string;
  comment: string;
  /** optional photo path under /public; only use a photo the customer has agreed to */
  photo?: string;
}

/**
 * Add ONLY real feedback from real customers who agreed to be quoted.
 * The "গ্রাহকদের মতামত" section stays hidden while this list is empty.
 */
export const TESTIMONIALS: Testimonial[] = [];
