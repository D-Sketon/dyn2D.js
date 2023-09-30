'use strict';

require('chai').should();

describe('Rotation', () => {
  const Rotation = require('../../dist/geometry/Rotation').Rotation;
  const Transform = require('../../dist/geometry/Transform').Transform;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  it('create', () => {
    const r1 = new Rotation();
    r1.cost.should.equal(1.0);
    r1.sint.should.equal(0.0);
    r1.toString().should.be.a('string');

    const r2 = new Rotation(Math.PI);
    r2.cost.should.closeTo(-1.0, 1.0e-6);
    r2.sint.should.closeTo(0.0, 1.0e-6);

    const r3 = new Rotation(-1.0, 0.0);
    r3.cost.should.closeTo(-1.0, 1.0e-6);
    r3.sint.should.closeTo(0.0, 1.0e-6);

    const r4 = new Rotation(1.0);
    r4.cost.should.closeTo(Math.cos(1.0), 1.0e-6);
    r4.sint.should.closeTo(Math.sin(1.0), 1.0e-6);

    const r5 = new Rotation(r4);
    r5.cost.should.closeTo(Math.cos(1.0), 1.0e-6);
    r5.sint.should.closeTo(Math.sin(1.0), 1.0e-6);

    const r6 = Rotation.of(2.5);
    r6.cost.should.closeTo(Math.cos(2.5), 1.0e-6);
    r6.sint.should.closeTo(Math.sin(2.5), 1.0e-6);

    const v1 = new Vector2(5, -5);

    const r7 = Rotation.of(v1);
    r7.cost.should.closeTo(Math.cos(45 / 180 * Math.PI), 1.0e-6);
    r7.sint.should.closeTo(Math.sin(-45 / 180 * Math.PI), 1.0e-6);

    const t1 = new Transform();
    t1.setRotation(-1.0);
    t1.translate(-10, -20);

    const r8 = Rotation.of(t1);
    r8.cost.should.closeTo(Math.cos(-1.0), 1.0e-6);
    r8.sint.should.closeTo(Math.sin(-1.0), 1.0e-6);

    const r9 = Rotation.of(new Vector2());
    r9.cost.should.equal(1.0);
    r9.sint.should.equal(0.0);

    const r0 = Rotation.rotation0();
    r0.cost.should.closeTo(Math.cos(0), 1.0e-6);
    r0.sint.should.closeTo(Math.sin(0), 1.0e-6);

    const r90 = Rotation.rotation90();
    r90.cost.should.closeTo(Math.cos(90 / 180 * Math.PI), 1.0e-6);
    r90.sint.should.closeTo(Math.sin(90 / 180 * Math.PI), 1.0e-6);

    const r180 = Rotation.rotation180();
    r180.cost.should.closeTo(Math.cos(180 / 180 * Math.PI), 1.0e-6);
    r180.sint.should.closeTo(Math.sin(180 / 180 * Math.PI), 1.0e-6);

    const r270 = Rotation.rotation270();
    r270.cost.should.closeTo(Math.cos(270 / 180 * Math.PI), 1.0e-6);
    r270.sint.should.closeTo(Math.sin(270 / 180 * Math.PI), 1.0e-6);

    const r45 = Rotation.rotation45();
    r45.cost.should.closeTo(Math.cos(45 / 180 * Math.PI), 1.0e-6);
    r45.sint.should.closeTo(Math.sin(45 / 180 * Math.PI), 1.0e-6);

    const r135 = Rotation.rotation135();
    r135.cost.should.closeTo(Math.cos(135 / 180 * Math.PI), 1.0e-6);
    r135.sint.should.closeTo(Math.sin(135 / 180 * Math.PI), 1.0e-6);

    const r225 = Rotation.rotation225();
    r225.cost.should.closeTo(Math.cos(225 / 180 * Math.PI), 1.0e-6);
    r225.sint.should.closeTo(Math.sin(225 / 180 * Math.PI), 1.0e-6);

    const r315 = Rotation.rotation315();
    r315.cost.should.closeTo(Math.cos(315 / 180 * Math.PI), 1.0e-6);
    r315.sint.should.closeTo(Math.sin(315 / 180 * Math.PI), 1.0e-6);
  });

  it('testIsUnit', () => {
    for (let i = 0; i < 1000; i++) {
      const r = new Rotation(i / 180 * Math.PI);
      r.dot(r).should.closeTo(1.0, 1.0e-6);
    }
  });

  it('copy', () => {
    const r = new Rotation(1.0, 3.0);
    const rc = r.copy();

    r.should.not.equal(rc);
    r.cost.should.equal(rc.cost);
    r.sint.should.equal(rc.sint);
  });

  it('equals', () => {
    const r = new Rotation(2.0);

    r.equals(r).should.be.true;
    r.equals(r.copy()).should.be.true;
    r.equals(new Rotation(2.0)).should.be.true;

    r.equals(new Rotation(1.0)).should.be.false;
    r.equals(new Object()).should.be.false;
    r.equals(null).should.be.false;

    r.equals(r, 1.0e-4).should.be.true;
    const r2 = r.copy().rotate(5).rotate(-5);
    r.equals(r2, 1.0e-4).should.be.true;

    r.equals(new Rotation(1.0), 1.0e-4).should.be.false;

    r.equals(2.0).should.be.true;
    r.equals(2.0 + 1.0e-6, 1.0e-4).should.be.true;

    r.equals(1.0).should.be.false;
    r.equals(2.0 + 1.0e-2, 1.0e-4).should.be.false;
  });

  it('set', () => {
    const r = new Rotation(2.0);
    const r2 = new Rotation(3.0);
    r.set(r2);

    r.should.not.equal(r2);
    r.cost.should.closeTo(Math.cos(3.0), 1.0e-6);
    r.sint.should.closeTo(Math.sin(3.0), 1.0e-6);
    r2.cost.should.closeTo(r.cost, 1.0e-6);
    r2.sint.should.closeTo(r.sint, 1.0e-6);

    r.set(-1.0);
    r.cost.should.closeTo(Math.cos(-1.0), 1.0e-6);
    r.sint.should.closeTo(Math.sin(-1.0), 1.0e-6);

    r.setIdentity();
    r.cost.should.closeTo(1.0, 1.0e-6);
    r.sint.should.closeTo(0.0, 1.0e-6);
  });

  it('get', () => {
    const r = new Rotation(1.5);
    r.cost.should.closeTo(Math.cos(1.5), 1.0e-6);
    r.sint.should.closeTo(Math.sin(1.5), 1.0e-6);
  });

  it('toAngle', () => {
    const r = new Rotation(0.0, -1.0);

    r.toRadians().should.closeTo(-Math.PI / 2, 1.0e-6);
    r.toDegrees().should.closeTo(-90, 1.0e-6);

    r.rotate135();

    r.toRadians().should.closeTo(Math.PI / 4, 1.0e-6);
    r.toDegrees().should.closeTo(45, 1.0e-6);
  });

  it('toVector', () => {
    const r = new Rotation(Math.PI / 6);
    const v1 = r.toVector();
    const v2 = r.toVector(2.5);

    r.toRadians().should.closeTo(v1.getDirection(), 1.0e-6);
    r.toRadians().should.closeTo(v2.getDirection(), 1.0e-6);

    v1.getMagnitude().should.closeTo(1.0, 1.0e-6);
    v2.getMagnitude().should.closeTo(2.5, 1.0e-6);
  });

  it('dot', () => {
    const r1 = new Rotation(1.0, 0.0);
    const r2 = new Rotation(0.0, 1.0);
    const v = new Vector2(0.0, -5.0);

    r1.dot(r2).should.closeTo(0.0, 1.0e-6);
    r1.dot(r2.rotate90()).should.closeTo(-1.0, 1.0e-6);
    r1.dot(v).should.closeTo(0.0, 1.0e-6);

    r1.dot(r1).should.closeTo(1.0, 1.0e-6);
    r2.dot(r2).should.closeTo(1.0, 1.0e-6);
  });

  it('cross', () => {
    const r1 = new Rotation(1.0, 0.0);
    const r2 = new Rotation(0.0, 1.0);
    const v = new Vector2(-5.0, 0.0);

    r1.cross(r2).should.closeTo(1.0, 1.0e-6);
    r1.cross(r2.rotate90()).should.closeTo(0.0, 1.0e-6);
    r1.cross(v).should.closeTo(0.0, 1.0e-6);

    r1.cross(r1).should.closeTo(0.0, 1.0e-6);
    r2.cross(r2).should.closeTo(0.0, 1.0e-6);
  });

  it('isIdentity', () => {
    const r = new Rotation();

    r.isIdentity().should.be.true;
    r.isIdentity(1.0e-6).should.be.true;

    r.set(1.0);
    r.isIdentity().should.be.false;
    r.isIdentity(1.0e-6).should.be.false;

    r.set(1.0e-6);
    r.isIdentity().should.be.false;
    r.isIdentity(1.0e-4).should.be.true;
  });

  it('inverse', () => {
    const r1 = new Rotation(0.0);

    r1.inverse();
    r1.cost.should.closeTo(1.0, 1.0e-6);
    r1.sint.should.closeTo(0.0, 1.0e-6);

    const r2 = new Rotation(Math.PI / 2.0);
    const r3 = r2.copy();

    r2.inverse();
    r2.cost.should.closeTo(0.0, 1.0e-6);
    r2.sint.should.closeTo(-1.0, 1.0e-6);

    r2.inverse();
    r3.equals(r2).should.be.true;

    const temp = r2.getInversed();
    temp.cost.should.closeTo(0.0, 1.0e-6);
    temp.sint.should.closeTo(-1.0, 1.0e-6);

    r3.equals(r2).should.be.true;
  });

  it('rotate', () => {
    const r1 = new Rotation(0.0);

    r1.rotate(Math.PI / 2.0);
    r1.cost.should.closeTo(0.0, 1.0e-6);
    r1.sint.should.closeTo(1.0, 1.0e-6);

    r1.rotate(new Rotation(Math.PI / 2.0));
    r1.cost.should.closeTo(-1.0, 1.0e-6);
    r1.sint.should.closeTo(0.0, 1.0e-6);

    const r2 = new Rotation(Math.PI / 4.0);

    r2.rotate(Math.PI * 63.0 / 180.0);
    r2.cost.should.closeTo(-0.309, 1.0e-3);
    r2.sint.should.closeTo(0.951, 1.0e-3);

    r2.rotate(new Rotation(Math.PI * 29.0 / 180.0));
    r2.cost.should.closeTo(-0.731, 1.0e-3);
    r2.sint.should.closeTo(0.682, 1.0e-3);

    const r3 = new Rotation(Math.PI / 3.0);

    r3.cost.should.closeTo(0.500, 1.0e-3);
    r3.sint.should.closeTo(0.866, 1.0e-3);

    r3.rotate90();
    r3.cost.should.closeTo(-0.866, 1.0e-3);
    r3.sint.should.closeTo(0.500, 1.0e-3);

    r3.rotate180();
    r3.cost.should.closeTo(0.866, 1.0e-3);
    r3.sint.should.closeTo(-0.500, 1.0e-3);

    r3.rotate270();
    r3.cost.should.closeTo(-0.500, 1.0e-3);
    r3.sint.should.closeTo(-0.866, 1.0e-3);

    r3.rotate90();
    r3.cost.should.closeTo(0.866, 1.0e-3);
    r3.sint.should.closeTo(-0.500, 1.0e-3);

    r3.rotate45();
    r3.cost.should.closeTo(0.966, 1.0e-3);
    r3.sint.should.closeTo(0.259, 1.0e-3);

    r3.rotate45();
    r3.cost.should.closeTo(0.500, 1.0e-3);
    r3.sint.should.closeTo(0.866, 1.0e-3);

    r3.rotate135();
    r3.cost.should.closeTo(-0.966, 1.0e-3);
    r3.sint.should.closeTo(-0.259, 1.0e-3);

    r3.rotate225();
    r3.cost.should.closeTo(0.500, 1.0e-3);
    r3.sint.should.closeTo(0.866, 1.0e-3);

    r3.rotate315();
    r3.cost.should.closeTo(0.966, 1.0e-3);
    r3.sint.should.closeTo(0.259, 1.0e-3);
  });

  it('getRotated', () => {
    let temp;
    let r1 = new Rotation(0.0);

    temp = r1.getRotated(Math.PI / 2.0);
    temp.cost.should.closeTo(0.0, 1.0e-6);
    temp.sint.should.closeTo(1.0, 1.0e-6);

    temp = r1.getRotated(new Rotation(Math.PI));
    temp.cost.should.closeTo(-1.0, 1.0e-6);
    temp.sint.should.closeTo(0.0, 1.0e-6);

    let r2 = new Rotation(Math.PI / 4.0);

    temp = r2.getRotated(Math.PI * 63.0 / 180.0);
    temp.cost.should.closeTo(-0.309, 1.0e-3);
    temp.sint.should.closeTo(0.951, 1.0e-3);

    temp = r2.getRotated(new Rotation(Math.PI * 29.0 / 180.0));
    temp.cost.should.closeTo(0.276, 1.0e-3);
    temp.sint.should.closeTo(0.961, 1.0e-3);

    let r3 = new Rotation(Math.PI / 3.0);

    r3.cost.should.closeTo(0.500, 1.0e-3);
    r3.sint.should.closeTo(0.866, 1.0e-3);

    temp = r3.getRotated90();
    temp.cost.should.closeTo(-0.866, 1.0e-3);
    temp.sint.should.closeTo(0.500, 1.0e-3);

    temp = r3.getRotated180();
    temp.cost.should.closeTo(-0.500, 1.0e-3);
    temp.sint.should.closeTo(-0.866, 1.0e-3);

    temp = r3.getRotated270();
    temp.cost.should.closeTo(0.866, 1.0e-3);
    temp.sint.should.closeTo(-0.500, 1.0e-3);

    temp = r3.getRotated45();
    temp.cost.should.closeTo(-0.259, 1.0e-3);
    temp.sint.should.closeTo(0.966, 1.0e-3);

    temp = r3.getRotated135();
    temp.cost.should.closeTo(-0.966, 1.0e-3);
    temp.sint.should.closeTo(-0.259, 1.0e-3);

    temp = r3.getRotated225();
    temp.cost.should.closeTo(0.259, 1.0e-3);
    temp.sint.should.closeTo(-0.966, 1.0e-3);

    temp = r3.getRotated315();
    temp.cost.should.closeTo(0.966, 1.0e-3);
    temp.sint.should.closeTo(0.259, 1.0e-3);
  });

  it('compare', () => {
    const r1 = new Rotation(10 / 180 * Math.PI);
    const r2 = new Rotation(100 / 180 * Math.PI);
    const r3 = new Rotation(100 / 180 * Math.PI);
    const r4 = new Rotation(-50 / 180 * Math.PI);
    const r5 = new Rotation((110 + 10 * 360) / 180 * Math.PI);

    const v1 = new Vector2(-65 / 180 * Math.PI);
    const v2 = new Vector2(120 / 180 * Math.PI);
    v1.multiply(4.5);
    v2.multiply(0.75);

    r1.compare(r1).should.equal(0);

    r2.compare(r3).should.equal(0);
    r1.compare(r2).should.equal(1);
    r3.compare(r5).should.equal(1);
    r1.compare(r4).should.equal(-1);

    r3.compare(v2).should.equal(1);
    r4.compare(v1).should.equal(-1);
  });

  it('getRotationBetween', () => {
    const r1 = new Rotation(10 / 180 * Math.PI);
    const r2 = new Rotation(100 / 180 * Math.PI);
    const r3 = new Rotation(100 / 180 * Math.PI);
    const r4 = new Rotation(-50 / 180 * Math.PI);
    const r5 = new Rotation((110 + 10 * 360) / 180 * Math.PI);

    const v1 = new Vector2(-65 / 180 * Math.PI);
    const v2 = new Vector2(120 / 180 * Math.PI);
    v1.multiply(4.5);
    v2.multiply(0.75);

    r1.getRotationBetween(r1).toRadians().should.closeTo(0, 1.0e-6);
    r2.getRotationBetween(r3).toRadians().should.closeTo(0, 1.0e-6);
    r1.getRotationBetween(r2).toRadians().should.closeTo(90 / 180 * Math.PI, 1.0e-6);
    r1.getRotationBetween(r4).toRadians().should.closeTo(-60 / 180 * Math.PI, 1.0e-6);
    r3.getRotationBetween(r5).toRadians().should.closeTo(10 / 180 * Math.PI, 1.0e-6);

    r3.getRotationBetween(v2).toRadians().should.closeTo(20 / 180 * Math.PI, 1.0e-6);
    r4.getRotationBetween(v1).toRadians().should.closeTo(-15 / 180 * Math.PI, 1.0e-6);
  });
});