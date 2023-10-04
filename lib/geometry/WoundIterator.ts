import { Vector2 } from "./Vector2";

/**
 * Represents an iterator of {@link Vector2}s for the vertices and normals.
 */
export class WoundIterator implements Iterator<Vector2>{
  /**
   * The array to iterate over
   */
  vertices: Vector2[];
  /**
   * The current index
   */
  index: number;

  /**
   * Minimal constructor.
   * @param vertices The array to iterate over
   */
  constructor(vertices: Vector2[]) {
    this.vertices = vertices;
    this.index = 0;
  }

  public hasNext(): boolean {
    return this.index < this.vertices.length;
  }

  public next(): IteratorResult<Vector2, any> {
    if (this.index < this.vertices.length) {
      const v = this.vertices[this.index++];
      return {
        done: false,
        value: v.copy()
      };
    } else {
      return {
        done: true,
        value: null
      };
    }
  }

  public toString(): string {
    return `WoundIterator[Vertices=${this.vertices.toString()}, Index=${this.index}]`;
  }
}