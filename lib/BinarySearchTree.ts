import { BinarySearchTreeIterator } from "./BinarySearchTreeIterator";
import { BinarySearchTreeNode } from "./BinarySearchTreeNode";
import { BinarySearchTreeSearchCriteria } from "./BinarySearchTreeSearchCriteria";
import { Comparable, compareTo, equals } from "./Comparable";

/**
 * Represents an (optionally balanced) Binary Search Tree.
 * 
 * Use the {@link BinarySearchTree.isSelfBalancing} and {@link BinarySearchTree.setSelfBalancing} methods to enable
 * or disable self balancing. A balanced tree minimizes the tree depth and improves search 
 * performance. When self balancing is enabled, each insert or removal rebalances the tree
 * as necessary.
 * 
 * This class can be used in conjunction with the {@link BinarySearchTreeSearchCriteria} interface 
 * to perform arbitrary searches on the tree.
 */
export class BinarySearchTree<E extends Comparable<E>> {
  /**
   * The root node.
   */
  root: BinarySearchTreeNode<E> | null;
  /**
   * The number of nodes in the tree.
   */
  size: number;
  /**
   * true if the tree is self balancing, false otherwise.
   */
  selfBalancing: boolean;

  /**
   * Default constructor.
   */
  constructor();
  /**
   * Minimal constructor.
   * @param selfBalancing true if the tree is self balancing, false otherwise.
   */
  constructor(selfBalancing: boolean);
  /**
   * Copy constructor.
   * @param tree The tree to copy.
   */
  constructor(tree: BinarySearchTree<E>);
  /**
   * Copy constructor.
   * @param tree The tree to copy.
   * @param selfBalancing true if the tree is self balancing, false otherwise.
   */
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

  /**
   * Returns true if the tree is self balancing, false otherwise.
   * @returns true if the tree is self balancing, false otherwise.
   */
  public isSelfBalancing(): boolean {
    return this.selfBalancing;
  }

  /**
   * Sets whether or not the tree is self balancing.
   * @param flag true if the tree is self balancing, false otherwise.
   */
  public setSelfBalancing(flag: boolean): void {
    if (flag && !this.selfBalancing) {
      if (this.size > 2) {
        this.balanceTree();
      }
    }
    this.selfBalancing = flag;
  }

  /**
   * Performs a binary search on this tree given the criteria.
   * @param criteria The criteria to search with.
   * @returns The criteria for chaining
   */
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

  /**
   * Method to insert a comparable into the tree.
   * @param comparable The comparable to insert.
   * @returns true if the comparable was inserted, false otherwise.
   */
  public insert(comparable: E): boolean;
  /**
   * Method to insert a node into the tree.
   * @param item The node to insert.
   * @returns true if the node was inserted, false otherwise.
   */
  public insert(item: BinarySearchTreeNode<E>): boolean;
  /**
   * 
   * Method to insert a node into the subtree of the given node.
   * @param item The node to insert.
   * @param root The subtree node to start from.
   * @returns true if the node was inserted, false otherwise.
   */
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

  /**
   * Removes a comparable from the tree.
   * @param comparable The comparable to remove.
   * @returns true if the comparable was removed, false otherwise.
   */
  public remove(comparable: E): boolean;
  /**
   * Removes a comparable the subtree of the given node.
   * @param node The subtree node to start from.
   * @param comparable The comparable to remove.
   * @returns The {@link BinarySearchTreeNode} that was removed, or null if the comparable was not found.
   */
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

  /**
   * Removes the minimum comparable from the tree.
   * @returns The minimum comparable, or null if the tree is empty.
   */
  public removeMinimum(): E | null;
  /**
   * Removes the minimum comparable the subtree of the given node.
   * @param node The subtree node to start from.
   * @returns The {@link BinarySearchTreeNode} that was removed, or null if the tree is empty.
   */
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

  /**
   * Removes the maximum comparable from the tree.
   * @returns The maximum comparable, or null if the tree is empty.
   */
  public removeMaximum(): E | null;
  /**
   * Removes the maximum comparable the subtree of the given node.
   * @param node The subtree node to start from.
   * @returns The {@link BinarySearchTreeNode} that was removed, or null if the tree is empty.
   */
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

  /**
   * Returns the minimum comparable from the tree.
   * @returns The minimum comparable, or null if the tree is empty.
   */
  public getMinimum(): E | null;
  /**
   * Returns the minimum comparable the subtree of the given node.
   * @param node The subtree node to start from.
   * @returns The {@link BinarySearchTreeNode} that was removed, or null if the tree is empty.
   */
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

  /**
   * Returns the maximum comparable from the tree.
   * @returns The maximum comparable, or null if the tree is empty.
   */
  public getMaximum(): E | null;
  /**
   * Returns the maximum comparable the subtree of the given node.
   * @param node The subtree node to start from.
   * @returns The {@link BinarySearchTreeNode} that was removed, or null if the tree is empty.
   */
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

