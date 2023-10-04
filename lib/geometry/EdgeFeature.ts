import { Feature } from "./Feature";
import { PointFeature } from "./PointFeature";
import { Vector2 } from "./Vector2";

/**
 * Implementation of an edge {@link Feature} of a {@link Shape}.
 * 
 * An {@link EdgeFeature} represents a **linear** edge of a {@link Shape} connecting
 * two vertices.  It's not the intent of this class to represent curved edges.
 */
export class EdgeFeature extends Feature {
  /**
   * The first vertex of the edge
   */
  vertex1: PointFeature;
  /**
   * The second vertex of the edge
   */
  vertex2: PointFeature;
  /**
   * The vertex of maximum projection along a {@link Vector2} direction.
   */
  max: PointFeature;
  /**
   * The {@link Vector2} of the edge.
   */
  edge: Vector2;

  /**
   * Full constructor.
   * @param vertex1 The first vertex of the edge
   * @param vertex2 The second vertex of the edge
   * @param max The maximum point
   * @param edge The {@link Vector2} of the edge
   * @param index The index of the edge
   */
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

  /**
   * Returns the first vertex of the edge.
   * @returns The first vertex of the edge
   */
  public getVertex1(): PointFeature {
    return this.vertex1;
  }

  /**
   * Returns the second vertex of the edge.
   * @returns The second vertex of the edge
   */
  public getVertex2(): PointFeature {
    return this.vertex2;
  }

  /**
   * Returns the maximum point.
   * @returns The maximum point
   */
  public getMaximum(): PointFeature {
    return this.max;
  }

  /**
   * Returns the {@link Vector2} of the edge.
   * @returns The {@link Vector2} of the edge
   */
  public getEdge(): Vector2 {
    return this.edge;
  }
}