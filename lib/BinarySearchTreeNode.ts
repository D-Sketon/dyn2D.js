import { Comparable } from "./Comparable";

/**
 * Node class for the {@link BinarySearchTree}.
 */
export class BinarySearchTreeNode<E extends Comparable<E>> {
  /**
   * The comparable object.
   */
  comparable: E;
  /**
   * The parent node.
   */
  parent: BinarySearchTreeNode<E> | null;
  /**
   * The left child node.
   */
  left: BinarySearchTreeNode<E> | null;
  /**
   * The right child node.
   */
  right: BinarySearchTreeNode<E> | null;

  /**
   * Full constructor.
   * @param comparable The comparable object.
   * @param parent The parent node.
   * @param left The left child node.
   * @param right The right child node.
   * @throws TypeError if comparable is null.
   */
  constructor(comparable: E, parent: BinarySearchTreeNode<E> = null, left: BinarySearchTreeNode<E> = null, right: BinarySearchTreeNode<E> = null) {
    if (comparable == null)
      throw new TypeError("BinarySearchTreeNode: comparable");
    this.comparable = comparable;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }

  /**
   * Returns the comparable object.
   * @returns The comparable object.
   */
  public getComparable(): E {
    return this.comparable;
  }

  public compareTo(o: BinarySearchTreeNode<E>): number {
    if (this.comparable.compareTo)
      return this.comparable.compareTo(o.comparable);
    return this.comparable < o.comparable ? -1 : this.comparable > o.comparable ? 1 : 0;
  }

  /**
   * Returns true if this node is the left child of its parent node.
   * 
   * Returns false if this node does not have a parent.
   * @returns true if this node is the left child of its parent node,
   * false if this node does not have a parent.
   */
  public isLeftChild(): boolean {
    return this.parent != null && this.parent.left === this;
  }

  public toString(): string {
    return `BinarySearchTreeNode[Comparable=${this.comparable.toString()}, Parent=${this.parent != null ? this.parent.comparable.toString() : "null"}, Left=${this.left != null ? this.left.comparable.toString() : "null"}, Right=${this.right != null ? this.right.comparable.toString() : "null"}]`;
  }

}