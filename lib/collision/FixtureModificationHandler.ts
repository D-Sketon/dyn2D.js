import { Fixture } from "./Fixture";

/**
 * Represents a hook into a {@link CollisionBody} to be notified of {@link Fixture} modification events.
 */
export interface FixtureModificationHandler<T extends Fixture> {
  /**
   * Called when a {@link Fixture} has been added to a {@link CollisionBody}.
   * @param fixture The fixture that was added
   */
  onFixtureAdded(fixture: T): void;

  /**
   * Called when a {@link Fixture} has been removed from a {@link CollisionBody}.
   * @param fixture The fixture that was removed
   */
  onFixtureRemoved(fixture: T): void;

  /**
   * Called when all {@link Fixture}s have been removed from a {@link CollisionBody}.
   */
  onAllFixturesRemoved(): void;

}