'use strict';

const { expect } = require('chai');

require('chai').should();

describe('Segment', () => {
  const Segment = require('../../dist/geometry/Segment').Segment;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const MassType = require('../../dist/geometry/MassType').MassType;
  const Transform = require('../../dist/geometry/Transform').Transform;
  const IDENTITY = new Transform();

  it('createNullPoint1', () => {
    try {
      new Segment(null, new Vector2());
    } catch (e) {
      e.message.should.equal('Segment: Segment cannot have null vertices');
    }
  });

  it('createNullPoint2', () => {
    try {
      new Segment(new Vector2(), null);
    } catch (e) {
      e.message.should.equal('Segment: Segment cannot have null vertices');
    }
  });

  it('createCoincident', () => {
    try {
      new Segment(new Vector2(), new Vector2());
    } catch (e) {
      e.message.should.equal('Segment: Segment cannot have coincident vertices');
    }
  });

  it('creatSuccess', () => {
    const s = new Segment(
      new Vector2(0.0, 1.0),
      new Vector2(1.0, 2.0)
    );

    expect(s.center.x).to.equal(0.5);
    expect(s.center.y).to.equal(1.5);
    expect(s.toString()).to.not.equal(null);
    expect(s.getVertexIterator()).to.not.equal(null);
    expect(s.getVertexIterator().constructor.name).to.equal('WoundIterator');
    expect(s.getNormalIterator()).to.not.equal(null);
    expect(s.getNormalIterator().constructor.name).to.equal('WoundIterator');
  });

  it('getLength', () => {
    const s = new Segment(
      new Vector2(0.0, 1.0),
      new Vector2(1.5, 3.0)
    );

    expect(s.getLength()).to.equal(2.5);
  });

  it('getLocation', () => {
    let loc = Segment.getLocation(new Vector2(1.0, 1.0), new Vector2(), new Vector2());
    expect(loc).to.equal(0.000);

    // test valid line/on line
    loc = Segment.getLocation(new Vector2(1.0, 1.0), new Vector2(), new Vector2(2.0, 2.0));
    expect(loc).to.equal(0.000);

    // test valid line/left-above line
    loc = Segment.getLocation(new Vector2(1.0, 1.0), new Vector2(), new Vector2(1.0, 0.5));
    expect(loc).to.be.greaterThan(0);

    // test valid line/right-below line
    loc = Segment.getLocation(new Vector2(1.0, 1.0), new Vector2(), new Vector2(1.0, 2.0));
    expect(loc).to.be.lessThan(0);

    // test vertical line
    loc = Segment.getLocation(new Vector2(1.0, 1.0), new Vector2(), new Vector2(0.0, 3.0));
    expect(loc).to.be.lessThan(0);
    loc = Segment.getLocation(new Vector2(-1.0, 1.0), new Vector2(), new Vector2(0.0, 3.0));
    expect(loc).to.be.greaterThan(0);

    // test horizontal line
    loc = Segment.getLocation(new Vector2(1.0, 1.0), new Vector2(0.0, 0.0), new Vector2(1.0, 0.0));
    expect(loc).to.be.greaterThan(0);
    loc = Segment.getLocation(new Vector2(1.0, -1.0), new Vector2(0.0, 0.0), new Vector2(1.0, 0.0));
    expect(loc).to.be.lessThan(0);
  });

  it('getPointClosest', () => {
    const pt = new Vector2(1.0, -1.0);
    let p = Segment.getPointOnLineClosestToPoint(pt, new Vector2(1.0, 1.0), new Vector2(1.0, 1.0));
    expect(p.x).to.equal(1.000);
    expect(p.y).to.equal(1.000);

    p = Segment.getPointOnSegmentClosestToPoint(pt, new Vector2(1.0, 1.0), new Vector2(1.0, 1.0));
    expect(p.x).to.equal(1.000);
    expect(p.y).to.equal(1.000);

    // test valid line
    p = Segment.getPointOnLineClosestToPoint(pt, new Vector2(), new Vector2(5.0, 5.0));
    expect(p.x).to.equal(0.000);
    expect(p.y).to.equal(0.000);

    p = new Segment(new Vector2(), new Vector2(5.0, 5.0)).getPointOnLineClosestToPoint(pt);
    expect(p.x).to.equal(0.000);
    expect(p.y).to.equal(0.000);

    p = Segment.getPointOnLineClosestToPoint(pt, new Vector2(), new Vector2(2.5, 5.0));
    expect(p.x).to.equal(-0.200);
    expect(p.y).to.equal(-0.400);

    p = new Segment(new Vector2(), new Vector2(2.5, 5.0)).getPointOnLineClosestToPoint(pt);
    expect(p.x).to.equal(-0.200);
    expect(p.y).to.equal(-0.400);

    // test valid segment
    p = Segment.getPointOnSegmentClosestToPoint(pt, new Vector2(-1.0, -1.0), new Vector2(1.0, 1.0));
    // since 0,0 is perp to pt
    expect(p.x).to.equal(0.000);
    expect(p.y).to.equal(0.000);

    p = new Segment(new Vector2(-1.0, -1.0), new Vector2(1.0, 1.0)).getPointOnSegmentClosestToPoint(pt);
    expect(p.x).to.equal(0.000);
    expect(p.y).to.equal(0.000);

    // test closest is one of the segment points
    p = Segment.getPointOnSegmentClosestToPoint(pt, new Vector2(), new Vector2(2.5, 5.0));
    expect(p.x).to.equal(0.000);
    expect(p.y).to.equal(0.000);

    p = new Segment(new Vector2(), new Vector2(2.5, 5.0)).getPointOnSegmentClosestToPoint(pt);
    expect(p.x).to.equal(0.000);
    expect(p.y).to.equal(0.000);

    // test closest is one of the segment points
    p = Segment.getPointOnSegmentClosestToPoint(pt, new Vector2(), new Vector2(2.5, 5.0));
    expect(p.x).to.equal(0.000);
    expect(p.y).to.equal(0.000);

    p = new Segment(new Vector2(), new Vector2(2.5, 5.0)).getPointOnSegmentClosestToPoint(pt);
    expect(p.x).to.equal(0.000);
    expect(p.y).to.equal(0.000);
  });

  it('getAxes', () => {
    const s = new Segment(
      new Vector2(0.0, 1.0),
      new Vector2(1.5, 3.0)
    );
    const t = new Transform();

    let axes = s.getAxes(null, t);
    expect(axes.length).to.equal(2);

    let seg = s.vertices[0].to(s.vertices[1]);
    expect(seg.cross(axes[1])).to.closeTo(0.000, 1.0e-3);
    expect(seg.dot(axes[0])).to.closeTo(0.000, 1.0e-3);

    t.translate(1.0, 0.0);
    t.rotate(25 / 180 * Math.PI);
    axes = s.getAxes(null, t);
    seg = t.getTransformed(s.vertices[0]).to(t.getTransformed(s.vertices[1]));

    expect(seg.cross(axes[1])).to.closeTo(0.000, 1.0e-3);
    expect(seg.dot(axes[0])).to.closeTo(0.000, 1.0e-3);

    const f = new Vector2(2.0, -2.0);
    t.identity();
    axes = s.getAxes([f], t);
    expect(axes.length).to.equal(3);

    const v1 = s.vertices[0].to(f);
    v1.normalize();
    expect(v1.x).to.equal(axes[2].x);
    expect(v1.y).to.equal(axes[2].y);
  });

  it('getFoci', () => {
    const s = new Segment(
      new Vector2(0.0, 1.0),
      new Vector2(1.5, 3.0)
    );
    const t = new Transform();

    const foci = s.getFoci(t);
    expect(foci).to.equal(null);
  });

  it('contains', () => {
    const s = new Segment(
      new Vector2(0.0, 1.0),
      new Vector2(1.5, 3.0)
    );
    const t = new Transform();

    expect(s.contains(new Vector2(2.0, 2.0), t)).to.equal(false);
    expect(s.contains(new Vector2(2.0, 2.0), t, false)).to.equal(false);
    expect(s.contains(new Vector2(0.75, 2.0), t)).to.equal(true);
    expect(s.contains(new Vector2(0.75, 2.0), t, false)).to.equal(false);
  });

  it('containsRadius', () => {
    const s = new Segment(
      new Vector2(1.0, 1.0),
      new Vector2(-1.0, -1.0)
    );
    const t = new Transform();

    expect(s.contains(new Vector2(2.0, 2.0), t, 0.1)).to.equal(false);
    expect(s.contains(new Vector2(1.05, 1.05), t, 0.1)).to.equal(true);
    expect(s.contains(new Vector2(1.05, 1.05), t, 0.0)).to.equal(false);
    expect(s.contains(new Vector2(1.05, 1.05), t, 0.05)).to.equal(false);
    expect(s.contains(new Vector2(0.505, 0.5), t, 0.1)).to.equal(true);
  });

  it('project', () => {
    const s = new Segment(
      new Vector2(0.0, 1.0),
      new Vector2(1.5, 3.0)
    );
    const t = new Transform();
    const n = new Vector2(1.0, 0.0);

    let i = s.project(n, t);
    expect(i.min).to.closeTo(0.000, 1.0e-3);
    expect(i.max).to.closeTo(1.500, 1.0e-3);

    n.set(1.0, 1.0);
    i = s.project(n, t);
    expect(i.min).to.closeTo(1.000, 1.0e-3);
    expect(i.max).to.closeTo(4.500, 1.0e-3);

    n.set(0.0, 1.0);
    i = s.project(n, t);
    expect(i.min).to.closeTo(1.000, 1.0e-3);
    expect(i.max).to.closeTo(3.000, 1.0e-3);

    t.translate(1.0, 2.0);
    t.rotate(Math.PI / 2, t.getTransformed(s.center));
    i = s.project(n, t);
    expect(i.min).to.closeTo(3.250, 1.0e-3);
    expect(i.max).to.closeTo(4.750, 1.0e-3);
  });

  it('getFarthest', () => {
    const s = new Segment(
      new Vector2(0.0, 1.0),
      new Vector2(1.5, 3.0)
    );
    const t = new Transform();
    const n = new Vector2(1.0, 0.0);

    const f = s.getFarthestFeature(n, t);
    expect(f.max.point.x).to.closeTo(1.500, 1.0e-3);
    expect(f.max.point.y).to.closeTo(3.000, 1.0e-3);

    expect(f.vertex1.point.x).to.closeTo(0.000, 1.0e-3);
    expect(f.vertex1.point.y).to.closeTo(1.000, 1.0e-3);
    expect(f.vertex2.point.x).to.closeTo(1.500, 1.0e-3);
    expect(f.vertex2.point.y).to.closeTo(3.000, 1.0e-3);

    const p = s.getFarthestPoint(n, t);
    expect(p.x).to.closeTo(1.500, 1.0e-3);
    expect(p.y).to.closeTo(3.000, 1.0e-3);

    t.translate(0.0, -1.0);
    t.rotate(Math.PI / 4);

    const p2 = s.getFarthestPoint(n, t);
    expect(p2.x).to.closeTo(0.000, 1.0e-3);
    expect(p2.y).to.closeTo(0.000, 1.0e-3);
  });

  it('rotate', () => {
    const s = new Segment(
      new Vector2(0.0, 0.0),
      new Vector2(1.0, 1.0)
    );
    s.rotate(Math.PI / 4, 0, 0);

    expect(s.vertices[0].x).to.closeTo(0.000, 1.0e-3);
    expect(s.vertices[0].y).to.closeTo(0.000, 1.0e-3);

    expect(s.vertices[1].x).to.closeTo(0.000, 1.0e-3);
    expect(s.vertices[1].y).to.closeTo(1.414, 1.0e-3);
  });

  it('translate', () => {
    const s = new Segment(
      new Vector2(0.0, 0.0),
      new Vector2(1.0, 1.0)
    );
    s.translate(2.0, -1.0);

    expect(s.vertices[0].x).to.closeTo(2.000, 1.0e-3);
    expect(s.vertices[0].y).to.closeTo(-1.000, 1.0e-3);
    expect(s.vertices[1].x).to.closeTo(3.000, 1.0e-3);
    expect(s.vertices[1].y).to.closeTo(0.000, 1.0e-3);
  });

  it('createAABB', () => {
    const s = new Segment(
      new Vector2(0.0, 0.0),
      new Vector2(1.0, 1.0)
    );
    let aabb = s.createAABB(IDENTITY);
    expect(aabb.getMinX()).to.equal(0.0);
    expect(aabb.getMinY()).to.equal(0.0);
    expect(aabb.getMaxX()).to.equal(1.0);
    expect(aabb.getMaxY()).to.equal(1.0);

    const aabb2 = s.createAABB();
    expect(aabb.getMinX()).to.equal(aabb2.getMinX());
    expect(aabb.getMinY()).to.equal(aabb2.getMinY());
    expect(aabb.getMaxX()).to.equal(aabb2.getMaxX());
    expect(aabb.getMaxY()).to.equal(aabb2.getMaxY());

    const tx = new Transform();
    tx.rotate(Math.PI / 6);
    tx.translate(1.0, 2.0);
    aabb = s.createAABB(tx);
    expect(aabb.getMinX()).to.closeTo(1.0, 1.0e-3);
    expect(aabb.getMinY()).to.closeTo(2.0, 1.0e-3);
    expect(aabb.getMaxX()).to.closeTo(1.366, 1.0e-3);
    expect(aabb.getMaxY()).to.closeTo(3.366, 1.0e-3);
  });

  it('getLineIntersection', () => {
    let p = Segment.getLineIntersection(
      new Vector2(-1.0, -1.0), new Vector2(2.0, 0.0),
      new Vector2(-1.0, 0.0), new Vector2(1.0, 0.5));

    expect(p.x).to.closeTo(11.0, 1.0e-3);
    expect(p.y).to.closeTo(3.0, 1.0e-3);

    p = new Segment(new Vector2(-1.0, -1.0), new Vector2(2.0, 0.0)).getLineIntersection(
      new Segment(new Vector2(-1.0, 0.0), new Vector2(1.0, 0.5)));

    expect(p.x).to.closeTo(11.0, 1.0e-3);
    expect(p.y).to.closeTo(3.0, 1.0e-3);

    p = Segment.getLineIntersection(
      new Vector2(-1.0, 1.0), new Vector2(2.0, 1.0),
      new Vector2(-1.0, 0.0), new Vector2(1.0, 0.5));

    expect(p.x).to.closeTo(3.0, 1.0e-3);
    expect(p.y).to.closeTo(1.0, 1.0e-3);

    p = Segment.getLineIntersection(
      new Vector2(3.0, 0.0), new Vector2(3.0, 1.0),
      new Vector2(-1.0, 0.0), new Vector2(1.0, 0.5));

    expect(p.x).to.closeTo(3.0, 1.0e-3);
    expect(p.y).to.closeTo(1.0, 1.0e-3);

    p = Segment.getLineIntersection(
      new Vector2(3.0, 0.0), new Vector2(3.0, -2.0),
      new Vector2(0.0, 1.0), new Vector2(4.0, 1.0));

    expect(p.x).to.closeTo(3.0, 1.0e-3);
    expect(p.y).to.closeTo(1.0, 1.0e-3);

    p = Segment.getLineIntersection(
      new Vector2(-2.0, -1.0), new Vector2(-1.0, 0.0),
      new Vector2(-1.0, -1.0), new Vector2(0.0, 0.0));

    expect(p).to.equal(null);

    p = Segment.getLineIntersection(
      new Vector2(3.0, 0.0), new Vector2(3.0, 1.0),
      new Vector2(2.0, 0.0), new Vector2(2.0, 1.0));

    expect(p).to.equal(null);

    p = Segment.getLineIntersection(
      new Vector2(3.0, 1.0), new Vector2(4.0, 1.0),
      new Vector2(2.0, 2.0), new Vector2(4.0, 2.0));

    expect(p).to.equal(null);

    p = Segment.getLineIntersection(
      new Vector2(-1.0, -1.0), new Vector2(1.0, 1.0),
      new Vector2(-2.0, -2.0), new Vector2(-1.5, -1.5));

    expect(p).to.equal(null);

    p = Segment.getLineIntersection(
      new Vector2(3.0, 0.0), new Vector2(3.0, 1.0),
      new Vector2(3.0, 2.0), new Vector2(3.0, 7.0));

    expect(p).to.equal(null);

    p = Segment.getLineIntersection(
      new Vector2(4.0, 1.0), new Vector2(5.0, 1.0),
      new Vector2(-1.0, 1.0), new Vector2(1.0, 1.0));

    expect(p).to.equal(null);

    p = Segment.getLineIntersection(
      new Vector2(4.0, 1.0), new Vector2(5.0, 1.0),
      new Vector2(-1.0, 1.0), new Vector2(1.0, 1.0));

    expect(p).to.equal(null);


  });

  it('getSegmentIntersection', () => {
    let p = Segment.getSegmentIntersection(
      new Vector2(-3.0, -1.0), new Vector2(3.0, 1.0),
      new Vector2(-1.0, -2.0), new Vector2(1.0, 2.0));

    expect(p.x).to.closeTo(0.0, 1.0e-3);
    expect(p.y).to.closeTo(0.0, 1.0e-3);

    p = Segment.getSegmentIntersection(
      new Vector2(-3.0, -1.0), new Vector2(3.0, 1.0),
      new Vector2(-1.0, -2.0), new Vector2(1.0, 2.0),
      false);

    expect(p.x).to.closeTo(0.0, 1.0e-3);
    expect(p.y).to.closeTo(0.0, 1.0e-3);

    p = Segment.getSegmentIntersection(
      new Vector2(-1.0, -1.0), new Vector2(2.0, 0.0),
      new Vector2(-1.0, 0.0), new Vector2(1.0, 0.5));

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(-1.0, -1.0), new Vector2(2.0, 0.0),
      new Vector2(-1.0, 0.0), new Vector2(1.0, 0.5),
      false);

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(-1.0, 1.0), new Vector2(2.0, 1.0),
      new Vector2(-1.0, 0.0), new Vector2(1.0, 2.0));

    expect(p.x).to.closeTo(0.0, 1.0e-3);
    expect(p.y).to.closeTo(1.0, 1.0e-3);

    p = Segment.getSegmentIntersection(
      new Vector2(-1.0, 1.0), new Vector2(2.0, 1.0),
      new Vector2(-1.0, 0.0), new Vector2(1.0, 2.0),
      false);

    expect(p.x).to.closeTo(0.0, 1.0e-3);
    expect(p.y).to.closeTo(1.0, 1.0e-3);

    p = Segment.getSegmentIntersection(
      new Vector2(3.0, 0.0), new Vector2(3.0, 3.0),
      new Vector2(4.0, 0.0), new Vector2(1.0, 3.0));

    expect(p.x).to.closeTo(3.0, 1.0e-3);
    expect(p.y).to.closeTo(1.0, 1.0e-3);

    p = Segment.getSegmentIntersection(
      new Vector2(3.0, 0.0), new Vector2(3.0, 3.0),
      new Vector2(4.0, 0.0), new Vector2(1.0, 3.0),
      false);

    expect(p.x).to.closeTo(3.0, 1.0e-3);
    expect(p.y).to.closeTo(1.0, 1.0e-3);

    p = Segment.getSegmentIntersection(
      new Vector2(3.0, 2.0), new Vector2(3.0, -2.0),
      new Vector2(0.0, 1.0), new Vector2(4.0, 1.0));

    expect(p.x).to.closeTo(3.0, 1.0e-3);
    expect(p.y).to.closeTo(1.0, 1.0e-3);

    p = Segment.getSegmentIntersection(
      new Vector2(3.0, 2.0), new Vector2(3.0, -2.0),
      new Vector2(0.0, 1.0), new Vector2(4.0, 1.0),
      false);

    expect(p.x).to.closeTo(3.0, 1.0e-3);
    expect(p.y).to.closeTo(1.0, 1.0e-3);

    p = Segment.getSegmentIntersection(
      new Vector2(-2.0, -1.0), new Vector2(-1.0, 0.0),
      new Vector2(-1.0, -1.0), new Vector2(0.0, 0.0));

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(-2.0, -1.0), new Vector2(-1.0, 0.0),
      new Vector2(-1.0, -1.0), new Vector2(0.0, 0.0),
      false);

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(3.0, 0.0), new Vector2(3.0, 1.0),
      new Vector2(2.0, 0.0), new Vector2(2.0, 1.0));

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(3.0, 0.0), new Vector2(3.0, 1.0),
      new Vector2(2.0, 0.0), new Vector2(2.0, 1.0),
      false);

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(3.0, 1.0), new Vector2(4.0, 1.0),
      new Vector2(3.0, 2.0), new Vector2(4.0, 2.0));

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(3.0, 1.0), new Vector2(4.0, 1.0),
      new Vector2(3.0, 2.0), new Vector2(4.0, 2.0),
      false);

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(-1.0, -1.0), new Vector2(1.0, 1.0),
      new Vector2(-2.0, -2.0), new Vector2(-1.5, -1.5));

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(-1.0, -1.0), new Vector2(1.0, 1.0),
      new Vector2(-2.0, -2.0), new Vector2(-1.5, -1.5),
      false);

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(3.0, 0.0), new Vector2(3.0, 1.0),
      new Vector2(3.0, -1.0), new Vector2(3.0, 7.0));

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(3.0, 0.0), new Vector2(3.0, 1.0),
      new Vector2(3.0, -1.0), new Vector2(3.0, 7.0),
      false);

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(-1.0, 1.0), new Vector2(5.0, 1.0),
      new Vector2(-1.0, 1.0), new Vector2(1.0, 1.0));

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(-1.0, 1.0), new Vector2(5.0, 1.0),
      new Vector2(-1.0, 1.0), new Vector2(1.0, 1.0),
      false);

    expect(p).to.equal(null);

    p = Segment.getSegmentIntersection(
      new Vector2(1.0, 0.0), new Vector2(3.0, -2.0),
      new Vector2(-1.0, -1.0), new Vector2(1.0, 0.0));

    expect(p.x).to.closeTo(1.0, 1.0e-3);
    expect(p.y).to.closeTo(0.0, 1.0e-3);

    p = Segment.getSegmentIntersection(
      new Vector2(1.0, 0.0), new Vector2(3.0, -2.0),
      new Vector2(-1.0, -1.0), new Vector2(1.0, 0.0),
      false);

    expect(p).to.equal(null);

    const s1 = new Segment(new Vector2(-10, 10), new Vector2(10, 10));
    const s2 = new Segment(new Vector2(0, 0), new Vector2(0, 5));
    p = s2.getSegmentIntersection(s1);
    expect(p).to.equal(null);
  });

  it('createMass', () => {
    const s = new Segment(new Vector2(-1.0, 0.0), new Vector2(1.0, 0.5));
    const m = s.createMass(1.0);

    expect(m.getMass()).to.closeTo(2.061, 1.0e-3);
    expect(m.getInertia()).to.closeTo(0.730, 1.0e-3);

    const m2 = s.createMass(0);
    expect(m2.getMass()).to.closeTo(0.000, 1.0e-3);
    expect(m2.getInertia()).to.closeTo(0.000, 1.0e-3);
    expect(m2.getInverseMass()).to.closeTo(0.000, 1.0e-3);
    expect(m2.getInverseInertia()).to.closeTo(0.000, 1.0e-3);
    expect(m2.getCenter().x).to.closeTo(0.000, 1.0e-3);
    expect(m2.getCenter().y).to.closeTo(0.250, 1.0e-3);
    expect(m2.getType()).to.equal(MassType.INFINITE);
  });

  it('getArea', () => {
    const s = new Segment(new Vector2(-1.0, 0.0), new Vector2(1.0, 0.5));
    expect(s.getArea()).to.equal(0.0);
  });

  it('getNormals', () => {
    const p = new Segment(
      new Vector2(0.0, 1.0),
      new Vector2(-1.0, 0.0));
    const normals = p.getNormals();

    expect(normals.length).to.equal(2);
    expect(normals[0].x).to.closeTo(-0.707, 1e-3);
    expect(normals[0].y).to.closeTo(-0.707, 1e-3);
    expect(normals[1].x).to.closeTo(0.707, 1e-3);
    expect(normals[1].y).to.closeTo(-0.707, 1e-3);

    const iterator = p.getNormalIterator();

    expect(iterator).to.not.equal(null);
    expect(iterator.next()).to.not.equal(null);
    expect(iterator.next()).to.not.equal(null);
  });
});