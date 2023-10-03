'use strict';

require('chai').should();

describe('Triangle', () => {
  const Triangle = require('../../dist/geometry/Triangle').Triangle;
  const Transform = require('../../dist/geometry/Transform').Transform;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;

  it('createNullPoint1', () => {
    try {
      new Triangle(
        null,
        new Vector2(-0.5, -0.5),
        new Vector2(0.5, -0.5)
      );
    } catch (e) {
      e.message.should.equal('Polygon: Polygon cannot have null vertices');
    }
  });

  it('createNullPoint2', () => {
    try {
      new Triangle(
        new Vector2(-0.5, -0.5),
        new Vector2(0.5, -0.5),
        null
      );
    } catch (e) {
      e.message.should.equal('Polygon: Polygon cannot have null vertices');
    }
  });

  it('createNullPoint3', () => {
    try {
      new Triangle(
        new Vector2(-0.5, -0.5),
        null,
        new Vector2(0.5, -0.5)
      );
    } catch (e) {
      e.message.should.equal('Polygon: Polygon cannot have null vertices');
    }
  });

  it('contains', () => {
    const t = new Triangle(
      new Vector2(0.0, 0.5),
      new Vector2(-0.5, -0.5),
      new Vector2(0.5, -0.5)
    );
    const tx = new Transform();

    const p = new Vector2(1.0, 1.0);
    t.contains(p, tx).should.equal(false);

    p.set(0.2, 0.0);
    t.contains(p, tx).should.equal(true);

    p.set(0.3, -0.5);
    t.contains(p, tx).should.equal(true);

    tx.rotate(Math.PI / 2.0);
    tx.translate(0.0, 1.0);

    p.set(1.0, 1.0);
    t.contains(p, tx).should.equal(false);

    p.set(0.4, 1.0);
    t.contains(p, tx).should.equal(true);

    p.set(0.0, 0.76);
    t.contains(p, tx).should.equal(true);
  });
});