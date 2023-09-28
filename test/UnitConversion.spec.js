'use strict';

require('chai').should();

describe('UnitConversion', () => {
  const UnitConversion = require('../dist/UnitConversion');
  const tolerance = 1.0e-9;

  it('footMeter', () => {
    (UnitConversion.FOOT_TO_METER * UnitConversion.METER_TO_FOOT).should.equal(1);

    const m = 2.5;
    const f = UnitConversion.metersToFeet(m);
    const r = UnitConversion.feetToMeters(f);
    m.should.closeTo(r, tolerance);
  });
  it('slugKilogram', () => {
    (UnitConversion.SLUG_TO_KILOGRAM * UnitConversion.KILOGRAM_TO_SLUG).should.equal(1);

    const s = 2.5;
    const k = UnitConversion.kilogramsToSlugs(s);
    const r = UnitConversion.slugsToKilograms(k);
    s.should.closeTo(r, tolerance);
  });
  it('poundKilogram', () => {
    (UnitConversion.POUND_TO_KILOGRAM * UnitConversion.KILOGRAM_TO_POUND).should.equal(1);

    const p = 2.5;
    const k = UnitConversion.poundsToKilograms(p);
    const r = UnitConversion.kilogramsToPounds(k);
    p.should.closeTo(r, tolerance);
  });
  it('mpsToFps', () => {
    (UnitConversion.MPS_TO_FPS * UnitConversion.FPS_TO_MPS).should.equal(1);

    const m = 2.5;
    const f = UnitConversion.metersPerSecondToFeetPerSecond(m);
    const r = UnitConversion.feetPerSecondToMetersPerSecond(f);
    m.should.closeTo(r, tolerance);
  });
  it('poundNewton', () => {
    (UnitConversion.POUND_TO_NEWTON * UnitConversion.NEWTON_TO_POUND).should.equal(1);

    const p = 2.5;
    const n = UnitConversion.poundsToNewtons(p);
    const r = UnitConversion.newtonsToPounds(n);
    p.should.closeTo(r, tolerance);
  });
  it('footPoundNewtonMeter', () => {
    (UnitConversion.FOOT_POUND_TO_NEWTON_METER * UnitConversion.NEWTON_METER_TO_FOOT_POUND).should.equal(1);

    const f = 2.5;
    const n = UnitConversion.footPoundsToNewtonMeters(f);
    const r = UnitConversion.newtonMetersToFootPounds(n);
    f.should.closeTo(r, tolerance);
  });
});