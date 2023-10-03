import { DataContainer } from "../DataContainer";
import { Epsilon } from "../Epsilon";
import { AABB } from "./AABB";
import { AbstractShape } from "./AbstractShape";
import { Convex } from "./Convex";
import { EdgeFeature } from "./EdgeFeature";
import { Feature } from "./Feature";
import { INV_3, getAreaWeightedCenter, getCounterClockwiseEdgeNormals, getRotationRadius } from "./Geometry";
import { Interval } from "./Interval";
import { Mass } from "./Mass";
import { PointFeature } from "./PointFeature";
import { Rotation } from "./Rotation";
import { Segment } from "./Segment";
import { Shape } from "./Shape";
import { Transform } from "./Transform";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";
import { Wound } from "./Wound";
import { WoundIterator } from "./WoundIterator";

export class Polygon extends AbstractShape implements Convex, Wound, Shape, Transformable, DataContainer {

  vertices: Vector2[];
  normals: Vector2[];

  constructor(...vertices: Vector2[]);
  constructor(center: Vector2, radius: number, vertices: Vector2[], normals: Vector2[]);
  constructor(...args: any[]) {
    if (args.length === 4 && args[0] instanceof Vector2 && typeof args[1] === "number" && Array.isArray(args[2]) && Array.isArray(args[3])) {
      super(args[0], args[1]);
      this.vertices = args[2];
      this.normals = args[3];
    } else {
      const vertices = args as Vector2[];
      Polygon.validate(vertices);
      const center = getAreaWeightedCenter(vertices);
      super(center, getRotationRadius(center, ...vertices));
      this.vertices = vertices;
      this.normals = getCounterClockwiseEdgeNormals(...vertices);
    }
  }

  private static validate(vertices: Vector2[]): boolean {
    let len = vertices.length;
    if (len < 3) {
      throw new Error("Polygon: Polygon must have at least 3 vertices");
    }
    for (let i = 0; i < len; i++) {
      if (vertices[i] == null) {
        throw new Error("Polygon: Polygon cannot have null vertices");
      }
    }
    let area = 0.0;
    let sign = 0.0;
    for (let i = 0; i < len; i++) {
      let p0 = (i - 1 < 0) ? vertices[len - 1] : vertices[i - 1];
      let p1 = vertices[i];
      let p2 = (i + 1 == len) ? vertices[0] : vertices[i + 1];
      if (p1.equals(p2)) {
        throw new Error("Polygon: Polygon cannot have coincident vertices");
      }
      let cross = p0.to(p1).cross(p1.to(p2));
      let tsign = Math.sign(cross);
      area += cross;
      if (Math.abs(cross) > Epsilon.E) {
        if (sign != 0.0 && tsign != sign) {
          throw new Error("Polygon: Polygon must be convex");
        }
      }
      sign = tsign;
    }
    if (Math.abs(area) <= Epsilon.E) {
      throw new Error("Polygon: Polygon has zero or near zero area");
    }
    if (area < 0.0) {
      throw new Error("Polygon: Polygon must have counter-clockwise winding");
    }
    return true;
  }

  public toString(): string {
    return `Polygon[${super.toString()}, vertices=${this.vertices.join(", ")}]`;
  }

  public getArea(): number {
    let area = 0.0;
    const n = this.vertices.length;
    const ac = new Vector2();
    for (let i = 0; i < n; i++) {
      ac.add(this.vertices[i]);
    }
    ac.divide(n);

    for (let i1 = n - 1, i2 = 0; i2 < n; i1 = i2++) {
      let p1 = this.vertices[i1];
      let p2 = this.vertices[i2];
      p1 = p1.difference(ac);
      p2 = p2.difference(ac);
      const D = p1.cross(p2);
      const triangleArea = 0.5 * D;
      area += triangleArea;
    }

    return area;
  }

  public createMass(density: number): Mass {
    const center = new Vector2();
    let area = 0.0;
    let I = 0.0;
    const n = this.vertices.length;

    const ac = new Vector2();
    for (let i = 0; i < n; i++) {
      ac.add(this.vertices[i]);
    }
    ac.divide(n);

    for (let i1 = n - 1, i2 = 0; i2 < n; i1 = i2++) {
      let p1 = this.vertices[i1];
      let p2 = this.vertices[i2];
      p1 = p1.difference(ac);
      p2 = p2.difference(ac);

      const D = p1.cross(p2);
      const triangleArea = 0.5 * D;
      area += triangleArea;

      center.x += (p1.x + p2.x) * INV_3 * triangleArea;
      center.y += (p1.y + p2.y) * INV_3 * triangleArea;

      I += triangleArea * (p2.dot(p2) + p2.dot(p1) + p1.dot(p1));
    }
    const m = density * area;
    center.divide(area);
    const c = center.sum(ac);
    I *= (density / 6);
    I -= m * center.getMagnitudeSquared();

    return new Mass(c, m, I);
  }

