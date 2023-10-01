import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";
import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";

export class Matrix33 implements Copyable<Matrix33>{
  m00: number;
  m01: number;
  m02: number;
  m10: number;
  m11: number;
  m12: number;
  m20: number;
  m21: number;
  m22: number;

  constructor();
  constructor(matrix: Matrix33);
  constructor(values: number[]);
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

  public add(matrix: Matrix33): Matrix33 {
    this.m00 += matrix.m00; this.m01 += matrix.m01; this.m02 += matrix.m02;
    this.m10 += matrix.m10; this.m11 += matrix.m11; this.m12 += matrix.m12;
    this.m20 += matrix.m20; this.m21 += matrix.m21; this.m22 += matrix.m22;
    return this;
  }

  public sum(matrix: Matrix33): Matrix33 {
    return this.copy().add(matrix);
  }

  public subtract(matrix: Matrix33): Matrix33 {
    this.m00 -= matrix.m00; this.m01 -= matrix.m01; this.m02 -= matrix.m02;
    this.m10 -= matrix.m10; this.m11 -= matrix.m11; this.m12 -= matrix.m12;
    this.m20 -= matrix.m20; this.m21 -= matrix.m21; this.m22 -= matrix.m22;
    return this;
  }

  public difference(matrix: Matrix33): Matrix33 {
    return this.copy().subtract(matrix);
  }

  public multiply(matrix: Matrix33): Matrix33;
  public multiply(vector: Vector3): Vector3;
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

  public product(matrix: Matrix33): Matrix33;
  public product(vector: Vector3): Vector3;
  public product(scalar: number): Matrix33;
  public product(matrix: Matrix33 | Vector3 | number): Matrix33 | Vector3 {
    if (matrix instanceof Matrix33) return this.copy().multiply(matrix);
    else if (matrix instanceof Vector3) return this.multiply(matrix.copy());
    else if (typeof matrix === "number") return this.copy().multiply(matrix);
  }

  public multiplyT(vector: Vector3): Vector3 {
    const x = vector.x;
    const y = vector.y;
    const z = vector.z;
    vector.x = this.m00 * x + this.m10 * y + this.m20 * z;
    vector.y = this.m01 * x + this.m11 * y + this.m21 * z;
    vector.z = this.m02 * x + this.m12 * y + this.m22 * z;
    return vector;
  }

  public productT(vector: Vector3): Vector3 {
    return this.multiplyT(vector.copy());
  }

  public identity(): Matrix33 {
    this.m00 = 1; this.m01 = 0; this.m02 = 0;
    this.m10 = 0; this.m11 = 1; this.m12 = 0;
    this.m20 = 0; this.m21 = 0; this.m22 = 1;
    return this;
  }

  public transpose(): Matrix33 {
    let s: number;
    s = this.m01; this.m01 = this.m10; this.m10 = s;
    s = this.m02; this.m02 = this.m20; this.m20 = s;
    s = this.m12; this.m12 = this.m21; this.m21 = s;
    return this;
  }

  public getTranspose(): Matrix33 {
    const rm = new Matrix33();
    rm.m00 = this.m00; rm.m01 = this.m10; rm.m02 = this.m20;
    rm.m10 = this.m01; rm.m11 = this.m11; rm.m12 = this.m21;
    rm.m20 = this.m02; rm.m21 = this.m12; rm.m22 = this.m22;
    return rm;
  }

  public determinant(): number {
    return this.m00 * this.m11 * this.m22 +
      this.m01 * this.m12 * this.m20 +
      this.m02 * this.m10 * this.m21 -
      this.m20 * this.m11 * this.m02 -
      this.m21 * this.m12 * this.m00 -
      this.m22 * this.m10 * this.m01;
  }

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

  public getInverse(): Matrix33 {
    return this.copy().invert();
  }

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