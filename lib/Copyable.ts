/**
 * Simple interface to support deep copying of objects.
 */
export interface Copyable<T extends Copyable< T>> {
  /**
   * Returns a copy of this object.
   * @return The copy
   */
  copy(): T;
}