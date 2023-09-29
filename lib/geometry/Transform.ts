import { Copyable } from "../Copyable";
import { TWO_PI } from "./Geometry";
import { Interval } from "./Interval";
import { Rotation } from "./Rotation";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";

export class Transform implements Transformable, Copyable<Transform> {
  cost: number = 1;
  sint: number = 0;
  x: number = 0;
  y: number = 0;

  constructor();
  constructor(transform: Transform);
  constructor(cost: number, sint: number, x: number, y: number);
  constructor(...args: any[]) {
    if (args.length === 0) {
      this.cost = 1;
      this.sint = 0;
      this.x = 0;
      this.y = 0;
    } else if (args.length === 1) {
      if (args[0] instanceof Transform) {
        const transform = args[0];
        this.cost = transform.cost;
        this.sint = transform.sint;
        this.x = transform.x;
        this.y = transform.y;
      }
    } else if (args.length === 4) {
      this.cost = args[0];
      this.sint = args[1];
      this.x = args[2];
      this.y = args[3];
    }
  }

  public translate(vector: Vector2): void;
  public translate(x: number, y: number): void;
  public translate(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.x += x.x;
      this.y += x.y;
    } else if (typeof x === "number" && typeof y === "number") {
      this.x += x;
      this.y += y;
    }
  }

  private _rotate(c: number, s: number): void;
  private _rotate(c: number, s: number, x: number, y: number): void;
  private _rotate(c: number, s: number, x?: number, y?: number): void {
    const cost = Interval.clamp(c * this.cost - s * this.sint, -1, 1);
    const sint = Interval.clamp(s * this.cost + c * this.sint, -1, 1);
    this.cost = cost;
    this.sint = sint;
    if (x != null && y != null) {
      const cx = this.x - x;
      const cy = this.y - y;
      this.x = cx * c - cy * s + x;
      this.y = cx * s + cy * c + y;
    } else {
      const x = c * this.x - s * this.y;
      const y = s * this.x + c * this.y;
      this.x = x;
      this.y = y;
    }
  }

  public rotate(theta: number): void;
  public rotate(rotation: Rotation): void;
  public rotate(theta: number, vector: Vector2): void;
  public rotate(rotation: Rotation, vector: Vector2): void;
  public rotate(theta: number, x: number, y: number): void;
  public rotate(rotation: Rotation, x: number, y: number): void;
  public rotate(...args: any[]): void {
    if (args.length === 1) {
      if (typeof args[0] === "number") {
        const theta = args[0];
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        this._rotate(c, s);
      } else if (args[0] instanceof Rotation) {
        const rotation = args[0];
        this._rotate(rotation.cost, rotation.sint);
      }
    } else if (args.length === 2) {
      this.rotate(args[0], args[1].x, args[1].y);
    } else if (args.length === 3) {
      if (args[0] instanceof Rotation) {
        this._rotate(args[0].cost, args[0].sint, args[1], args[2]);
      } else {
        this._rotate(Math.cos(args[0]), Math.sin(args[0]), args[1], args[2]);
      }
    }
  }

  public copy(): Transform {
    return new Transform(this);
  }

  public set(transform: Transform): void {
    this.cost = transform.cost;
    this.sint = transform.sint;
    this.x = transform.x;
    this.y = transform.y;
  }

  public identity(): void {
    this.cost = 1;
    this.sint = 0;
    this.x = 0;
    this.y = 0;
  }

  public isIdentity(): boolean {
    return this.cost === 1 && this.sint === 0 && this.x === 0 && this.y === 0;
  }

  public getTransformedX(vector: Vector2): number {
    return this.cost * vector.x - this.sint * vector.y + this.x;
  }

  public getTransformedY(vector: Vector2): number {
    return this.sint * vector.x + this.cost * vector.y + this.y;
  }

  public transformX(vector: Vector2): void {
    vector.x = this.getTransformedX(vector);
  }

  public transformY(vector: Vector2): void {
    vector.y = this.getTransformedY(vector);
  }

  public getTransformed(vector: Vector2): Vector2;
  public getTransformed(vector: Vector2, destination: Vector2): void;
  public getTransformed(vector: Vector2, destination?: Vector2): Vector2 | void {
    if (destination == null)
      return new Vector2(this.getTransformedX(vector), this.getTransformedY(vector));
    destination.x = this.getTransformedX(vector);
    destination.y = this.getTransformedY(vector);
  }

  public transform(vector: Vector2): void {
    const x = this.getTransformedX(vector);
    const y = this.getTransformedY(vector);
    vector.x = x;
    vector.y = y;
  }

  public getInverseTransformed(vector: Vector2): Vector2;
  public getInverseTransformed(vector: Vector2, destination: Vector2): void;
  public getInverseTransformed(vector: Vector2, destination?: Vector2): Vector2 | void {
    if (destination == null) {
      const tx = vector.x - this.x;
      const ty = vector.y - this.y;
      const x = this.cost * tx + this.sint * ty;
      const y = -this.sint * tx + this.cost * ty;
      return new Vector2(x, y);
    }
    const tx = vector.x - this.x;
    const ty = vector.y - this.y;
    destination.x = this.cost * tx + this.sint * ty;
    destination.y = -this.sint * tx + this.cost * ty;
  }

  public inverseTransform(vector: Vector2): void {
    const tx = vector.x - this.x;
    const ty = vector.y - this.y;
    vector.x = this.cost * tx + this.sint * ty;
    vector.y = -this.sint * tx + this.cost * ty;
  }

  public getTransformedR(vector: Vector2): Vector2;
  public getTransformedR(vector: Vector2, destination: Vector2): void;
  public getTransformedR(vector: Vector2, destination?: Vector2): Vector2 | void {
    if (destination == null) {
      const x = this.cost * vector.x - this.sint * vector.y;
      const y = this.sint * vector.x + this.cost * vector.y;
      return new Vector2(x, y);
    }
    destination.x = this.cost * vector.x - this.sint * vector.y;
    destination.y = this.sint * vector.x + this.cost * vector.y;
  }

  public transformR(vector: Vector2): void {
    const x = this.cost * vector.x - this.sint * vector.y;
    const y = this.sint * vector.x + this.cost * vector.y;
    vector.x = x;
    vector.y = y;
  }

  public getInverseTransformedR(vector: Vector2): Vector2;
  public getInverseTransformedR(vector: Vector2, destination: Vector2): void;
  public getInverseTransformedR(vector: Vector2, destination?: Vector2): Vector2 | void {
    if (destination == null) {
      const x = this.cost * vector.x + this.sint * vector.y;
      const y = -this.sint * vector.x + this.cost * vector.y;
      return new Vector2(x, y);
    }
    destination.x = this.cost * vector.x + this.sint * vector.y;
    destination.y = -this.sint * vector.x + this.cost * vector.y;
  }

  public inverseTransformR(vector: Vector2): void {
    const x = this.cost * vector.x + this.sint * vector.y;
    const y = -this.sint * vector.x + this.cost * vector.y;
    vector.x = x;
    vector.y = y;
  }

  public getTranslationX(): number {
    return this.x;
  }

  public getTranslationY(): number {
    return this.y;
  }

  public getTranslation(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public setTranslationX(x: number): void {
    this.x = x;
  }

  public setTranslationY(y: number): void {
    this.y = y;
  }

  public setTranslation(x: number, y: number): void;
  public setTranslation(vector: Vector2): void;
  public setTranslation(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.x = x.x;
      this.y = x.y;
    } else if (typeof x === "number" && typeof y === "number") {
      this.x = x;
      this.y = y;
    }
  }

  public getTranslationTransform(): Transform {
    return new Transform(1, 0, this.x, this.y);
  }

  public getCost(): number {
    return this.cost;
  }

  public getSint(): number {
    return this.sint;
  }

  public getRotationAngle(): number {
    const acos = Math.acos(this.cost);
    return this.sint < 0 ? -acos : acos;
  }

  public getRotation(): Rotation {
    return Rotation.of(this);
  }

  public setRotation(theta: number): number;
  public setRotation(rotation: Rotation): Rotation;
  public setRotation(theta: unknown): number | Rotation {
    if (typeof theta === "number") {
      const r = this.getRotationAngle();
      this.cost = Math.cos(theta);
      this.sint = Math.sin(theta);
      return r;
    } else if (theta instanceof Rotation) {
      const r = this.getRotation();
      this.cost = theta.cost;
      this.sint = theta.sint;
      return r;
    }
  }

  public getRotationTransform(): Transform {
    return new Transform(this.cost, this.sint, 0, 0);
  }

  public getValues(): number[] {
    return [this.cost, -this.sint, this.x, this.sint, this.cost, this.y];
  }

  private rotateOnly(theta: number): void {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const cost = Interval.clamp(c * this.cost - s * this.sint, -1, 1);
    const sint = Interval.clamp(s * this.cost + c * this.sint, -1, 1);
    this.cost = cost;
    this.sint = sint;
  }

  public lerp(end: Transform, alpha: number): void;
  public lerp(end: Transform, alpha: number, result: Transform): void;
  public lerp(dp: Vector2, da: number, alpha: number): void;
  public lerp(dp: Vector2, da: number, alpha: number, result: Transform): void;
  public lerp(...args: any[]): void {
    if (args[0] instanceof Transform) {
      const end = args[0];
      const alpha = args[1];
      const x = (1.0 - alpha) * this.x + alpha * end.x;
      const y = (1.0 - alpha) * this.y + alpha * end.y;

      const rs = this.getRotationAngle();
      const re = end.getRotationAngle();

      let diff = re - rs;
      if (diff < -Math.PI) diff += TWO_PI;
      if (diff > Math.PI) diff -= TWO_PI;

      const a = diff * alpha + rs;
      if (args.length === 2) {
        this.cost = Math.cos(a);
        this.sint = Math.sin(a);
        this.x = x;
        this.y = y;
      } else if (args.length === 3) {
        const result = args[2];
        result.cost = Math.cos(a);
        result.sint = Math.sin(a);
        result.x = x;
        result.y = y;
      }
    } else if (args[0] instanceof Vector2) {
      const dp = args[0];
      const da = args[1];
      const alpha = args[2];
      if (args.length === 3) {
        this.rotateOnly(da * alpha);
        this.translate(dp.x * alpha, dp.y * alpha);
      } else if (args.length === 4) {
        const result = args[3];
        result.set(this);
        result.rotateOnly(da * alpha);
        result.translate(dp.x * alpha, dp.y * alpha);
      }
    }
  }

  public lerped(dp: Vector2, da: number, alpha: number): Transform;
  public lerped(end: Transform, alpha: number): Transform;
  public lerped(...args: [Vector2, number, number] | [Transform, number]): Transform {
    const result = new Transform();
    if (args[0] instanceof Vector2) {
      this.lerp(...(args as [Vector2, number, number]), result);
    } else if (args[0] instanceof Transform) {
      this.lerp(...(args as [Transform, number]), result);
    }
    return result;
  }

}

