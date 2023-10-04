import { DataContainer } from "../DataContainer";
import { Convex } from "./Convex";
import { Segment } from "./Segment";
import { Shape } from "./Shape";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";
import { Wound } from "./Wound";

/**
 * This class is a specialization of the {@link Segment} class that provides smooth sliding across
 * a chain of line segments.  This is achieved by storing the connectivity information between the
 * links.  With this, a correction process is performed to avoid the 'internal edge' problem.
 * 
 * A {@link Link} is an infinitely thin line segment and will behave like the {@link Segment} class in
 * collision response.
 */
export class Link extends Segment implements Convex, Wound, Shape, Transformable, DataContainer {
  /**
   * The previous link in the chain
   */
  previous: Link;
  /**
   * The next link in the chain
   */
  next: Link;

  /**
   * Full constructor.
   * @param point1 The first vertex
   * @param point2 The second vertex
   */
  constructor(point1: Vector2, point2: Vector2) {
    super(point1, point2);
    this.previous = null;
    this.next = null;
  }

  /**
   * Returns the last vertex of the previous segment.
   * @returns The last vertex of the previous segment.
   */
  public getPoint0(): Vector2 {
    return this.previous != null ? this.previous.getPoint1() : null;
  }

  /**
   * Returns the first vertex of the next segment.
   * @returns The first vertex of the next segment.
   */
  public getPoint3(): Vector2 {
    return this.next != null ? this.next.getPoint2() : null;
  }

  /**
   * Returns the next link in the chain.
   * @returns The next link in the chain.
   */
  public getNext(): Link {
    return this.next;
  }

  /**
   * Returns the previous link in the chain.
   * @returns The previous link in the chain.
   */
  public getPrevious(): Link {
    return this.previous;
  }

  /**
   * Method to set the next link in the chain.
   * 
   * This method will also:
	 * - Unlink the current next (if applicable) and this link
	 * - Link the given next and this link
   * @param next The next link
   */
  public setNext(next: Link): void {
    if (this.next != null) {
      this.next.previous = null;
    }
    this.next = next;
    if (next != null) {
      next.previous = this;
    }
  }

  /**
   * Sets the previous link in the chain.
   * 
	 * This method will also:
	 * - Unlink the current previous (if applicable) and this link
	 * - Link the given previous and this link
   * @param previous The previous link
   */
  public setPrevious(previous: Link): void {
    if (this.previous != null) {
      this.previous.next = null;
    }
    this.previous = previous;
    if (previous != null) {
      previous.next = this;
    }
  }

  public toString(): string {
    return `Link[${super.toString()}, length=${this.length}]`;
  }

  public rotate(rotation: unknown, x?: unknown, y?: unknown): void {
    if (typeof rotation === "number" && typeof x === "number" && typeof y === "number") {
      super.rotate(rotation, x, y);
      if (this.next != null) {
        this.next.vertices[0].set(this.vertices[1]);
        Link.updateNormals(this.next);
        Link.updateLength(this.next);
      }
      if (this.previous != null) {
        this.previous.vertices[1].set(this.vertices[0]);
        Link.updateNormals(this.previous);
        Link.updateLength(this.previous);
      }
    } else {
      super.rotate(rotation as any, x as any, y as any);
    }
  }

  public translate(x: unknown, y?: unknown): void {
    if (x instanceof Vector2) {
      this.translate(x.x, x.y);
    } else if (typeof x === "number" && typeof y === "number") {
      super.translate(x, y);
      if (this.next != null) {
        this.next.vertices[0].set(this.vertices[1]);
        Link.updateNormals(this.next);
        Link.updateLength(this.next);
      }
      if (this.previous != null) {
        this.previous.vertices[1].set(this.vertices[0]);
        Link.updateNormals(this.previous);
        Link.updateLength(this.previous);
      }
    }
  }
	
	/**
	 * Updates the normals of the given {@link Segment}.
   * 
	 * When rotating a link in a link chain, the connected links
	 * will need their normals recomputed to match the change.
	 * @param segment the segment to update
	 */
  private static updateNormals(segment: Segment): void {
    const v = segment.vertices[0].to(segment.vertices[1]);
    segment.normals[0] = v.copy();
    segment.normals[0].normalize();
    segment.normals[1] = v.right();
    segment.normals[1].normalize();
  }

	/**
	 * Updates the length and radius of the given {@link Segment}.
   * 
	 * When rotating or translating a link in a link chain, the connected links
	 * will need their lengths and maximum radius recomputed to match the change.
	 * @param segment the segment to update
	 */
  private static updateLength(segment: Segment): void {
    const length = segment.vertices[0].distance(segment.vertices[1]);
		segment.length = length;
		segment.radius = length * 0.5;
  }

}