import { DataContainer } from "../DataContainer";
import { AABB } from "./AABB";
import { AbstractShape } from "./AbstractShape";
import { Convex } from "./Convex";
import { Feature } from "./Feature";
import { Interval } from "./Interval";
import { Mass } from "./Mass";
import { PointFeature } from "./PointFeature";
import { Rotation } from "./Rotation";
import { Shape } from "./Shape";
import { Transform } from "./Transform";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";
export class Ellipse extends AbstractShape implements Convex, Shape, Transformable, DataContainer {

  static readonly INV_GOLDEN_RATIO = 1.0 / ((Math.sqrt(5.0) + 1.0) * 0.5);

  static readonly FARTHEST_POINT_MAX_ITERATIONS = 50;
  static readonly FARTHEST_POINT_EPSILON = 1e-8;

  halfWidth: number;
  halfHeight: number;
  rotation: Rotation;

  constructor(width: number, height: number) {
    Ellipse.validate(width, height);
    super(Math.max(width, height) * 0.5);
    this.halfWidth = width * 0.5;
    this.halfHeight = height * 0.5;
    this.rotation = new Rotation();
  }

  public static validate(width: number, height: number): boolean {
    if (width <= 0) {
      throw new Error("Ellipse: Width must be positive.");
    }
    if (height <= 0) {
      throw new Error("Ellipse: Height must be positive.");
    }
    return true;
  }

  public static getFarthestPointOnEllipse(a: number, b: number, point: Vector2): Vector2 {
    let px = point.x;
    let py = point.y;
    let flipped = false;
    if (a < b) {
      let temp = a;
      a = b;
      b = temp;

      temp = px;
      px = -py;
      py = temp;

      flipped = true;
    }

    let quadrant = 3;
    if (px >= 0 && py >= 0) {
      quadrant = 1;
      px = -px;
      py = -py;
    } else if (px >= 0 && py <= 0) {
      quadrant = 4;
      px = -px;
    } else if (px <= 0 && py >= 0) {
      quadrant = 2;
      py = -py;
    }

    let p = null;
    if (py == 0.0) {
      p = new Vector2(px < 0 ? a : -a, 0);
    } else {
      p = Ellipse.getFarthestPointOnBoundedEllipse(0, a, a, b, new Vector2(px, py));
    }

    if (quadrant == 1) {
      p.x *= -1;
      p.y *= -1;
    } else if (quadrant == 2) {
      p.y *= -1;
    } else if (quadrant == 4) {
      p.x *= -1;
    }

    if (flipped) {
      let temp = p.x;
      p.x = p.y;
      p.y = -temp;
    }
    return p;
  }

  public static getFarthestPointOnBoundedEllipse(xmin: number, xmax: number, a: number, b: number, point: Vector2): Vector2 {
    let px = point.x;
    let py = point.y;
    let x0 = xmin;
    let x1 = xmax;
    const q = new Vector2(px, py);
    const p = new Vector2();
    const aa = a * a;
    const ba = b / a;

    let x2 = x1 - (x1 - x0) * Ellipse.INV_GOLDEN_RATIO;
    let x3 = x0 + (x1 - x0) * Ellipse.INV_GOLDEN_RATIO;
    let fx2 = Ellipse.getSquaredDistance(aa, ba, x2, q, p);
    let fx3 = Ellipse.getSquaredDistance(aa, ba, x3, q, p);

    for (let i = 0; i < Ellipse.FARTHEST_POINT_MAX_ITERATIONS; i++) {
      if (fx2 < fx3) {
        if (Math.abs(x1 - x2) <= Ellipse.FARTHEST_POINT_EPSILON) {
          break;
        }
        x0 = x2;
        x2 = x3;
        fx2 = fx3;
        x3 = x0 + (x1 - x0) * Ellipse.INV_GOLDEN_RATIO;
        fx3 = Ellipse.getSquaredDistance(aa, ba, x3, q, p);
      } else {
        if (Math.abs(x3 - x0) <= Ellipse.FARTHEST_POINT_EPSILON) {
          break;
        }
        x1 = x3;
        x3 = x2;
        fx3 = fx2;
        x2 = x1 - (x1 - x0) * Ellipse.INV_GOLDEN_RATIO;
        fx2 = Ellipse.getSquaredDistance(aa, ba, x2, q, p);
      }
    }
    return p;
  }

  private static getSquaredDistance(a2: number, ba: number, x: number, q: Vector2, p: Vector2): number {
    let a2x2 = a2 - (x * x);
    if (a2x2 < 0) {
      a2x2 = 0;
    }
    const sa2x2 = Math.sqrt(a2x2);
    const y = ba * sa2x2;

    const xx = (q.x - x);
    const yy = (q.y - y);
    const d2 = xx * xx + yy * yy;
    p.x = x;
    p.y = y;
    return d2;
  }

