import { Feature } from "./Feature";
import { Vector2 } from "./Vector2";

export class PointFeature extends Feature {
  point: Vector2;

  constructor(point: Vector2, index?: number) {
    if(index === undefined) {
      super(Feature.NOT_INDEXED);
    } else {
      super(index);
    }
    this.point = point;
  }

  public getPoint(): Vector2 {
    return this.point;
  }

  public toString(): string {
    return `PointFeature[Point=${this.point.toString()}, Index=${this.index}]`;
  }
}