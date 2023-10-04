import { DataContainer } from "../DataContainer";
import { Shape } from "./Shape";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";

/**
 * Represents a shape that is defined by vertices with line segment connections
 */
export interface Wound extends Shape, Transformable, DataContainer{
  /**
   * Returns an iterator for the vertices.
   * @returns An iterator for the vertices.
   */
  getVertexIterator(): Iterator<Vector2>;
  /**
   * Returns an iterator for the normals.
   * @returns An iterator for the normals.
   */
  getNormalIterator(): Iterator<Vector2>;
  /**
   * Returns the array of vertices in local coordinates.
   * @returns The array of vertices in local coordinates.
   */
  getVertices(): Vector2[];
  /**
   * Returns the array of normals in local coordinates.
   * @returns The array of normals in local coordinates.
   */
  getNormals(): Vector2[];
}