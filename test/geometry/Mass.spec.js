'use strict';

require('chai').should();

describe('Mass', () => {
  const Mass = require('../../dist/geometry/Mass').Mass;
  const MassType = require('../../dist/geometry/MassType').MassType;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;

  it('createNegativeMass', () => {
    try {
      new Mass(new Vector2(), -1.0, 1.0);
    } catch (e) {
      e.message.should.equal('Mass: The mass must be greater than or equal to zero.');
    }
  });

  it('createNegativeInertia', () => {
    try {
      new Mass(new Vector2(), 1.0, -1.0);
    } catch (e) {
      e.message.should.equal('Mass: The inertia must be greater than or equal to zero.');
    }
  });

  it('createNullCenter', () => {
    const m = new Mass(null, 1.0, 1.0);
    m.center.should.deep.equal(new Vector2());
  });

  it('createSuccess', () => {
    const m = new Mass(new Vector2(), 1.0, 1.0);
    m.center.should.deep.equal(new Vector2());
    m.mass.should.equal(1.0);
    m.inertia.should.equal(1.0);
  });

  it('createInfinite', () => {
    const m = new Mass(new Vector2(), 0, 0);
    m.isInfinite().should.equal(true);
    m.center.should.deep.equal(new Vector2());
    m.mass.should.equal(0.0);
    m.inertia.should.equal(0.0);
  });

  it('createFixedLinearVelocity', () => {
    const m = new Mass(new Vector2(), 0, 1.0);
    m.isInfinite().should.equal(false);
    MassType.FIXED_LINEAR_VELOCITY.should.equal(m.getType());
    m.center.should.deep.equal(new Vector2());
    m.mass.should.equal(0.0);
    m.inertia.should.equal(1.0);

  });

  it('createFixedAngularVelocity', () => {
    const m = new Mass(new Vector2(), 1.0, 0.0);
    m.isInfinite().should.equal(false);
    MassType.FIXED_ANGULAR_VELOCITY.should.equal(m.getType());
    m.center.should.deep.equal(new Vector2());
    m.mass.should.equal(1.0);
    m.inertia.should.equal(0.0);
  });

  it('createCopy', () => {
    const m = new Mass(new Vector2(1.0, 0.0), 2.0, 1.0);
    const m2 = new Mass(m);

    m2.should.not.equal(m);
    m2.center.should.not.equal(m.center);
    m2.center.x.should.equal(m.center.x);
    m2.center.y.should.equal(m.center.y);
    m2.mass.should.equal(m.mass);
    m2.inertia.should.equal(m.inertia);
    m2.getType().should.equal(m.getType());

    const m3 = m2.copy();
    m3.should.not.equal(m2);
    m3.center.should.not.equal(m2.center);
    m3.center.x.should.equal(m2.center.x);
    m3.center.y.should.equal(m2.center.y);
    m3.mass.should.equal(m2.mass);
    m3.inertia.should.equal(m2.inertia);
    m3.getType().should.equal(m2.getType());
  });

  it('createList', () => {
    const m1 = new Mass(new Vector2(1.0, 1.0), 3.00, 1.00);
    const m2 = new Mass(new Vector2(-1.0, 0.0), 0.50, 0.02);
    const m3 = new Mass(new Vector2(1.0, -2.0), 2.00, 3.00);
    const masses = [m1, m2, m3];
    const m = Mass.create(masses);

    const c = m.getCenter();
    c.x.should.be.closeTo(0.818, 1.0e-3);
    c.y.should.be.closeTo(-0.181, 1.0e-3);
    m.getMass().should.be.closeTo(5.500, 1.0e-3);
    m.getInertia().should.be.closeTo(16.656, 1.0e-3);
  });

  it('createListInfinite', () => {
    const m1 = new Mass();
    const m2 = new Mass();
    const m3 = new Mass();
    const masses = [m1, m2, m3];
    const m = Mass.create(masses);

    const c = m.getCenter();
    m.isInfinite().should.equal(true);
    c.x.should.be.closeTo(0.000, 1.0e-3);
    c.y.should.be.closeTo(0.000, 1.0e-3);
    m.getMass().should.be.closeTo(0.000, 1.0e-3);
    m.getInertia().should.be.closeTo(0.000, 1.0e-3);
  });

  it('createListOneElement', () => {
    const m1 = new Mass(new Vector2(), 1.0, 2.0);
    const masses = [m1];
    const m = Mass.create(masses);

    const c = m.getCenter();
    m.isInfinite().should.equal(false);
    m1.should.not.equal(m);
    c.x.should.be.closeTo(0.000, 1.0e-3);
    c.y.should.be.closeTo(0.000, 1.0e-3);
    m.getMass().should.be.closeTo(1.000, 1.0e-3);
    m.getInertia().should.be.closeTo(2.000, 1.0e-3);
  });

  it('createListNull', () => {
    try {
      Mass.create(null);
    } catch (e) {
      e.message.should.equal('Mass.create: The masses list cannot be null');
    }
  });

  it('createListEmpty', () => {
    try {
      Mass.create([]);
    } catch (e) {
      e.message.should.equal('Mass.create: The masses list must contain at least one mass');
    }
  });

  it('createListOneNullElement', () => {
    const masses = [null];
    try {
      Mass.create(masses);
    } catch (e) {
      e.message.should.equal('Mass.create: The masses list must contain at least one mass');
    }
  });

  it('createListNullElement', () => {
    const m1 = new Mass(new Vector2(), 1.0, 2.0);
    const m2 = new Mass(new Vector2(), 2.0, 7.0);
    const masses = [m1, null, m2];
    try {
      Mass.create(masses);
    }
    catch (e) {
      e.message.should.equal('Mass.create: The masses list cannot contain null masses');
    }
  });

  it('setType', () => {
    // TODO test this
  });

  it('setNullType', () => {
    try {
      const m = new Mass();
      m.setType(null);
    } catch (e) {
      e.message.should.equal('Mass.setType: type cannot be null.');
    }
  });

  it('setTypeIgnored', () => {
    let m = new Mass();
    m.getType().should.equal(MassType.INFINITE);

    // you can't override the type of mass when it's already infinite
    m.setType(MassType.NORMAL);
    m.getType().should.equal(MassType.INFINITE);
    m.setType(MassType.FIXED_ANGULAR_VELOCITY);
    m.getType().should.equal(MassType.INFINITE);
    m.setType(MassType.FIXED_LINEAR_VELOCITY);
    m.getType().should.equal(MassType.INFINITE);
    m.setType(MassType.INFINITE);
    m.getType().should.equal(MassType.INFINITE);

    // you can't override the type of mass when it's fixed-linear-velocity
    // except in the case of infinite
    m = new Mass(new Vector2(), 0.0, 1.0);
    m.getType().should.equal(MassType.FIXED_LINEAR_VELOCITY);
    m.setType(MassType.NORMAL);
    m.getType().should.equal(MassType.FIXED_LINEAR_VELOCITY);
    m.setType(MassType.FIXED_ANGULAR_VELOCITY);
    m.getType().should.equal(MassType.FIXED_LINEAR_VELOCITY);
    m.setType(MassType.INFINITE);
    m.getType().should.equal(MassType.INFINITE);
    m.setType(MassType.FIXED_LINEAR_VELOCITY);
    m.getType().should.equal(MassType.FIXED_LINEAR_VELOCITY);

    // you can't override the type of mass when it's fixed-angular-velocity
    // except in the case of infinite
    m = new Mass(new Vector2(), 1.0, 0.0);
    m.getType().should.equal(MassType.FIXED_ANGULAR_VELOCITY);
    m.setType(MassType.NORMAL);
    m.getType().should.equal(MassType.FIXED_ANGULAR_VELOCITY);
    m.setType(MassType.FIXED_LINEAR_VELOCITY);
    m.getType().should.equal(MassType.FIXED_ANGULAR_VELOCITY);
    m.setType(MassType.INFINITE);
    m.getType().should.equal(MassType.INFINITE);
    m.setType(MassType.FIXED_ANGULAR_VELOCITY);
    m.getType().should.equal(MassType.FIXED_ANGULAR_VELOCITY);
  });

  it('equals', () => {
    const m1 = new Mass();
    const m2 = new Mass();

    m1.equals(m2).should.equal(true);
    m1.equals(m1).should.equal(true);
    m2.equals(m2).should.equal(true);
    m1.should.not.equal(m2);

    const m3 = new Mass(new Vector2(), 5, 1);
    m1.equals(m3).should.equal(false);
    m1.equals(null).should.equal(false);
    m1.equals(new Object()).should.equal(false);
    m1.equals(m3).should.equal(false);
    m1.equals(m1).should.equal(true);
  });
});