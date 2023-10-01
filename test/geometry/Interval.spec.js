'use strict';

require('chai').should();

describe('Interval', () => {
  const Interval = require('../../dist/geometry/Interval').Interval;
  it('createMinGreaterThanMax', () => {
    try {
      const i = new Interval(0.0, -1.0);
    } catch (e) {
      e.message.should.equal('Interval: min must be less than or equal to max');
    }
  });

  it('create', () => {
    const i = new Interval(0.0, 2.0);
    i.min.should.equal(0.0);
    i.max.should.equal(2.0);
  });

  it('createCopy', () => {
    const i1 = new Interval(-1.0, 2.0);
    const i2 = new Interval(i1);

    i2.should.not.equal(i1);
    i2.min.should.equal(i1.min);
    i2.max.should.equal(i1.max);

  });

  it('setInvalidMax', () => {
    try {
      const i = new Interval(0.0, 2.0);
      i.setMax(-1.0);
    } catch (e) {
      e.message.should.equal('Interval.setMax: min must be less than or equal to max');
    }
  });

  it('setMax', () => {
		const i = new Interval(0.0, 2.0);
		i.setMax(1.5);
  });

  it('setInvalidMin', () => {
    try {
      const i = new Interval(0.0, 2.0);
      i.setMin(3.0);
    } catch (e) {
      e.message.should.equal('Interval.setMin: min must be less than or equal to max');
    }
  });

  it('setMin', () => {
		const i = new Interval(0.0, 2.0);
		i.setMin(1.5);
  });

  it('includes', () => {
    const i = new Interval(-2.5, 100.521);

    i.includesExclusive(50.0).should.be.true;
    i.includesExclusive(100.521).should.be.false;
    i.includesExclusive(-3.0).should.be.false;

    i.includesInclusive(50.0).should.be.true;
    i.includesInclusive(-2.5).should.be.true;
    i.includesInclusive(-3.0).should.be.false;

    i.includesInclusiveMax(50.0).should.be.true;
    i.includesInclusiveMax(100.521).should.be.true;
    i.includesInclusiveMax(-2.5).should.be.false;
    i.includesInclusiveMax(200.0).should.be.false;

    i.includesInclusiveMin(50.0).should.be.true;
    i.includesInclusiveMin(-2.5).should.be.true;
    i.includesInclusiveMin(100.521).should.be.false;
    i.includesInclusiveMin(-3.0).should.be.false;
  });

  it('overlaps', () => {
    const i1 = new Interval(-2.0, 5.0);
    const i2 = new Interval(-4.0, 1.0);

    i1.overlaps(i2).should.be.true;
    i2.overlaps(i1).should.be.true;

    i1.distance(i2).should.equal(0.0);
    i2.distance(i1).should.equal(0.0);

    const ov1 = i1.getOverlap(i2);
    const ov2 = i2.getOverlap(i1);
    ov1.should.closeTo(3.0, 1.0e-3);
    ov2.should.closeTo(3.0, 1.0e-3);

    const ov0 = i1.getOverlap(new Interval(-10.0, -6.0));
    ov0.should.equal(0.0);
  });

  it('contains', () => {
    let i1 = new Interval(-2.0, 5.0);
    let i2 = new Interval(-1.0, 3.0);

    i1.containsExclusive(i2).should.be.true;
    i2.containsExclusive(i1).should.be.false;
    i1.containsInclusive(i2).should.be.true;
    i2.containsInclusive(i1).should.be.false;
    i1.containsInclusiveMax(i2).should.be.true;
    i2.containsInclusiveMax(i1).should.be.false;
    i1.containsInclusiveMin(i2).should.be.true;
    i2.containsInclusiveMin(i1).should.be.false;

    i1 = new Interval(-1.0, 5.0);
    i2 = new Interval(-1.0, 3.0);

    i1.containsExclusive(i2).should.be.false;
    i2.containsExclusive(i1).should.be.false;
    i1.containsInclusive(i2).should.be.true;
    i2.containsInclusive(i1).should.be.false;
    i1.containsInclusiveMax(i2).should.be.false;
    i2.containsInclusiveMax(i1).should.be.false;
    i1.containsInclusiveMin(i2).should.be.true;
    i2.containsInclusiveMin(i1).should.be.false;

    i1 = new Interval(-2.0, 5.0);
    i2 = new Interval(-1.0, 5.0);

    i1.containsExclusive(i2).should.be.false;
    i2.containsExclusive(i1).should.be.false;
    i1.containsInclusive(i2).should.be.true;
    i2.containsInclusive(i1).should.be.false;
    i1.containsInclusiveMax(i2).should.be.true;
    i2.containsInclusiveMax(i1).should.be.false;
    i1.containsInclusiveMin(i2).should.be.false;
    i2.containsInclusiveMin(i1).should.be.false;

    i1 = new Interval(-1.0, 5.0);
    i2 = new Interval(-1.0, 5.0);

    i1.containsExclusive(i2).should.be.false;
    i2.containsExclusive(i1).should.be.false;
    i1.containsInclusive(i2).should.be.true;
    i2.containsInclusive(i1).should.be.true;
    i1.containsInclusiveMax(i2).should.be.false;
    i2.containsInclusiveMax(i1).should.be.false;
    i1.containsInclusiveMin(i2).should.be.false;
    i2.containsInclusiveMin(i1).should.be.false;
  });

  it('clamp', () => {
    const i = new Interval(-1.0, 6.5);

    i.clamp(2.0).should.equal(2.0);
    Interval.clamp(2.0, -1.0, 6.5).should.equal(2.0);
    i.clamp(-2.0).should.equal(-1.0);
    i.clamp(7.0).should.equal(6.5);
  });

  it('degenerate', () => {
    const i = new Interval(2.0, 2.0);
    i.isDegenerate().should.be.true;

    i.expand(0.000001);

    i.min.should.closeTo(1.9999995, 1.0e-3);
    i.max.should.closeTo(2.0000005, 1.0e-3);

    i.isDegenerate().should.be.false;
    i.isDegenerate(0.0).should.be.false;
    i.isDegenerate(0.01).should.be.true;
  });

  it('union', () => {
    const i1 = new Interval(-2.0, 3.0);
    const i2 = new Interval(-1.0, 4.0);

    let u = i1.getUnion(i2);
    u.min.should.closeTo(-2.0, 1.0e-3);
    u.max.should.closeTo(4.0, 1.0e-3);

    u = i2.getUnion(i1);
    u.min.should.closeTo(-2.0, 1.0e-3);
    u.max.should.closeTo(4.0, 1.0e-3);

    const i3 = new Interval(-3.0, -2.5);
    u = i1.getUnion(i3);
    u.min.should.closeTo(-3.0, 1.0e-3);
    u.max.should.closeTo(3.0, 1.0e-3);

    i1.union(i2);
    i1.min.should.closeTo(-2.0, 1.0e-3);
    i1.max.should.closeTo(4.0, 1.0e-3);

    i1.setMin(-2.0);
    i1.setMax(3.0);
    i1.union(i3);
    i1.min.should.closeTo(-3.0, 1.0e-3);
    i1.max.should.closeTo(3.0, 1.0e-3);
  });

  it('intersection', () => {
    const i1 = new Interval(-2.0, 3.0);
    const i2 = new Interval(-1.0, 4.0);

    let u = i1.getIntersection(i2);
    u.min.should.closeTo(-1.0, 1.0e-3);
    u.max.should.closeTo(3.0, 1.0e-3);

    u = i2.getIntersection(i1);
    u.min.should.closeTo(-1.0, 1.0e-3);
    u.max.should.closeTo(3.0, 1.0e-3);

    const i3 = new Interval(-3.0, -2.5);
    u = i1.getIntersection(i3);
    u.min.should.closeTo(0.0, 1.0e-3);
    u.max.should.closeTo(0.0, 1.0e-3);

    i1.intersection(i2);
    i1.min.should.closeTo(-1.0, 1.0e-3);
    i1.max.should.closeTo(3.0, 1.0e-3);

    i1.setMin(-2.0);
    i1.setMax(3.0);
    i1.intersection(i3);
    i1.min.should.closeTo(0.0, 1.0e-3);
    i1.max.should.closeTo(0.0, 1.0e-3);
  });

  it('distance', () => {
    const i1 = new Interval(-2.0, 3.0);
    const i2 = new Interval(-1.0, 4.0);

    i1.distance(i2).should.equal(0.0);

    const i3 = new Interval(4.0, 6.0);

    i1.distance(i3).should.equal(1.0);
    i3.distance(i1).should.equal(1.0);
  });

  it('expand', () => {
    const i = new Interval(-2.0, 2.0);
    let ci = null;

    ci = i.getExpanded(2.0);
    ci.min.should.closeTo(-3.0, 1.0e-3);
    ci.max.should.closeTo(3.0, 1.0e-3);
    i.expand(2.0);
    i.min.should.closeTo(-3.0, 1.0e-3);
    i.max.should.closeTo(3.0, 1.0e-3);

    ci = i.getExpanded(0.0);
    ci.min.should.closeTo(-3.0, 1.0e-3);
    ci.max.should.closeTo(3.0, 1.0e-3);
    i.expand(0.0);
    i.min.should.closeTo(-3.0, 1.0e-3);
    i.max.should.closeTo(3.0, 1.0e-3);

    ci = i.getExpanded(-1.0);
    ci.min.should.closeTo(-2.5, 1.0e-3);
    ci.max.should.closeTo(2.5, 1.0e-3);
    i.expand(-1.0);
    i.min.should.closeTo(-2.5, 1.0e-3);
    i.max.should.closeTo(2.5, 1.0e-3);

    ci = i.getExpanded(-6.0);
    ci.min.should.closeTo(0.0, 1.0e-3);
    ci.max.should.closeTo(0.0, 1.0e-3);
    i.expand(-6.0);
    i.min.should.closeTo(0.0, 1.0e-3);
    i.max.should.closeTo(0.0, 1.0e-3);

    ci = new Interval(-2.5, 1.5);
    ci = ci.getExpanded(-6.0);
    ci.min.should.closeTo(-0.5, 1.0e-3);
    ci.max.should.closeTo(-0.5, 1.0e-3);
    ci.expand(-6.0);
    ci.min.should.closeTo(-0.5, 1.0e-3);
    ci.max.should.closeTo(-0.5, 1.0e-3);
  });

  it('getLength', () => {
    let i = new Interval(-2.0, 2.0);
    i.getLength().should.equal(4.0);

    i = new Interval(-1.0, 2.0);
    i.getLength().should.equal(3.0);

    i = new Interval(-3.0, -1.0);
    i.getLength().should.equal(2.0);

    i = new Interval(2.0, 3.0);
    i.getLength().should.equal(1.0);

    i = new Interval(-1.0, 2.0);
    i.expand(-4.0);
    i.getLength().should.equal(0.0);

    i = new Interval(-1.0, -1.0);
    i.getLength().should.equal(0.0);
  });
});