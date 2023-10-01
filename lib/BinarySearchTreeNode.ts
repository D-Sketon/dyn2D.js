import { Comparable } from "./Comparable";

export class BinarySearchTreeNode<E extends Comparable<E>> {
  comparable: E;
  parent: BinarySearchTreeNode<E> | null;
  left: BinarySearchTreeNode<E> | null;
  right: BinarySearchTreeNode<E> | null;

  constructor(comparable: E, parent: BinarySearchTreeNode<E> | null = null, left: BinarySearchTreeNode<E> | null = null, right: BinarySearchTreeNode<E> | null = null) {
    if (comparable == null)
      throw new TypeError("BinarySearchTreeNode: comparable");
    this.comparable = comparable;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }

  public getComparable(): E {
    return this.comparable;
  }

  public compareTo(o: BinarySearchTreeNode<E>): number {
    if (this.comparable.compareTo)
      return this.comparable.compareTo(o.comparable);
    return this.comparable < o.comparable ? -1 : this.comparable > o.comparable ? 1 : 0;
  }

  public isLeftChild(): boolean {
    return this.parent != null && this.parent.left === this;
  }

}