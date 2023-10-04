import { Rotation } from "./Rotation";
import { Vector2 } from "./Vector2";

/**
 * Interface representing an object that can be rotated.
 */
export interface Rotatable {
  /**
   * Method to rotate this object by the given angle.
   * @param theta The angle of rotation in radians.
   */
  rotate(theta: number): void;
  /**
   * Method to rotate this object by the given {@link Rotation}.
   * @param rotation The {@link Rotation} to rotate by.
   */
  rotate(rotation: Rotation): void;
  /**
   * Method to rotate this object by the given angle about the given point.
   * @param theta The angle of rotation in radians.
   * @param vector The {@link Vector2} to rotate about.
   */
  rotate(theta: number, vector: Vector2): void;
  /**
   * Method to rotate this object by the given {@link Rotation} about the given point.
   * @param rotation The {@link Rotation} to rotate by.
   * @param vector The {@link Vector2} to rotate about.
   */
  rotate(rotation: Rotation, vector: Vector2): void;
  /**
   * Method to rotate this object by the given angle about the given point.
   * @param theta The angle of rotation in radians.
   * @param x The x-coordinate of the point to rotate about.
   * @param y The y-coordinate of the point to rotate about.
   */
  rotate(theta: number, x: number, y: number): void;
  /**
   * Method to rotate this object by the given {@link Rotation} about the given point.
   * @param rotation The {@link Rotation} to rotate by.
   * @param x The x-coordinate of the point to rotate about.
   * @param y The y-coordinate of the point to rotate about.
   */
  rotate(rotation: Rotation, x: number, y: number): void;
}