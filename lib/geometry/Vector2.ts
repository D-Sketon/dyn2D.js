import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";
import { TWO_PI } from "./Geometry";
import { Rotation } from "./Rotation";

export class Vector2 implements Copyable<Vector2> {

  static readonly X_ASIS = new Vector2(1, 0);
  static readonly Y_ASIS = new Vector2(0, 1);
  static readonly INV_X_ASIS = new Vector2(-1, 0);
  static readonly INV_Y_ASIS = new Vector2(0, -1);
  static readonly ZERO = new Vector2(0, 0);

  x: number = 0;
  y: number = 0;

  constructor();
  constructor(vector: Vector2);
  constructor(x: number, y: number);
  constructor(x1: number, y1: number, x2: number, y2: number);
  constructor(p1: Vector2, p2: Vector2);
  constructor(direction: number);
  constructor(...args: any[]) {
    if (args.length === 1) {
      if (args[0] instanceof Vector2) {
        this.x = args[0].x;
        this.y = args[0].y;
      } else if (typeof args[0] === "number") {
        this.x = Math.cos(args[0]);
        this.y = Math.sin(args[0]);
      }
    } else if (args.length === 2) {
      if (typeof args[0] === "number" && typeof args[1] === "number") {
        this.x = args[0];
        this.y = args[1];
      } else if (args[0] instanceof Vector2 && args[1] instanceof Vector2) {
        this.x = args[1].x - args[0].x;
        this.y = args[1].y - args[0].y;
      }
    } else if (args.length === 4) {
      if (typeof args[0] === "number" && typeof args[1] === "number"
        && typeof args[2] === "number" && typeof args[3] === "number") {
        this.x = args[2] - args[0];
        this.y = args[3] - args[1];
      }
    }
  }

  public static create(magnitude: number, direction: number): Vector2 {
    const x = magnitude * Math.cos(direction);
    const y = magnitude * Math.sin(direction);
    return new Vector2(x, y);
  }

  public copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public distance(point: Vector2): number;
  public distance(x: number, y: number): number;
  public distance(...args: any[]): number {
    let dx: number;
    let dy: number;
    if (args.length === 1) {
      dx = this.x - args[0].x;
      dy = this.y - args[0].y;
    } else {
      dx = this.x - args[0];
      dy = this.y - args[1];
    }
    return Math.sqrt(dx * dx + dy * dy);
  }

  public distanceSquared(point: Vector2): number;
  public distanceSquared(x: number, y: number): number;
  public distanceSquared(...args: any[]): number {
    let dx: number;
    let dy: number;
    if (args.length === 1) {
      dx = this.x - args[0].x;
      dy = this.y - args[0].y;
    } else {
      dx = this.x - args[0];
      dy = this.y - args[1];
    }
    return dx * dx + dy * dy;
  }

  // (a x b) x c
  public static tripleProduct(a: Vector2, b: Vector2, c: Vector2): Vector2 {
    const r = new Vector2();
    const dot = a.x * b.y - a.y * b.x;
    r.x = -c.y * dot;
    r.y = c.x * dot;
    return r;
  }

  public equals(vector: Vector2 | null): boolean;
  public equals(x: number, y: number): boolean;
  public equals(...args: any[]): boolean {
    if (args.length === 1) {
      if (args[0] == null) return false;
      if (args[0] == this) return true;
      return this.x === args[0].x && this.y === args[0].y;
    } else {
      return this.x === args[0] && this.y === args[1];
    }
  }

