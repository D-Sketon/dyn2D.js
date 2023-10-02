import { DataContainer } from "../DataContainer";
import { Epsilon } from "../Epsilon";
import { AABB } from "./AABB";
import { AbstractShape } from "./AbstractShape";
import { Convex } from "./Convex";
import { EdgeFeature } from "./EdgeFeature";
import { Feature } from "./Feature";
import { getAverageCenter, getRotationRadius } from "./Geometry";
import { Interval } from "./Interval";
import { Mass } from "./Mass";
import { PointFeature } from "./PointFeature";
import { Rotation } from "./Rotation";
import { Shape } from "./Shape";
import { Transform } from "./Transform";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";
import { Wound } from "./Wound";
import { WoundIterator } from "./WoundIterator";

export class Segment extends AbstractShape implements Convex, Wound, Shape, Transformable, DataContainer {
  vertices: Vector2[];
  normals: Vector2[];
  length: number;

  constructor(point1: Vector2, point2: Vector2) {
    Segment.validate(point1, point2);
    const vertices = [point1, point2];
    const segment = point1.to(point2);
    const length = point1.distance(point2);
    super(getAverageCenter(vertices), length * 0.5);
    this.vertices = vertices;
    this.normals = [segment.copy(), segment.right()];
    this.normals[0].normalize();
    this.normals[1].normalize();
    this.length = length;
  }

  private static validate(point1: Vector2, point2: Vector2): boolean {
    if (point1 == null || point2 == null) {
      throw new Error("Segment: Segment cannot have null vertices");
    }
    if (point1.equals(point2)) {
      throw new Error("Segment: Segment cannot have coincident vertices");
    }
    return true;
  }

  public toString(): string {
    return `Segment[${super.toString()}, length=${this.length}]`;
  }

  public getArea(): number {
    return 0;
  }

  public createMass(density: number): Mass {
    const length = this.length;
    const mass = density * length;
    const inertia = length * length * mass / 12.0;
    return new Mass(this.center, mass, inertia);
  }

  public getAxes(foci: Vector2[], transform: Transform): Vector2[] {
    const len = foci != null ? foci.length : 0;
    const axes = new Array<Vector2>(2 + len);
    let n = 0;
    const p1 = transform.getTransformed(this.vertices[0]);
    const p2 = transform.getTransformed(this.vertices[1]);
    axes[n++] = transform.getTransformedR(this.normals[1]);
    axes[n++] = transform.getTransformedR(this.normals[0]);
    let axis = null;

    for (let i = 0; i < len; i++) {
      const f = foci[i];
      if (p1.distanceSquared(f) < p2.distanceSquared(f)) {
        axis = p1.to(f);
      } else {
        axis = p2.to(f);
      }
      axis.normalize();
      axes[n++] = axis;
    }
    return axes;
  }

  public getFoci(transform: Transform): Vector2[] {
    return null;
  }

  public static getFarthestFeature(v1: Vector2, v2: Vector2, vector: Vector2, transform: Transform): Feature {
    let max = null;
    const p1 = transform.getTransformed(v1);
    const p2 = transform.getTransformed(v2);

    const dot1 = vector.dot(p1);
    const dot2 = vector.dot(p2);

    let index = 0;
    if (dot1 >= dot2) {
      max = p1;
      index = 0;
    } else {
      max = p2;
      index = 1;
    }
    const vp1 = new PointFeature(p1, 0);
    const vp2 = new PointFeature(p2, 1);
    const vm = new PointFeature(max, index);
    if (p1.to(p2).right().dot(vector) > 0) {
      return new EdgeFeature(vp2, vp1, vm, p2.to(p1), 0);
    } else {
      return new EdgeFeature(vp1, vp2, vm, p1.to(p2), 0);
    }
  }

  public getFarthestFeature(vector: Vector2, transform: Transform): Feature {
    return Segment.getFarthestFeature(this.vertices[0], this.vertices[1], vector, transform);
  }

  public static getFarthestPoint(v1: Vector2, v2: Vector2, vector: Vector2, transform: Transform): Vector2 {
    const p1 = transform.getTransformed(v1);
    const p2 = transform.getTransformed(v2);

    const dot1 = vector.dot(p1);
    const dot2 = vector.dot(p2);
    if (dot1 >= dot2) {
      return p1;
    } else {
      return p2;
    }
  }

