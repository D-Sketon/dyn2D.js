/**
 * Represents a one dimensional numeric {@link Interval}.
 */
export class Interval {
  /**
   * The minimum value of the interval.
   */
  min: number;
  /**
   * The maximum value of the interval.
   */
  max: number;

  /**
   * Copy constructor.
   * @param interval The {@link Interval} to copy
   */
  constructor(interval: Interval);
  /**
   * Full constructor.
   * @param min The minimum value of the interval
   * @param max The maximum value of the interval
   */
  constructor(min: number, max: number);
  constructor(min: unknown, max?: unknown) {
    if (min instanceof Interval) {
      this.min = min.min;
      this.max = min.max;
    } else if (typeof min === "number" && typeof max === "number") {
      if (min > max)
        throw new Error("Interval: min must be less than or equal to max");
      this.min = min;
      this.max = max;
    }
  }

  /**
   * Method to set the minimum value of the interval.
   * @param min The minimum value of the interval
   * @throws `RangeError` if min is greater than the maximum value of the interval
   */
  public setMin(min: number): void {
    if (min > this.max)
      throw new RangeError("Interval.setMin: min must be less than or equal to max");
    this.min = min;
  }

  /**
   * Method to set the maximum value of the interval.
   * @param max The maximum value of the interval
   * @throws `RangeError` if max is less than the minimum value of the interval
   */
  public setMax(max: number): void {
    if (this.min > max)
      throw new RangeError("Interval.setMax: min must be less than or equal to max");
    this.max = max;
  }

  /**
   * Returns true if the given value is within this {@link Interval} inclusively.
   * @param value The value to check
   * @returns true if the given value is within this {@link Interval}
   */
  public includesInclusive(value: number): boolean {
    return this.min <= value && value <= this.max;
  }

  /**
   * Returns true if the given value is within this {@link Interval} exclusively.
   * @param value The value to check
   * @returns true if the given value is within this {@link Interval}
   */
  public includesExclusive(value: number): boolean {
    return value < this.max && value > this.min;
  }

  /**
   * Returns true if the given value is within this {@link Interval} min-inclusively.
   * @param value The value to check
   * @returns true if the given value is within this {@link Interval}
   */
  public includesInclusiveMin(value: number): boolean {
    return value < this.max && value >= this.min;
  }

  /**
   * Returns true if the given value is within this {@link Interval} max-inclusively.
   * @param value The value to check
   * @returns true if the given value is within this {@link Interval}
   */
  public includesInclusiveMax(value: number): boolean {
    return value <= this.max && value > this.min;
  }

  /**
   * Returns true if this {@link Interval} overlaps the given {@link Interval}
   * @param interval The {@link Interval} to check for overlap
   * @returns true if this {@link Interval} overlaps the given {@link Interval}
   */
  public overlaps(interval: Interval): boolean {
    return !(this.min > interval.max || this.max < interval.min);
  }

  /**
   * Returns the amount of overlap between this {@link Interval} and the given {@link Interval}
   * @param interval The {@link Interval} to check for overlap
   * @returns The amount of overlap between this {@link Interval} and the given {@link Interval}
   */
  public getOverlap(interval: Interval): number {
    if (this.overlaps(interval)) {
      return Math.min(this.max, interval.max) - Math.max(this.min, interval.min);
    }
    return 0;
  }

  /**
	 * If the value is within this {@link Interval}, inclusive, then return the value, else
	 * return either the max or minimum value.
   * @param value The value to clamp
   * @returns The clamped value
   */
  public clamp(value: number): number {
    return Interval.clamp(value, this.min, this.max);
  }

  /**
   * Returns the clamped value between the given min and max values.
   * @param value The value to clamp
   * @param min The minimum value
   * @param max The maximum value
   * @returns The clamped value
   */
  public static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Returns true if this {@link Interval} is degenerate.
   * @param error The allowed error to check for degeneracy
   * @returns true if this {@link Interval} is degenerate
   */
  public isDegenerate(error?: number): boolean {
    if (error) {
      return Math.abs(this.max - this.min) <= error;
    }
    return this.min === this.max;
  }

  /**
   * Returns true if the given {@link Interval} is contained in this {@link Interval} exclusively.
   * @param interval The {@link Interval} to check for containment
   * @returns true if this {@link Interval} contains the given {@link Interval}
   */
  public containsExclusive(interval: Interval): boolean {
    return this.min < interval.min && this.max > interval.max;
  }

