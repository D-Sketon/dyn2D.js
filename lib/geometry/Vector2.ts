import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";
import { TWO_PI } from "./Geometry";
import { Rotation } from "./Rotation";

/**
 * This class represents a vector or point in 2D space.
 */
export class Vector2 implements Copyable<Vector2> {
  /**
   * A vector representing the x-axis
   */
  static readonly X_AXIS = new Vector2(1, 0);
  /**
   * A vector representing the y-axis
   */
  static readonly Y_AXIS = new Vector2(0, 1);
  /**
   * A vector representing the negative x-axis
   */
  static readonly INV_X_AXIS = new Vector2(-1, 0);
  /**
   * A vector representing the negative y-axis
   */
  static readonly INV_Y_AXIS = new Vector2(0, -1);
  /**
   * A vector representing the origin
   */
  static readonly ZERO = new Vector2(0, 0);

  /**
   * The x coordinate of the vector.
   */
  x: number = 0;
  /**
   * The y coordinate of the vector.
   */
  y: number = 0;

  /**
   * Default constructor.
   */
  constructor();
  /**
   * Copy constructor.
   * @param vector The {@link Vector2} to copy
   */
  constructor(vector: Vector2);
  /**
   * Full constructor.
   * @param x The x coordinate of the vector
   * @param y The y coordinate of the vector
   */
  constructor(x: number, y: number);
  /**
   * Full constructor.
   * @param x1 The x coordinate of the first point
   * @param y1 The y coordinate of the first point
   * @param x2 The x coordinate of the second point
   * @param y2 The y coordinate of the second point
   */
  constructor(x1: number, y1: number, x2: number, y2: number);
  /**
   * Full constructor.
   * @param p1 The first point
   * @param p2 The second point
   */
  constructor(p1: Vector2, p2: Vector2);
  /**
   * Full constructor.
   * @param direction The direction in radians of the vector
   */
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

  /**
   * Returns a {@link Vector2} with the given magnitude and direction.
   * @param magnitude The magnitude of the {@link Vector2}
   * @param direction The direction of the {@link Vector2} in radians
   * @returns The {@link Vector2} with the given magnitude and direction
   */
  public static create(magnitude: number, direction: number): Vector2 {
    const x = magnitude * Math.cos(direction);
    const y = magnitude * Math.sin(direction);
    return new Vector2(x, y);
  }

  public copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Returns the distance from this point to the given point.
   * @param point The point to get the distance to
   * @returns The distance from this point to the given point
   */
  public distance(point: Vector2): number;
  /**
   * Returns the distance from this point to the given point.
   * @param x The x coordinate of the point
   * @param y The y coordinate of the point
   * @returns The distance from this point to the given point
   */
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

  /**
   * Returns the distance squared from this point to the given point.
   * @param point The point to get the distance squared to
   * @returns The distance squared from this point to the given point
   */
  public distanceSquared(point: Vector2): number;
  /**
   * Returns the distance squared from this point to the given point.
   * @param x The x coordinate of the point
   * @param y The y coordinate of the point
   * @returns The distance squared from this point to the given point
   */
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

  /**
   * The triple product of {@link Vector2}s is defined as:
   * ```
   * a x (b x c)
   * ```
   * However, this method performs the following triple product:
   * ```
   * (a x b) x c
   * ```
   * this can be simplified to:
   * ```
   * -a * (b &middot; c) + b * (a &middot; c)
   * ```
   * or:
   * ```
   * b * (a &middot; c) - a * (b &middot; c)
   * ```
   * @param a The a {@link Vector2} in the above equation
   * @param b The b {@link Vector2} in the above equation
   * @param c The c {@link Vector2} in the above equation
   * @returns The result of the triple product
   */
  public static tripleProduct(a: Vector2, b: Vector2, c: Vector2): Vector2 {
    const r = new Vector2();
    const dot = a.x * b.y - a.y * b.x;
    r.x = -c.y * dot;
    r.y = c.x * dot;
    return r;
  }

