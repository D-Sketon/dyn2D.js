'use strict';

require('chai').should();

describe('HalfEllipse', () => {
  const HalfEllipse = require('../../dist/geometry/HalfEllipse').HalfEllipse;
  const Transform = require('../../dist/geometry/Transform').Transform;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const MassType = require('../../dist/geometry/MassType').MassType;
  const IDENTITY = new Transform();

  it('createZeroWidth', () => {
    try {
      new HalfEllipse(0.0, 1.0);
    } catch (e) {
      e.message.should.equal('HalfEllipse: Width must be non-negative.');
    }
  });

  it('createNegativeWidth', () => {
    try {
      new HalfEllipse(-1.0, 1.0);
    } catch (e) {
      e.message.should.equal('HalfEllipse: Width must be non-negative.');
    }
  });

  it('createZeroHeight', () => {
    try {
      new HalfEllipse(1.0, 0.0);
    } catch (e) {
      e.message.should.equal('HalfEllipse: Height must be non-negative.');
    }
  });

  it('createNegativeHeight', () => {
    try {
      new HalfEllipse(1.0, -1.0);
    } catch (e) {
      e.message.should.equal('HalfEllipse: Height must be non-negative.');
    }
  });
  it('createSuccess', () => {
    const e = new HalfEllipse(1.0, 2.0);
    e.getHeight().should.equal(2.0);
    e.getHalfWidth().should.equal(0.5);
    e.getWidth().should.equal(1.0);
  });

  it('contains', () => {
    const e = new HalfEllipse(2.0, 0.5);
    const t = new Transform();
    const p = new Vector2(0.75, 0.35);

    e.contains(p, t).should.equal(false);
    e.contains(p, t, false).should.equal(false);

    p.set(0.75, -0.2);
    e.contains(p, t).should.equal(false);
    e.contains(p, t, false).should.equal(false);

    p.set(0.75, 0.35);
    t.translate(0.5, 0.0);

    e.contains(p, t).should.equal(true);
    e.contains(p, t, false).should.equal(true);

    p.set(1.5, 0.0);

    e.contains(p, t).should.equal(true);
    e.contains(p, t, false).should.equal(false);

    p.set(0.75, 0.35);
    e.translate(e.getCenter().getNegative());
    e.contains(p, t).should.equal(false);
    e.contains(p, t, false).should.equal(false);

    e.rotate(90 * 180 / Math.PI);
    e.translate(0.5, 1.0);

    p.set(0.3, 0.3);
    e.contains(p, t).should.equal(false);
    e.contains(p, t, false).should.equal(false);

    p.set(0.7, 0.4);
    e.contains(p, t).should.equal(true);
    e.contains(p, t, false).should.equal(true);
  });

  it('project', () => {
    const e = new HalfEllipse(2.0, 0.5);
    const t = new Transform();
    const x = new Vector2(1.0, 0.0);
    const y = new Vector2(0.0, 1.0);

    t.translate(1.0, 0.5);

    const i = e.project(x, t);
    i.min.should.be.closeTo(0.000, 1.0e-3);
    i.max.should.be.closeTo(2.000, 1.0e-3);

    const i2 = e.project(y, t);
    i2.min.should.be.closeTo(0.500, 1.0e-3);
    i2.max.should.be.closeTo(1.000, 1.0e-3);

    t.rotate(Math.PI / 6, t.getTransformed(e.getCenter()));

    const i3 = e.project(y, t);
    i3.min.should.be.closeTo(0.028, 1.0e-3);
    i3.max.should.be.closeTo(1.189, 1.0e-3);

    e.translate(1.0, 0.5);
    e.rotateAboutCenter(Math.PI / 6);

    const i4 = e.project(y, IDENTITY);
    i4.min.should.be.closeTo(0.028, 1.0e-3);
    i4.max.should.be.closeTo(1.189, 1.0e-3);

    t.identity();
    t.translate(0.0, 1.0);
    const i5 = e.project(y, t);
    i5.min.should.be.closeTo(1.028, 1.0e-3);
    i5.max.should.be.closeTo(2.189, 1.0e-3);
  });

  it('getFarthest', () => {
    const e = new HalfEllipse(2.0, 0.5);
    const t = new Transform();
    const x = new Vector2(1.0, 0.0);
    const y = new Vector2(0.0, -1.0);

    t.translate(1.0, 0.5);

    const p = e.getFarthestPoint(x, t);
    p.x.should.be.closeTo(2.000, 1.0e-3);
    p.y.should.be.closeTo(0.5, 1.0e-3);

    t.rotate(Math.PI / 6, 1.0, 0.5);

    const p2 = e.getFarthestPoint(y, t);
    p2.x.should.be.closeTo(0.133, 1.0e-3);
    p2.y.should.be.closeTo(0.000, 1.0e-3);

    e.translate(1.0, 0.5);
    e.rotate(Math.PI / 6, 1.0, 0.5);

    const p3 = e.getFarthestPoint(y, IDENTITY);
    p3.x.should.be.closeTo(0.133, 1.0e-3);
    p3.y.should.be.closeTo(0.000, 1.0e-3);

    t.identity();
    t.translate(0.0, 1.0);
    const p4 = e.getFarthestPoint(y, t);
    p4.x.should.be.closeTo(0.133, 1.0e-3);
    p4.y.should.be.closeTo(1.000, 1.0e-3);
  });

  it('getAxes', () => {
    try {
      const e = new HalfEllipse(1.0, 0.5);
      e.getAxes(null, IDENTITY);
    } catch (e) {
      e.message.should.equal('HalfEllipse: SAT does not support the HalfEllipse shape.');
    }
  });

  it('getFoci', () => {
    try {
      const e = new HalfEllipse(1.0, 0.5);
      e.getFoci(IDENTITY);
    } catch (e) {
      e.message.should.equal('HalfEllipse: SAT does not support the HalfEllipse shape.');
    }
  });

  it('rotate', () => {
    const e = new HalfEllipse(1.0, 0.25);

    e.translate(1.0, 1.0);
    e.rotateAboutCenter(Math.PI / 6);
    e.getCenter().x.should.be.closeTo(1.000, 1.0e-3);
    e.getCenter().y.should.be.closeTo(1.106, 1.0e-3);
    e.getRotationAngle().should.be.closeTo(Math.PI / 6, 1.0e-3);
    e.getRotation().cost.should.be.closeTo(Math.cos(Math.PI / 6), 1.0e-3);
    e.getRotation().sint.should.be.closeTo(Math.sin(Math.PI / 6), 1.0e-3);

    e.rotate(Math.PI / 2);
    e.getCenter().x.should.be.closeTo(-1.106, 1.0e-3);
    e.getCenter().y.should.be.closeTo(1.000, 1.0e-3);
    e.getRotationAngle().should.be.closeTo(Math.PI * 2 / 3, 1.0e-3);
    e.getRotation().cost.should.be.closeTo(Math.cos(Math.PI * 2 / 3), 1.0e-3);
    e.getRotation().sint.should.be.closeTo(Math.sin(Math.PI * 2 / 3), 1.0e-3);

    e.translate(e.getCenter().getNegative());

    e.rotate(Math.PI / 2, 1.0, -1.0);
    e.getCenter().x.should.be.closeTo(0.000, 1.0e-3);
    e.getCenter().y.should.be.closeTo(-2.000, 1.0e-3);
  });

  it('translate', () => {
    const e = new HalfEllipse(1.0, 0.25);

    e.translate(1.0, -0.5);

    e.getEllipseCenter().x.should.be.closeTo(1.000, 1.0e-3);
    e.getEllipseCenter().y.should.be.closeTo(-0.500, 1.0e-3);
  });

  it('createAABB', () => {
    const e = new HalfEllipse(1.0, 0.25);

    const aabb = e.createAABB(IDENTITY);
    aabb.getMinX().should.be.closeTo(-0.500, 1.0e-3);
    aabb.getMinY().should.be.closeTo(0.000, 1.0e-3);
    aabb.getMaxX().should.be.closeTo(0.500, 1.0e-3);
    aabb.getMaxY().should.be.closeTo(0.250, 1.0e-3);

    const aabb2 = e.createAABB();
    aabb.getMinX().should.be.closeTo(aabb2.getMinX(), 1.0e-3);
    aabb.getMinY().should.be.closeTo(aabb2.getMinY(), 1.0e-3);
    aabb.getMaxX().should.be.closeTo(aabb2.getMaxX(), 1.0e-3);
    aabb.getMaxY().should.be.closeTo(aabb2.getMaxY(), 1.0e-3);

    let tx = new Transform();
    tx.rotate(Math.PI / 6);
    tx.translate(1.0, 2.0);

    const aabb3 = e.createAABB(tx);
    aabb3.getMinX().should.be.closeTo(0.549, 1.0e-3);
    aabb3.getMinY().should.be.closeTo(1.750, 1.0e-3);
    aabb3.getMaxX().should.be.closeTo(1.433, 1.0e-3);
    aabb3.getMaxY().should.be.closeTo(2.330, 1.0e-3);

    tx = new Transform();
    tx.rotate(Math.PI / 3);
    tx.translate(1.0, 2.0);

    // 60
    const aabb4 = e.createAABB(tx);
    aabb4.getMinX().should.be.closeTo(0.669, 1.0e-3);
    aabb4.getMinY().should.be.closeTo(1.566, 1.0e-3);
    aabb4.getMaxX().should.be.closeTo(1.250, 1.0e-3);
    aabb4.getMaxY().should.be.closeTo(2.450, 1.0e-3);

    // 120
    tx.rotate(Math.PI / 3, 1.0, 2.0);
    const aabb5 = e.createAABB(tx);
    aabb5.getMinX().should.be.closeTo(0.669, 1.0e-3);
    aabb5.getMinY().should.be.closeTo(1.549, 1.0e-3);
    aabb5.getMaxX().should.be.closeTo(1.250, 1.0e-3);
    aabb5.getMaxY().should.be.closeTo(2.433, 1.0e-3);

    // 220
    tx.rotate(Math.PI * 100 / 180, 1.0, 2.0);
    const aabb6 = e.createAABB(tx);
    aabb6.getMinX().should.be.closeTo(0.616, 1.0e-3);
    aabb6.getMinY().should.be.closeTo(1.625, 1.0e-3);
    aabb6.getMaxX().should.be.closeTo(1.415, 1.0e-3);
    aabb6.getMaxY().should.be.closeTo(2.321, 1.0e-3);

    // 300
    tx.rotate(Math.PI * 80 / 180, 1.0, 2.0);
    const aabb7 = e.createAABB(tx);
    aabb7.getMinX().should.be.closeTo(0.750, 1.0e-3);
    aabb7.getMinY().should.be.closeTo(1.566, 1.0e-3);
    aabb7.getMaxX().should.be.closeTo(1.330, 1.0e-3);
    aabb7.getMaxY().should.be.closeTo(2.450, 1.0e-3);
  });

  it('createMass', () => {
    const e = new HalfEllipse(1.0, 0.5);
    const mass = e.createMass(1.0);

    mass.getMass().should.be.closeTo(0.392, 1.0e-3);
    mass.getInertia().should.be.closeTo(0.021, 1.0e-3);
    mass.getInverseMass().should.be.closeTo(2.546, 1.0e-3);
    mass.getInverseInertia().should.be.closeTo(46.402, 1.0e-3);
    mass.getType().should.equal(MassType.NORMAL);
    mass.getCenter().x.should.be.closeTo(0.000, 1.0e-3);
    mass.getCenter().y.should.be.closeTo(0.212, 1.0e-3);

    const mass2 = e.createMass(0.0);
    mass2.getMass().should.be.closeTo(0.000, 1.0e-3);
    mass2.getInertia().should.be.closeTo(0.000, 1.0e-3);
    mass2.getInverseMass().should.be.closeTo(0.000, 1.0e-3);
    mass2.getInverseInertia().should.be.closeTo(0.000, 1.0e-3);
    mass2.getCenter().x.should.be.closeTo(0.000, 1.0e-3);
    mass2.getCenter().y.should.be.closeTo(0.212, 1.0e-3);
    mass2.getType().should.equal(MassType.INFINITE);
  });

  it('getArea', () => {
    const e = new HalfEllipse(1.0, 0.5);
    e.getArea().should.be.closeTo(0.392, 1.0e-3);
  });

  it('getRadius', () => {
    let e = new HalfEllipse(1.0, 0.5);
    e.getRadius().should.be.closeTo(0.543, 1.0e-3);
    e.getRadius(new Vector2(0, 0)).should.be.closeTo(0.500, 1.0e-3);
    e.getRadius(new Vector2(1, 1)).should.be.closeTo(1.802, 1.0e-3);
    e.rotateAboutCenter(Math.PI / 3);
    e.getRadius(new Vector2(1, 1)).should.be.closeTo(1.710, 1.0e-3);
    e = new HalfEllipse(0.5, 1.0);
    e.getRadius(new Vector2(1, -1)).should.be.closeTo(2.243, 1.0e-3);

    // 3 quadrant
    e.getRadius(new Vector2(-1, -1)).should.be.closeTo(2.243, 1.0e-3);

    // 2 quadrant
    e.getRadius(new Vector2(-1, 1)).should.be.closeTo(1.600, 1.0e-3);

    // below the evolute
    e.getRadius(new Vector2(1, 0.25)).should.be.closeTo(1.286, 1.0e-3);

    // above the evolute
    e.getRadius(new Vector2(1, 2)).should.be.closeTo(2.358, 1.0e-3);
  });

  it('getRadiusAboveXAxisBelowEvolute', () => {
    const e = new HalfEllipse(4.0, 4.0);
    const x = 1.0;
    const y = 0.25;
    const d = e.getRadius(new Vector2(x, y));

    d.should.be.closeTo(3.927647520827677, 1.0e-3);
  });
});