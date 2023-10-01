import { Copyable } from "../Copyable";
import { Translatable } from "./Translatable";
import { Vector2 } from "./Vector2";

export class AABB implements Translatable, Copyable<AABB> {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;

  constructor(radius: number);
  constructor(center: Vector2 | null, radius: number);
  constructor(min: Vector2, max: Vector2);
  constructor(minX: number, minY: number, maxX: number, maxY: number);
  constructor(aabb: AABB);
  constructor(...args: any[]) {
    if (args.length === 1) {
      if (args[0] instanceof AABB) {
        const aabb = args[0] as AABB;
        this.minX = aabb.minX;
        this.minY = aabb.minY;
        this.maxX = aabb.maxX;
        this.maxY = aabb.maxY;
      } else if (typeof args[0] === "number") {
        return new AABB(null, args[0]);
      }
    } else if (args.length === 2) {
      if (args[0] instanceof Vector2 && args[1] instanceof Vector2) {
        const min = args[0] as Vector2;
        const max = args[1] as Vector2;
        return new AABB(min.x, min.y, max.x, max.y);
      } else {
        const center = args[0] as Vector2 | null;
        const radius = args[1] as number;
        if (radius < 0)
          throw new Error("AABB: Radius cannot be negative.");
        if (center == null) {
          this.minX = -radius;
          this.minY = -radius;
          this.maxX = radius;
          this.maxY = radius;
        } else {
          this.minX = center.x - radius;
          this.minY = center.y - radius;
          this.maxX = center.x + radius;
          this.maxY = center.y + radius;
        }
      }
    } else if (args.length === 4) {
      const minX = args[0] as number;
      const minY = args[1] as number;
      const maxX = args[2] as number;
      const maxY = args[3] as number;
      if (minX > maxX)
        throw new Error("AABB: Minimum X cannot be greater than maximum X.");
      if (minY > maxY)
        throw new Error("AABB: Minimum Y cannot be greater than maximum Y.");
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
    }
  }

  public static createFromPoints(point1: Vector2, point2: Vector2): AABB;
  public static createFromPoints(point1x: number, point1y: number, point2x: number, point2y: number): AABB;
  public static createFromPoints(...args: any[]): AABB {
    if (args.length === 2) {
      const point1 = args[0] as Vector2;
      const point2 = args[1] as Vector2;
      return AABB.createFromPoints(point1.x, point1.y, point2.x, point2.y);
    } else {
      const point1x = args[0] as number;
      const point1y = args[1] as number;
      const point2x = args[2] as number;
      const point2y = args[3] as number;
      const aabb = new AABB(0, 0, 0, 0);
      AABB.setFromPoints(point1x, point1y, point2x, point2y, aabb);
      return aabb;
    }
  }

  public static setFromPoints(point1: Vector2, point2: Vector2, result: AABB): void;
  public static setFromPoints(point1x: number, point1y: number, point2x: number, point2y: number, result: AABB): void;
  public static setFromPoints(...args: any[]): void {
    if (args.length === 3) {
      const point1 = args[0] as Vector2;
      const point2 = args[1] as Vector2;
      const result = args[2] as AABB;
      AABB.setFromPoints(point1.x, point1.y, point2.x, point2.y, result);
    } else {
      let point1x = args[0] as number;
      let point1y = args[1] as number;
      let point2x = args[2] as number;
      let point2y = args[3] as number;
      const result = args[4] as AABB;
      if (point2x < point1x) {
        const temp = point1x;
        point1x = point2x;
        point2x = temp;
      }

      if (point2y < point1y) {
        const temp = point1y;
        point1y = point2y;
        point2y = temp;
      }

      result.minX = point1x;
      result.minY = point1y;
      result.maxX = point2x;
      result.maxY = point2y;
    }
  }

  public copy(): AABB {
    return new AABB(this);
  }

  public zero(): void {
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
  }

  public set(aabb: AABB): AABB {
    this.minX = aabb.minX;
    this.minY = aabb.minY;
    this.maxX = aabb.maxX;
    this.maxY = aabb.maxY;
    return this;
  }

  public equals(obj: any): boolean {
    if (obj == null) return false;
    if (this == obj) return true;
    if (!(obj instanceof AABB)) return false;
    const aabb = obj as AABB;
    return this.minX === aabb.minX && this.minY === aabb.minY
      && this.maxX === aabb.maxX && this.maxY === aabb.maxY;
  }

