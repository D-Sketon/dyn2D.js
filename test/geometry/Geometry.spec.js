'use strict';

const { expect } = require('chai');

require('chai').should();

describe('Geometry', () => {
  const Geometry = require('../../dist/geometry/Geometry');
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const Polygon = require('../../dist/geometry/Polygon').Polygon;
  const Transform = require('../../dist/geometry/Transform').Transform;

  it('getWindingArray', () => {
    const points = [];
    points.push(new Vector2(-1.0, -1.0));
    points.push(new Vector2(1.0, -1.0));
    points.push(new Vector2(1.0, 1.0));
    points.push(new Vector2(-1.0, 1.0));
    Geometry.getWinding(points).should.be.greaterThan(0);
    Geometry.getWinding(...points).should.be.greaterThan(0);

    points.reverse();
    Geometry.getWinding(points).should.be.lessThan(0);
    Geometry.getWinding(...points).should.be.lessThan(0);
  });

  it('getWindingNullArray', () => {
    try {
      Geometry.getWinding(null, null);
    } catch (e) {
      e.message.should.equal('Geometry.getWinding: points[0]');
    }
  });

  it('getWindingArrayLessThan2Points', () => {
    try {
      const points = [];
      points[0] = new Vector2(-1.0, -1.0);
      Geometry.getWinding(points);
    } catch (e) {
      e.message.should.equal('Geometry.getWinding: points.length < 2');
    }
  });

  it('getWindingArrayNullPoint', () => {
    try {
      const points = [];
      points.push(new Vector2(-1.0, -1.0));
      points.push(null);
      points.push(null);
      points.push(null);
      Geometry.getWinding(points);
    } catch (e) {
      e.message.should.equal('Geometry.getWinding: points[1]');
    }
  });

  it('reverseWindingArray', () => {
    const points = [];
    points.push(new Vector2(-1.0, -1.0));
    points.push(new Vector2(1.0, -1.0));
    points.push(new Vector2(1.0, 1.0));
    points.push(new Vector2(-1.0, 1.0));
    Geometry.reverseWinding(points);

    points[0].x.should.equal(-1.0);
    points[0].y.should.equal(1.0);
    points[1].x.should.equal(1.0);
    points[1].y.should.equal(1.0);
    points[2].x.should.equal(1.0);
    points[2].y.should.equal(-1.0);
    points[3].x.should.equal(-1.0);
    points[3].y.should.equal(-1.0);
  });

  it('reverseWindingEmptyOrOneElement', () => {

  });

  it('getAverageCenterArray', () => {
    const vertices = [];
    vertices.push(new Vector2(-2.0, 1.0));
    vertices.push(new Vector2(-1.0, 2.0));
    vertices.push(new Vector2(1.2, 0.5));
    vertices.push(new Vector2(1.3, 0.3));
    vertices.push(new Vector2(1.4, 0.2));
    vertices.push(new Vector2(0.0, -1.0));

    const c = Geometry.getAverageCenter(...vertices);
    c.x.should.closeTo(0.150, 1.0e-3);
    c.y.should.closeTo(0.500, 1.0e-3);

    const c2 = Geometry.getAverageCenter(vertices);
    c2.x.should.closeTo(0.150, 1.0e-3);
    c2.y.should.closeTo(0.500, 1.0e-3);

    const c3 = Geometry.getAverageCenter(vertices[0]);
    c3.x.should.closeTo(-2.000, 1.0e-3);
    c3.y.should.closeTo(1.000, 1.0e-3);
  });

  it('getAverageCenterNullArray', () => {
    try {
      Geometry.getAverageCenter(null);
    } catch (e) {
      e.message.should.equal('Geometry.getAverageCenter: points[0]')
    }
  });

  it('getAverageCenterEmptyArray', () => {
    try {
      Geometry.getAverageCenter([]);
    } catch (e) {
      e.message.should.equal('Geometry.getAverageCenter: points.length === 0')
    }
  });

  it('getAverageCenterArrayNullElements', () => {
    try {
      Geometry.getAverageCenter([new Vector2(1.0, 0.0),
        null,
      new Vector2(4.0, 3.0),
      new Vector2(-2.0, -1.0),
        null]);
    } catch (e) {
      e.message.should.equal('Geometry.getAverageCenter: points[1]')
    }
  });

  it('getAverageCenterArrayNullOnlyElement', () => {
    try {
      Geometry.getAverageCenter([null]);
    } catch (e) {
      e.message.should.equal('Geometry.getAverageCenter: points[0]')
    }
  });

  it('getAreaWeightedCenter', () => {
    const vertices = [];
    vertices.push(new Vector2(-2.0, 1.0));
    vertices.push(new Vector2(-1.0, 2.0));
    vertices.push(new Vector2(1.2, 0.5));
    vertices.push(new Vector2(1.3, 0.3));
    vertices.push(new Vector2(1.4, 0.2));
    vertices.push(new Vector2(0.0, -1.0));

    const c = Geometry.getAreaWeightedCenter(...vertices);

    c.x.should.closeTo(-0.318, 1.0e-3);
    c.y.should.closeTo(0.527, 1.0e-3);

    const c2 = Geometry.getAreaWeightedCenter(vertices);

    c2.x.should.closeTo(-0.318, 1.0e-3);
    c2.y.should.closeTo(0.527, 1.0e-3);
  });

  it('getAreaWeightedCenterOffset', () => {
    const vertices = [];
    vertices.push(new Vector2(-1.0, 2.0));
    vertices.push(new Vector2(0.0, 3.0));
    vertices.push(new Vector2(2.2, 1.5));
    vertices.push(new Vector2(2.3, 1.3));
    vertices.push(new Vector2(2.4, 1.2));
    vertices.push(new Vector2(1.0, 0.0));

    const c = Geometry.getAreaWeightedCenter(...vertices);
    c.x.should.closeTo(0.682, 1.0e-3);
    c.y.should.closeTo(1.527, 1.0e-3);

    const c2 = Geometry.getAreaWeightedCenter(vertices);
    c2.x.should.closeTo(0.682, 1.0e-3);
    c2.y.should.closeTo(1.527, 1.0e-3);
  });

  it('getAreaWeightedCenterNullArray', () => {
    try {
      Geometry.getAreaWeightedCenter(null);
    } catch (e) {
      e.message.should.equal('Geometry.getAverageCenter: points[0]')
    }
  });

  it('getAreaWeightedCenterEmptyArray', () => {
    try {
      Geometry.getAreaWeightedCenter([]);
    } catch (e) {
      e.message.should.equal('Geometry.getAverageCenter: points.length === 0')
    }
  });

  it('getAreaWeightedCenterArrayNullElements', () => {
    try {
      Geometry.getAreaWeightedCenter([new Vector2(1.0, 0.0),
        null,
      new Vector2(4.0, 3.0),
      new Vector2(-2.0, -1.0),
        null]);
    } catch (e) {
      e.message.should.equal('Geometry.getAverageCenter: points[1]')
    }
  });

  it('createUnitCirclePolygon', () => {
    const p = Geometry.createUnitCirclePolygon(5, 0.5);
    p.vertices[4].x.should.closeTo(0.154, 1.0e-3);
    p.vertices[4].y.should.closeTo(-0.475, 1.0e-3);
    p.vertices[3].x.should.closeTo(-0.404, 1.0e-3);
    p.vertices[3].y.should.closeTo(-0.293, 1.0e-3);
    p.vertices[2].x.should.closeTo(-0.404, 1.0e-3);
    p.vertices[2].y.should.closeTo(0.293, 1.0e-3);
    p.vertices[1].x.should.closeTo(0.154, 1.0e-3);
    p.vertices[1].y.should.closeTo(0.475, 1.0e-3);
    p.vertices[0].x.should.closeTo(0.500, 1.0e-3);
    p.vertices[0].y.should.closeTo(0.000, 1.0e-3);

    const v11 = p.vertices[0];

    const p2 = Geometry.createUnitCirclePolygon(5, 0.5, Math.PI / 2.0);

    p2.vertices[4].x.should.closeTo(0.475, 1.0e-3);
    p2.vertices[4].y.should.closeTo(0.154, 1.0e-3);
    p2.vertices[3].x.should.closeTo(0.293, 1.0e-3);
    p2.vertices[3].y.should.closeTo(-0.404, 1.0e-3);
    p2.vertices[2].x.should.closeTo(-0.293, 1.0e-3);
    p2.vertices[2].y.should.closeTo(-0.404, 1.0e-3);
    p2.vertices[1].x.should.closeTo(-0.475, 1.0e-3);
    p2.vertices[1].y.should.closeTo(0.154, 1.0e-3);
    p2.vertices[0].x.should.closeTo(0.000, 1.0e-3);
    p2.vertices[0].y.should.closeTo(0.500, 1.0e-3);

    const v21 = p2.vertices[0];

    const angle = v11.getAngleBetween(v21);
    angle.should.closeTo(Math.PI / 2.0, 1.0e-3);
  });

  it('createNegativeRadiusUnitCirclePolygon', () => {
    try {
      Geometry.createUnitCirclePolygon(5, -0.5);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCircle: radius must be positive.');
    }
  });

  it('createZeroRadiusUnitCirclePolygon', () => {
    try {
      Geometry.createUnitCirclePolygon(5, 0.0);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCircle: radius must be positive.');
    }
  });

  it('createLessThan3PointsUnitCirclePolygon', () => {
    try {
      Geometry.createUnitCirclePolygon(2, 0.5);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCircle: count must be greater than or equal to 3.');
    }
  });

  it('createCircle', () => {
    Geometry.createCircle(1.0);
  });

  it('createNegativeRadiusCircle', () => {
    try {
      Geometry.createCircle(-1.0);
    } catch (e) {
      e.message.should.equal('Circle: Radius must be positive.');
    }
  });

  it('createZeroRadiusCircle', () => {
    try {
      Geometry.createCircle(0.0);
    } catch (e) {
      e.message.should.equal('Circle: Radius must be positive.');
    }
  });

  it('createPolygonNullArray', () => {
    try {
      Geometry.createPolygon(null);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygon: vertices[0]');
    }
  });

  it('createPolygonNullPoint', () => {
    try {
      Geometry.createPolygon(...new Array(5));
    } catch (e) {
      e.message.should.equal('Geometry.createPolygon: vertices[0]');
    }
  });

  it('createPolygon', () => {
    const vertices = [];
    vertices.push(new Vector2(1.0, 0.0));
    vertices.push(new Vector2(0.5, 1.0));
    vertices.push(new Vector2(-0.5, 1.0));
    vertices.push(new Vector2(-1.0, 0.0));
    vertices.push(new Vector2(0.0, -1.0));

    const p = Geometry.createPolygon(...vertices);

    p.vertices[0].x.should.closeTo(1.0, 1.0e-3);
    p.vertices[0].y.should.closeTo(0.0, 1.0e-3);
    p.vertices[1].x.should.closeTo(0.5, 1.0e-3);
    p.vertices[1].y.should.closeTo(1.0, 1.0e-3);
    p.vertices[2].x.should.closeTo(-0.5, 1.0e-3);
    p.vertices[2].y.should.closeTo(1.0, 1.0e-3);
    p.vertices[3].x.should.closeTo(-1.0, 1.0e-3);
    p.vertices[3].y.should.closeTo(0.0, 1.0e-3);
    p.vertices[4].x.should.closeTo(0.0, 1.0e-3);
    p.vertices[4].y.should.closeTo(-1.0, 1.0e-3);
  });

  it('createPolygonAtOrigin', () => {
    const vertices = [];
    vertices.push(new Vector2(1.0, 0.0));
    vertices.push(new Vector2(0.5, 1.0));
    vertices.push(new Vector2(-0.5, 1.0));
    vertices.push(new Vector2(-1.0, 0.0));
    vertices.push(new Vector2(0.0, -1.0));

    const p = Geometry.createPolygonAtOrigin(...vertices);

    for (let i = 0; i < 5; i++) {
      (p.vertices[0] == vertices[0]).should.be.false;
    }

    const c = p.getCenter();
    c.x.should.closeTo(0.0, 1.0e-3);
    c.y.should.closeTo(0.0, 1.0e-3);
  });

  it('createZeroSizeSquare', () => {
    try {
      Geometry.createSquare(0.0);
    } catch (e) {
      e.message.should.equal('Geometry.createSquare: size must be positive.');
    }
  });

  it('createNegativeSizeSquare', () => {
    try {
      Geometry.createSquare(-1.0);
    } catch (e) {
      e.message.should.equal('Geometry.createSquare: size must be positive.');
    }
  });

  it('createSquare', () => {
    const r = Geometry.createSquare(1.0);
    r.width.should.closeTo(1.000, 1.0e-3);
    r.height.should.closeTo(1.000, 1.0e-3);
  });

  it('createRectangle', () => {
    Geometry.createRectangle(1.0, 2.0);
  });

  it('createNegativeWidthRectangle', () => {
    try {
      Geometry.createRectangle(-1.0, 2.0);
    } catch (e) {
      e.message.should.equal('Rectangle: Width must be positive.');
    }
  });

  it('createNegativeHeightRectangle', () => {
    try {
      Geometry.createRectangle(1.0, -2.0);
    } catch (e) {
      e.message.should.equal('Rectangle: Height must be positive.');
    }
  });

  it('createZeroWidthRectangle', () => {
    try {
      Geometry.createRectangle(0.0, 2.0);
    } catch (e) {
      e.message.should.equal('Rectangle: Width must be positive.');
    }
  });

  it('createZeroHeightRectangle', () => {
    try {
      Geometry.createRectangle(1.0, 0.0);
    } catch (e) {
      e.message.should.equal('Rectangle: Height must be positive.');
    }
  });

  it('createTriangleNullPoint', () => {
    try {
      const p1 = new Vector2(1.0, 0.0);
      const p2 = new Vector2(0.5, 1.0);
      Geometry.createTriangle(p1, p2, null);
    } catch (e) {
      e.message.should.equal('Geometry.createTriangle: p3 is null.');
    }
  });

  it('createTriangle', () => {
    const p1 = new Vector2(1.0, 0.0);
    const p2 = new Vector2(0.5, 1.0);
    const p3 = new Vector2(-0.5, 1.0);
    const t = Geometry.createTriangle(p1, p2, p3);

    t.vertices[0].x.should.closeTo(1.0, 1.0e-3);
    t.vertices[0].y.should.closeTo(0.0, 1.0e-3);
    t.vertices[1].x.should.closeTo(0.5, 1.0e-3);
  });

  it('createTriangleAtOrigin', () => {
    const p1 = new Vector2(1.0, 0.0);
    const p2 = new Vector2(0.5, 1.0);
    const p3 = new Vector2(-0.5, 1.0);
    const t = Geometry.createTriangleAtOrigin(p1, p2, p3);

    (t.vertices[0] == p1).should.be.false;
    (t.vertices[1] == p2).should.be.false;
    (t.vertices[2] == p3).should.be.false;

    const c = t.getCenter();
    c.x.should.closeTo(0.000, 1.0e-3);
    c.y.should.closeTo(0.000, 1.0e-3);
  });

  it('createZeroWidthRightTriangle', () => {
    try {
      Geometry.createRightTriangle(0.0, 2.0);
    } catch (e) {
      e.message.should.equal('Geometry.createRightTriangle: width must be positive.');
    }
  });

  it('createZeroHeightRightTriangle', () => {
    try {
      Geometry.createRightTriangle(1.0, 0.0);
    } catch (e) {
      e.message.should.equal('Geometry.createRightTriangle: height must be positive.');
    }
  });

  it('createNegativeWidthRightTriangle', () => {
    try {
      Geometry.createRightTriangle(-1.0, 2.0);
    } catch (e) {
      e.message.should.equal('Geometry.createRightTriangle: width must be positive.');
    }
  });

  it('createNegativeHeightRightTriangle', () => {
    try {
      Geometry.createRightTriangle(2.0, -2.0);
    } catch (e) {
      e.message.should.equal('Geometry.createRightTriangle: height must be positive.');
    }
  });

  it('createRightTriangle', () => {
    const t = Geometry.createRightTriangle(1.0, 2.0);

    const center = t.getCenter();
    center.x.should.closeTo(0.000, 1.0e-3);
    center.y.should.closeTo(0.000, 1.0e-3);

    const v1 = t.vertices[0];
    const v2 = t.vertices[1];
    const v3 = t.vertices[2];

    const e1 = v1.to(v2);
    const e2 = v2.to(v3);
    const e3 = v3.to(v1);

    if (e1.dot(e2) < 0.00001 && e1.dot(e2) > -0.00001) {
      true.should.be.true;
      return;
    }

    if (e2.dot(e3) < 0.00001 && e2.dot(e3) > -0.00001) {
      true.should.be.true;
      return;
    }

    if (e3.dot(e1) < 0.00001 && e3.dot(e1) > -0.00001) {
      true.should.be.true;
      return;
    }

    false.should.be.true;
  });

  it('createRightTriangleMirror', () => {
    const t = Geometry.createRightTriangle(1.0, 2.0, true);

    const center = t.getCenter();
    center.x.should.closeTo(0.000, 1.0e-3);
    center.y.should.closeTo(0.000, 1.0e-3);

    const v1 = t.vertices[0];
    const v2 = t.vertices[1];
    const v3 = t.vertices[2];

    const e1 = v1.to(v2);
    const e2 = v2.to(v3);
    const e3 = v3.to(v1);

    if (e1.dot(e2) < 0.00001 && e1.dot(e2) > -0.00001) {
      true.should.be.true;
      return;
    }

    if (e2.dot(e3) < 0.00001 && e2.dot(e3) > -0.00001) {
      true.should.be.true;
      return;
    }

    if (e3.dot(e1) < 0.00001 && e3.dot(e1) > -0.00001) {
      true.should.be.true;
      return;
    }

    false.should.be.true;
  });

  it('createZeroHeightEquilateralTriangle', () => {
    try {
      Geometry.createEquilateralTriangle(0.0);
    } catch (e) {
      e.message.should.equal('Geometry.createEquilateralTriangle: height must be positive.');
    }
  });

  it('createZeroHeightEquilateralTriangle', () => {
    try {
      Geometry.createEquilateralTriangle(-1.0);
    } catch (e) {
      e.message.should.equal('Geometry.createEquilateralTriangle: height must be positive.');
    }
  });

  it('createEquilateralTriangle', () => {
    const t = Geometry.createEquilateralTriangle(2.0);

    const center = t.getCenter();
    center.x.should.closeTo(0.000, 1.0e-3);
    center.y.should.closeTo(0.000, 1.0e-3);

    let previousA = t.vertices[0].getAngleBetween(t.vertices[1]);
    previousA = Math.abs(Math.PI - Math.abs(previousA));
    let previousD = t.vertices[0].distance(t.vertices[1]);
    for (let i = 1; i < 3; i++) {
      const v1 = t.vertices[i];
      const v2 = t.vertices[i + 1 == 3 ? 0 : i + 1];
      let angle = v1.getAngleBetween(v2);
      angle = Math.abs(Math.PI - Math.abs(angle));
      if (angle < previousA * 0.9999 || angle > previousA * 1.0001) {
        false.should.be.true;
      }
      const distance = v1.distance(v2);
      if (distance < previousD * 0.9999 || distance > previousD * 1.0001) {
        false.should.be.true;
      }
    }

    true.should.be.true;
  });

  it('createZeroWidthIsoscelesTriangle', () => {
    try {
      Geometry.createIsoscelesTriangle(0.0, 1.0);
    } catch (e) {
      e.message.should.equal('Geometry.createIsoscelesTriangle: width must be positive.');
    }
  });

  it('createZeroHeightIsoscelesTriangle', () => {
    try {
      Geometry.createIsoscelesTriangle(1.0, 0.0);
    } catch (e) {
      e.message.should.equal('Geometry.createIsoscelesTriangle: height must be positive.');
    }
  });

  it('createNegativeWidthIsoscelesTriangle', () => {
    try {
      Geometry.createIsoscelesTriangle(-1.0, 2.0);
    } catch (e) {
      e.message.should.equal('Geometry.createIsoscelesTriangle: width must be positive.');
    }
  });

  it('createNegativeHeightIsoscelesTriangle', () => {
    try {
      Geometry.createIsoscelesTriangle(2.0, -2.0);
    } catch (e) {
      e.message.should.equal('Geometry.createIsoscelesTriangle: height must be positive.');
    }
  });

  it('createIsoscelesTriangle', () => {
    const t = Geometry.createIsoscelesTriangle(2.0, 1.0);

    const center = t.getCenter();
    center.x.should.closeTo(0.000, 1.0e-3);
    center.y.should.closeTo(0.000, 1.0e-3);

    const v1 = t.vertices[0];
    const v2 = t.vertices[1];
    const v3 = t.vertices[2];

    const e1 = v1.to(v2);
    const e2 = v2.to(v3);
    const e3 = v3.to(v1);

    e1.getMagnitude().should.closeTo(e3.getMagnitude(), 1.0e-3);

    e1.getAngleBetween(e2).should.closeTo(e2.getAngleBetween(e3), 1.0e-3);
  });

  it('createSegmentNullPoint1', () => {
    try {
      Geometry.createSegment(null, new Vector2());
    } catch (e) {
      e.message.should.equal('Geometry.createSegment: p1 is null.');
    }
  });

  it('createSegmentNullPoint2', () => {
    try {
      Geometry.createSegment(new Vector2(), null);
    } catch (e) {
      e.message.should.equal('Geometry.createSegment: p2 is null.');
    }
  });

  it('createSegment', () => {
    Geometry.createSegment(new Vector2(1.0, 1.0), new Vector2(2.0, -1.0));
  });

  it('createSegmentAtOrigin', () => {
    const s = Geometry.createSegmentAtOrigin(new Vector2(1.0, 1.0), new Vector2(2.0, -1.0));

    const center = s.getCenter();
    center.x.should.closeTo(0.000, 1.0e-3);
    center.y.should.closeTo(0.000, 1.0e-3);
  });

  it('createSegmentEnd', () => {
    Geometry.createSegment(new Vector2(1.0, 1.0));
  });

  it('createZeroLengthHorizontalSegment', () => {
    try {
      Geometry.createSegment(new Vector2(1.0, 1.0));
    } catch (e) {
      e.message.should.equal('Geometry.createHorizontalSegment: length must be positive.');
    }
  });

  it('createNegativeLengthHorizontalSegment', () => {
    try {
      Geometry.createHorizontalSegment(-1.0);
    } catch (e) {
      e.message.should.equal('Geometry.createHorizontalSegment: length must be positive.');
    }
  });

  it('createHorizontalSegment', () => {
    const s = Geometry.createHorizontalSegment(5.0);

    const center = s.getCenter();
    center.x.should.closeTo(0.000, 1.0e-3);
    center.y.should.closeTo(0.000, 1.0e-3);
  });

  it('createZeroLengthVerticalSegment', () => {
    try {
      Geometry.createVerticalSegment(0.0);
    } catch (e) {
      e.message.should.equal('Geometry.createHorizontalSegment: length must be positive.');
    }
  });

  it('createNegativeLengthVerticalSegment', () => {
    try {
      Geometry.createVerticalSegment(-1.0);
    } catch (e) {
      e.message.should.equal('Geometry.createHorizontalSegment: length must be positive.');
    }
  });

  it('createVerticalSegment', () => {
    const s = Geometry.createVerticalSegment(5.0);

    const center = s.getCenter();
    center.x.should.closeTo(0.000, 1.0e-3);
    center.y.should.closeTo(0.000, 1.0e-3);
  });

  it('cleanseNullList', () => {
    try {
      Geometry.cleanse(null);
    } catch (e) {
      e.message.should.equal('Geometry.cleanse: points is null.');
    }
  });

  it('cleanseListWithNullElements', () => {
    try {
      const list = [];
      list.push(new Vector2());
      list.push(null);
      list.push(new Vector2());
      list.push(new Vector2());
      Geometry.cleanse(list);
    } catch (e) {
      e.message.should.equal('Geometry.cleanse: points[1] is null.');
    }
  });

  it('cleanseEmpty', () => {
    const points = [];
    const result1 = Geometry.cleanse(points);

    const result2 = Geometry.cleanse([]);

    result1.length.should.equal(0);
    result2.length.should.equal(0);
  });

  it('cleanseList', () => {
    const points = [];
    points.push(new Vector2(1.0, 0.0));
    points.push(new Vector2(1.0, 0.0));
    points.push(new Vector2(0.5, -0.5));
    points.push(new Vector2(0.0, -0.5));
    points.push(new Vector2(-0.5, -0.5));
    points.push(new Vector2(-2.0, -0.5));
    points.push(new Vector2(2.1, 0.5));
    points.push(new Vector2(1.0, 0.0));

    const result = Geometry.cleanse(points);

    Geometry.getWinding(result).should.be.greaterThan(0.0);
    result.length.should.equal(4);

    points.reverse();

    const result2 = Geometry.cleanse(points);

    Geometry.getWinding(result2).should.be.greaterThan(0.0);
    result2.length.should.equal(4);
  });

  it('createEllipse', () => {
    const e = Geometry.createEllipse(1.0, 0.5);

    e.getWidth().should.closeTo(1.0, 1.0e-3);
    e.getHeight().should.closeTo(0.5, 1.0e-3);
    e.getCenter().x.should.closeTo(0.000, 1.0e-3);
    e.getCenter().y.should.closeTo(0.000, 1.0e-3);
  });

  it('createHalfEllipse', () => {
    const e = Geometry.createHalfEllipse(1.0, 0.5);

    e.getWidth().should.closeTo(1.0, 1.0e-3);
    e.getHeight().should.closeTo(0.5, 1.0e-3);
    e.getCenter().x.should.closeTo(0.000, 1.0e-3);
    e.getCenter().y.should.closeTo(0.212, 1.0e-3);
  });

  it('createHalfEllipseAtOrigin', () => {
    const e = Geometry.createHalfEllipseAtOrigin(1.0, 0.5);

    e.getWidth().should.closeTo(1.0, 1.0e-3);
    e.getHeight().should.closeTo(0.5, 1.0e-3);
    e.getCenter().x.should.closeTo(0.000, 1.0e-3);
    e.getCenter().y.should.closeTo(0.000, 1.0e-3);
  });

  it('createPolygonalEllipse', () => {
    const p = Geometry.createPolygonalEllipse(10, 2, 1);

    p.getCenter().x.should.closeTo(0.000, 1.0e-3);
    p.getCenter().y.should.closeTo(0.000, 1.0e-3);
  });

  it('createPolygonalEllipseOddCount', () => {
    const p = Geometry.createPolygonalEllipse(5, 2, 1);
    p.getVertices().length.should.equal(4);

    const p2 = Geometry.createPolygonalEllipse(11, 2, 1);
    p2.getVertices().length.should.equal(10);
  });

  it('createPolygonalEllipseLessCount', () => {
    try {
      Geometry.createPolygonalEllipse(3, 2, 1);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalEllipse: count must be greater than or equal to 4.');
    }
  });

  it('createPolygonalEllipseZeroWidth', () => {
    try {
      Geometry.createPolygonalEllipse(10, 0, 1);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalEllipse: width must be positive.');
    }
  });

  it('createPolygonalEllipseZeroHeight', () => {
    try {
      Geometry.createPolygonalEllipse(10, 2, 0);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalEllipse: height must be positive.');
    }
  });

  it('createPolygonalEllipseNegativeWidth', () => {
    try {
      Geometry.createPolygonalEllipse(10, -1, 1);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalEllipse: width must be positive.');
    }
  });

  it('createPolygonalEllipseNegativeHeight', () => {
    try {
      Geometry.createPolygonalEllipse(10, 2, -1);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalEllipse: height must be positive.');
    }
  });

  it('createPolygonalSlice', () => {
    const p = Geometry.createPolygonalSlice(5, 1.0, 30 / 180 * Math.PI);

    p.getCenter().x.should.closeTo(0.658, 1.0e-3);
    p.getCenter().y.should.closeTo(0.000, 1.0e-3);
  });

  it('createPolygonalSliceAtOrigin', () => {
    const p = Geometry.createPolygonalSliceAtOrigin(5, 1.0, 30 / 180 * Math.PI);

    p.getCenter().x.should.closeTo(0.000, 1.0e-3);
    p.getCenter().y.should.closeTo(0.000, 1.0e-3);
  });

  it('createPolygonalSliceInvalidCount', () => {
    try {
      Geometry.createPolygonalSlice(0, 1.0, 30 / 180 * Math.PI);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalSlice: count must be greater than or equal to 1.');
    }
  });

  it('createPolygonalSliceNegativeRadius', () => {
    try {
      Geometry.createPolygonalSlice(5, -1, 30 / 180 * Math.PI);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalSlice: radius must be positive.');
    }
  });

  it('createPolygonalSliceZeroRadius', () => {
    try {
      Geometry.createPolygonalSlice(5, 0, 30 / 180 * Math.PI);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalSlice: radius must be positive.');
    }
  });

  it('createPolygonalSliceThetaLessThanZero', () => {
    try {
      Geometry.createPolygonalSlice(5, 1.0, -30 / 180 * Math.PI);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalSlice: theta must be positive.');
    }
  });

  it('createPolygonalSliceThetaLessZero', () => {
    try {
      Geometry.createPolygonalSlice(5, 1.0, 0);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalSlice: theta must be positive.');
    }
  });

  it('createPolygonalSliceThetaGreaterThan180', () => {
    try {
      Geometry.createPolygonalSlice(5, 1.0, 190 / 180 * Math.PI);
    } catch (e) {
      e.message.should.equal('Polygon: Polygon must be convex');
    }
  });

  it('createPolygonalHalfEllipse', () => {
    const p = Geometry.createPolygonalHalfEllipse(5, 1.0, 0.5);

    p.getCenter().x.should.closeTo(0.000, 1.0e-3);
    p.getCenter().y.should.closeTo(0.103, 1.0e-3);
  });

  it('createPolygonalHalfEllipseAtOrigin', () => {
    const p = Geometry.createPolygonalHalfEllipseAtOrigin(5, 1.0, 0.5);

    p.getCenter().x.should.closeTo(0.000, 1.0e-3);
    p.getCenter().y.should.closeTo(0.000, 1.0e-3);
  });

  it('createPolygonalHalfEllipseInvalidCount', () => {
    try {
      Geometry.createPolygonalHalfEllipse(0, 1.0, 0.5);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalHalfEllipse: count must be greater than or equal to 4.');
    }
  });

  it('createPolygonalHalfEllipseZeroWidth', () => {
    try {
      Geometry.createPolygonalHalfEllipse(5, 0, 0.5);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalHalfEllipse: width must be positive.');
    }
  });

  it('createPolygonalHalfEllipseNegativeWidth', () => {
    try {
      Geometry.createPolygonalHalfEllipse(5, -1, 0.5);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalHalfEllipse: width must be positive.');
    }
  });

  it('createPolygonalHalfEllipseNegativeHeight', () => {
    try {
      Geometry.createPolygonalHalfEllipse(5, 1.0, -0.5);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalHalfEllipse: height must be positive.');
    }
  });

  it('createPolygonalHalfEllipseZeroHeight', () => {
    try {
      Geometry.createPolygonalHalfEllipse(5, 1.0, 0);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalHalfEllipse: height must be positive.');
    }
  });

  it('createPolygonalCircle', () => {
    const p = Geometry.createPolygonalCircle(5, 1.0);

    p.getCenter().x.should.closeTo(0.000, 1.0e-3);
    p.getCenter().y.should.closeTo(0.000, 1.0e-3);
    p.vertices[0].x.should.closeTo(1.000, 1.0e-3);
    p.vertices[0].y.should.closeTo(0.000, 1.0e-3);
    p.vertices.length.should.equal(5);

    const p2 = Geometry.createPolygonalCircle(5, 1.0, 30 / 180 * Math.PI);

    p2.getCenter().x.should.closeTo(0.000, 1.0e-3);
    p2.getCenter().y.should.closeTo(0.000, 1.0e-3);
    p2.vertices[0].x.should.closeTo(Math.cos(30 / 180 * Math.PI), 1.0e-3);
    p2.vertices[0].y.should.closeTo(Math.sin(30 / 180 * Math.PI), 1.0e-3);
    p2.vertices.length.should.equal(5);
  });

  it('createPolygonalCircleInvalidCount', () => {
    try {
      Geometry.createPolygonalCircle(2, 1.0);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCircle: count must be greater than or equal to 3.');
    }
  });

  it('createPolygonalCircleZeroCount', () => {
    try {
      Geometry.createPolygonalCircle(0, 1.0);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCircle: count must be greater than or equal to 3.');
    }
  });

  it('createPolygonalCircleNegativeCount', () => {
    try {
      Geometry.createPolygonalCircle(-1, 1.0);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCircle: count must be greater than or equal to 3.');
    }
  });

  it('createPolygonalCircleZeroRadius', () => {
    try {
      Geometry.createPolygonalCircle(6, 0);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCircle: radius must be positive.');
    }
  });

  it('createPolygonalCircleNegativeRadius', () => {
    try {
      Geometry.createPolygonalCircle(6, -1.0);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCircle: radius must be positive.');
    }
  });

  it('createPolygonalCapsule', () => {
    const p = Geometry.createPolygonalCapsule(5, 1.0, 0.5);

    p.getCenter().x.should.closeTo(0.000, 1.0e-3);
    p.getCenter().y.should.closeTo(0.000, 1.0e-3);

    const p2 = Geometry.createPolygonalCapsule(5, 1.0, 1.0);

    p2.getCenter().x.should.closeTo(0.000, 1.0e-3);
    p2.getCenter().y.should.closeTo(0.000, 1.0e-3);

    const p3 = Geometry.createPolygonalCapsule(5, 0.5, 1.0);

    p3.getCenter().x.should.closeTo(0.000, 1.0e-3);
    p3.getCenter().y.should.closeTo(0.000, 1.0e-3);
  });

  it('createPolygonalCapsuleInvalidCount', () => {
    try {
      Geometry.createPolygonalCapsule(0, 1.0, 0.5);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCapsule: count must be greater than or equal to 1.');
    }
  });

  it('createPolygonalCapsuleZeroWidth', () => {
    try {
      Geometry.createPolygonalCapsule(5, 0, 0.5);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCapsule: width must be positive.');
    }
  });

  it('createPolygonalCapsuleNegativeWidth', () => {
    try {
      Geometry.createPolygonalCapsule(5, -1, 0.5);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCapsule: width must be positive.');
    }
  });

  it('createPolygonalCapsuleZeroHeight', () => {
    try {
      Geometry.createPolygonalCapsule(5, 1.0, 0);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCapsule: height must be positive.');
    }
  });

  it('createPolygonalCapsuleNegativeHeight', () => {
    try {
      Geometry.createPolygonalCapsule(5, 1.0, -0.5);
    } catch (e) {
      e.message.should.equal('Geometry.createPolygonalCapsule: height must be positive.');
    }
  });

  it('flip', () => {
    const p = Geometry.createUnitCirclePolygon(5, 1.0);

    // flip about an arbitrary vector and point (line)
    let flipped = Geometry.flip(p, new Vector2(1.0, 1.0), new Vector2(0.0, 2.0));

    let vertices = flipped.getVertices();
    vertices[0].x.should.closeTo(-2.951, 1.0e-3);
    vertices[0].y.should.closeTo(2.309, 1.0e-3);
    vertices[1].x.should.closeTo(-2.587, 1.0e-3);
    vertices[1].y.should.closeTo(1.190, 1.0e-3);
    vertices[2].x.should.closeTo(-1.412, 1.0e-3);
    vertices[2].y.should.closeTo(1.190, 1.0e-3);
    vertices[3].x.should.closeTo(-1.048, 1.0e-3);
    vertices[3].y.should.closeTo(2.309, 1.0e-3);
    vertices[4].x.should.closeTo(-2.000, 1.0e-3);
    vertices[4].y.should.closeTo(3.000, 1.0e-3);

    // flip about X
    flipped = Geometry.flipAlongTheXAxis(p);
    vertices = flipped.getVertices();
    vertices[0].x.should.closeTo(0.309, 1.0e-3);
    vertices[0].y.should.closeTo(0.951, 1.0e-3);
    vertices[1].x.should.closeTo(-0.809, 1.0e-3);
    vertices[1].y.should.closeTo(0.587, 1.0e-3);
    vertices[2].x.should.closeTo(-0.809, 1.0e-3);
    vertices[2].y.should.closeTo(-0.587, 1.0e-3);
    vertices[3].x.should.closeTo(0.309, 1.0e-3);
    vertices[3].y.should.closeTo(-0.951, 1.0e-3);
    vertices[4].x.should.closeTo(1.000, 1.0e-3);
    vertices[4].y.should.closeTo(0.000, 1.0e-3);

    // flip about X at point
    flipped = Geometry.flipAlongTheXAxis(p, new Vector2(0.0, 1.0));
    vertices = flipped.getVertices();
    vertices[0].x.should.closeTo(0.309, 1.0e-3);
    vertices[0].y.should.closeTo(2.951, 1.0e-3);
    vertices[1].x.should.closeTo(-0.809, 1.0e-3);
    vertices[1].y.should.closeTo(2.587, 1.0e-3);
    vertices[2].x.should.closeTo(-0.809, 1.0e-3);
    vertices[2].y.should.closeTo(1.412, 1.0e-3);
    vertices[3].x.should.closeTo(0.309, 1.0e-3);
    vertices[3].y.should.closeTo(1.048, 1.0e-3);
    vertices[4].x.should.closeTo(1.000, 1.0e-3);
    vertices[4].y.should.closeTo(2.000, 1.0e-3);

    // flip about Y
    flipped = Geometry.flipAlongTheYAxis(p);
    vertices = flipped.getVertices();
    vertices[0].x.should.closeTo(-0.309, 1.0e-3);
    vertices[0].y.should.closeTo(-0.951, 1.0e-3);
    vertices[1].x.should.closeTo(0.809, 1.0e-3);
    vertices[1].y.should.closeTo(-0.587, 1.0e-3);
    vertices[2].x.should.closeTo(0.809, 1.0e-3);
    vertices[2].y.should.closeTo(0.587, 1.0e-3);
    vertices[3].x.should.closeTo(-0.309, 1.0e-3);
    vertices[3].y.should.closeTo(0.951, 1.0e-3);
    vertices[4].x.should.closeTo(-1.000, 1.0e-3);
    vertices[4].y.should.closeTo(-0.000, 1.0e-3);

    // flip about Y at point
    flipped = Geometry.flipAlongTheYAxis(p, new Vector2(1.0, 0.0));
    vertices = flipped.getVertices();
    vertices[0].x.should.closeTo(1.690, 1.0e-3);
    vertices[0].y.should.closeTo(-0.951, 1.0e-3);
    vertices[1].x.should.closeTo(2.809, 1.0e-3);
    vertices[1].y.should.closeTo(-0.587, 1.0e-3);
    vertices[2].x.should.closeTo(2.809, 1.0e-3);
    vertices[2].y.should.closeTo(0.587, 1.0e-3);
    vertices[3].x.should.closeTo(1.690, 1.0e-3);
    vertices[3].y.should.closeTo(0.951, 1.0e-3);
    vertices[4].x.should.closeTo(1.000, 1.0e-3);
    vertices[4].y.should.closeTo(-0.000, 1.0e-3);

    // flip about a vector originating from the origin
    flipped = Geometry.flip(p, new Vector2(1.0, 0.0));
    vertices = flipped.getVertices();
    vertices[0].x.should.closeTo(0.309, 1.0e-3);
    vertices[0].y.should.closeTo(0.951, 1.0e-3);
    vertices[1].x.should.closeTo(-0.809, 1.0e-3);
    vertices[1].y.should.closeTo(0.587, 1.0e-3);
    vertices[2].x.should.closeTo(-0.809, 1.0e-3);
    vertices[2].y.should.closeTo(-0.587, 1.0e-3);
    vertices[3].x.should.closeTo(0.309, 1.0e-3);
    vertices[3].y.should.closeTo(-0.951, 1.0e-3);
    vertices[4].x.should.closeTo(1.000, 1.0e-3);
    vertices[4].y.should.closeTo(0.000, 1.0e-3);
  });

  it('flipNullPolygon', () => {
    try {
      Geometry.flip(null, new Vector2(1.0, 1.0), null);
    } catch (e) {
      e.message.should.equal('Geometry.flip: polygon is null.');
    }
  });

  it('flipNullAxis', () => {
    try {
      Geometry.flip(Geometry.createSquare(1.0), null, null);
    } catch (e) {
      e.message.should.equal('Geometry.flip: axis is null.');
    }
  });

  it('flipZeroAxis', () => {
    try {
      Geometry.flip(Geometry.createSquare(1.0), new Vector2(), null);
    } catch (e) {
      e.message.should.equal('Geometry.flip: axis is zero.');
    }
  });

  it('flipNullPoint', () => {
    Geometry.flip(Geometry.createSquare(1.0), new Vector2(1.0, 1.0), null);
  });

  it('minkowskiSum', () => {
    let p = Geometry.minkowskiSum(Geometry.createUnitCirclePolygon(5, 0.5), Geometry.createCircle(0.2), 3);
    p.vertices.length.should.equal(25);

    p = Geometry.minkowskiSum(Geometry.createCircle(0.2), Geometry.createUnitCirclePolygon(5, 0.5), 3);
    p.vertices.length.should.equal(25);

    p = Geometry.minkowskiSum(Geometry.createUnitCirclePolygon(5, 0.5), 0.2, 3);
    p.vertices.length.should.equal(25);

    p = Geometry.basicMinkowskiSum(Geometry.createSquare(1.0), Geometry.createUnitCirclePolygon(5, 0.2));
    p.vertices.length.should.equal(8);

    p = Geometry.basicMinkowskiSum(Geometry.createSegment(new Vector2(1.0, 0.0)), Geometry.createUnitCirclePolygon(5, 0.2));
    p.vertices.length.should.equal(7);

    p = Geometry.basicMinkowskiSum(Geometry.createSegment(new Vector2(1.0, 0.0)), Geometry.createSegment(new Vector2(0.5, 0.5)));
    p.vertices.length.should.equal(4);

    p = Geometry.basicMinkowskiSum(Geometry.createSquare(1.0), Geometry.createSquare(0.5));
    p.vertices.length.should.equal(4);

    const s = Geometry.createSquare(1.0);
    s.translate(new Vector2(1.0, 0.5));
    p = Geometry.basicMinkowskiSum(s, Geometry.createSquare(0.5));
    p.vertices.length.should.equal(4);
  });

  it('minkowskiSumInvalidSegments', () => {
    try {
      Geometry.basicMinkowskiSum(Geometry.createSegment(new Vector2(1.0, 0.0)), Geometry.createSegment(new Vector2(-0.5, 0.0)));
    } catch (e) {
      e.message.should.equal('Geometry.basicMinkowskiSum: Colinear segments are not supported.');
    }
  });

  it('minkowskiSumNullWound', () => {
    try {
      Geometry.basicMinkowskiSum(Geometry.createUnitCirclePolygon(5, 0.5), null);
    } catch (e) {
      e.message.should.equal('Geometry.basicMinkowskiSum: convex2 is null.');
    }
  });

  it('minkowskiSumNullShape1', () => {
    try {
      Geometry.minkowskiSum(null, Geometry.createCircle(0.2), 3);
    } catch (e) {
      e.message.should.equal('Geometry.minkowskiSum: polygon is null.');
    }
  });

  it('minkowskiSumNullShape2', () => {
    try {
      Geometry.minkowskiSum(Geometry.createCircle(0.2), null, 3);
    } catch (e) {
      e.message.should.equal('Geometry.minkowskiSum: polygon is null.');
    }
  });

  it('minkowskiSumNullShape3', () => {
    try {
      Geometry.minkowskiSum(null, 0.2, 3);
    } catch (e) {
      e.message.should.equal('Geometry.minkowskiSum: polygon is null.');
    }
  });

  it('minkowskiSumInvalidCount1', () => {
    try {
      Geometry.minkowskiSum(Geometry.createUnitCirclePolygon(5, 0.5), 0.2, 0);
    } catch (e) {
      e.message.should.equal('Geometry.minkowskiSum: count must be positive.');
    }
  });

  it('minkowskiSumInvalidCount2', () => {
    try {
      Geometry.minkowskiSum(Geometry.createUnitCirclePolygon(5, 0.5), 0.2, -2);
    } catch (e) {
      e.message.should.equal('Geometry.minkowskiSum: count must be positive.');
    }
  });

  it('minkowskiSumInvalidCount3', () => {
    try {
      Geometry.minkowskiSum(Geometry.createUnitCirclePolygon(5, 0.5), Geometry.createCircle(0.5), 0);
    } catch (e) {
      e.message.should.equal('Geometry.minkowskiSum: count must be positive.');
    }
  });

  it('minkowskiSumInvalidCount4', () => {
    try {
      Geometry.minkowskiSum(Geometry.createUnitCirclePolygon(5, 0.5), Geometry.createCircle(0.5), -2);
    } catch (e) {
      e.message.should.equal('Geometry.minkowskiSum: count must be positive.');
    }
  });

  it('minkowskiSumInvalidRadius1', () => {
    try {
      Geometry.minkowskiSum(Geometry.createUnitCirclePolygon(5, 0.5), 0, 3);
    } catch (e) {
      e.message.should.equal('Geometry.minkowskiSum: radius must be positive.');
    }
  });

  it('minkowskiSumInvalidRadius2', () => {
    try {
      Geometry.minkowskiSum(Geometry.createUnitCirclePolygon(5, 0.5), -2.0, 3);
    } catch (e) {
      e.message.should.equal('Geometry.minkowskiSum: radius must be positive.');
    }
  });

  it('scale', () => {
    let s1 = Geometry.scale(Geometry.createCircle(0.5), 2);
    let s2 = Geometry.scale(Geometry.createCapsule(1.0, 0.5), 2);
    let s3 = Geometry.scale(Geometry.createEllipse(1.0, 0.5), 2);
    let s4 = Geometry.scale(Geometry.createHalfEllipse(1.0, 0.25), 2);
    let s5 = Geometry.scale(Geometry.createSlice(0.5, Math.PI / 6), 2);
    let s6 = Geometry.scale(Geometry.createUnitCirclePolygon(5, 0.5), 2);
    let s7 = Geometry.scale(Geometry.createSegment(new Vector2(1.0, 0.0)), 2);

    s1.radius.should.closeTo(1.000, 1.0e-3);
    s2.length.should.closeTo(2.000, 1.0e-3);
    s2.capRadius.should.closeTo(0.500, 1.0e-3);
    s3.getWidth().should.closeTo(2.000, 1.0e-3);
    s3.getHeight().should.closeTo(1.000, 1.0e-3);
    s4.getWidth().should.closeTo(2.000, 1.0e-3);
    s4.height.should.closeTo(0.500, 1.0e-3);
    s5.sliceRadius.should.closeTo(1.000, 1.0e-3);
    s6.radius.should.closeTo(1.000, 1.0e-3);
    s7.length.should.closeTo(2.000, 1.0e-3);

    s1 = Geometry.scale(Geometry.createCircle(0.5), 0.5);
    s2 = Geometry.scale(Geometry.createCapsule(1.0, 0.5), 0.5);
    s3 = Geometry.scale(Geometry.createEllipse(1.0, 0.5), 0.5);
    s4 = Geometry.scale(Geometry.createHalfEllipse(1.0, 0.25), 0.5);
    s5 = Geometry.scale(Geometry.createSlice(0.5, Math.PI / 6), 0.5);
    s6 = Geometry.scale(Geometry.createUnitCirclePolygon(5, 0.5), 0.5);
    s7 = Geometry.scale(Geometry.createSegment(new Vector2(1.0, 0.0)), 0.5);

    s1.radius.should.closeTo(0.250, 1.0e-3);
    s2.length.should.closeTo(0.500, 1.0e-3);
    s2.capRadius.should.closeTo(0.125, 1.0e-3);
    s3.getWidth().should.closeTo(0.500, 1.0e-3);
    s3.getHeight().should.closeTo(0.250, 1.0e-3);
    s4.getWidth().should.closeTo(0.500, 1.0e-3);
    s4.height.should.closeTo(0.125, 1.0e-3);
    s5.sliceRadius.should.closeTo(0.250, 1.0e-3);
    s6.radius.should.closeTo(0.250, 1.0e-3);
    s7.length.should.closeTo(0.500, 1.0e-3);
  });

  it('scaleNull', () => {
    try {
      Geometry.scale(null, 1.2);
    } catch (e) {
      e.message.should.equal('Geometry.scale: shape is null.');
    }
  });

  it('scaleCircleInvalid', () => {
    try {
      Geometry.scale(Geometry.createCircle(0.5), 0);
    } catch (e) {
      e.message.should.equal('Geometry.scale: scale must be positive.');
    }
  });

  it('scaleCapsuleInvalid', () => {
    try {
      Geometry.scale(Geometry.createCapsule(1.0, 0.5), 0);
    } catch (e) {
      e.message.should.equal('Geometry.scale: scale must be positive.');
    }
  });

  it('scaleEllipseInvalid', () => {
    try {
      Geometry.scale(Geometry.createEllipse(1.0, 0.5), 0);
    } catch (e) {
      e.message.should.equal('Geometry.scale: scale must be positive.');
    }
  });

  it('scaleHalfEllipseInvalid', () => {
    try {
      Geometry.scale(Geometry.createHalfEllipse(1.0, 0.25), 0);
    } catch (e) {
      e.message.should.equal('Geometry.scale: scale must be positive.');
    }
  });

  it('scaleSliceInvalid', () => {
    try {
      Geometry.scale(Geometry.createSlice(0.5, 30 / 180 * Math.PI), 0);
    } catch (e) {
      e.message.should.equal('Geometry.scale: scale must be positive.');
    }
  });

  it('scalePolygonInvalid', () => {
    try {
      Geometry.scale(Geometry.createUnitCirclePolygon(5, 0.5), 0);
    } catch (e) {
      e.message.should.equal('Geometry.scale: scale must be positive.');
    }
  });

  it('scaleSegmentInvalid', () => {
    try {
      Geometry.scale(Geometry.createSegment(new Vector2(1.0, 1.0)), 0);
    } catch (e) {
      e.message.should.equal('Geometry.scale: scale must be positive.');
    }
  });

  it('createLinksWrap', () => {
    const a = new Vector2(0.0, 0.0);
    const b = new Vector2(2.4, 0.0);
    const c = new Vector2(2.4, 1.6);
    const d = new Vector2(0.0, 1.6);
    const links = Geometry.createLinks([a, b, c, d], true);

    links.length.should.equal(4);
    links[0].getPoint1().x.should.closeTo(0.0, 1.0e-3);
    links[0].getPoint1().y.should.closeTo(0.0, 1.0e-3);
    links[0].getPoint2().x.should.closeTo(2.4, 1.0e-3);
    links[0].getPoint2().y.should.closeTo(0.0, 1.0e-3);
    links[1].getPoint1().x.should.closeTo(2.4, 1.0e-3);
    links[1].getPoint1().y.should.closeTo(0.0, 1.0e-3);
    links[1].getPoint2().x.should.closeTo(2.4, 1.0e-3);
    links[1].getPoint2().y.should.closeTo(1.6, 1.0e-3);
    links[2].getPoint1().x.should.closeTo(2.4, 1.0e-3);
    links[2].getPoint1().y.should.closeTo(1.6, 1.0e-3);
    links[2].getPoint2().x.should.closeTo(0.0, 1.0e-3);
    links[2].getPoint2().y.should.closeTo(1.6, 1.0e-3);
    links[3].getPoint1().x.should.closeTo(0.0, 1.0e-3);
    links[3].getPoint1().y.should.closeTo(1.6, 1.0e-3);
    links[3].getPoint2().x.should.closeTo(0.0, 1.0e-3);
    links[3].getPoint2().y.should.closeTo(0.0, 1.0e-3);
  });

  it('createLinks', () => {
    const verts = [];
    verts.push(new Vector2(2.0, 1.5));
    verts.push(new Vector2(1.0, 1.0));
    verts.push(new Vector2(1.0, 0.0));
    verts.push(new Vector2(0.0, 0.0));

    // test closed loop
    const links = Geometry.createLinks(verts, true);
    links.length.should.equal(4);

    // test link1
    links[0].getPrevious().should.equal(links[3]);
    links[0].getNext().should.equal(links[1]);
    links[0].getPoint0().x.should.closeTo(0.0, 1.0e-3);
    links[0].getPoint0().y.should.closeTo(0.0, 1.0e-3);
    links[0].getPoint1().x.should.closeTo(2.0, 1.0e-3);
    links[0].getPoint1().y.should.closeTo(1.5, 1.0e-3);
    links[0].getPoint2().x.should.closeTo(1.0, 1.0e-3);
    links[0].getPoint2().y.should.closeTo(1.0, 1.0e-3);
    links[0].getPoint3().x.should.closeTo(1.0, 1.0e-3);
    links[0].getPoint3().y.should.closeTo(0.0, 1.0e-3);

    // test link2
    links[1].getPrevious().should.equal(links[0]);
    links[1].getNext().should.equal(links[2]);
    links[1].getPoint0().x.should.closeTo(2.0, 1.0e-3);
    links[1].getPoint0().y.should.closeTo(1.5, 1.0e-3);
    links[1].getPoint1().x.should.closeTo(1.0, 1.0e-3);
    links[1].getPoint1().y.should.closeTo(1.0, 1.0e-3);
    links[1].getPoint2().x.should.closeTo(1.0, 1.0e-3);
    links[1].getPoint2().y.should.closeTo(0.0, 1.0e-3);
    links[1].getPoint3().x.should.closeTo(0.0, 1.0e-3);
    links[1].getPoint3().y.should.closeTo(0.0, 1.0e-3);

    // test link3
    links[2].getPrevious().should.equal(links[1]);
    links[2].getNext().should.equal(links[3]);
    links[2].getPoint0().x.should.closeTo(1.0, 1.0e-3);
    links[2].getPoint0().y.should.closeTo(1.0, 1.0e-3);
    links[2].getPoint1().x.should.closeTo(1.0, 1.0e-3);
    links[2].getPoint1().y.should.closeTo(0.0, 1.0e-3);
    links[2].getPoint2().x.should.closeTo(0.0, 1.0e-3);
    links[2].getPoint2().y.should.closeTo(0.0, 1.0e-3);
    links[2].getPoint3().x.should.closeTo(2.0, 1.0e-3);
    links[2].getPoint3().y.should.closeTo(1.5, 1.0e-3);

    // test link4
    links[3].getPrevious().should.equal(links[2]);
    links[3].getNext().should.equal(links[0]);
    links[3].getPoint0().x.should.closeTo(1.0, 1.0e-3);
    links[3].getPoint0().y.should.closeTo(0.0, 1.0e-3);
    links[3].getPoint1().x.should.closeTo(0.0, 1.0e-3);
    links[3].getPoint1().y.should.closeTo(0.0, 1.0e-3);
    links[3].getPoint2().x.should.closeTo(2.0, 1.0e-3);
    links[3].getPoint2().y.should.closeTo(1.5, 1.0e-3);
    links[3].getPoint3().x.should.closeTo(1.0, 1.0e-3);
    links[3].getPoint3().y.should.closeTo(1.0, 1.0e-3);

    // test non-closed loop
    const links2 = Geometry.createLinks(verts, false);
    links2.length.should.equal(3);

    // test link1
    expect(links2[0].getPrevious()).to.be.null;
    links2[0].getNext().should.equal(links2[1]);
    expect(links2[0].getPoint0()).to.be.null;
    links2[0].getPoint1().x.should.closeTo(2.0, 1.0e-3);
    links2[0].getPoint1().y.should.closeTo(1.5, 1.0e-3);
    links2[0].getPoint2().x.should.closeTo(1.0, 1.0e-3);
    links2[0].getPoint2().y.should.closeTo(1.0, 1.0e-3);
    links2[0].getPoint3().x.should.closeTo(1.0, 1.0e-3);
    links2[0].getPoint3().y.should.closeTo(0.0, 1.0e-3);

    // test link2
    links2[1].getPrevious().should.equal(links2[0]);
    links2[1].getNext().should.equal(links2[2]);
    links2[1].getPoint0().x.should.closeTo(2.0, 1.0e-3);
    links2[1].getPoint0().y.should.closeTo(1.5, 1.0e-3);
    links2[1].getPoint1().x.should.closeTo(1.0, 1.0e-3);
    links2[1].getPoint1().y.should.closeTo(1.0, 1.0e-3);
    links2[1].getPoint2().x.should.closeTo(1.0, 1.0e-3);
    links2[1].getPoint2().y.should.closeTo(0.0, 1.0e-3);
    links2[1].getPoint3().x.should.closeTo(0.0, 1.0e-3);
    links2[1].getPoint3().y.should.closeTo(0.0, 1.0e-3);

    // test link3
    links2[2].getPrevious().should.equal(links2[1]);
    expect(links2[2].getNext()).to.be.null;
    links2[2].getPoint0().x.should.closeTo(1.0, 1.0e-3);
    links2[2].getPoint0().y.should.closeTo(1.0, 1.0e-3);
    links2[2].getPoint1().x.should.closeTo(1.0, 1.0e-3);
    links2[2].getPoint1().y.should.closeTo(0.0, 1.0e-3);
    links2[2].getPoint2().x.should.closeTo(0.0, 1.0e-3);
    links2[2].getPoint2().y.should.closeTo(0.0, 1.0e-3);
    expect(links2[2].getPoint3()).to.be.null;
  });

  it('createLinksNull', () => {
    try {
      Geometry.createLinks(null, false);
    } catch (e) {
      e.message.should.equal('Geometry.createLinks: vertices is null.');
    }
  });

  it('createLinksOneVertex', () => {
    try {
      const verts = [];
      verts.push(new Vector2(2.0, 1.5));
      Geometry.createLinks(verts, false);
    } catch (e) {
      e.message.should.equal('Geometry.createLinks: vertices.length must be greater than or equal to 2.');
    }
  });

  it('createLinksNullVertex', () => {
    try {
      const verts = [];
      verts.push(new Vector2(2.0, 1.5));
      verts.push(new Vector2(1.0, 1.0));
      verts.push(null);
      verts.push(new Vector2(3.0, 1.5));
      Geometry.createLinks(verts, false);
    } catch (e) {
      e.message.should.equal('Geometry.createLinks: vertices[2] is null.');
    }
  });

  it('createSlice', () => {
    const s = Geometry.createSlice(1.0, Math.PI / 6);

    s.getSliceRadius().should.closeTo(1.0, 1.0e-3);
    s.getTheta().should.closeTo(Math.PI / 6, 1.0e-3);
    s.getCircleCenter().x.should.closeTo(0.000, 1.0e-3);
    s.getCircleCenter().y.should.closeTo(0.000, 1.0e-3);
  });

  it('createSliceAtOrigin', () => {
    const s = Geometry.createSliceAtOrigin(1.0, Math.PI / 6);

    s.getSliceRadius().should.closeTo(1.0, 1.0e-3);
    s.getTheta().should.closeTo(Math.PI / 6, 1.0e-3);
    s.getCenter().x.should.closeTo(0.000, 1.0e-3);
    s.getCenter().y.should.closeTo(0.000, 1.0e-3);
  });

  it('polygonIntersection', () => {
    const p1 = new Polygon(
      new Vector2(0.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(4.0, 3.0),
      new Vector2(4.25, 4.0),
      new Vector2(2.0, 5.0),
      new Vector2(-2.0, 5.0),
      new Vector2(-4.0, 3.75));
    const p2 = new Polygon(
      new Vector2(1.0, 0.0),
      new Vector2(3.0, 1.0),
      new Vector2(3.25, 3.75),
      new Vector2(1.5, 4.75),
      new Vector2(0.0, 5.25),
      new Vector2(-2.5, 4.5),
      new Vector2(-2.75, 3.25),
      new Vector2(-2.5, 1.5));
    const tx1 = new Transform();
    const tx2 = new Transform();

    const result = Geometry.getIntersection(p1, tx1, p2, tx2);

    result.should.not.be.null;
    result.vertices.length.should.equal(11);
    result.vertices[0].x.should.closeTo(-0.842, 1.0e-3);
    result.vertices[0].y.should.closeTo(0.789, 1.0e-3);
    result.vertices[1].x.should.closeTo(0.461, 1.0e-3);
    result.vertices[1].y.should.closeTo(0.230, 1.0e-3);
    result.vertices[2].x.should.closeTo(2.000, 1.0e-3);
    result.vertices[2].y.should.closeTo(1.000, 1.0e-3);
    result.vertices[3].x.should.closeTo(3.100, 1.0e-3);
    result.vertices[3].y.should.closeTo(2.100, 1.0e-3);
    result.vertices[4].x.should.closeTo(3.250, 1.0e-3);
    result.vertices[4].y.should.closeTo(3.750, 1.0e-3);
    result.vertices[5].x.should.closeTo(1.500, 1.0e-3);
    result.vertices[5].y.should.closeTo(4.750, 1.0e-3);
    result.vertices[6].x.should.closeTo(0.750, 1.0e-3);
    result.vertices[6].y.should.closeTo(5.000, 1.0e-3);
    result.vertices[7].x.should.closeTo(-0.833, 1.0e-3);
    result.vertices[7].y.should.closeTo(5.000, 1.0e-3);
    result.vertices[8].x.should.closeTo(-2.500, 1.0e-3);
    result.vertices[8].y.should.closeTo(4.500, 1.0e-3);
    result.vertices[9].x.should.closeTo(-2.750, 1.0e-3);
    result.vertices[9].y.should.closeTo(3.250, 1.0e-3);
    result.vertices[10].x.should.closeTo(-2.639, 1.0e-3);
    result.vertices[10].y.should.closeTo(2.474, 1.0e-3);
  });

  it('polygonIntersectionVertexOnEdgeA', () => {
    const p1 = new Polygon(
      new Vector2(0.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(4.0, 3.0),
      new Vector2(4.25, 4.0),
      new Vector2(2.0, 5.0),
      new Vector2(-2.0, 5.0),
      new Vector2(-2.6, 4.0));
    const p2 = new Polygon(
      new Vector2(1.0, 0.0),
      new Vector2(3.0, 1.0),
      new Vector2(3.25, 3.75),
      new Vector2(1.5, 4.75),
      new Vector2(0.0, 5.25),
      new Vector2(-2.5, 4.5),
      new Vector2(-2.75, 3.25),
      new Vector2(-2.5, 1.5));
    const tx1 = new Transform();
    const tx2 = new Transform();

    const result = Geometry.getIntersection(p1, tx1, p2, tx2);

    result.should.not.be.null;
    result.vertices.length.should.equal(10);
    result.vertices[0].x.should.closeTo(-0.386, 1.0e-3);
    result.vertices[0].y.should.closeTo(0.594, 1.0e-3);
    result.vertices[1].x.should.closeTo(0.461, 1.0e-3);
    result.vertices[1].y.should.closeTo(0.230, 1.0e-3);
    result.vertices[2].x.should.closeTo(2.000, 1.0e-3);
    result.vertices[2].y.should.closeTo(1.000, 1.0e-3);
    result.vertices[3].x.should.closeTo(3.100, 1.0e-3);
    result.vertices[3].y.should.closeTo(2.100, 1.0e-3);
    result.vertices[4].x.should.closeTo(3.250, 1.0e-3);
    result.vertices[4].y.should.closeTo(3.750, 1.0e-3);
    result.vertices[5].x.should.closeTo(1.500, 1.0e-3);
    result.vertices[5].y.should.closeTo(4.750, 1.0e-3);
    result.vertices[6].x.should.closeTo(0.750, 1.0e-3);
    result.vertices[6].y.should.closeTo(5.000, 1.0e-3);
    result.vertices[7].x.should.closeTo(-0.833, 1.0e-3);
    result.vertices[7].y.should.closeTo(5.000, 1.0e-3);
    result.vertices[8].x.should.closeTo(-2.256, 1.0e-3);
    result.vertices[8].y.should.closeTo(4.573, 1.0e-3);
    result.vertices[9].x.should.closeTo(-2.600, 1.0e-3);
    result.vertices[9].y.should.closeTo(4.000, 1.0e-3);
  });

  it('polygonIntersectionVertexOnEdgeB', () => {
    const p1 = new Polygon(
      new Vector2(0.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(4.0, 3.0),
      new Vector2(4.25, 4.0),
      new Vector2(2.0, 5.0),
      new Vector2(-2.0, 5.0),
      new Vector2(-4.0, 3.75));
    const p2 = new Polygon(
      new Vector2(1.0, 0.0),
      new Vector2(3.0, 1.0),
      new Vector2(3.25, 3.75),
      new Vector2(1.5, 4.75),
      new Vector2(0.0, 5.0),
      new Vector2(-2.5, 4.5),
      new Vector2(-2.75, 3.25),
      new Vector2(-2.5, 1.5));
    const tx1 = new Transform();
    const tx2 = new Transform();

    const result = Geometry.getIntersection(p1, tx1, p2, tx2);

    result.should.not.be.null;
    result.vertices.length.should.equal(10);
    result.vertices[0].x.should.closeTo(-0.842, 1.0e-3);
    result.vertices[0].y.should.closeTo(0.789, 1.0e-3);
    result.vertices[1].x.should.closeTo(0.461, 1.0e-3);
    result.vertices[1].y.should.closeTo(0.230, 1.0e-3);
    result.vertices[2].x.should.closeTo(2.000, 1.0e-3);
    result.vertices[2].y.should.closeTo(1.000, 1.0e-3);
    result.vertices[3].x.should.closeTo(3.100, 1.0e-3);
    result.vertices[3].y.should.closeTo(2.100, 1.0e-3);
    result.vertices[4].x.should.closeTo(3.250, 1.0e-3);
    result.vertices[4].y.should.closeTo(3.750, 1.0e-3);
    result.vertices[5].x.should.closeTo(1.500, 1.0e-3);
    result.vertices[5].y.should.closeTo(4.750, 1.0e-3);
    result.vertices[6].x.should.closeTo(0.000, 1.0e-3);
    result.vertices[6].y.should.closeTo(5.000, 1.0e-3);
    result.vertices[7].x.should.closeTo(-2.500, 1.0e-3);
    result.vertices[7].y.should.closeTo(4.500, 1.0e-3);
    result.vertices[8].x.should.closeTo(-2.750, 1.0e-3);
    result.vertices[8].y.should.closeTo(3.250, 1.0e-3);
    result.vertices[9].x.should.closeTo(-2.639, 1.0e-3);
    result.vertices[9].y.should.closeTo(2.474, 1.0e-3);
  });

  it('polygonIntersectionCoincidentVertexA', () => {
    const p1 = new Polygon(
      new Vector2(0.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(4.0, 3.0),
      new Vector2(4.25, 4.0),
      new Vector2(2.0, 5.0),
      new Vector2(-2.0, 5.0),
      new Vector2(-2.75, 3.25));
    const p2 = new Polygon(
      new Vector2(1.0, 0.0),
      new Vector2(3.0, 1.0),
      new Vector2(3.25, 3.75),
      new Vector2(1.5, 4.75),
      new Vector2(0.0, 5.25),
      new Vector2(-2.5, 4.5),
      new Vector2(-2.75, 3.25),
      new Vector2(-2.5, 1.5));
    const tx1 = new Transform();
    const tx2 = new Transform();

    const result = Geometry.getIntersection(p1, tx1, p2, tx2);

    result.should.not.be.null;
    result.vertices.length.should.equal(10);
    result.vertices[0].x.should.closeTo(-0.568, 1.0e-3);
    result.vertices[0].y.should.closeTo(0.672, 1.0e-3);
    result.vertices[1].x.should.closeTo(0.461, 1.0e-3);
    result.vertices[1].y.should.closeTo(0.230, 1.0e-3);
    result.vertices[2].x.should.closeTo(2.000, 1.0e-3);
    result.vertices[2].y.should.closeTo(1.000, 1.0e-3);
    result.vertices[3].x.should.closeTo(3.100, 1.0e-3);
    result.vertices[3].y.should.closeTo(2.100, 1.0e-3);
    result.vertices[4].x.should.closeTo(3.250, 1.0e-3);
    result.vertices[4].y.should.closeTo(3.750, 1.0e-3);
    result.vertices[5].x.should.closeTo(1.500, 1.0e-3);
    result.vertices[5].y.should.closeTo(4.750, 1.0e-3);
    result.vertices[6].x.should.closeTo(0.750, 1.0e-3);
    result.vertices[6].y.should.closeTo(5.000, 1.0e-3);
    result.vertices[7].x.should.closeTo(-0.833, 1.0e-3);
    result.vertices[7].y.should.closeTo(5.000, 1.0e-3);
    result.vertices[8].x.should.closeTo(-2.172, 1.0e-3);
    result.vertices[8].y.should.closeTo(4.598, 1.0e-3);
    result.vertices[9].x.should.closeTo(-2.750, 1.0e-3);
    result.vertices[9].y.should.closeTo(3.250, 1.0e-3);
  });

  it('polygonIntersectionCoincidentVertexB', () => {
    const p1 = new Polygon(
      new Vector2(0.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(4.0, 3.0),
      new Vector2(4.25, 4.0),
      new Vector2(2.0, 5.0),
      new Vector2(-2.0, 5.0),
      new Vector2(-4.0, 3.75));
    const p2 = new Polygon(
      new Vector2(1.0, 0.0),
      new Vector2(3.0, 1.0),
      new Vector2(3.25, 3.75),
      new Vector2(1.5, 4.75),
      new Vector2(-2.0, 5.0),
      new Vector2(-2.5, 4.5),
      new Vector2(-2.75, 3.25),
      new Vector2(-2.5, 1.5));
    const tx1 = new Transform();
    const tx2 = new Transform();

    const result = Geometry.getIntersection(p1, tx1, p2, tx2);

    result.should.not.be.null;
    result.vertices.length.should.equal(10);
    result.vertices[0].x.should.closeTo(-0.842, 1.0e-3);
    result.vertices[0].y.should.closeTo(0.789, 1.0e-3);
    result.vertices[1].x.should.closeTo(0.461, 1.0e-3);
    result.vertices[1].y.should.closeTo(0.230, 1.0e-3);
    result.vertices[2].x.should.closeTo(2.000, 1.0e-3);
    result.vertices[2].y.should.closeTo(1.000, 1.0e-3);
    result.vertices[3].x.should.closeTo(3.100, 1.0e-3);
    result.vertices[3].y.should.closeTo(2.100, 1.0e-3);
    result.vertices[4].x.should.closeTo(3.250, 1.0e-3);
    result.vertices[4].y.should.closeTo(3.750, 1.0e-3);
    result.vertices[5].x.should.closeTo(1.500, 1.0e-3);
    result.vertices[5].y.should.closeTo(4.750, 1.0e-3);
    result.vertices[6].x.should.closeTo(-2.000, 1.0e-3);
    result.vertices[6].y.should.closeTo(5.000, 1.0e-3);
    result.vertices[7].x.should.closeTo(-2.500, 1.0e-3);
    result.vertices[7].y.should.closeTo(4.500, 1.0e-3);
    result.vertices[8].x.should.closeTo(-2.750, 1.0e-3);
    result.vertices[8].y.should.closeTo(3.250, 1.0e-3);
    result.vertices[9].x.should.closeTo(-2.639, 1.0e-3);
    result.vertices[9].y.should.closeTo(2.474, 1.0e-3);
  });

  it('polygonIntersectionColinearEdgeB', () => {
    const p1 = new Polygon(
      new Vector2(0.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(4.0, 3.0),
      new Vector2(4.25, 4.0),
      new Vector2(2.0, 5.0),
      new Vector2(-2.0, 5.0),
      new Vector2(-4.0, 3.75));
    const p2 = new Polygon(
      new Vector2(1.0, 0.0),
      new Vector2(3.0, 1.0),
      new Vector2(3.25, 3.75),
      new Vector2(1.5, 4.75),
      new Vector2(0.5, 5.0),
      new Vector2(-0.5, 5.0),
      new Vector2(-2.5, 4.5),
      new Vector2(-2.75, 3.25),
      new Vector2(-2.5, 1.5));
    const tx1 = new Transform();
    const tx2 = new Transform();

    const result = Geometry.getIntersection(p1, tx1, p2, tx2);

    result.should.not.be.null;
    result.vertices.length.should.equal(11);
    result.vertices[0].x.should.closeTo(-0.842, 1.0e-3);
    result.vertices[0].y.should.closeTo(0.789, 1.0e-3);
    result.vertices[1].x.should.closeTo(0.461, 1.0e-3);
    result.vertices[1].y.should.closeTo(0.230, 1.0e-3);
    result.vertices[2].x.should.closeTo(2.000, 1.0e-3);
    result.vertices[2].y.should.closeTo(1.000, 1.0e-3);
    result.vertices[3].x.should.closeTo(3.100, 1.0e-3);
    result.vertices[3].y.should.closeTo(2.100, 1.0e-3);
    result.vertices[4].x.should.closeTo(3.250, 1.0e-3);
    result.vertices[4].y.should.closeTo(3.750, 1.0e-3);
    result.vertices[5].x.should.closeTo(1.500, 1.0e-3);
    result.vertices[5].y.should.closeTo(4.750, 1.0e-3);
    result.vertices[6].x.should.closeTo(0.500, 1.0e-3);
    result.vertices[6].y.should.closeTo(5.000, 1.0e-3);
    result.vertices[7].x.should.closeTo(-0.500, 1.0e-3);
    result.vertices[7].y.should.closeTo(5.000, 1.0e-3);
    result.vertices[8].x.should.closeTo(-2.500, 1.0e-3);
    result.vertices[8].y.should.closeTo(4.500, 1.0e-3);
    result.vertices[9].x.should.closeTo(-2.750, 1.0e-3);
    result.vertices[9].y.should.closeTo(3.250, 1.0e-3);
    result.vertices[10].x.should.closeTo(-2.639, 1.0e-3);
    result.vertices[10].y.should.closeTo(2.474, 1.0e-3);
  });

  it('polygonIntersectionEdgeTouching', () => {
    const p1 = new Polygon(
      new Vector2(0.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(4.0, 3.0),
      new Vector2(4.25, 4.0),
      new Vector2(2.0, 5.0),
      new Vector2(-2.0, 5.0),
      new Vector2(-4.0, 3.75));
    const p2 = new Polygon(
      new Vector2(-1.0, 5.0),
      new Vector2(1.0, 5.0),
      new Vector2(1.0, 6.0),
      new Vector2(-1.0, 6.0));
    const tx1 = new Transform();
    const tx2 = new Transform();

    const result = Geometry.getIntersection(p1, tx1, p2, tx2);

    expect(result).to.be.null;
  });

  it('polygonIntersectionVertexTouching', () => {
    const p1 = new Polygon(
      new Vector2(0.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(4.0, 3.0),
      new Vector2(4.25, 4.0),
      new Vector2(2.0, 5.0),
      new Vector2(-2.0, 5.0),
      new Vector2(-4.0, 3.75));
    const p2 = new Polygon(
      new Vector2(2.0, 5.0),
      new Vector2(4.0, 5.0),
      new Vector2(4.0, 6.0),
      new Vector2(2.0, 6.0));
    const tx1 = new Transform();
    const tx2 = new Transform();

    const result = Geometry.getIntersection(p1, tx1, p2, tx2);

    expect(result).to.be.null;
  });

  it('polygonIntersectionVertexTouchingCoincident', () => {
    const p1 = new Polygon(
      new Vector2(0.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(4.0, 3.0),
      new Vector2(4.25, 4.0),
      new Vector2(2.0, 5.0),
      new Vector2(-2.0, 5.0),
      new Vector2(-4.0, 3.75));
    const p2 = new Polygon(
      new Vector2(2.0, 5.0),
      new Vector2(4.0, 5.0),
      new Vector2(1.0, 6.0),
      new Vector2(-1.0, 6.0));
    const tx1 = new Transform();
    const tx2 = new Transform();

    const result = Geometry.getIntersection(p1, tx1, p2, tx2);

    expect(result).to.be.null;
  });

  it('polygonIntersectionNoIntersection', () => {
    const p1 = new Polygon(
      new Vector2(0.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(4.0, 3.0),
      new Vector2(4.25, 4.0),
      new Vector2(2.0, 5.0),
      new Vector2(-2.0, 5.0),
      new Vector2(-4.0, 3.75));
    const p2 = new Polygon(
      new Vector2(3.0, 5.0),
      new Vector2(5.0, 5.0),
      new Vector2(5.0, 6.0),
      new Vector2(3.0, 6.0));
    const tx1 = new Transform();
    const tx2 = new Transform();

    const result = Geometry.getIntersection(p1, tx1, p2, tx2);

    expect(result).to.be.null;
  });

  it('polygonIntersectionContainment', () => {
    const p1 = new Polygon(
      new Vector2(0.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(4.0, 3.0),
      new Vector2(4.25, 4.0),
      new Vector2(2.0, 5.0),
      new Vector2(-2.0, 5.0),
      new Vector2(-4.0, 3.75));
    const p2 = new Polygon(
      new Vector2(-1.0, 2.0),
      new Vector2(1.0, 2.0),
      new Vector2(1.0, 3.0),
      new Vector2(-1.0, 3.0));
    const tx1 = new Transform();
    const tx2 = new Transform();

    const result = Geometry.getIntersection(p1, tx1, p2, tx2);

    result.should.equal(p2);
  });

  it('getRotationRadius', () => {
    const p1 = Geometry.createUnitCirclePolygon(5, 0.5);

    const r = Geometry.getRotationRadius(p1.vertices);
    r.should.closeTo(0.500, 1.0e-3);

    const r2 = Geometry.getRotationRadius(new Vector2(1.0, 0.0), [new Vector2(-0.5, 0.0)]);
    r2.should.closeTo(1.500, 1.0e-3);

    const r3 = Geometry.getRotationRadius(new Vector2(-1.0, 0.0), p1.vertices);
    r3.should.closeTo(1.500, 1.0e-3);

    const r4 = Geometry.getRotationRadius(null);
    r4.should.closeTo(0.000, 1.0e-3);

    const r5 = Geometry.getRotationRadius([]);
    r5.should.closeTo(0.000, 1.0e-3);

    const r6 = Geometry.getRotationRadius(null, []);
    r6.should.closeTo(0.000, 1.0e-3);

    const r7 = Geometry.getRotationRadius(new Vector2(1.0, 0.0), [new Vector2(), null, new Vector2()]);
    r7.should.closeTo(1.000, 1.0e-3);
  });


  it('getCounterClockwiseEdgeNormals', () => {
    const p1 = Geometry.createUnitCirclePolygon(4, 0.5);

    const normals = Geometry.getCounterClockwiseEdgeNormals(...p1.vertices);

    normals[0].x.should.closeTo(0.707, 1.0e-3);
    normals[0].y.should.closeTo(0.707, 1.0e-3);
    normals[1].x.should.closeTo(-0.707, 1.0e-3);
    normals[1].y.should.closeTo(0.707, 1.0e-3);
    normals[2].x.should.closeTo(-0.707, 1.0e-3);
    normals[2].y.should.closeTo(-0.707, 1.0e-3);
    normals[3].x.should.closeTo(0.707, 1.0e-3);
    normals[3].y.should.closeTo(-0.707, 1.0e-3);

    const normals2 = Geometry.getCounterClockwiseEdgeNormals(null);
    expect(normals2).to.be.null;

    const normals3 = Geometry.getCounterClockwiseEdgeNormals([]);
    expect(normals3).to.be.null;
  });

  it('getCounterClockwiseEdgeNormalsWithNullVertex', () => {
    try {
      Geometry.getCounterClockwiseEdgeNormals([
        new Vector2(1.0, 1.0),
        new Vector2(2.0, 3.0),
        new Vector2(),
        null,
        new Vector2(3.0, -1.0)]);
    } catch(e) {
      e.message.should.equal('Geometry.getCounterClockwiseEdgeNormals: vertices[3]');
    }
  });
});
