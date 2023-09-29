import { Vector2 } from "./Vector2";

export interface Shiftable {
  shift(shift: Vector2): void;
}