  public getFarthestPoint(vector: Vector2, transform: Transform): Vector2 {
    return Segment.getFarthestPoint(this.vertices[0], this.vertices[1], vector, transform);
  }

  public getVertexIterator(): Iterator<Vector2, any> {
    return new WoundIterator(this.vertices);
  }

  public getNormalIterator(): Iterator<Vector2, any> {
    return new WoundIterator(this.normals);
  }

  public getVertices(): Vector2[] {
    return this.vertices;
  }

  public getNormals(): Vector2[] {
    return this.normals;
  }

  public getRadius(center?: Vector2): number {
    if (center != null)
      return getRotationRadius(center, ...this.vertices);
    return super.getRadius();
  }

  public getPoint1(): Vector2 {
    return this.vertices[0];
  }

  public getPoint2(): Vector2 {
    return this.vertices[1];
  }

  public getLength(): number {
    return this.length;
  }

  public static getLocation(point: Vector2, linePoint1: Vector2, linePoint2: Vector2): number {
    return (linePoint2.x - linePoint1.x) * (point.y - linePoint1.y) -
      (point.x - linePoint1.x) * (linePoint2.y - linePoint1.y);
  }

  public static getPointOnLineClosestToPoint(point: Vector2, linePoint1: Vector2, linePoint2: Vector2): Vector2 {
    const p1ToP = point.difference(linePoint1);
    const line = linePoint2.difference(linePoint1);
    const ab2 = line.dot(line);
    if (ab2 <= Epsilon.E) return linePoint1.copy();
    const ap_ab = p1ToP.dot(line);
    const t = ap_ab / ab2;
    return line.multiply(t).add(linePoint1);
  }

  public getPointOnLineClosestToPoint(point: Vector2): Vector2 {
    return Segment.getPointOnLineClosestToPoint(point, this.vertices[0], this.vertices[1]);
  }

  public static getPointOnSegmentClosestToPoint(point: Vector2, linePoint1: Vector2, linePoint2: Vector2): Vector2 {
    const p1ToP = point.difference(linePoint1);
    const line = linePoint2.difference(linePoint1);
    const ab2 = line.dot(line);
    const ap_ab = p1ToP.dot(line);
    if (ab2 <= Epsilon.E) return linePoint1.copy();
    let t = ap_ab / ab2;
    t = Interval.clamp(t, 0.0, 1.0);
    return line.multiply(t).add(linePoint1);
  }

  public getPointOnSegmentClosestToPoint(point: Vector2): Vector2 {
    return Segment.getPointOnSegmentClosestToPoint(point, this.vertices[0], this.vertices[1]);
  }

  public static getLineIntersection(ap1: Vector2, ap2: Vector2, bp1: Vector2, bp2: Vector2): Vector2 {
    const A = ap1.to(ap2);
    const B = bp1.to(bp2);

    const BxA = B.cross(A);
    if (Math.abs(BxA) <= Epsilon.E) {
      return null;
    }

    const ambxA = ap1.difference(bp1).cross(A);
    if (Math.abs(ambxA) <= Epsilon.E) {
      return null;
    }

    const tb = ambxA / BxA;
    return B.product(tb).add(bp1);
  }

  public getLineIntersection(segment: Segment): Vector2 {
    return Segment.getLineIntersection(this.vertices[0], this.vertices[1], segment.vertices[0], segment.vertices[1]);
  }

  public static getSegmentIntersection(ap1: Vector2, ap2: Vector2, bp1: Vector2, bp2: Vector2, inclusive?: boolean): Vector2 {
    if (inclusive == null) {
      inclusive = true;
    }
    const A = ap1.to(ap2);
    const B = bp1.to(bp2);

    const BxA = B.cross(A);
    if (Math.abs(BxA) <= Epsilon.E) {
      return null;
    }

    const ambxA = ap1.difference(bp1).cross(A);
    if (Math.abs(ambxA) <= Epsilon.E) {
      return null;
    }

    const tb = ambxA / BxA;
    if (inclusive) {
      if (tb < 0.0 || tb > 1.0) return null;
    } else {
      if (tb <= 0.0 || tb >= 1.0) return null;
    }

    const ip = B.product(tb).add(bp1);

    const ta = ip.difference(ap1).dot(A) / A.dot(A);
    if (inclusive) {
      if (ta < 0.0 || ta > 1.0) return null;
    } else {
      if (ta <= 0.0 || ta >= 1.0) return null;
    }

    return ip;
  }

