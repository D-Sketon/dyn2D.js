import { Vector2 } from "./Vector2";

export class Ray {
  start: Vector2;
  direction: Vector2;

  constructor(direction: number);
  constructor(direction: Vector2);
  constructor(start: Vector2, direction: number);
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
          throw new Error("Ray: Start cannot be null.");
        if (direction == null)
          throw new Error("Ray: Direction cannot be null.");
        if (direction.isZero())
          throw new Error("Ray: Direction cannot be zero.");
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

  public getStart(): Vector2 {
    return this.start;
  }

  public setStart(start: Vector2): void {
    if (start == null)
      throw new Error("Ray.setStart: Start cannot be null.");
    this.start = start;
  }

  public getDirection(): number {
    return this.direction.getDirection();
  }

  public setDirection(direction: number): void;
  public setDirection(direction: Vector2): void;
  public setDirection(direction: Vector2 | number): void {
    if (direction == null)
      throw new Error("Ray.setDirection: Direction cannot be null.");
    if (direction instanceof Vector2) {
      if (direction.isZero())
        throw new Error("Ray.setDirection: Direction cannot be zero.");
      this.direction = direction;
    } else {
      this.direction = new Vector2(direction);
    }


  }

}