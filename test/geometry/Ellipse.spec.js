'use strict';

require('chai').should();

describe('Ellipse', () => {
  const Ellipse = require('../../dist/geometry/Ellipse').Ellipse;
  const Transform = require('../../dist/geometry/Transform').Transform;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const MassType = require('../../dist/geometry/MassType').MassType;
  const IDENTITY = new Transform();

  it('createZeroWidth', () => {
    try {
      new Ellipse(0.0, 1.0);
    } catch (e) {
      e.message.should.equal('Ellipse: Width must be non-negative.');
    }
  });

  it('createNegativeWidth', () => {
    try {
      new Ellipse(-1.0, 1.0);
    } catch (e) {
      e.message.should.equal('Ellipse: Width must be non-negative.');
    }
  });

  it('createZeroHeight', () => {
    try {
      new Ellipse(1.0, 0.0);
    } catch (e) {
      e.message.should.equal('Ellipse: Height must be non-negative.');
    }
  });

  it('createNegativeHeight', () => {
    try {
      new Ellipse(1.0, -1.0);
    } catch (e) {
      e.message.should.equal('Ellipse: Height must be non-negative.');
    }
  });

  it('createSuccess', () => {
    const e = new Ellipse(1.0, 2.0);
    e.getHalfHeight().should.equal(1.0);
    e.getHalfWidth().should.equal(0.5);
    e.getWidth().should.equal(1.0);
    e.getHeight().should.equal(2.0);
  });

  it('contains', () => {
    const e = new Ellipse(2.0, 1.0);
    const t = new Transform();
    const p = new Vector2(0.75, 0.35);

    e.contains(p, t).should.equal(false);
    e.contains(p, t, false).should.equal(false);

    t.translate(0.5, 0.0);

    e.contains(p, t).should.equal(true);
    e.contains(p, t, false).should.equal(true);

    p.set(1.5, 0.0);

    e.contains(p, t).should.equal(true);
    e.contains(p, t, false).should.equal(false);

    e.rotate(Math.PI / 2);
    e.translate(0.5, 1.0);

    e.contains(p, t).should.equal(false);
    e.contains(p, t, false).should.equal(false);
    p.set(1.0, 2.1);
    e.contains(p, t).should.equal(false);
    e.contains(p, t, false).should.equal(false);
    p.set(1.0, 2.0);
    e.contains(p, t).should.equal(true);
    e.contains(p, t, false).should.equal(false);
  });

  it('project', () => {
    const e = new Ellipse(2.0, 1.0);
    const t = new Transform();
    const x = new Vector2(1.0, 0.0);
    const y = new Vector2(0.0, -1.0);

    t.translate(1.0, 0.5);

    const i = e.project(x, t);
    i.min.should.equal(0.0);
    i.max.should.equal(2.0);

    t.rotate(Math.PI / 6, 1.0, 0.5);

    const i2 = e.project(y, t);
    i2.min.should.be.closeTo(-1.161, 1.0e-3);
    i2.max.should.be.closeTo(0.161, 1.0e-3);

    e.translate(1.0, 0.5);
    e.rotate(Math.PI / 6, 1.0, 0.5);

    const i3 = e.project(y, IDENTITY);
    i3.min.should.be.closeTo(-1.161, 1.0e-3);
    i3.max.should.be.closeTo(0.161, 1.0e-3);

    t.identity();
    t.translate(0.0, 1.0);
    const i4 = e.project(y, t);
    i4.min.should.be.closeTo(-2.161, 1.0e-3);
    i4.max.should.be.closeTo(-0.839, 1.0e-3);
  });

  it('getFarthest', () => {
    const e = new Ellipse(2.0, 1.0);
    const t = new Transform();
    const x = new Vector2(1.0, 0.0);
    const y = new Vector2(0.0, -1.0);

    t.translate(1.0, 0.5);

    const p = e.getFarthestPoint(x, t);
    p.x.should.be.closeTo(2.000, 1.0e-3);
    p.y.should.be.closeTo(0.500, 1.0e-3);

    t.rotate(Math.PI / 6, 1.0, 0.5);

    const p2 = e.getFarthestPoint(y, t);
    p2.x.should.be.closeTo(0.509, 1.0e-3);
    p2.y.should.be.closeTo(-0.161, 1.0e-3);

    e.translate(1.0, 0.5);
    e.rotate(Math.PI / 6, 1.0, 0.5);

    const p3 = e.getFarthestPoint(y, IDENTITY);
    p3.x.should.be.closeTo(0.509, 1.0e-3);
    p3.y.should.be.closeTo(-0.161, 1.0e-3);

    t.identity();
    t.translate(0.0, 1.0);
    const p4 = e.getFarthestPoint(y, t);
    p4.x.should.be.closeTo(0.509, 1.0e-3);
    p4.y.should.be.closeTo(0.838, 1.0e-3);
  });

  it('getFarthestPointOnEllipse', () => {
    // quadrant 1
    const p = Ellipse.getFarthestPointOnEllipse(1.0, 0.5, new Vector2(2.0, 0.1));
    p.x.should.be.closeTo(-1.000, 1.0e-3);
    p.y.should.be.closeTo(-0.009, 1.0e-3);

    // quadrant 2
    const p2 = Ellipse.getFarthestPointOnEllipse(1.0, 0.5, new Vector2(0.1, 2.0));
    p2.x.should.be.closeTo(-0.325, 1.0e-3);
    p2.y.should.be.closeTo(-0.472, 1.0e-3);

    // quadrant 3
    const p3 = Ellipse.getFarthestPointOnEllipse(1.0, 0.5, new Vector2(-2.0, -0.1));
    p3.x.should.be.closeTo(1.000, 1.0e-3);
    p3.y.should.be.closeTo(0.009, 1.0e-3);

    // quadrant 4
    const p4 = Ellipse.getFarthestPointOnEllipse(1.0, 0.5, new Vector2(0.1, -2.0));
    p4.x.should.be.closeTo(-0.325, 1.0e-3);
    p4.y.should.be.closeTo(0.472, 1.0e-3);

    // on axis
    const p5 = Ellipse.getFarthestPointOnEllipse(1.0, 0.5, new Vector2(2.0, 0.0));
    p5.x.should.be.closeTo(-1.000, 1.0e-3);
    p5.y.should.be.closeTo(0.000, 1.0e-3);

    // test y-axis aligned ellipse
    const p6 = Ellipse.getFarthestPointOnEllipse(0.5, 1.0, new Vector2(0.0, 2.0));
    p6.x.should.be.closeTo(0.000, 1.0e-3);
    p6.y.should.be.closeTo(-1.000, 1.0e-3);
  });

  it('getAxes', () => {
    try {
      const e = new Ellipse(1.0, 0.5);
      e.getAxes(null, IDENTITY);
    } catch (e) {
      e.message.should.equal('Ellipse: SAT does not support the Ellipse shape.');
    }
  });

  it('getFoci', () => {
    try {
      const e = new Ellipse(1.0, 0.5);
      e.getFoci(IDENTITY);
    } catch (e) {
      e.message.should.equal('Ellipse: SAT does not support the Ellipse shape.');
    }
  });

  it('rotate', () => {
    const e = new Ellipse(1.0, 0.5);

    e.translate(1.0, 1.0);
    e.rotateAboutCenter(Math.PI / 6);
    e.center.x.should.equal(1.000);
    e.center.y.should.equal(1.000);

    e.rotate(Math.PI / 2);
    e.center.x.should.closeTo(-1.000, 1.0e-3);
    e.center.y.should.closeTo(1.000, 1.0e-3);
    e.translate(e.center.getNegative());

    e.rotate(Math.PI / 2, 1.0, -1.0);
    e.center.x.should.equal(0.000);
    e.center.y.should.equal(-2.000);
  });

  it('translate', () => {
    const e = new Ellipse(1.0, 0.5);

    e.translate(1.0, -0.5);

    e.center.x.should.equal(1.000);
    e.center.y.should.equal(-0.500);
  });

  it('createAABB', () => {
    const e = new Ellipse(1.0, 0.5);

    const aabb = e.createAABB(IDENTITY);
    aabb.getMinX().should.closeTo(-0.500, 1.0e-3);
    aabb.getMinY().should.closeTo(-0.250, 1.0e-3);
    aabb.getMaxX().should.closeTo(0.500, 1.0e-3);
    aabb.getMaxY().should.closeTo(0.250, 1.0e-3);

    const aabb2 = e.createAABB();
    aabb2.getMinX().should.closeTo(-0.500, 1.0e-3);
    aabb2.getMinY().should.closeTo(-0.250, 1.0e-3);
    aabb2.getMaxX().should.closeTo(0.500, 1.0e-3);
    aabb2.getMaxY().should.closeTo(0.250, 1.0e-3);

    const tx = new Transform();
    tx.rotate(Math.PI / 6);
    tx.translate(1.0, 2.0);

    const aabb3 = e.createAABB(tx);
    aabb3.getMinX().should.closeTo(0.549, 1.0e-3);
    aabb3.getMinY().should.closeTo(1.669, 1.0e-3);
    aabb3.getMaxX().should.closeTo(1.450, 1.0e-3);
    aabb3.getMaxY().should.closeTo(2.330, 1.0e-3);
  });

  it('getRadius', () => {
    const e = new Ellipse(1.0, 0.5);
    const r = e.getRadius();
    r.should.equal(0.5);

    const r2 = e.getRadius(new Vector2(1.0, 0.0));
    r2.should.equal(1.5);

    e.rotate(Math.PI / 6);
    const r3 = e.getRadius(new Vector2(1.0, 0.0));
    r3.should.be.closeTo(1.463, 1.0e-3);
  });

  it('createMass', () => {
    const e = new Ellipse(1.0, 0.5);
    const mass = e.createMass(1.0);

    mass.getMass().should.closeTo(0.392, 1.0e-3);
    mass.getInertia().should.closeTo(0.030, 1.0e-3);
    mass.getInverseMass().should.closeTo(2.546, 1.0e-3);
    mass.getInverseInertia().should.closeTo(32.594, 1.0e-3);
    mass.getCenter().x.should.closeTo(0.0, 1.0e-3);
    mass.getCenter().y.should.closeTo(0.0, 1.0e-3);
    mass.getType().should.equal(MassType.NORMAL);

    const e2 = new Ellipse(0.5, 1.0);
    const mass2 = e2.createMass(2.0);

    mass2.getMass().should.closeTo(0.785, 1.0e-3);
    mass2.getInertia().should.closeTo(0.061, 1.0e-3);
    mass2.getInverseMass().should.closeTo(1.273, 1.0e-3);
    mass2.getInverseInertia().should.closeTo(16.297, 1.0e-3);
    mass2.getCenter().x.should.closeTo(0.0, 1.0e-3);
    mass2.getCenter().y.should.closeTo(0.0, 1.0e-3);
    mass2.getType().should.equal(MassType.NORMAL);

    const mass3 = e2.createMass(0.0);
    mass3.getMass().should.closeTo(0.000, 1.0e-3);
    mass3.getInertia().should.closeTo(0.000, 1.0e-3);
    mass3.getInverseMass().should.closeTo(0.000, 1.0e-3);
    mass3.getInverseInertia().should.closeTo(0.000, 1.0e-3);
    mass3.getCenter().x.should.closeTo(0.000, 1.0e-3);
    mass3.getCenter().y.should.closeTo(0.000, 1.0e-3);
    mass3.getType().should.equal(MassType.INFINITE);
  });

  it('getArea', () => {
    const e = new Ellipse(1.0, 0.5);
    e.getArea().should.closeTo(0.392, 1.0e-3);

    const e2 = new Ellipse(0.5, 1.0);
    e2.getArea().should.closeTo(0.392, 1.0e-3);
  });

  it('getRotation', () => {
    const e = new Ellipse(1.0, 0.5);
    e.getRotationAngle().should.equal(0.0);
    e.getRotation().cost.should.equal(1.0);
    e.getRotation().sint.should.equal(0.0);

    e.rotate(Math.PI / 6);
    e.getRotationAngle().should.closeTo(Math.PI / 6, 1.0e-3);
    e.getRotation().cost.should.be.closeTo(0.866, 1.0e-3);
    e.getRotation().sint.should.be.closeTo(0.500, 1.0e-3);

    e.rotate(Math.PI / 6);
    e.getRotationAngle().should.closeTo(Math.PI / 3, 1.0e-3);
    e.getRotation().cost.should.be.closeTo(0.500, 1.0e-3);
    e.getRotation().sint.should.be.closeTo(0.866, 1.0e-3);

    e.rotate(Math.PI / 6);
    e.getRotationAngle().should.closeTo(Math.PI / 2, 1.0e-3);
    e.getRotation().cost.should.be.closeTo(0.000, 1.0e-3);
    e.getRotation().sint.should.be.closeTo(1.000, 1.0e-3);
  });
});