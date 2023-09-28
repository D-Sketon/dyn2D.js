import { BinarySearchTreeNode } from "./BinarySearchTreeNode";
import { Comparable, compareTo } from "./Comparable";

export class BinarySearchTreeIterator<E extends Comparable<E>> {
  stack: BinarySearchTreeNode<E>[];
  root: BinarySearchTreeNode<E> | null;
  from: E | null;
  to: E | null;
  inOrder: boolean;

  constructor(root: BinarySearchTreeNode<E> | null);
  constructor(root: BinarySearchTreeNode<E> | null, inOrder: boolean);
  constructor(root: BinarySearchTreeNode<E> | null, from: E | null, to: E | null);
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

  protected pushLeft(node: BinarySearchTreeNode<E> | null): void {
    while (node != null) {
      if (this.to == null || compareTo(this.to, node.comparable) >= 0) {
        this.stack.push(node);
      }
      node = node.left;
    }
  }

  protected pushRight(node: BinarySearchTreeNode<E> | null): void {
    while (node != null) {
      this.stack.push(node);
      node = node.right;
    }
  }

  public hasNext(): boolean {
    return this.stack.length > 0;
  }

  public next(): E {
    if (this.stack.length === 0)
      throw new Error("No such element");
    const node = this.stack.pop() as BinarySearchTreeNode<E>;
    if (this.inOrder) {
      this.pushLeft(node.right);
    } else {
      this.pushRight(node.left);
    }
    return node.comparable;
  }

  public remove(): void {
    throw new Error("Unsupported operation");
  }
}