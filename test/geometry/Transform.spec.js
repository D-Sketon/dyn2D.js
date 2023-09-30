'use strict';



require('chai').should();

describe('Transform', () => {
  const Transform = require('../../dist/geometry/Transform').Transform;
  const Rotation = require('../../dist/geometry/Rotation').Rotation;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;

  it('identity', () => {
    const t = new Transform();
    t.translate(5, 2);
    t.identity();

    t.x.should.equal(0);
    t.y.should.equal(0);
  });

  it('translate', () => {
    const t = new Transform();
    t.translate(2, -1);
    t.translate(4, 4);
    t.getTranslationX().should.equal(6);
    t.getTranslationY().should.equal(3);
  });

  it('rotate', () => {
    const t = new Transform();

    t.rotate(30 * Math.PI / 180);
    t.getRotationAngle().should.closeTo(30 * Math.PI / 180, 1.0e-9);

    t.rotate(Rotation.ofDegrees(50));
    t.getRotation().toRadians().should.closeTo(80 * Math.PI / 180, 1.0e-9);
    t.getRotationAngle().should.closeTo(80 * Math.PI / 180, 1.0e-9);

    t.identity();

    t.translate(5, 5);
    t.rotate(90 / 180 * Math.PI);

    let v = t.getTranslation();
    v.x.should.closeTo(-5, 1.0e-9);
    v.y.should.closeTo(5, 1.0e-9);

    t.rotate(Rotation.ofDegrees(90));
    v = t.getTranslation();
    v.x.should.closeTo(-5, 1.0e-9);
    v.y.should.closeTo(-5, 1.0e-9);

    t.rotate(35 / 180 * Math.PI, -5, -5);
    v = t.getTranslation();
    v.x.should.closeTo(-5, 1.0e-9);
    v.y.should.closeTo(-5, 1.0e-9);

    t.rotate(Rotation.ofDegrees(45), -1, -1);
    v = t.getTranslation();
    v.x.should.closeTo(-1, 1.0e-9);
    v.y.should.closeTo(-6.656, 1.0e-3);
  });

  it('copy', () => {
    const t = new Transform();
    t.translate(2, -1);
    t.rotate(20 * Math.PI / 180, -2, 6);
    const tc = t.copy();

    tc.cost.should.equal(t.cost);
    tc.sint.should.equal(t.sint);
    tc.x.should.equal(t.x);
    tc.y.should.equal(t.y);
  });

  it('getTransformed', () => {
    const t = new Transform();
    t.translate(2, 1);
    t.rotate(25 / 180 * Math.PI, 1, -1);

    const v = new Vector2(1, 0);
    let vt = t.getTransformed(v);
    vt.x.should.closeTo(1.967, 1.0e-3);
    vt.y.should.closeTo(1.657, 1.0e-3);
    t.getTransformedX(v).should.closeTo(1.967, 1.0e-3);
    t.getTransformedY(v).should.closeTo(1.657, 1.0e-3);

    vt.zero();
    t.getTransformed(v, vt);
    vt.x.should.closeTo(1.967, 1.0e-3);
    vt.y.should.closeTo(1.657, 1.0e-3);
    t.getTransformedX(v).should.closeTo(1.967, 1.0e-3);
    t.getTransformedY(v).should.closeTo(1.657, 1.0e-3);

    vt = t.getInverseTransformed(vt);
    vt.x.should.closeTo(1, 1.0e-9);
    vt.y.should.closeTo(0, 1.0e-9);

    const v2 = t.getTransformed(v);
    t.getInverseTransformed(v2, vt);
    vt.x.should.closeTo(1, 1.0e-9);
    vt.y.should.closeTo(0, 1.0e-9);

    vt = t.getTransformedR(v);
    vt.x.should.closeTo(0.906, 1.0e-3);
    vt.y.should.closeTo(0.422, 1.0e-3);

    vt.zero();
    t.getTransformedR(v, vt);
    vt.x.should.closeTo(0.906, 1.0e-3);
    vt.y.should.closeTo(0.422, 1.0e-3);

    vt = t.getInverseTransformedR(v);
    vt = t.getTransformedR(vt);
    vt.equals(v).should.be.true;

    t.getInverseTransformedR(v, vt);
    vt = t.getTransformedR(vt);
    vt.equals(v).should.be.true;
  });

  it('transform', () => {
    const t = new Transform();
    t.translate(2, 1);
    t.rotate(25 / 180 * Math.PI, 1, -1);

    const v = new Vector2(1, 0);
    let v2 = v.copy();
    t.transformX(v2);
    v2.x.should.closeTo(1.967, 1.0e-3);
    v2.y.should.closeTo(0, 1.0e-3);

    v2 = v.copy();
    t.transformY(v2);
    v2.x.should.closeTo(1, 1.0e-3);
    v2.y.should.closeTo(1.657, 1.0e-3);

    t.transform(v);
    v.x.should.closeTo(1.967, 1.0e-3);
    v.y.should.closeTo(1.657, 1.0e-3);

    t.inverseTransform(v);
    v.x.should.closeTo(1, 1.0e-3);
    v.y.should.closeTo(0, 1.0e-3);

    t.transformR(v);
    v.x.should.closeTo(0.906, 1.0e-3);
    v.y.should.closeTo(0.422, 1.0e-3);

    t.inverseTransformR(v);
    t.transformR(v);
    v.equals(v).should.be.true;
  });

  it('setTransform', () => {
    const tx = new Transform();
    tx.rotate(30 / 180 * Math.PI);
    tx.translate(2, 0.5);
    const tx2 = new Transform();
    tx2.set(tx);

    (tx2 === tx).should.be.false;
    tx2.cost.should.equal(tx.cost);
    tx2.sint.should.equal(tx.sint);
    tx2.x.should.equal(tx.x);
    tx2.y.should.equal(tx.y);
  });

  it('setTranslation', () => {
    const tx = new Transform();
    tx.translate(1, 2);
    tx.rotate(45 / 180 * Math.PI);
    tx.setTranslation(0, 0);

    tx.x.should.equal(0);
    tx.y.should.equal(0);
    tx.getRotationAngle().should.closeTo(45 / 180 * Math.PI, 1.0e-9);

    tx.setTranslationX(2);
    tx.x.should.equal(2);
    tx.y.should.equal(0);
    tx.getRotationAngle().should.closeTo(45 / 180 * Math.PI, 1.0e-9);

    tx.setTranslationY(3);
    tx.x.should.equal(2);
    tx.y.should.equal(3);
    tx.getRotationAngle().should.closeTo(45 / 180 * Math.PI, 1.0e-9);

    tx.setTranslation(new Vector2(5, -7));
    tx.x.should.equal(5);
    tx.y.should.equal(-7);
    tx.getRotationAngle().should.closeTo(45 / 180 * Math.PI, 1.0e-9);
  });

  it('setRotation', () => {
    const tx = new Transform();
    tx.rotate(45 / 180 * Math.PI);
    tx.translate(1, 0);

    tx.setRotation(30 / 180 * Math.PI);
    tx.getRotationAngle().should.closeTo(30 / 180 * Math.PI, 1.0e-9);
    tx.x.should.equal(1);
    tx.y.should.equal(0);

    tx.setRotation(Rotation.ofDegrees(135));
    tx.getRotationAngle().should.closeTo(135 / 180 * Math.PI, 1.0e-9);
    tx.x.should.equal(1);
    tx.y.should.equal(0);
  });

  it('lerp', () => {
    const p = new Vector2();
    const start = new Transform();
    start.translate(1.0, 0.0);
    start.rotate(45 / 180 * Math.PI);

    const end = new Transform();
    end.set(start);
    end.translate(3.0, 2.0);
    end.rotate(20 / 180 * Math.PI);

    const s = start.getTransformed(p);
    const e = end.getTransformed(p);

    const alpha = 0.5;

    const mid = new Transform();
    start.lerp(end, alpha, mid);
    start.lerp(end, alpha);

    const m = mid.getTransformed(p);
    m.x.should.closeTo((s.x + e.x) * alpha, 1.0e-9);
    m.y.should.closeTo((s.y + e.y) * alpha, 1.0e-9);

    const m2 = start.getTransformed(p);
    m2.x.should.closeTo((s.x + e.x) * alpha, 1.0e-9);
    m2.y.should.closeTo((s.y + e.y) * alpha, 1.0e-9);

    start.identity();
    start.rotate(174 / 180 * Math.PI);

    end.identity();
    end.rotate(-168 / 180 * Math.PI);

    const l = start.lerped(end, alpha);
    l.getRotationAngle().should.closeTo(-3.089, 1.0e-3);

    start.identity();
    start.rotate(354 / 180 * Math.PI);

    end.identity();
    end.rotate(2 / 180 * Math.PI);

    const l2 = start.lerped(end, alpha);
    l2.getRotationAngle().should.closeTo(-0.034, 1.0e-3);

    start.identity();
    start.translate(1.0, 0.0);
    start.lerp(new Vector2(1.0, 0.0), 90 / 180 * Math.PI, 0.5);
    start.getRotationAngle().should.closeTo(45 / 180 * Math.PI, 1.0e-3);
    start.getTranslationX().should.closeTo(1.5, 1.0e-3);
    start.getTranslationY().should.closeTo(0.0, 1.0e-3);
  });

  it('values', () => {
    const t = new Transform();
    t.translate(2.0, -1.0);

    const values = t.getValues();
    values[0].should.equal(1.0);
    values[1].should.equal(-0.0);
    values[2].should.equal(2.0);
    values[3].should.equal(0.0);
    values[4].should.equal(1.0);
    values[5].should.equal(-1.0);
  });

  it('getTranslationRotationTransform', () => {
    const t = new Transform();
    t.rotate(30 / 180 * Math.PI);
    t.translate(2.0, -1.0);

    const t2 = t.getTranslationTransform();
    t2.x.should.equal(2.0);
    t2.y.should.equal(-1.0);
    t2.getRotationAngle().should.closeTo(0.0, 1.0e-3);

    const t3 = t.getRotationTransform();
    t3.x.should.equal(0.0);
    t3.y.should.equal(0.0);
    t3.getRotationAngle().should.closeTo(30 / 180 * Math.PI, 1.0e-3);
  });
});