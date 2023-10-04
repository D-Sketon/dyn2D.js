import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";
import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";

/**
 * Represents a 3x3 Matrix.
 */
export class Matrix33 implements Copyable<Matrix33>{
  /**
   * The 0,0 element of the matrix.
   */
  m00: number;
  /**
   * The 0,1 element of the matrix.
   */
  m01: number;
  /** 
   * The 0,2 element of the matrix.
   */
  m02: number;
  /**
   * The 1,0 element of the matrix.
   */
  m10: number;
  /**
   * The 1,1 element of the matrix.
   */
  m11: number;
  /**
   * The 1,2 element of the matrix.
   */
  m12: number;
  /**
   * The 2,0 element of the matrix.
   */
  m20: number;
  /**
   * The 2,1 element of the matrix.
   */
  m21: number;
  /**
   * The 2,2 element of the matrix.
   */
  m22: number;

  /**
   * Default constructor.
   */
  constructor();
  /**
   * Copy constructor.
   * @param matrix The {@link Matrix33} to copy
   */
  constructor(matrix: Matrix33);
  /**
   * Full constructor.
   * @param values The values of the matrix in row-major order
   * @throws `Error` if the values array does not have exactly 9 elements
   */
  constructor(values: number[]);
  /**
   * Full constructor.
   * @param m00 The 0,0 element of the matrix
   * @param m01 The 0,1 element of the matrix
   * @param m02 The 0,2 element of the matrix
   * @param m10 The 1,0 element of the matrix
   * @param m11 The 1,1 element of the matrix
   * @param m12 The 1,2 element of the matrix
   * @param m20 The 2,0 element of the matrix
   * @param m21 The 2,1 element of the matrix
   * @param m22 The 2,2 element of the matrix
   */
  constructor(m00: number, m01: number, m02: number,
    m10: number, m11: number, m12: number,
    m20: number, m21: number, m22: number);
  constructor(m00?: any, m01?: any, m02?: any,
    m10?: any, m11?: any, m12?: any,
    m20?: any, m21?: any, m22?: any) {
    if (m00 instanceof Matrix33) {
      this.m00 = m00.m00; this.m01 = m00.m01; this.m02 = m00.m02;
      this.m10 = m00.m10; this.m11 = m00.m11; this.m12 = m00.m12;
      this.m20 = m00.m20; this.m21 = m00.m21; this.m22 = m00.m22;
    } else if (m00 instanceof Array) {
      if (m00.length != 9) {
        throw new Error("Matrix33: The values array must have exactly 9 elements");
      }
      this.m00 = m00[0]; this.m01 = m00[1]; this.m02 = m00[2];
      this.m10 = m00[3]; this.m11 = m00[4]; this.m12 = m00[5];
      this.m20 = m00[6]; this.m21 = m00[7]; this.m22 = m00[8];
    } else if (typeof m00 === "number" && typeof m01 === "number" && typeof m02 === "number"
      && typeof m10 === "number" && typeof m11 === "number" && typeof m12 === "number"
      && typeof m20 === "number" && typeof m21 === "number" && typeof m22 === "number") {
      this.m00 = m00; this.m01 = m01; this.m02 = m02;
      this.m10 = m10; this.m11 = m11; this.m12 = m12;
      this.m20 = m20; this.m21 = m21; this.m22 = m22;
    } else {
      this.m00 = 0; this.m01 = 0; this.m02 = 0;
      this.m10 = 0; this.m11 = 0; this.m12 = 0;
      this.m20 = 0; this.m21 = 0; this.m22 = 0;
    }
  }

  public copy(): Matrix33 {
    return new Matrix33(this);
  }

  /**
   * Method to add the given {@link Matrix33} to this {@link Matrix33}.
   * ```
   * this = this + m
   * ```
   * @param matrix The {@link Matrix33} to add
   * @returns This {@link Matrix33}
   */
  public add(matrix: Matrix33): Matrix33 {
    this.m00 += matrix.m00; this.m01 += matrix.m01; this.m02 += matrix.m02;
    this.m10 += matrix.m10; this.m11 += matrix.m11; this.m12 += matrix.m12;
    this.m20 += matrix.m20; this.m21 += matrix.m21; this.m22 += matrix.m22;
    return this;
  }

  /**
   * Returns a new {@link Matrix33} containing the sum of this {@link Matrix33} and the given {@link Matrix33}.
   * ```
   * r = this + m
   * ```
   *  @param matrix The {@link Matrix33} to add
   * @returns A new {@link Matrix33} containing the result
   */
  public sum(matrix: Matrix33): Matrix33 {
    return this.copy().add(matrix);
  }