  public getRadius(center?: Vector2): number {
    if (center == null) {
      return super.getRadius();
    }
    const p = center.difference(this.center).inverseRotate(this.rotation);
    const fp = Ellipse.getFarthestPointOnEllipse(this.halfWidth, this.halfHeight, p);
    return p.distance(fp);
  }

  public toString(): string {
    return `Ellipse[center=${this.center.toString()}, width=${this.halfWidth * 2}, height=${this.halfHeight * 2}]`;
  }

  public getAxes(foci: Vector2[], transform: Transform): Vector2[] {
    throw new Error("Ellipse: SAT does not support the Ellipse shape.");
  }

  public getFoci(transform: Transform): Vector2[] {
    throw new Error("Ellipse: SAT does not support the Ellipse shape.");
  }

  public getFarthestFeature(vector: Vector2, transform: Transform): Feature {
    const farthest = this.getFarthestPoint(vector, transform);
    return new PointFeature(farthest);
  }

  private _getFarthestPoint(localAxis: Vector2): Vector2 {
    if (this.rotation.isIdentity()) {
      this.getFarthestPointOnAlignedEllipse(localAxis);
    } else {
      localAxis.inverseRotate(this.rotation);
      this.getFarthestPointOnAlignedEllipse(localAxis);
      localAxis.rotate(this.rotation);
    }
    localAxis.add(this.center);
    return localAxis;
  }

  private getFarthestPointOnAlignedEllipse(localAxis: Vector2): void {
    localAxis.x *= this.halfWidth;
    localAxis.y *= this.halfHeight;
    localAxis.normalize();
    localAxis.x *= this.halfWidth;
    localAxis.y *= this.halfHeight;
  }

  public getFarthestPoint(vector: Vector2, transform: Transform): Vector2 {
    let localAxis = transform.getInverseTransformedR(vector);
    localAxis = this._getFarthestPoint(localAxis);
    transform.transform(localAxis);
    return localAxis;
  }

  public getArea(): number {
    return Math.PI * this.halfWidth * this.halfHeight;
  }

  public createMass(density: number): Mass {
    const area = Math.PI * this.halfWidth * this.halfHeight;
    const m = area * density;
    const I = m * (this.halfWidth * this.halfWidth + this.halfHeight * this.halfHeight) / 4.0;
    return new Mass(this.center, m, I);
  }

  public contains(point: Vector2, transform?: Transform, inclusive?: boolean): boolean {
    if (transform == null || inclusive === void  0) {
      return super.contains(point, transform, inclusive);
    }
    const localPoint = transform.getInverseTransformed(point);
    localPoint.inverseRotate(this.rotation, this.center);

    const x = (localPoint.x - this.center.x);
    const y = (localPoint.y - this.center.y);
    const x2 = x * x;
    const y2 = y * y;
    const a2 = this.halfWidth * this.halfWidth;
    const b2 = this.halfHeight * this.halfHeight;
    const value = x2 / a2 + y2 / b2;

    return inclusive ? value <= 1.0 : value < 1.0;
  }

  public project(vector: Vector2, transform?: Transform): Interval {
    if (transform == null) {
      return super.project(vector, transform);
    }
    const p1 = this.getFarthestPoint(vector, transform);
    const center = transform.getTransformed(this.center);
    const c = center.dot(vector);
    const d = p1.dot(vector);
    return new Interval(2 * c - d, d);
  }

  public computeAABB(aabb: AABB, transform?: Transform): void {
    if (transform == null) {
      this.computeAABB(aabb, AbstractShape.IDENTITY);
    } else {
      const u = this.rotation.toVector();
      transform.transformR(u);

      const x2 = u.x * u.x;
      const y2 = u.y * u.y;

      const hw2 = this.halfWidth * this.halfWidth;
      const hh2 = this.halfHeight * this.halfHeight;

      const aabbHalfWidth = Math.sqrt(x2 * hw2 + y2 * hh2);
      const aabbHalfHeight = Math.sqrt(y2 * hw2 + x2 * hh2);

      const cx = transform.getTransformedX(this.center);
      const cy = transform.getTransformedY(this.center);

      aabb.minX = cx - aabbHalfWidth;
      aabb.minY = cy - aabbHalfHeight;
      aabb.maxX = cx + aabbHalfWidth;
      aabb.maxY = cy + aabbHalfHeight;
    }
  }

  public rotate(rotation: unknown, x?: unknown, y?: unknown): void {
    if (rotation instanceof Rotation && typeof x === "number" && typeof y === "number") {
      super.rotate(rotation, x, y);
      this.rotation.rotate(rotation);
    } else {
      super.rotate(rotation as any, x as any, y as any);
    }
  }

  public getRotationAngle(): number {
    return this.rotation.toRadians();
  }

  public getRotation(): Rotation {
    return this.rotation.copy();
  }

  public getWidth(): number {
    return this.halfWidth * 2;
  }

  public getHeight(): number {
    return this.halfHeight * 2;
  }

  public getHalfWidth(): number {
    return this.halfWidth;
  }

  public getHalfHeight(): number {
    return this.halfHeight;
  }
}