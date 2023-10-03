'use strict';

require('chai').should();

describe('Rectangle', () => { 
  const Rectangle = require('../../dist/geometry/Rectangle').Rectangle;
  const Transform = require('../../dist/geometry/Transform').Transform;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const MassType = require('../../dist/geometry/MassType').MassType;

  it('createInvalidWidth', () => {
    try {
      new Rectangle(-1.0, 3.0);
    } catch (e) {
      e.message.should.equal('Rectangle: Width must be non-negative.');
    }
  });

  it('createInvalidHeight', () => {
    try {
      new Rectangle(2.0, 0.0);
    } catch (e) {
      e.message.should.equal('Rectangle: Height must be non-negative.');
    }
  });

  it('createSuccess', () => {
    const r = new Rectangle(2.0, 2.0);
    r.center.x.should.equal(0.0);
    r.center.y.should.equal(0.0);
    r.vertices[0].x.should.equal(-1.0);
    r.vertices[0].y.should.equal(-1.0);
    r.vertices[1].x.should.equal(1.0);
    r.vertices[1].y.should.equal(-1.0);
    r.vertices[2].x.should.equal(1.0);
    r.vertices[2].y.should.equal(1.0);
    r.vertices[3].x.should.equal(-1.0);
    r.vertices[3].y.should.equal(1.0);
  });

  it('getAxes', () => {
    const r = new Rectangle(1.0, 1.0);
    const t = new Transform();
    const axes = r.getAxes(null, t);

    axes.length.should.equal(2);

    const ab = r.vertices[0].to(r.vertices[1]);
    const ad = r.vertices[0].to(r.vertices[3]);

    ab.dot(axes[1]).should.closeTo(0.0, 1.0e-3);
    ad.dot(axes[0]).should.closeTo(0.0, 1.0e-3);

    const pt = new Vector2(2.0, -1.0);
    const axes2 = r.getAxes([pt], t);

    axes2.length.should.equal(3);
    r.vertices[1].to(pt).cross(axes2[2]).should.closeTo(0.0, 1.0e-3);
  });

  it('contains', () => {
    const r = new Rectangle(1.0, 2.0);
    const t = new Transform();

    const pt = new Vector2(2.0, 0.5);

    r.contains(pt, t).should.equal(false);
    r.contains(pt, t, false).should.equal(false);

    t.translate(2.0, 0.0);
    t.rotate(Math.PI / 6.0, r.center);

    r.contains(pt, t).should.equal(true);
    r.contains(pt, t, false).should.equal(true);

    t.identity();
    pt.set(0.5, 0.5);

    r.contains(pt, t).should.equal(true);
    r.contains(pt, t, false).should.equal(false);
  });

  it('project', () => {
    const r = new Rectangle(2.0, 1.0);
    const t = new Transform();
    const axis = new Vector2(1.0, 0.0);
    const i = r.project(axis, t);
    i.min.should.equal(-1.0);
    i.max.should.equal(1.0);

    t.translate(1.0, 1.0);
    t.rotate(Math.PI / 6.0, t.getTransformed(r.center));

    const j = r.project(axis, t);
    j.min.should.closeTo(-0.116, 1.0e-3);
    j.max.should.closeTo(2.116, 1.0e-3);

    axis.set(0.0, 1.0);
    const k = r.project(axis, t);
    k.min.should.closeTo(0.066, 1.0e-3);
    k.max.should.closeTo(1.933, 1.0e-3);
  });

  it('getRotation', () => {
    const r = new Rectangle(1.0, 1.0);
    r.translate(1.0, 1.0);
    r.rotate(Math.PI / 6.0, r.center);

    r.getRotationAngle().should.closeTo(Math.PI / 6.0, 1.0e-3);

    const rt = r.getRotation();
    rt.toDegrees().should.closeTo(30, 1.0e-3);
  });

  it('createMass', () => {
    const r = new Rectangle(1.0, 1.0);
    const m = r.createMass(1.5);
    m.getMass().should.closeTo(1.5, 1.0e-3);
    m.getInertia().should.closeTo(0.25, 1.0e-3);

    const m2 = r.createMass(0.0);
    m2.getMass().should.closeTo(0.0, 1.0e-3);
    m2.getInertia().should.closeTo(0.0, 1.0e-3);
    m2.getInverseMass().should.closeTo(0.0, 1.0e-3);
    m2.getInverseInertia().should.closeTo(0.0, 1.0e-3);
    m2.getCenter().x.should.closeTo(0.0, 1.0e-3);
    m2.getCenter().y.should.closeTo(0.0, 1.0e-3);
    m2.getType().should.equal(MassType.INFINITE);
  });

  it('getArea', () => {
    const r = new Rectangle(1.0, 1.0);
    r.getArea().should.closeTo(1.0, 1.0e-3);

    const r2 = new Rectangle(2.5, 3.0);
    r2.getArea().should.closeTo(7.5, 1.0e-3);
  });

  it('computeAABB', () => {
    const r = new Rectangle(1.0, 1.0);
    const aabb = r.createAABB();
    aabb.maxX.should.closeTo(0.5, 1.0e-3);
    aabb.maxY.should.closeTo(0.5, 1.0e-3);
    aabb.minX.should.closeTo(-0.5, 1.0e-3);
    aabb.minY.should.closeTo(-0.5, 1.0e-3);

    r.rotate(Math.PI / 4.0);
    const aabb2 = r.createAABB();
    aabb2.maxX.should.closeTo(0.707, 1.0e-3);
    aabb2.maxY.should.closeTo(0.707, 1.0e-3);
    aabb2.minX.should.closeTo(-0.707, 1.0e-3);
    aabb2.minY.should.closeTo(-0.707, 1.0e-3);
  });
});