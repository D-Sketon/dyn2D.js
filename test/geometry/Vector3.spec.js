'use strict';

require('chai').should();

describe('Vector3', () => {
  const Vector3 = require('../../dist/geometry/Vector3').Vector3;

  it('create', () => {
    const v1 = new Vector3();
    v1.x.should.equal(0);
    v1.y.should.equal(0);
    v1.z.should.equal(0);

    const v2 = new Vector3(1, 2, 3);
    v2.x.should.equal(1);
    v2.y.should.equal(2);
    v2.z.should.equal(3);

    const v3 = new Vector3(v2);
    v3.should.not.equal(v2);
    v3.x.should.equal(1);
    v3.y.should.equal(2);
    v3.z.should.equal(3);

    const v4 = new Vector3(0, 1, 1, 2, 3, 1);
    v4.x.should.equal(2);
    v4.y.should.equal(2);
    v4.z.should.equal(0);

    const v5 = new Vector3(v2, v1);
    v5.x.should.equal(-1);
    v5.y.should.equal(-2);
    v5.z.should.equal(-3);
  });

  it('copy', () => {
    const v = new Vector3(1, 3, 2);
    const vc = v.copy();

    v.should.not.equal(vc);
    v.x.should.equal(vc.x);
    v.y.should.equal(vc.y);
    v.z.should.equal(vc.z);
  });

  it('distance', () => {
    const v = new Vector3();
    v.distanceSquared(2, 0, 0).should.closeTo(4, 1.0e-3);
    v.distanceSquared(2, -1, 2).should.closeTo(9, 1.0e-3);
    v.distance(2, 0, 0).should.closeTo(2, 1.0e-3);
    v.distance(2, -1, 2).should.closeTo(3, 1.0e-3);

    v.distanceSquared(new Vector3(2, 0, 0)).should.closeTo(4, 1.0e-3);
    v.distanceSquared(new Vector3(2, -1, 2)).should.closeTo(9, 1.0e-3);
    v.distance(new Vector3(2, 0, 0)).should.closeTo(2, 1.0e-3);
    v.distance(new Vector3(2, -1, 2)).should.closeTo(3, 1.0e-3);
  });

  it('tripleProduct', () => {
    const v1 = new Vector3(1, 1, 0);
    const v2 = new Vector3(0, -1, 1);
    const r = Vector3.tripleProduct(v1, v2, v2);

    r.x.should.closeTo(-2, 1.0e-3);
    r.y.should.closeTo(-1, 1.0e-3);
    r.z.should.closeTo(-1, 1.0e-3);
  });

  it('equals', () => {
    const v = new Vector3(1, 2, -1);
    v.equals(v).should.be.true;
    v.equals(v.copy()).should.be.true;
    v.equals(new Vector3(1, 2, -1)).should.be.true;
    v.equals(1, 2, -1).should.be.true;

    v.equals(v.copy().set(2, 1, -1)).should.be.false;
    v.equals(2, 2, 3).should.be.false;

    v.equals(null).should.be.false;
    v.equals({}).should.be.false;

    v.equals(new Vector3(1, 1, 1)).should.be.false;
    v.equals(new Vector3(1, 2, 1)).should.be.false;
    v.equals(new Vector3(1, 2, 3)).should.be.false;
  });

  it('set', () => {
    const v = new Vector3();
    const v2 = new Vector3(1, -3, 2);
    v.set(v2);

    v.should.not.equal(v2);
    v.x.should.equal(1);
    v.y.should.equal(-3);
    v.z.should.equal(2);

    v.set(-1, 0, 0);
    v.x.should.equal(-1);
    v.y.should.equal(0);
    v.z.should.equal(0);

    v.setMagnitude(3);
    v.x.should.closeTo(-3, 1.0e-3);
    v.y.should.closeTo(0, 1.0e-3);
    v.z.should.closeTo(0, 1.0e-3);

    v.setMagnitude(0);
    v.x.should.closeTo(0, 1.0e-3);
    v.y.should.closeTo(0, 1.0e-3);
    v.z.should.closeTo(0, 1.0e-3);

    const v3 = new Vector3(0, 0, 0);
    v3.setMagnitude(3);
    v3.x.should.closeTo(0, 1.0e-3);
    v3.y.should.closeTo(0, 1.0e-3);
    v3.z.should.closeTo(0, 1.0e-3);
  });

  it('get', () => {
    const v = new Vector3(2, 1, -2);
    const x = v.getXComponent();
    const y = v.getYComponent();
    const z = v.getZComponent();

    x.x.should.equal(2);
    x.y.should.equal(0);
    x.z.should.equal(0);

    y.x.should.equal(0);
    y.y.should.equal(1);
    y.z.should.equal(0);

    z.x.should.equal(0);
    z.y.should.equal(0);
    z.z.should.equal(-2);

    v.getMagnitude().should.closeTo(3, 1.0e-3);
    v.getMagnitudeSquared().should.closeTo(9, 1.0e-3);

    const v2 = v.getNegative();
    v2.x.should.equal(-2);
    v2.y.should.equal(-1);
    v2.z.should.equal(2);

    const v3 = v.getNormalized();
    v3.x.should.closeTo(0.666, 1.0e-3);
    v3.y.should.closeTo(0.333, 1.0e-3);
    v3.z.should.closeTo(-0.666, 1.0e-3);

    v.set(0, 0, 0);
    const v4 = v.getNormalized();
    v4.x.should.closeTo(0, 1.0e-3);
    v4.y.should.closeTo(0, 1.0e-3);
    v4.z.should.closeTo(0, 1.0e-3);
  });

  it('add', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(-2, 1, -1);
    let v3 = v1.sum(v2);
    v3.x.should.equal(-1);
    v3.y.should.equal(3);
    v3.z.should.equal(2);

    v3 = v1.sum(3, -7.5, 2);
    v3.x.should.equal(4);
    v3.y.should.equal(-5.5);
    v3.z.should.equal(5);

    v3 = v1.add(v2);
    v3.x.should.equal(-1);
    v3.y.should.equal(3);
    v3.z.should.equal(2);

    const v4 = v1.add(-2, 1, 0);
    v4.x.should.equal(-3);
    v4.y.should.equal(4);
    v4.z.should.equal(2);
  });

  it('subtract', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(-2, 1, -1);
    let v3 = v1.difference(v2);
    v3.x.should.equal(3);
    v3.y.should.equal(1);
    v3.z.should.equal(4);

    v3 = v1.difference(3, -7.5, 2);
    v3.x.should.equal(-2);
    v3.y.should.equal(9.5);
    v3.z.should.equal(1);

    v1.subtract(v2);
    v1.x.should.equal(3);
    v1.y.should.equal(1);
    v1.z.should.equal(4);

    v1.subtract(-2, 1, 0);
    v1.x.should.equal(5);
    v1.y.should.equal(0);
    v1.z.should.equal(4);
  });

  it('to', () => {
    const p1 = new Vector3(1, 1, 1);
    const p2 = new Vector3(0, 1, 0);
    let r = p1.to(p2);

    r.x.should.equal(-1);
    r.y.should.equal(0);
    r.z.should.equal(-1);

    r = p1.to(2, 0, -1);

    r.x.should.equal(1);
    r.y.should.equal(-1);
    r.z.should.equal(-2);
  });

  it('multiply', () => {
    const v1 = new Vector3(2, 1, -1);
    let r = v1.product(-1.5);
    r.x.should.equal(-3);
    r.y.should.equal(-1.5);
    r.z.should.equal(1.5);

    v1.multiply(-1.5);
    v1.x.should.equal(-3);
    v1.y.should.equal(-1.5);
    v1.z.should.equal(1.5);
  });

  it('dot', () => {
    const v1 = new Vector3(1, 1, -1);
    const v2 = new Vector3(0, 1, 0);
    v1.dot(v2).should.equal(1);
    v1.dot(0, 1, 0).should.equal(1);
    v1.dot(-1, 1, 0).should.equal(0);
    v1.dot(1, 1, 0).should.equal(2);
  });

  it('cross', () => {
    const v1 = new Vector3(1, 1, 0);
    const v2 = new Vector3(0, 1, -1);
    let r = v1.cross(v1);
    r.x.should.equal(0);
    r.y.should.equal(0);
    r.z.should.equal(0);

    r = v1.cross(v2);
    r.x.should.equal(-1);
    r.y.should.equal(1);
    r.z.should.equal(1);

    r = v1.cross(1, 1, 0);
    r.x.should.equal(0);
    r.y.should.equal(0);
    r.z.should.equal(0);

    r = v1.cross(0, 1, 1);
    r.x.should.equal(1);
    r.y.should.equal(-1);
    r.z.should.equal(1);

    r = v1.cross(-1, 1, -1);
    r.x.should.equal(-1);
    r.y.should.equal(1);
    r.z.should.equal(2);
  });

  it('isOrthogonal', () => {
    const v1 = new Vector3(1, 1, 0);
    const v2 = new Vector3(0, 1, 2);

    v1.isOrthogonal(v2).should.be.false;
    v1.isOrthogonal(v1).should.be.false;

    v1.isOrthogonal(0, 1, 0).should.be.false;
    v1.isOrthogonal(1, -1, 0).should.be.true;
    v1.isOrthogonal(-1, 1, 0).should.be.true;
    v1.isOrthogonal(1, 1, 0).should.be.false;
    v1.isOrthogonal(0, 0, 0).should.be.true;
  });

  it('isZero', () => {
    const v = new Vector3();
    v.isZero().should.be.true;

    v.set(1, 0, 0);
    v.isZero().should.be.false;

    v.set(1, 1, 0);
    v.isZero().should.be.false;

    v.set(0, 1, 1);
    v.isZero().should.be.false;

    v.set(0, 0, 1);
    v.isZero().should.be.false;
  });

  it('negate', () => {
    const v = new Vector3(1, -6, 2);
    v.negate();
    v.x.should.equal(-1);
    v.y.should.equal(6);
    v.z.should.equal(-2);
  });

  it('zero', () => {
    const v = new Vector3(1, -2, 3);
    v.zero();
    v.x.should.equal(0);
    v.y.should.equal(0);
    v.z.should.equal(0);
  });

  it('project', () => {
    const v1 = new Vector3(1, 1, 0);
    const v2 = new Vector3(0.5, 1, 1);
    let r = v1.project(v2);

    r.x.should.closeTo(1 / 3, 1.0e-3);
    r.y.should.closeTo(2 / 3, 1.0e-3);
    r.z.should.closeTo(2 / 3, 1.0e-3);

    r = v1.project(new Vector3());
    r.x.should.closeTo(0, 1.0e-3);
    r.y.should.closeTo(0, 1.0e-3);
    r.z.should.closeTo(0, 1.0e-3);
  });

  it('normalize', () => {
    const v = new Vector3(2, 1, 2);
    v.normalize();
    v.x.should.closeTo(2 / 3, 1.0e-3);
    v.y.should.closeTo(1 / 3, 1.0e-3);
    v.z.should.closeTo(2 / 3, 1.0e-3);
  });
});