  /**
   * Method to subtract the given {@link Matrix33} from this {@link Matrix33}.
   * ```
   * this = this - m
   * ```
   * @param matrix The {@link Matrix33} to subtract
   * @returns This {@link Matrix33}
   */
  public subtract(matrix: Matrix33): Matrix33 {
    this.m00 -= matrix.m00; this.m01 -= matrix.m01; this.m02 -= matrix.m02;
    this.m10 -= matrix.m10; this.m11 -= matrix.m11; this.m12 -= matrix.m12;
    this.m20 -= matrix.m20; this.m21 -= matrix.m21; this.m22 -= matrix.m22;
    return this;
  }

  /**
   * Returns a new {@link Matrix33} containing the difference of this {@link Matrix33} and the given {@link Matrix33}.
   * ```
   * r = this - m
   * ```
   * @param matrix The {@link Matrix33} to subtract
   * @returns This {@link Matrix33}
   */
  public difference(matrix: Matrix33): Matrix33 {
    return this.copy().subtract(matrix);
  }

  /**
   * Method to multiply this {@link Matrix33} by the given {@link Matrix33}.
   * ```
   * this = this * m
   * ```
   * @param matrix The {@link Matrix33} to multiply
   * @returns This {@link Matrix33}
   */
  public multiply(matrix: Matrix33): Matrix33;
  /**
   * Method to multiply this {@link Matrix33} by the given {@link Vector3}.
   * ```
   * v = this * v
   * ```
   * @param vector The {@link Vector3} to multiply
   * @returns The given {@link Vector3} after multiplication
   */
  public multiply(vector: Vector3): Vector3;
  /**
   * Method to multiply this {@link Matrix33} by the given scalar.
   * ```
   * this = this * scalar
   * ```
   * @param scalar The scalar to multiply this {@link Matrix33} by
   * @returns This {@link Matrix33}
   */
  public multiply(scalar: number): Matrix33;
  public multiply(matrix: unknown): Matrix33 | Vector3 {
    if (matrix instanceof Matrix33) {
      const m00 = this.m00;
      const m01 = this.m01;
      const m02 = this.m02;
      const m10 = this.m10;
      const m11 = this.m11;
      const m12 = this.m12;
      const m20 = this.m20;
      const m21 = this.m21;
      const m22 = this.m22;
      this.m00 = m00 * matrix.m00 + m01 * matrix.m10 + m02 * matrix.m20;
      this.m01 = m00 * matrix.m01 + m01 * matrix.m11 + m02 * matrix.m21;
      this.m02 = m00 * matrix.m02 + m01 * matrix.m12 + m02 * matrix.m22;
      this.m10 = m10 * matrix.m00 + m11 * matrix.m10 + m12 * matrix.m20;
      this.m11 = m10 * matrix.m01 + m11 * matrix.m11 + m12 * matrix.m21;
      this.m12 = m10 * matrix.m02 + m11 * matrix.m12 + m12 * matrix.m22;
      this.m20 = m20 * matrix.m00 + m21 * matrix.m10 + m22 * matrix.m20;
      this.m21 = m20 * matrix.m01 + m21 * matrix.m11 + m22 * matrix.m21;
      this.m22 = m20 * matrix.m02 + m21 * matrix.m12 + m22 * matrix.m22;
      return this;
    } else if (matrix instanceof Vector3) {
      const x = matrix.x;
      const y = matrix.y;
      const z = matrix.z;
      matrix.x = this.m00 * x + this.m01 * y + this.m02 * z;
      matrix.y = this.m10 * x + this.m11 * y + this.m12 * z;
      matrix.z = this.m20 * x + this.m21 * y + this.m22 * z;
      return matrix;
    } else if (typeof matrix === "number") {
      this.m00 *= matrix; this.m01 *= matrix; this.m02 *= matrix;
      this.m10 *= matrix; this.m11 *= matrix; this.m12 *= matrix;
      this.m20 *= matrix; this.m21 *= matrix; this.m22 *= matrix;
      return this;
    }
  }

