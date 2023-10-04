import { Vector2 } from "./Vector2";

/**
 * Implementation of a ray.
 * 
 * A ray is a vector with a start point.
 */
export class Ray {
  /**
   * The start point
   */
  start: Vector2;
  /**
   * The direction
   */
  direction: Vector2;

  /**
   * Minimal constructor.
   * @param direction The direction
   * @throws `TypeError` if direction is null
   * @throws `TypeError` if direction is zero
   */
  constructor(direction: number);
  /**
   * Minimal constructor.
   * @param direction The direction
   * @throws `TypeError` if direction is null
   * @throws `TypeError` if direction is zero
   */
  constructor(direction: Vector2);
  /**
   * Full constructor.
   * @param start The start point
   * @param direction The direction
   * @throws `TypeError` if start is null
   * @throws `TypeError` if direction is null
   * @throws `TypeError` if direction is zero
   */
  constructor(start: Vector2, direction: number);
  /**
   * Full constructor.
   * @param start The start point
   * @param direction The direction
   * @throws `TypeError` if start is null
   * @throws `TypeError` if direction is null
   * @throws `TypeError` if direction is zero
   */
  constructor(start: Vector2, direction: Vector2);
  constructor(start: Vector2 | number, direction?: Vector2 | number) {
    if (direction == null) {
      if (start instanceof Vector2) {
        return new Ray(new Vector2(), start);
      } else {
        return new Ray(new Vector2(start));
      }
    } else {
      if (direction instanceof Vector2) {
        if (start == null)
          throw new TypeError("Ray: Start cannot be null.");
        if (direction == null)
          throw new TypeError("Ray: Direction cannot be null.");
        if (direction.isZero())
          throw new TypeError("Ray: Direction cannot be zero.");
        this.start = start as Vector2;
        this.direction = direction.getNormalized();
      } else {
        return new Ray(start as Vector2, new Vector2(direction));
      }
    }
  }

  public toString(): string {
    return `Ray[start=${this.start.toString()}, direction=${this.direction.toString()}]`;
  }

  /**
   * Returns the start point.
   * @returns The start point
   */
  public getStart(): Vector2 {
    return this.start;
  }

  /**
   * Method to set the start point.
   * @param start The start point
   * @throws `TypeError` if start is null
   */
  public setStart(start: Vector2): void {
    if (start == null)
      throw new TypeError("Ray.setStart: Start cannot be null.");
    this.start = start;
  }

  /**
   * Returns the direction.
   * @returns The direction
   */
  public getDirection(): number {
    return this.direction.getDirection();
  }

  /**
   * Method to set the direction.
   * @param direction The direction
   * @throws `TypeError` if direction is null
   * @throws `TypeError` if direction is zero
   */
  public setDirection(direction: number): void;
  /**
   * Method to set the direction.
   * @param direction The direction
   * @throws `TypeError` if direction is null
   * @throws `TypeError` if direction is zero
   */
  public setDirection(direction: Vector2): void;
  public setDirection(direction: Vector2 | number): void {
    if (direction == null)
      throw new TypeError("Ray.setDirection: Direction cannot be null.");
    if (direction instanceof Vector2) {
      if (direction.isZero())
        throw new TypeError("Ray.setDirection: Direction cannot be zero.");
      this.direction = direction;
    } else {
      this.direction = new Vector2(direction);
    }
  }
}