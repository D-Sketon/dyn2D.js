import { Vector2 } from "./Vector2";

export interface Translatable {
  translate(vector: Vector2): void;
  translate(x: number, y: number): void;
}