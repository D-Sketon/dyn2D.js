import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";

export class Vector3 implements Copyable<Vector3>{
  x: number;
  y: number;
  z: number;

  constructor();
  constructor(vector: Vector3);
  constructor(x: number, y: number, z: number);
  constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number);
  constructor(p1: Vector3, p2: Vector3);
  constructor(x?: any, y?: any, z?: any, x2?: any, y2?: any, z2?: any) {
    if (x instanceof Vector3 && y instanceof Vector3) {
      this.x = y.x - x.x;
      this.y = y.y - x.y;
      this.z = y.z - x.z;
    } else if (x instanceof Vector3) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else if (typeof x === "number" && typeof y === "number" && typeof z === "number" && typeof x2 === "number" && typeof y2 === "number" && typeof z2 === "number") {
      this.x = x2 - x;
      this.y = y2 - y;
      this.z = z2 - z;
    } else if (typeof x === "number" && typeof y === "number" && typeof z === "number") {
      this.x = x;
      this.y = y;
      this.z = z;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
  }

  public copy(): Vector3 {
    return new Vector3(this);
  }

  public distance(x: number, y: number, z: number): number;
  public distance(point: Vector3): number;
  public distance(x: any, y?: number, z?: number): number {
    if (x instanceof Vector3) {
      return this.distance(x.x, x.y, x.z);
    } else {
      let xd = this.x - x;
      let yd = this.y - y;
      let zd = this.z - z;
      return Math.sqrt(xd * xd + yd * yd + zd * zd);
    }
  }

  public distanceSquared(x: number, y: number, z: number): number;
  public distanceSquared(point: Vector3): number;
  public distanceSquared(x: any, y?: number, z?: number): number {
    if (x instanceof Vector3) {
      return this.distanceSquared(x.x, x.y, x.z);
    } else {
      let xd = this.x - x;
      let yd = this.y - y;
      let zd = this.z - z;
      return xd * xd + yd * yd + zd * zd;
    }
  }

  // (a x b) x c
  public static tripleProduct(a: Vector3, b: Vector3, c: Vector3): Vector3 {
    let r = new Vector3();
    let ac = a.x * c.x + a.y * c.y + a.z * c.z;
    let bc = b.x * c.x + b.y * c.y + b.z * c.z;
    r.x = b.x * ac - a.x * bc;
    r.y = b.y * ac - a.y * bc;
    r.z = b.z * ac - a.z * bc;
    return r;
  }

  public equals(x: number, y: number, z: number): boolean;
  public equals(vector: Vector3): boolean;
  public equals(x: any, y?: number, z?: number): boolean {
    if (x instanceof Vector3) {
      if (this === x) return true;
      return this.x === x.x && this.y === x.y && this.z === x.z;
    } else {
      return this.x === x && this.y === y && this.z === z;
    }
  }

  public set(x: number, y: number, z: number): Vector3;
  public set(vector: Vector3): Vector3;
  public set(x: any, y?: number, z?: number): Vector3 {
    if (x instanceof Vector3) {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    return this;
  }

  public getXComponent(): Vector3 {
    return new Vector3(this.x, 0, 0);
  }

  public getYComponent(): Vector3 {
    return new Vector3(0, this.y, 0);
  }

  public getZComponent(): Vector3 {
    return new Vector3(0, 0, this.z);
  }

  public getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  public getMagnitudeSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  public setMagnitude(magnitude: number): Vector3 {
    if (Math.abs(magnitude) <= Epsilon.E) {
      this.x = 0.0;
      this.y = 0.0;
      this.z = 0.0;
      return this;
    }
    if (this.isZero()) {
      return this;
    }
    let mag = this.getMagnitude();
    mag = magnitude / mag;
    this.x *= mag;
    this.y *= mag;
    this.z *= mag;
    return this;
  }

  public add(x: number, y: number, z: number): Vector3;
  public add(vector: Vector3): Vector3;
  public add(x: any, y?: number, z?: number): Vector3 {
    if (x instanceof Vector3) {
      this.x += x.x;
      this.y += x.y;
      this.z += x.z;
    } else {
      this.x += x;
      this.y += y;
      this.z += z;
    }
    return this;
  }

  public sum(x: number, y: number, z: number): Vector3;
  public sum(vector: Vector3): Vector3;
  public sum(x: any, y?: number, z?: number): Vector3 {
    if (x instanceof Vector3) {
      return new Vector3(this.x + x.x, this.y + x.y, this.z + x.z);
    } else {
      return new Vector3(this.x + x, this.y + y, this.z + z);
    }
  }

  public subtract(x: number, y: number, z: number): Vector3;
  public subtract(vector: Vector3): Vector3;
  public subtract(x: any, y?: number, z?: number): Vector3 {
    if (x instanceof Vector3) {
      this.x -= x.x;
      this.y -= x.y;
      this.z -= x.z;
    } else {
      this.x -= x;
      this.y -= y;
      this.z -= z;
    }
    return this;
  }

  public difference(x: number, y: number, z: number): Vector3;
  public difference(vector: Vector3): Vector3;
  public difference(x: any, y?: number, z?: number): Vector3 {
    if (x instanceof Vector3) {
      return new Vector3(this.x - x.x, this.y - x.y, this.z - x.z);
    } else {
      return new Vector3(this.x - x, this.y - y, this.z - z);
    }
  }

  public to(x: number, y: number, z: number): Vector3;
  public to(vector: Vector3): Vector3;
  public to(x: any, y?: number, z?: number): Vector3 {
    if (x instanceof Vector3) {
      return new Vector3(x.x - this.x, x.y - this.y, x.z - this.z);
    } else {
      return new Vector3(x - this.x, y - this.y, z - this.z);
    }
  }

  public multiply(scalar: number): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  public product(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  public dot(x: number, y: number, z: number): number;
  public dot(vector: Vector3): number;
  public dot(x: any, y?: number, z?: number): number {
    if (x instanceof Vector3) {
      return this.x * x.x + this.y * x.y + this.z * x.z;
    } else {
      return this.x * x + this.y * y + this.z * z;
    }
  }

  public cross(x: number, y: number, z: number): Vector3;
  public cross(vector: Vector3): Vector3;
  public cross(x: any, y?: number, z?: number): Vector3 {
    if (x instanceof Vector3) {
      return new Vector3(
        this.y * x.z - this.z * x.y,
        this.z * x.x - this.x * x.z,
        this.x * x.y - this.y * x.x);
    } else {
      return new Vector3(
        this.y * z - this.z * y,
        this.z * x - this.x * z,
        this.x * y - this.y * x);
    }
  }

  public isOrthogonal(x: number, y: number, z: number): boolean;
  public isOrthogonal(vector: Vector3): boolean;
  public isOrthogonal(x: any, y?: number, z?: number): boolean {
    if (x instanceof Vector3) {
      return Math.abs(this.x * x.x + this.y * x.y + this.z * x.z) <= Epsilon.E;
    } else {
      return Math.abs(this.x * x + this.y * y + this.z * z) <= Epsilon.E;
    }
  }

  public isZero(): boolean {
    return Math.abs(this.x) <= Epsilon.E &&
      Math.abs(this.y) <= Epsilon.E &&
      Math.abs(this.z) <= Epsilon.E;
  }

  public negate(): Vector3 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  public getNegative(): Vector3 {
    return new Vector3(-this.x, -this.y, -this.z);
  }

  public zero(): Vector3 {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
  }

  public project(vector: Vector3): Vector3 {
    const dotProd = this.dot(vector);
    let denominator = vector.dot(vector);
    if (denominator <= Epsilon.E) return new Vector3();
    denominator = dotProd / denominator;
    return new Vector3(denominator * vector.x, denominator * vector.y, denominator * vector.z);
  }

  public getNormalized(): Vector3 {
    let magnitude = this.getMagnitude();
    if (magnitude <= Epsilon.E) return new Vector3();
    magnitude = 1 / magnitude;
    return new Vector3(this.x * magnitude, this.y * magnitude, this.z * magnitude);
  }

  public normalize(): number {
    let magnitude = this.getMagnitude();
    if (magnitude <= Epsilon.E) return 0;
    magnitude = 1 / magnitude;
    this.x *= magnitude;
    this.y *= magnitude;
    this.z *= magnitude;
    return magnitude;
  }
}