  /**
   * Returns a new {@link Matrix33} containing the product of this {@link Matrix33} and the given {@link Matrix33}.
   * ```
   * r = this * m
   * ```
   * @param matrix The {@link Matrix33} to multiply this {@link Matrix33} by
   * @returns A new {@link Matrix33} containing the result
   */
  public product(matrix: Matrix33): Matrix33;
  /**
   * Returns a new {@link Vector3} containing the result of multiplying this {@link Matrix33} by the given {@link Vector3}.
   * ```
   * r = this * v
   * ```
   * @param vector The {@link Vector3} to multiply this {@link Matrix33} by
   * @returns A new {@link Vector3} containing the result
   */
  public product(vector: Vector3): Vector3;
  /**
   * Returns a new {@link Matrix33} containing the result of multiplying this {@link Matrix33} by the given scalar.
   * ```
   * r = this * scalar
   * ```
   * @param scalar The scalar to multiply this {@link Matrix33} by
   * @returns A new {@link Matrix33} containing the result
   */
  public product(scalar: number): Matrix33;
  public product(matrix: Matrix33 | Vector3 | number): Matrix33 | Vector3 {
    if (matrix instanceof Matrix33) return this.copy().multiply(matrix);
    else if (matrix instanceof Vector3) return this.multiply(matrix.copy());
    else if (typeof matrix === "number") return this.copy().multiply(matrix);
  }

  /**
   * Multiplies the given {@link Vector3} by this {@link Matrix33} and place the result in the given {@link Vector3}.
   * <p style="white-space: pre;"> v = v<sup>T</sup> * this</p>
   * @param vector The {@link Vector3} to multiply this {@link Matrix33} by
   * @returns The given {@link Vector3} after multiplication
   */
  public multiplyT(vector: Vector3): Vector3 {
    const x = vector.x;
    const y = vector.y;
    const z = vector.z;
    vector.x = this.m00 * x + this.m10 * y + this.m20 * z;
    vector.y = this.m01 * x + this.m11 * y + this.m21 * z;
    vector.z = this.m02 * x + this.m12 * y + this.m22 * z;
    return vector;
  }

  /**
   * Returns a new {@link Vector3} containing the result of multiplying this {@link Matrix33} by the given {@link Vector3}.
   * <p style="white-space: pre;"> r = v<sup>T</sup> * this</p>
   * @param vector The {@link Vector3} to multiply this {@link Matrix33} by
   * @returns A new {@link Vector3} containing the result
   */
  public productT(vector: Vector3): Vector3 {
    return this.multiplyT(vector.copy());
  }

  /**
   * Method to set this {@link Matrix33} to an identity {@link Matrix33}.
   * @returns This {@link Matrix33}
   */
  public identity(): Matrix33 {
    this.m00 = 1; this.m01 = 0; this.m02 = 0;
    this.m10 = 0; this.m11 = 1; this.m12 = 0;
    this.m20 = 0; this.m21 = 0; this.m22 = 1;
    return this;
  }

  /**
   * Method to set this {@link Matrix33} to the transpose of itself.
   * @returns This {@link Matrix33}
   */
  public transpose(): Matrix33 {
    let s: number;
    s = this.m01; this.m01 = this.m10; this.m10 = s;
    s = this.m02; this.m02 = this.m20; this.m20 = s;
    s = this.m12; this.m12 = this.m21; this.m21 = s;
    return this;
  }

  /**
   * Returns a new {@link Matrix33} containing the transpose of this {@link Matrix33}.
   * @returns A new {@link Matrix33} containing the transpose of this {@link Matrix33}
   */
  public getTranspose(): Matrix33 {
    const rm = new Matrix33();
    rm.m00 = this.m00; rm.m01 = this.m10; rm.m02 = this.m20;
    rm.m10 = this.m01; rm.m11 = this.m11; rm.m12 = this.m21;
    rm.m20 = this.m02; rm.m21 = this.m12; rm.m22 = this.m22;
    return rm;
  }

  /**
   * Returns the determinant of this {@link Matrix33}.
   * @returns The determinant of this {@link Matrix33}
   */
  public determinant(): number {
    return this.m00 * this.m11 * this.m22 +
      this.m01 * this.m12 * this.m20 +
      this.m02 * this.m10 * this.m21 -
      this.m20 * this.m11 * this.m02 -
      this.m21 * this.m12 * this.m00 -
      this.m22 * this.m10 * this.m01;
  }

