import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";
import { Vector2 } from "./Vector2";

/**
 * Represents a 2x2 Matrix.
 */
export class Matrix22 implements Copyable<Matrix22>{
  /**
   * The 0,0 element of the matrix.
   */
  m00: number;
  /**
   * The 0,1 element of the matrix.
   */
  m01: number;
  /**
   * The 1,0 element of the matrix.
   */
  m10: number;
  /**
   * The 1,1 element of the matrix.
   */
  m11: number;

  /**
   * Default constructor.
   */
  constructor();
  /**
   * Copy constructor.
   * @param matrix The {@link Matrix22} to copy
   */
  constructor(matrix: Matrix22);
  /**
   * Full constructor.
   * @param values The values of the matrix in row-major order
   * @throws `Error` if the values array does not have exactly 4 elements
   */
  constructor(values: number[]);
  /**
   * Full constructor.
   * @param m00 The 0,0 element of the matrix
   * @param m01 The 0,1 element of the matrix
   * @param m10 The 1,0 element of the matrix
   * @param m11 The 1,1 element of the matrix
   */
  constructor(m00: number, m01: number, m10: number, m11: number);
  constructor(m00?: any, m01?: any, m10?: any, m11?: any) {
    if (m00 instanceof Matrix22) {
      this.m00 = m00.m00;
      this.m01 = m00.m01;
      this.m10 = m00.m10;
      this.m11 = m00.m11;
    } else if (m00 instanceof Array) {
      if (m00.length != 4) {
        throw new Error("Matrix22: The values array must have exactly 4 elements");
      }
      this.m00 = m00[0];
      this.m01 = m00[1];
      this.m10 = m00[2];
      this.m11 = m00[3];
    } else if (typeof m00 === "number" && typeof m01 === "number" && typeof m10 === "number" && typeof m11 === "number") {
      this.m00 = m00;
      this.m01 = m01;
      this.m10 = m10;
      this.m11 = m11;
    } else {
      this.m00 = 0;
      this.m01 = 0;
      this.m10 = 0;
      this.m11 = 0;
    }
  }

  public copy(): Matrix22 {
    return new Matrix22(this);
  }

  /**
   * Method to add the given {@link Matrix22} to this {@link Matrix22}.
   * ```
   * this = this + m
   * ```
   * @param matrix The {@link Matrix22} to add
   * @returns This {@link Matrix22}
   */
  public add(matrix: Matrix22): Matrix22 {
    this.m00 += matrix.m00;
    this.m01 += matrix.m01;
    this.m10 += matrix.m10;
    this.m11 += matrix.m11;
    return this;
  }

  /**
   * Returns a new {@link Matrix22} containing the sum of this {@link Matrix22} and the given {@link Matrix22}.
   * ```
   * r = this + m
   * ```
   * @param matrix The {@link Matrix22} to add
   * @returns A new {@link Matrix22} containing the result
   */
  public sum(matrix: Matrix22): Matrix22 {
    return this.copy().add(matrix);
  }

  /**
   * Method to subtract the given {@link Matrix22} from this {@link Matrix22}.
   * ```
   * this = this - m
   * ```
   * @param matrix The {@link Matrix22} to subtract
   * @returns This {@link Matrix22}
   */
  public subtract(matrix: Matrix22): Matrix22 {
    this.m00 -= matrix.m00;
    this.m01 -= matrix.m01;
    this.m10 -= matrix.m10;
    this.m11 -= matrix.m11;
    return this;
  }

  /**
   * Returns a new {@link Matrix22} containing the difference between this {@link Matrix22} and the given {@link Matrix22}.
   * ```
   * r = this - m
   * ```
   * @param matrix The {@link Matrix22} to subtract
   * @returns A new {@link Matrix22} containing the result
   */
  public difference(matrix: Matrix22): Matrix22 {
    return this.copy().subtract(matrix);
  }

