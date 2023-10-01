import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";
import { Vector2 } from "./Vector2";

export class Matrix22 implements Copyable<Matrix22>{
  m00: number;
  m01: number;
  m10: number;
  m11: number;

  constructor();
  constructor(matrix: Matrix22);
  constructor(values: number[]);
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

  public add(matrix: Matrix22): Matrix22 {
    this.m00 += matrix.m00;
    this.m01 += matrix.m01;
    this.m10 += matrix.m10;
    this.m11 += matrix.m11;
    return this;
  }

  public sum(matrix: Matrix22): Matrix22 {
    return this.copy().add(matrix);
  }

  public subtract(matrix: Matrix22): Matrix22 {
    this.m00 -= matrix.m00;
    this.m01 -= matrix.m01;
    this.m10 -= matrix.m10;
    this.m11 -= matrix.m11;
    return this;
  }

  public difference(matrix: Matrix22): Matrix22 {
    return this.copy().subtract(matrix);
  }

  public multiply(scalar: number): Matrix22;
  public multiply(matrix: Matrix22): Matrix22;
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

  public product(scalar: number): Matrix22;
  public product(matrix: Matrix22): Matrix22;
  public product(vector: Vector2): Vector2;
  public product(matrix: Matrix22 | Vector2 | number): Matrix22 | Vector2 {
    if (matrix instanceof Matrix22) return this.copy().multiply(matrix);
    else if (matrix instanceof Vector2) return this.multiply(matrix.copy());
    else if (typeof matrix === "number") return this.copy().multiply(matrix);
  }

  public multiplyT(vector: Vector2): Vector2 {
    const x = vector.x;
    const y = vector.y;
    vector.x = this.m00 * x + this.m10 * y;
    vector.y = this.m01 * x + this.m11 * y;
    return vector;
  }

  public productT(vector: Vector2): Vector2 {
    return this.multiplyT(vector.copy());
  }

  public identity(): Matrix22 {
    this.m00 = 1;
    this.m01 = 0;
    this.m10 = 0;
    this.m11 = 1;
    return this;
  }

  public transpose(): Matrix22 {
    const m01 = this.m01;
    this.m01 = this.m10;
    this.m10 = m01;
    return this;
  }

  public getTranspose(): Matrix22 {
    return this.copy().transpose();
  }

  public determinant(): number {
    return this.m00 * this.m11 - this.m01 * this.m10;
  }

  public invert(): Matrix22;
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

  public getInverse(): Matrix22 {
    return this.copy().invert();
  }

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

  public normMax(): number {
    return Math.max(
      Math.abs(this.m00), Math.max(
        Math.abs(this.m01), Math.max(
          Math.abs(this.m10), Math.abs(this.m11))));
  }

  public normInfinity(): number {
		const row1 = Math.abs(this.m00) + Math.abs(this.m01);
		const row2 = Math.abs(this.m10) + Math.abs(this.m11);
		return Math.max(row1, row2);	
  }

  public norm1(): number {
    const col1 = Math.abs(this.m00) + Math.abs(this.m10);
    const col2 = Math.abs(this.m01) + Math.abs(this.m11);
    return Math.max(col1, col2);
  }

  public normFrobenius(): number {
    return Math.sqrt(
      this.m00 * this.m00 +
      this.m10 * this.m10 +
      this.m01 * this.m01 +
      this.m11 * this.m11);
  }

  public equals(obj: unknown): boolean {
    if(obj == null) return false;
    if(obj == this) return true;
    if(obj instanceof Matrix22) {
      if(obj.m00 == this.m00 && obj.m01 == this.m01 && 
        obj.m10 == this.m10 && obj.m11 == this.m11) {
        return true;
      }
    }
    return false;
  }
}