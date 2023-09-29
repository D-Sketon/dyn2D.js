'use strict';

require('chai').should();

describe('Vector2', () => {

  const Vector2 = require('../../dist/geometry/Vector2.js').Vector2;
  const Epsilon = require('../../dist/Epsilon.js').Epsilon;
  const Rotation = require('../../dist/geometry/Rotation.js').Rotation;

  it('create', () => {
    const v1 = new Vector2();
    v1.x.should.equal(0);
    v1.y.should.equal(0);

    const v2 = new Vector2(1, 2);
    v2.x.should.equal(1);
    v2.y.should.equal(2);

    const v3 = new Vector2(v2);
    (v2 === v3).should.equal(false);
    v3.x.should.equal(1);
    v3.y.should.equal(2);

    const v4 = new Vector2(0, 1, 2, 3);
    v4.x.should.equal(2);
    v4.y.should.equal(2);

    const v5 = new Vector2(v2, v1);
    v5.x.should.equal(-1);
    v5.y.should.equal(-2);

    const v6 = Vector2.create(1.0, 90 / 180 * Math.PI);
    v6.x.should.closeTo(0, 1.0e-9);
    v6.y.should.closeTo(1, 1.0e-9);

    const v7 = new Vector2(30 / 180 * Math.PI);
    v7.x.should.closeTo(0.8660254037844386, 1.0e-9);
    v7.y.should.closeTo(0.5, 1.0e-9);
  });

  it('copy', () => {
    const v = new Vector2(1, 2);
    const r = v.copy();
    (v === r).should.equal(false);
    r.x.should.equal(v.x);
    r.y.should.equal(v.y);
  });

  it('distance', () => {
    const v = new Vector2();
    v.distanceSquared(new Vector2(2, 0)).should.closeTo(4, 1.0e-9);
    v.distanceSquared(new Vector2(2, -1)).should.closeTo(5, 1.0e-9);
    v.distance(new Vector2(2, 0)).should.closeTo(2, 1.0e-9);
    v.distance(new Vector2(3, 4)).should.closeTo(5, 1.0e-9);

    v.distanceSquared(2, 0).should.closeTo(4, 1.0e-9);
    v.distanceSquared(2, -1).should.closeTo(5, 1.0e-9);
    v.distance(2, 0).should.closeTo(2, 1.0e-9);
    v.distance(3, 4).should.closeTo(5, 1.0e-9);
  });

  it('tripleProduct', () => {
    const v1 = new Vector2(1, 1);
    const v2 = new Vector2(1, -1);

    const r = Vector2.tripleProduct(v1, v2, v2);

    r.x.should.closeTo(-2, 1.0e-9);
    r.y.should.closeTo(-2, 1.0e-9);

  });

  it('equals', () => {
    const v = new Vector2(1, 2);
    v.equals(v).should.equal(true);
    v.equals(v.copy()).should.equal(true);
    v.equals(new Vector2(1, 2)).should.equal(true);
    v.equals(1, 2).should.equal(true);

    v.equals(new Vector2(1, 3)).should.equal(false);
    v.equals(v.copy().set(2, 1)).should.equal(false);
    v.equals(null).should.equal(false);
    v.equals({}).should.equal(false);
  });

  it('set', () => {
    const v = new Vector2();
    const v2 = new Vector2(1, -3);
    v.set(v2);

    (v === v2).should.equal(false);
    v.x.should.equal(1);
    v.y.should.equal(-3);

    v.set(-1, 0);
    v.x.should.equal(-1);
    v.y.should.equal(0);

    v.setDirection(90 / 180 * Math.PI);
    v.x.should.closeTo(0, 1.0e-9);
    v.y.should.closeTo(1, 1.0e-9);

    v.setMagnitude(3);
    v.x.should.closeTo(0, 1.0e-9);
    v.y.should.closeTo(3, 1.0e-9);

    v.set(-1, 0);
    v.setMagnitude(0);
    v.x.should.closeTo(0, 1.0e-9);
    v.y.should.closeTo(0, 1.0e-9);

    v.set(-1, 0);
    v.setMagnitude(Epsilon.E);
    v.x.should.closeTo(0, 1.0e-9);
    v.y.should.closeTo(0, 1.0e-9);
  });

  it('get', () => {
    const v = new Vector2(3, 4);
    const x = v.getXComponent();
    const y = v.getYComponent();

    x.x.should.closeTo(3, 1.0e-9);
    x.y.should.closeTo(0, 1.0e-9);
    y.x.should.closeTo(0, 1.0e-9);
    y.y.should.closeTo(4, 1.0e-9);

    v.getMagnitude().should.closeTo(5, 1.0e-9);
    v.getMagnitudeSquared().should.closeTo(25, 1.0e-9);
    v.getDirection().should.closeTo(53.13010235415598 / 180 * Math.PI, 1.0e-9);

    let v2 = new Vector2(-4, 3);
    v.getAngleBetween(v2).should.closeTo(90 / 180 * Math.PI, 1.0e-9);

    v2 = v.getLeftHandOrthogonalVector();
    v2.x.should.closeTo(4, 1.0e-9);
    v2.y.should.closeTo(-3, 1.0e-9);

    v2 = v.getRightHandOrthogonalVector();
    v2.x.should.closeTo(-4, 1.0e-9);
    v2.y.should.closeTo(3, 1.0e-9);

    v2 = v.getNegative();
    v2.x.should.closeTo(-3, 1.0e-9);
    v2.y.should.closeTo(-4, 1.0e-9);

    v2 = v.getNormalized();
    v2.x.should.closeTo(0.6, 1.0e-9);
    v2.y.should.closeTo(0.8, 1.0e-9);
  });

  it('add', () => {
    const v1 = new Vector2(1, 2);
    const v2 = new Vector2(-2, 1);

    let v3 = v1.sum(v2);
    v3.x.should.equal(-1);
    v3.y.should.equal(3);

    v3 = v1.sum(3, -7.5);
    v3.x.should.equal(4);
    v3.y.should.equal(-5.5);

    v1.add(v2);
    v1.x.should.equal(-1);
    v1.y.should.equal(3);

    v1.add(-2, 1);
    v1.x.should.equal(-3);
    v1.y.should.equal(4);
  });

  it('subtract', () => {
    const v1 = new Vector2(1, 2);
    const v2 = new Vector2(-2, 1);

    let v3 = v1.difference(v2);
    v3.x.should.equal(3);
    v3.y.should.equal(1);

    v3 = v1.difference(3, -7.5);
    v3.x.should.equal(-2);
    v3.y.should.equal(9.5);

    v1.subtract(v2);
    v1.x.should.equal(3);
    v1.y.should.equal(1);

    v1.subtract(-2, 1);
    v1.x.should.equal(5);
    v1.y.should.equal(0);
  });

  it('to', () => {
    const v1 = new Vector2(1, 1);
    const v2 = new Vector2(0, 1);

    let r = v1.to(v2);
    r.x.should.equal(-1);
    r.y.should.equal(0);

    r = v1.to(2, 0);
    r.x.should.equal(1);
    r.y.should.equal(-1);
  });

  it('multiply', () => {
    const v1 = new Vector2(2, 1);
    const r = v1.product(-1.5);
    r.x.should.equal(-3);
    r.y.should.equal(-1.5);

    v1.multiply(-1.5);
    v1.x.should.equal(-3);
    v1.y.should.equal(-1.5);
  });

  it('divide', () => {
    const v1 = new Vector2(2, 1);
    const r = v1.quotient(2);
    r.x.should.equal(1);
    r.y.should.equal(0.5);

    v1.divide(2);
    v1.x.should.equal(1);
    v1.y.should.equal(0.5);
  });

  it('dot', () => {
    const v1 = new Vector2(1, 1);
    const v2 = new Vector2(0, 1);

    v1.dot(v2).should.equal(1);
    v1.dot(v1.getLeftHandOrthogonalVector()).should.equal(0);
    v1.getMagnitudeSquared().should.equal(v1.dot(v1));

    v1.dot(0, 1).should.equal(1);
    v1.dot(-1, 1).should.equal(0);
    v1.dot(1, 1).should.equal(2);
  });

  it('cross', () => {
    const v1 = new Vector2(1, 1);
    const v2 = new Vector2(0, 1);

    v1.cross(v1).should.equal(0);
    v1.cross(v2).should.equal(1);
    v1.cross(v1.getLeftHandOrthogonalVector()).should.equal(-2);

    v1.cross(1, 1).should.equal(0);
    v1.cross(0, 1).should.equal(1);
    v1.cross(-1, 1).should.equal(2);

    const r = v1.cross(3);
    r.x.should.equal(-3);
    r.y.should.equal(3);
  });

  it('isOrthogonal', () => {
    const v1 = new Vector2(1, 1);
    const v2 = new Vector2(0, 1);

    v1.isOrthogonal(v2).should.equal(false);
    v1.isOrthogonal(v1.getLeftHandOrthogonalVector()).should.equal(true);
    v1.isOrthogonal(v1.getRightHandOrthogonalVector()).should.equal(true);
    v1.isOrthogonal(v1).should.equal(false);

    v1.isOrthogonal(0, 1).should.equal(false);
    v1.isOrthogonal(1, 1).should.equal(false);
    v1.isOrthogonal(-1, 1).should.equal(true);
    v1.isOrthogonal(1, 0).should.equal(false);
    v1.isOrthogonal(1, -1).should.equal(true);
    v1.isOrthogonal(0, 0).should.equal(true);
  });

  it('isZero', () => {
    const v = new Vector2();
    v.isZero().should.equal(true);

    v.set(1, 0);
    v.isZero().should.equal(false);

    v.set(0, 1);
    v.isZero().should.equal(false);

    v.set(1, 1);
    v.isZero().should.equal(false);
  });

  it('negate', () => {
    const v = new Vector2(1, 2);
    v.negate();
    v.x.should.equal(-1);
    v.y.should.equal(-2);
  });

  it('zero', () => {
    const v = new Vector2(1, 2);
    v.zero();
    v.x.should.equal(0);
    v.y.should.equal(0);
  });

  it('rotate', () => {
    const v = new Vector2(2, 1);
    v.rotate(90 / 180 * Math.PI);
    v.x.should.closeTo(-1, 1.0e-9);
    v.y.should.closeTo(2, 1.0e-9);

    v.rotate(new Rotation(60 / 180 * Math.PI), 0, 1);
    v.x.should.closeTo(-1.366, 1.0e-3);
    v.y.should.closeTo(0.634, 1.0e-3);

    v.inverseRotate(new Rotation(60 / 180 * Math.PI), 0, 1);
    v.x.should.closeTo(-1, 1.0e-9);
    v.y.should.closeTo(2, 1.0e-9);

    v.inverseRotate(90 / 180 * Math.PI);
    v.x.should.closeTo(2, 1.0e-9);
    v.y.should.closeTo(1, 1.0e-9);

    let v2 = new Vector2(2, 1);
    v2.rotate(new Rotation(90 / 180 * Math.PI), new Vector2(0, 0));
    v2.x.should.closeTo(-1, 1.0e-9);
    v2.y.should.closeTo(2, 1.0e-9);

    v2 = new Vector2(2, 1);
    v2.rotate(90 / 180 * Math.PI, new Vector2(0, 0));
    v2.x.should.closeTo(-1, 1.0e-9);
    v2.y.should.closeTo(2, 1.0e-9);

    v2 = new Vector2(2, 1);
    v2.rotate(new Rotation(90 / 180 * Math.PI), 0, 0);
    v2.x.should.closeTo(-1, 1.0e-9);
    v2.y.should.closeTo(2, 1.0e-9);

    v2 = new Vector2(2, 1);
    v2.inverseRotate(new Rotation(90 / 180 * Math.PI), new Vector2(0, 0));
    v2.x.should.closeTo(1, 1.0e-9);
    v2.y.should.closeTo(-2, 1.0e-9);

    v2 = new Vector2(2, 1);
    v2.inverseRotate(new Rotation(90 / 180 * Math.PI), 0, 0);
    v2.x.should.closeTo(1, 1.0e-9);
    v2.y.should.closeTo(-2, 1.0e-9);
  });

  it('project', () => {
    const v1 = new Vector2(1, 1);
    const v2 = new Vector2(0.5, 1);

    let r = v1.project(v2);
    r.x.should.closeTo(0.6, 1.0e-9);
    r.y.should.closeTo(1.2, 1.0e-9);

    r = v1.project(new Vector2());
    r.x.should.closeTo(0, 1.0e-9);
    r.y.should.closeTo(0, 1.0e-9);
  });

  it('left', () => {
    const v = new Vector2(11, 2.5);
    v.left();
    v.x.should.equal(2.5);
    v.y.should.equal(-11);
  });

  it('right', () => {
    const v = new Vector2(11, 2.5);
    v.right();
    v.x.should.equal(-2.5);
    v.y.should.equal(11);
  });

  it('normalize', () => {
    const v = new Vector2(3, 4);
    v.normalize();
    v.x.should.closeTo(0.6, 1.0e-9);
    v.y.should.closeTo(0.8, 1.0e-9);
  });

  it('getAngleBetweenRange', () => {
    let v1 = new Vector2(-1, 2);
    let v2 = new Vector2(-2, -1);
    (Math.abs(v1.getAngleBetween(v2)) <= Math.PI).should.equal(true);

    v1 = new Vector2(1, 2);
    v2 = new Vector2(-2, 1);
    (Math.abs(v1.getAngleBetween(v2)) <= Math.PI).should.equal(true);

    v1 = new Vector2(-1, -1);
    const angle = Math.abs(v1.getAngleBetween(300 / 180 * Math.PI));
    angle.should.closeTo(75 / 180 * Math.PI, 1.0e-9);
    (angle <= Math.PI).should.equal(true);
  });
});