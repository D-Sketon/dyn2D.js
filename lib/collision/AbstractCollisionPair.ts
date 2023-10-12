import { Copyable } from "../Copyable";
import { CollisionPair } from "./CollisionPair";

/**
 * Abstract implementation of the {@link CollisionPair} interface.
 */
export abstract class AbstractCollisionPair<T> implements CollisionPair<T>, Copyable<CollisionPair<T>> {

  public abstract getFirst(): T;

  public abstract getSecond(): T;

  public abstract copy(): CollisionPair<T>;

  /**
   * Returns whether the given object is equal to this {@link CollisionPair}.
   * @param pairA The first {@link CollisionPair}
   * @param pairB The other object
   * @returns true if the given object is equal to this {@link CollisionPair}
   */
  public static equals(pairA: CollisionPair<any>, pairB: any): boolean {
    if (pairB == pairA) return true;
    if (pairB == null || pairA == null) return false;
    if (pairB.getFirst && pairB.getSecond) {
      const a1 = pairA.getFirst();
      const a2 = pairA.getSecond();

      const b1 = pairB.getFirst();
      const b2 = pairB.getSecond();

      return (a1.equals(b1) && a2.equals(b2)) ||
        (a1.equals(b2) && a2.equals(b1));
    }
    return false;
  }

}