  public getAxes(foci: Vector2[], transform: Transform): Vector2[] {
    const fociSize = foci != null ? foci.length : 0;
    const len = this.vertices.length;
    const axes = new Array<Vector2>(len + fociSize);
    let n = 0;
    for (let i = 0; i < len; i++) {
      axes[n++] = transform.getTransformedR(this.normals[i]);
    }
    for (let i = 0; i < fociSize; i++) {
      const f = foci[i];
      let closest = transform.getTransformed(this.vertices[0]);
      let d = f.distanceSquared(closest);
      for (let j = 1; j < len; j++) {
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
    return null;
  }

  private getFarthestVertexIndex(vector: Vector2): number {
    let maxIndex = 0;
    const n = this.vertices.length;
    let max = vector.dot(this.vertices[0]), candidateMax: number;

    if (max < (candidateMax = vector.dot(this.vertices[1]))) {
      do {
        max = candidateMax;
        maxIndex++;
      } while ((maxIndex + 1) < n && max < (candidateMax = vector.dot(this.vertices[maxIndex + 1])));
    } else if (max < (candidateMax = vector.dot(this.vertices[n - 1]))) {
      maxIndex = n;

      do {
        max = candidateMax;
        maxIndex--;
      } while (maxIndex > 0 && max <= (candidateMax = vector.dot(this.vertices[maxIndex - 1])));
    }

    return maxIndex;
  }

  public getFarthestFeature(vector: Vector2, transform: Transform): EdgeFeature {
    const localn = transform.getInverseTransformedR(vector);

    let index = this.getFarthestVertexIndex(localn);
    const count = this.vertices.length;

    const maximum = new Vector2(this.vertices[index]);

    const leftN = this.normals[index == 0 ? count - 1 : index - 1];
    const rightN = this.normals[index];
    transform.transform(maximum);
    const vm = new PointFeature(maximum, index);
    if (leftN.dot(localn) < rightN.dot(localn)) {
      const l = (index == count - 1) ? 0 : index + 1;

      const left = transform.getTransformed(this.vertices[l]);
      const vl = new PointFeature(left, l);
      return new EdgeFeature(vm, vl, vm, maximum.to(left), index + 1);
    } else {
      const r = (index == 0) ? count - 1 : index - 1;

      const right = transform.getTransformed(this.vertices[r]);
      const vr = new PointFeature(right, r);
      return new EdgeFeature(vr, vm, vm, right.to(maximum), index);
    }
  }

  public getFarthestPoint(vector: Vector2, transform: Transform): Vector2 {
    const localn = transform.getInverseTransformedR(vector);

    const index = this.getFarthestVertexIndex(localn);

    return transform.getTransformed(this.vertices[index]);
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

  public contains(point: Vector2, transform?: Transform, inclusive?: boolean): boolean {
    if (transform == null || inclusive === void 0) {
      return super.contains(point, transform, inclusive);
    }
    const p = transform.getInverseTransformed(point);
    const len = this.vertices.length;
    let p1 = this.vertices[len - 1];
    let p2 = this.vertices[0];
    let last = Segment.getLocation(p, p1, p2);
    for (let i = 0; i < len - 1; i++) {
      p1 = p2;
      p2 = this.vertices[i + 1];
      if (inclusive && (p.equals(p1) || p.equals(p2))) {
        return true;
      }
      const location = Segment.getLocation(p, p1, p2);
      if (!inclusive && location === 0.0) {
        return false;
      }
      if (last * location < 0) {
        return false;
      }
      if (Math.abs(location) > Epsilon.E) {
        last = location;
      }
    }
    return true;
  }

  public rotate(rotation: unknown, x?: unknown, y?: unknown): void {
    if (rotation instanceof Rotation && typeof x === "number" && typeof y === "number") {
      super.rotate(rotation, x, y);

      const len = this.vertices.length;
      for (let i = 0; i < len; i++) {
        this.vertices[i].rotate(rotation, x, y);
        this.normals[i].rotate(rotation);
      }
    } else {
      super.rotate(rotation as any, x as any, y as any);
    }
  }

  public translate(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.translate(x.x, x.y);
    } else if (typeof x === "number" && typeof y === "number") {
      super.translate(x, y);
      const len = this.vertices.length;
      for (let i = 0; i < len; i++) {
        this.vertices[i].add(x, y);
      }
    }
  }

  public project(vector: Vector2, transform?: Transform): Interval {
    if (transform == null) {
      return super.project(vector, transform);
    }
    let v = 0.0;
    let p = transform.getTransformed(this.vertices[0]);
    let min = vector.dot(p);
    let max = min;
    const len = this.vertices.length;
    for (let i = 1; i < len; i++) {
      p = transform.getTransformed(this.vertices[i]);
      v = vector.dot(p);
      if (v < min) {
        min = v;
      } else if (v > max) {
        max = v;
      }
    }
    return new Interval(min, max);
  }

  public computeAABB(aabb: AABB, transform?: Transform): void {
    if (transform == null) {
      this.computeAABB(aabb, AbstractShape.IDENTITY);
    } else {
      const p = transform.getTransformed(this.vertices[0]);
      let minX = p.x;
      let maxX = p.x;
      let minY = p.y;
      let maxY = p.y;

      const size = this.vertices.length;
      for (let i = 1; i < size; i++) {
        const px = transform.getTransformedX(this.vertices[i]);
        const py = transform.getTransformedY(this.vertices[i]);

        if (px < minX) {
          minX = px;
        } else if (px > maxX) {
          maxX = px;
        }
        if (py < minY) {
          minY = py;
        } else if (py > maxY) {
          maxY = py;
        }
      }

      aabb.minX = minX;
      aabb.minY = minY;
      aabb.maxX = maxX;
      aabb.maxY = maxY;
    }
  }

}