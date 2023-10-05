/**
 * Enumeration for special {@link Mass} types.
 */
export enum MassType {
  /** Indicates a normal mass */
  NORMAL,

  /** Indicates that the mass is infinite (rate of rotation and translation should not change) */
  INFINITE,

  /** Indicates that the mass's rate of rotation should not change */
  FIXED_ANGULAR_VELOCITY,

  /** Indicates that the mass's rate of translation should not change */
  FIXED_LINEAR_VELOCITY,
}