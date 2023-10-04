import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";

/**
 * This class represents a vector or point in 3D space.
 */
export class Vector3 implements Copyable<Vector3>{
  /**
   * The x component of the {@link Vector3}.
   */
  x: number;
  /**
   * The y component of the {@link Vector3}.
   */
  y: number;
  /**
   * The z component of the {@link Vector3}.
   */
  z: number;

  /**
   * Default constructor.
   */
  constructor();
  /**
   * Copy constructor.
   * @param vector The {@link Vector3} to copy
   */
  constructor(vector: Vector3);
  /**
   * Full constructor.
   * @param x The x component
   * @param y The y component
   * @param z The z component
   */
  constructor(x: number, y: number, z: number);
  /**
   * Full constructor.
   * @param x1 The x component of the first point
   * @param y1 The y component of the first point
   * @param z1 The z component of the first point
   * @param x2 The x component of the second point
   * @param y2 The y component of the second point
   * @param z2 The z component of the second point
   */
  constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number);
  /**
   * Full constructor.
   * @param p1 The first point
   * @param p2 The second point
   */
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

  /**
   * Returns the distance between this vector and the given x, y, and z components.
   * @param x The x component of the {@link Vector3}
   * @param y The y component of the {@link Vector3}
   * @param z The z component of the {@link Vector3}
   * @returns The distance between this {@link Vector3} and the given x, y, and z components
   */
  public distance(x: number, y: number, z: number): number;
  /**
   * Returns the distance between this {@link Vector3} and the given {@link Vector3}.
   * @param point The {@link Vector3} to get the distance to
   * @returns The distance between this {@link Vector3} and the given {@link Vector3}
   */
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

  /**
   * Returns the distance squared between this {@link Vector3} and the given x, y, and z components.
   * @param x The x component of the {@link Vector3}
   * @param y The y component of the {@link Vector3}
   * @param z The z component of the {@link Vector3}
   * @returns The distance squared between this {@link Vector3} and the given x, y, and z components
   */
  public distanceSquared(x: number, y: number, z: number): number;
  /**
   * Returns the distance squared between this vector and the given {@link Vector3}.
   * @param point The {@link Vector3} to get the distance squared to
   * @returns The distance squared between this vector and the given {@link Vector3}
   */
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

  /**
	 * The triple product of {@link Vector3}s is defined as:
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
   * @param a The a {@link Vector3} in the above equation
   * @param b The b {@link Vector3} in the above equation
   * @param c The c {@link Vector3} in the above equation
   * @returns The triple product as described above
   */
  public static tripleProduct(a: Vector3, b: Vector3, c: Vector3): Vector3 {
    let r = new Vector3();
    let ac = a.x * c.x + a.y * c.y + a.z * c.z;
    let bc = b.x * c.x + b.y * c.y + b.z * c.z;
    r.x = b.x * ac - a.x * bc;
    r.y = b.y * ac - a.y * bc;
    r.z = b.z * ac - a.z * bc;
    return r;
  }

  /**
   * Return true if the x, y, and z components of this {@link Vector3} are the same as the given x, y, and z components.
   * @param x The x component of the {@link Vector3} to compare
   * @param y The y component of the {@link Vector3} to compare
   * @param z The z component of the {@link Vector3} to compare
   * @returns true if the x, y, and z components of this {@link Vector3} are the same as the given x, y, and z components
   */
  public equals(x: number, y: number, z: number): boolean;
  /**
   * Return true if this {@link Vector3} is the same as the given {@link Vector3}.
   * @param vector The {@link Vector3} to compare
   * @returns true if this {@link Vector3} is the same as the given {@link Vector3}
   */
  public equals(vector: Vector3): boolean;
  public equals(x: any, y?: number, z?: number): boolean {
    if (x instanceof Vector3) {
      if (this === x) return true;
      return this.x === x.x && this.y === x.y && this.z === x.z;
    } else {
      return this.x === x && this.y === y && this.z === z;
    }
  }

  /**
   * Method to set the x, y, and z components of this {@link Vector3} to the given x, y, and z components.
   * @param x The x component of the {@link Vector3} to set
   * @param y The y component of the {@link Vector3} to set
   * @param z The z component of the {@link Vector3} to set
   * @returns This {@link Vector3} object for chaining
   */
  public set(x: number, y: number, z: number): Vector3;
  /**
   * Method to set this {@link Vector3} to the given {@link Vector3}.
   * @param vector The {@link Vector3} to set
   * @returns This {@link Vector3} object for chaining
   */
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

  /**
   * Returns the x component of this {@link Vector3}.
   * @returns The x component of this {@link Vector3}
   */
  public getXComponent(): Vector3 {
    return new Vector3(this.x, 0, 0);
  }

  /**
   * Returns the y component of this {@link Vector3}.
   * @returns The y component of this {@link Vector3}
   */
  public getYComponent(): Vector3 {
    return new Vector3(0, this.y, 0);
  }

  /**
   * Returns the z component of this {@link Vector3}.
   * @returns The z component of this {@link Vector3}
   */
  public getZComponent(): Vector3 {
    return new Vector3(0, 0, this.z);
  }

  /**
   * Returns the magnitude of this {@link Vector3}.
   * @returns The magnitude of this {@link Vector3}
   */
  public getMagnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * Returns the magnitude of this {@link Vector3} squared.
   * @returns The magnitude of this {@link Vector3} squared
   */
  public getMagnitudeSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * Method to set the magnitude of this {@link Vector3}.
   * @param magnitude The magnitude to set
   * @returns This {@link Vector3} for chaining
   */
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

  /**
   * Method to add the given x, y, and z components to this {@link Vector3}.
   * @param x The x component of the {@link Vector3} to add
   * @param y The y component of the {@link Vector3} to add
   * @param z The z component of the {@link Vector3} to add
   * @returns This {@link Vector3} for chaining
   */
  public add(x: number, y: number, z: number): Vector3;
  /**
   * Method to add the given {@link Vector3} to this {@link Vector3}.
   * @param vector The {@link Vector3} to add
   * @returns This {@link Vector3} for chaining
   */
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

  /**
   * Method to add the given x, y, and z components to this {@link Vector3} and return the result as a new {@link Vector3}.
   * @param x The x component of the {@link Vector3} to add
   * @param y The y component of the {@link Vector3} to add
   * @param z The z component of the {@link Vector3} to add
   * @returns A new {@link Vector3} with the sum of this {@link Vector3} and the given x, y, and z components
   */
  public sum(x: number, y: number, z: number): Vector3;
  /**
   * Method to add the given {@link Vector3} to this {@link Vector3} and return the result as a new {@link Vector3}.
   * @param vector The {@link Vector3} to add
   * @returns A new {@link Vector3} with the sum of this {@link Vector3} and the given {@link Vector3}
   */
  public sum(vector: Vector3): Vector3;
  public sum(x: any, y?: number, z?: number): Vector3 {
    if (x instanceof Vector3) {
      return new Vector3(this.x + x.x, this.y + x.y, this.z + x.z);
    } else {
      return new Vector3(this.x + x, this.y + y, this.z + z);
    }
  }

  /**
   * Method to subtract the given x, y, and z components from this {@link Vector3}.
   * @param x The x component of the {@link Vector3} to subtract
   * @param y The y component of the {@link Vector3} to subtract
   * @param z The z component of the {@link Vector3} to subtract
   * @returns This {@link Vector3} for chaining
   */
  public subtract(x: number, y: number, z: number): Vector3;
  /**
   * Method to subtract the given {@link Vector3} from this {@link Vector3}.
   * @param vector The {@link Vector3} to subtract
   * @returns This {@link Vector3} for chaining
   */
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

  /**
   * Method to subtract the given x, y, and z components from this {@link Vector3} and return the result as a new {@link Vector3}.
   * @param x The x component of the {@link Vector3} to subtract
   * @param y The y component of the {@link Vector3} to subtract
   * @param z The z component of the {@link Vector3} to subtract
   * @returns A new {@link Vector3} with the difference of this {@link Vector3} and the given x, y, and z components
   */
  public difference(x: number, y: number, z: number): Vector3;
  /**
   * Method to subtract the given {@link Vector3} from this {@link Vector3} and return the result as a new {@link Vector3}.
   * @param vector The {@link Vector3} to subtract
   * @returns A new {@link Vector3} with the difference of this {@link Vector3} and the given {@link Vector3}
   */
  public difference(vector: Vector3): Vector3;
  public difference(x: any, y?: number, z?: number): Vector3 {
    if (x instanceof Vector3) {
      return new Vector3(this.x - x.x, this.y - x.y, this.z - x.z);
    } else {
      return new Vector3(this.x - x, this.y - y, this.z - z);
    }
  }

  /**
   * Method to create a {@link Vector3} from the given x, y, and z components to this {@link Vector3}.
   * @param x The x component of the {@link Vector3} to create a {@link Vector3} to
   * @param y The y component of the {@link Vector3} to create a {@link Vector3} to
   * @param z The z component of the {@link Vector3} to create a {@link Vector3} to
   * @returns The {@link Vector3} from the given x, y, and z components to this {@link Vector3}
   */
  public to(x: number, y: number, z: number): Vector3;
  /**
   * Method to create a {@link Vector3} from the given {@link Vector3} to this {@link Vector3}.
   * @param vector The {@link Vector3} to create a {@link Vector3} to
   * @returns The {@link Vector3} from the given {@link Vector3} to this {@link Vector3}
   */
  public to(vector: Vector3): Vector3;
  public to(x: any, y?: number, z?: number): Vector3 {
    if (x instanceof Vector3) {
      return new Vector3(x.x - this.x, x.y - this.y, x.z - this.z);
    } else {
      return new Vector3(x - this.x, y - this.y, z - this.z);
    }
  }

  /**
   * Method to multiply this {@link Vector3} by the given scalar.
   * @param scalar The scalar to multiply this {@link Vector3} by
   * @returns This {@link Vector3} for chaining
   */
  public multiply(scalar: number): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  /**
   * Method to multiply this {@link Vector3} by the given scalar and return the result as a new {@link Vector3}.
   * @param scalar The scalar to multiply this {@link Vector3} by
   * @returns A new {@link Vector3} with the product of this {@link Vector3} and the given scalar
   */
  public product(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  /**
   * Returns the dot product of this {@link Vector3} and the given x, y, and z components.
   * @param x The x coordinate of the {@link Vector3} to dot with this {@link Vector3}
   * @param y The y coordinate of the {@link Vector3} to dot with this {@link Vector3}
   * @param z The z coordinate of the {@link Vector3} to dot with this {@link Vector3}
   * @returns The dot product of this {@link Vector3} and the given {@link Vector3}
   */
  public dot(x: number, y: number, z: number): number;
  /**
   * Returns the dot product of this {@link Vector3} and the given {@link Vector3}.
   * @param vector The {@link Vector3} to dot with this {@link Vector3}
   * @returns The dot product of this {@link Vector3} and the given {@link Vector3}
   */
  public dot(vector: Vector3): number;
  public dot(x: any, y?: number, z?: number): number {
    if (x instanceof Vector3) {
      return this.x * x.x + this.y * x.y + this.z * x.z;
    } else {
      return this.x * x + this.y * y + this.z * z;
    }
  }

  /**
   * Returns the cross product of this {@link Vector3} and the given x, y, and z components.
   * @param x The x component of the {@link Vector3} to cross with this {@link Vector3}
   * @param y The y component of the {@link Vector3} to cross with this {@link Vector3}
   * @param z The z component of the {@link Vector3} to cross with this {@link Vector3}
   * @returns The cross product of this {@link Vector3} and the given x, y, and z components
   */
  public cross(x: number, y: number, z: number): Vector3;
  /**
   * Returns the cross product of this {@link Vector3} and the given {@link Vector3}.
   * @param vector The {@link Vector3} to cross with this {@link Vector3}
   * @returns The cross product of this {@link Vector3} and the given {@link Vector3}
   */
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

  /**
   * Returns true if this {@link Vector3} is perpendicular to the given x, y, and z components.
   * @param x The x component of the {@link Vector3} to compare
   * @param y The y component of the {@link Vector3} to compare
   * @param z The z component of the {@link Vector3} to compare
   * @returns true if this {@link Vector3} is perpendicular to the given x, y, and z components
   */
  public isOrthogonal(x: number, y: number, z: number): boolean;
  /**
   * Returns true if this {@link Vector3} is perpendicular to the given {@link Vector3}.
   * @param vector The {@link Vector3} to compare
   * @returns true if this {@link Vector3} is perpendicular to the given {@link Vector3}
   */
  public isOrthogonal(vector: Vector3): boolean;
  public isOrthogonal(x: any, y?: number, z?: number): boolean {
    if (x instanceof Vector3) {
      return Math.abs(this.x * x.x + this.y * x.y + this.z * x.z) <= Epsilon.E;
    } else {
      return Math.abs(this.x * x + this.y * y + this.z * z) <= Epsilon.E;
    }
  }

  /**
   * Returns true if this {@link Vector3} is the zero {@link Vector3}.
   * @returns true if this {@link Vector3} is the zero {@link Vector3}
   */
  public isZero(): boolean {
    return Math.abs(this.x) <= Epsilon.E &&
      Math.abs(this.y) <= Epsilon.E &&
      Math.abs(this.z) <= Epsilon.E;
  }

  /**
   * Negates this {@link Vector3}.
   * @returns This {@link Vector3} for chaining
   */
  public negate(): Vector3 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  /**
   * Method to negate this {@link Vector3} and return the result as a new {@link Vector3}.
   * @returns A new {@link Vector3} that is the negative of this {@link Vector3}
   */
  public getNegative(): Vector3 {
    return new Vector3(-this.x, -this.y, -this.z);
  }

  /**
   * Method to set this {@link Vector3} to the zero {@link Vector3}.
   * @returns This {@link Vector3} for chaining
   */
  public zero(): Vector3 {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
  }

  /**
   * Method to project this {@link Vector3} onto the given {@link Vector3}.
   * @param vector The {@link Vector3} to project onto this {@link Vector3}
   * @returns The projection of the given {@link Vector3} onto this {@link Vector3}
   */
  public project(vector: Vector3): Vector3 {
    const dotProd = this.dot(vector);
    let denominator = vector.dot(vector);
    if (denominator <= Epsilon.E) return new Vector3();
    denominator = dotProd / denominator;
    return new Vector3(denominator * vector.x, denominator * vector.y, denominator * vector.z);
  }

  /**
   * Returns a new {@link Vector3} that is the normalized version of this {@link Vector3}.
   * @returns A new {@link Vector3} that is the normalized version of this {@link Vector3}
   */
  public getNormalized(): Vector3 {
    let magnitude = this.getMagnitude();
    if (magnitude <= Epsilon.E) return new Vector3();
    magnitude = 1 / magnitude;
    return new Vector3(this.x * magnitude, this.y * magnitude, this.z * magnitude);
  }

  /**
   * Returns the magnitude of this {@link Vector3} before normalizing.
   * @returns The magnitude of this {@link Vector3} before normalizing
   */
  public normalize(): number {
    let magnitude = this.getMagnitude();
    if (magnitude <= Epsilon.E) return 0;
    magnitude = 1 / magnitude;
    this.x *= magnitude;
    this.y *= magnitude;
    this.z *= magnitude;
    return magnitude;
  }

  public toString(): string {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`;
  }
}