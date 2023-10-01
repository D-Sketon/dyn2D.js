import { Copyable } from "../Copyable";
import { Epsilon } from "../Epsilon";
import { MassType } from "./MassType";
import { Vector2 } from "./Vector2";

export class Mass implements Copyable<Mass>{
  type: MassType;
  center: Vector2;
  mass: number;
  inertia: number;
  invMass: number;
  invInertia: number;

  constructor();
  constructor(center: Vector2, mass: number, inertia: number);
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
      if (mass < 0) throw new Error("Mass: The mass must be greater than or equal to zero.");
      if (inertia < 0) throw new Error("Mass: The inertia must be greater than or equal to zero.");
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

  public static create(masses: Mass[]): Mass {
    if(masses == null) {
      throw new Error("Mass.create: The masses list cannot be null");
    }
    if (masses.length == 0) {
      throw new Error("Mass.create: The masses list must contain at least one mass");
    }
    const len = masses.length;

    if (len === 1) {
      const m = masses[0];
      if (m != null) {
        return new Mass(masses[0]);
      } else {
        throw new Error("Mass.create: The masses list must contain at least one mass");
      }
    }

    const c = new Vector2();
    let m = 0.0;
    let I = 0.0;

    for (let i = 0; i < len; i++) {
      const mass = masses[i];
      if (mass == null)
        throw new Error("Mass.create: The masses list cannot contain null masses");

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

  public isInfinite(): boolean {
    return this.type === MassType.INFINITE;
  }

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

  public getType(): MassType {
    return this.type;
  }

  public getCenter(): Vector2 {
    return this.center;
  }

  public getMass(): number {
    if (this.type === MassType.INFINITE || this.type === MassType.FIXED_LINEAR_VELOCITY) {
      return 0;
    } else {
      return this.mass;
    }
  }

  public getInertia(): number {
    if (this.type === MassType.INFINITE || this.type === MassType.FIXED_ANGULAR_VELOCITY) {
      return 0;
    } else {
      return this.inertia;
    }
  }

  public getInverseMass(): number {
    if (this.type === MassType.INFINITE || this.type === MassType.FIXED_LINEAR_VELOCITY) {
      return 0;
    } else {
      return this.invMass;
    }
  }

  public getInverseInertia(): number {
    if (this.type === MassType.INFINITE || this.type === MassType.FIXED_ANGULAR_VELOCITY) {
      return 0;
    } else {
      return this.invInertia;
    }
  }



}