  /**
   * Returns true if the given {@link Interval} is contained in this {@link Interval} inclusively.
   * @param interval The {@link Interval} to check for containment
   * @returns true if this {@link Interval} contains the given {@link Interval}
   */
  public containsInclusive(interval: Interval): boolean {
    return this.min <= interval.min && this.max >= interval.max;
  }

  /**
   * Returns true if the given {@link Interval} is contained in this {@link Interval} max-inclusively.
   * @param interval The {@link Interval} to check for containment
   * @returns true if this {@link Interval} contains the given {@link Interval}
   */
  public containsInclusiveMax(interval: Interval): boolean {
    return this.min < interval.min && this.max >= interval.max;
  }

  /**
   * Returns true if the given {@link Interval} is contained in this {@link Interval} min-inclusively.
   * @param interval The {@link Interval} to check for containment
   * @returns true if this {@link Interval} contains the given {@link Interval}
   */
  public containsInclusiveMin(interval: Interval): boolean {
    return this.min <= interval.min && this.max > interval.max;
  }

  /**
   * Method to union this {@link Interval} with the given {@link Interval}.
   * @param interval The {@link Interval} to union with this {@link Interval}
   */
  public union(interval: Interval): void {
    this.min = Math.min(this.min, interval.min);
    this.max = Math.max(this.max, interval.max);
  }

  /**
   * Returns the unioned {@link Interval} of this {@link Interval} and the given {@link Interval}.
   * @param interval The {@link Interval} to union with this {@link Interval}
   * @returns The unioned {@link Interval}
   */
  public getUnion(interval: Interval): Interval {
    return new Interval(Math.min(this.min, interval.min), Math.max(this.max, interval.max));
  }

  /**
   * Method to intersect this {@link Interval} with the given {@link Interval}.
   * @param interval The {@link Interval} to intersect with this {@link Interval}
   */
  public intersection(interval: Interval): void {
    if (this.overlaps(interval)) {
      this.min = Math.max(this.min, interval.min);
      this.max = Math.min(this.max, interval.max);
    } else {
      this.min = 0;
      this.max = 0;
    }
  }

  /**
   * Returns the intersected {@link Interval} of this {@link Interval} and the given {@link Interval}.
   * @param interval The {@link Interval} to intersect with this {@link Interval}
   * @returns The intersected {@link Interval}
   */
  public getIntersection(interval: Interval): Interval {
    if (this.overlaps(interval)) {
      return new Interval(Math.max(this.min, interval.min), Math.min(this.max, interval.max));
    }
    return new Interval(0, 0);
  }

  /**
   * Returns the distance between this {@link Interval} and the given {@link Interval}.
   * 
   * If the given interval overlaps this interval, then the distance is zero.
   * @param interval The {@link Interval} to check for distance
   * @returns The distance between this {@link Interval} and the given {@link Interval}
   */
  public distance(interval: Interval): number {
    if (this.overlaps(interval)) {
      return 0;
    } else if (this.max < interval.min) {
      return interval.min - this.max;
    } else {
      return this.min - interval.max;
    }
  }

  /**
   * Method to expand this {@link Interval} by half the given value in both directions.
   * 
   * The value can be negative to shrink the interval.  However, if the value is
	 * greater than the current length of the interval, the interval can become
	 * invalid.  In this case, the interval will become a degenerate interval at
	 * the mid point of the min and max.
   * @param value The value to expand this {@link Interval} by
   */
  public expand(value: number): void {
    const e = value * 0.5;
    this.min -= e;
    this.max += e;
    if (value < 0.0 && this.min > this.max) {
      const p = (this.min + this.max) * 0.5;
      this.min = p;
      this.max = p;
    }
  }
  /**
   * Returns the expanded {@link Interval} by half the given value in both directions.
   * 
   * The value can be negative to shrink the interval.  However, if the value is
	 * greater than the current length of the interval, the interval will be 
	 * invalid.  In this case, the interval returned will be a degenerate interval at
	 * the mid point of the min and max.
   * @param value The value to expand this {@link Interval} by
   * @returns The expanded {@link Interval}
   */
  public getExpanded(value: number): Interval {
    const e = value * 0.5;
    let min = this.min - e;
    let max = this.max + e;
    if (value < 0.0 && min > max) {
      const p = (min + max) * 0.5;
      min = p;
      max = p;
    }
    return new Interval(min, max);
  }

  /**
   * Returns the length of this {@link Interval}.
   * @returns The length of this {@link Interval}
   */
  public getLength(): number {
    return this.max - this.min;
  }

  public toString(): string {
    return `Interval[min=${this.min}, max=${this.max}]`;
  }
}