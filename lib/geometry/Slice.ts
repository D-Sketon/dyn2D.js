import { DataContainer } from "../DataContainer";
import { AABB } from "./AABB";
import { AbstractShape } from "./AbstractShape";
import { Convex } from "./Convex";
import { Feature } from "./Feature";
import { getRotationRadius } from "./Geometry";
import { Interval } from "./Interval";
import { Mass } from "./Mass";
import { PointFeature } from "./PointFeature";
import { Rotation } from "./Rotation";
import { Segment } from "./Segment";
import { Shape } from "./Shape";
import { Transform } from "./Transform";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";

/**
 * Implementation of a Slice {@link Convex} {@link Shape}.
 * 
 * A slice is a piece of a {@link Circle}.
 */
export class Slice extends AbstractShape implements Convex, Shape, Transformable, DataContainer {
  /**
   * Half the angle of the {@link Slice} in radians.
   */
  alpha: number;
  /**
   * Cosine of alpha.
   */
  cosAlpha: number;
  /**
   * The radius of the {@link Circle} that this slice is a part of.
   */
  sliceRadius: number;
  /**
   * The vertices of the {@link Slice}.
   */
  vertices: Vector2[];
  /**
   * The normals of the {@link Slice}.
   */
  normals: Vector2[];
  /**
   * The local rotation of the {@link Slice}.
   */
  rotation: Rotation;

  /**
   * Full constructor.
   * @param radius The radius of the {@link Circle} that this slice is a part of.
   * @param theta The angle of the {@link Slice} in radians; must be greater than zero and less than or equal to &pi;
   * @throws `Error` radius is less than or equal to zero
   * @throws `Error` theta is less than or equal to zero
   * @throws `Error` theta is greater than &pi;
   */
  constructor(radius: number, theta: number) {
    Slice.validate(radius, theta);
    const center = new Vector2(2.0 * radius * Math.sin(theta * 0.5) / (1.5 * theta), 0);
    super(center, Math.max(center.x, center.distance(new Vector2(radius, 0).rotate(0.5 * theta))));
    this.sliceRadius = radius;
    this.alpha = theta * 0.5;

    const x = radius * (this.cosAlpha = Math.cos(this.alpha));
    const y = radius * Math.sin(this.alpha);
    this.vertices = [
      new Vector2(),
      new Vector2(x, y),
      new Vector2(x, -y)];

    const v1 = this.vertices[1].to(this.vertices[0]);
    const v2 = this.vertices[0].to(this.vertices[2]);
    v1.left().normalize();
    v2.left().normalize();
    this.normals = [v1, v2];

    this.rotation = new Rotation();
  }

  private static validate(radius: number, theta: number): boolean {
    if (radius <= 0) {
      throw new Error("Slice: Radius must be positive.");
    }
    if (theta <= 0) {
      throw new Error("Slice: Theta must be positive.");
    }
    if (theta > Math.PI) {
      throw new Error("Slice: Theta must be less than or equal to PI.");
    }
    return true;
  }

  public toString(): string {
    return `Slice[${super.toString()}, radius=${this.sliceRadius}, theta=${this.getTheta()}]`;
  }

  public getAxes(foci: Vector2[], transform: Transform): Vector2[] {
    const fociSize = foci != null ? foci.length : 0;
    const size = this.vertices.length;
    const axes = new Array<Vector2>(2 + fociSize);
    let n = 0;

    axes[n++] = transform.getTransformedR(this.normals[0]);
    axes[n++] = transform.getTransformedR(this.normals[1]);

    const focus = transform.getTransformed(this.vertices[0]);
    for (let i = 0; i < fociSize; i++) {
      const f = foci[i];
      let closest = focus;
      let d = f.distanceSquared(closest);
      for (let j = 1; j < size; j++) {
        let p = this.vertices[j];
        p = transform.getTransformed(p);
        const dt = f.distanceSquared(p);
        if (dt < d) {
          closest = p;
          d = dt;
        }
      }
      const axis = f.to(closest);
      axis.normalize();
      axes[n++] = axis;
    }
    return axes;
  }

  public getFoci(transform: Transform): Vector2[] {
    return [transform.getTransformed(this.vertices[0])];
  }

  public getFarthestFeature(vector: Vector2, transform: Transform): Feature {
    const localn = transform.getInverseTransformedR(vector);
    let localnRotated: Vector2;

    localn.normalize();

    if (!this.rotation.isIdentity()) {
      localnRotated = localn.copy().inverseRotate(this.rotation);
    } else {
      localnRotated = localn;
    }

    if (localnRotated.x < this.cosAlpha) {
      if (this.cosAlpha <= 1.0e-6) {
        return Segment.getFarthestFeature(this.vertices[1], this.vertices[2], vector, transform);
      }

      if (localnRotated.y > 0) {
        return Segment.getFarthestFeature(this.vertices[0], this.vertices[1], vector, transform);
      } else if (localnRotated.y < 0) {
        return Segment.getFarthestFeature(this.vertices[0], this.vertices[2], vector, transform);
      } else {
        return new PointFeature(transform.getTransformed(this.vertices[0]));
      }
    } else {
      localn.multiply(this.sliceRadius).add(this.vertices[0]);
      transform.transform(localn);

      return new PointFeature(localn);
    }
  }