  /**
   * Returns true if the given {@link Vector2} is perpendicular to this {@link Vector2}.
   * @param vector The {@link Vector2} to compare
   * @returns true if the given {@link Vector2} is perpendicular to this {@link Vector2}
   */
  public equals(vector: Vector2): boolean;
  /** 
   * Return true if the x and y coordinates of the given {@link Vector2} are equal to the x and y coordinates of this {@link Vector2}.
   * @param x The x coordinate of the {@link Vector2} to compare
   * @param y The y coordinate of the {@link Vector2} to compare
   * @returns true if the x and y coordinates of the given {@link Vector2} are equal to the x and y coordinates of this {@link Vector2}
   */
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

  /**
   * Method to set the x and y coordinates of this {@link Vector2} to the given {@link Vector2}.
   * @param vector The {@link Vector2} to set
   * @returns This {@link Vector2} for chaining 
   */
  public set(vector: Vector2): Vector2;
  /**
   * Method to set the x and y coordinates of this {@link Vector2} to the given x and y coordinates.
   * @param x The x coordinate of the {@link Vector2} to set
   * @param y The y coordinate of the {@link Vector2} to set
   * @returns This {@link Vector2} for chaining
   */
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

  /**
   * Returns the x component of this {@link Vector2}.
   * @returns The x component of this {@link Vector2}
   */
  public getXComponent(): Vector2 {
    return new Vector2(this.x, 0);
  }

  /**
   * Returns the y component of this {@link Vector2}.
   * @returns The y component of this {@link Vector2}
   */
  public getYComponent(): Vector2 {
    return new Vector2(0, this.y);
  }

