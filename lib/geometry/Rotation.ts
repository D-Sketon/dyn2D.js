import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";
import { Interval } from "./Interval";
import { Transform } from "./Transform";
import { Vector2 } from "./Vector2";

/**
 * This class represents a rotation (in 2D space).
 */
export class Rotation implements Copyable<Rotation>{
  /**
   * 1/sqrt(2)
   */
  static readonly SQRT_2_INV: number = 1.0 / Math.sqrt(2);

  /**
   * The cosine of the angle of rotation.
   */
  cost: number;
  /**
   * The sine of the angle of rotation.
   */
  sint: number;

  /**
   * Default constructor. Creates a rotation of 0 radians.
   */
  constructor();
  /**
   * Minimal constructor. Creates a rotation with the given angle.
   * @param angle The angle of rotation in radians.
   */
  constructor(angle: number);
  /**
   * Copy constructor. Creates a copy of the given {@link Rotation}.
   * @param rotation The {@link Rotation} to copy.
   */
  constructor(rotation: Rotation);
  /**
   * Full constructor. Creates a rotation with the given cosine and sine values.
   * @param cost The cosine of the angle of rotation.
   * @param sint The sine of the angle of rotation.
   */
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

  /**
   * Creates a {@link Rotation} with the given angle in radians.
   * @param angle The angle of rotation in radians.
   * @returns The created {@link Rotation}.
   */
  public static of(angle: number): Rotation;
  /**
   * Creates a {@link Rotation} with the given direction.
   * @param direction The direction of rotation.
   * @returns The created {@link Rotation}.
   */
  public static of(direction: Vector2): Rotation;
  /**
   * Creates a {@link Rotation} with the given cosine and sine values.
   * @param cost The cosine of the angle of rotation.
   * @param sint The sine of the angle of rotation.
   * @returns The created {@link Rotation}.
   * @throws `Error` If the given cosine and sine values do not represent a valid rotation.
   */
  public static of(cost: number, sint: number): Rotation;
  /**
   * Creates a {@link Rotation} from the given {@link Transform}.
   * @param transform The {@link Transform} to create a {@link Rotation} from.
   * @returns The created {@link Rotation}.
   * @see {@link Transform}
   */
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
        throw new Error("Rotation.of: Invalid rotation");
      }
      return new Rotation(cost, sint);
    }
  }

  /**
   * Creates a {@link Rotation} with the given angle in degrees.
   * @param angle The angle of rotation in degrees.
   */
  public static ofDegrees(angle: number): Rotation {
    return new Rotation(angle * Math.PI / 180);
  }

  /**
   * Returns a {@link Rotation} representing no rotation.
   * @returns A {@link Rotation} representing no rotation.
   */
  public static rotation0(): Rotation {
    return new Rotation(1, 0);
  }

  /**
   * Returns a {@link Rotation} representing a 90 degree rotation.
   * @returns A {@link Rotation} representing a 90 degree rotation.
   */
  public static rotation90(): Rotation {
    return new Rotation(0, 1);
  }

  /**
   * Returns a {@link Rotation} representing a 180 degree rotation.
   * @returns A {@link Rotation} representing a 180 degree rotation.
   */
  public static rotation180(): Rotation {
    return new Rotation(-1, 0);
  }

  /**
   * Returns a {@link Rotation} representing a 270 degree rotation.
   * @returns A {@link Rotation} representing a 270 degree rotation.
   */
  public static rotation270(): Rotation {
    return new Rotation(0, -1);
  }

  /**
   * Returns a {@link Rotation} representing a 45 degree rotation.
   * @returns A {@link Rotation} representing a 45 degree rotation.
   */
  public static rotation45(): Rotation {
    return new Rotation(Rotation.SQRT_2_INV, Rotation.SQRT_2_INV);
  }

  /**
   * Returns a {@link Rotation} representing a 135 degree rotation.
   * @returns A {@link Rotation} representing a 135 degree rotation.
   */
  public static rotation135(): Rotation {
    return new Rotation(-Rotation.SQRT_2_INV, Rotation.SQRT_2_INV);
  }

  /**
   * Returns a {@link Rotation} representing a 225 degree rotation.
   * @returns A {@link Rotation} representing a 225 degree rotation.
   */
  public static rotation225(): Rotation {
    return new Rotation(-Rotation.SQRT_2_INV, -Rotation.SQRT_2_INV);
  }

  /**
   * Returns a {@link Rotation} representing a 315 degree rotation.
   * @returns A {@link Rotation} representing a 315 degree rotation.
   */
  public static rotation315(): Rotation {
    return new Rotation(Rotation.SQRT_2_INV, -Rotation.SQRT_2_INV);
  }

  public copy(): Rotation {
    return new Rotation(this);
  }

  /**
   * Method to compare this {@link Rotation} to another {@link Rotation}.
   * @param rotation The {@link Rotation} to compare to.
   * @returns `true` if this {@link Rotation} is equal to the given {@link Rotation}, `false` otherwise.
   */
  public equals(rotation: Rotation): boolean;
  /**
   * Method to compare this {@link Rotation} to another {@link Rotation}.
   * @param rotation The {@link Rotation} to compare to.
   * @param error The allowed error to use when comparing the cosine and sine values.
   * @returns `true` if this {@link Rotation} is equal to the given {@link Rotation}, `false` otherwise.
   */
  public equals(rotation: Rotation, error: number): boolean;
  /**
   * Method to compare this {@link Rotation} to an angle.
   * @param angle The angle to compare to.
   * @returns `true` if this {@link Rotation} is equal to the given angle, `false` otherwise.
   */
  public equals(angle: number): boolean;
  /**
   * Method to compare this {@link Rotation} to an angle.
   * @param angle The angle to compare to.
   * @param error The allowed error to use when comparing the cosine and sine values.
   * @returns `true` if this {@link Rotation} is equal to the given angle, `false` otherwise.
   */
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

  /**
   * Method to set this {@link Rotation} to the given angle.
   * @param angle The angle in radians
   * @returns This {@link Rotation}
   */
  public set(angle: number): Rotation
  /**
   * Method to set this {@link Rotation} to the given {@link Rotation}.
   * @param rotation The {@link Rotation} to set this {@link Rotation} to
   * @returns This {@link Rotation}
   */
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

  /**
   * Method to set this {@link Rotation} to be the identity rotation.
   * @returns This {@link Rotation}
   */
  public setIdentity(): Rotation {
    this.cost = 1;
    this.sint = 0;
    return this;
  }

  /**
   * Returns the angle of rotation in radians.
   * @returns The angle of rotation in radians.
   */
  public toRadians(): number {
    const acos = Math.acos(this.cost);
    const angle = this.sint < 0 ? -acos : acos;
    return angle;
  }

  /**
   * Returns the angle of rotation in degrees.
   * @returns The angle of rotation in degrees.
   */
  public toDegrees(): number {
    return this.toRadians() * 180 / Math.PI;
  }

  /**
   * Returns this {@link Rotation} as a direction vector.
   * @returns This {@link Rotation} as a direction vector.
   */
  public toVector(): Vector2;
  /**
   * Returns this {@link Rotation} as a direction vector with the given magnitude.
   * @param magnitude The magnitude of the vector to return.
   * @returns This {@link Rotation} as a direction vector with the given magnitude.
   */
  public toVector(magnitude: number): Vector2;
  public toVector(magnitude?: number): Vector2 {
    if (magnitude === undefined) {
      return new Vector2(this.cost, this.sint);
    }
    return new Vector2(this.cost * magnitude, this.sint * magnitude);
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

  /**
   * Method to rotate this {@link Rotation} 45 degrees.
   * @returns This {@link Rotation} rotated 45 degrees.
   */
  public rotate45(): Rotation {
    return this.rotate45Helper(this.cost, this.sint);
  }

  /**
   * Method to get a {@link Rotation} rotated 45 degrees.
   * @returns A {@link Rotation} rotated 45 degrees.
   */
  public getRotated45(): Rotation {
    return this.getRotated45Helper(this.cost, this.sint);
  }

  /**
   * Method to rotate this {@link Rotation} 90 degrees.
   * @returns This {@link Rotation} rotated 90 degrees.
   */
  public rotate90(): Rotation {
    const tmp = this.cost;
    this.cost = -this.sint;
    this.sint = tmp;
    return this;
  }

  /**
   * Method to get a {@link Rotation} rotated 90 degrees.
   * @returns A {@link Rotation} rotated 90 degrees.
   */
  public getRotated90(): Rotation {
    return new Rotation(-this.sint, this.cost);
  }

  /**
   * Method to rotate this {@link Rotation} 135 degrees.
   * @returns This {@link Rotation} rotated 135 degrees.
   */
  public rotate135(): Rotation {
    return this.rotate45Helper(-this.sint, this.cost);
  }

  /**
   * Method to get a {@link Rotation} rotated 135 degrees.
   * @returns A {@link Rotation} rotated 135 degrees.
   */
  public getRotated135(): Rotation {
    return this.getRotated45Helper(-this.sint, this.cost);
  }

  /**
   * Method to rotate this {@link Rotation} 180 degrees.
   * @returns This {@link Rotation} rotated 180 degrees.
   */
  public rotate180(): Rotation {
    this.cost = -this.cost;
    this.sint = -this.sint;
    return this;
  }

  /**
   * Method to get a {@link Rotation} rotated 180 degrees.
   * @returns A {@link Rotation} rotated 180 degrees.
   */
  public getRotated180(): Rotation {
    return new Rotation(-this.cost, -this.sint);
  }

  /**
   * Method to rotate this {@link Rotation} 225 degrees.
   * @returns This {@link Rotation} rotated 225 degrees.
   */
  public rotate225(): Rotation {
    return this.rotate45Helper(-this.cost, -this.sint);
  }

  /**
   * Method to get a {@link Rotation} rotated 225 degrees.
   * @returns A {@link Rotation} rotated 225 degrees.
   */
  public getRotated225(): Rotation {
    return this.getRotated45Helper(-this.cost, -this.sint);
  }

  /**
   * Method to rotate this {@link Rotation} 270 degrees.
   * @returns This {@link Rotation} rotated 270 degrees.
   */
  public rotate270(): Rotation {
    const tmp = this.cost;
    this.cost = this.sint;
    this.sint = -tmp;
    return this;
  }

  /**
   * Method to get a {@link Rotation} rotated 270 degrees.
   * @returns A {@link Rotation} rotated 270 degrees.
   */
  public getRotated270(): Rotation {
    return new Rotation(this.sint, -this.cost);
  }

  /**
   * Method to rotate this {@link Rotation} 315 degrees.
   * @returns This {@link Rotation} rotated 315 degrees.
   */
  public rotate315(): Rotation {
    return this.rotate45Helper(this.sint, -this.cost);
  }

  /**
   * Method to get a {@link Rotation} rotated 315 degrees.
   * @returns A {@link Rotation} rotated 315 degrees.
   */
  public getRotated315(): Rotation {
    return this.getRotated45Helper(this.sint, -this.cost);
  }

  /**
   * Method to invert this {@link Rotation}.
   * @returns This {@link Rotation} inverted.
   */
  public inverse(): Rotation {
    this.sint = -this.sint;
    return this;
  }

  /**
   * Method to get the inverse of this {@link Rotation}.
   * @returns A {@link Rotation} representing the inverse of this {@link Rotation}.
   */
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

  /**
   * Method to rotate this {@link Rotation} by the given {@link Rotation}.
   * @param rotation The {@link Rotation} to rotate by.
   * @returns A new {@link Rotation} representing the result of the rotation.
   */
  public getRotated(rotation: Rotation): Rotation;
  /**
   * Method to rotate this {@link Rotation} by the given angle.
   * @param angle The angle to rotate by in radians.
   * @returns A new {@link Rotation} representing the result of the rotation.
   */
  public getRotated(angle: number): Rotation;
  /**
   * Method to rotate this {@link Rotation} by the given cosine and sine values.
   * @param c The cosine of the angle to rotate by.
   * @param s The sine of the angle to rotate by.
   * @returns A new {@link Rotation} representing the result of the rotation.
   */
  public getRotated(c: number, s: number): Rotation;
  public getRotated(c: unknown, s?: number): Rotation {
    if (c instanceof Rotation) {
      return this.getRotated(c.cost, c.sint);
    } else if (typeof c === "number") {
      if (typeof s === "number") {
        return new Rotation(
          Interval.clamp(this.cost * c - this.sint * s, -1, 1),
          Interval.clamp(this.cost * s + this.sint * c, -1, 1)
        );
      }
      return this.getRotated(Math.cos(c), Math.sin(c));
    }
  }

  /**
   * Method to rotate this {@link Rotation} by the given {@link Rotation}.
   * @param rotation The {@link Rotation} to rotate by.
   * @returns This {@link Rotation} rotated by the given {@link Rotation}.
   */
  public rotate(rotation: Rotation): Rotation;
  /**
   * Method to rotate this {@link Rotation} by the given angle.
   * @param angle The angle to rotate by in radians.
   * @returns This {@link Rotation} rotated by the given angle.
   */
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

  /**
   * Returns true if this {@link Rotation} is the identity rotation, false otherwise.
   * @param error The allowed error to use when comparing the cosine and sine values.
   * @returns true if this {@link Rotation} is the identity rotation, false otherwise.
   */
  public isIdentity(error?: number): boolean {
    if (error === undefined) {
      error = Epsilon.E;
    }
    return Math.abs(this.cost - 1) <= error && Math.abs(this.sint) <= error;
  }

  /**
   * Method to get the dot product of this {@link Rotation} and the given {@link Rotation}.
   * @param rotation The {@link Rotation} to get the dot product with.
   * @returns The dot product of this {@link Rotation} and the given {@link Rotation}.
   */
  public dot(rotation: Rotation | Vector2): number {
    if (rotation instanceof Rotation) {
      return this.cost * rotation.cost + this.sint * rotation.sint;
    }
    return this.cost * rotation.x + this.sint * rotation.y;
  }

  /**
   * Method to get the cross product of this {@link Rotation} and the given {@link Rotation}.
   * @param rotation The {@link Rotation} to get the cross product with.
   * @returns The cross product of this {@link Rotation} and the given {@link Rotation}.
   */
  public cross(rotation: Rotation | Vector2): number {
    if (rotation instanceof Rotation) {
      return this.cost * rotation.sint - this.sint * rotation.cost;
    }
    return this.cost * rotation.y - this.sint * rotation.x;
  }

  /**
   * Compares this {@link Rotation} to the given {@link Rotation} or {@link Vector2}.
   * @param other The {@link Rotation} or {@link Vector2} to compare to.
   * @returns 1 if &theta; &gt; 0, -1 if &theta; &lt; 0 and 0 otherwise
   */
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

  /**
   * Returns the angle between this {@link Rotation} and the given {@link Rotation} or {@link Vector2}.
   * @param rotation The {@link Rotation} to get the angle between.
   * @returns The angle between this {@link Rotation} and the given {@link Rotation}.
   */
  public getRotationBetween(rotation: Rotation | Vector2): Rotation {
    if (rotation instanceof Rotation) {
      return new Rotation(this.dot(rotation), this.cross(rotation));
    }
    return this.getRotationBetween(Rotation.of(rotation));
  }

  public toString(): string {
    return `Rotation[cost=${this.cost}, sint=${this.sint}]`;
  }
}