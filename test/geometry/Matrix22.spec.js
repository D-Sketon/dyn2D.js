'use strict';

require('chai').should();

describe('Matrix22', () => {
  const Matrix22 = require('../../dist/geometry/Matrix22').Matrix22;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;

  it('createNullMatrix', () => {
    const m = new Matrix22(null);
    m.m00.should.equal(0);
    m.m01.should.equal(0);
    m.m10.should.equal(0);
    m.m11.should.equal(0);
  });

  it('createLessThanFourElements', () => {
    try {
      new Matrix22([0, 1, 5]);
    } catch (e) {
      e.message.should.equal('Matrix22: The values array must have exactly 4 elements');
    }
  });

  it('createMoreThanFourElements', () => {
    try {
      new Matrix22([0, 1, 5, 6, 8]);
    } catch (e) {
      e.message.should.equal('Matrix22: The values array must have exactly 4 elements');
    }
  });

  it('createFull', () => {
    const m = new Matrix22(1, 2, -3, 8);
    m.m00.should.equal(1);
    m.m01.should.equal(2);
    m.m10.should.equal(-3);
    m.m11.should.equal(8);
  });

  it('createFullArray', () => {
    const m = new Matrix22([1, 2, -3, 8]);
    m.m00.should.equal(1);
    m.m01.should.equal(2);
    m.m10.should.equal(-3);
    m.m11.should.equal(8);
  });

  it('copy', () => {
    const m1 = new Matrix22(0, 2, 1, 3);
    const m2 = new Matrix22(m1);
    m1.m00.should.equal(m2.m00);
    m1.m01.should.equal(m2.m01);
    m1.m10.should.equal(m2.m10);
    m1.m11.should.equal(m2.m11);
    const m3 = m2.copy();
    m1.m00.should.equal(m3.m00);
    m1.m01.should.equal(m3.m01);
    m1.m10.should.equal(m3.m10);
    m1.m11.should.equal(m3.m11);
  });

  it('add', () => {
    const m1 = new Matrix22(0.0, 2.0, 3.5, 1.2);
    const m2 = new Matrix22(1.3, 0.3, 0.0, 4.5);
    m1.add(m2);
    m1.m00.should.equal(1.3);
    m1.m01.should.equal(2.3);
    m1.m10.should.equal(3.5);
    m1.m11.should.equal(5.7);
  });

  it('sum', () => {
    const m1 = new Matrix22(0.0, 2.0, 3.5, 1.2);
    const m2 = new Matrix22(1.3, 0.3, 0.0, 4.5);
    const m3 = m1.sum(m2);
    m3.m00.should.equal(1.3);
    m3.m01.should.equal(2.3);
    m3.m10.should.equal(3.5);
    m3.m11.should.equal(5.7);
    m1.should.not.equal(m3);
  });

  it('subtract', () => {
    const m1 = new Matrix22(0.0, 2.0, 3.5, 1.2);
    const m2 = new Matrix22(1.3, 0.3, 0.0, 4.5);
    m1.subtract(m2);
    m1.m00.should.equal(-1.3);
    m1.m01.should.equal(1.7);
    m1.m10.should.equal(3.5);
    m1.m11.should.equal(-3.3);
  });

  it('difference', () => {
    const m1 = new Matrix22(0.0, 2.0, 3.5, 1.2);
    const m2 = new Matrix22(1.3, 0.3, 0.0, 4.5);
    const m3 = m1.difference(m2);
    m3.m00.should.equal(-1.3);
    m3.m01.should.equal(1.7);
    m3.m10.should.equal(3.5);
    m3.m11.should.equal(-3.3);
    m1.should.not.equal(m3);
  });

  it('multiplyMatrix', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    const m2 = new Matrix22(4.0, 3.0, 2.0, 1.0);
    m1.multiply(m2);
    m1.m00.should.equal(8.0);
    m1.m01.should.equal(5.0);
    m1.m10.should.equal(20.0);
    m1.m11.should.equal(13.0);
  });

  it('productMatrix', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    const m2 = new Matrix22(4.0, 3.0, 2.0, 1.0);
    const m3 = m1.product(m2);
    m3.m00.should.equal(8.0);
    m3.m01.should.equal(5.0);
    m3.m10.should.equal(20.0);
    m3.m11.should.equal(13.0);
    m1.should.not.equal(m3);
  });

  it('multiplyVector', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    const v1 = new Vector2(1.0, -1.0);
    m1.multiply(v1);
    v1.x.should.equal(-1.0);
    v1.y.should.equal(-1.0);
  });

  it('productVector', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    const v1 = new Vector2(1.0, -1.0);
    const v2 = m1.product(v1);
    v2.x.should.equal(-1.0);
    v2.y.should.equal(-1.0);
    v1.should.not.equal(v2);
  });

  it('multiplyVectorT', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    const v1 = new Vector2(1.0, -1.0);
    m1.multiplyT(v1);
    v1.x.should.equal(-2.0);
    v1.y.should.equal(-2.0);
  });

  it('productVectorT', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    const v1 = new Vector2(1.0, -1.0);
    const v2 = m1.productT(v1);
    v2.x.should.equal(-2.0);
    v2.y.should.equal(-2.0);
    v1.should.not.equal(v2);
  });

  it('multiplyScalar', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    m1.multiply(2.0);
    m1.m00.should.equal(2.0);
    m1.m01.should.equal(4.0);
    m1.m10.should.equal(6.0);
    m1.m11.should.equal(8.0);
  });

  it('productScalar', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    const m2 = m1.product(2.0);
    m2.m00.should.equal(2.0);
    m2.m01.should.equal(4.0);
    m2.m10.should.equal(6.0);
    m2.m11.should.equal(8.0);
    m1.should.not.equal(m2);
  });

  it('identity', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    m1.identity();
    m1.m00.should.equal(1.0);
    m1.m01.should.equal(0.0);
    m1.m10.should.equal(0.0);
    m1.m11.should.equal(1.0);
  });

  it('transpose', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    m1.transpose();
    m1.m00.should.equal(1.0);
    m1.m01.should.equal(3.0);
    m1.m10.should.equal(2.0);
    m1.m11.should.equal(4.0);
  });

  it('getTranspose', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    const m2 = m1.getTranspose();
    m2.m00.should.equal(1.0);
    m2.m01.should.equal(3.0);
    m2.m10.should.equal(2.0);
    m2.m11.should.equal(4.0);
    m1.should.not.equal(m2);
  });

  it('determinant', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    const det = m1.determinant();
    det.should.equal(-2.0);
  });

  it('invert', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    m1.invert();
    m1.m00.should.equal(-2.0);
    m1.m01.should.equal(1.0);
    m1.m10.should.equal(1.5);
    m1.m11.should.equal(-0.5);

    const m2 = new Matrix22();
    m1.invert(m2);
    m2.m00.should.equal(1.0);
    m2.m01.should.equal(2.0);
    m2.m10.should.equal(3.0);
    m2.m11.should.equal(4.0);

    m1.m00.should.equal(-2.0);
    m1.m01.should.equal(1.0);
    m1.m10.should.equal(1.5);
    m1.m11.should.equal(-0.5);
  });

  it('getInverse', () => {
    const m1 = new Matrix22(1.0, 2.0, 3.0, 4.0);
    const m2 = m1.getInverse();
    m2.m00.should.equal(-2.0);
    m2.m01.should.equal(1.0);
    m2.m10.should.equal(1.5);
    m2.m11.should.equal(-0.5);
    m1.should.not.equal(m2);
  });

  it('solve', () => {
    const A = new Matrix22(3.0, -1.0, -1.0, -1.0);
    const b = new Vector2(2.0, 6.0);
    const x = A.solve(b);
    x.x.should.equal(-1.0);
    x.y.should.equal(-5.0);
  });

  it('norm', () => {
    const A = new Matrix22(3.0, -1.0, -1.0, -1.0);
    const n1 = A.norm1();
    n1.should.closeTo(4.0, 1.0e-3);
    const nf = A.normFrobenius();
    nf.should.closeTo(3.464, 1.0e-3);
    const ni = A.normInfinity();
    ni.should.closeTo(4.0, 1.0e-3);
    const nm = A.normMax();
    nm.should.closeTo(3.0, 1.0e-3);
  });

  it('equals', () => {
    const A = new Matrix22(3.0, -1.0, -1.0, -1.0);
    const B = new Matrix22(3, -1, -1, -1);
    const C = new Matrix22(4, 2, 5, 0);

    A.equals(B).should.equal(true);
    A.equals(A).should.equal(true);
    A.equals(C).should.equal(false);
    A.equals(null).should.equal(false);
    A.equals(C).should.equal(false);
    A.equals(B).should.equal(true);
  });
});