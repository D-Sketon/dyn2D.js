/**
 * Represents an indexed feature of a {@link Shape}.
 */
export abstract class Feature {
  /**
   * Index for non-indexed vertices
   */
  static readonly NOT_INDEXED: number = -1;
  /**
   * The index of the edge on the shape
   */
  index: number;

  /**
   * Minimal constructor.
   * @param index The index of the feature in the {@link Shape}
   */
  constructor(index: number) {
    this.index = index;
  }

  /**
   * Returns the edge index of the feature in the {@link Shape}.
   * 
   * If the index == {@link Feature.NOT_INDEXED} then this feature represents a curved shape feature.
   * @returns The edge index of the feature in the {@link Shape}
   */
  getIndex(): number {
    return this.index;
  }
}