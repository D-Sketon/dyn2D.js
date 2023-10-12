import { CollisionBody, TYPICAL_FIXTURE_COUNT } from "./CollisionBody";
import { DataContainer } from "../DataContainer";
import { Ownable } from "../Ownable";
import { AABB, Transform, Rotation, Transformable, Vector2, Convex } from "../geometry";
import { Fixture } from "./Fixture";
import { FixtureModificationHandler } from "./FixtureModificationHandler";
/**
 * A base implementation of the {@link CollisionBody} interface.
 */
export abstract class AbstractCollisionBody<T extends Fixture> implements CollisionBody<T>, Transformable, DataContainer, Ownable {
  /**
   * The current {@link Transform}.
   */
  transform: Transform;
  /**
   * The previous {@link Transform}.
   */
  transform0: Transform;
  /**
   * The {@link Fixture} list
   */
  fixtures: T[];
  /**
   * An unmodifiable view of the {@link Fixture} list.
   */
  fixturesUnmodifiable: readonly T[];
  /**
   * The rotation disk radius
   */
  radius: number;
  /**
   * The user data
   */
  userData: any;
  /**
   * The enabled flag
   */
  enabled: boolean;
  /**
   * Used for notifcation of fixture modification events
   */
  fixtureModificationHandler: FixtureModificationHandler<T>;
  /**
   * User for ownership by another object
   */
  owner: any;

  /**
   * Default constructor.
   */
  constructor();
  /**
   * Optional constructor.
   * @param fixtureCount The estimated number of fixtures
   */
  constructor(fixtureCount: number);
  constructor(fixtureCount?: number) {
    if (fixtureCount === void 0) {
      fixtureCount = TYPICAL_FIXTURE_COUNT;
      const size = fixtureCount <= 0 ? TYPICAL_FIXTURE_COUNT : fixtureCount;
      this.fixtures = new Array<T>(size);
      this.fixturesUnmodifiable = Object.freeze(this.fixtures);
      this.radius = 0.0;
      this.transform = new Transform();
      this.transform0 = new Transform();
      this.enabled = true;
    }
  }

  public addFixture(fixture: T): CollisionBody<T>;
  public addFixture(convex: Convex): T;
  public addFixture(convex: unknown): T | CollisionBody<T> {
    if (convex == null) {
      throw new TypeError("AbstractCollisionBody.addFixture: Convex cannot be null");
    }
    if (convex instanceof Fixture) {
      const fixture: T = convex as T;
      this.fixtures.push(fixture);
      if (this.fixtureModificationHandler != null) {
        this.fixtureModificationHandler.onFixtureAdded(fixture);
      }
      return this;
    }
  }

  public getFixture(index: number): T;
  public getFixture(point: Vector2): T;
  public getFixture(point: unknown): T {
    if (typeof point === "number") {
      return this.fixtures[point];
    }
    if (point instanceof Vector2) {
      const len = this.fixtures.length;
      for (let i = 0; i < len; i++) {
        const f = this.fixtures[i];
        const convex = f.getShape();
        if (convex.contains(point, this.transform)) {
          return f;
        }
      }
      return null;
    }
  }

  public getFixtures(point: Vector2): T[];
  public getFixtures(): T[];
  public getFixtures(point?: unknown): T[] {
    if (point === void 0) {
      return [...this.fixturesUnmodifiable];
    }
    if (point instanceof Vector2) {
      const fixtures = [];
      const len = this.fixtures.length;
      for (let i = 0; i < len; i++) {
        const fixture = this.fixtures[i];
        const convex = fixture.getShape();
        if (convex.contains(point, this.transform)) {
          fixtures.push(fixture);
        }
      }
      return fixtures;
    }
  }

  public getFixtureCount(): number {
    return this.fixtures.length;
  }

  public getFixtureIterator(): Iterator<T, any, undefined> {
    return new FixtureIterator<T>(this);
  }