  /**
   * Method to check if the tree contains the specified comparable.
   * @param comparable The comparable to check for.
   * @returns true if the tree contains the comparable, false otherwise.
   */
  public contains(comparable: E | null): boolean;
  /**
   * Method to check if the subtree of the given node contains the specified comparable.
   * @param node The subtree node to start from.
   * @param comparable The comparable to check for.
   * @returns The {@link BinarySearchTreeNode} that contains the comparable, or null if the comparable was not found.
   */
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

  /**
   * Returns the root comparable.
   * @returns Returns the root comparable, or null if the tree is empty.
   */
  public getRoot(): E | null {
    if (this.root == null) return null;
    return this.root.comparable;
  }

  /**
   * Clears the tree.
   */
  public clear(): void {
    this.root = null;
    this.size = 0;
  }

  /**
   * Checks if the tree is empty.
   * @returns true if the tree is empty, false otherwise.
   */
  public isEmpty(): boolean {
    return this.root === null;
  }

  /**
   * Returns the height of the tree.
   * @returns The height of the tree.
   */
  public getHeight(): number;
  /**
   * Returns the height of the subtree of the given node.
   * @param node The subtree node to start from.
   * @returns The height of the subtree of the given node.
   */
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

  /**
   * Returns the size of the tree.
   * @returns The size of the tree.
   */
  public getSize(): number;
  /**
   * Returns the size of the subtree of the given node.
   * @param node The subtree node to start from.
   * @returns The size of the subtree of the given node.
   */
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

  /**
   * Returns the node containing the specified comparable.
   * @param comparable The comparable to search for.
   * @returns The {@link BinarySearchTreeNode} containing the comparable, or null if the comparable was not found.
   */
  public get(comparable: E): BinarySearchTreeNode<E> | null {
    if (comparable == null) return null;
    if (this.root == null) return null;
    return this.contains(this.root, comparable);
  }

  /**
   * Method to insert a subtree into this tree.
   * @param tree The tree to insert.
   * @returns true if the tree was inserted, false otherwise.
   */
  public insertSubtree(tree: BinarySearchTree<E>): boolean {
    if (tree == null) return false;
    if (tree.root == null) return true;
    for(let it of tree) {
      const newNode = new BinarySearchTreeNode<E>(it);
      this.insert(newNode);
    }
    return true;
  }

  /**
   * Method to remove the node containing the given comparable and the corresponding subtree from this tree.
   * @param comparable The comparable to remove.
   * @returns true if the comparable was found and its subtree was removed, false otherwise.
   */
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

  /**
   * Method to remove the given node and its subtree from this tree.
   * @param node The node to remove.
   */
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

  /**
   * Returns an iterator over the tree.
   * @returns An iterator over the tree.
   */
  public iterator(): BinarySearchTreeIterator<E> {
    return this.inOrderIterator();
  }

  /**
   * Returns an iterator over the tree starting from the specified comparable.
   * @param from The lower bound of the range to iterate over.
   * @returns An iterator over the tree.
   */
  public tailIterator(from: E): BinarySearchTreeIterator<E> {
    return new BinarySearchTreeIterator<E>(this.root, from, null);
  }

  /**
   * Returns an iterator over the tree ending at the specified comparable.
   * @param to The upper bound of the range to iterate over.
   * @returns An iterator over the tree.
   */
  public headIterator(to: E): BinarySearchTreeIterator<E> {
    return new BinarySearchTreeIterator<E>(this.root, null, to);
  }

  /**
   * Returns an iterator over the tree within the specified range.
   * @param from The lower bound of the range to iterate over.
   * @param to The upper bound of the range to iterate over.
   * @returns An iterator over the tree.
   */
  public subsetIterator(from: E, to: E): BinarySearchTreeIterator<E> {
    return new BinarySearchTreeIterator<E>(this.root, from, to);
  }

  /**
   * Returns an iterator over the tree in order.
   * @returns An iterator over the tree in order.
   */
  public inOrderIterator(): BinarySearchTreeIterator<E> {
    return new BinarySearchTreeIterator<E>(this.root, true);
  }

  /**
   * Returns an iterator over the tree in reverse order.
   * @returns An iterator over the tree in reverse order.
   */
  public reverseOrderIterator(): BinarySearchTreeIterator<E> {
    return new BinarySearchTreeIterator<E>(this.root, false);
  }

  [Symbol.iterator](): Iterator<E> {
    return this.inOrderIterator();
  }

  /**
   * Re-balances the entire tree.
   */
  public balanceTree(): void;
  /**
   * Re-balances the subtree of the given node.
   * @param node The subtree node to start from.
   */
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

  /**
   * Balances the given node's subtree.
   * @param node The subtree node to start from.
   * @returns The new root of the subtree.
   */
  private balance(node: BinarySearchTreeNode<E> | null): BinarySearchTreeNode<E> | null {
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
