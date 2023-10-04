import { Feature } from "./Feature";
import { Vector2 } from "./Vector2";

/**
 * Implementation of a point {@link Feature} of a {@link Shape}.
 */
export class PointFeature extends Feature {
  /**
   * The point of the feature.
   */
  point: Vector2;

  /**
   * Full constructor.
   * @param point The point of the feature
   * @param index The index of the feature
   */
  constructor(point: Vector2, index?: number) {
    if(index === undefined) {
      super(Feature.NOT_INDEXED);
    } else {
      super(index);
    }
    this.point = point;
  }

  /**
   * Returns the point of the feature.
   * @returns The point of the feature
   */
  public getPoint(): Vector2 {
    return this.point;
  }

  public toString(): string {
    return `PointFeature[Point=${this.point.toString()}, Index=${this.index}]`;
  }
}