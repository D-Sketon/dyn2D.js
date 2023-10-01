'use strict';

require('chai').should();

describe('AABB', () => {
  const AABB = require('../../dist/geometry/AABB').AABB;
  const Epsilon = require('../../dist/Epsilon').Epsilon;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;

  it('createSuccess', () => {
    new AABB(0.0, 0.0, 1.0, 1.0);
    new AABB(-2.0, 2.0, -1.0, 5.0);
    new AABB(new Vector2(-3.0, 0.0), new Vector2(-2.0, 2.0));
  });

  it('createRadius', () => {
    const aabb = new AABB(0.5);
    aabb.getMinX().should.equal(-0.500);
    aabb.getMinY().should.equal(-0.500);
    aabb.getMaxX().should.equal(0.500);
    aabb.getMaxY().should.equal(0.500);

    const aabb2 = new AABB(new Vector2(-1.0, 1.0), 0.5);
    aabb2.getMinX().should.equal(-1.500);
    aabb2.getMinY().should.equal(0.500);
    aabb2.getMaxX().should.equal(-0.500);
    aabb2.getMaxY().should.equal(1.500);
  });

  it('createRadiusNegative', () => {
    try {
      new AABB(new Vector2(-1.0, 1.0), -1.0);
    } catch (e) {
      e.message.should.equal('AABB: Radius cannot be negative.');
    }
  });

  it('createCopy', () => {
    const aabb1 = new AABB(new Vector2(-3.0, 0.0), new Vector2(-2.0, 2.0));
    const aabb2 = new AABB(aabb1);
    aabb1.should.not.equal(aabb2);
    aabb1.getMinX().should.equal(aabb2.getMinX());
    aabb1.getMinY().should.equal(aabb2.getMinY());
    aabb1.getMaxX().should.equal(aabb2.getMaxX());
    aabb1.getMaxY().should.equal(aabb2.getMaxY());
  });

  it('createFailure1', () => {
    try {
      new AABB(0.0, 0.0, -1.0, 2.0);
    } catch (e) {
      e.message.should.equal('AABB: Minimum X cannot be greater than maximum X.');
    }
  });

  it('createFailure2', () => {
    try {
      new AABB(new Vector2(0.0, 0.0), new Vector2(-1.0, 2.0));
    } catch (e) {
      e.message.should.equal('AABB: Minimum X cannot be greater than maximum X.');
    }
  });

  it('perimeter', () => {
    const aabb = new AABB(-2.0, 0.0, 2.0, 1.0);
    aabb.getPerimeter().should.equal(10.0);
  });

  it('area', () => {
    const aabb = new AABB(-2.0, 0.0, 2.0, 1.0);
    aabb.getArea().should.equal(4.0);
  });

  it('union', () => {
    const aabb1 = new AABB(-2.0, 0.0, 2.0, 1.0);
    const aabb2 = new AABB(-1.0, -2.0, 5.0, 0.5);

    let aabbr = aabb1.getUnion(aabb2);
    aabbr.getMinX().should.equal(-2.0);
    aabbr.getMinY().should.equal(-2.0);
    aabbr.getMaxX().should.equal(5.0);
    aabbr.getMaxY().should.equal(1.0);

    const aabb3 = new AABB(-4.0, 2.0, -3.0, 4.0);
    aabbr = aabb1.getUnion(aabb3);
    aabbr.getMinX().should.equal(-4.0);
    aabbr.getMinY().should.equal(0.0);
    aabbr.getMaxX().should.equal(2.0);
    aabbr.getMaxY().should.equal(4.0);

    aabb1.union(aabb2);
    aabb1.getMinX().should.equal(-2.0);
    aabb1.getMinY().should.equal(-2.0);
    aabb1.getMaxX().should.equal(5.0);
    aabb1.getMaxY().should.equal(1.0);

    aabb1.union(aabb2, aabb3);
    aabb1.getMinX().should.equal(-4.0);
    aabb1.getMinY().should.equal(-2.0);
    aabb1.getMaxX().should.equal(5.0);
    aabb1.getMaxY().should.equal(4.0);
  });

  it('expand', () => {
    const aabb = new AABB(-2.0, 0.0, 4.0, 4.0);
    const aabb2 = aabb.getExpanded(2.0);

    aabb.expand(1.0);
    aabb.getMinX().should.equal(-2.5);
    aabb.getMinY().should.equal(-0.5);
    aabb.getMaxX().should.equal(4.5);
    aabb.getMaxY().should.equal(4.5);

    aabb2.getMinX().should.equal(-3.0);
    aabb2.getMinY().should.equal(-1.0);
    aabb2.getMaxX().should.equal(5.0);
    aabb2.getMaxY().should.equal(5.0);

    const aabb3 = aabb.getExpanded(-1.0);
    aabb3.getMinX().should.equal(-2.0);
    aabb3.getMinY().should.equal(0.0);
    aabb3.getMaxX().should.equal(4.0);
    aabb3.getMaxY().should.equal(4.0);

    aabb.expand(-1.0);
    aabb.getMinX().should.equal(-2.0);
    aabb.getMinY().should.equal(0.0);
    aabb.getMaxX().should.equal(4.0);
    aabb.getMaxY().should.equal(4.0);

    const aabb4 = aabb.getExpanded(-8.0);
    aabb4.getMinX().should.equal(1.0);
    aabb4.getMinY().should.equal(2.0);
    aabb4.getMaxX().should.equal(1.0);
    aabb4.getMaxY().should.equal(2.0);

    aabb.expand(-8.0);
    aabb.getMinX().should.equal(1.0);
    aabb.getMinY().should.equal(2.0);
    aabb.getMaxX().should.equal(1.0);
    aabb.getMaxY().should.equal(2.0);
  });

  it('overlaps', () => {
    const aabb1 = new AABB(-2.0, 0.0, 2.0, 1.0);
    const aabb2 = new AABB(-1.0, -2.0, 5.0, 2.0);
    aabb1.overlaps(aabb2).should.equal(true);
    aabb2.overlaps(aabb1).should.equal(true);

    const aabb3 = new AABB(3.0, 2.0, 4.0, 3.0);
    aabb1.overlaps(aabb3).should.equal(false);
    aabb3.overlaps(aabb1).should.equal(false);

    const aabb4 = new AABB(-1.0, 0.25, 1.0, 0.75);
    aabb1.overlaps(aabb4).should.equal(true);
    aabb4.overlaps(aabb1).should.equal(true);
  });

  it('contains', () => {
    const aabb1 = new AABB(-2.0, 0.0, 2.0, 1.0);
    const aabb2 = new AABB(-1.0, -2.0, 5.0, 2.0);
    aabb1.contains(aabb2).should.equal(false);
    aabb2.contains(aabb1).should.equal(false);

    const aabb3 = new AABB(3.0, 2.0, 4.0, 3.0);
    aabb1.contains(aabb3).should.equal(false);
    aabb3.contains(aabb1).should.equal(false);

    const aabb4 = new AABB(-1.0, 0.25, 1.0, 0.75);
    aabb1.contains(aabb4).should.equal(true);
    aabb4.contains(aabb1).should.equal(false);
  });

  it('getWidth', () => {
    const aabb = new AABB(-2.0, 0.0, 1.0, 1.0);
    aabb.getWidth().should.equal(3.0);
  });

  it('getHeight', () => {
    const aabb = new AABB(-2.0, 0.0, 1.0, 1.0);
    aabb.getHeight().should.equal(1.0);
  });

  it('translate', () => {
    const aabb = new AABB(-2.0, 0.0, 1.0, 1.0);
    const aabb2 = aabb.getTranslated(new Vector2(-1.0, 2.0));
    aabb.getMinX().should.equal(-2.0);
    aabb.getMinY().should.equal(0.0);
    aabb.getMaxX().should.equal(1.0);
    aabb.getMaxY().should.equal(1.0);

    aabb2.getMinX().should.equal(-3.0);
    aabb2.getMinY().should.equal(2.0);
    aabb2.getMaxX().should.equal(0.0);
    aabb2.getMaxY().should.equal(3.0);

    aabb.translate(new Vector2(-1.0, 2.0));

    aabb.getMinX().should.equal(-3.0);
    aabb.getMinY().should.equal(2.0);
    aabb.getMaxX().should.equal(0.0);
    aabb.getMaxY().should.equal(3.0);
  });

  it('containsPoint', () => {
    const aabb = new AABB(-2.0, 0.0, 2.0, 1.0);
    aabb.contains(0.0, 0.5).should.equal(true);
    aabb.contains(new Vector2(0.0, 0.5)).should.equal(true);

    aabb.contains(0.0, 2.0).should.equal(false);
    aabb.contains(new Vector2(0.0, 2.0)).should.equal(false);

    aabb.contains(0.0, 1.0).should.equal(true);
    aabb.contains(new Vector2(0.0, 1.0)).should.equal(true);
  });

  it('intersection', () => {
    const aabb1 = new AABB(-2.0, 0.0, 2.0, 1.0);
    const aabb2 = new AABB(-1.0, -2.0, 5.0, 0.5);
    
    let aabbr = aabb1.getIntersection(aabb2);
    aabbr.getMinX().should.equal(-1.0);
    aabbr.getMinY().should.equal(0.0);
    aabbr.getMaxX().should.equal(2.0);
    aabbr.getMaxY().should.equal(0.5);

    const aabb3 = new AABB(-4.0, 2.0, -3.0, 4.0);
    aabbr = aabb1.getIntersection(aabb3);
    aabbr.getMinX().should.equal(0.0);
    aabbr.getMinY().should.equal(0.0);
    aabbr.getMaxX().should.equal(0.0);
    aabbr.getMaxY().should.equal(0.0);

    aabbr.intersection(aabb1, aabb2);
    aabbr.getMinX().should.equal(-1.0);
    aabbr.getMinY().should.equal(0.0);
    aabbr.getMaxX().should.equal(2.0);
    aabbr.getMaxY().should.equal(0.5);

    aabbr.intersection(aabb1, aabb3);
    aabbr.getMinX().should.equal(0.0);
    aabbr.getMinY().should.equal(0.0);
    aabbr.getMaxX().should.equal(0.0);
    aabbr.getMaxY().should.equal(0.0);

    aabb1.intersection(aabb2);
    aabb1.getMinX().should.equal(-1.0);
    aabb1.getMinY().should.equal(0.0);
    aabb1.getMaxX().should.equal(2.0);
    aabb1.getMaxY().should.equal(0.5);
  });

  it('degenerate', () => {
    const aabb = new AABB(0.0, 0.0, 0.0, 0.0);
    aabb.isDegenerate().should.equal(true);

    const aabb2 = new AABB(1.0, 2.0, 1.0, 3.0);
    aabb2.isDegenerate().should.equal(true);

    const aabb3 = new AABB(1.0, 0.0, 2.0, 1.0);
    aabb3.isDegenerate().should.equal(false);

    const aabb4 = new AABB(1.0, 0.0, 1.000001, 2.0);
    aabb4.isDegenerate().should.equal(false);
    aabb4.isDegenerate(Epsilon.E).should.equal(false);
    aabb4.isDegenerate(0.000001).should.equal(true);

  });

  it('testEquals', () => {
    const aabb1 = new AABB(-2.0, 0.0, 2.0, 1.0);
    const aabb2 = new AABB(-1.0, -2.0, 5.0, 2.0);
    const aabb3 = new AABB(-1.0, -2.0, 5.0, 2.0);

    aabb1.equals(null).should.equal(false);
    aabb1.equals(aabb1).should.equal(true);
    aabb1.equals(aabb2).should.equal(false);
    aabb1.equals(aabb3).should.equal(false);
    aabb2.equals(aabb3).should.equal(true);
    aabb1.equals(new Object()).should.equal(false);
  });

  it('createFromPoints', () => {
    const p1 = new Vector2(1.0, 1.0);
    const p2 = new Vector2(3.0, 3.0);

    const aabb = AABB.createFromPoints(p1, p2);

    aabb.getMinX().should.equal(1.0);
    aabb.getMinY().should.equal(1.0);
    aabb.getMaxX().should.equal(3.0);
    aabb.getMaxY().should.equal(3.0);

    const aabb2 = AABB.createFromPoints(1.0, 4.0, 2.0, 2.0);

    aabb2.getMinX().should.equal(1.0);
    aabb2.getMinY().should.equal(2.0);
    aabb2.getMaxX().should.equal(2.0);
    aabb2.getMaxY().should.equal(4.0);
  });

  it('setFromPoints', () => {
    const p1 = new Vector2(1.0, 1.0);
    const p2 = new Vector2(3.0, 3.0);

    const aabb = new AABB(0.0, 0.0, 0.0, 0.0);
    AABB.setFromPoints(p1, p2, aabb);

    aabb.getMinX().should.equal(1.0);
    aabb.getMinY().should.equal(1.0);
    aabb.getMaxX().should.equal(3.0);
    aabb.getMaxY().should.equal(3.0);

    AABB.setFromPoints(1.0, 4.0, 2.0, 2.0, aabb);

    aabb.getMinX().should.equal(1.0);
    aabb.getMinY().should.equal(2.0);
    aabb.getMaxX().should.equal(2.0);
    aabb.getMaxY().should.equal(4.0);
  });

  it('copy', () => {
    const aabb = new AABB(1.0, 1.0, 3.0, 3.0);
    const copy = aabb.copy();

    aabb.getMinX().should.equal(copy.getMinX());
    aabb.getMinY().should.equal(copy.getMinY());
    aabb.getMaxX().should.equal(copy.getMaxX());
    aabb.getMaxY().should.equal(copy.getMaxY());
  });

  it('getCenter', () => {
    const aabb = new AABB(1.0, 1.0, 3.0, 3.0);
    const c = aabb.getCenter();

    c.x.should.equal(2.0);
    c.y.should.equal(2.0);
  });

  it('zero', () => {
    const aabb = new AABB(1.0, 1.0, 3.0, 3.0);

    aabb.getMinX().should.equal(1.0);
    aabb.getMinY().should.equal(1.0);
    aabb.getMaxX().should.equal(3.0);
    aabb.getMaxY().should.equal(3.0);

    aabb.zero();

    aabb.getMinX().should.equal(0.0);
    aabb.getMinY().should.equal(0.0);
    aabb.getMaxX().should.equal(0.0);
    aabb.getMaxY().should.equal(0.0);
  });
});