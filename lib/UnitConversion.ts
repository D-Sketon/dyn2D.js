export const FOOT_TO_METER = 0.0254 * 12.0;
export const METER_TO_FOOT = 1.0 / FOOT_TO_METER;
export const SLUG_TO_KILOGRAM = 14.5939029;
export const KILOGRAM_TO_SLUG = 1.0 / SLUG_TO_KILOGRAM;
export const POUND_TO_KILOGRAM = 0.45359237;
export const KILOGRAM_TO_POUND = 1.0 / POUND_TO_KILOGRAM;
export const POUND_TO_NEWTON = 4.44822162;
export const NEWTON_TO_POUND = 1.0 / POUND_TO_NEWTON;
export const FOOT_POUND_TO_NEWTON_METER = 0.7375621;
export const NEWTON_METER_TO_FOOT_POUND = 1.0 / FOOT_POUND_TO_NEWTON_METER;

export function feetToMeters(feet: number): number {
  return feet * FOOT_TO_METER;
}

export function slugsToKilograms(slugs: number): number {
  return slugs * SLUG_TO_KILOGRAM;
}

export function poundsToKilograms(pounds: number): number {
  return pounds * POUND_TO_KILOGRAM;
}

export function poundsToNewtons(pounds: number): number {
  return pounds * POUND_TO_NEWTON;
}

export function feetPerSecondToMetersPerSecond(feetPerSecond: number): number {
  return feetPerSecond * METER_TO_FOOT;
}

export function footPoundsToNewtonMeters(footPounds: number): number {
  return footPounds * FOOT_POUND_TO_NEWTON_METER;
}

export function metersToFeet(meters: number): number {
  return meters * METER_TO_FOOT;
}

export function kilogramsToSlugs(kilograms: number): number {
  return kilograms * KILOGRAM_TO_SLUG;
}

export function kilogramsToPounds(kilograms: number): number {
  return kilograms * KILOGRAM_TO_POUND;
}

export function newtonsToPounds(newtons: number): number {
  return newtons * NEWTON_TO_POUND;
}

export function metersPerSecondToFeetPerSecond(metersPerSecond: number): number {
  return metersPerSecond * FOOT_TO_METER;
}

export function newtonMetersToFootPounds(newtonMeters: number): number {
  return newtonMeters * NEWTON_METER_TO_FOOT_POUND;
}