import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";
import { MassType } from "./MassType";
import { Vector2 } from "./Vector2";

/**
 * Represents {@link Mass} data for an object about a given point.
 */
export class Mass implements Copyable<Mass>{
  /**
   * The {@link MassType} of this {@link Mass}.
   */
  type: MassType;
  /***
   * The center of mass in local coordinates.
   */
  center: Vector2;
  /**
   * The mass of the object.
   */
  mass: number;
  /**
   * The inertia of the object.
   */
  inertia: number;
  /**
   * The inverse mass of the object.
   */
  invMass: number;
  /**
   * The inverse inertia of the object.
   */
  invInertia: number;

  /**
   * Default constructor.
   */
  constructor();
  /**
   * Full constructor.
   * @param center The center of mass in local coordinates.
   * @param mass The mass of the object.
   * @param inertia The inertia of the object.
   * @throws `RangeError` if mass or inertia is less than or equal to zero
   */
  constructor(center: Vector2, mass: number, inertia: number);
  /**
   * Copy constructor.
   * @param mass The {@link Mass} to copy
   */
  constructor(mass: Mass);
  constructor(center?: any, mass?: any, inertia?: any) {
    if (center instanceof Mass) {
      this.type = center.type;
      this.center = center.center.copy();
      this.mass = center.mass;
      this.inertia = center.inertia;
      this.invMass = center.invMass;
      this.invInertia = center.invInertia;
    } else if (center instanceof Vector2 && typeof mass === "number" && typeof inertia === "number") {
      if (mass < 0) throw new RangeError("Mass: The mass must be greater than or equal to zero.");
      if (inertia < 0) throw new RangeError("Mass: The inertia must be greater than or equal to zero.");
      this.type = MassType.NORMAL;
      this.center = center.copy();
      this.mass = mass;
      this.inertia = inertia;
      if (mass > Epsilon.E) {
        this.invMass = 1.0 / mass;
      } else {
        this.invMass = 0.0;
        this.type = MassType.FIXED_LINEAR_VELOCITY;
      }
      if (inertia > Epsilon.E) {
        this.invInertia = 1.0 / inertia;
      } else {
        this.invInertia = 0.0;
        this.type = MassType.FIXED_ANGULAR_VELOCITY;
      }
      if (mass <= Epsilon.E && inertia <= Epsilon.E) {
        this.type = MassType.INFINITE;
      }
    } else {
      this.type = MassType.INFINITE;
      this.center = new Vector2();
      this.mass = 0.0;
      this.inertia = 0.0;
      this.invMass = 0.0;
      this.invInertia = 0.0;
    }
  }

  public copy(): Mass {
    return new Mass(this);
  }

  /**
   * Method to check if this {@link Mass} is deeply equal to the given object.
   * @param obj The object to compare
   * @returns true if this object equals the other object
   */
  public equals(obj: any): boolean {
    if (obj == null) return false;
    if (obj instanceof Mass) {
      return this.type === obj.type
        && this.center.equals(obj.center)
        && this.mass === obj.mass
        && this.inertia === obj.inertia
        && this.invMass === obj.invMass
        && this.invInertia === obj.invInertia;
    }
    return false;
  }

  /**
   * Creates a {@link Mass} object from the given array of masses.
   * 
   * Uses the Parallel Axis Theorem to obtain the inertia tensor about
	 * the center of all the given masses:
	 * <p style="white-space: pre;"> I<sub>dis</sub> = I<sub>cm</sub> + mr<sup>2</sup>
	 * I<sub>total</sub> = &sum; I<sub>dis</sub></p>
	 * The center for the resulting mass will be a mass weighted center.
   * 
	 * This method will produce unexpected results if any mass contained in the
	 * list is infinite.
   * @param masses The array of masses
   * @returns The combined {@link Mass} object
   * @throws `TypeError` if the masses list is null or empty
   * @throws `TypeError` if the masses list contains null masses
   */
  public static create(masses: Mass[]): Mass {
    if(masses == null) {
      throw new TypeError("Mass.create: The masses list cannot be null");
    }
    if (masses.length == 0) {
      throw new TypeError("Mass.create: The masses list must contain at least one mass");
    }
    const len = masses.length;

    if (len === 1) {
      const m = masses[0];
      if (m != null) {
        return new Mass(masses[0]);
      } else {
        throw new TypeError("Mass.create: The masses list must contain at least one mass");
      }
    }

    const c = new Vector2();
    let m = 0.0;
    let I = 0.0;

    for (let i = 0; i < len; i++) {
      const mass = masses[i];
      if (mass == null)
        throw new TypeError("Mass.create: The masses list cannot contain null masses");

      c.add(mass.center.product(mass.mass));
      m += mass.mass;
    }
    if (m > 0) {
      c.divide(m);
    }
    for (let i = 0; i < len; i++) {
      const mass = masses[i];
      const d2 = mass.center.distanceSquared(c);
      const Idis = mass.inertia + mass.mass * d2;
      I += Idis;
    }
    return new Mass(c, m, I);
  }

