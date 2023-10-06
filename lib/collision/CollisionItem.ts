import { Copyable } from "../Copyable";
import { CollisionBody } from "./CollisionBody";
import { Fixture } from "./Fixture";

/**
 * Represents a grouping of a {@link CollisionBody} and {@link Fixture}.
 */
export interface CollisionItem<T extends CollisionBody<E>, E extends Fixture> extends Copyable<CollisionItem<T, E>> {
  /**
   * Returns the {@link CollisionBody} of this {@link CollisionItem}.
   * @returns The {@link CollisionBody}
   */
  getBody(): T;
  /**
   * Returns the {@link Fixture} of this {@link CollisionItem}.
   * @returns The {@link Fixture}
   */
  getFixture(): E;
}