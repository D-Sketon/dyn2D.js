'use strict';

require('chai').should();

describe('Geometry', () => {
  const Geometry = require('../../dist/geometry/Geometry');
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;

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

});
