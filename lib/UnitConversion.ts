/** 1 foot = {@link FOOT_TO_METER} meters */
export const FOOT_TO_METER = 0.0254 * 12.0;
/** 1 meter = {@link METER_TO_FOOT} feet */
export const METER_TO_FOOT = 1.0 / FOOT_TO_METER;
/** 1 slug = {@link SLUG_TO_KILOGRAM} kilograms */
export const SLUG_TO_KILOGRAM = 14.5939029;
/** 1 kilogram = {@link KILOGRAM_TO_SLUG} slugs */
export const KILOGRAM_TO_SLUG = 1.0 / SLUG_TO_KILOGRAM;
/** 1 pound = {@link POUND_TO_KILOGRAM} kilograms */
export const POUND_TO_KILOGRAM = 0.45359237;
/** 1 kilogram = {@link KILOGRAM_TO_POUND} pounds */
export const KILOGRAM_TO_POUND = 1.0 / POUND_TO_KILOGRAM;
/** 1 pound = {@link POUND_TO_NEWTON} newtons */
export const POUND_TO_NEWTON = 4.44822162;
/** 1 newton = {@link NEWTON_TO_POUND} pounds */
export const NEWTON_TO_POUND = 1.0 / POUND_TO_NEWTON;
/** 1 foot-pound = {@link FOOT_POUND_TO_NEWTON_METER} newton-meters */
export const FOOT_POUND_TO_NEWTON_METER = 0.7375621;
/** 1 newton-meter = {@link NEWTON_METER_TO_FOOT_POUND} foot-pounds */
export const NEWTON_METER_TO_FOOT_POUND = 1.0 / FOOT_POUND_TO_NEWTON_METER;

/**
 * Meters to feet.
 * @param feet The length value in fee
 * @returns The length value in meters.
 */
export function feetToMeters(feet: number): number {
  return feet * FOOT_TO_METER;
}

/**
 * Slugs to kilograms.
 * @param slugs The mass value in slugs.
 * @returns The mass value in kilograms.
 */
export function slugsToKilograms(slugs: number): number {
  return slugs * SLUG_TO_KILOGRAM;
}

/**
 * Pounds to kilograms.
 * @param pounds The mass value in pounds.
 * @returns The mass value in kilograms.
 */
export function poundsToKilograms(pounds: number): number {
  return pounds * POUND_TO_KILOGRAM;
}

/**
 * Pounds to newtons.
 * @param pounds The force value in pounds.
 * @returns The force value in newtons.
 */
export function poundsToNewtons(pounds: number): number {
  return pounds * POUND_TO_NEWTON;
}

/**
 * Feet per second to meters per second.
 * @param feetPerSecond The velocity value in feet per second.
 * @returns The velocity value in meters per second.
 */
export function feetPerSecondToMetersPerSecond(feetPerSecond: number): number {
  return feetPerSecond * METER_TO_FOOT;
}

/**
 * Foot pounds to newton meters.
 * @param footPounds The torque value in foot pounds.
 * @returns The torque value in newton meters.
 */
export function footPoundsToNewtonMeters(footPounds: number): number {
  return footPounds * FOOT_POUND_TO_NEWTON_METER;
}

/**
 * Meters to feet.
 * @param meters The length value in meters.
 * @returns The length value in feet.
 */
export function metersToFeet(meters: number): number {
  return meters * METER_TO_FOOT;
}

/**
 * Kilograms to slugs.
 * @param kilograms The mass value in kilograms.
 * @returns The mass value in slugs.
 */
export function kilogramsToSlugs(kilograms: number): number {
  return kilograms * KILOGRAM_TO_SLUG;
}

/**
 * Kilograms to pounds.
 * @param kilograms The mass value in kilograms.
 * @returns The mass value in pounds.
 */
export function kilogramsToPounds(kilograms: number): number {
  return kilograms * KILOGRAM_TO_POUND;
}

/**
 * Newtons to pounds.
 * @param newtons The force value in newtons.
 * @returns The force value in pounds.
 */
export function newtonsToPounds(newtons: number): number {
  return newtons * NEWTON_TO_POUND;
}

/**
 * Meters per second to feet per second.
 * @param metersPerSecond The velocity value in meters per second.
 * @returns The velocity value in feet per second.
 */
export function metersPerSecondToFeetPerSecond(metersPerSecond: number): number {
  return metersPerSecond * FOOT_TO_METER;
}

/**
 * Newton meters to foot pounds.
 * @param newtonMeters The torque value in newton meters.
 * @returns The torque value in foot pounds.
 */
export function newtonMetersToFootPounds(newtonMeters: number): number {
  return newtonMeters * NEWTON_METER_TO_FOOT_POUND;
}