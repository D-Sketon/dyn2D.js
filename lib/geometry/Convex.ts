import { DataContainer } from "../DataContainer";
import { Feature } from "./Feature";
import { Shape } from "./Shape";
import { Transform } from "./Transform";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";

/**
 * Represents a {@link Convex} {@link Shape}.
 * 
 * A {@link Convex} {@link Shape} is a {@link Shape} that given a line, the line will only 
 * intersect at most 2 non-coincident non-colinear edges.
 * 
 * Working with convex shapes specifically allows collision detection algorithms to be very
 * fast.  If non-convex shapes are required, they are typically handled by attaching multiple
 * convex shapes together.
 */
export interface Convex extends Shape, Transformable, DataContainer {
  /**
   * Returns an array of separating axes to test for this {@link Shape}.
   * 
   * The `foci` parameter is an array of **circular** focal points of the other {@link Shape}.
   * 
   * If foci points are given, this method will return the separating axes for this {@link Shape}'s voronoi regions 
   * also.  The points in the foci array are assumed to be in world space.
   * 
   * The returned axes are normalized and in world space.
   * @param foci The world space points representing foci of curved {@link Shape}s; can be null
   * @param transform The local to world space {@link Transform} of this {@link Convex} {@link Shape}
   * @return The world space axes
   * @throws `Error` if this shape doesn't support this method
   */
  getAxes(foci: Vector2[], transform: Transform): Vector2[];

  /**
   * Returns an array of world space foci points for **circular** curved edges.
   * 
   * This method returns null if the {@link Shape} has zero curved edges.
   * 
   * The returned points are in world space.
   * @param transform The local to world space {@link Transform} of this {@link Convex} {@link Shape}
   * @return The world space foci points 
   * @throws `Error` if this shape doesn't support this method
  */
  getFoci(transform: Transform): Vector2[];

  /**
   * 
   * Returns the {@link Feature} farthest in the direction of the given vector.
   * 
	 * The returned feature is in world space.
   * @param vector The direction
   * @param transform The local to world space {@link Transform} of this {@link Convex} {@link Shape}
   * @return The farthest feature
   */
  getFarthestFeature(vector: Vector2, transform: Transform): Feature;

  /**
	 * Returns the point farthest in the direction of the given vector.  If two points are 
	 * equally distant along the given {@link Vector2} the first one is used.
   * 
	 * The returned point is in world space.
   * @param vector The direction
   * @param transform The local to world space {@link Transform} of this {@link Convex} {@link Shape}
   * @return The farthest point
  */
  getFarthestPoint(vector: Vector2, transform: Transform): Vector2;
}