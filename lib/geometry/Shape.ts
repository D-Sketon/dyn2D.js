import { DataContainer } from "../DataContainer";
import { Interval } from "./Interval";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";
import { Mass } from "./Mass";
import { AABB } from "./AABB";
import { Transform } from "./Transform";

export interface Shape extends Transformable, DataContainer {
  getCenter(): Vector2;

  getRadius(): number;
  getRadius(center: Vector2): number;

  rotateAboutCenter(theta: number): void;

  project(vector: Vector2): Interval;
  project(vector: Vector2, transform: Transform): Interval;

  contains(point: Vector2): boolean;
  contains(point: Vector2, transform: Transform): boolean;
  contains(point: Vector2, transform: Transform, inclusive: boolean): boolean;

  getArea(): number;

  createMass(density: number): Mass;
  
  createAABB(): AABB;
  createAABB(transform: Transform): AABB;

  computeAABB(aabb: AABB): void;
  computeAABB(aabb: AABB, transform: Transform): void;
}