  [Symbol.iterator](): Iterator<T, any, undefined> {
    return this.getFixtureIterator();
  }

  public removeFixture(index: number): T;
  public removeFixture(point: Vector2): T;
  public removeFixture(fixture: T): boolean;
  public removeFixture(fixture: unknown): boolean | T {
    if (fixture instanceof Fixture) {
      const index = this.fixtures.findIndex((f) => f === fixture);
      const wasRemoved = index >= 0;
      if (wasRemoved) {
        this.fixtures.splice(index, 1);
      }
      if (wasRemoved) {
        this.fixtureModificationHandler?.onFixtureRemoved(fixture as T);
      }
      return wasRemoved;
    }
    if (typeof fixture === "number") {
      const removed = this.fixtures[fixture];
      this.fixtures.splice(fixture, 1);
      if (fixture != null) {
        this.fixtureModificationHandler?.onFixtureRemoved(removed);
      }
    }
    if (fixture instanceof Vector2) {
      const len = this.fixtures.length;
      for (let i = 0; i < len; i++) {
        const f = this.fixtures[i];
        const convex = f.getShape();
        if (convex.contains(fixture, this.transform)) {
          this.fixtures.splice(i, 1);
          i--;
          this.fixtureModificationHandler?.onFixtureRemoved(f);
          return f;
        }
      }
      return null;
    }
  }

  public removeFixtures(point: Vector2): T[] {
    const fixtures = [];
    const len = this.fixtures.length;
    for (let i = 0; i < len; i++) {
      const f = this.fixtures[i];
      const convex = f.getShape();
      if (convex.contains(point, this.transform)) {
        this.fixtures.splice(i, 1);
        i--;
        this.fixtureModificationHandler?.onFixtureRemoved(f);
        fixtures.push(f);
      }
    }
    return fixtures;
  }

  public removeAllFixtures(): T[] {
    const fixtures = [...this.fixtures];
    this.fixtureModificationHandler?.onAllFixturesRemoved();
    this.fixtures.splice(0);
    return fixtures;
  }

  public containsFixture(fixture: T): boolean {
    return this.fixtures.includes(fixture);
  }

  public contains(point: Vector2): boolean {
    const len = this.fixtures.length;
    for (let i = 0; i < len; i++) {
      const f = this.fixtures[i];
      const convex = f.getShape();
      if (convex.contains(point, this.transform)) {
        return true;
      }
    }
    return false;
  }

  public abstract getLocalCenter(): Vector2;

  public getWorldCenter(): Vector2 {
    return this.transform.getTransformed(this.getLocalCenter());
  }

  public getLocalPoint(worldPoint: Vector2): Vector2 {
    return this.transform.getInverseTransformed(worldPoint);
  }

  public getWorldPoint(localPoint: Vector2): Vector2 {
    return this.transform.getTransformed(localPoint);
  }

  public getLocalVector(worldVector: Vector2): Vector2 {
    return this.transform.getInverseTransformedR(worldVector);
  }

  public getWorldVector(localVector: Vector2): Vector2 {
    return this.transform.getTransformedR(localVector);
  }

  public getRotationDiscRadius(): number {
    return this.radius;
  }

  public getTransform(): Transform {
    return this.transform;
  }

  public getPreviousTransform(): Transform {
    return this.transform0;
  }

  public setTransform(transform: Transform): void {
    if (transform == null) return;
    this.transform.set(transform);
  }

  public rotateAboutCenter(theta: number): void {
    const center = this.getWorldCenter();
    this.rotate(theta, center);
  }

  public translateToOrigin(): void {
    const wc = this.getWorldCenter();
    this.transform.translate(-wc.x, -wc.y);
  }

  public createAABB(): AABB;
  public createAABB(transform: Transform): AABB;
  public createAABB(transform?: Transform): AABB {
    const aabb = new AABB(0, 0, 0, 0);
    this.computeAABB(aabb, transform ?? this.transform);
    return aabb;
  }

