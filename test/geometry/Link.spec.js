'use strict';

require('chai').should();

describe('Link', () => {
  const Link = require('../../dist/geometry/Link').Link;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const { createLinks } = require('../../dist/geometry/Geometry');

  it('createNullPoint1', () => {
    try {
      new Link(null, new Vector2());
    } catch(e) {
      e.message.should.equal('Segment: Segment cannot have null vertices');
    }
  });

  it('createNullPoint2', () => {
    try {
      new Link(new Vector2(), null);
    } catch(e) {
      e.message.should.equal('Segment: Segment cannot have null vertices');
    }
  });

  it('createCoincident', () => {
    try {
      new Link(new Vector2(), new Vector2());
    } catch(e) {
      e.message.should.equal('Segment: Segment cannot have coincident vertices');
    }
  });

  it('creatSuccess', () => {
    const l = new Link(
      new Vector2(0.0, 1.0),
      new Vector2(1.0, 2.0)
    );

    l.center.x.should.equal(0.5);
    l.center.y.should.equal(1.5);
    l.getVertexIterator().constructor.name.should.equal('WoundIterator');
    l.getNormalIterator().constructor.name.should.equal('WoundIterator');
    (l.next === null).should.equal(true);
    (l.previous === null).should.equal(true);
    (l.getNext() === null).should.equal(true);
    (l.getPrevious() === null).should.equal(true);
    (l.getPoint0() === null).should.equal(true);
    l.getPoint1().equals(new Vector2(0.0, 1.0)).should.equal(true);
    l.getPoint2().equals(new Vector2(1.0, 2.0)).should.equal(true);
    (l.vertices[0] === l.getPoint1()).should.equal(true);
    (l.vertices[1] === l.getPoint2()).should.equal(true);
    (l.getPoint3() === null).should.equal(true);
  });

  it('rotate', () => {
    const links = createLinks([
      new Vector2(0.0, 0.0),
      new Vector2(1.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(3.0, 1.0)
    ], false);

    links.length.should.equal(3);

    const l = links[1];
    l.center.x.should.closeTo(1.500, 1.0e-3);
    l.center.y.should.closeTo(0.500, 1.0e-3);

    const l1 = links[0].getLength();
    const l2 = links[1].getLength();
    const l3 = links[2].getLength();
    l1.should.closeTo(1.0, 1.0e-3);
    l2.should.closeTo(Math.sqrt(2.0), 1.0e-3);
    l3.should.closeTo(1.0, 1.0e-3);

    links[0].normals[0].x.should.closeTo(1.000, 1.0e-3);
    links[0].normals[0].y.should.closeTo(0.000, 1.0e-3);
    links[1].normals[0].x.should.closeTo(0.707, 1.0e-3);
    links[1].normals[0].y.should.closeTo(0.707, 1.0e-3);
    links[2].normals[0].x.should.closeTo(1.000, 1.0e-3);
    links[2].normals[0].y.should.closeTo(0.000, 1.0e-3);
    links[0].normals[1].x.should.closeTo(0.000, 1.0e-3);
    links[0].normals[1].y.should.closeTo(1.000, 1.0e-3);
    links[1].normals[1].x.should.closeTo(-0.707, 1.0e-3);
    links[1].normals[1].y.should.closeTo(0.707, 1.0e-3);
    links[2].normals[1].x.should.closeTo(0.000, 1.0e-3);
    links[2].normals[1].y.should.closeTo(1.000, 1.0e-3);

    l.rotate(Math.PI / 4.0, l.center.x, l.center.y);
    l.center.x.should.closeTo(1.500, 1.0e-3);
    l.center.y.should.closeTo(0.500, 1.0e-3);
    l.vertices[0].x.should.closeTo(1.500, 1.0e-3);
    l.vertices[0].y.should.closeTo(-0.207, 1.0e-3);
    l.vertices[1].x.should.closeTo(1.500, 1.0e-3);
    l.vertices[1].y.should.closeTo(1.207, 1.0e-3);
    links[0].getPoint2().equals(links[1].getPoint1()).should.equal(true);
    links[2].getPoint1().equals(links[1].getPoint2()).should.equal(true);

    const l1_ = links[0].getLength();
    const l2_ = links[1].getLength();
    const l3_ = links[2].getLength();
    l.getPoint0().distance(l.getPoint1()).should.closeTo(l1_, 1.0e-3);
    l2_.should.closeTo(Math.sqrt(2), 1.0e-3);
    l.getPoint2().distance(l.getPoint3()).should.closeTo(l3_, 1.0e-3);

    links[0].normals[0].x.should.closeTo(0.990, 1.0e-3);
    links[0].normals[0].y.should.closeTo(-0.136, 1.0e-3);
    links[1].normals[0].x.should.closeTo(0.000, 1.0e-3);
    links[1].normals[0].y.should.closeTo(1.000, 1.0e-3);
    links[2].normals[0].x.should.closeTo(0.990, 1.0e-3);
    links[2].normals[0].y.should.closeTo(-0.136, 1.0e-3);
    links[0].normals[1].x.should.closeTo(0.136, 1.0e-3);
    links[0].normals[1].y.should.closeTo(0.990, 1.0e-3);
    links[1].normals[1].x.should.closeTo(-1.000, 1.0e-3);
    links[1].normals[1].y.should.closeTo(0.000, 1.0e-3);
    links[2].normals[1].x.should.closeTo(0.136, 1.0e-3);
    links[2].normals[1].y.should.closeTo(0.990, 1.0e-3);
  });

  it('translate', () => {
    const links = createLinks([
      new Vector2(0.0, 0.0),
      new Vector2(1.0, 0.0),
      new Vector2(2.0, 1.0),
      new Vector2(3.0, 1.0)
    ], false);

    links.length.should.equal(3);

    const l = links[1];
    l.center.x.should.closeTo(1.500, 1.0e-3);
    l.center.y.should.closeTo(0.500, 1.0e-3);

    const l1 = links[0].getLength();
    const l2 = links[1].getLength();
    const l3 = links[2].getLength();
    l1.should.closeTo(1.0, 1.0e-3);
    l2.should.closeTo(Math.sqrt(2.0), 1.0e-3);
    l3.should.closeTo(1.0, 1.0e-3);

    links[0].normals[0].x.should.closeTo(1.000, 1.0e-3);
    links[0].normals[0].y.should.closeTo(0.000, 1.0e-3);
    links[1].normals[0].x.should.closeTo(0.707, 1.0e-3);
    links[1].normals[0].y.should.closeTo(0.707, 1.0e-3);
    links[2].normals[0].x.should.closeTo(1.000, 1.0e-3);
    links[2].normals[0].y.should.closeTo(0.000, 1.0e-3);
    links[0].normals[1].x.should.closeTo(0.000, 1.0e-3);
    links[0].normals[1].y.should.closeTo(1.000, 1.0e-3);
    links[1].normals[1].x.should.closeTo(-0.707, 1.0e-3);
    links[1].normals[1].y.should.closeTo(0.707, 1.0e-3);
    links[2].normals[1].x.should.closeTo(0.000, 1.0e-3);
    links[2].normals[1].y.should.closeTo(1.000, 1.0e-3);

    l.translate(0.5, 0.5);

    l.center.x.should.closeTo(2.000, 1.0e-3);
    l.center.y.should.closeTo(1.000, 1.0e-3);
    l.vertices[0].x.should.closeTo(1.500, 1.0e-3);
    l.vertices[0].y.should.closeTo(0.500, 1.0e-3);
    l.vertices[1].x.should.closeTo(2.500, 1.0e-3);
    l.vertices[1].y.should.closeTo(1.500, 1.0e-3);
    links[0].getPoint2().equals(links[1].getPoint1()).should.equal(true);
    links[2].getPoint1().equals(links[1].getPoint2()).should.equal(true);

    const l1_ = links[0].getLength();
    const l2_ = links[1].getLength();
    const l3_ = links[2].getLength();
    l.getPoint0().distance(l.getPoint1()).should.closeTo(l1_, 1.0e-3);
    l2_.should.closeTo(Math.sqrt(2), 1.0e-3);
    l.getPoint2().distance(l.getPoint3()).should.closeTo(l3_, 1.0e-3);

    links[0].normals[0].x.should.closeTo(0.948, 1.0e-3);
    links[0].normals[0].y.should.closeTo(0.316, 1.0e-3);
    links[1].normals[0].x.should.closeTo(0.707, 1.0e-3);
    links[1].normals[0].y.should.closeTo(0.707, 1.0e-3);
    links[2].normals[0].x.should.closeTo(0.707, 1.0e-3);
    links[2].normals[0].y.should.closeTo(-0.707, 1.0e-3);
    links[0].normals[1].x.should.closeTo(-0.316, 1.0e-3);
    links[0].normals[1].y.should.closeTo(0.948, 1.0e-3);
    links[1].normals[1].x.should.closeTo(-0.707, 1.0e-3);
    links[1].normals[1].y.should.closeTo(0.707, 1.0e-3);
    links[2].normals[1].x.should.closeTo(0.707, 1.0e-3);
    links[2].normals[1].y.should.closeTo(0.707, 1.0e-3);
  });
});