/**
 * Represents an object that can be compared to another object.
 */
export interface Comparable<E> {
  /**
   * Method to compare this object to another object.
   * @param o The object to compare this object to.
   */
  compareTo?(o: E): number;
  /**
   * Method to check if this object is equal to another object.
   * @param o The object to check if this object is equal to.
   */
  equals?(o: E): boolean;
}

/**
 * Method to compare two objects.
 * @param t The first object to compare.
 * @param o The second object to compare.
 * @returns Positive number if the first object is greater than the second object, negative number if the first object is less than the second object, zero if the first object is equal to the second object.
 */
export function compareTo<E extends Comparable<E>>(t: E, o: E): number {
  return t.compareTo ? t.compareTo(o) : (t < o ? -1 : t > o ? 1 : 0);
}

/**
 * Method to check if two objects are equal.
 * @param t The first object to check.
 * @param o The second object to check.
 * @returns true if the objects are equal, false otherwise.
 */
export function equals<E extends Comparable<E>>(t: E, o: E): boolean {
  return (t.equals && t.equals(o)) || (!t.equals && t === o);
}