  /**
   * Method to set this {@link Matrix33} to the inverse of itself.
   * @returns This {@link Matrix33}
   * @throws `Error` if the determinant is zero
   */
  public invert(): Matrix33 {
    let det = this.determinant();
    if (Math.abs(det) > Epsilon.E) {
      det = 1.0 / det;
    } else {
      throw new Error("Matrix33.invert: Determinant is zero");
    }
    const m00 = det * (this.m11 * this.m22 - this.m12 * this.m21);
    const m01 = -det * (this.m01 * this.m22 - this.m21 * this.m02);
    const m02 = det * (this.m01 * this.m12 - this.m11 * this.m02);
    const m10 = -det * (this.m10 * this.m22 - this.m20 * this.m12);
    const m11 = det * (this.m00 * this.m22 - this.m20 * this.m02);
    const m12 = -det * (this.m00 * this.m12 - this.m10 * this.m02);
    const m20 = det * (this.m10 * this.m21 - this.m20 * this.m11);
    const m21 = -det * (this.m00 * this.m21 - this.m20 * this.m01);
    const m22 = det * (this.m00 * this.m11 - this.m10 * this.m01);

    this.m00 = m00; this.m01 = m01; this.m02 = m02;
    this.m10 = m10; this.m11 = m11; this.m12 = m12;
    this.m20 = m20; this.m21 = m21; this.m22 = m22;

    return this;
  }

  /**
   * Returns a new {@link Matrix33} containing the inverse of this {@link Matrix33}.
   * @returns A new {@link Matrix33} containing the inverse of this {@link Matrix33}
   */
  public getInverse(): Matrix33 {
    return this.copy().invert();
  }

	/**
	 * Solves the system of linear equations:
	 * <p style="white-space: pre;"> Ax = b
	 * Multiply by A<sup>-1</sup> on both sides
	 * x = A<sup>-1</sup>b</p>
	 * @param b The b {@link Vector3}
	 * @returns The x {@link Vector2}
	 */
  public solve33(b: Vector3): Vector3 {
    let det = this.determinant();
    if (Math.abs(det) > Epsilon.E) {
      det = 1.0 / det;
    } else {
      throw new Error("Matrix33.invert: Determinant is zero");
    }
    const r = new Vector3();

    const m00 = this.m11 * this.m22 - this.m12 * this.m21;
    const m01 = -this.m01 * this.m22 + this.m21 * this.m02;
    const m02 = this.m01 * this.m12 - this.m11 * this.m02;
    const m10 = -this.m10 * this.m22 + this.m20 * this.m12;
    const m11 = this.m00 * this.m22 - this.m20 * this.m02;
    const m12 = -this.m00 * this.m12 + this.m10 * this.m02;
    const m20 = this.m10 * this.m21 - this.m20 * this.m11;
    const m21 = -this.m00 * this.m21 + this.m20 * this.m01;
    const m22 = this.m00 * this.m11 - this.m10 * this.m01;

    r.x = det * (m00 * b.x + m01 * b.y + m02 * b.z);
    r.y = det * (m10 * b.x + m11 * b.y + m12 * b.z);
    r.z = det * (m20 * b.x + m21 * b.y + m22 * b.z);

    return r;
  }

	/**
	 * Solves the system of linear equations:
	 * <p style="white-space: pre;"> Ax = b
	 * Multiply by A<sup>-1</sup> on both sides
	 * x = A<sup>-1</sup>b</p>
	 * @param b The b {@link Vector2}
	 * @returns The x {@link Vector2}
	 */
  public solve22(b: Vector2): Vector2 {
    let det = this.m00 * this.m11 - this.m01 * this.m10;
    if (Math.abs(det) > Epsilon.E) {
      det = 1.0 / det;
    } else {
      throw new Error("Matrix33.invert: Determinant is zero");
    }

    const r = new Vector2();
    r.x = det * (this.m11 * b.x - this.m01 * b.y);
    r.y = det * (this.m00 * b.y - this.m10 * b.x);
    return r;
  }

  /**
   * Method to check if this {@link Matrix33} is equal to the given object.
   * @param obj The object to compare
   * @returns true if this object equals the other object
   */
  public equals(obj: unknown): boolean {
    if (obj == null) return false;
    if (obj == this) return true;
    if (obj instanceof Matrix33) {
      if (obj.m00 === this.m00 && obj.m01 === this.m01 && obj.m02 === this.m02 &&
        obj.m10 === this.m10 && obj.m11 === this.m11 && obj.m12 === this.m12 &&
        obj.m20 === this.m20 && obj.m21 === this.m21 && obj.m22 === this.m22) {
        return true;
      }
    }
    return false;
  }

  public toString(): string {
    return `Matrix33(${this.m00}, ${this.m01}, ${this.m02}, ${this.m10}, ${this.m11}, ${this.m12}, ${this.m20}, ${this.m21}, ${this.m22})`;
  }
}