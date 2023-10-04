import { Copyable } from "../Copyable";
import { Translatable } from "./Translatable";
import { Vector2 } from "./Vector2";

/**
 * Implementation of an Axis-Align Bounding Box.
 * 
 * An {@link AABB} has minimum and maximum coordinates that define the box.
 */
export class AABB implements Translatable, Copyable<AABB> {
  /** 
   * The minimum extent along the X-axis coordinate of the {@link AABB}.
   */
  minX: number;
  /**
   * The minimum extent along the Y-axis coordinate of the {@link AABB}.
   */
  minY: number;
  /**
   * The maximum extent along the X-axis coordinate of the {@link AABB}.
   */
  maxX: number;
  /**
   * The maximum extent along the Y-axis coordinate of the {@link AABB}.
   */
  maxY: number;

  /**
   * Full constructor.
   * @param radius The radius of a circle fitting inside the {@link AABB}.
   * @throws `RangeError` if the radius is negative.
   */
  constructor(radius: number);
  /**
   * Full constructor.
   * @param center The center of the circle.
   * @param radius The radius of a circle fitting inside the {@link AABB}.
   * @throws `RangeError` if the radius is negative.
   */
  constructor(center: Vector2 | null, radius: number);
  /**
   * Full constructor.
   * @param min The minimum extent of the {@link AABB}.
   * @param max The maximum extent of the {@link AABB}.
   * @throws `RangeError` if the minimum X-coordinate is greater than the maximum X-coordinate.
   */
  constructor(min: Vector2, max: Vector2);
  /**
   * Full constructor.
   * @param minX The minimum extent along the X-axis coordinate of the {@link AABB}.
   * @param minY The minimum extent along the Y-axis coordinate of the {@link AABB}.
   * @param maxX The maximum extent along the X-axis coordinate of the {@link AABB}.
   * @param maxY The maximum extent along the Y-axis coordinate of the {@link AABB}.
   * @throws `RangeError` if the minimum X-coordinate is greater than the maximum X-coordinate.
   * @throws `RangeError` if the minimum Y-coordinate is greater than the maximum Y-coordinate.
   */
  constructor(minX: number, minY: number, maxX: number, maxY: number);
  /**
   * Copy constructor.
   * @param aabb The {@link AABB} to copy.
   */
  constructor(aabb: AABB);
  constructor(...args: any[]) {
    if (args.length === 1) {
      if (args[0] instanceof AABB) {
        const aabb = args[0] as AABB;
        this.minX = aabb.minX;
        this.minY = aabb.minY;
        this.maxX = aabb.maxX;
        this.maxY = aabb.maxY;
      } else if (typeof args[0] === "number") {
        return new AABB(null, args[0]);
      }
    } else if (args.length === 2) {
      if (args[0] instanceof Vector2 && args[1] instanceof Vector2) {
        const min = args[0] as Vector2;
        const max = args[1] as Vector2;
        return new AABB(min.x, min.y, max.x, max.y);
      } else {
        const center = args[0] as Vector2 | null;
        const radius = args[1] as number;
        if (radius < 0)
          throw new RangeError("AABB: Radius cannot be negative.");
        if (center == null) {
          this.minX = -radius;
          this.minY = -radius;
          this.maxX = radius;
          this.maxY = radius;
        } else {
          this.minX = center.x - radius;
          this.minY = center.y - radius;
          this.maxX = center.x + radius;
          this.maxY = center.y + radius;
        }
      }
    } else if (args.length === 4) {
      const minX = args[0] as number;
      const minY = args[1] as number;
      const maxX = args[2] as number;
      const maxY = args[3] as number;
      if (minX > maxX)
        throw new RangeError("AABB: Minimum X cannot be greater than maximum X.");
      if (minY > maxY)
        throw new RangeError("AABB: Minimum Y cannot be greater than maximum Y.");
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
    }
  }