  /**
   * Method to multiply this {@link Matrix22} by the given scalar.
   * ```
   * this = this * scalar
   * ```
   * @param scalar The scalar to multiply this {@link Matrix22} by
   * @returns This {@link Matrix22}
   */
  public multiply(scalar: number): Matrix22;
  /**
   * Method to multiply this {@link Matrix22} by the given {@link Matrix22}.
   * ```
   * this = this * m
   * ```
   * @param matrix The {@link Matrix22} to multiply this {@link Matrix22} by
   * @returns This {@link Matrix22}
   */
  public multiply(matrix: Matrix22): Matrix22;
  /**
   * Method to multiply this {@link Matrix22} by the given {@link Vector2}.
   * ```
   * v = this * v
   * ```
   * @param vector The {@link Vector2} to multiply this {@link Matrix22} by
   * @returns The given {@link Vector2} after multiplication
   */
  public multiply(vector: Vector2): Vector2;
  public multiply(matrix: unknown): Matrix22 | Vector2 {
    if (matrix instanceof Matrix22) {
      const m00 = this.m00 * matrix.m00 + this.m01 * matrix.m10;
      const m01 = this.m00 * matrix.m01 + this.m01 * matrix.m11;
      const m10 = this.m10 * matrix.m00 + this.m11 * matrix.m10;
      const m11 = this.m10 * matrix.m01 + this.m11 * matrix.m11;
      this.m00 = m00;
      this.m01 = m01;
      this.m10 = m10;
      this.m11 = m11;
      return this;
    } else if (matrix instanceof Vector2) {
      const x = matrix.x;
      const y = matrix.y;
      matrix.x = this.m00 * x + this.m01 * y;
      matrix.y = this.m10 * x + this.m11 * y;
      return matrix;
    } else if (typeof matrix === "number") {
      this.m00 *= matrix;
      this.m01 *= matrix;
      this.m10 *= matrix;
      this.m11 *= matrix;
      return this;
    }
  }

  /**
   * Returns a new {@link Matrix22} containing the result of multiplying this {@link Matrix22} by the given scalar.
   * ```
   * r = this * scalar
   * ```
   * @param scalar The scalar to multiply this {@link Matrix22} by
   * @returns A new {@link Matrix22} containing the result
   */
  public product(scalar: number): Matrix22;
  /**
   * Returns a new {@link Matrix22} containing the result of multiplying this {@link Matrix22} by the given {@link Matrix22}.
   * ```
   * r = this * m
   * ```
   * @param matrix The {@link Matrix22} to multiply this {@link Matrix22} by
   * @returns A new {@link Matrix22} containing the result
   */
  public product(matrix: Matrix22): Matrix22;
  /**
   * Returns a new {@link Vector2} containing the result of multiplying this {@link Matrix22} by the given {@link Vector2}.
   * ```
   * r = this * v
   * ```
   * @param vector The {@link Vector2} to multiply this {@link Matrix22} by
   * @returns A new {@link Vector2} containing the result
   */
  public product(vector: Vector2): Vector2;
  public product(matrix: Matrix22 | Vector2 | number): Matrix22 | Vector2 {
    if (matrix instanceof Matrix22) return this.copy().multiply(matrix);
    else if (matrix instanceof Vector2) return this.multiply(matrix.copy());
    else if (typeof matrix === "number") return this.copy().multiply(matrix);
  }

  /**
   * Multiplies the given {@link Vector2} by this {@link Matrix22} and place the result in the given {@link Vector2}.
   * <p style="white-space: pre;"> v = v<sup>T</sup> * this</p>
   * @param vector The {@link Vector2} to multiply this {@link Matrix22} by
   * @returns The given {@link Vector2} after multiplication
   */
  public multiplyT(vector: Vector2): Vector2 {
    const x = vector.x;
    const y = vector.y;
    vector.x = this.m00 * x + this.m10 * y;
    vector.y = this.m01 * x + this.m11 * y;
    return vector;
  }

  /**
   * Returns a new {@link Vector2} containing the result of multiplying this {@link Matrix22} by the given {@link Vector2}.
   * <p style="white-space: pre;"> r = v<sup>T</sup> * this</p>
   * @param vector The {@link Vector2} to multiply this {@link Matrix22} by
   * @returns A new {@link Vector2} containing the result
   */
  public productT(vector: Vector2): Vector2 {
    return this.multiplyT(vector.copy());
  }

  /**
   * Method to set this {@link Matrix22} to an identity {@link Matrix22}.
   * @returns This {@link Matrix22}
   */
  public identity(): Matrix22 {
    this.m00 = 1;
    this.m01 = 0;
    this.m10 = 0;
    this.m11 = 1;
    return this;
  }

  /**
   * Method to set this {@link Matrix22} to the transpose of itself.
   * @returns This {@link Matrix22}
   */
  public transpose(): Matrix22 {
    const m01 = this.m01;
    this.m01 = this.m10;
    this.m10 = m01;
    return this;
  }

  /**
   * Returns a new {@link Matrix22} containing the transpose of this {@link Matrix22}.
   * @returns A new {@link Matrix22} containing the transpose of this {@link Matrix22}.
   */
  public getTranspose(): Matrix22 {
    return this.copy().transpose();
  }

