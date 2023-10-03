import { DataContainer } from "../DataContainer";
import { AABB } from "./AABB";
import { AbstractShape } from "./AbstractShape";
import { Convex } from "./Convex";
import { EdgeFeature } from "./EdgeFeature";
import { Ellipse } from "./Ellipse";
import { Feature } from "./Feature";
import { Interval } from "./Interval";
import { Mass } from "./Mass";
import { PointFeature } from "./PointFeature";
import { Rotation } from "./Rotation";
import { Segment } from "./Segment";
import { Shape } from "./Shape";
import { Transform } from "./Transform";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";

export class HalfEllipse extends AbstractShape implements Convex, Shape, Transformable, DataContainer {

  static readonly INERTIA_CONSTANT = Math.PI / 8.0 - 8.0 / (9.0 * Math.PI);

  halfWidth: number;
  height: number;
  rotation: Rotation;
  ellipseCenter: Vector2;
  vertexLeft: Vector2;
  vertexRight: Vector2;

  constructor(width: number, height: number) {
    HalfEllipse.validate(width, height);
    const center = new Vector2(0, (4.0 * height) / (3.0 * Math.PI));
    const vertexLeft = new Vector2(-width * 0.5, 0);
    const vertexRight = new Vector2(width * 0.5, 0);
    super(center, center.distance(vertexRight));
    this.height = height;
    this.halfWidth = width * 0.5;
    this.ellipseCenter = new Vector2();
    this.rotation = new Rotation();
    this.vertexLeft = vertexLeft;
    this.vertexRight = vertexRight;
  }

  private static validate(width: number, height: number): boolean {
    if (width <= 0) {
      throw new Error("HalfEllipse: Width must be non-negative.");
    }
    if (height <= 0) {
      throw new Error("HalfEllipse: Height must be non-negative.");
    }
    return true;
  }

  public toString(): string {
    return `HalfEllipse[center=${this.center.toString()}, width=${this.halfWidth * 2}, height=${this.height}]`;
  }

  private getMaxDistanceToVertices(point: Vector2): number {
    const leftR = point.distanceSquared(this.vertexLeft);
    const rightR = point.distanceSquared(this.vertexRight);
    const r2 = Math.max(leftR, rightR);
    return Math.sqrt(r2);
  }

  private getMaxDistanceEllipse(point: Vector2): number {
    const p = point.difference(this.ellipseCenter).inverseRotate(this.rotation);
    const fp = Ellipse.getFarthestPointOnEllipse(this.halfWidth, this.height, p);
    return p.distance(fp);
  }

  private getMaxDistanceHalfEllipse(point: Vector2): number {
    const a = this.halfWidth;
    const b = this.height;

    const p = point.difference(this.ellipseCenter).inverseRotate(this.rotation);

    if (p.y < 0) {
      return this.getMaxDistanceEllipse(point);
    }
    if (p.x < 0) {
      p.x = -p.x;
    }
    const ab = (b * b - a * a);
    const ab2r3 = Math.cbrt(ab * ab);
    const ax = a * p.x;
    const ax2r3 = Math.cbrt(ax * ax);
    let top = ab2r3 - ax2r3;

    if (top < 0) {
      return this.getMaxDistanceToVertices(point);
    }

    top = Math.sqrt(top);
    const ey = (top * top * top) / b;

    if (p.y > ey) {
      return this.getMaxDistanceToVertices(point);
    }

    if (Math.abs(p.x) < 1e-16) {
      const d1 = this.height - p.y;
      const d2 = this.getMaxDistanceToVertices(point);
      return d1 > d2 ? d1 : d2;
    }

    const xr3 = Math.cbrt(p.x);
    const a2r3 = Math.cbrt(a * a);
    const m = (-a2r3 * top) / (b * xr3);

    const a2 = a * a;
    const b2 = b * b;
    const m2 = m * m;
    const x2 = p.x * p.x;
    const y2 = ey * ey;

    const qa = a2 * m2 + b2;
    const qb = 2 * a2 * m * ey - 2 * a2 * m2 * p.x;
    const qc = a2 * m2 * x2 - 2 * a2 * m * p.x * ey + a2 * y2 - b2 * a2;

    const b24ac = qb * qb - 4 * qa * qc;
    if (b24ac < 0) {
      return this.getMaxDistanceToVertices(point);
    }

    const xmin = (-qb - Math.sqrt(b24ac)) / (2 * qa);
    const xmax = 0;

    const s = Ellipse.getFarthestPointOnBoundedEllipse(xmin, xmax, a, b, p);

    const d1 = s.distance(p);
    const d2 = this.getMaxDistanceToVertices(point);

    return d1 > d2 ? d1 : d2;
  }

  public getRadius(center?: Vector2): number {
    if (center == null) {
      return super.getRadius();
    }
    if (this.halfWidth >= this.height) {
      if (Segment.getLocation(center, this.vertexLeft, this.vertexRight) <= 0) {
        return this.getMaxDistanceEllipse(center);
      } else {
        return this.getMaxDistanceToVertices(center);
      }
    } else {
      return this.getMaxDistanceHalfEllipse(center);
    }
  }

  public getAxes(foci: Vector2[], transform: Transform): Vector2[] {
    throw new Error("HalfEllipse: SAT does not support the HalfEllipse shape.");
  }

  public getFoci(transform: Transform): Vector2[] {
    throw new Error("HalfEllipse: SAT does not support the HalfEllipse shape.");
  }

