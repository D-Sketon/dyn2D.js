'use strict';

require('chai').should();

describe('Capsule', () => {
  const Capsule = require('../../dist/geometry/Capsule').Capsule;
  const Transform = require('../../dist/geometry/Transform').Transform;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const MassType = require('../../dist/geometry/MassType').MassType;
  const IDENTITY = new Transform();

  it('createZeroWidth', () => {
    try {
      new Capsule(0.0, 1.0);
    } catch (e) {
      e.message.should.equal('Capsule: Width must be positive.');
    }
  });

  it('createNegativeWidth', () => {
    try {
      new Capsule(-1.0, 1.0);
    } catch (e) {
      e.message.should.equal('Capsule: Width must be positive.');
    }
  });

  it('createZeroHeight', () => {
    try {
      new Capsule(1.0, 0.0);
    } catch (e) {
      e.message.should.equal('Capsule: Height must be positive.');
    }
  });

  it('createNegativeHeight', () => {
    try {
      new Capsule(1.0, -1.0);
    } catch (e) {
      e.message.should.equal('Capsule: Height must be positive.');
    }
  });

  it('createCircle', () => {
    try {
      new Capsule(1.0, 1.0);
    } catch (e) {
      e.message.should.equal('Capsule: Width and height must be different.');
    }
  });

  it('createSuccessHorizontal', () => {
    const cap = new Capsule(2.0, 1.0);
    const x = cap.localXAxis;
    x.x.should.equal(1.0);
    x.y.should.equal(0.0);

    cap.getLength().should.equal(2.0);
    cap.getCapRadius().should.equal(0.5);
    cap.toString().should.equal('Capsule[length=2, capRadius=0.5]');
  });

  it('createSuccessVertical', () => {
    const cap = new Capsule(1.0, 2.0);
    const x = cap.localXAxis;
    x.x.should.equal(0.0);
    x.y.should.equal(1.0);

    cap.getLength().should.equal(2.0);
    cap.getCapRadius().should.equal(0.5);
    cap.toString().should.equal('Capsule[length=2, capRadius=0.5]');
  });

  it('contains', () => {
    const e = new Capsule(2.0, 1.0);
    const t = new Transform();
    const p = new Vector2(0.8, -0.45);

    e.contains(p, t).should.equal(false);
    e.contains(p, t, false).should.equal(false);

    t.translate(0.5, 0.0);

    e.contains(p, t).should.equal(true);
    e.contains(p, t, false).should.equal(true);

    p.set(1.5, 0.0);
    e.contains(p, t).should.equal(true);
    e.contains(p, t, false).should.equal(false);
    p.set(0.75, 0.5);
    e.contains(p, t).should.equal(true);
    e.contains(p, t, false).should.equal(false);
  });

  it('project', () => {
    const e = new Capsule(2.0, 1.0);
    const t = new Transform();
    const x = new Vector2(1.0, 0.0);
    const y = new Vector2(0.0, -1.0);

    t.translate(1.0, 0.5);

    const i = e.project(x, t);
    i.min.should.equal(0.0);
    i.max.should.equal(2.0);

    t.rotate(Math.PI / 6.0, 1.0, 0.5);

    const j = e.project(y, t);
    j.min.should.equal(-1.25);
    j.max.should.equal(0.25);

    e.translate(1.0, 0.5);
    e.rotate(Math.PI / 6.0, 1.0, 0.5);

    const k = e.project(y, IDENTITY);
    k.min.should.equal(-1.25);
    k.max.should.equal(0.25);

    t.identity();
    t.translate(0.0, 1.0);
    const l = e.project(y, t);
    l.min.should.equal(-2.25);
    l.max.should.equal(-0.75);
  });

  it('getFarthest', () => {
    const e = new Capsule(2.0, 1.0);
    const t = new Transform();
    const x = new Vector2(1.0, 0.0);
    const y = new Vector2(0.0, -1.0);

    t.translate(1.0, 0.5);

    const p = e.getFarthestPoint(x, t);
    p.x.should.equal(2.0);
    p.y.should.equal(0.5);

    t.rotate(Math.PI / 6.0, 1.0, 0.5);

    const q = e.getFarthestPoint(y, t);
    q.x.should.closeTo(0.566, 1.0e-3);
    q.y.should.closeTo(-0.25, 1.0e-3);

    e.translate(1.0, 0.5);
    e.rotate(Math.PI / 6.0, 1.0, 0.5);

    const r = e.getFarthestPoint(y, IDENTITY);
    r.x.should.closeTo(0.566, 1.0e-3);
    r.y.should.closeTo(-0.25, 1.0e-3);

    t.identity();
    t.translate(0.0, 1.0);
    const s = e.getFarthestPoint(y, t);
    s.x.should.closeTo(0.566, 1.0e-3);
    s.y.should.closeTo(0.75, 1.0e-3);
  });

  it('getAxes', () => {
    const e = new Capsule(1.0, 0.5);
    const foci = [
      new Vector2(2.0, -0.5),
      new Vector2(1.0, 3.0)
    ];
    const axes = e.getAxes(foci, IDENTITY);
    axes.length.should.equal(4);
    const axes2 = e.getAxes(null, IDENTITY);
    axes2[0].x.should.closeTo(1.0, 1.0e-3);
    axes2[0].y.should.closeTo(0.0, 1.0e-3);
    axes2[1].x.should.closeTo(0.0, 1.0e-3);
    axes2[1].y.should.closeTo(1.0, 1.0e-3);
  });

  it('getFoci', () => {
    const e = new Capsule(1.0, 0.5);
    const foci = e.getFoci(IDENTITY);
    foci.length.should.equal(2);
    foci[0].x.should.closeTo(-0.250, 1.0e-3);
    foci[0].y.should.closeTo(0.000, 1.0e-3);
    foci[1].x.should.closeTo(0.250, 1.0e-3);
    foci[1].y.should.closeTo(0.000, 1.0e-3);
  });

  it('rotate', () => {
    const e = new Capsule(1.0, 0.5);
    e.translate(1.0, 1.0);
    e.rotateAboutCenter(Math.PI / 6.0);
    e.center.x.should.closeTo(1.0, 1.0e-3);
    e.center.y.should.closeTo(1.0, 1.0e-3);

    e.rotate(Math.PI / 2.0);
    e.center.x.should.closeTo(-1.0, 1.0e-3);
    e.center.y.should.closeTo(1.0, 1.0e-3);
    e.translate(e.center.getNegative());

    e.rotate(Math.PI / 2.0, 1.0, -1.0);
    e.center.x.should.closeTo(0.0, 1.0e-3);
    e.center.y.should.closeTo(-2.0, 1.0e-3);
  });

  it('translate', () => {
    const e = new Capsule(1.0, 0.5);
    e.translate(1.0, -0.5);
    e.center.x.should.closeTo(1.0, 1.0e-3);
    e.center.y.should.closeTo(-0.5, 1.0e-3);
  });

  it('createAABB', () => {
    const e = new Capsule(1.0, 0.5);

    let aabb = e.createAABB(IDENTITY);
    aabb.getMinX().should.closeTo(-0.500, 1.0e-3);
    aabb.getMinY().should.closeTo(-0.250, 1.0e-3);
    aabb.getMaxX().should.closeTo(0.500, 1.0e-3);
    aabb.getMaxY().should.closeTo(0.250, 1.0e-3);

    aabb = e.createAABB();
    aabb.getMinX().should.closeTo(-0.500, 1.0e-3);
    aabb.getMinY().should.closeTo(-0.250, 1.0e-3);
    aabb.getMaxX().should.closeTo(0.500, 1.0e-3);
    aabb.getMaxY().should.closeTo(0.250, 1.0e-3);

    const tx = new Transform();
    tx.rotate(Math.PI / 6.0);
    tx.translate(1.0, 2.0);

    aabb = e.createAABB(tx);
    aabb.getMinX().should.closeTo(0.533, 1.0e-3);
    aabb.getMinY().should.closeTo(1.625, 1.0e-3);
    aabb.getMaxX().should.closeTo(1.466, 1.0e-3);
    aabb.getMaxY().should.closeTo(2.375, 1.0e-3);
  });

  it('createMass', () => {
    const e = new Capsule(1.0, 0.5);
    const mass = e.createMass(1.0);

    mass.getMass().should.closeTo(0.446, 1.0e-3);
    mass.getInertia().should.closeTo(0.028, 1.0e-3);
    mass.getInverseMass().should.closeTo(2.240, 1.0e-3);
    mass.getInverseInertia().should.closeTo(34.692, 1.0e-3);
    mass.getCenter().x.should.closeTo(0.0, 1.0e-3);
    mass.getCenter().y.should.closeTo(0.0, 1.0e-3);
    mass.getType().should.equal(MassType.NORMAL);

    const e2 = new Capsule(0.5, 1.0);
    const mass2 = e2.createMass(2.0);
    mass2.getMass().should.closeTo(0.892, 1.0e-3);
    mass2.getInertia().should.closeTo(0.057, 1.0e-3);
    mass2.getInverseMass().should.closeTo(1.120, 1.0e-3);
    mass2.getInverseInertia().should.closeTo(17.346, 1.0e-3);
    mass2.getCenter().x.should.closeTo(0.0, 1.0e-3);
    mass2.getCenter().y.should.closeTo(0.0, 1.0e-3);
    mass2.getType().should.equal(MassType.NORMAL);

    const mass3 = e2.createMass(0.0);
    mass3.getMass().should.closeTo(0.0, 1.0e-3);
    mass3.getInertia().should.closeTo(0.0, 1.0e-3);
    mass3.getInverseMass().should.closeTo(0.0, 1.0e-3);
    mass3.getInverseInertia().should.closeTo(0.0, 1.0e-3);
    mass3.getCenter().x.should.closeTo(0.0, 1.0e-3);
    mass3.getCenter().y.should.closeTo(0.0, 1.0e-3);
    mass3.getType().should.equal(MassType.INFINITE);
  });

  it('getArea', () => {
    const e = new Capsule(1.0, 0.5);
    e.getArea().should.closeTo(0.446, 1.0e-3);

    const e2 = new Capsule(0.5, 1.0);
    e2.getArea().should.closeTo(0.446, 1.0e-3);
  });

  it('getRadius', () => {
    const e = new Capsule(1.0, 0.5);
    e.getRadius().should.closeTo(0.5, 1.0e-3);
    e.getRadius(new Vector2(-1.0, 0.0)).should.closeTo(1.5, 1.0e-3);
    e.getRadius(new Vector2(-3.0, 4.0)).should.closeTo(5.403, 1.0e-3);

    const e2 = new Capsule(1.0, 1.1);
    e2.getRadius().should.closeTo(0.55, 1.0e-3);
    e2.getRadius(new Vector2(0.0, -1.0)).should.closeTo(1.55, 1.0e-3);
    e2.getRadius(new Vector2(-1.0, 0.0)).should.closeTo(1.501, 1.0e-3);
  });

  it('getRotation', () => {
    const e = new Capsule(1.0, 0.5);
    e.getRotationAngle().should.closeTo(0.0, 1.0e-3);
    e.getRotation().cost.should.closeTo(1.0, 1.0e-3);
    e.getRotation().sint.should.closeTo(0.0, 1.0e-3);

    const e2 = new Capsule(1.0, 1.1);
    e2.getRotationAngle().should.closeTo(Math.PI * 0.5, 1.0e-3);
    e2.getRotation().cost.should.closeTo(0.0, 1.0e-3);
    e2.getRotation().sint.should.closeTo(1.0, 1.0e-3);

    e2.rotate(Math.PI / 6.0);
    e2.getRotationAngle().should.closeTo(Math.PI * 0.5 + Math.PI / 6.0, 1.0e-3);
    e2.getRotation().cost.should.closeTo(Math.cos(Math.PI / 180 * 120), 1.0e-3);
    e2.getRotation().sint.should.closeTo(Math.sin(Math.PI / 180 * 120), 1.0e-3);

    e2.rotate(-Math.PI / 3.0);
    e2.getRotationAngle().should.closeTo(Math.PI * 0.5 - Math.PI / 6.0, 1.0e-3);
    e2.getRotation().cost.should.closeTo(Math.cos(Math.PI / 3.0), 1.0e-3);
    e2.getRotation().sint.should.closeTo(Math.sin(Math.PI / 3.0), 1.0e-3);
  });
});