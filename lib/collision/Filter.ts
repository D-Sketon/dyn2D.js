/**
 * Interface representing a filter for collision detection.
 */
export interface Filter {
  /**
   * Returns true if the given {@link Filter} and this {@link Filter} allow the objects to interact.
   * @param filter The other {@link Filter}
   * @returns true if the given {@link Filter} and this {@link Filter} allow the objects to interact
   */
  isAllowed(filter: Filter): boolean;
}

/**
 * The default filter which always returns true
 */
export class DefaultFilter implements Filter {
  /**
   * Always return true
   * @param filter any
   * @returns true
   */
  public isAllowed(filter: Filter): boolean {
    return true;
  }

  public toString(): string {
    return "DefaultFilter[]";
  }
}

/**
 * The default filter which always returns true
 */
export const DEFAULT_FILTER = new DefaultFilter();