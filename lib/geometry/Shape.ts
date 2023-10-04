import { DataContainer } from "../DataContainer";
import { Interval } from "./Interval";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";
import { Mass } from "./Mass";
import { AABB } from "./AABB";
import { Transform } from "./Transform";

/**
 * Represents a geometric {@link Shape}.
 * 
 */
export interface Shape extends Transformable, DataContainer {
  /**
   * Returns the center/centroid of the {@link Shape} in local coordinates
   * @return The {@link Vector2} representing the center of the {@link Shape}
   */
  getCenter(): Vector2;

  /**
   * @overload
   * Returns the maximum radius of the {@link Shape}
   * @return The maximum radius of the {@link Shape}
   */
  getRadius(): number;
  /**
   * @overload
   * Returns the maximum radius of the {@link Shape} given the specified center
   * @param center The center {@link Vector2}
   * @return The maximum radius of the {@link Shape}
   * @throws `TypeError` if the given center is `null` or `undefined`
   */
  getRadius(center: Vector2): number;

  /**
   * Method to rotate the {@link Shape} about the center
   * @param theta The angle to rotate the {@link Shape} about its center in radians
   */
  rotateAboutCenter(theta: number): void;

  /**
   * @overload
   * Method to project this {@link Shape} onto the given {@link Vector2}
   * 
   * This is the same as calling {@link Shape.project} and passing a new {@link Transform}.
   * @param vector The {@link Vector2} to project onto this shape
   * @return The {@link Interval} of the projection
   * @throws `TypeError` if the given vector is `null` or `undefined`
   */
  project(vector: Vector2): Interval;
  /**
   * @overload
   * Method to project this {@link Shape} onto the given {@link Vector2}
   * @param vector The {@link Vector2} to project onto this shape
   * @param transform The {@link Transform} to apply to this shape
   * @return The {@link Interval} of the projection
   * @throws `TypeError` if the given vector is `null` or `undefined`
   * @throws `TypeError` if the given transform is `null` or `undefined`
   */
  project(vector: Vector2, transform: Transform): Interval;

  /**
   * @overload
   * Method to test if this {@link Shape} contains the given {@link Vector2}
   * 
   * If the given point lies on an edge the point is considered
	 * to be inside the {@link Shape}.
   * 
   * The given point is assumed to be in world space.
   * 
   * This is the same as calling {@link Shape.contains} and passing a new {@link Transform}.
   * @param point The {@link Vector2} point to test
   * @return true if the point is contained in this {@link Shape}
   * @throws `TypeError` if the given point is `null` or `undefined`
   */
  contains(point: Vector2): boolean;
  /**
   * @overload
   * Method to test if this {@link Shape} contains the given {@link Vector2}
   * 
   * If the given point lies on an edge the point is considered
	 * to be inside the {@link Shape}.
   * 
   * The given point is assumed to be in world space.
   * @param point The {@link Vector2} point to test
   * @param transform The {@link Transform} to apply to this shape
   * @return true if the point is contained in this {@link Shape}
   * @throws `TypeError` if the given point is `null` or `undefined`
   * @throws `TypeError` if the given transform is `null` or `undefined`
   */
  contains(point: Vector2, transform: Transform): boolean;
  /**
   * @overload
   * Method to test if this {@link Shape} contains the given {@link Vector2}
   * 
	 * If the given point lies on an edge the behavior is determined by the
	 * inclusive parameter. Set to true to consider the point inside or contained,
	 * or false to consider it outside or not contained.
   * 
	 * The given point is assumed to be in world space.
   * @param point The {@link Vector2} point to test
   * @param transform The {@link Transform} to apply to this shape
   * @param inclusive whether or not to include the edge of the shape
   * @return true if the point is contained in this {@link Shape}
   * @throws `TypeError` if the given point is `null` or `undefined`
   * @throws `TypeError` if the given transform is `null` or `undefined`
   */
  contains(point: Vector2, transform: Transform, inclusive: boolean): boolean;

  /**
   * Returns the area of the {@link Shape}
   */
  getArea(): number;

  /**
   * Method to create a {@link Mass} object using the geometric properties of this {@link Shape}
   * @param density The density of the {@link Shape}
   */
  createMass(density: number): Mass;
  
  /**
   * @overload
   * Method to create an {@link AABB} object using the geometric properties of this {@link Shape}
   * 
   * This is the same as calling {@link Shape.createAABB} and passing a new {@link Transform}.
   * @return The {@link AABB} enclosing this {@link Shape}
   */
  createAABB(): AABB;
  /**
   * @overload
   * Method to create an {@link AABB} object using the geometric properties of this {@link Shape}
   * @param transform The {@link Transform} to apply to this shape
   * @return The {@link AABB} enclosing this {@link Shape}
   * @throws `TypeError` if the given transform is `null` or `undefined`
   */
  createAABB(transform: Transform): AABB;

  /**
   * @overload
   * Method to compute the {@link AABB} of this {@link Shape} and set the result in the given {@link AABB}
   * 
   * This is the same as calling {@link Shape.computeAABB} and passing a new {@link Transform}.
   * @param aabb The {@link AABB} to set the values into
   */
  computeAABB(aabb: AABB): void;
  /**
   * @overload
   * Method to compute the {@link AABB} of this {@link Shape} and set the result in the given {@link AABB}
   * @param aabb The {@link AABB} to set the values into
   * @param transform The {@link Transform} to apply to this shape
   * @throws `TypeError` if the given transform is `null` or `undefined`
   */
  computeAABB(aabb: AABB, transform: Transform): void;
}