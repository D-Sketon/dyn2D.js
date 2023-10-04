import { DataContainer } from "../DataContainer";
import { Epsilon } from "../Epsilon";
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
 * Implementation of a Capsule {@link Convex} {@link Shape}. 
 * 
 * A capsule can be described as a rectangle with two half circle caps on both ends. A capsule is created
 * by specifying the bounding rectangle of the entire {@link Shape}.
 * 
 * If the height is larger than the width the caps will be on the top and bottom of the shape. Otherwise
 * the caps are on the left and right ends of the shape.
 * 
 * A capsule's width and height must be larger than zero and cannot be equal.  A {@link Circle} should be used
 * instead of an equal width/height capsule for both performance and stability.
 */
export class Capsule extends AbstractShape implements Convex, Shape, Transformable, DataContainer {
  /** 
   * The Capsule shape has two edge features which could be returned from the {@link Capsule.getFarthestFeature}
   * method. Under normal floating point conditions the edges will never be selected as the farthest features. Due to this,
   * stacking of capsule shapes is very unstable (or any resting contact that involves the edge). We introduce this factor
   * (% of projected normal) to help select the edge in cases where the collision normal is nearly parallel to the edge normal.
   */
  static readonly EDGE_FEATURE_SELECTION_CRITERIA = 0.98;
  /**
   * Because we are selecting an edge even when the farthest feature should be a vertex, when the edges are clipped
   * against each other (in the ClippingManifoldSolver) they will not overlap. Due to this, we introduce an expansion
   * value (% of the width) that expands the edge feature so that in these cases a collision manifold is still generated.
   */
  static readonly EDGE_FEATURE_EXPANSION_FACTOR = 0.1;

  /**
   * The bounding rectangle width
   */
  length: number;
  /**
   * The end cap radius
   */
  capRadius: number;
  /**
   * The foci points of the capsule
   */
  foci: Vector2[];
  /**
   * The local x-axis of the capsule
   */
  localXAxis: Vector2;

  /**
   * Full constructor.
   * @param width The bounding rectangle width
   * @param height The bounding rectangle height
   * @throws `Error` if width or height are less than or equal to zero or if the width and height are near equal
   */
  constructor(width: number, height: number) {
    Capsule.validate(width, height);
    super(Math.max(width, height) * 0.5);
    let major = width;
    let minor = height;
    let vertical = false;
    if (width < height) {
      major = height;
      minor = width;
      vertical = true;
    }

    this.length = major;
    this.capRadius = minor * 0.5;

    const f = (major - minor) * 0.5;
    this.foci = [];
    if (vertical) {
      this.foci[0] = new Vector2(0, -f);
      this.foci[1] = new Vector2(0, f);
      this.localXAxis = new Vector2(0.0, 1.0);
    } else {
      this.foci[0] = new Vector2(-f, 0);
      this.foci[1] = new Vector2(f, 0);
      this.localXAxis = new Vector2(1.0, 0.0);
    }
  }

  private static validate(width: number, height: number): boolean {
    if (width <= 0) {
      throw new Error("Capsule: Width must be positive.");
    }
    if (height <= 0) {
      throw new Error("Capsule: Height must be positive.");
    }
    if (Math.abs(width - height) < Epsilon.E) {
      throw new Error("Capsule: Width and height must be different.");
    }
    return true;
  }

  public toString(): string {
    return `Capsule[length=${this.length}, capRadius=${this.capRadius}]`;
  }

  public getRadius(center?: Vector2): number {
    if (center == null) {
      return super.getRadius();
    }
    return getRotationRadius(center, this.foci) + this.capRadius;
  }

  public getAxes(foci: Vector2[], transform: Transform): Vector2[] {
    if (foci != null) {
      const axes = new Array<Vector2>(2 + foci.length);

      axes[0] = transform.getTransformedR(this.localXAxis);
      axes[1] = transform.getTransformedR(this.localXAxis.getRightHandOrthogonalVector());

      const f1 = transform.getTransformed(this.foci[0]);
      const f2 = transform.getTransformed(this.foci[1]);
      for (let i = 0; i < foci.length; i++) {
        const d1 = f1.distanceSquared(foci[i]);
        const d2 = f2.distanceSquared(foci[i]);

        let v = null;
        if (d1 < d2) {
          v = f1.to(foci[i]);
        } else {
          v = f2.to(foci[i]);
        }

        v.normalize();
        axes[2 + i] = v;
      }
      return axes;
    }
    return [transform.getTransformedR(this.localXAxis),
    transform.getTransformedR(this.localXAxis.getRightHandOrthogonalVector())];
  }

  public getFoci(transform: Transform): Vector2[] {
    return [transform.getTransformed(this.foci[0]),
    transform.getTransformed(this.foci[1])];
  }

