import { devNull } from "os";
import { BinarySearchTreeIterator } from "./BinarySearchTreeIterator";
import { BinarySearchTreeNode } from "./BinarySearchTreeNode";
import { BinarySearchTreeSearchCriteria } from "./BinarySearchTreeSearchCriteria";
import { Comparable, compareTo, equals } from "./Comparable";

export class BinarySearchTree<E extends Comparable<E>> {
  root: BinarySearchTreeNode<E> | null;
  size: number;
  selfBalancing: boolean;

  constructor();
  constructor(selfBalancing: boolean);
  constructor(tree: BinarySearchTree<E>);
  constructor(tree: BinarySearchTree<E>, selfBalancing: boolean);
  constructor(treeOrSelfBalancing?: BinarySearchTree<E> | boolean, selfBalancing?: boolean) {
    this.root = null;
    this.size = 0;
    if (treeOrSelfBalancing instanceof BinarySearchTree) {
      this.selfBalancing = selfBalancing == null ? treeOrSelfBalancing.selfBalancing : selfBalancing;
      this.insertSubtree(treeOrSelfBalancing);
    } else {
      this.selfBalancing = treeOrSelfBalancing == null ? false : treeOrSelfBalancing;
    }
  }

  public isSelfBalancing(): boolean {
    return this.selfBalancing;
  }

  public setSelfBalancing(flag: boolean): void {
    if (flag && !this.selfBalancing) {
      if (this.size > 2) {
        this.balanceTree();
      }
    }
    this.selfBalancing = flag;
  }

  public search<T extends BinarySearchTreeSearchCriteria<E>>(criteria: T): T {
    if (this.root == null) return criteria;
    let node = this.root as BinarySearchTreeNode<E> | null;
    while (node != null) {
      const result = criteria.evaluate(node.comparable);
      if (result < 0) {
        node = node.left;
      } else if (result > 0) {
        node = node.right;
      } else {
        break;
      }
    }
    return criteria;
  }

  public insert(comparable: E): boolean;
  public insert(item: BinarySearchTreeNode<E>): boolean;
  public insert(item: BinarySearchTreeNode<E>, root: BinarySearchTreeNode<E>): boolean;
  public insert(...args: any[]): boolean {
    if (args.length === 1) {
      const comparableOrNode = args[0] as E | BinarySearchTreeNode<E>;
      if (comparableOrNode instanceof BinarySearchTreeNode) {
        if (this.root == null) {
          this.root = comparableOrNode;
          this.size++;
          return true;
        } else {
          return this.insert(comparableOrNode, this.root);
        }
      }
      if (comparableOrNode == null) return false;
      const node = new BinarySearchTreeNode<E>(comparableOrNode);
      return this.insert(node);
    } else {
      const item = args[0] as BinarySearchTreeNode<E>;
      const root = args[1] as BinarySearchTreeNode<E>;
      let node = root;
      while (node != null) {
        if (compareTo(item, node) < 0) {
          if (node.left == null) {
            node.left = item;
            item.parent = node;
            break;
          } else {
            node = node.left;
          }
        } else {
          if (node.right == null) {
            node.right = item;
            item.parent = node;
            break;
          } else {
            node = node.right;
          }
        }
      }
      this.size++;
      if (this.selfBalancing) this.balanceTree(node);
      return true;
    }
  }

  public remove(comparable: E): boolean;
  public remove(node: BinarySearchTreeNode<E>, comparable: E): BinarySearchTreeNode<E> | null;
  public remove(...args: any[]): boolean | BinarySearchTreeNode<E> | null {
    if (args.length === 1) {
      const comparable = args[0] as E;
      if (comparable == null) return false;
      if (this.root == null) return false;
      return this.remove(this.root, comparable) != null;
    } else {
      let node = args[0] as BinarySearchTreeNode<E> | null;
      const comparable = args[1] as E;
      while (node != null) {
        const diff = compareTo(comparable, node.comparable);
        if (diff < 0) {
          node = node.left;
        } else if (diff > 0) {
          node = node.right;
        } else {
          if (equals(node.comparable, comparable)) {
            this.removeNode(node);
            return node;
          } else {
            return null;
          }
        }
      }
      return null;
    }
  }

  public removeMinimum(): E | null;
  public removeMinimum(node: BinarySearchTreeNode<E>): BinarySearchTreeNode<E>;
  public removeMinimum(...args: any[]): E | null | BinarySearchTreeNode<E> {
    if (args.length === 0) {
      if (this.root == null) return null;
      return this.removeMinimum(this.root).comparable;
    }
    let node = args[0] as BinarySearchTreeNode<E>;
    node = this.getMinimum(node);
    if (node == null) return null;
    if (node == this.root) {
      this.root = node.right;
    } else if (node.parent?.right == node) {
      node.parent.right = node.right;
    } else {
      node.parent!.left = node.right;
    }
    this.size--;
    return node;
  }

