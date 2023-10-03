import { DataContainer } from "../DataContainer";
import { AABB } from "./AABB";
import { AbstractShape } from "./AbstractShape";
import { Convex } from "./Convex";
import { Feature } from "./Feature";
import { Interval } from "./Interval";
import { Mass } from "./Mass";
import { PointFeature } from "./PointFeature";
import { Shape } from "./Shape";
import { Transform } from "./Transform";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";

export class Circle extends AbstractShape implements Convex, Shape, Transformable, DataContainer {

  constructor(radius: number) {
    Circle.validate(radius);
    super(radius);
  }

  private static validate(radius: number): boolean {
    if (radius <= 0) {
      throw new Error("Circle: Radius must be non-negative.");
    }
    return true;
  }

  public getRadius(center?: Vector2): number {
    if (center == null) {
      return super.getRadius();
    }
    return this.radius + center.distance(this.center);
  }

  public toString(): string {
    return `Circle[center=${this.center.toString()}, radius=${this.radius}]`;
  }

  public getAxes(foci: Vector2[], transform: Transform): Vector2[] {
    return null;
  }

  public getFoci(transform: Transform): Vector2[] {
    const foci = [];
    foci[0] = transform.getTransformed(this.center);
    return foci;
  }

  public getFarthestFeature(vector: Vector2, transform: Transform): Feature {
    const farthest = this.getFarthestPoint(vector, transform);
    return new PointFeature(farthest);
  }

  public getFarthestPoint(vector: Vector2, transform: Transform): Vector2 {
    const nAxis = vector.getNormalized();
    const center = transform.getTransformed(this.center);
    center.x += this.radius * nAxis.x;
    center.y += this.radius * nAxis.y;
    return center;
  }

  public getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  public createMass(density: number): Mass {
    const r2 = this.radius * this.radius;
    const mass = density * Math.PI * r2;
    const inertia = mass * r2 * 0.5;
    return new Mass(this.center, mass, inertia);
  }

  public contains(point: Vector2, transform?: Transform, inclusive?: boolean): boolean {
    if (transform == null || inclusive === void 0) {
      return super.contains(point, transform, inclusive);
    }
    const v = transform.getTransformed(this.center);
    const radiusSquared = this.radius * this.radius;
    v.subtract(point);

    return inclusive ? v.getMagnitudeSquared() <= radiusSquared : v.getMagnitudeSquared() < radiusSquared;
  }

  public project(vector: Vector2, transform?: Transform): Interval {
    if (transform == null) {
      return super.project(vector, transform);
    }
    const center = transform.getTransformed(this.center);
    const c = center.dot(vector);
    return new Interval(c - this.radius, c + this.radius);
  }

  public computeAABB(aabb: AABB, transform?: Transform): void {
    if (transform == null) {
      this.computeAABB(aabb, AbstractShape.IDENTITY);
    } else {
      const center = transform.getTransformed(this.center);
      aabb.minX = center.x - this.radius;
      aabb.minY = center.y - this.radius;
      aabb.maxX = center.x + this.radius;
      aabb.maxY = center.y + this.radius;
    }
  }
}