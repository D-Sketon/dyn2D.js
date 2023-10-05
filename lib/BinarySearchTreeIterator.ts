import { BinarySearchTreeNode } from "./BinarySearchTreeNode";
import { Comparable, compareTo } from "./Comparable";

/**
 * An iterator class for looping through the elements of a {@link BinarySearchTree} 
 * in order or in reverse order.
 */
export class BinarySearchTreeIterator<E extends Comparable<E>> implements Iterator<E>{
  /**
   * The stack of nodes.
   */
  stack: BinarySearchTreeNode<E>[];
  /**
   * The root node.
   */
  root: BinarySearchTreeNode<E> | null;
  /**
   * The lower bound of the range to iterate over.
   */
  from: E | null;
  /**
   * The upper bound of the range to iterate over.
   */
  to: E | null;
  /**
   * True if the iterator is iterating in order, false if iterating in reverse order.
   */
  inOrder: boolean;

  /**
   * Minimal constructor.
   * @param root The root node.
   */
  constructor(root: BinarySearchTreeNode<E> | null);
  /**
   * Minimal constructor.
   * @param root The root node.
   * @param inOrder True if the iterator is iterating in order, false if iterating in reverse order.
   */
  constructor(root: BinarySearchTreeNode<E> | null, inOrder: boolean);
  /**
   * Minimal constructor.
   * @param root The root node.
   * @param from The lower bound of the range to iterate over.
   * @param to The upper bound of the range to iterate over.
   */
  constructor(root: BinarySearchTreeNode<E> | null, from: E | null, to: E | null);
  /**
   * Full constructor.
   * @param root The root node.
   * @param from The lower bound of the range to iterate over.
   * @param to The upper bound of the range to iterate over.
   * @param inOrder True if the iterator is iterating in order, false if iterating in reverse order.
   */
  constructor(root: BinarySearchTreeNode<E> | null, from: E | null, to: E | null, inOrder: boolean);
  constructor(root: BinarySearchTreeNode<E> | null, ...args: any[]) {
    this.stack = [];
    this.root = root;
    let inOrder = true;
    let from: E | null = null;
    let to: E | null = null;
    if (args.length === 1) {
      inOrder = args[0];
    } else if (args.length === 2) {
      from = args[0];
      to = args[1];
    } else {
      from = args[0];
      to = args[1];
      inOrder = args[2];
    }
    this.from = from;
    this.to = to;
    this.inOrder = inOrder;
    if (inOrder) {
      if (this.from != null) {
        this.pushLeftFrom(this.from);
      } else {
        this.pushLeft(root);
      }
    } else {
      this.pushRight(root);
    }
  }

  /**
   * Pushes the left nodes onto the stack starting from the specified node.
   * @param from The lower bound of the range to iterate over.
   */
  protected pushLeftFrom(from: E): void {
    let node = this.root as BinarySearchTreeNode<E> | null;
    while (node != null) {
      const cmp = compareTo(from, node.comparable);
      if (cmp < 0) {
        this.stack.push(node);
        node = node.left;
      } else if (cmp > 0) {
        node = node.right;
      } else {
        this.stack.push(node);
        break;
      }
    }
  }

  /**
   * Pushes the left nodes onto the stack starting from the specified node.
   * @param node The node to start from.
   */
  protected pushLeft(node: BinarySearchTreeNode<E> | null): void {
    while (node != null) {
      if (this.to == null || compareTo(this.to, node.comparable) >= 0) {
        this.stack.push(node);
      }
      node = node.left;
    }
  }

  /**
   * Pushes the right nodes onto the stack starting from the specified node.
   * @param node The node to start from.
   */
  protected pushRight(node: BinarySearchTreeNode<E> | null): void {
    while (node != null) {
      this.stack.push(node);
      node = node.right;
    }
  }

  public hasNext(): boolean {
    return this.stack.length > 0;
  }

  public next(): IteratorResult<E, any> {
    if (this.stack.length === 0) {
      return {
        done: true,
        value: null
      };
    }
    const node = this.stack.pop() as BinarySearchTreeNode<E>;
    if (this.inOrder) {
      this.pushLeft(node.right);
    } else {
      this.pushRight(node.left);
    }
    return {
      done: false,
      value: node.comparable
    };
  }
}