  public removeMaximum(): E | null;
  public removeMaximum(node: BinarySearchTreeNode<E>): BinarySearchTreeNode<E>;
  public removeMaximum(...args: any[]): E | null | BinarySearchTreeNode<E> {
    if (args.length === 0) {
      if (this.root == null) return null;
      return this.removeMaximum(this.root).comparable;
    }
    let node = args[0] as BinarySearchTreeNode<E>;
    node = this.getMaximum(node);
    if (node == null) return null;
    if (node == this.root) {
      this.root = node.left;
    } else if (node.parent?.right == node) {
      node.parent.right = node.left;
    } else {
      node.parent!.left = node.left;
    }
    this.size--;
    return node;
  }

  public getMinimum(): E | null;
  public getMinimum(node: BinarySearchTreeNode<E>): BinarySearchTreeNode<E>;
  public getMinimum(...args: any[]): E | null | BinarySearchTreeNode<E> {
    if (args.length === 0) {
      if (this.root == null) return null;
      return this.getMinimum(this.root).comparable;
    }
    let node = args[0] as BinarySearchTreeNode<E>;
    if (node == null) return null;
    while (node.left != null) {
      node = node.left;
    }
    return node;
  }

  public getMaximum(): E | null;
  public getMaximum(node: BinarySearchTreeNode<E>): BinarySearchTreeNode<E>;
  public getMaximum(...args: any[]): E | null | BinarySearchTreeNode<E> {
    if (args.length === 0) {
      if (this.root == null) return null;
      return this.getMaximum(this.root).comparable;
    }
    let node = args[0] as BinarySearchTreeNode<E>;
    if (node == null) return null;
    while (node.right != null) {
      node = node.right;
    }
    return node;
  }

