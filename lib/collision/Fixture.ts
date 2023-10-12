import { DataContainer } from "../DataContainer";
import { Convex, Shape } from "../geometry";
import { DEFAULT_FILTER, Filter } from "./Filter";

/**
 * Represents a geometric piece of a {@link CollisionBody}.
 */
export class Fixture implements DataContainer {
  /**
   * The convex shape of this {@link Fixture}.
   */
  shape: Convex;
  /**
   * The collision filter of this {@link Fixture}.
   */
  filter: Filter;
  /**
   * Whether the {@link Fixture} only senses contact.
   */
  sensor: boolean;
  /**
   * The user data of this {@link Fixture}.
   */
  userData: any;

  /**
   * Minimal constructor.
   * @param shape The {@link Convex} {@link Shape} of this {@link Fixture}
   * @throws `TypeError` if the shape is null
   */
  constructor(shape: Convex) {
    if(shape == null) {
      throw new TypeError("Fixture: Shape cannot be null");
    }
    this.shape = shape;
    this.filter = DEFAULT_FILTER;
    this.sensor = false;
  }

  public toString(): string {
    return `Fixture[shape=${this.shape}, filter=${this.filter}, sensor=${this.sensor}]`;
  }

  /**
   * Returns the {@link Convex} {@link Shape} of this {@link Fixture}.
   * @returns The {@link Convex} {@link Shape} 
   */
  public getShape(): Convex {
    return this.shape; 
  }

  /**
   * Returns the collision filter for this {@link Fixture}.
   * @returns The collision {@link Filter}
   */
  public getFilter(): Filter {
    return this.filter;
  }

  /**
   * Sets the collision filter for this {@link Fixture}.
   * @param filter The collision {@link Filter}
   * @throws `TypeError` if the filter is null
   */
  public setFilter(filter: Filter): void {
    if(filter == null) {
      throw new TypeError("Fixture.setFilter: Filter cannot be null");
    }
    this.filter = filter;
  }

  /**
   * Returns true if this {@link Fixture} only senses contact.
   * @returns true if this {@link Fixture} only senses contact
   */
  public isSensor(): boolean {
    return this.sensor;
  }

  /**
   * Sets the sensor flag for this {@link Fixture}.
   * @param sensor true if this {@link Fixture} only senses contact
   */
  public setSensor(sensor: boolean): void {
    this.sensor = sensor;
  }

  /**
   * Sets the user data of this {@link Fixture}.
   * @param data The user data
   */
  public setUserData(data: any): void {
    this.userData = data;
  }

  /**
   * Returns the user data of this {@link Fixture}.
   * @returns The user data
   */
  public getUserData(): any {
    return this.userData;
  }
}