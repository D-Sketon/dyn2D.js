import { DataContainer } from "../DataContainer";
import { Convex } from "./Convex";
import { Polygon } from "./Polygon";
import { Shape } from "./Shape";
import { Transform } from "./Transform";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";
import { Wound } from "./Wound";

export class Triangle extends Polygon implements Convex, Wound, Shape, Transformable, DataContainer {

  constructor(point1: Vector2, point2: Vector2, point3: Vector2) {
    super(point1, point2, point3);
  }

  public toString(): string {
    return `Triangle[${super.toString()}]`;
  }

  public contains(point: Vector2, transform?: Transform, inclusive?: boolean): boolean {
    if (transform == null && inclusive == null || inclusive == null) {
      return super.contains(point, transform, inclusive);
    }
    let u: number, v: number;

    const p = transform.getInverseTransformed(point);

    const p1 = this.vertices[0];
    const p2 = this.vertices[1];
    const p3 = this.vertices[2];
    const ab = p1.to(p2);
    const ac = p1.to(p3);
    const pa = p1.to(p);

    const dot00 = ac.dot(ac);
    const dot01 = ac.dot(ab);
    const dot02 = ac.dot(pa);
    const dot11 = ab.dot(ab);
    const dot12 = ab.dot(pa);

    const denominator = dot00 * dot11 - dot01 * dot01;
    const invD = 1.0 / denominator;
    u = (dot11 * dot02 - dot01 * dot12) * invD;

    if (u <= 0) return false;

    v = (dot00 * dot12 - dot01 * dot02) * invD;

    return v > 0 && (u + v <= 1);
  }
}