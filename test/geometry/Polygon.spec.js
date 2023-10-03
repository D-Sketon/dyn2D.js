'use strict';

const { expect } = require('chai');

require('chai').should();

describe('Polygon', () => {
  const Polygon = require('../../dist/geometry/Polygon').Polygon;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const Transform = require('../../dist/geometry/Transform').Transform;
  const MassType = require('../../dist/geometry/MassType').MassType;
  const { createUnitCirclePolygon } = require('../../dist/geometry/Geometry');
  const IDENTITY = new Transform();

  it('createNotEnoughPoints', () => {
    try {
      new Polygon([new Vector2(), new Vector2()]);
    } catch (e) {
      e.message.should.equal('Polygon: Polygon must have at least 3 vertices');
    }
  });

  it('createNotCCW', () => {
    try {
      new Polygon(new Vector2(), new Vector2(2, 2), new Vector2(1, 0));
    } catch (e) {
      e.message.should.equal('Polygon: Polygon must have counter-clockwise winding');
    }
  });

  it('createCCW', () => {
    new Polygon(new Vector2(0.5, 0.5), new Vector2(-0.3, -0.5), new Vector2(1.0, -0.3));
  });

  it('createCoincident', () => {
    try {
      new Polygon(new Vector2(), new Vector2(2.0, 2.0), new Vector2(2.0, 2.0), new Vector2(1.0, 0.0));
    } catch (e) {
      e.message.should.equal('Polygon: Polygon cannot have coincident vertices');
    }
  });

  it('createNonConvex', () => {
    try {
      new Polygon(new Vector2(1.0, 1.0), new Vector2(-1.0, 1.0), new Vector2(-0.5, 0.0), new Vector2(-1.0, -1.0), new Vector2(1.0, -1.0));
    } catch (e) {
      e.message.should.equal('Polygon: Polygon must be convex');
    }
  });

  it('createDegenerate', () => {
    try {
      new Polygon(new Vector2(1.0, 0.0), new Vector2(2.0, 0.0), new Vector2(3.0, 0.0));
    } catch (e) {
      e.message.should.equal('Polygon: Polygon has zero or near zero area');
    }
  });

  it('createNullPoints', () => {
    try {
      new Polygon(null);
    } catch (e) {
      e.message.should.equal('Polygon: Polygon must have at least 3 vertices');
    }
  });

  it('createNullPoint', () => {
    try {
      new Polygon(new Vector2(1.0, 0.0), null, new Vector2(1.0, 0.0));
    } catch (e) {
      e.message.should.equal('Polygon: Polygon cannot have null vertices');
    }
  });

  it('createSuccess', () => {
    new Polygon(new Vector2(0.0, 1.0), new Vector2(-2.0, -2.0), new Vector2(1.0, -2.0));
  });

  it('contains', () => {
    const vertices = [
      new Vector2(0.0, 1.0),
      new Vector2(-1.0, 0.0),
      new Vector2(1.0, 0.0)
    ];
    const p = new Polygon(...vertices);

    const t = new Transform();
    const pt = new Vector2(2.0, 4.0);

    // shouldn't be in the polygon
    p.contains(pt, t).should.equal(false);
    p.contains(pt, t, false).should.equal(false);

    // move the polygon a bit
    t.translate(2.0, 3.5);

    // should be in the polygon
    p.contains(pt, t).should.equal(true);
    p.contains(pt, t, false).should.equal(true);

    t.translate(0.0, -0.5);

    // should be on a vertex
    p.contains(pt, t).should.equal(true);
    p.contains(pt, t, false).should.equal(false);

    t.translate(0.5, 0.5);

    // should be on an edge
    p.contains(pt, t).should.equal(true);
    p.contains(pt, t, false).should.equal(false);

    t.translate(-1.0, -1.0);

    // should be outside, but colinear
    p.contains(pt, t).should.equal(false);
    p.contains(pt, t, false).should.equal(false);
  });

  it('project', () => {
    const vertices = [
      new Vector2(0.0, 1.0),
      new Vector2(-1.0, 0.0),
      new Vector2(1.0, 0.0)
    ];
    const p = new Polygon(...vertices);
    const t = new Transform();
    const x = new Vector2(1.0, 0.0);
    const y = new Vector2(0.0, 1.0);

    t.translate(1.0, 0.5);

    const i = p.project(x, t);

    i.min.should.equal(0.0);
    i.max.should.equal(2.0);

    t.rotate(90 / 180 * Math.PI, 1.0, 0.5);

    const i2 = p.project(y, t);

    i2.min.should.equal(-0.5);
    i2.max.should.equal(1.5);
  });

  it('getFarthest', () => {
    const vertices = [
      new Vector2(0.0, 1.0),
      new Vector2(-1.0, -1.0),
      new Vector2(1.0, -1.0)
    ];
    const p = new Polygon(...vertices);
    const t = new Transform();
    const y = new Vector2(0.0, -1.0);

    const f = p.getFarthestFeature(y, t);
    f.max.point.x.should.equal(-1.0);
    f.max.point.y.should.equal(-1.0);
    f.vertex1.point.x.should.equal(-1.0);
    f.vertex1.point.y.should.equal(-1.0);
    f.vertex2.point.x.should.equal(1.0);
    f.vertex2.point.y.should.equal(-1.0);

    const pt = p.getFarthestPoint(y, t);

    pt.x.should.equal(-1.0);
    pt.y.should.equal(-1.0);

    t.rotate(Math.PI / 2, 0, 0);

    const pt2 = p.getFarthestPoint(y, t);

    pt2.x.should.closeTo(1.0, 1.0e-3);
    pt2.y.should.closeTo(-1.0, 1.0e-3);
  });

  it('getAxes', () => {
    const vertices = [
      new Vector2(0.0, 1.0),
      new Vector2(-1.0, -1.0),
      new Vector2(1.0, -1.0)
    ];
    const p = new Polygon(...vertices);
    const t = new Transform();

    let axes = p.getAxes(null, t);
    axes.length.should.equal(3);

    const pt = new Vector2(-3.0, 2.0);
    axes = p.getAxes([pt], t);
    axes.length.should.equal(4);

    const ab = p.vertices[0].to(p.vertices[1]);
    const bc = p.vertices[1].to(p.vertices[2]);
    const ca = p.vertices[2].to(p.vertices[0]);

    ab.dot(axes[0]).should.equal(0.0);
    bc.dot(axes[1]).should.equal(0.0);
    ca.dot(axes[2]).should.equal(0.0);

    p.vertices[0].to(pt).cross(axes[3]).should.equal(0.0);
  });

  it('getFoci', () => {
    const vertices = [
      new Vector2(0.0, 1.0),
      new Vector2(-1.0, -1.0),
      new Vector2(1.0, -1.0)
    ];
    const p = new Polygon(...vertices);
    const t = new Transform();

    const foci = p.getFoci(t);
    expect(foci).to.be.null;
  });

  it('rotate', () => {
    const vertices = [
      new Vector2(0.0, 1.0),
      new Vector2(-1.0, -1.0),
      new Vector2(1.0, -1.0)
    ];
    const p = new Polygon(...vertices);

    // should move the points
    p.rotate(Math.PI / 2, 0, 0);

    p.vertices[0].x.should.closeTo(-1.0, 1.0e-3);
    p.vertices[0].y.should.closeTo(0.0, 1.0e-3);

    p.vertices[1].x.should.closeTo(1.0, 1.0e-3);
    p.vertices[1].y.should.closeTo(-1.0, 1.0e-3);

    p.vertices[2].x.should.closeTo(1.0, 1.0e-3);
    p.vertices[2].y.should.closeTo(1.0, 1.0e-3);
  });

  it('translate', () => {
    const vertices = [
      new Vector2(0.0, 1.0),
      new Vector2(-1.0, -1.0),
      new Vector2(1.0, -1.0)
    ];
    const p = new Polygon(...vertices);
    p.translate(1.0, -0.5);

    p.vertices[0].x.should.closeTo(1.000, 1.0e-3);
    p.vertices[0].y.should.closeTo(0.500, 1.0e-3);

    p.vertices[1].x.should.closeTo(0.000, 1.0e-3);
    p.vertices[1].y.should.closeTo(-1.500, 1.0e-3);

    p.vertices[2].x.should.closeTo(2.000, 1.0e-3);
    p.vertices[2].y.should.closeTo(-1.500, 1.0e-3);
  });

  it('createAABB', () => {
    const vertices = [
      new Vector2(0.0, 1.0),
      new Vector2(-1.0, -1.0),
      new Vector2(1.0, -1.0)
    ];
    const p = new Polygon(...vertices);

    const aabb = p.createAABB(IDENTITY);
    aabb.getMinX().should.closeTo(-1.0, 1.0e-3);
    aabb.getMinY().should.closeTo(-1.0, 1.0e-3);
    aabb.getMaxX().should.closeTo(1.0, 1.0e-3);
    aabb.getMaxY().should.closeTo(1.0, 1.0e-3);

    const aabb2 = p.createAABB();
    aabb.getMinX().should.closeTo(aabb2.getMinX(), 1.0e-3);
    aabb.getMinY().should.closeTo(aabb2.getMinY(), 1.0e-3);
    aabb.getMaxX().should.closeTo(aabb2.getMaxX(), 1.0e-3);
    aabb.getMaxY().should.closeTo(aabb2.getMaxY(), 1.0e-3);

    const tx = new Transform();
    tx.rotate(Math.PI / 6);
    tx.translate(1.0, 2.0);
    const aabb3 = p.createAABB(tx);
    aabb3.getMinX().should.closeTo(0.5, 1.0e-3);
    aabb3.getMinY().should.closeTo(0.634, 1.0e-3);
    aabb3.getMaxX().should.closeTo(2.366, 1.0e-3);
    aabb3.getMaxY().should.closeTo(2.866, 1.0e-3);
  });

  it('containsPointCoIncidentStart', () => {
    const vertices = [
      new Vector2(2.0, 0.0),
      new Vector2(4.0, 0.0),
      new Vector2(7.0, 3.0),
      new Vector2(7.0, 5.0),
      new Vector2(5.0, 7.0),
      new Vector2(3.0, 7.0),
      new Vector2(0.0, 4.0),
      new Vector2(0.0, 2.0)
    ];
    const p = new Polygon(...vertices);

    p.contains(new Vector2(0.0, 0.0)).should.equal(false);
  });

  it('containsPointCoIncidentMid', () => {
    const vertices = [
      new Vector2(0.0, 4.0),
      new Vector2(0.0, 2.0),
      new Vector2(2.0, 0.0),
      new Vector2(4.0, 0.0),
      new Vector2(7.0, 3.0),
      new Vector2(7.0, 5.0),
      new Vector2(5.0, 7.0),
      new Vector2(3.0, 7.0)
    ];
    const p = new Polygon(...vertices);

    p.contains(new Vector2(0.0, 0.0)).should.equal(false);
  });

  it('containsPointCoIncidentWithCoincidentEdges', () => {
    const vertices = [
      new Vector2(2.0, 0.0),
      new Vector2(4.0, 0.0),
      new Vector2(5.0, 0.0),
      new Vector2(7.0, 3.0),
      new Vector2(7.0, 5.0),
      new Vector2(5.0, 7.0),
      new Vector2(3.0, 7.0),
      new Vector2(0.0, 4.0),
      new Vector2(0.0, 2.0)
    ];
    const p = new Polygon(...vertices);

    p.contains(new Vector2(0.0, 0.0)).should.equal(false);
  });

  it('containsPointCoIncidentWithCoincidentEdges2', () => {
    const vertices = [
      new Vector2(2.0, 0.0),
      new Vector2(4.0, 0.0),
      new Vector2(5.0, 0.0),
      new Vector2(7.0, 3.0),
      new Vector2(7.0, 5.0),
      new Vector2(5.0, 7.0),
      new Vector2(3.0, 7.0),
      new Vector2(0.0, 4.0),
      new Vector2(0.0, 2.0)
    ];
    const p = new Polygon(...vertices);

    p.contains(new Vector2(4.5, 0.0)).should.equal(true);
  });

  it('getNormals', () => {
    const vertices = [
      new Vector2(0.0, 1.0),
      new Vector2(-1.0, 0.0),
      new Vector2(1.0, 0.0)
    ];
    const p = new Polygon(...vertices);

    const normals = p.getNormals();

    expect(normals).to.be.an('array');
    normals.length.should.equal(3);
    normals[0].x.should.closeTo(-0.707, 1.0e-3);
    normals[0].y.should.closeTo(0.707, 1.0e-3);
    normals[1].x.should.closeTo(0.0, 1.0e-3);
    normals[1].y.should.closeTo(-1.0, 1.0e-3);
    normals[2].x.should.closeTo(0.707, 1.0e-3);
    normals[2].y.should.closeTo(0.707, 1.0e-3);

    const iterator = p.getNormalIterator();

    expect(iterator).to.be.an('object');
    iterator.next().value.x.should.closeTo(-0.707, 1.0e-3);
    iterator.next().value.x.should.closeTo(0.0, 1.0e-3);
    iterator.next().value.x.should.closeTo(0.707, 1.0e-3);
    iterator.next().done.should.equal(true);
  });

  it('createMass', () => {
    const p = createUnitCirclePolygon(5, 0.5);
    const m = p.createMass(1.0);
    m.getMass().should.closeTo(0.594, 1.0e-3);
    m.getInertia().should.closeTo(0.057, 1.0e-3);

    const m2 = p.createMass(0);
    m2.getMass().should.closeTo(0.000, 1.0e-3);
    m2.getInertia().should.closeTo(0.000, 1.0e-3);
    m2.getInverseMass().should.closeTo(0.000, 1.0e-3);
    m2.getInverseInertia().should.closeTo(0.000, 1.0e-3);
    m2.getCenter().x.should.closeTo(0.000, 1.0e-3);
    m2.getCenter().y.should.closeTo(0.000, 1.0e-3);
    m2.getType().should.equal(MassType.INFINITE);
  });

  it('getArea', () => {
    const p = createUnitCirclePolygon(5, 0.5);
    p.getArea().should.closeTo(0.594, 1.0e-3);
  });
});