  /**
   * Returns true if this {@link Mass} object is of type {@link MassType.INFINITE}.
   * 
   * A mass will still be treated as an infinite mass in physical modeling if the
	 * mass and inertia are zero. This method simply checks the mass type.
   * @returns true if this {@link Mass} object is of type {@link MassType.INFINITE}
   */
  public isInfinite(): boolean {
    return this.type === MassType.INFINITE;
  }

  /**
   * Method to set the {@link MassType} of this {@link Mass}.
   * 
   * NOTE: This method will only set the MassType when it's valid to do so. The following logic describes this:
	 * <ul>
	 * <li>The given type is {@link MassType.NORMAL} and both the mass and inertia are non-zero</li>
	 * <li>The given type is {@link MassType.FIXED_LINEAR_VELOCITY} and inertia is non-zero</li>
	 * <li>The given type is {@link MassType.FIXED_ANGULAR_VELOCITY} and the mass is non-zero</li>
	 * </ul>
	 * Otherwise, the operation will be ignored and the current mass type left as is.
   * @param type The {@link MassType} to set
   * @throws `TypeError` if type is null
   */
  public setType(type: MassType): void {
    if (type == null) 
			throw new TypeError("Mass.setType: type cannot be null.");
    if (type === MassType.NORMAL && (this.mass <= 0 || this.inertia <= 0)) {
      return;
    } else if (type === MassType.FIXED_LINEAR_VELOCITY && (this.inertia <= 0)) {
      return;
    } else if (type === MassType.FIXED_ANGULAR_VELOCITY && (this.mass <= 0)) {
      return;
    }
    this.type = type;
  }

  /**
   * Returns the {@link MassType} of this {@link Mass}.
   * @returns The {@link MassType} of this {@link Mass}
   */
  public getType(): MassType {
    return this.type;
  }

  /**
   * Returns the center of mass in local coordinates.
   * @returns The center of mass in local coordinates.
   */
  public getCenter(): Vector2 {
    return this.center;
  }

  /**
   * Returns the mass of the object.
   * 
   * NOTE: if this mass is type {@link MassType.INFINITE} or {@link MassType.FIXED_LINEAR_VELOCITY}
	 * this method returns zero.
   * @returns The mass of the object.
   */
  public getMass(): number {
    if (this.type === MassType.INFINITE || this.type === MassType.FIXED_LINEAR_VELOCITY) {
      return 0;
    } else {
      return this.mass;
    }
  }

  /**
   * Returns the inertia of the object.
   * 
   * NOTE: if this mass is type {@link MassType.INFINITE} or {@link MassType.FIXED_ANGULAR_VELOCITY}
   * this method returns zero.
   * @returns The inertia of the object.
   */
  public getInertia(): number {
    if (this.type === MassType.INFINITE || this.type === MassType.FIXED_ANGULAR_VELOCITY) {
      return 0;
    } else {
      return this.inertia;
    }
  }

  /**
   * Returns the inverse mass of the object.
   * 
   * NOTE: if this mass is type {@link MassType.INFINITE} or {@link MassType.FIXED_LINEAR_VELOCITY}
   * this method returns zero.
   * @returns The inverse mass of the object.
   */
  public getInverseMass(): number {
    if (this.type === MassType.INFINITE || this.type === MassType.FIXED_LINEAR_VELOCITY) {
      return 0;
    } else {
      return this.invMass;
    }
  }

  /**
   * Returns the inverse inertia of the object.
   * 
   * NOTE: if this mass is type {@link MassType.INFINITE} or {@link MassType.FIXED_ANGULAR_VELOCITY}
   * this method returns zero.
   * @returns The inverse inertia of the object.
   */
  public getInverseInertia(): number {
    if (this.type === MassType.INFINITE || this.type === MassType.FIXED_ANGULAR_VELOCITY) {
      return 0;
    } else {
      return this.invInertia;
    }
  }

  public toString(): string {
    return `Mass[Type=${this.type}, Center=${this.center}, Mass=${this.mass}, Inertia=${this.inertia}]`;
  }

}