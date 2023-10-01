import { DataContainer } from "../DataContainer";
import { Feature } from "./Feature";
import { Shape } from "./Shape";
import { Transform } from "./Transform";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";

export interface Convex extends Shape, Transformable, DataContainer {
  getAxes(foci: Vector2[], transform: Transform): Vector2[];
  getFoci(transform: Transform): Vector2[];
  getFarthestFeature(vector: Vector2, transform: Transform): Feature;
  getFarthestPoint(vector: Vector2, transform: Transform): Vector2;
}