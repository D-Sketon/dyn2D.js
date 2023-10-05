/**
 * Represents an object that can be owned by a single owner.
 */
export interface Ownable {
  /**
   * Returns the owner of this object.
   * @returns The owner of this object.
   */
  getOwner(): object;
  /**
   * Sets the owner of this object.
   * @param owner The owner of this object.
   */
  setOwner(owner: object): void;
}