  public getFarthestFeature(vector: Vector2, transform: Transform): Feature {
    const localAxis = transform.getInverseTransformedR(vector);
    const n1 = this.localXAxis.getLeftHandOrthogonalVector();

    const d = localAxis.dot(localAxis) * Capsule.EDGE_FEATURE_SELECTION_CRITERIA;
    const d1 = localAxis.dot(n1);

    if (Math.abs(d1) < d) {
      const point = this.getFarthestPoint(vector, transform);
      return new PointFeature(point);
    } else {
      const v = n1.multiply(this.capRadius);
      const e = this.localXAxis.product(this.length * 0.5 * Capsule.EDGE_FEATURE_EXPANSION_FACTOR);
      if (d1 > 0) {
        const p1 = this.foci[0].sum(v).subtract(e);
        const p2 = this.foci[1].sum(v).add(e);
        return Segment.getFarthestFeature(p1, p2, vector, transform);
      } else {
        const p1 = this.foci[0].difference(v).subtract(e);
        const p2 = this.foci[1].difference(v).add(e);
        return Segment.getFarthestFeature(p1, p2, vector, transform);
      }
    }
  }

  public getFarthestPoint(vector: Vector2, transform: Transform): Vector2 {
    vector.normalize();
    const p = Segment.getFarthestPoint(this.foci[0], this.foci[1], vector, transform);
    return p.add(vector.product(this.capRadius));
  }

  public getArea(): number {
    const h = this.capRadius * 2.0;
    const w = this.length - h;
    const r2 = this.capRadius * this.capRadius;

    const ra = w * h;
    const ca = r2 * Math.PI;

    return ra + ca;
  }

  public createMass(density: number): Mass {
    const h = this.capRadius * 2.0;
    const w = this.length - h;
    const r2 = this.capRadius * this.capRadius;

    const ra = w * h;
    const ca = r2 * Math.PI;
    const rm = density * ra;
    const cm = density * ca;
    const m = rm + cm;

    const d = w * 0.5;
    const cI = 0.5 * cm * r2 + cm * d * d;
    const rI = rm * (h * h + w * w) / 12.0;
    const I = rI + cI;

    return new Mass(this.center, m, I);
  }

  public contains(point: Vector2, transform?: Transform, inclusive?: boolean): boolean {
    if (transform == null || inclusive === void 0) {
      return super.contains(point, transform, inclusive);
    }
    const p = Segment.getPointOnSegmentClosestToPoint(point, transform.getTransformed(this.foci[0]), transform.getTransformed(this.foci[1]));
    const r2 = this.capRadius * this.capRadius;
    const d2 = p.distanceSquared(point);
    return inclusive ? d2 <= r2 : d2 < r2;
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
      let p1 = this.getFarthestPoint(Vector2.X_AXIS, transform);
      let c = transform.getTransformedX(this.center);
      const minX = 2 * c - p1.x;
      const maxX = p1.x;

      p1 = this.getFarthestPoint(Vector2.Y_AXIS, transform);
      c = transform.getTransformedY(this.center);
      const minY = 2 * c - p1.y;
      const maxY = p1.y;

      aabb.maxX = maxX;
      aabb.maxY = maxY;
      aabb.minX = minX;
      aabb.minY = minY;
    }
  }

  public rotate(rotation: unknown, x?: unknown, y?: unknown): void {
    if (rotation instanceof Rotation && typeof x === "number" && typeof y === "number") {
      super.rotate(rotation, x, y);
      this.foci[0].rotate(rotation, x, y);
      this.foci[1].rotate(rotation, x, y);
      this.localXAxis.rotate(rotation);
    } else {
      super.rotate(rotation as any, x as any, y as any);
    }
  }

  public translate(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.translate(x.x, x.y);
    } else if (typeof x === "number" && typeof y === "number") {
      super.translate(x, y);
      this.foci[0].add(x, y);
      this.foci[1].add(x, y);
    }
  }

  /**
   * Returns the rotation about the local center in radians in the range [-&pi;, &pi;].
   * @returns The rotation angle in radians
   */
  public getRotationAngle(): number {
    return Math.atan2(this.localXAxis.y, this.localXAxis.x);
  }

  /**
   * Returns the {@link Rotation} object that represents the local center.
   * @returns The {@link Rotation} object that represents the local center
   */
  public getRotation(): Rotation {
    return new Rotation(this.localXAxis.x, this.localXAxis.y);
  }

  /**
   * Returns the length of the capsule.
   * @returns The length of the capsule
   */
  public getLength(): number {
    return this.length;
  }

  /**
   * Returns the radius of the capsule end caps.
   * @returns The radius of the capsule end caps
   */
  public getCapRadius(): number {
    return this.capRadius;
  }
}