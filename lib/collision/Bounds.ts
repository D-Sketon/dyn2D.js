import { CollisionBody } from "./CollisionBody";
import { AABB, Shiftable, Translatable, Vector2 } from "../geometry";
import { Transform } from "stream";
import { Fixture } from "./Fixture";

/**
 * Represents the {@link Bounds} of a simulation.
 */
export interface Bounds extends Translatable, Shiftable{
  /**
   * Returns the translation of this {@link Bounds}.
   * @returns The translation
   */
  getTranslation(): Vector2;
  /**
   * Returns whether the given {@link CollisionBody} is fully outside this {@link Bounds}.
   * @param body The {@link CollisionBody} to check
   * @returns true if the {@link CollisionBody} is outside this {@link Bounds}, false otherwise
   */
  isOutside(body: CollisionBody<any>): boolean;
  /**
   * Returns whether the given {@link AABB} is fully outside this {@link Bounds}.
   * @param aabb The {@link AABB} to check
   * @returns true if the {@link AABB} is outside this {@link Bounds}, false otherwise
   */
  isOutside(aabb: AABB): boolean;
  /**
   * Returns whether the given {@link AABB} or {@link Fixture} is fully outside this {@link Bounds}.
   * @param aabb The {@link AABB} to check
   * @param transform The {@link Transform} for the fixture
   * @param fixture The {@link Fixture} to check
   * @returns true if the given {@link AABB} or {@link Fixture} is fully outside this {@link Bounds}, false otherwise
   */
  isOutside(aabb: AABB, transform: Transform, fixture: Fixture): boolean;
}