  public toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }

  public set(vector: Vector2): Vector2;
  public set(x: number, y: number): Vector2;
  public set(...args: any[]): Vector2 {
    if (args.length === 1) {
      this.x = args[0].x;
      this.y = args[0].y;
    } else {
      this.x = args[0];
      this.y = args[1];
    }
    return this;
  }

  public getXComponent(): Vector2 {
    return new Vector2(this.x, 0);
  }

  public getYComponent(): Vector2 {
    return new Vector2(0, this.y);
  }

  public getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public getMagnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  public setMagnitude(magnitude: number): Vector2 {
    if (Math.abs(magnitude) <= Epsilon.E) {
      this.x = 0.0;
      this.y = 0.0;
      return this;
    }
    if (this.isZero()) {
      return this;
    }
    const m = this.getMagnitude();
    this.x *= magnitude / m;
    this.y *= magnitude / m;
    return this;
  }

  public getDirection(): number {
    return Math.atan2(this.y, this.x);
  }

  public setDirection(direction: number): Vector2 {
    const m = this.getMagnitude();
    this.x = m * Math.cos(direction);
    this.y = m * Math.sin(direction);
    return this;
  }

  public add(vector: Vector2): Vector2;
  public add(x: number, y: number): Vector2;
  public add(...args: any[]): Vector2 {
    if (args.length === 1) {
      this.x += args[0].x;
      this.y += args[0].y;
    } else {
      this.x += args[0];
      this.y += args[1];
    }
    return this;
  }

  public sum(vector: Vector2): Vector2;
  public sum(x: number, y: number): Vector2;
  public sum(...args: any[]): Vector2 {
    if (args.length === 1) {
      return new Vector2(this.x + args[0].x, this.y + args[0].y);
    } else {
      return new Vector2(this.x + args[0], this.y + args[1]);
    }
  }

  public subtract(vector: Vector2): Vector2;
  public subtract(x: number, y: number): Vector2;
  public subtract(...args: any[]): Vector2 {
    if (args.length === 1) {
      this.x -= args[0].x;
      this.y -= args[0].y;
    } else {
      this.x -= args[0];
      this.y -= args[1];
    }
    return this;
  }

  public difference(vector: Vector2): Vector2;
  public difference(x: number, y: number): Vector2;
  public difference(...args: any[]): Vector2 {
    if (args.length === 1) {
      return new Vector2(this.x - args[0].x, this.y - args[0].y);
    } else {
      return new Vector2(this.x - args[0], this.y - args[1]);
    }
  }

  public to(vector: Vector2): Vector2;
  public to(x: number, y: number): Vector2;
  public to(...args: any[]): Vector2 {
    if (args.length === 1) {
      return new Vector2(args[0].x - this.x, args[0].y - this.y);
    } else {
      return new Vector2(args[0] - this.x, args[1] - this.y);
    }
  }

  public multiply(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  public divide(scalar: number): Vector2 {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  public product(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  public quotient(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  public dot(vector: Vector2): number;
  public dot(x: number, y: number): number;
  public dot(...args: any[]): number {
    if (args.length === 1) {
      return this.x * args[0].x + this.y * args[0].y;
    } else {
      return this.x * args[0] + this.y * args[1];
    }
  }

  public cross(z: number): Vector2;
  public cross(vector: Vector2): number;
  public cross(x: number, y: number): number;
  public cross(...args: any[]): number | Vector2 {
    if (args.length === 1) {
      if (typeof args[0] === "number") {
        return new Vector2(-args[0] * this.y, args[0] * this.x);
      }
      return this.x * args[0].y - this.y * args[0].x;
    } else {
      return this.x * args[1] - this.y * args[0];
    }
  }

  public isOrthogonal(vector: Vector2): boolean;
  public isOrthogonal(x: number, y: number): boolean;
  public isOrthogonal(...args: any[]): boolean {
    if (args.length === 1) {
      return this.dot(args[0]) <= Epsilon.E;
    } else {
      return this.dot(args[0], args[1]) <= Epsilon.E;
    }
  }

  public isZero(): boolean {
    return Math.abs(this.x) <= Epsilon.E && Math.abs(this.y) <= Epsilon.E;
  }

  public negate(): Vector2 {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  public getNegative(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  public zero(): Vector2 {
    this.x = 0.0;
    this.y = 0.0;
    return this;
  }

  private _rotate(cos: number, sin: number): Vector2;
  private _rotate(cos: number, sin: number, x: number, y: number): Vector2;
  private _rotate(...args: any[]): Vector2 {
    if (args.length === 2) {
      const cos = args[0] as number;
      const sin = args[1] as number;
      const x = this.x;
      const y = this.y;
      this.x = x * cos - y * sin;
      this.y = x * sin + y * cos;
      return this;
    } else {
      const cos = args[0] as number;
      const sin = args[1] as number;
      const x = args[2] as number;
      const y = args[3] as number;
      const tx = this.x - x;
      const ty = this.y - y;
      this.x = tx * cos - ty * sin + x;
      this.y = tx * sin + ty * cos + y;
      return this;
    }
  }

  public rotate(theta: number): Vector2;
  public rotate(rotation: Rotation): Vector2;
  public rotate(theta: number, x: number, y: number): Vector2;
  public rotate(rotate: Rotation, x: number, y: number): Vector2;
  public rotate(theta: number, vector: Vector2): Vector2;
  public rotate(rotation: Rotation, vector: Vector2): Vector2;
  public rotate(...args: any[]): Vector2 {
    if (args.length === 1) {
      if (typeof args[0] === "number") {
        return this._rotate(Math.cos(args[0]), Math.sin(args[0]));
      }
      return this._rotate(args[0].cost, args[0].sint);
    } else if (args.length === 2) {
      return this.rotate(args[0], args[1].x, args[1].y);
    } else {
      if (typeof args[0] === "number") {
        return this._rotate(Math.cos(args[0]), Math.sin(args[0]), args[1], args[2]);
      }
      return this._rotate(args[0].cost, args[0].sint, args[1], args[2]);
    }
  }

  public inverseRotate(theta: number): Vector2;
  public inverseRotate(rotation: Rotation): Vector2;
  public inverseRotate(theta: number, x: number, y: number): Vector2;
  public inverseRotate(rotation: Rotation, x: number, y: number): Vector2;
  public inverseRotate(theta: number, vector: Vector2): Vector2;
  public inverseRotate(rotation: Rotation, vector: Vector2): Vector2;
  public inverseRotate(...args: any[]): Vector2 {
    if (args.length === 1) {
      if (typeof args[0] === "number") {
        return this._rotate(Math.cos(args[0]), -Math.sin(args[0]));
      }
      return this._rotate(args[0].cost, -args[0].sint);
    } else if (args.length === 2) {
      return this.inverseRotate(args[0], args[1].x, args[1].y);
    } else {
      if (typeof args[0] === "number") {
        return this._rotate(Math.cos(args[0]), -Math.sin(args[0]), args[1], args[2]);
      }
      return this._rotate(args[0].cost, -args[0].sint, args[1], args[2]);
    }
  }

  public project(vector: Vector2): Vector2 {
    const dotProd = this.dot(vector);
    let denominator = vector.dot(vector);
    if (denominator <= Epsilon.E) return new Vector2();
    denominator = dotProd / denominator;
    return new Vector2(denominator * vector.x, denominator * vector.y);
  }

  public getRightHandOrthogonalVector(): Vector2 {
    return new Vector2(-this.y, this.x);
  }

  public right(): Vector2 {
    const tmp = this.x;
    this.x = -this.y;
    this.y = tmp;
    return this;
  }

  public getLeftHandOrthogonalVector(): Vector2 {
    return new Vector2(this.y, -this.x);
  }

  public left(): Vector2 {
    const tmp = this.x;
    this.x = this.y;
    this.y = -tmp;
    return this;
  }

  public getNormalized(): Vector2 {
    const magnitude = this.getMagnitude();
    if (magnitude <= Epsilon.E) return new Vector2();
    return new Vector2(this.x / magnitude, this.y / magnitude);
  }

  public normalize(): number {
    const magnitude = this.getMagnitude();
    if (magnitude <= Epsilon.E) return 0;
    this.x /= magnitude;
    this.y /= magnitude;
    return magnitude;
  }

  public getAngleBetween(vector: Vector2): number;
  public getAngleBetween(otherAngle: number): number;
  public getAngleBetween(...args: any[]): number {
    if (args[0] instanceof Vector2) {
      const a = Math.atan2(args[0].y, args[0].x) - Math.atan2(this.y, this.x);
      if (a > Math.PI) return a - TWO_PI;
      if (a < -Math.PI) return a + TWO_PI;
      return a;
    } else {
      const a = args[0] - Math.atan2(this.y, this.x);
      if (a > Math.PI) return a - TWO_PI;
      if (a < -Math.PI) return a + TWO_PI;
      return a;
    }
  }

}