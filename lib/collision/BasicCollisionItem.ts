import { CollisionBody } from "./CollisionBody";
import { AbstractCollisionItem } from "./AbstractCollisionItem";
import { CollisionItem } from "./CollisionItem";
import { Fixture } from "./Fixture";

/**
 * Represents a basic, immutable implementation of the {@link CollisionItem} interface.
 */
export class BasicCollisionItem<T extends CollisionBody<E>, E extends Fixture> extends AbstractCollisionItem<T, E> implements CollisionItem<T, E> {
  body: T;
  fixture: E;
  /**
   * Full constructor.
   * @param body The body
   * @param fixture The fixture
   */
  constructor(body: T, fixture: E) {
    super();
    this.body = body;
    this.fixture = fixture;
  }

  public getBody(): T {
    return this.body;
  }

  public getFixture(): E {
    return this.fixture;
  }

  public copy(): CollisionItem<T, E> {
    return new BasicCollisionItem<T, E>(this.body, this.fixture);
  }

  public equals(obj: any): boolean {
		return AbstractCollisionItem.equals(this, obj);
	}

}