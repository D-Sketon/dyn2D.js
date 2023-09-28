export interface Copyable<T extends Copyable< T>> {
  copy(): T;
}