  public translate(vector: Vector2): void;
  public translate(x: number, y: number): void;
  public translate(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.minX += x.x;
      this.minY += x.y;
      this.maxX += x.x;
      this.maxY += x.y;
    } else {
      this.minX += x as number;
      this.minY += y as number;
      this.maxX += x as number;
      this.maxY += y as number;
    }
  }

  public getTranslated(translation: Vector2): AABB {
    return new AABB(this.minX + translation.x,
      this.minY + translation.y,
      this.maxX + translation.x,
      this.maxY + translation.y);
  }

  public getWidth(): number {
    return this.maxX - this.minX;
  }

  public getHeight(): number {
    return this.maxY - this.minY;
  }

  public getPerimeter(): number {
    return 2 * (this.getWidth() + this.getHeight());
  }

  public getArea(): number {
    return this.getWidth() * this.getHeight();
  }

  public union(aabb: AABB): AABB;
  public union(aabb1: AABB, aabb2: AABB): AABB;
  public union(aabb1: AABB, aabb2?: AABB): AABB {
    if (aabb2 == null) {
      return this.union(this, aabb1);
    } else {
      this.minX = Math.min(aabb1.minX, aabb2.minX);
      this.minY = Math.min(aabb1.minY, aabb2.minY);
      this.maxX = Math.max(aabb1.maxX, aabb2.maxX);
      this.maxY = Math.max(aabb1.maxY, aabb2.maxY);
      return this;
    }
  }

  public getUnion(aabb: AABB): AABB {
    return this.copy().union(aabb);
  }

  public intersection(aabb: AABB): AABB;
  public intersection(aabb1: AABB, aabb2: AABB): AABB;
  public intersection(aabb1: AABB, aabb2?: AABB): AABB {
    if (aabb2 == null) {
      return this.intersection(this, aabb1);
    } else {
      this.minX = Math.max(aabb1.minX, aabb2.minX);
      this.minY = Math.max(aabb1.minY, aabb2.minY);
      this.maxX = Math.min(aabb1.maxX, aabb2.maxX);
      this.maxY = Math.min(aabb1.maxY, aabb2.maxY);

      if (this.minX > this.maxX || this.minY > this.maxY) {
        this.minX = 0.0;
        this.minY = 0.0;
        this.maxX = 0.0;
        this.maxY = 0.0;
      }
      return this;
    }
  }

  public getIntersection(aabb: AABB): AABB {
    return this.copy().intersection(aabb);
  }

  public expand(expansion: number): AABB {
    const e = expansion * 0.5;
    this.minX -= e;
    this.minY -= e;
    this.maxX += e;
    this.maxY += e;
    if (expansion < 0) {
      if (this.minX > this.maxX) {
        const mid = (this.minX + this.maxX) * 0.5;
        this.minX = mid;
        this.maxX = mid;
      }
      if (this.minY > this.maxY) {
        const mid = (this.minY + this.maxY) * 0.5;
        this.minY = mid;
        this.maxY = mid;
      }
    }
    return this;
  }

  public getExpanded(expansion: number): AABB {
    return this.copy().expand(expansion);
  }

  public overlaps(aabb: AABB): boolean {
    return this.minX <= aabb.maxX &&
      this.maxX >= aabb.minX &&
      this.minY <= aabb.maxY &&
      this.maxY >= aabb.minY;
  }

  public contains(aabb: AABB): boolean;
  public contains(point: Vector2): boolean;
  public contains(x: number, y: number): boolean;
  public contains(x: unknown, y?: unknown): boolean {
    if (x instanceof AABB) {
      const aabb = x as AABB;
      return this.minX <= aabb.minX && this.minY <= aabb.minY
        && this.maxX >= aabb.maxX && this.maxY >= aabb.maxY;
    } else if (x instanceof Vector2) {
      return this.contains(x.x, x.y);
    } else {
      return this.minX <= (x as number) &&
        this.maxX >= (x as number) &&
        this.minY <= (y as number) &&
        this.maxY >= (y as number);
    }
  }

  public isDegenerate(error?: number): boolean {
    if (error == null) error = 0;
    return Math.abs(this.maxX - this.minX) <= error || Math.abs(this.maxY - this.minY) <= error;
  }

  public getCenter(): Vector2 {
    return new Vector2((this.minX + this.maxX) * 0.5, (this.minY + this.maxY) * 0.5);
  }

  public getMinX(): number {
    return this.minX;
  }

  public getMinY(): number {
    return this.minY;
  }

  public getMaxX(): number {
    return this.maxX;
  }

  public getMaxY(): number {
    return this.maxY;
  }
}