'use strict';

require('chai').should();

describe('Matrix33', () => {

  const Matrix33 = require('../../dist/geometry/Matrix33').Matrix33;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const Vector3 = require('../../dist/geometry/Vector3').Vector3;

  it('createFull', () => {
    const m = new Matrix33(1, 2, 1, -3, 8, 2, 1, 5, -1);
    m.m00.should.equal(1);
    m.m01.should.equal(2);
    m.m02.should.equal(1);
    m.m10.should.equal(-3);
    m.m11.should.equal(8);
    m.m12.should.equal(2);
    m.m20.should.equal(1);
    m.m21.should.equal(5);
    m.m22.should.equal(-1);
  });

  it('createFullArray', () => {
    const m = new Matrix33([1, 2, 1, -3, 8, 2, 1, 5, -1]);
    m.m00.should.equal(1);
    m.m01.should.equal(2);
    m.m02.should.equal(1);
    m.m10.should.equal(-3);
    m.m11.should.equal(8);
    m.m12.should.equal(2);
    m.m20.should.equal(1);
    m.m21.should.equal(5);
    m.m22.should.equal(-1);
  });

  it('createNullArray', () => {
    const m = new Matrix33(null);
    m.m00.should.equal(0);
    m.m01.should.equal(0);
    m.m02.should.equal(0);
    m.m10.should.equal(0);
    m.m11.should.equal(0);
    m.m12.should.equal(0);
    m.m20.should.equal(0);
    m.m21.should.equal(0);
    m.m22.should.equal(0);
  });

  it('createPartialArray', () => {
    try {
      new Matrix33([1, 2, 1, -3, 8, 2, 1, 5]);
    } catch (e) {
      e.message.should.equal('Matrix33: The values array must have exactly 9 elements');
    }
  });

  it('equals', () => {
    const m = new Matrix33(1, 2, 1, -3, 8, 2, 1, 5, -1);
    m.equals(m).should.be.true;

    const m2 = new Matrix33(m);
    m.equals(m2).should.be.true;
    m2.equals(m).should.be.true;

    m2.m22 = -5;
    m.equals(m2).should.be.false;
    m2.equals(m).should.be.false;
    m.equals(null).should.be.false;
    m.equals(new Object()).should.be.false;
  });

  it('copy', () => {
    const m1 = new Matrix33(0, 1, -1, 2, -1, 3, 3, 2.5, 0.5);
    const m2 = new Matrix33(m1);
    m2.m00.should.equal(m1.m00);
    m2.m01.should.equal(m1.m01);
    m2.m02.should.equal(m1.m02);
    m2.m10.should.equal(m1.m10);
    m2.m11.should.equal(m1.m11);
    m2.m12.should.equal(m1.m12);
    m2.m20.should.equal(m1.m20);
    m2.m21.should.equal(m1.m21);
    m2.m22.should.equal(m1.m22);
    const m3 = m2.copy();
    m3.m00.should.equal(m1.m00);
    m3.m01.should.equal(m1.m01);
    m3.m02.should.equal(m1.m02);
    m3.m10.should.equal(m1.m10);
    m3.m11.should.equal(m1.m11);
    m3.m12.should.equal(m1.m12);
    m3.m20.should.equal(m1.m20);
    m3.m21.should.equal(m1.m21);
    m3.m22.should.equal(m1.m22);
  });

  it('add', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const m2 = new Matrix33(1.0, 1.0, 3.0, 0.0, 4.0, 1.0, 2.0, 2.0, 1.0);
    m1.add(m2);
    m1.m00.should.equal(1.0);
    m1.m01.should.equal(3.0);
    m1.m02.should.equal(3.0);
    m1.m10.should.equal(3.0);
    m1.m11.should.equal(5.0);
    m1.m12.should.equal(2.0);
    m1.m20.should.equal(4.0);
    m1.m21.should.equal(2.0);
    m1.m22.should.equal(0.0);
  });

  it('sum', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const m2 = new Matrix33(1.0, 1.0, 3.0, 0.0, 4.0, 1.0, 2.0, 2.0, 1.0);
    const m3 = m1.sum(m2);
    m3.m00.should.equal(1.0);
    m3.m01.should.equal(3.0);
    m3.m02.should.equal(3.0);
    m3.m10.should.equal(3.0);
    m3.m11.should.equal(5.0);
    m3.m12.should.equal(2.0);
    m3.m20.should.equal(4.0);
    m3.m21.should.equal(2.0);
    m3.m22.should.equal(0.0);
  });

  it('subtract', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const m2 = new Matrix33(1.0, 1.0, 3.0, 0.0, 4.0, 1.0, 2.0, 2.0, 1.0);
    m1.subtract(m2);
    m1.m00.should.equal(-1.0);
    m1.m01.should.equal(1.0);
    m1.m02.should.equal(-3.0);
    m1.m10.should.equal(3.0);
    m1.m11.should.equal(-3.0);
    m1.m12.should.equal(0.0);
    m1.m20.should.equal(0.0);
    m1.m21.should.equal(-2.0);
    m1.m22.should.equal(-2.0);
  });

  it('difference', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const m2 = new Matrix33(1.0, 1.0, 3.0, 0.0, 4.0, 1.0, 2.0, 2.0, 1.0);
    const m3 = m1.difference(m2);
    m3.m00.should.equal(-1.0);
    m3.m01.should.equal(1.0);
    m3.m02.should.equal(-3.0);
    m3.m10.should.equal(3.0);
    m3.m11.should.equal(-3.0);
    m3.m12.should.equal(0.0);
    m3.m20.should.equal(0.0);
    m3.m21.should.equal(-2.0);
    m3.m22.should.equal(-2.0);
    m1.equals(m3).should.be.false;
  });

  it('multiplyMatrix', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const m2 = new Matrix33(1.0, 1.0, 3.0, 0.0, 4.0, 1.0, 2.0, 2.0, 1.0);
    m1.multiply(m2);
    m1.m00.should.equal(0.0);
    m1.m01.should.equal(8.0);
    m1.m02.should.equal(2.0);
    m1.m10.should.equal(5.0);
    m1.m11.should.equal(9.0);
    m1.m12.should.equal(11.0);
    m1.m20.should.equal(0.0);
    m1.m21.should.equal(0.0);
    m1.m22.should.equal(5.0);
  });

  it('productMatrix', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const m2 = new Matrix33(1.0, 1.0, 3.0, 0.0, 4.0, 1.0, 2.0, 2.0, 1.0);
    const m3 = m1.product(m2);
    m3.m00.should.equal(0.0);
    m3.m01.should.equal(8.0);
    m3.m02.should.equal(2.0);
    m3.m10.should.equal(5.0);
    m3.m11.should.equal(9.0);
    m3.m12.should.equal(11.0);
    m3.m20.should.equal(0.0);
    m3.m21.should.equal(0.0);
    m3.m22.should.equal(5.0);
    m1.equals(m3).should.be.false;
  });

  it('multiplyVector', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const v1 = new Vector3(1.0, -1.0, 2.0);
    m1.multiply(v1);
    v1.x.should.equal(-2.0);
    v1.y.should.equal(4.0);
    v1.z.should.equal(0.0);
  });

  it('productVector', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const v1 = new Vector3(1.0, -1.0, 2.0);
    const v2 = m1.product(v1);
    v2.x.should.equal(-2.0);
    v2.y.should.equal(4.0);
    v2.z.should.equal(0.0);
    v1.equals(v2).should.be.false;
  });

  it('multiplyVectorT', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const v1 = new Vector3(1.0, -1.0, 2.0);
    m1.multiplyT(v1);
    v1.x.should.equal(1.0);
    v1.y.should.equal(1.0);
    v1.z.should.equal(-3.0);
  });

  it('productVectorT', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const v1 = new Vector3(1.0, -1.0, 2.0);
    const v2 = m1.productT(v1);
    v2.x.should.equal(1.0);
    v2.y.should.equal(1.0);
    v2.z.should.equal(-3.0);
    v1.equals(v2).should.be.false;
  });

  it('multiplyScalar', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    m1.multiply(2.0);
    m1.m00.should.equal(0.0);
    m1.m01.should.equal(4.0);
    m1.m02.should.equal(0.0);
    m1.m10.should.equal(6.0);
    m1.m11.should.equal(2.0);
    m1.m12.should.equal(2.0);
    m1.m20.should.equal(4.0);
    m1.m21.should.equal(0.0);
    m1.m22.should.equal(-2.0);
  });

  it('productScalar', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const m2 = m1.product(2.0);
    m2.m00.should.equal(0.0);
    m2.m01.should.equal(4.0);
    m2.m02.should.equal(0.0);
    m2.m10.should.equal(6.0);
    m2.m11.should.equal(2.0);
    m2.m12.should.equal(2.0);
    m2.m20.should.equal(4.0);
    m2.m21.should.equal(0.0);
    m2.m22.should.equal(-2.0);
    m1.should.not.equal(m2);
  });

  it('identity', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    m1.identity();
    m1.m00.should.equal(1.0);
    m1.m01.should.equal(0.0);
    m1.m02.should.equal(0.0);
    m1.m10.should.equal(0.0);
    m1.m11.should.equal(1.0);
    m1.m12.should.equal(0.0);
    m1.m20.should.equal(0.0);
    m1.m21.should.equal(0.0);
    m1.m22.should.equal(1.0);
  });

  it('transpose', () => {

    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    m1.transpose();
    m1.m00.should.equal(0.0);
    m1.m01.should.equal(3.0);
    m1.m02.should.equal(2.0);
    m1.m10.should.equal(2.0);
    m1.m11.should.equal(1.0);
    m1.m12.should.equal(0.0);
    m1.m20.should.equal(0.0);
    m1.m21.should.equal(1.0);
    m1.m22.should.equal(-1.0);
  });

  it('getTranspose', () => {
    const m1 = new Matrix33(0.0, 2.0, 0.0, 3.0, 1.0, 1.0, 2.0, 0.0, -1.0);
    const m2 = m1.getTranspose();
    m2.m00.should.equal(0.0);
    m2.m01.should.equal(3.0);
    m2.m02.should.equal(2.0);
    m2.m10.should.equal(2.0);
    m2.m11.should.equal(1.0);
    m2.m12.should.equal(0.0);
    m2.m20.should.equal(0.0);
    m2.m21.should.equal(1.0);
    m2.m22.should.equal(-1.0);
    m1.equals(m2).should.be.false;
  });

  it('determinant', () => {
    const m1 = new Matrix33(1.0, 0.0, 5.0, 2.0, 1.0, 6.0, 3.0, 4.0, 0.0);
    const det = m1.determinant();
    det.should.equal(1.0);
  });

  it('invert', () => {
    const m1 = new Matrix33(1.0, 0.0, 5.0, 2.0, 1.0, 6.0, 3.0, 4.0, 0.0);
    m1.invert();
    m1.m00.should.equal(-24.0);
    m1.m01.should.equal(20.0);
    m1.m02.should.equal(-5.0);
    m1.m10.should.equal(18.0);
    m1.m11.should.equal(-15.0);
    m1.m12.should.equal(4.0);
    m1.m20.should.equal(5.0);
    m1.m21.should.equal(-4.0);
    m1.m22.should.equal(1.0);
  });

  it('getInverse', () => {
    const m1 = new Matrix33(1.0, 0.0, 5.0, 2.0, 1.0, 6.0, 3.0, 4.0, 0.0);
    const m2 = m1.getInverse();
    m2.m00.should.equal(-24.0);
    m2.m01.should.equal(20.0);
    m2.m02.should.equal(-5.0);
    m2.m10.should.equal(18.0);
    m2.m11.should.equal(-15.0);
    m2.m12.should.equal(4.0);
    m2.m20.should.equal(5.0);
    m2.m21.should.equal(-4.0);
    m2.m22.should.equal(1.0);
    m1.equals(m2).should.be.false;
  });

  it('solve22', () => {
    const A = new Matrix33(3.0, -1.0, 0.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0);
    const b = new Vector2(2.0, 6.0);
    const x = A.solve22(b);
    x.x.should.equal(-1.0);
    x.y.should.equal(-5.0);
  });

  it('solve22', () => {
    const A = new Matrix33(1.0, -3.0, 3.0, 2.0, 3.0, -1.0, 4.0, -3.0, -1.0);
    const b = new Vector3(-4.0, 15.0, 19.0);
    const x = A.solve33(b);
    x.x.should.equal(5.0);
    x.y.should.equal(1.0);
    x.z.should.equal(-2.0);
  });
});