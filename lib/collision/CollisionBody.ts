import { Fixture } from "./Fixture";
import { DataContainer } from "../DataContainer";
import { Ownable } from "../Ownable";
import { FixtureModificationHandler } from "./FixtureModificationHandler";
import { AABB, Convex, Shiftable, Transform, Transformable, Vector2, Shape } from "../geometry";

/**
 * Represents an object that can collide with other objects.
 */
export interface CollisionBody<T extends Fixture> extends Transformable, Shiftable, DataContainer, Ownable {
  /**
   * Method to add a {@link Fixture} to this {@link CollisionBody}.
   * @param fixture The fixture to add
   * @returns This {@link CollisionBody}
   */
  addFixture(fixture: T): CollisionBody<T>;
  /**
   * Method to creates a {@link Fixture} for the given {@link Convex} {@link Shape},
   * @param convex The {@link Convex} {@link Shape} to add
   * @returns The created {@link Fixture}
   */
  addFixture(convex: Convex): T;

  /**
   * Returns the {@link Fixture} at the given index.
   * @param index The index of the {@link Fixture} to get
   * @returns The {@link Fixture} at the given index
   * @throws `RangeError` if the index is out of bounds
   */
  getFixture(index: number): T;
  /**
   * Returns the first {@link Fixture} in this {@link CollisionBody}, determined by the order in 
   * which they were added, that contains the given point.
   * @param point A world space point to get the {@link Fixture} for
   * @returns The first {@link Fixture} in this {@link CollisionBody} that contains the given point
   */
  getFixture(point: Vector2): T;
  /**
   * Returns all the {@link Fixture}s in this {@link CollisionBody} that contain the given point.
   * @param point A world space point to get the {@link Fixture} for
   * @returns All the {@link Fixture}s in this {@link CollisionBody} that contain the given point
   * @throws `TypeError` if the point is null
   */
  getFixtures(point: Vector2): T[];

  /**
   * Returns the number of {@link Fixture}s in this {@link CollisionBody}.
   * @returns The number of {@link Fixture}s in this {@link CollisionBody}
   */
  getFixtureCount(): number;

  /**
   * Returns all the {@link Fixture}s in this {@link CollisionBody}.
   * @returns All the {@link Fixture}s in this {@link CollisionBody}
   */
  getFixtures(): T[];

  /**
   * Returns an iterator over the {@link Fixture}s in this {@link CollisionBody}.
   * @returns An iterator over the {@link Fixture}s in this {@link CollisionBody}
   */
  getFixtureIterator(): Iterator<T>;

  /**
   * Remove the {@link Fixture} at the given index.
   * @param index The index of the {@link Fixture} to remove
   * @returns The removed {@link Fixture}
   */
  removeFixture(index: number): T;
  /**
   * Remove the first {@link Fixture} in this {@link CollisionBody}, determined by the order in
   * which they were added, that contains the given point.
   * @param point A world space point to remove the {@link Fixture} for
   * @returns The removed {@link Fixture}
   * @throws `TypeError` if the point is null
   */
  removeFixture(point: Vector2): T;
  /**
   * Remove the given {@link Fixture} from this {@link CollisionBody}.
   * @param fixture The {@link Fixture} to remove
   * @returns true if the {@link Fixture} was removed
   */
  removeFixture(fixture: T): boolean;

  /**
   * Remove all the {@link Fixture}s in this {@link CollisionBody} that contain the given point.
   * @param point A world space point to remove the {@link Fixture}s for
   * @returns All the removed {@link Fixture}s
   * @throws `TypeError` if the point is null
   */
  removeFixtures(point: Vector2): T[];

  /**
   * Remove all the {@link Fixture}s in this {@link CollisionBody}.
   * @returns All the removed {@link Fixture}s
   */
  removeAllFixtures(): T[];

  /**
   * Checks if this {@link CollisionBody} contains the given {@link Fixture}.
   * @param fixture The {@link Fixture} to check for
   * @returns true if this {@link CollisionBody} contains the given {@link Fixture}
   */
  containsFixture(fixture: T): boolean;

  /**
   * Returns true if the given world space point is contained in this {@link CollisionBody}.
   * @param point The world space point to check
   * @returns true if the given world space point is contained in this {@link CollisionBody}
   * @throws `TypeError` if the point is null
   */
  contains(point: Vector2): boolean;

  /**
   * Returns the center for this {@link CollisionBody} in local coordinates.
   * @returns The center in local coordinates
   */
  getLocalCenter(): Vector2;

