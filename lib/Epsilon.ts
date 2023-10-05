/**
 * Class containing an approximation of machine epsilon.
 */
export class Epsilon {
  /** The double precision floating point machine epsilon approximation */
  static E = Epsilon.computed();

  /**
   * Computes an approximation of machine epsilon.
   * @returns The double precision floating point machine epsilon approximation.
   */
  static computed(): number {
    let e = 0.5;
    while (1 + e > 1) {
      e /= 2;
    }
    return e;
  }
}