  /**
   * Method to create an {@link AABB} from two points.
   * @param point1 The first point.
   * @param point2 The second point.
   * @returns The {@link AABB} created from the two points.
   */
  public static createFromPoints(point1: Vector2, point2: Vector2): AABB;
  /**
   * Method to create an {@link AABB} from two points.
   * @param point1x The X-coordinate of the first point.
   * @param point1y The Y-coordinate of the first point.
   * @param point2x The X-coordinate of the second point.
   * @param point2y The Y-coordinate of the second point.
   * @returns The {@link AABB} created from the two points.
   */
  public static createFromPoints(point1x: number, point1y: number, point2x: number, point2y: number): AABB;
  public static createFromPoints(...args: any[]): AABB {
    if (args.length === 2) {
      const point1 = args[0] as Vector2;
      const point2 = args[1] as Vector2;
      return AABB.createFromPoints(point1.x, point1.y, point2.x, point2.y);
    } else {
      const point1x = args[0] as number;
      const point1y = args[1] as number;
      const point2x = args[2] as number;
      const point2y = args[3] as number;
      const aabb = new AABB(0, 0, 0, 0);
      AABB.setFromPoints(point1x, point1y, point2x, point2y, aabb);
      return aabb;
    }
  }

  /**
   * Method to set an {@link AABB} from two points.
   * @param point1 The first point.
   * @param point2 The second point.
   * @param result The {@link AABB} to store the result in.
   */
  public static setFromPoints(point1: Vector2, point2: Vector2, result: AABB): void;
  /**
   * Method to set an {@link AABB} from two points.
   * @param point1x The X-coordinate of the first point.
   * @param point1y The Y-coordinate of the first point.
   * @param point2x The X-coordinate of the second point.
   * @param point2y The Y-coordinate of the second point.
   * @param result The {@link AABB} to store the result in.
   */
  public static setFromPoints(point1x: number, point1y: number, point2x: number, point2y: number, result: AABB): void;
  public static setFromPoints(...args: any[]): void {
    if (args.length === 3) {
      const point1 = args[0] as Vector2;
      const point2 = args[1] as Vector2;
      const result = args[2] as AABB;
      AABB.setFromPoints(point1.x, point1.y, point2.x, point2.y, result);
    } else {
      let point1x = args[0] as number;
      let point1y = args[1] as number;
      let point2x = args[2] as number;
      let point2y = args[3] as number;
      const result = args[4] as AABB;
      if (point2x < point1x) {
        const temp = point1x;
        point1x = point2x;
        point2x = temp;
      }

      if (point2y < point1y) {
        const temp = point1y;
        point1y = point2y;
        point2y = temp;
      }

      result.minX = point1x;
      result.minY = point1y;
      result.maxX = point2x;
      result.maxY = point2y;
    }
  }

  public copy(): AABB {
    return new AABB(this);
  }

  /**
   * Method to set the {@link AABB} to the zero {@link AABB}.
   */
  public zero(): void {
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;
  }

  /**
   * Method to set this {@link AABB} to the given {@link AABB}.
   * @param aabb The {@link AABB} to set this {@link AABB} to.
   * @returns This {@link AABB}.
   */
  public set(aabb: AABB): AABB {
    this.minX = aabb.minX;
    this.minY = aabb.minY;
    this.maxX = aabb.maxX;
    this.maxY = aabb.maxY;
    return this;
  }

  /**
   * Method to check if this {@link AABB} is deeply equal to the given object.
   * @param obj The object to compare.
   * @returns Whether the given object is equal to this {@link AABB}.
   */
  public equals(obj: any): boolean {
    if (obj == null) return false;
    if (this == obj) return true;
    if (!(obj instanceof AABB)) return false;
    const aabb = obj as AABB;
    return this.minX === aabb.minX && this.minY === aabb.minY
      && this.maxX === aabb.maxX && this.maxY === aabb.maxY;
  }