  /**
   * Returns the center for this {@link CollisionBody} in world coordinates.
   * @returns The center in world coordinates
   */
  getWorldCenter(): Vector2;

  /**
   * Returns a new point in local coordinates of this {@link CollisionBody} given
   * a point in world coordinates.
   * @param worldPoint A world space point
   * @returns The local space point for the given world space point
   * @throws `TypeError` if the point is null
   */
  getLocalPoint(worldPoint: Vector2): Vector2;

  /**
   * Returns a new point in world coordinates given a point in the
   * local coordinates of this {@link CollisionBody}.
   * @param localPoint A point in the local coordinates of this {@link CollisionBody}
   * @returns The world space point for the given local space point
   * @throws `TypeError` if the point is null
   */
  getWorldPoint(localPoint: Vector2): Vector2;

  /**
   * Returns a new vector in local coordinates of this {@link CollisionBody} given
   * a vector in world coordinates.
   * @param worldVector A world space point
   * @returns The local space vector for the given world space vector
   * @throws `TypeError` if the vector is null
   */
  getLocalVector(worldVector: Vector2): Vector2;

  /**
   * Returns a new vector in world coordinates given a vector in the
   * local coordinates of this {@link CollisionBody}.
   * @param localVector A vector in the local coordinates of this {@link CollisionBody}
   * @returns The world space vector for the given local space vector
   * @throws `TypeError` if the vector is null
   */
  getWorldVector(localVector: Vector2): Vector2;

  /**
   * Returns the maximum radius of the disk that the
   * {@link CollisionBody} creates if rotated 360 degrees about its center.
   * @returns The maximum radius of the disk
   */
  getRotationDiscRadius(): number;

  /**
   * Returns the local to world space {@link Transform} of this {@link CollisionBody}.
   * @returns The local to world space {@link Transform}
   */
  getTransform(): Transform;

  /**
   * Returns the transform of the last iteration.
   * 
   * This transform represents the last frame's position and orientation.
   * @returns The transform of the last iteration
   */
  getPreviousTransform(): Transform;

  /**
   * Sets this {@link CollisionBody}'s local to world space {@link Transform}.
   * @param transform The transform to set
   */
  setTransform(transform: Transform): void;

  /**
   * Rotate about the center of this {@link CollisionBody}.
   * @param theta The angle to rotate about the center in radians
   */
  rotateAboutCenter(theta: number): void;

  /**
   * Translates the center of the {@link CollisionBody} to the world space origin (0,0).
   */
  translateToOrigin(): void;

  /**
   * Creates an {@link AABB} for this {@link CollisionBody}.
   * @returns The {@link AABB} for this {@link CollisionBody}
   */
  createAABB(): AABB;
  /**
   * Creates an {@link AABB} for this {@link CollisionBody} given the world space
   * specified {@link Transform}.
   * @param transform The world space {@link Transform}
   * @returns The {@link AABB} for this {@link CollisionBody}
   * @throws `TypeError` if the transform is null
   */
  createAABB(transform: Transform): AABB;

  /**
   * Computes the {@link AABB} for this {@link CollisionBody} and sets the result.
   * @param result The {@link AABB} to set
   * @throws `TypeError` if the given AABB is null
   */
  computeAABB(result: AABB): void;
  /**
   * Computes the {@link AABB} for this {@link CollisionBody} given the world space
   * specified {@link Transform} and sets the result.
   * @param result The {@link AABB} to set
   * @param transform The world space {@link Transform}
   * @throws `TypeError` if the given AABB is null
   * @throws `TypeError` if the given is null
   */
  computeAABB(result: AABB, transform: Transform): void;

  /**
   * Sets the {@link AABB} for this {@link CollisionBody}.
   * 
   * A disabled {@link CollisionBody} is completely ignored by the engine.
   * @param enabled true if this {@link CollisionBody} should be enabled
   */
  setEnabled(enabled: boolean): void;

  /**
   * Returns true if this {@link CollisionBody} is enabled.
   * @returns true if this {@link CollisionBody} is enabled
   */
  isEnabled(): boolean;

  /**
   * Returns the {@link FixtureModificationHandler} for this body.
   * @returns The {@link FixtureModificationHandler} for this body
   */
  getFixtureModificationHandler(): FixtureModificationHandler<T>;

  /**
   * Sets the {@link FixtureModificationHandler} for this body.
   * @param handler The {@link FixtureModificationHandler} to set
   */
  setFixtureModificationHandler(handler: FixtureModificationHandler<T>): void;
}
/**
 * Number of fixtures typically attached to a {@link CollisionBody}.  
 */
export const TYPICAL_FIXTURE_COUNT = 1;