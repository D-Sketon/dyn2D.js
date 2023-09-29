import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";
import { Interval } from "./Interval";
import { Transform } from "./Transform";
import { Vector2 } from "./Vector2";

export class Rotation implements Copyable<Rotation>{

  static readonly SQRT_2_INV: number = 1.0 / Math.sqrt(2);

  cost: number;
  sint: number;

  constructor();
  constructor(angle: number);
  constructor(rotation: Rotation);
  constructor(cost: number, sint: number);
  constructor(...args: any[]) {
    if (args.length === 0) {
      this.cost = 1;
      this.sint = 0;
    } else if (args.length === 1) {
      if (typeof args[0] === "number") {
        const angle = args[0];
        this.cost = Math.cos(angle);
        this.sint = Math.sin(angle);
      } else if (args[0] instanceof Rotation) {
        const rotation = args[0];
        this.cost = rotation.cost;
        this.sint = rotation.sint;
      }
    } else if (args.length === 2) {
      const cost = args[0];
      const sint = args[1];
      this.cost = cost;
      this.sint = sint;
    }
  }

  public static of(angle: number): Rotation;
  public static of(direction: Vector2): Rotation;
  public static of(cost: number, sint: number): Rotation;
  public static of(transform: Transform): Rotation;
  public static of(...args: any[]): Rotation {
    if (args.length === 1) {
      if (typeof args[0] === "number") {
        const angle = args[0];
        return new Rotation(angle);
      } else if (args[0] instanceof Vector2) {
        const direction = args[0];
        const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
        if (magnitude <= Epsilon.E) {
          return new Rotation();
        }
        return new Rotation(direction.x / magnitude, direction.y / magnitude);
      } else if (args[0] instanceof Transform) {
        const transform = args[0];
        return new Rotation(transform.cost, transform.sint);
      }
    } else if (args.length === 2) {
      const cost = args[0];
      const sint = args[1];
      const magnitude = cost * cost + sint * sint;
      if (Math.abs(magnitude - 1) > Epsilon.E) {
        throw new Error("Invalid rotation");
      }
      return new Rotation(cost, sint);
    }
  }

  public static ofDegrees(angle: number): Rotation;
  public static ofDegrees(angle: number): Rotation {
    return new Rotation(angle * Math.PI / 180);
  }

  public static rotate0(): Rotation {
    return new Rotation(1, 0);
  }

  public static rotate90(): Rotation {
    return new Rotation(0, 1);
  }

  public static rotate180(): Rotation {
    return new Rotation(-1, 0);
  }

  public static rotate270(): Rotation {
    return new Rotation(0, -1);
  }

  public static rotate45(): Rotation {
    return new Rotation(Rotation.SQRT_2_INV, Rotation.SQRT_2_INV);
  }

  public static rotate135(): Rotation {
    return new Rotation(-Rotation.SQRT_2_INV, Rotation.SQRT_2_INV);
  }

  public static rotate225(): Rotation {
    return new Rotation(-Rotation.SQRT_2_INV, -Rotation.SQRT_2_INV);
  }

  public static rotate315(): Rotation {
    return new Rotation(Rotation.SQRT_2_INV, -Rotation.SQRT_2_INV);
  }

  public copy(): Rotation {
    return new Rotation(this);
  }

  public equals(rotation: Rotation): boolean;
  public equals(rotation: Rotation, error: number): boolean;
  public equals(angle: number): boolean;
  public equals(angle: number, error: number): boolean;
  public equals(...args: any[]): boolean {
    if (args.length === 1) {
      if (args[0] instanceof Rotation) {
        const rotation = args[0];
        return this.cost === rotation.cost && this.sint === rotation.sint;
      } else if (typeof args[0] === "number") {
        const angle = args[0];
        return this.cost === Math.cos(angle) && this.sint === Math.sin(angle);
      }
    } else if (args.length === 2) {
      const error = args[1];
      if (args[0] instanceof Rotation) {
        const rotation = args[0];
        return Math.abs(this.cost - rotation.cost) <= error && Math.abs(this.sint - rotation.sint) <= error;
      } else if (typeof args[0] === "number") {
        const angle = args[0];
        return Math.abs(this.cost - Math.cos(angle)) < error && Math.abs(this.sint - Math.sin(angle)) < error;
      }
    }
    return false;
  }

  public set(angle: number): Rotation
  public set(rotation: Rotation): Rotation;
  public set(arg: unknown): Rotation {
    if (typeof arg === "number") {
      const angle = arg;
      this.cost = Math.cos(angle);
      this.sint = Math.sin(angle);
    } else if (arg instanceof Rotation) {
      const rotation = arg;
      this.cost = rotation.cost;
      this.sint = rotation.sint;
    }
    return this;
  }

  public setIdentity(): Rotation {
    this.cost = 1;
    this.sint = 0;
    return this;
  }

