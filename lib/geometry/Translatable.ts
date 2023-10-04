import { Vector2 } from "./Vector2";

/**
 * Represents an object that can be translated or moved in the x-y plane.
 */
export interface Translatable {
  /**
   * @overload
   * Method to translate this object by the given {@link Vector2}
   * @param vector The {@link Vector2} representing the translation
   * 
   */
  translate(vector: Vector2): void;
  /**
   * @overload
   * Method to translate this object by the given x and y components
   * @param x The x component of the translation
   * @param y The y component of the translation
   */
  translate(x: number, y: number): void;
}