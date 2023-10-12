import { AbstractCollisionPair } from "./AbstractCollisionPair";
import { CollisionPair } from "./CollisionPair";

/**
 * Represents a basic, immutable implementation of the {@link CollisionPair} interface.
 */
export class BasicCollisionPair<T> extends AbstractCollisionPair<T> implements CollisionPair<T> {
  /**
   * The first object.
   */
  first: T;
  /**
   * The second object.
   */
  second: T;
  /**
   * Full constructor.
   * @param first The first object
   * @param second The second object
   */
  constructor(first: T, second: T) {
    super();
    this.first = first;
    this.second = second;
  }

  public getFirst(): T {
    return this.first;
  }

  public getSecond(): T {
    return this.second;
  }

  public copy(): CollisionPair<T> {
    return new BasicCollisionPair<T>(this.first, this.second);
  }

  public equals(obj: any): boolean {
    return AbstractCollisionPair.equals(this, obj);
  }
}