  public contains(comparable: E | null): boolean;
  public contains(node: BinarySearchTreeNode<E>, comparable: E): BinarySearchTreeNode<E> | null;
  public contains(...args: any[]): boolean | BinarySearchTreeNode<E> | null {
    if (args.length === 1) {
      const comparable = args[0] as E | null;
      if (comparable == null) return false;
      if (this.root == null) return false;
      return this.contains(this.root, comparable) != null;
    }
    let node = args[0] as BinarySearchTreeNode<E> | null;
    const comparable = args[1] as E;
    while (node != null) {
      const nodeData = node.comparable;
      // 默认小于
      const diff = compareTo(comparable, nodeData);
      if (diff == 0) {
        if (equals(nodeData, comparable)) {
          return node;
        }
        return null;
      } else if (diff < 0) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return null;
  }

  public getRoot(): E | null {
    if (this.root == null) return null;
    return this.root.comparable;
  }

  public clear(): void {
    this.root = null;
    this.size = 0;
  }

  public isEmpty(): boolean {
    return this.root === null;
  }

  public getHeight(): number;
  public getHeight(node: BinarySearchTreeNode<E> | null): number;
  public getHeight(...args: any[]): number {
    if (args.length === 0) {
      return this.getHeight(this.root);
    }
    const node = args[0] as BinarySearchTreeNode<E>;
    if (node == null) return 0;
    if (node.left == null && node.right == null) return 1;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  public getSize(): number;
  public getSize(node: BinarySearchTreeNode<E> | null): number;
  public getSize(...args: any[]): number {
    if (args.length === 0) {
      return this.size;
    }
    const node = args[0] as BinarySearchTreeNode<E>;
    if (node == null) return 0;
    if (node.left == null && node.right == null) return 1;
    return 1 + this.getSize(node.left) + this.getSize(node.right);
  }

  public get(comparable: E): BinarySearchTreeNode<E> | null {
    if (comparable == null) return null;
    if (this.root == null) return null;
    return this.contains(this.root, comparable);
  }

  public insertSubtree(tree: BinarySearchTree<E>): boolean {
    if (tree == null) return false;
    if (tree.root == null) return true;
    for(let it of tree) {
      const newNode = new BinarySearchTreeNode<E>(it);
      this.insert(newNode);
    }
    return true;
  }

  public removeSubtree(comparable: E): boolean {
    if (comparable == null) return false;
    if (this.root == null) return false;
    let node = this.root as BinarySearchTreeNode<E> | null;
    while (node != null) {
      // 默认小于
      const diff = compareTo(comparable, node.comparable);
      if (diff < 0) {
        node = node.left;
      } else if (diff > 0) {
        node = node.right;
      } else {
        if (equals(node.comparable, comparable)) {
          if (node.isLeftChild()) {
            node.parent!.left = null;
          } else {
            node.parent!.right = null;
          }
          this.size -= this.getSize(node);
          if (this.selfBalancing) this.balanceTree(node.parent);
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  }

  private removeNode(node: BinarySearchTreeNode<E>): void {
    const isLeftChild = node.isLeftChild();
    if (node.left != null && node.right != null) {
      const min = this.getMinimum(node.right);
      if (min != node.right) {
        min.parent!.left = min.right;
        if (min.right != null) {
          min.right.parent = min.parent;
        }
        min.right = node.right;
      }

      if (node.right != null) node.right.parent = min;
      if (node.left != null) node.left.parent = min;

      if (node == this.root) {
        this.root = min;
      } else if (isLeftChild) {
        node.parent!.left = min;
      } else {
        node.parent!.right = min;
      }

      min.left = node.left;
      min.parent = node.parent;

      if (this.selfBalancing) this.balanceTree(min.parent);
    } else if (node.left != null) {
      if (node == this.root) {
        this.root = node.left;
      } else if (isLeftChild) {
        node.parent!.left = node.left;
      } else {
        node.parent!.right = node.left;
      }
      if (node.left != null) {
        node.left.parent = node.parent;
      }
    } else if (node.right != null) {
      if (node == this.root) {
        this.root = node.right;
      } else if (isLeftChild) {
        node.parent!.left = node.right;
      } else {
        node.parent!.right = node.right;
      }
      if (node.right != null) {
        node.right.parent = node.parent;
      }
    } else {
      if (node == this.root) {
        this.root = null;
      } else if (isLeftChild) {
        node.parent!.left = null;
      } else {
        node.parent!.right = null;
      }
    }
    this.size--;
  }

  public iterator(): BinarySearchTreeIterator<E> {
    return this.inOrderIterator();
  }

  public tailIterator(from: E): BinarySearchTreeIterator<E> {
    return new BinarySearchTreeIterator<E>(this.root, from, null);
  }

  public headIterator(to: E): BinarySearchTreeIterator<E> {
    return new BinarySearchTreeIterator<E>(this.root, null, to);
  }

  public subsetIterator(from: E, to: E): BinarySearchTreeIterator<E> {
    return new BinarySearchTreeIterator<E>(this.root, from, to);
  }

  public inOrderIterator(): BinarySearchTreeIterator<E> {
    return new BinarySearchTreeIterator<E>(this.root, true);
  }

  public reverseOrderIterator(): BinarySearchTreeIterator<E> {
    return new BinarySearchTreeIterator<E>(this.root, false);
  }

  [Symbol.iterator](): Iterator<E> {
    return this.inOrderIterator();
  }

  public balanceTree(): void;
  public balanceTree(node: BinarySearchTreeNode<E> | null): void;
  public balanceTree(...args: any[]): void {
    if (args.length === 0) {
      const root = this.root;
      const balancing = this.selfBalancing;
      this.root = null;
      this.size = 0;
      this.selfBalancing = true;
      const iterator = new BinarySearchTreeIterator<E>(root);
      while (iterator.hasNext()) {
        const node = new BinarySearchTreeNode<E>(iterator.next().value);
        this.insert(node);
      }
      this.selfBalancing = balancing;
    } else {
      let node = args[0] as BinarySearchTreeNode<E> | null;
      while (node != null) {
        node = this.balance(node);
        if (node == null) break;
        node = node.parent;
      }
    }
  }

  balance(node: BinarySearchTreeNode<E> | null): BinarySearchTreeNode<E> | null {
    if (node == null) return null;
    if (this.getHeight(node) < 2) return node;
    const p = node.parent;
    const a = node.left;
    const b = node.right;
    const ah = this.getHeight(a);
    const bh = this.getHeight(b);
    const balance = ah - bh;
    if (balance > 1) {

      //	    node  or    node
      //     /           /
      //    a           a
      //   /             \
      //  c               c

      const ach = this.getHeight(a!.right);
      if (ach > 1) {
        const c = a!.right;
        a!.right = c!.left;
        if (c!.left != null) c!.left.parent = a;
        c!.left = a;
        a!.parent = c;
        node.left = c;
        c!.parent = node;
      }

      //		node
      //     /
      //    c
      //   /
      //  a

      const c = node.left;
      node.left = c!.right;
      if (c!.right != null) c!.right.parent = node;
      c!.right = node;
      c!.parent = node.parent;
      node.parent = c;

      if (p != null) {
        if (p.left == node) {
          p.left = c;
        } else {
          p.right = c;
        }
      } else {
        this.root = c;
      }

      //   c
      //  / \
      // a   node

      return c;
    }
    if (balance < -1) {

      // node   or    node
      //     \            \
      //      b            b
      //       \          /
      //        d        d

      // then the right subtree need to rotate
      const bch = this.getHeight(b!.left);

      if (bch > 1) {
        const d = b!.left;
        b!.left = d!.right;
        if (d!.right != null) d!.right.parent = b;
        d!.right = b;
        b!.parent = d;
        node.right = d;
        d!.parent = node;
      }

      // node
      //     \
      //      d
      //       \
      //        b

      const d = node.right;
      node.right = d!.left;
      if (d!.left != null) d!.left.parent = node;
      d!.left = node;
      d!.parent = node.parent;
      node.parent = d;

      if (p != null) {
        if (p.left == node) {
          p.left = d;
        } else {
          p.right = d;
        }
      } else {
        this.root = d;
      }

      //      d
      //     / \
      // node   b

      return d;
    }
    return node;
  }

  public toString(): string {
    let res = '';
    const iterator = this.inOrderIterator();
    res += 'BinarySearchTree[';
    while (iterator.hasNext()) {
      res += iterator.next();
      if (iterator.hasNext()) {
        res += ', ';
      }
    }
    res += ']';
    return res;
  }
}