  public getFarthestFeature(vector: Vector2, transform: Transform): Feature {
    const localAxis = transform.getInverseTransformedR(vector);
    localAxis.inverseRotate(this.rotation);

    if (localAxis.y > 0) {
      this.getFarthestPointOnAlignedEllipse(localAxis);
      localAxis.rotate(this.rotation);
      localAxis.add(this.ellipseCenter);
      transform.transform(localAxis);
      return new PointFeature(localAxis);
    } else {
      const p1 = transform.getTransformed(this.vertexLeft);
      const p2 = transform.getTransformed(this.vertexRight);

      const vp1 = new PointFeature(p1, 0);
      const vp2 = new PointFeature(p2, 1);

      const vmax = (localAxis.x <= 0) ? vp1 : vp2;

      return new EdgeFeature(vp1, vp2, vmax, p1.to(p2), 0);
    }
  }

  private _getFarthestPoint(localAxis: Vector2): Vector2 {
    localAxis.inverseRotate(this.rotation);
    if (localAxis.y <= 0) {
      if (localAxis.x >= 0) {
        localAxis.set(this.vertexRight);
      } else {
        localAxis.set(this.vertexLeft);
      }
      return localAxis;
    }
    this.getFarthestPointOnAlignedEllipse(localAxis);
    localAxis.rotate(this.rotation);
    localAxis.add(this.ellipseCenter);
    return localAxis;
  }

  private getFarthestPointOnAlignedEllipse(localAxis: Vector2): void {
    localAxis.x *= this.halfWidth;
    localAxis.y *= this.height;
    localAxis.normalize();
    localAxis.x *= this.halfWidth;
    localAxis.y *= this.height;
  }

  public getFarthestPoint(vector: Vector2, transform: Transform): Vector2 {
    let localAxis = transform.getInverseTransformedR(vector);
    localAxis = this._getFarthestPoint(localAxis);
    transform.transform(localAxis);
    return localAxis;
  }

  public getArea(): number {
    return Math.PI * this.halfWidth * this.height * 0.5;
  }

  public createMass(density: number): Mass {
    const area = Math.PI * this.halfWidth * this.height;
    const m = area * density * 0.5;
    const I = m * (this.halfWidth * this.halfWidth + this.height * this.height) * HalfEllipse.INERTIA_CONSTANT;
    return new Mass(this.center, m, I);
  }

  public contains(point: Vector2, transform?: Transform, inclusive?: boolean): boolean {
    if (transform == null || inclusive === void 0) {
      return super.contains(point, transform, inclusive);
    }
    const localPoint = transform.getInverseTransformed(point);
    localPoint.inverseRotate(this.rotation, this.ellipseCenter);

    const x = (localPoint.x - this.ellipseCenter.x);
    const y = (localPoint.y - this.ellipseCenter.y);

    if (y < 0)
      return false;

    const x2 = x * x;
    const y2 = y * y;
    const a2 = this.halfWidth * this.halfWidth;
    const b2 = this.height * this.height;
    const value = x2 / a2 + y2 / b2;

    return inclusive ? value <= 1.0 : value < 1.0;
  }

  public project(vector: Vector2, transform?: Transform): Interval {
    if (transform == null) {
      return super.project(vector, transform);
    }
    const p1 = this.getFarthestPoint(vector, transform);
    const p2 = this.getFarthestPoint(vector.getNegative(), transform);
    const d1 = p1.dot(vector);
    const d2 = p2.dot(vector);
    return new Interval(d2, d1);
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
      const hh2 = this.height * this.height;

      const aabbHalfWidth = Math.sqrt(x2 * hw2 + y2 * hh2);
      const aabbHalfHeight = Math.sqrt(y2 * hw2 + x2 * hh2);

      const cx = transform.getTransformedX(this.ellipseCenter);
      const cy = transform.getTransformedY(this.ellipseCenter);

      let minX = cx - aabbHalfWidth;
      let minY = cy - aabbHalfHeight;
      let maxX = cx + aabbHalfWidth;
      let maxY = cy + aabbHalfHeight;

      if (u.y > 0) {
        if (u.x > 0) {
          maxX = transform.getTransformedX(this.vertexRight);
          minY = transform.getTransformedY(this.vertexLeft);
        } else {
          maxX = transform.getTransformedX(this.vertexLeft);
          maxY = transform.getTransformedY(this.vertexRight);
        }
      } else {
        if (u.x > 0) {
          minX = transform.getTransformedX(this.vertexLeft);
          minY = transform.getTransformedY(this.vertexRight);
        } else {
          minX = transform.getTransformedX(this.vertexRight);
          maxY = transform.getTransformedY(this.vertexLeft);
        }
      }

      aabb.minX = minX;
      aabb.minY = minY;
      aabb.maxX = maxX;
      aabb.maxY = maxY;
    }
  }

  rotate(rotation: unknown, x?: unknown, y?: unknown): void {
    if (rotation instanceof Rotation && typeof x === "number" && typeof y === "number") {
      super.rotate(rotation, x, y);
      this.rotation.rotate(rotation);

      this.vertexLeft.rotate(rotation, x, y);
      this.vertexRight.rotate(rotation, x, y);
      this.ellipseCenter.rotate(rotation, x, y);
    } else {
      super.rotate(rotation as any, x as any, y as any);
    }
  }

  public translate(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.translate(x.x, x.y);
    } else if (typeof x === "number" && typeof y === "number") {
      super.translate(x, y);
      this.vertexLeft.add(x, y);
      this.vertexRight.add(x, y);
      this.ellipseCenter.add(x, y);
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
    return this.height;
  }

  public getHalfWidth(): number {
    return this.halfWidth;
  }

  public getEllipseCenter(): Vector2 {
    return this.ellipseCenter;
  }
}