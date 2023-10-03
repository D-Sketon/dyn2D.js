'use strict';

require('chai').should();

describe('Slice', () => {

  const Slice = require('../../dist/geometry/Slice').Slice;
  const Transform = require('../../dist/geometry/Transform').Transform;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const MassType = require('../../dist/geometry/MassType').MassType;
  const Epsilon = require('../../dist/Epsilon').Epsilon;
  const IDENTITY = new Transform();

  it('createZeroRadius', () => {
    try {
      new Slice(0.0, 1.0);
    } catch (e) {
      e.message.should.equal('Slice: Radius must be positive.');
    }
  });

  it('createNegativeRadius', () => {
    try {
      new Slice(-1.0, 1.0);
    } catch (e) {
      e.message.should.equal('Slice: Radius must be positive.');
    }
  });

  it('createZeroTheta', () => {
    try {
      new Slice(1.0, 0.0);
    } catch (e) {
      e.message.should.equal('Slice: Theta must be positive.');
    }
  });

  it('createNegativeTheta', () => {
    try {
      new Slice(1.0, -1.0);
    } catch (e) {
      e.message.should.equal('Slice: Theta must be positive.');
    }
  });

  it('createSuccess', () => {
    const slice = new Slice(1.0, 50 / 180 * Math.PI);
    slice.getCircleCenter().x.should.equal(0.0);
    slice.getCircleCenter().y.should.equal(0.0);
    slice.toString().should.not.equal(null);
  });

  it('contains', () => {
    const e = new Slice(1.0, 50 / 180 * Math.PI);
    const t = new Transform();
    const p = new Vector2(0.5, -0.3);

    e.contains(p, t).should.equal(false);
    e.contains(p, t, false).should.equal(false);

    t.translate(-0.25, 0.0);

    e.contains(p, t).should.equal(true);
    e.contains(p, t, false).should.equal(true);

    p.set(0.75, 0.0);
    e.contains(p, t).should.equal(true);
    e.contains(p, t, false).should.equal(false);
  });

  it('project', () => {
    const e = new Slice(1.0, 50 / 180 * Math.PI);
    const t = new Transform();
    const x = new Vector2(1.0, 0.0);
    const y = new Vector2(0.0, 1.0);

    t.translate(1.0, 0.5);

    const i = e.project(x, t);
    i.min.should.equal(1.0);
    i.max.should.equal(2.0);

    t.rotate(30 / 180 * Math.PI, t.getTransformed(e.getCenter()));

    const j = e.project(y, t);
    j.min.should.closeTo(0.177, 1.0e-3);
    j.max.should.closeTo(0.996, 1.0e-3);

    e.translate(1.0, 0.5);
    e.rotateAboutCenter(30 / 180 * Math.PI);

    const k = e.project(y, IDENTITY);
    k.min.should.closeTo(0.177, 1.0e-3);
    k.max.should.closeTo(0.996, 1.0e-3);

    t.identity();
    t.translate(0.0, 1.0);
    const l = e.project(y, t);
    l.min.should.closeTo(1.177, 1.0e-3);
    l.max.should.closeTo(1.996, 1.0e-3);
  });

  it('getFarthest', () => {
    const e = new Slice(1.0, 50 / 180 * Math.PI);
    const t = new Transform();
    const x = new Vector2(1.0, 0.0);
    const y = new Vector2(0.0, 1.0);

    t.translate(1.0, 0.5);

    const p = e.getFarthestPoint(x, t);
    p.x.should.equal(2.0);
    p.y.should.equal(0.5);

    t.rotate(30 / 180 * Math.PI, 1.0, 0.5);

    const q = e.getFarthestPoint(y, t);
    q.x.should.closeTo(1.573, 1.0e-3);
    q.y.should.closeTo(1.319, 1.0e-3);

    e.translate(1.0, 0.5);
    e.rotate(30 / 180 * Math.PI, 1.0, 0.5);

    const r = e.getFarthestPoint(y, IDENTITY);
    r.x.should.closeTo(1.573, 1.0e-3);
    r.y.should.closeTo(1.319, 1.0e-3);

    t.identity();
    t.translate(0.0, 1.0);
    const s = e.getFarthestPoint(y, t);
    s.x.should.closeTo(1.573, 1.0e-3);
    s.y.should.closeTo(2.319, 1.0e-3);
  });

  it('getAxes', () => {
    const e = new Slice(1.0, 50 / 180 * Math.PI);
    const foci = [
      new Vector2(2.0, -0.5),
      new Vector2(1.0, 3.0)
    ];
    const axes = e.getAxes(foci, IDENTITY);
    axes.length.should.equal(4);
    const axes2 = e.getAxes(null, IDENTITY);
    axes2[0].x.should.closeTo(-0.422, 1.0e-3);
    axes2[0].y.should.closeTo(0.906, 1.0e-3);
    axes2[1].x.should.closeTo(-0.422, 1.0e-3);
    axes2[1].y.should.closeTo(-0.906, 1.0e-3);
  });

  it('getFoci', () => {
    const e = new Slice(1.0, 50 / 180 * Math.PI);
    const foci = e.getFoci(IDENTITY);
    foci.length.should.equal(1);
    foci[0].x.should.closeTo(0.000, 1.0e-3);
    foci[0].y.should.closeTo(0.000, 1.0e-3);
  });

  it('rotate', () => {
    const e = new Slice(1.0, 50 / 180 * Math.PI);
    e.translate(1.0, 1.0);
    e.rotateAboutCenter(30 / 180 * Math.PI);
    e.center.x.should.closeTo(1.645, 1.0e-3);
    e.center.y.should.closeTo(1.000, 1.0e-3);

    e.rotate(90 / 180 * Math.PI);
    e.center.x.should.closeTo(-1.000, 1.0e-3);
    e.center.y.should.closeTo(1.645, 1.0e-3);
    e.translate(e.center.getNegative());

    e.rotate(90 / 180 * Math.PI, 1.0, -1.0);
    e.center.x.should.closeTo(0.000, 1.0e-3);
    e.center.y.should.closeTo(-2.000, 1.0e-3);
  });

  it('translate', () => {
    const e = new Slice(1.0, 50 / 180 * Math.PI);
    e.translate(1.0, -0.5);
    e.center.x.should.closeTo(1.645, 1.0e-3);
    e.center.y.should.closeTo(-0.500, 1.0e-3);
  });

  it('createAABB', () => {
    const e = new Slice(1.0, 50 / 180 * Math.PI);

    let aabb = e.createAABB(IDENTITY);
    aabb.getMinX().should.closeTo(0.000, 1.0e-3);
    aabb.getMinY().should.closeTo(-0.422, 1.0e-3);
    aabb.getMaxX().should.closeTo(1.000, 1.0e-3);
    aabb.getMaxY().should.closeTo(0.422, 1.0e-3);

    aabb = e.createAABB();
    aabb.getMinX().should.closeTo(0.000, 1.0e-3);
    aabb.getMinY().should.closeTo(-0.422, 1.0e-3);
    aabb.getMaxX().should.closeTo(1.000, 1.0e-3);
    aabb.getMaxY().should.closeTo(0.422, 1.0e-3);

    const tx = new Transform();
    tx.rotate(30 / 180 * Math.PI);
    tx.translate(1.0, 2.0);

    aabb = e.createAABB(tx);
    aabb.getMinX().should.closeTo(1.000, 1.0e-3);
    aabb.getMinY().should.closeTo(2.000, 1.0e-3);
    aabb.getMaxX().should.closeTo(1.996, 1.0e-3);
    aabb.getMaxY().should.closeTo(2.819, 1.0e-3);
  });

  it('sliceRadius', () => {
    const e = new Slice(1.0, 50 / 180 * Math.PI);
    e.getSliceRadius().should.closeTo(1.000, 1.0e-3);
    (Math.abs(1.0 - e.getRadius()) < Epsilon.E).should.be.false;
    (Math.abs(e.getSliceRadius() - e.getRadius()) < Epsilon.E).should.be.false;
  });

  it('createMass', () => {
    const s = new Slice(0.5, 30 / 180 * Math.PI);
    const mass = s.createMass(1.0);
    mass.getMass().should.closeTo(0.065, 1.0e-3);
    mass.getInertia().should.closeTo(0.001, 1.0e-3);
    mass.getInverseMass().should.closeTo(15.278, 1.0e-3);
    mass.getInverseInertia().should.closeTo(931.395, 1.0e-3);
    mass.getCenter().x.should.closeTo(0.329, 1.0e-3);
    mass.getCenter().y.should.closeTo(0.0, 1.0e-3);
    mass.getType().should.equal(MassType.NORMAL);

    const mass2 = s.createMass(2.0);
    mass2.getMass().should.closeTo(0.130, 1.0e-3);
    mass2.getInertia().should.closeTo(0.002, 1.0e-3);
    mass2.getInverseMass().should.closeTo(7.639, 1.0e-3);
    mass2.getInverseInertia().should.closeTo(465.697, 1.0e-3);
    mass2.getCenter().x.should.closeTo(0.329, 1.0e-3);
    mass2.getCenter().y.should.closeTo(0.0, 1.0e-3);
    mass2.getType().should.equal(MassType.NORMAL);

    const mass3 = s.createMass(0.0);
    mass3.getMass().should.closeTo(0.000, 1.0e-3);
    mass3.getInertia().should.closeTo(0.000, 1.0e-3);
    mass3.getInverseMass().should.closeTo(0.000, 1.0e-3);
    mass3.getInverseInertia().should.closeTo(0.000, 1.0e-3);
    mass3.getCenter().x.should.closeTo(0.329, 1.0e-3);
    mass3.getCenter().y.should.closeTo(0.000, 1.0e-3);
    mass3.getType().should.equal(MassType.INFINITE);
  });

  it('getArea', () => {
    const s = new Slice(0.5, 30 / 180 * Math.PI);
    s.getArea().should.closeTo(0.065, 1.0e-3);
  });

  it('getRadiusAtPoint', () => {
    const s = new Slice(0.5, 30 / 180 * Math.PI);
    s.getRadius(s.getCenter()).should.closeTo(0.329, 1.0e-3);
    s.getRadius(new Vector2(0.0, 0.0)).should.closeTo(0.5, 1.0e-3);
  });

  it('getRotation', () => {
    const s = new Slice(0.5, 30 / 180 * Math.PI);
    s.getRotation().cost.should.closeTo(1.0, 1.0e-3);
    s.getRotation().sint.should.closeTo(0.0, 1.0e-3);
    s.getRotationAngle().should.closeTo(0.0, 1.0e-3);

    s.rotate(30 / 180 * Math.PI);
    s.getRotation().cost.should.closeTo(0.866, 1.0e-3);
    s.getRotation().sint.should.closeTo(0.499, 1.0e-3);
    s.getRotationAngle().should.closeTo(30 / 180 * Math.PI, 1.0e-3);
  });
});