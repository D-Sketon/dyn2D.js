'use strict';

require('chai').should();

describe('Circle', () => {
  const Circle = require('../../dist/geometry/Circle').Circle;
  const Transform = require('../../dist/geometry/Transform').Transform;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const MassType = require('../../dist/geometry/MassType').MassType;
  const IDENTITY = new Transform();

  it('createZeroRadius', () => {
    try {
      new Circle(0.0);
    } catch (e) {
      e.message.should.equal('Circle: Radius must be non-negative.');
    }
  });

  it('createNegativeRadius', () => {
    try {
      new Circle(-1.0);
    } catch (e) {
      e.message.should.equal('Circle: Radius must be non-negative.');
    }
  });

  it('createSuccess', () => {
    const c = new Circle(1.0);
    c.radius.should.equal(1.0);
  });

  it('contains', () => {
    const c = new Circle(2.0);
    const t = new Transform();
    const p = new Vector2(2.0, 4.0);

    c.contains(p, t).should.equal(false);
    c.contains(p, t, false).should.equal(false);

    t.translate(2.0, 2.5);

    c.contains(p, t).should.equal(true);
    c.contains(p, t, false).should.equal(true);

    t.translate(0.0, -0.5);

    c.contains(p, t).should.equal(true);
    c.contains(p, t, false).should.equal(false);
  });

  it('project', () => {
    const c = new Circle(1.5);
    const t = new Transform();
    const x = new Vector2(1.0, 0.0);
    const y = new Vector2(0.0, 1.0);

    t.translate(1.0, 0.5);

    const i = c.project(x, t);

    i.min.should.equal(-0.5);
    i.max.should.equal(2.5);

    t.rotate(Math.PI / 6, 1.0, 0.5);

    const i2 = c.project(y, t);

    i2.min.should.equal(-1.0);
    i2.max.should.equal(2.0);
  });

  it('getFarthest', () => {
    const c = new Circle(1.5);
    const t = new Transform();
    const y = new Vector2(0.0, -1.0);

    const f = c.getFarthestFeature(y, t);
    f.point.x.should.equal(0.000);
    f.point.y.should.equal(-1.500);

    const p = c.getFarthestPoint(y, t);
    p.x.should.equal(0.000);
    p.y.should.equal(-1.500);

    t.translate(0.0, -0.5);

    const f2 = c.getFarthestFeature(y.getNegative(), t);
    f2.point.x.should.equal(0.000);
    f2.point.y.should.equal(1.000);

    const p2 = c.getFarthestPoint(y.getNegative(), t);
    p2.x.should.equal(0.000);
    p2.y.should.equal(1.000);
  });

  it('getAxes', () => {
    const c = new Circle(1.5);
    const t = new Transform();

    const axes = c.getAxes(null, t);
    (axes === null).should.equal(true);
  });

  it('getFoci', () => {
    const c = new Circle(1.5);
    const t = new Transform();

    const foci = c.getFoci(t);
    foci.length.should.equal(1);
  });

  it('rotate', () => {
    const c = new Circle(1.0);

    c.translate(1.0, 1.0);
    c.rotateAboutCenter(Math.PI / 6);
    c.center.x.should.equal(1.000);
    c.center.y.should.equal(1.000);

    c.rotate(Math.PI / 2);
    c.center.x.should.closeTo(-1.000, 1.0e-3);
    c.center.y.should.closeTo(1.000, 1.0e-3);
    c.translate(c.center.getNegative());

    c.rotate(Math.PI / 2, 1.0, -1.0);
    c.center.x.should.equal(0.000);
    c.center.y.should.equal(-2.000);
  });

  it('translate', () => {
    const c = new Circle(1.0);

    c.translate(1.0, -0.5);

    c.center.x.should.equal(1.000);
    c.center.y.should.equal(-0.500);
  });

  it('createAABB', () => {
    const c = new Circle(1.2);

    const aabb = c.createAABB(IDENTITY);
    aabb.getMinX().should.closeTo(-1.2, 1.0e-3);
    aabb.getMinY().should.closeTo(-1.2, 1.0e-3);
    aabb.getMaxX().should.closeTo(1.2, 1.0e-3);
    aabb.getMaxY().should.closeTo(1.2, 1.0e-3);

    const aabb2 = c.createAABB();
    aabb2.getMinX().should.closeTo(-1.2, 1.0e-3);
    aabb2.getMinY().should.closeTo(-1.2, 1.0e-3);
    aabb2.getMaxX().should.closeTo(1.2, 1.0e-3);
    aabb2.getMaxY().should.closeTo(1.2, 1.0e-3);

    const tx = new Transform();
    tx.rotate(Math.PI / 6);
    tx.translate(1.0, 2.0);

    const aabb3 = c.createAABB(tx);
    aabb3.getMinX().should.closeTo(-0.2, 1.0e-3);
    aabb3.getMinY().should.closeTo(0.8, 1.0e-3);
    aabb3.getMaxX().should.closeTo(2.2, 1.0e-3);
    aabb3.getMaxY().should.closeTo(3.2, 1.0e-3);
  });

  it('getRadius', () => {
    const c = new Circle(3.0);
    c.getRadius().should.equal(3.0);
    c.getRadius(new Vector2(-1.0, 0.0)).should.equal(4.0);
    c.getRadius(new Vector2(-3.0, 4.0)).should.equal(8.0);
  });

  it('createMass', () => {
    const c = new Circle(3.0);
    const mass = c.createMass(2.0);

    mass.getMass().should.closeTo(56.548, 1.0e-3);
    mass.getInertia().should.closeTo(254.469, 1.0e-3);
    mass.getInverseMass().should.closeTo(0.017, 1.0e-3);
    mass.getInverseInertia().should.closeTo(0.003, 1.0e-3);
    mass.getCenter().x.should.closeTo(0.0, 1.0e-3);
    mass.getCenter().y.should.closeTo(0.0, 1.0e-3);
    mass.getType().should.equal(MassType.NORMAL);

    const mass2 = c.createMass(0.0);
    mass2.getMass().should.closeTo(0.000, 1.0e-3);
    mass2.getInertia().should.closeTo(0.000, 1.0e-3);
    mass2.getInverseMass().should.closeTo(0.000, 1.0e-3);
    mass2.getInverseInertia().should.closeTo(0.000, 1.0e-3);
    mass2.getCenter().x.should.closeTo(0.000, 1.0e-3);
    mass2.getCenter().y.should.closeTo(0.000, 1.0e-3);
    mass2.getType().should.equal(MassType.INFINITE);
  });

  it('getArea', () => {
    const c = new Circle(3.0);
    c.getArea().should.closeTo(28.274, 1.0e-3);
  });
});