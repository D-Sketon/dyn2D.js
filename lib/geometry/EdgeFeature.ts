import { Feature } from "./Feature";
import { PointFeature } from "./PointFeature";
import { Vector2 } from "./Vector2";

export class EdgeFeature extends Feature {
  vertex1: PointFeature;
  vertex2: PointFeature;
  max: PointFeature;
  edge: Vector2;

  constructor(vertex1: PointFeature, vertex2: PointFeature, max: PointFeature, edge: Vector2, index: number) {
    super(index);
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.max = max;
    this.edge = edge;
  }

  public toString(): string {
    return `EdgeFeature[vertex1=${this.vertex1}, vertex2=${this.vertex2}, max=${this.max}, edge=${this.edge}, index=${this.index}]`;
  }

  public getVertex1(): PointFeature {
    return this.vertex1;
  }

  public getVertex2(): PointFeature {
    return this.vertex2;
  }

  public getMaximum(): PointFeature {
    return this.max;
  }

  public getEdge(): Vector2 {
    return this.edge;
  }
}