  public getSegmentIntersection(segment: Segment): Vector2 {
    return Segment.getSegmentIntersection(this.vertices[0], this.vertices[1], segment.vertices[0], segment.vertices[1], true);
  }

  public contains(point: Vector2): boolean;
  public contains(point: Vector2, transform: Transform): boolean;
  public contains(point: Vector2, transform: Transform, inclusive: boolean): boolean;
  public contains(point: Vector2, transform: Transform, radius: number): boolean;
  public contains(point: Vector2, transform?: Transform, inclusive?: boolean | number): boolean {
    if (transform == null || inclusive == null) {
      return super.contains(point, transform, inclusive as boolean);
    }
    if (typeof inclusive === "number") {
      if (inclusive <= 0) {
        return this.contains(point, transform);
      } else {
        const p = transform.getInverseTransformed(point);
        if (this.vertices[0].distanceSquared(p) <= inclusive * inclusive) {
          return true;
        } else if (this.vertices[1].distanceSquared(p) <= inclusive * inclusive) {
          return true;
        } else {
          const l = this.vertices[0].to(this.vertices[1]);
          const p1 = this.vertices[0].to(p);
          const p2 = this.vertices[1].to(p);
          if (l.dot(p1) > 0 && -l.dot(p2) > 0) {
            const dist = p1.project(l.getRightHandOrthogonalVector()).getMagnitudeSquared();
            if (dist <= inclusive * inclusive) {
              return true;
            }
          }
        }
      }
      return false;
    }
    if (!inclusive) {
      return false;
    }
    const p = transform.getInverseTransformed(point);
    const p1 = this.vertices[0];
    const p2 = this.vertices[1];
    const value = Segment.getLocation(p, p1, p2);
    if (Math.abs(value) <= Epsilon.E) {
      const distSqrd = p1.distanceSquared(p2);
      if (p.distanceSquared(p1) <= distSqrd
        && p.distanceSquared(p2) <= distSqrd) {
        return true;
      }
      return false;
    }
    return false;
  }

  public project(vector: Vector2, transform?: Transform): Interval {
    if (transform == null) {
      return super.project(vector, transform);
    }
    let v = 0.0;
    const p1 = transform.getTransformed(this.vertices[0]);
    const p2 = transform.getTransformed(this.vertices[1]);
    let min = vector.dot(p1);
    let max = min;
    v = vector.dot(p2);
    if (v < min) {
      min = v;
    } else if (v > max) {
      max = v;
    }
    return new Interval(min, max);
  }

  public rotate(rotation: unknown, x?: unknown, y?: unknown): void {
    if (rotation instanceof Rotation && typeof x === "number" && typeof y === "number") {
      super.rotate(rotation, x, y);

      this.vertices[0].rotate(rotation, x, y);
      this.vertices[1].rotate(rotation, x, y);
      this.normals[0].rotate(rotation);
      this.normals[1].rotate(rotation);
    } else {
      super.rotate(rotation as any, x as any, y as any);
    }
  }

  public translate(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.translate(x.x, x.y);
    } else if (typeof x === "number" && typeof y === "number") {
      super.translate(x, y);
      this.vertices[0].add(x, y);
      this.vertices[1].add(x, y);
    }
  }

  public createAABB(transform?: Transform): AABB {
    if (transform == null) {
      return this.createAABB(AbstractShape.IDENTITY);
    }
    const aabb = new AABB(0, 0, 0, 0);
    this.computeAABB(aabb, transform);
    return aabb;
  }

  public computeAABB(aabb: AABB, transform?: Transform): void {
    if (transform == null) {
      this.computeAABB(aabb, AbstractShape.IDENTITY);
    } else {
      const p0 = transform.getTransformed(this.vertices[0]);
      const p1 = transform.getTransformed(this.vertices[1]);
      let maxX = p0.x;
      let minX = p1.x;

      if (maxX < minX) {
        const temp = maxX;
        maxX = minX;
        minX = temp;
      }
      let maxY = p0.y;
      let minY = p1.y;
      if (maxY < minY) {
        const temp = maxY;
        maxY = minY;
        minY = temp;
      }

      aabb.minX = minX;
      aabb.maxX = maxX;
      aabb.minY = minY;
      aabb.maxY = maxY;
    }
  }

  public getEdgeVector(): Vector2 {
    const edge = this.vertices[0].to(this.vertices[1]);
    edge.normalize();
    return edge;
  }
}