'use strict';

require('chai').should();

describe('Feature', () => {
  const Vector2 = require('../../dist/geometry/Vector2').Vector2;
  const Feature = require('../../dist/geometry/Feature').Feature;
  const PointFeature = require('../../dist/geometry/PointFeature').PointFeature;
  const EdgeFeature = require('../../dist/geometry/EdgeFeature').EdgeFeature;

  it('create', () => {
    const pf1 = new PointFeature(new Vector2(1.0, 1.0), 1);
    const pf2 = new PointFeature(new Vector2(1.0, 2.0), 0);
    const ef = new EdgeFeature(pf1, pf2, pf1, pf1.point.to(pf2.point), 2);

    pf1.getPoint().x.should.equal(1.0);
    pf1.getPoint().y.should.equal(1.0);
    pf1.getIndex().should.equal(1);
    pf1.toString().should.not.equal(null);

    pf2.getPoint().x.should.equal(1.0);
    pf2.getPoint().y.should.equal(2.0);
    pf2.getIndex().should.equal(0);
    pf2.toString().should.not.equal(null);

    ef.getMaximum().should.equal(pf1);
    ef.getVertex1().should.equal(pf1);
    ef.getVertex2().should.equal(pf2);
    ef.getEdge().x.should.equal(0.0);
    ef.getEdge().y.should.equal(1.0);
    ef.getIndex().should.equal(2);
    ef.toString().should.not.equal(null);
  });

  it('createNonIndexed', () => {
    const pf1 = new PointFeature(new Vector2(1.0, 1.0), Feature.NOT_INDEXED);
    pf1.getPoint().x.should.equal(1.0);
    pf1.getPoint().y.should.equal(1.0);
    pf1.getIndex().should.equal(Feature.NOT_INDEXED);
    pf1.toString().should.not.equal(null);
  });
});