  public getFarthestPoint(vector: Vector2, transform: Transform): Vector2 {
    const localn = transform.getInverseTransformedR(vector);
    let localnRotated: Vector2;

    localn.normalize();

    if (!this.rotation.isIdentity()) {
      localnRotated = localn.copy().inverseRotate(this.rotation);
    } else {
      localnRotated = localn;
    }

    if (localnRotated.x < this.cosAlpha) {
      const edge = this.vertices[0].dot(localn);
      let maxIndex = 0;

      if (localnRotated.y < 0) {
        if (this.vertices[2].dot(localn) > edge) {
          maxIndex = 2;
        }
      } else {
        if (this.vertices[1].dot(localn) > edge) {
          maxIndex = 1;
        }
      }

      const point = new Vector2(this.vertices[maxIndex]);
      transform.transform(point);
      return point;
    } else {
      localn.multiply(this.sliceRadius).add(this.vertices[0]);
      transform.transform(localn);
      return localn;
    }
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
      const minX = this.getFarthestPoint(Vector2.INV_X_AXIS, transform).x;
      const maxX = this.getFarthestPoint(Vector2.X_AXIS, transform).x;

      const minY = this.getFarthestPoint(Vector2.INV_Y_AXIS, transform).y;
      const maxY = this.getFarthestPoint(Vector2.Y_AXIS, transform).y;

      aabb.maxX = maxX;
      aabb.maxY = maxY;
      aabb.minX = minX;
      aabb.minY = minY;
    }
  }

  public getArea(): number {
    return this.sliceRadius * this.sliceRadius * this.alpha;
  }

  public createMass(density: number): Mass {
    const r2 = this.sliceRadius * this.sliceRadius;
    const m = density * r2 * this.alpha;
    const sina = Math.sin(this.alpha);
    const I = density * (1.0 / 18.0 * r2 * r2 * (9.0 * this.alpha * this.alpha - 8.0 * sina * sina) / this.alpha);
    return new Mass(this.center, m, I);
  }

  public getRadius(center?: Vector2): number {
    if (center == null) {
      return super.getRadius();
    }
    if (Segment.getLocation(center, this.vertices[1], this.vertices[0]) <= 0 &&
      Segment.getLocation(center, this.vertices[2], this.vertices[0]) >= 0) {
      return this.sliceRadius + center.distance(this.vertices[0]);
    } else {
      return getRotationRadius(center, this.vertices);
    }
  }

  public contains(point: Vector2, transform?: Transform, inclusive?: boolean): boolean {
    if (transform == null || inclusive === void 0) {
      return super.contains(point, transform, inclusive);
    }
    const lp = transform.getInverseTransformed(point);
    const radiusSquared = this.sliceRadius * this.sliceRadius;
    const v = this.vertices[0].to(lp);

    if (inclusive) {
      if (v.getMagnitudeSquared() > radiusSquared) return false;
    } else {
      if (v.getMagnitudeSquared() >= radiusSquared) return false;
    }

    const l1 = Segment.getLocation(lp, this.vertices[0], this.vertices[1]);
    const l2 = Segment.getLocation(lp, this.vertices[0], this.vertices[2]);

    if (inclusive) {
      if (l1 <= 0 && l2 >= 0) return true;
    } else {
      if (l1 < 0 && l2 > 0) return true;
    }
    return false;
  }

  public rotate(rotation: unknown, x?: unknown, y?: unknown): void {
    if (rotation instanceof Rotation && typeof x === "number" && typeof y === "number") {
      super.rotate(rotation, x, y);
      for (let i = 0; i < this.vertices.length; i++) {
        this.vertices[i].rotate(rotation, x, y);
      }
      for (let i = 0; i < this.normals.length; i++) {
        this.normals[i].rotate(rotation);
      }
      this.rotation.rotate(rotation);
    } else {
      super.rotate(rotation as any, x as any, y as any);
    }
  }

  public translate(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.translate(x.x, x.y);
    } else if (typeof x === "number" && typeof y === "number") {
      super.translate(x, y);
      for (let i = 0; i < this.vertices.length; i++) {
        this.vertices[i].add(x, y);
      }
    }
  }

  /**
   * Returns the rotation about the local center in radians in the range [-&pi;, &pi;].
   * @returns The rotation angle in radians
   */
  public getRotationAngle(): number {
    return this.rotation.toRadians();
  }

  /**
   * Returns the {@link Rotation} object that represents the local center.
   * @returns The {@link Rotation} object that represents the local center
   */
  public getRotation(): Rotation {
    return this.rotation.copy();
  }

  /**
   * Returns the angle of the {@link Slice} in radians.
   * @returns The angle of the {@link Slice} in radians
   */
  public getTheta(): number {
    return this.alpha * 2;
  }

  /**
   * Returns the radius of the {@link Slice}.
   * @returns The radius of the {@link Slice}
   */
  public getSliceRadius(): number {
    return this.sliceRadius;
  }

  /**
   * Returns the center of the {@link Slice}.
   * 
   * This is the tip of the pie shape.
   * @returns The center of the {@link Slice}
   */
  public getCircleCenter(): Vector2 {
    return this.vertices[0];
  }
}