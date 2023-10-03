import { DataContainer } from "../DataContainer";
import { AABB } from "./AABB";
import { AbstractShape } from "./AbstractShape";
import { Convex } from "./Convex";
import { Interval } from "./Interval";
import { Mass } from "./Mass";
import { Polygon } from "./Polygon";
import { Rotation } from "./Rotation";
import { Shape } from "./Shape";
import { Transform } from "./Transform";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";
import { Wound } from "./Wound";

function validate(width: number, height: number): boolean {
  if (width <= 0) {
    throw new Error("Rectangle: Width must be positive.");
  }
  if (height <= 0) {
    throw new Error("Rectangle: Height must be positive.");
  }
  return true;
}

export class Rectangle extends Polygon implements Convex, Wound, Shape, Transformable, DataContainer {

  width: number;
  height: number;

  constructor(width: number, height: number) {
    validate(width, height);
    const vertices = [
      new Vector2(-width * 0.5, -height * 0.5),
      new Vector2(width * 0.5, -height * 0.5),
      new Vector2(width * 0.5, height * 0.5),
      new Vector2(-width * 0.5, height * 0.5)
    ];
    super(new Vector2(),
      vertices[0].getMagnitude(),
      vertices,
      [new Vector2(0.0, -1.0),
      new Vector2(1.0, 0.0),
      new Vector2(0.0, 1.0),
      new Vector2(-1.0, 0.0)]
    );
    this.width = width;
    this.height = height;
  }

  public toString(): string {
    return `Rectangle[${super.toString()}, width=${this.width}, height=${this.height}]]`;
  }

  public getHeight(): number {
    return this.height;
  }

  public getWidth(): number {
    return this.width;
  }

  public getRotationAngle(): number {
    return Math.atan2(this.normals[1].y, this.normals[1].x);
  }

  public getRotation(): Rotation {
    return new Rotation(this.normals[1].x, this.normals[1].y);
  }

  public getAxes(foci: Vector2[], transform: Transform): Vector2[] {
    const fociSize = foci != null ? foci.length : 0;
    const axes = new Array<Vector2>(2 + fociSize);
    let n = 0;

    axes[n++] = transform.getTransformedR(this.normals[1]);
    axes[n++] = transform.getTransformedR(this.normals[2]);

    for (let i = 0; i < fociSize; i++) {
      const focus = foci[i];
      let closest = transform.getTransformed(this.vertices[0]);
      let d = focus.distanceSquared(closest);
      for (let j = 1; j < 4; j++) {
        let vertex = this.vertices[j];
        vertex = transform.getTransformed(vertex);
        const dt = focus.distanceSquared(vertex);
        if (dt < d) {
          closest = vertex;
          d = dt;
        }
      }
      const axis = focus.to(closest);
      axis.normalize();
      axes[n++] = axis;
    }
    return axes;
  }

  public contains(point: Vector2, transform?: Transform, inclusive?: boolean): boolean {
    if (transform === void 0 && inclusive === void 0 || inclusive !== void 0) {
      return super.contains(point, transform, inclusive);
    }
    const p = transform.getInverseTransformed(point);

    const c = this.center;
    const p1 = this.vertices[0];
    const p2 = this.vertices[1];
    const p4 = this.vertices[3];

    const widthSquared = p1.distanceSquared(p2);
    const heightSquared = p1.distanceSquared(p4);

    const projectAxis0 = p1.to(p2);
    const projectAxis1 = p1.to(p4);
    const toPoint = c.to(p);
    if (toPoint.project(projectAxis0).getMagnitudeSquared() <= (widthSquared * 0.25)) {
      if (toPoint.project(projectAxis1).getMagnitudeSquared() <= (heightSquared * 0.25)) {
        return true;
      }
    }
    return false;
  }

  public project(vector: Vector2, transform?: Transform): Interval {
    if (transform == null) {
      return super.project(vector, transform);
    }
    const center = transform.getTransformed(this.center);

    const projectAxis0 = transform.getTransformedR(this.normals[1]);
    const projectAxis1 = transform.getTransformedR(this.normals[2]);

    const c = center.dot(vector);
    const e = (this.width * 0.5) * Math.abs(projectAxis0.dot(vector)) + (this.height * 0.5) * Math.abs(projectAxis1.dot(vector));
    return new Interval(c - e, c + e);
  }

  public createMass(density: number): Mass {
    const height = this.height;
    const width = this.width;

    const mass = density * height * width;
    const inertia = mass * (height * height + width * width) / 12.0;

    return new Mass(this.center, mass, inertia);
  }

  public computeAABB(aabb: AABB, transform?: Transform): void {
    if (transform == null) {
      this.computeAABB(aabb, AbstractShape.IDENTITY);
    } else {
      const v0x = transform.getTransformedX(this.vertices[0]);
      const v0y = transform.getTransformedY(this.vertices[0]);
      const v1x = transform.getTransformedX(this.vertices[1]);
      const v1y = transform.getTransformedY(this.vertices[1]);
      const v2x = transform.getTransformedX(this.vertices[2]);
      const v2y = transform.getTransformedY(this.vertices[2]);
      const v3x = transform.getTransformedX(this.vertices[3]);
      const v3y = transform.getTransformedY(this.vertices[3]);

      if (v0y > v1y) {
        if (v0x < v1x) {
          aabb.minX = v0x;
          aabb.minY = v1y;
          aabb.maxX = v2x;
          aabb.maxY = v3y;
        } else {
          aabb.minX = v1x;
          aabb.minY = v2y;
          aabb.maxX = v3x;
          aabb.maxY = v0y;
        }
      } else {
        if (v0x < v1x) {
          aabb.minX = v3x;
          aabb.minY = v0y;
          aabb.maxX = v1x;
          aabb.maxY = v2y;
        } else {
          aabb.minX = v2x;
          aabb.minY = v3y;
          aabb.maxX = v0x;
          aabb.maxY = v1y;
        }
      }
    }
  }
}