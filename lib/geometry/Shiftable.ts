import { Vector2 } from "./Vector2";

/**
 * Represents an object that can be shifted in the x and y plane.
 */
export interface Shiftable {
  /**
   * Translates the object by the given amount along the x and y axes.
   * @param shift The amount to shift along the x and y axes
   */
  shift(shift: Vector2): void;
}