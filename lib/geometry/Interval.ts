export class Interval {
  min: number;
  max: number;

  constructor(interval: Interval);
  constructor(min: number, max: number);
  constructor(min: unknown, max?: unknown) {
    if (min instanceof Interval) {
      this.min = min.min;
      this.max = min.max;
    } else if (typeof min === "number" && typeof max === "number") {
      if (min > max)
        throw new Error("min must be less than or equal to max");
      this.min = min;
      this.max = max;
    }
  }

  public setMin(min: number): void {
    if (min > this.max)
      throw new Error("min must be less than or equal to max");
    this.min = min;
  }

  public setMax(max: number): void {
    if (this.min > max)
      throw new Error("min must be less than or equal to max");
    this.max = max;
  }

  public includesInclusive(value: number): boolean {
    return this.min <= value && value <= this.max;
  }

  public includesExclusive(value: number): boolean {
    return value < this.max && value > this.min;
  }

  public includesInclusiveMin(value: number): boolean {
    return value < this.max && value >= this.min;
  }

  public includesInclusiveMax(value: number): boolean {
    return value <= this.max && value > this.min;
  }

  public overlaps(interval: Interval): boolean {
    return !(this.min > interval.max || this.max < interval.min);
  }

  public getOverlap(interval: Interval): number {
    if (this.overlaps(interval)) {
      return Math.min(this.max, interval.max) - Math.max(this.min, interval.min);
    }
    return 0;
  }

  public clamp(value: number): number {
    return Interval.clamp(value, this.min, this.max);
  }

  public static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  public isDegenerate(error?: number): boolean {
    if (error) {
      return Math.abs(this.max - this.min) <= error;
    }
    return this.min === this.max;
  }

  public containsExclusive(interval: Interval): boolean {
    return this.min < interval.min && this.max > interval.max;
  }

  public containsInclusive(interval: Interval): boolean {
    return this.min <= interval.min && this.max >= interval.max;
  }

  public containsInclusiveMax(interval: Interval): boolean {
    return this.min <= interval.min && this.max > interval.max;
  }

  public containsInclusiveMin(interval: Interval): boolean {
    return this.min < interval.min && this.max >= interval.max;
  }

  public union(interval: Interval): void {
    this.min = Math.min(this.min, interval.min);
    this.max = Math.max(this.max, interval.max);
  }

  public getUnion(interval: Interval): Interval {
    return new Interval(Math.min(this.min, interval.min), Math.max(this.max, interval.max));
  }

  public intersection(interval: Interval): void {
    if (this.overlaps(interval)) {
      this.min = Math.max(this.min, interval.min);
      this.max = Math.min(this.max, interval.max);
    } else {
      this.min = 0;
      this.max = 0;
    }
  }

  public getIntersection(interval: Interval): Interval {
    if (this.overlaps(interval)) {
      return new Interval(Math.max(this.min, interval.min), Math.min(this.max, interval.max));
    }
    return new Interval(0, 0);
  }

  public distance(interval: Interval): number {
    if (this.overlaps(interval)) {
      return 0;
    } else if (this.max < interval.min) {
      return interval.min - this.max;
    } else {
      return this.min - interval.max;
    }
  }

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

  public getLength(): number {
    return this.max - this.min;
  }
}