  public toRadians(): number {
    const acos = Math.acos(this.cost);
    const angle = this.sint < 0 ? -acos : acos;
    return angle;
  }

  public toDegrees(): number {
    return this.toRadians() * 180 / Math.PI;
  }

  public toVector(): Vector2 {
    return new Vector2(this.cost, this.sint);
  }

  private rotate45Helper(cost: number, sint: number): Rotation {
    this.cost = Rotation.SQRT_2_INV * (cost - sint);
    this.sint = Rotation.SQRT_2_INV * (cost + sint);
    return this;
  }

  private getRotated45Helper(cost: number, sint: number): Rotation {
    return new Rotation(
      Rotation.SQRT_2_INV * (cost - sint),
      Rotation.SQRT_2_INV * (cost + sint)
    );
  }

  public rotate45(): Rotation {
    return this.rotate45Helper(this.cost, this.sint);
  }

  public getRotated45(): Rotation {
    return this.getRotated45Helper(this.cost, this.sint);
  }

  public rotate90(): Rotation {
    const tmp = this.cost;
    this.cost = -this.sint;
    this.sint = tmp;
    return this;
  }

  public getRotated90(): Rotation {
    return new Rotation(-this.sint, this.cost);
  }

  public rotate135(): Rotation {
    return this.rotate45Helper(-this.sint, this.cost);
  }

  public getRotated135(): Rotation {
    return this.getRotated45Helper(-this.sint, this.cost);
  }

  public rotate180(): Rotation {
    this.cost = -this.cost;
    this.sint = -this.sint;
    return this;
  }

  public getRotated180(): Rotation {
    return new Rotation(-this.cost, -this.sint);
  }

  public rotate225(): Rotation {
    return this.rotate45Helper(-this.cost, -this.sint);
  }

  public getRotated225(): Rotation {
    return this.getRotated45Helper(-this.cost, -this.sint);
  }

  public rotate270(): Rotation {
    const tmp = this.cost;
    this.cost = this.sint;
    this.sint = -tmp;
    return this;
  }

  public getRotated270(): Rotation {
    return new Rotation(this.sint, -this.cost);
  }

  public rotate315(): Rotation {
    return this.rotate45Helper(this.sint, -this.cost);
  }

  public getRotated315(): Rotation {
    return this.getRotated45Helper(this.sint, -this.cost);
  }

  public inverse(): Rotation {
    this.sint = -this.sint;
    return this;
  }

  public getInversed(): Rotation {
    return new Rotation(this.cost, -this.sint);
  }

  private _rotate(c: number, s: number): Rotation {
    const cost = this.cost;
    const sint = this.sint;
    this.cost = Interval.clamp(cost * c - sint * s, -1, 1);
    this.sint = Interval.clamp(cost * s + sint * c, -1, 1);
    return this;
  }

  public getRotated(angle: number): Rotation;
  public getRotated(c: number, s: number): Rotation;
  public getRotated(c: number, s?: number): Rotation {
    if (typeof s === "number") {
      return new Rotation(
        Interval.clamp(this.cost * c - this.sint * s, -1, 1),
        Interval.clamp(this.cost * s + this.sint * c, -1, 1)
      );
    } return this.getRotated(Math.cos(c), Math.sin(c));

  }

  public rotate(rotation: Rotation): Rotation;
  public rotate(angle: number): Rotation;
  public rotate(arg: unknown): Rotation {
    if (arg instanceof Rotation) {
      const rotation = arg;
      return this._rotate(rotation.cost, rotation.sint);
    } else if (typeof arg === "number") {
      const angle = arg;
      return this._rotate(Math.cos(angle), Math.sin(angle));
    }
  }

  public isIdentity(error?: number): boolean {
    if (error === undefined) {
      error = Epsilon.E;
    }
    return Math.abs(this.cost - 1) <= error && Math.abs(this.sint) <= error;
  }

  public dot(rotation: Rotation | Vector2): number {
    if (rotation instanceof Rotation) {
      return this.cost * rotation.cost + this.sint * rotation.sint;
    }
    return this.cost * rotation.x + this.sint * rotation.y;
  }

  public cross(rotation: Rotation | Vector2): number {
    if (rotation instanceof Rotation) {
      return this.cost * rotation.sint - this.sint * rotation.cost;
    }
    return this.cost * rotation.y - this.sint * rotation.x;
  }

  public compare(other: Rotation | Vector2): number {
    const cmp = this.cross(other);
    if (cmp > 0) {
      return 1;
    } else if (cmp < 0) {
      return -1;
    } else {
      return 0;
    }
  }

  public getRotationBetween(rotation: Rotation | Vector2): Rotation {
    if (rotation instanceof Rotation) {
      return new Rotation(this.dot(rotation), this.cross(rotation));
    }
    return this.getRotationBetween(Rotation.of(rotation));
  }
}