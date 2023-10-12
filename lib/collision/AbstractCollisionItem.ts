import { CollisionBody } from "./CollisionBody";
import { Copyable } from "../Copyable";
import { CollisionItem } from "./CollisionItem";
import { Fixture } from "./Fixture";

/**
 * Abstract implementation of the {@link CollisionItem} interface.
 */
export abstract class AbstractCollisionItem<T extends CollisionBody<E>, E extends Fixture> implements CollisionItem<T, E>, Copyable<CollisionItem<T, E>> {
  
  public abstract getBody(): T;

  public abstract getFixture(): E;

  public abstract copy(): CollisionItem<T, E>;

  /**
   * Returns whether the given {@link CollisionItem} is equal to this {@link CollisionItem}.
   * @param item The {@link CollisionItem} to compare
   * @param other The other object
   * @returns true if the given {@link CollisionItem} is equal to this {@link CollisionItem}
   */
  public static equals(item: CollisionItem<any, any>, other: any): boolean {
    if (other === item) return true;
		if (other == null || item == null) return false;
		if (other.getBody && other.getFixture) {
			return other.getBody() === item.getBody() && other.getFixture() === item.getFixture();
		}
		return false;
  }

}