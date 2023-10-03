import { DataContainer } from "../DataContainer";
import { Convex } from "./Convex";
import { Segment } from "./Segment";
import { Shape } from "./Shape";
import { Transformable } from "./Transformable";
import { Vector2 } from "./Vector2";
import { Wound } from "./Wound";

export class Link extends Segment implements Convex, Wound, Shape, Transformable, DataContainer {
  previous: Link;
  next: Link;

  constructor(point1: Vector2, point2: Vector2) {
    super(point1, point2);
    this.previous = null;
    this.next = null;
  }

  public getPoint0(): Vector2 {
    return this.previous != null ? this.previous.getPoint1() : null;
  }

  public getPoint3(): Vector2 {
    return this.next != null ? this.next.getPoint2() : null;
  }

  public getNext(): Link {
    return this.next;
  }

  public getPrevious(): Link {
    return this.previous;
  }

  public setNext(next: Link): void {
    if (this.next != null) {
      this.next.previous = null;
    }
    this.next = next;
    if (next != null) {
      next.previous = this;
    }
  }

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

  private static updateNormals(segment: Segment): void {
    const v = segment.vertices[0].to(segment.vertices[1]);
    segment.normals[0] = v.copy();
    segment.normals[0].normalize();
    segment.normals[1] = v.right();
    segment.normals[1].normalize();
  }

  private static updateLength(segment: Segment): void {
    const length = segment.vertices[0].distance(segment.vertices[1]);
		segment.length = length;
		segment.radius = length * 0.5;
  }

}