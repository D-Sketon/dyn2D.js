import { Rotation } from "./Rotation";
import { Vector2 } from "./Vector2";

export interface Rotatable {
  rotate(theta: number): void;
  rotate(rotation: Rotation): void;
  rotate(theta: number, vector: Vector2): void;
  rotate(rotation: Rotation, vector: Vector2): void;
  rotate(theta: number, x: number, y: number): void;
  rotate(rotation: Rotation, x: number, y: number): void;
}