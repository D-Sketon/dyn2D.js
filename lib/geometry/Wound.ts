import { DataContainer } from "../DataContainer";
import { Shape } from "./Shape";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";

export interface Wound extends Shape, Transformable, DataContainer{
  getVertexIterator(): Iterator<Vector2>;
  getNormalIterator(): Iterator<Vector2>;
  getVertices(): Vector2[];
  getNormals(): Vector2[];
}