  /**
   * Returns the determinant of this {@link Matrix22}.
   * @returns The determinant of this {@link Matrix22}
   */
  public determinant(): number {
    return this.m00 * this.m11 - this.m01 * this.m10;
  }

  /**
   * Method to set this {@link Matrix22} to the inverse of itself.
   * @returns This {@link Matrix22}
   * @throws `Error` if the determinant is zero
   */
  public invert(): Matrix22;
  /**
   * Method to set the given {@link Matrix22} to the inverse of this {@link Matrix22}.
   * @param dest The {@link Matrix22} to set to the inverse of this {@link Matrix22}
   * @throws `Error` if the determinant is zero
   */
  public invert(dest: Matrix22): void;
  public invert(dest?: Matrix22): Matrix22 | void {
    let det = this.determinant();
    if (Math.abs(det) > Epsilon.E) {
      det = 1 / det;
    } else {
      throw new Error("Matrix22.invert: Determinant is zero");
    }
    if (dest == null) {
      const m00 = this.m00;
      const m01 = this.m01;
      const m10 = this.m10;
      const m11 = this.m11;
      this.m00 = m11 * det;
      this.m01 = -m01 * det;
      this.m10 = -m10 * det;
      this.m11 = m00 * det;
      return this;
    } else {
      dest.m00 = det * this.m11;
      dest.m01 = -det * this.m01;
      dest.m10 = -det * this.m10;
      dest.m11 = det * this.m00;
    }
  }

  /**
   * Returns a new {@link Matrix22} containing the inverse of this {@link Matrix22}.
   * @returns A new {@link Matrix22} containing the inverse of this {@link Matrix22}
   */
  public getInverse(): Matrix22 {
    return this.copy().invert();
  }

  /**
	 * Solves the system of linear equations:
	 * <p style="white-space: pre;"> Ax = b
	 * Multiply by A<sup>-1</sup> on both sides
	 * x = A<sup>-1</sup>b</p>
   * @param b The b {@link Vector2}
   * @returns The x {@link Vector2}
   */
  public solve(b: Vector2): Vector2 {
    let det = this.determinant();
    if (Math.abs(det) > Epsilon.E) {
      det = 1.0 / det;
    } else {
      throw new Error("Matrix22.invert: Determinant is zero");
    }
    const r = new Vector2();
    r.x = det * (this.m11 * b.x - this.m01 * b.y);
    r.y = det * (this.m00 * b.y - this.m10 * b.x);
    return r;
  }

  /**
   * Returns the max-norm of this {@link Matrix22}.
   * @returns The max-norm of this {@link Matrix22}
   */
  public normMax(): number {
    return Math.max(
      Math.abs(this.m00), Math.max(
        Math.abs(this.m01), Math.max(
          Math.abs(this.m10), Math.abs(this.m11))));
  }

  /**
   * Returns the infinity-norm of this {@link Matrix22}.
   * @returns The infinity-norm of this {@link Matrix22}
   */
  public normInfinity(): number {
    const row1 = Math.abs(this.m00) + Math.abs(this.m01);
    const row2 = Math.abs(this.m10) + Math.abs(this.m11);
    return Math.max(row1, row2);
  }

  /**
   * Returns the 1-norm of this {@link Matrix22}.
   * @returns The 1-norm of this {@link Matrix22}
   */
  public norm1(): number {
    const col1 = Math.abs(this.m00) + Math.abs(this.m10);
    const col2 = Math.abs(this.m01) + Math.abs(this.m11);
    return Math.max(col1, col2);
  }

  /**
   * Returns the frobenius-norm of this {@link Matrix22}.
   * @returns The frobenius-norm of this {@link Matrix22}.
   */
  public normFrobenius(): number {
    return Math.sqrt(
      this.m00 * this.m00 +
      this.m10 * this.m10 +
      this.m01 * this.m01 +
      this.m11 * this.m11);
  }

  /**
   * Method to check if this {@link Matrix22} is equal to the given object.
   * @param obj The object to compare
   * @returns true if this object equals the other object
   */
  public equals(obj: unknown): boolean {
    if (obj == null) return false;
    if (obj == this) return true;
    if (obj instanceof Matrix22) {
      if (obj.m00 == this.m00 && obj.m01 == this.m01 &&
        obj.m10 == this.m10 && obj.m11 == this.m11) {
        return true;
      }
    }
    return false;
  }

  public toString(): string {
    return `Matrix22(${this.m00}, ${this.m01}, ${this.m10}, ${this.m11})`;
  }
}