  /**
   * Returns the magnitude of this {@link Vector2}.
   * @returns The magnitude of this {@link Vector2}
   */
  public getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns the magnitude of this {@link Vector2} squared.
   * @returns The magnitude of this {@link Vector2} squared
   */
  public getMagnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Method to set the magnitude of this {@link Vector2}.
   * @param magnitude The magnitude to set
   * @returns This {@link Vector2} for chaining
   */
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
  /**
   * Returns the direction of this {@link Vector2} in radians.
   * @returns The direction of this {@link Vector2} in radians
   */
  public getDirection(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Method to set the direction of this {@link Vector2}.
   * @param direction The direction to set
   * @returns This {@link Vector2} for chaining
   */
  public setDirection(direction: number): Vector2 {
    const m = this.getMagnitude();
    this.x = m * Math.cos(direction);
    this.y = m * Math.sin(direction);
    return this;
  }

  /**
   * Method to add the given {@link Vector2} to this {@link Vector2}.
   * @param vector The {@link Vector2} to add
   * @returns This {@link Vector2} for chaining
   */
  public add(vector: Vector2): Vector2;
  /**
   * Method to add the given x and y coordinates to this {@link Vector2}.
   * @param x The x coordinate of the {@link Vector2} to add
   * @param y The y coordinate of the {@link Vector2} to add
   * @returns This {@link Vector2} for chaining
   */
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

  /**
   * Method to add the given x and y coordinates to this {@link Vector2} and return the result as a new {@link Vector2}.
   * @param vector The {@link Vector2} to sum
   * @returns A new {@link Vector2} with the sum of this {@link Vector2} and the given {@link Vector2}
   */
  public sum(vector: Vector2): Vector2;
  /**
   * Method to add the given x and y coordinates to this {@link Vector2} and return the result as a new {@link Vector2}.
   * @param x The x coordinate of the {@link Vector2} to sum
   * @param y The y coordinate of the {@link Vector2} to sum
   * @returns A new {@link Vector2} with the sum of this {@link Vector2} and the given x and y coordinates
   */
  public sum(x: number, y: number): Vector2;
  public sum(...args: any[]): Vector2 {
    if (args.length === 1) {
      return new Vector2(this.x + args[0].x, this.y + args[0].y);
    } else {
      return new Vector2(this.x + args[0], this.y + args[1]);
    }
  }

  /**
   * Method to subtract the given {@link Vector2} from this {@link Vector2}.
   * @param vector The {@link Vector2} to subtract
   * @returns This {@link Vector2} for chaining
   */
  public subtract(vector: Vector2): Vector2;
  /**
   * Method to subtract the given x and y coordinates from this {@link Vector2}.
   * @param x The x coordinate of the {@link Vector2} to subtract
   * @param y The y coordinate of the {@link Vector2} to subtract
   * @returns This {@link Vector2} for chaining
   */
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

  /**
   * Method to subtract the given {@link Vector2} from this {@link Vector2} and return the result as a new {@link Vector2}.
   * @param vector The {@link Vector2} to subtract
   * @returns A new {@link Vector2} with the difference of this {@link Vector2} and the given {@link Vector2}
   */
  public difference(vector: Vector2): Vector2;
  /**
   * Method to subtract the given x and y coordinates from this {@link Vector2} and return the result as a new {@link Vector2}.
   * @param x The x coordinate of the {@link Vector2} to subtract
   * @param y The y coordinate of the {@link Vector2} to subtract
   * @returns A new {@link Vector2} with the difference of this {@link Vector2} and the given x and y coordinates
   */
  public difference(x: number, y: number): Vector2;
  public difference(...args: any[]): Vector2 {
    if (args.length === 1) {
      return new Vector2(this.x - args[0].x, this.y - args[0].y);
    } else {
      return new Vector2(this.x - args[0], this.y - args[1]);
    }
  }

  /**
   * Method to create a {@link Vector2} from the given {@link Vector2} to this {@link Vector2}.
   * @param vector The {@link Vector2} to create a {@link Vector2} to
   * @returns The {@link Vector2} from the given {@link Vector2} to this {@link Vector2}
   */
  public to(vector: Vector2): Vector2;
  /**
   * Method to create a {@link Vector2} from the given x and y coordinates to this {@link Vector2}.
   * @param x The x coordinate of the {@link Vector2} to create a {@link Vector2} to
   * @param y The y coordinate of the {@link Vector2} to create a {@link Vector2} to
   * @returns The {@link Vector2} from the given x and y coordinates to this {@link Vector2}
   */
  public to(x: number, y: number): Vector2;
  public to(...args: any[]): Vector2 {
    if (args.length === 1) {
      return new Vector2(args[0].x - this.x, args[0].y - this.y);
    } else {
      return new Vector2(args[0] - this.x, args[1] - this.y);
    }
  }

  /**
   * Method to multiply this {@link Vector2} by the given scalar.
   * @param scalar The scalar to multiply this {@link Vector2} by
   * @returns This {@link Vector2} for chaining
   */
  public multiply(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Method to divide this {@link Vector2} by the given scalar.
   * @param scalar The scalar to divide this {@link Vector2} by
   * @returns This {@link Vector2} for chaining
   */
  public divide(scalar: number): Vector2 {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  /**
   * Method to multiply this {@link Vector2} by the given scalar and return the result as a new {@link Vector2}.
   * @param scalar The scalar to multiply this {@link Vector2} by
   * @returns A new {@link Vector2} with the product of this {@link Vector2} and the given scalar
   */
  public product(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /**
   * Method to divide this {@link Vector2} by the given scalar and return the result as a new {@link Vector2}.
   * @param scalar The scalar to divide this {@link Vector2} by
   * @returns A new {@link Vector2} with the quotient of this {@link Vector2} and the given scalar
   */
  public quotient(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  /**
   * Returns the dot product of this {@link Vector2} and the given {@link Vector2}.
   * @param vector The {@link Vector2} to dot with this {@link Vector2}
   * @returns The dot product of this {@link Vector2} and the given {@link Vector2}
   */
  public dot(vector: Vector2): number;
  /**
   * Returns the dot product of this {@link Vector2} and the given {@link Vector2}.
   * @param x The x coordinate of the {@link Vector2} to dot with this {@link Vector2}
   * @param y The y coordinate of the {@link Vector2} to dot with this {@link Vector2}
   * @returns The dot product of this {@link Vector2} and the given {@link Vector2}
   */
  public dot(x: number, y: number): number;
  public dot(...args: any[]): number {
    if (args.length === 1) {
      return this.x * args[0].x + this.y * args[0].y;
    } else {
      return this.x * args[0] + this.y * args[1];
    }
  }

  /**
   * Returns the cross product of this {@link Vector2} and the given {@link Vector2}.
   * @param z The z coordinate of the cross product
   * @returns The cross product of this {@link Vector2} and the given z coordinate
   */
  public cross(z: number): Vector2;
  /**
   * Returns the cross product of this {@link Vector2} and the given {@link Vector2}.
   * @param vector The {@link Vector2} to cross with this {@link Vector2}
   * @returns The cross product of this {@link Vector2} and the given {@link Vector2}
   */
  public cross(vector: Vector2): number;
  /**
   * Returns the cross product of this {@link Vector2} and the given {@link Vector2}.
   * @param x The x coordinate of the cross product
   * @param y The y coordinate of the cross product
   * @returns The cross product of this {@link Vector2} and the given x and y coordinates
   */
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

  /**
   * Returns true if this {@link Vector2} is perpendicular to the given {@link Vector2}.
   * @param vector The {@link Vector2} to compare
   * @returns true if this {@link Vector2} is perpendicular to the given {@link Vector2}
   */
  public isOrthogonal(vector: Vector2): boolean;
  /**
   * Returns true if this {@link Vector2} is perpendicular to the given {@link Vector2}.
   * @param x The x coordinate of the {@link Vector2} to compare
   * @param y The y coordinate of the {@link Vector2} to compare
   * @returns true if this {@link Vector2} is perpendicular to the given {@link Vector2}
   */
  public isOrthogonal(x: number, y: number): boolean;
  public isOrthogonal(...args: any[]): boolean {
    if (args.length === 1) {
      return this.dot(args[0]) <= Epsilon.E;
    } else {
      return this.dot(args[0], args[1]) <= Epsilon.E;
    }
  }

  /**
   * Returns true if this {@link Vector2} is the zero {@link Vector2}.
   * @returns true if this {@link Vector2} is the zero {@link Vector2}
   */
  public isZero(): boolean {
    return Math.abs(this.x) <= Epsilon.E && Math.abs(this.y) <= Epsilon.E;
  }

  /**
   * Negates this {@link Vector2}.
   * @returns This {@link Vector2} for chaining
   */
  public negate(): Vector2 {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * Method to negate this {@link Vector2} and return the result as a new {@link Vector2}.
   * @returns A new {@link Vector2} that is the negative of this {@link Vector2}
   */
  public getNegative(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  /**
   * Method to set this {@link Vector2} to the zero {@link Vector2}.
   * @returns This {@link Vector2} for chaining
   */
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

  /**
   * Rotates this {@link Vector2} by the given rotation.
   * @param theta The rotation agnle in radians
   * @returns This {@link Vector2} for chaining
   */
  public rotate(theta: number): Vector2;
  /**
   * Rotates this {@link Vector2} by the given rotation.
   * @param rotation The {@link Rotation} to rotate by
   * @returns This {@link Vector2} for chaining
   */
  public rotate(rotation: Rotation): Vector2;
  /**
   * Rotates this {@link Vector2} by the given rotation around the given point.
   * @param theta The rotation angle in radians
   * @param x The x coordinate of the point to rotate around
   * @param y The y coordinate of the point to rotate around
   * @returns This {@link Vector2} for chaining
   */
  public rotate(theta: number, x: number, y: number): Vector2;
  /**
   * Rotates this {@link Vector2} by the given rotation around the given point.
   * @param rotate The {@link Rotation} to rotate by
   * @param x The x coordinate of the point to rotate around
   * @param y The y coordinate of the point to rotate around
   * @returns This {@link Vector2} for chaining
   */
  public rotate(rotate: Rotation, x: number, y: number): Vector2;
  /**
   * Rotates this {@link Vector2} by the given rotation around the given point.
   * @param theta The rotation angle in radians
   * @param vector The point to rotate around
   * @returns This {@link Vector2} for chaining
   */
  public rotate(theta: number, vector: Vector2): Vector2;
  /**
   * Rotates this {@link Vector2} by the given rotation around the given point.
   * @param rotation The {@link Rotation} to rotate by
   * @param vector The point to rotate around
   * @returns This {@link Vector2} for chaining
   */
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

  /**
   * Rotates this {@link Vector2} by the inverse of the given rotation.
   * @param theta The rotation angle in radians
   * @returns This {@link Vector2} for chaining
   */
  public inverseRotate(theta: number): Vector2;
  /**
   * Rotates this {@link Vector2} by the inverse of the given rotation.
   * @param rotation The {@link Rotation} to rotate by
   * @returns This {@link Vector2} for chaining
   */
  public inverseRotate(rotation: Rotation): Vector2;
  /**
   * Rotates this {@link Vector2} by the inverse of the given rotation around the given point.
   * @param theta The rotation angle in radians
   * @param x The x coordinate of the point to rotate around
   * @param y The y coordinate of the point to rotate around
   * @returns This {@link Vector2} for chaining
   */
  public inverseRotate(theta: number, x: number, y: number): Vector2;
  /**
   * Rotates this {@link Vector2} by the inverse of the given rotation around the given point.
   * @param rotation The {@link Rotation} to rotate by
   * @param x The x coordinate of the point to rotate around
   * @param y The y coordinate of the point to rotate around
   * @returns This {@link Vector2} for chaining
   */
  public inverseRotate(rotation: Rotation, x: number, y: number): Vector2;
  /**
   * Rotates this {@link Vector2} by the inverse of the given rotation around the given point.
   * @param theta The rotation angle in radians
   * @param vector The point to rotate around
   * @returns This {@link Vector2} for chaining
   */
  public inverseRotate(theta: number, vector: Vector2): Vector2;
  /**
   * Rotates this {@link Vector2} by the inverse of the given rotation around the given point.
   * @param rotation The {@link Rotation} to rotate by
   * @param vector The point to rotate around
   * @returns This {@link Vector2} for chaining
   */
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

  /**
   * Method to project this {@link Vector2} onto the given {@link Vector2}.
   * @param vector The {@link Vector2} to project onto this {@link Vector2}
   * @returns The projection of the given {@link Vector2} onto this {@link Vector2}
   */
  public project(vector: Vector2): Vector2 {
    const dotProd = this.dot(vector);
    let denominator = vector.dot(vector);
    if (denominator <= Epsilon.E) return new Vector2();
    denominator = dotProd / denominator;
    return new Vector2(denominator * vector.x, denominator * vector.y);
  }

  /**
   * Returns the right hand orthogonal {@link Vector2} of this {@link Vector2}.
   * @returns The right hand orthogonal {@link Vector2} of this {@link Vector2}
   */
  public getRightHandOrthogonalVector(): Vector2 {
    return new Vector2(-this.y, this.x);
  }

  /**
   * Method to set this {@link Vector2} to its right hand orthogonal {@link Vector2}.
   * @returns This {@link Vector2} for chaining
   */
  public right(): Vector2 {
    const tmp = this.x;
    this.x = -this.y;
    this.y = tmp;
    return this;
  }

  /**
   * Returns the left hand orthogonal {@link Vector2} of this {@link Vector2}.
   * @returns The left hand orthogonal {@link Vector2} of this {@link Vector2}
   */
  public getLeftHandOrthogonalVector(): Vector2 {
    return new Vector2(this.y, -this.x);
  }

  /**
   * Method to set this {@link Vector2} to its left hand orthogonal {@link Vector2}.
   * @returns This {@link Vector2} for chaining
   */
  public left(): Vector2 {
    const tmp = this.x;
    this.x = this.y;
    this.y = -tmp;
    return this;
  }

  /**
   * Returns a new {@link Vector2} that is the normalized version of this {@link Vector2}.
   * @returns A new {@link Vector2} that is the normalized version of this {@link Vector2}
   */
  public getNormalized(): Vector2 {
    const magnitude = this.getMagnitude();
    if (magnitude <= Epsilon.E) return new Vector2();
    return new Vector2(this.x / magnitude, this.y / magnitude);
  }

  /**
   * Returns the magnitude of this {@link Vector2} before normalizing.
   * @returns The magnitude of this {@link Vector2} before normalizing
   */
  public normalize(): number {
    const magnitude = this.getMagnitude();
    if (magnitude <= Epsilon.E) return 0;
    this.x /= magnitude;
    this.y /= magnitude;
    return magnitude;
  }

  /**
   * Returns the angle between this {@link Vector2} and the given {@link Vector2}.
   * @param vector The {@link Vector2} to get the angle between
   * @returns The angle between this {@link Vector2} and the given {@link Vector2}
   */
  public getAngleBetween(vector: Vector2): number;
  /**
   * Returns the angle between this {@link Vector2} and the given {@link Vector2}.
   * @param otherAngle The angle to get the angle between
   * @returns The angle between this {@link Vector2} and the given angle
   */
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