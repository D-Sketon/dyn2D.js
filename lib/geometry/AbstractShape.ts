import { Shape } from "./Shape";
import { Transform } from "./Transform";
import { Vector2 } from "./Vector2";
import { AABB } from "./AABB";
import { Interval } from "./Interval";
import { Mass } from "./Mass";
import { Rotation } from "./Rotation";

export abstract class AbstractShape implements Shape {
  static readonly IDENTITY: Transform = new Transform();

  center: Vector2;
  radius: number;
  userData: any;

  constructor(radius: number);
  constructor(center: Vector2, radius: number);
  constructor(center: Vector2 | number, radius?: number) {
    if (typeof center === "number") {
      this.center = new Vector2();
      this.radius = center;
    } else {
      this.center = center;
      this.radius = radius!;
    }
    this.userData = null;
  }

  getCenter(): Vector2 {
    return this.center;
  }

  getRadius(): number;
  getRadius(center: Vector2): number;
  getRadius(center?: unknown): number {
    return this.radius;
  }

  rotateAboutCenter(theta: number): void {
    this.rotate(theta, this.center.x, this.center.y);
  }

  project(vector: Vector2): Interval;
  project(vector: Vector2, transform: Transform): Interval;
  project(vector: Vector2, transform?: Transform): Interval {
    if (transform == null) {
      return this.project(vector, AbstractShape.IDENTITY);
    }
  }

  contains(point: Vector2): boolean;
  contains(point: Vector2, transform: Transform): boolean;
  contains(point: Vector2, transform: Transform, inclusive: boolean): boolean;
  contains(point: Vector2, transform?: Transform, inclusive?: boolean): boolean {
    if (transform == null && inclusive == null) {
      return this.contains(point, AbstractShape.IDENTITY, true);
    }
    if (inclusive == null) {
      return this.contains(point, transform, true);
    }
  }

  abstract getArea(): number;

  abstract createMass(density: number): Mass;

  createAABB(): AABB;
  createAABB(transform: Transform): AABB;
  createAABB(transform?: Transform): AABB {
    if (transform == null) {
      return this.createAABB(AbstractShape.IDENTITY);
    }
    const aabb = new AABB(0, 0, 0, 0);
    this.computeAABB(aabb, transform);
    return aabb;
  }

  computeAABB(aabb: AABB): void;
  computeAABB(aabb: AABB, transform: Transform): void;
  computeAABB(aabb: AABB, transform?: Transform): void {
    if (transform == null) {
      this.computeAABB(aabb, AbstractShape.IDENTITY);
    }
  }

  rotate(theta: number): void;
  rotate(rotation: Rotation): void;
  rotate(theta: number, vector: Vector2): void;
  rotate(rotation: Rotation, vector: Vector2): void;
  rotate(theta: number, x: number, y: number): void;
  rotate(rotation: Rotation, x: number, y: number): void;
  rotate(rotation: unknown, x?: unknown, y?: unknown): void {
    if (rotation instanceof Rotation && typeof x === "number" && typeof y === "number") {
      if (!this.center.equals(x, y)) {
        this.center.rotate(rotation, x, y);
      }
    } else if (typeof rotation === "number" && typeof x === "number" && typeof y === "number") {
      this.rotate(new Rotation(rotation), x, y);
    } else if (rotation instanceof Rotation && x instanceof Vector2) {
      this.rotate(rotation, x.x, x.y);
    } else if (typeof rotation === "number" && x instanceof Vector2) {
      this.rotate(rotation, x.x, x.y);
    } else if (rotation instanceof Rotation) {
      this.rotate(rotation, 0.0, 0.0);
    } else if (typeof rotation === "number") {
      this.rotate(rotation, 0, 0);
    }
  }

  translate(vector: Vector2): void;
  translate(x: number, y: number): void;
  translate(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.translate(x.x, x.y);
    } else if (typeof x === "number" && typeof y === "number") {
      this.center.add(x as number, y as number);
    }
  }

  setUserData(data: any): void {
    this.userData = data;
  }

  getUserData(): any {
    return this.userData;
  }

  toString(): string {
    return `AbstractShape[center=${this.center}, radius=${this.radius}, userData=${this.userData}]`;
  }
}