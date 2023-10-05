/**
 * Represents an object that can store an arbitrary user data object.
 */
export interface DataContainer {
  /**
   * Sets the user data object stored in this object.
   * @param data The user data object to store in this object.
   */
  setUserData(data: any): void;
  /**
   * Returns the user data object stored in this object.
   * @returns The user data object stored in this object.
   */
  getUserData(): any;
}