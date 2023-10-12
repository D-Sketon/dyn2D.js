import { AABB, Transform, Translatable, Vector2 } from "../geometry";
import { Bounds } from "./Bounds";
import { CollisionBody } from "./CollisionBody";
import { Fixture } from "./Fixture";

/**
 * Abstract implementation of the {@link Bounds} interface.
 */
export abstract class AbstractBounds implements Bounds, Translatable {
  /**
   * The {@link Bounds} {@link Transform}
   */
  transform: Transform;

  /**
   * Default constructor.
   */
  constructor();
  /**
   * Optional constructor.
   * @param x The initial x translation of the bounds
   * @param y The initial y translation of the bounds
   */
  constructor(x: number, y: number);
  /**
   * Optional constructor.
   * @param translation The initial translation of the bounds
   */
  constructor(translation: Vector2);
  constructor(x?: unknown, y?: unknown) {
    this.transform = new Transform();
    if (x instanceof Vector2) {
      this.translate(x);
    } else if (typeof x === "number" && typeof y === "number") {
      this.translate(x, y);
    }
  }

  public getTranslation(): Vector2 {
    return this.transform.getTranslation();
  }

  public abstract isOutside(body: CollisionBody<any>): boolean;
  public abstract isOutside(aabb: AABB): boolean;
  public abstract isOutside(aabb: AABB, transform: Transform, fixture: Fixture): boolean;

  public translate(vector: Vector2): void;
  public translate(x: number, y: number): void;
  public translate(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.transform.translate(x);
    } else if (typeof x === "number" && typeof y === "number") {
      this.transform.translate(x, y);
    }
  }

  public shift(shift: Vector2): void {
    this.transform.translate(shift);
  }

}