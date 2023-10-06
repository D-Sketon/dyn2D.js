import { Copyable } from "../Copyable";

/**
 * Represents a collision between two {@link CollisionBody}'s {@link Fixture}s.
 */
export interface CollisionPair<T> extends Copyable<CollisionPair<T>> {
  /**
   * Returns the first object in this {@link CollisionPair}.
   * @returns The first object T
   */
  getFirst(): T;
  /**
   * Returns the second object in this {@link CollisionPair}.
   * @returns The second object T
   */
  getSecond(): T;
}