  public translate(vector: Vector2): void;
  public translate(x: number, y: number): void;
  public translate(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.minX += x.x;
      this.minY += x.y;
      this.maxX += x.x;
      this.maxY += x.y;
    } else {
      this.minX += x as number;
      this.minY += y as number;
      this.maxX += x as number;
      this.maxY += y as number;
    }
  }

  /**
   * Returns a new {@link AABB} translated by the given {@link Vector2}.
   * @param translation The {@link Vector2} to translate this {@link AABB} by.
   * @returns The new {@link AABB}.
   */
  public getTranslated(translation: Vector2): AABB {
    return new AABB(this.minX + translation.x,
      this.minY + translation.y,
      this.maxX + translation.x,
      this.maxY + translation.y);
  }

  /**
   * Returns the width of this {@link AABB}.
   * @returns The width of this {@link AABB}.
   */
  public getWidth(): number {
    return this.maxX - this.minX;
  }

  /**
   * Returns the height of this {@link AABB}.
   * @returns The height of this {@link AABB}.
   */
  public getHeight(): number {
    return this.maxY - this.minY;
  }

  /**
   * Returns the perimeter of this {@link AABB}.
   * @returns The perimeter of this {@link AABB}.
   */
  public getPerimeter(): number {
    return 2 * (this.getWidth() + this.getHeight());
  }

  /**
   * Returns the area of this {@link AABB}.
   * @returns The area of this {@link AABB}.
   */
  public getArea(): number {
    return this.getWidth() * this.getHeight();
  }

  /**
   * Method to union this {@link AABB} with the given {@link AABB}.
   * @param aabb The {@link AABB} to union with this {@link AABB}.
   * @returns This {@link AABB}.
   */
  public union(aabb: AABB): AABB;
  /**
   * Method to union two {@link AABB}s.
   * @param aabb1 The first {@link AABB} to union with this {@link AABB}.
   * @param aabb2 The second {@link AABB} to union with this {@link AABB}.
   * @returns This {@link AABB}.
   */
  public union(aabb1: AABB, aabb2: AABB): AABB;
  public union(aabb1: AABB, aabb2?: AABB): AABB {
    if (aabb2 == null) {
      return this.union(this, aabb1);
    } else {
      this.minX = Math.min(aabb1.minX, aabb2.minX);
      this.minY = Math.min(aabb1.minY, aabb2.minY);
      this.maxX = Math.max(aabb1.maxX, aabb2.maxX);
      this.maxY = Math.max(aabb1.maxY, aabb2.maxY);
      return this;
    }
  }

  /**
   * Method to get the new union of this {@link AABB} with the given {@link AABB}.
   * @param aabb The {@link AABB} to union with this {@link AABB}.
   * @returns The new {@link AABB}.
   */
  public getUnion(aabb: AABB): AABB {
    return this.copy().union(aabb);
  }

  /**
   * Method to intersect this {@link AABB} with the given {@link AABB}.
   * 
   * If the given {@link AABB} does not overlap this {@link AABB}, this {@link AABB} is
   * set to a zero {@link AABB}.
   * @param aabb The {@link AABB} to intersect with this {@link AABB}.
   * @returns This {@link AABB}.
   */
  public intersection(aabb: AABB): AABB;
  /**
   * Method to intersect two {@link AABB}s.
   * 
   * If the given {@link AABB}s do not overlap, this {@link AABB} is
   * set to a zero {@link AABB}.
   * @param aabb1 The first {@link AABB} to intersect with this {@link AABB}.
   * @param aabb2 The second {@link AABB} to intersect with this {@link AABB}.
   * @returns This {@link AABB}.
   */
  public intersection(aabb1: AABB, aabb2: AABB): AABB;
  public intersection(aabb1: AABB, aabb2?: AABB): AABB {
    if (aabb2 == null) {
      return this.intersection(this, aabb1);
    } else {
      this.minX = Math.max(aabb1.minX, aabb2.minX);
      this.minY = Math.max(aabb1.minY, aabb2.minY);
      this.maxX = Math.min(aabb1.maxX, aabb2.maxX);
      this.maxY = Math.min(aabb1.maxY, aabb2.maxY);

      if (this.minX > this.maxX || this.minY > this.maxY) {
        this.minX = 0.0;
        this.minY = 0.0;
        this.maxX = 0.0;
        this.maxY = 0.0;
      }
      return this;
    }
  }

  /**
   * Method to get the new intersection of this {@link AABB} with the given {@link AABB}.
   * @param aabb The {@link AABB} to intersect with this {@link AABB}.
   * @returns The new {@link AABB}.
   */
  public getIntersection(aabb: AABB): AABB {
    return this.copy().intersection(aabb);
  }

  /**
   * Method to expand this {@link AABB} by the given amount.
   * 
   * The expansion can be negative to shrink the {@link AABB}.  However, if the expansion is
   * greater than the current width/height, the {@link AABB} can become invalid.  In this 
   * case, the AABB will become a degenerate AABB at the mid point of the min and max for 
   * the respective coordinates.
   * @param expansion The amount to expand this {@link AABB} by.
   * @returns This {@link AABB}.
   */
  public expand(expansion: number): AABB {
    const e = expansion * 0.5;
    this.minX -= e;
    this.minY -= e;
    this.maxX += e;
    this.maxY += e;
    if (expansion < 0) {
      if (this.minX > this.maxX) {
        const mid = (this.minX + this.maxX) * 0.5;
        this.minX = mid;
        this.maxX = mid;
      }
      if (this.minY > this.maxY) {
        const mid = (this.minY + this.maxY) * 0.5;
        this.minY = mid;
        this.maxY = mid;
      }
    }
    return this;
  }

  /**
   * Method to get the new {@link AABB} expanded by the given amount.
   * 
   * The expansion can be negative to shrink the {@link AABB}.  However, if the expansion is
   * greater than the current width/height, the {@link AABB} can become invalid.  In this 
   * case, the AABB will become a degenerate AABB at the mid point of the min and max for 
   * the respective coordinates.
   * @param expansion The amount to expand this {@link AABB} by.
   * @returns The new {@link AABB}.
   */
  public getExpanded(expansion: number): AABB {
    return this.copy().expand(expansion);
  }

  /**
   * Method to check if this {@link AABB} overlaps the given {@link AABB}.
   * @param aabb The {@link AABB} to check for overlap.
   * @returns true if this {@link AABB} overlaps the given {@link AABB}.
   */
  public overlaps(aabb: AABB): boolean {
    return this.minX <= aabb.maxX &&
      this.maxX >= aabb.minX &&
      this.minY <= aabb.maxY &&
      this.maxY >= aabb.minY;
  }

  /**
   * Method to check if this {@link AABB} contains the given {@link AABB}.
   * @param aabb The {@link AABB} to check for containment.
   * @returns true if this {@link AABB} contains the given {@link AABB}.
   */
  public contains(aabb: AABB): boolean;
  /**
   * Method to check if this {@link AABB} contains the given {@link Vector2}.
   * @param point The {@link Vector2} to check for containment.
   * @returns true if this {@link AABB} contains the given {@link Vector2}.
   */
  public contains(point: Vector2): boolean;
  /**
   * Method to check if this {@link AABB} contains the given coordinates.
   * @param x The X-coordinate to check for containment.
   * @param y The Y-coordinate to check for containment.
   * @returns true if this {@link AABB} contains the given coordinates.
   */
  public contains(x: number, y: number): boolean;
  public contains(x: unknown, y?: unknown): boolean {
    if (x instanceof AABB) {
      const aabb = x as AABB;
      return this.minX <= aabb.minX && this.minY <= aabb.minY
        && this.maxX >= aabb.maxX && this.maxY >= aabb.maxY;
    } else if (x instanceof Vector2) {
      return this.contains(x.x, x.y);
    } else {
      return this.minX <= (x as number) &&
        this.maxX >= (x as number) &&
        this.minY <= (y as number) &&
        this.maxY >= (y as number);
    }
  }

  /**
   * Method to check if this {@link AABB} is degenerate.
   * 
   * A degenerate {@link AABB} is one where its min and max x or y
   * coordinates are equal.
   * @param error The allowed error to use for the degenerate check.
   * @returns true if this {@link AABB} is degenerate.
   */
  public isDegenerate(error?: number): boolean {
    if (error == null) error = 0;
    return Math.abs(this.maxX - this.minX) <= error || Math.abs(this.maxY - this.minY) <= error;
  }

  /**
   * Returns the center of this {@link AABB}.
   * @returns The center of this {@link AABB}.
   */
  public getCenter(): Vector2 {
    return new Vector2((this.minX + this.maxX) * 0.5, (this.minY + this.maxY) * 0.5);
  }

  /**
   * Returns the minimum extent along the X-axis coordinate of the {@link AABB}.
   * @returns The minimum extent along the X-axis coordinate of the {@link AABB}.
   */
  public getMinX(): number {
    return this.minX;
  }

  /**
   * Returns the minimum extent along the Y-axis coordinate of the {@link AABB}.
   * @returns The minimum extent along the Y-axis coordinate of the {@link AABB}.
   */
  public getMinY(): number {
    return this.minY;
  }

  /**
   * Returns the maximum extent along the X-axis coordinate of the {@link AABB}.
   * @returns The maximum extent along the X-axis coordinate of the {@link AABB}.
   */
  public getMaxX(): number {
    return this.maxX;
  }

  /**
   * Returns the maximum extent along the Y-axis coordinate of the {@link AABB}.
   * @returns The maximum extent along the Y-axis coordinate of the {@link AABB}.
   */
  public getMaxY(): number {
    return this.maxY;
  }

  public toString(): string {
    return `AABB[MinX=${this.minX}, MinY=${this.minY}, MaxX=${this.maxX}, MaxY=${this.maxY}]`;
  }
}