  public computeAABB(result: AABB): void;
  public computeAABB(result: AABB, transform: Transform): void;
  public computeAABB(result: AABB, transform?: Transform): void {
    if (transform === void 0) {
      this.computeAABB(result, this.transform);
    } else {
      const len = this.fixtures.length;
      if (len > 0) {
        this.fixtures[0].getShape().computeAABB(result, transform);
        const temp = new AABB(0, 0, 0, 0);
        for (let i = 1; i < len; i++) {
          this.fixtures[i].getShape().computeAABB(temp, transform);
          result.union(temp);
        }
      } else {
        result.zero();
      }
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getFixtureModificationHandler(): FixtureModificationHandler<T> {
    return this.fixtureModificationHandler;
  }

  public setFixtureModificationHandler(handler: FixtureModificationHandler<T>): void {
    this.fixtureModificationHandler = handler;
  }

  public rotate(theta: number): void;
  public rotate(rotation: Rotation): void;
  public rotate(theta: number, vector: Vector2): void;
  public rotate(rotation: Rotation, vector: Vector2): void;
  public rotate(theta: number, x: number, y: number): void;
  public rotate(rotation: Rotation, x: number, y: number): void;
  public rotate(rotation: unknown, x?: unknown, y?: unknown): void {
    this.transform.rotate(rotation as any, x as any, y as any);
  }

  public translate(vector: Vector2): void;
  public translate(x: number, y: number): void;
  public translate(x: unknown, y?: unknown): void {
    this.transform.translate(x as any, y as any);
  }

  public shift(shift: Vector2): void {
    this.transform.translate(shift);
  }

  public setUserData(data: any): void {
    this.userData = data;
  }

  public getUserData() {
    return this.userData;
  }

  public getOwner(): object {
    return this.owner;
  }

  public setOwner(owner: object): void {
    this.owner = owner;
  }

  /**
   * Computes the rotation disc for this {@link AbstractCollisionBody}.
   * @param center The center of rotation
   * @returns The rotation disc radius
   */
  protected setRotationDiscRadius(center: Vector2): void {
    let r = 0;
    const len = this.fixtures.length;
    if (len === 0) {
      this.radius = 0;
      return;
    }
    for (let i = 0; i < len; i++) {
      const fixture = this.fixtures[i];
      const convex = fixture.getShape();
      const cr = convex.getRadius(center);
      r = Math.max(r, cr);
    }
    this.radius = r;
  }

}

/**
 * Represents an iterator for {@link Fixture}s in a {@link CollisionBody}.
 */
class FixtureIterator<T extends Fixture> implements Iterator<T, any, undefined> {
  /**
   * The current index
   */
  index: number;
  /**
   * true if the current element has been removed
   */
  removed: boolean;
  /**
   * The {@link AbstractCollisionBody} to iterate over
   */
  collisionBody: AbstractCollisionBody<T>;

  /**
   * Minimal constructor.
   * @param collisionBody The {@link AbstractCollisionBody} to iterate over
   */
  constructor(collisionBody: AbstractCollisionBody<T>) {
    this.index = -1;
    this.removed = false;
    this.collisionBody = collisionBody;
  }

  hasNext(): boolean {
    return this.index + 1 < this.collisionBody.fixtures.length;
  }

  next(): IteratorResult<T, any> {
    if (this.index + 1 >= this.collisionBody.fixtures.length) {
      return {
        done: true,
        value: null
      }
    }
    this.index++;
    this.removed = false;
    const fixture = this.collisionBody.fixtures[this.index];
    return {
      done: false,
      value: fixture
    };
  }

  remove(): void {
    if (this.index < 0 || this.removed) {
      throw new Error("FixtureIterator.remove: Cannot remove the current element");
    }
    if (this.index >= this.collisionBody.fixtures.length) {
      throw new Error("FixtureIterator.remove: Index out of bounds");
    }
    this.collisionBody.removeFixture(this.index);
    this.index--;
    this.removed = true;
  }

}