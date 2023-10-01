'use strict';

require('chai').should();

describe('AbstractShape', () => {

  const AbstractShape = require('../../dist/geometry/AbstractShape').AbstractShape;
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  class TestShape extends AbstractShape {
    constructor(c, r) {
      super(c, r);
    }
  }
  it('create', () => {
    const c = new Vector2(1.0, 2.0);
    const r = 2.0;
    const s = new TestShape(c, r);

    s.getRadius().should.equal(r);
    s.getCenter().x.should.equal(c.x);
    s.getCenter().y.should.equal(c.y);
  });

  it('setUserData', () => {
    const s = new TestShape(null, 0.0);
    (s.getUserData() === null).should.equal(true);

    const obj = 'hello';
    s.setUserData(obj);
    (s.getUserData() === null).should.equal(false);
    s.getUserData().should.equal(obj);
  });
});