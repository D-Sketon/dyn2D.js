'use strict';

require('chai').should();

describe('Epsilon', () => {
  const Epsilon = require('../dist/Epsilon').Epsilon;

  it('compute', () => {
    (Epsilon.E == 0).should.equal(false);
    Epsilon.computed();
    (1 == 1 + Epsilon.E).should.equal(true);
  });
});