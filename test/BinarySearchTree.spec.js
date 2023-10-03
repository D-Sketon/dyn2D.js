'use strict';

require('chai').should();
const expect = require('chai').expect;

describe('BinarySearchTree', () => {
  const BinarySearchTreeNode = require('../dist/BinarySearchTreeNode').BinarySearchTreeNode;
  const BinarySearchTree = require('../dist/BinarySearchTree').BinarySearchTree;
  let tree = new BinarySearchTree();
  beforeEach(() => {
    tree.clear();
    tree.insert(10);
    tree.insert(3);
    tree.insert(-3);
    tree.insert(4);
    tree.insert(0);
    tree.insert(1);
    tree.insert(11);
    tree.insert(19);
    tree.insert(6);
    tree.insert(-1);
    tree.insert(2);
    tree.insert(9);
    tree.insert(-4);
  });

  it('create', () => {
    let newTree = new BinarySearchTree(tree);
    newTree.getSize().should.equal(tree.getSize());
    newTree.contains(10).should.equal(true);
    newTree.contains(3).should.equal(true);
    newTree.contains(-3).should.equal(true);
    newTree.contains(4).should.equal(true);
    newTree.contains(0).should.equal(true);
    newTree.contains(1).should.equal(true);
    newTree.contains(11).should.equal(true);
    newTree.contains(19).should.equal(true);
    newTree.contains(6).should.equal(true);
    newTree.contains(-1).should.equal(true);
    newTree.contains(2).should.equal(true);
    newTree.contains(9).should.equal(true);
    newTree.contains(-4).should.equal(true);

    newTree = new BinarySearchTree(tree, true);
    newTree.getSize().should.equal(tree.getSize());
    newTree.contains(10).should.equal(true);
    newTree.contains(3).should.equal(true);
    newTree.contains(-3).should.equal(true);
    newTree.contains(4).should.equal(true);
    newTree.contains(0).should.equal(true);
    newTree.contains(1).should.equal(true);
    newTree.contains(11).should.equal(true);
    newTree.contains(19).should.equal(true);
    newTree.contains(6).should.equal(true);
    newTree.contains(-1).should.equal(true);
    newTree.contains(2).should.equal(true);
    newTree.contains(9).should.equal(true);
    newTree.contains(-4).should.equal(true);
    const h = newTree.getHeight() <= tree.getHeight();
    h.should.equal(true);
  });

  it('insert', () => {
    tree.contains(5).should.equal(false);
    tree.insert(5).should.equal(true);
    tree.contains(5).should.equal(true);
    tree.getSize().should.equal(14);

    const newTree = new BinarySearchTree();
    newTree.insert(14);
    newTree.insert(8);
    newTree.insert(16);
    newTree.insert(15);

    tree.contains(14).should.equal(false);
    tree.contains(8).should.equal(false);
    tree.contains(16).should.equal(false);
    tree.contains(15).should.equal(false);

    tree.insertSubtree(newTree).should.equal(true);
    tree.contains(14).should.equal(true);
    tree.contains(8).should.equal(true);
    tree.contains(16).should.equal(true);
    tree.contains(15).should.equal(true);
    tree.contains(5).should.equal(true);
    tree.contains(10).should.equal(true);
    tree.getSize().should.equal(18);

    tree.clear();
    tree.insertSubtree(newTree).should.equal(true);
    tree.contains(14).should.equal(true);
    tree.contains(8).should.equal(true);
    tree.contains(16).should.equal(true);
    tree.contains(15).should.equal(true);
    tree.getSize().should.equal(4);

    tree.insertSubtree(null).should.equal(false);
    tree.contains(14).should.equal(true);
    tree.contains(8).should.equal(true);
    tree.contains(16).should.equal(true);
    tree.contains(15).should.equal(true);
    tree.getSize().should.equal(4);

    newTree.clear();
    tree.insertSubtree(newTree).should.equal(true);
    tree.contains(14).should.equal(true);
    tree.contains(8).should.equal(true);
    tree.contains(16).should.equal(true);
    tree.contains(15).should.equal(true);
    tree.getSize().should.equal(4);
  });

  it('remove', () => {
    tree.remove(-3).should.equal(true);
    tree.contains(-3).should.equal(false);
    tree.contains(-4).should.equal(true);
    tree.contains(0).should.equal(true);
    tree.contains(1).should.equal(true);
    tree.contains(2).should.equal(true);
    tree.contains(-1).should.equal(true);
    tree.contains(3).should.equal(true);

    tree.remove(null).should.equal(false);

    tree.clear();
    tree.remove(4).should.equal(false);

    const newTree = new BinarySearchTree();
    newTree.insert(new Number(0));
    newTree.insert(new Number(2));
    newTree.insert(new Number(10));
    newTree.insert(new Number(7));
    newTree.insert(new Number(1));
    newTree.remove(new Number(7)).should.equal(false);
  });

  it('removeMaximum', () => {
    tree.removeMaximum();
    tree.contains(19).should.equal(false);
    tree.getSize().should.equal(12);

    const node = tree.get(0);
    tree.removeMaximum(node);
    tree.contains(2).should.equal(false);
    tree.getSize().should.equal(11);

    expect(tree.removeMaximum(null)).to.be.null;

    tree.clear();
    tree.insert(0);
    tree.insert(-1);
    tree.removeMaximum(tree.root).comparable.should.equal(0);

    tree.clear();
    tree.insert(0);
    tree.insert(-1);
    tree.insert(1);
    tree.removeMaximum(tree.get(-1)).comparable.should.equal(-1);

    tree.clear();
    expect(tree.removeMaximum()).to.be.null;
  });

  it('removeMinimum', () => {
    tree.removeMinimum();
    tree.contains(-4).should.equal(false);
    tree.getSize().should.equal(12);

    const node = tree.get(11);
    tree.removeMinimum(node);
    tree.contains(11).should.equal(false);
    tree.getSize().should.equal(11);

    expect(tree.removeMinimum(null)).to.be.null;

    tree.clear();
    tree.insert(0);
    tree.insert(1);
    tree.removeMinimum(tree.root).comparable.should.equal(0);

    tree.clear();
    tree.insert(0);
    tree.insert(-1);
    tree.insert(1);
    tree.removeMinimum(tree.get(1)).comparable.should.equal(1);

    tree.clear();
    expect(tree.removeMinimum()).to.be.null;
  });

  it('removeSubTree', () => {
    tree.removeSubtree(-3);
    tree.contains(0).should.equal(false);
    tree.contains(-1).should.equal(false);
    tree.contains(1).should.equal(false);
    tree.contains(-4).should.equal(false);
    tree.contains(2).should.equal(false);
    tree.getSize().should.equal(7);

    tree.removeSubtree(8).should.equal(false);
    tree.removeSubtree(5).should.equal(false);

    tree.removeSubtree(4).should.equal(true);
    tree.contains(4).should.equal(false);
    tree.contains(6).should.equal(false);
    tree.contains(9).should.equal(false);
    tree.getSize().should.equal(4);

    tree.removeSubtree(null).should.equal(false);

    tree.clear();
    tree.getSize().should.equal(0);
    tree.removeSubtree(4).should.equal(false);

    const newTree = new BinarySearchTree();
    newTree.insert(new Number(0));
    newTree.insert(new Number(2));
    newTree.insert(new Number(10));
    newTree.insert(new Number(7));
    newTree.insert(new Number(1));

    newTree.removeSubtree(new Number(7)).should.equal(false);
  });

  it('nodeComparable', () => {
    const node = new BinarySearchTreeNode(-3);
    node.getComparable().should.equal(-3);
  });

  it('insertNull', () => {
    tree.insert(null).should.equal(false);
    tree.getSize().should.equal(13);
  });

  it('nodeNullComparable', () => {
    try {
      new BinarySearchTreeNode < Integer > (null);
    } catch (e) {
      e.message.should.equal('BinarySearchTreeNode: comparable');
    }
  });

  it('getDepth', () => {
    tree.getHeight().should.equal(6);
    const node = tree.get(-3);
    tree.getHeight(node).should.equal(4);
  });

  it('getMinimum', () => {
    tree.getMinimum().should.equal(-4);
    let node = tree.get(4);
    tree.getMinimum(node).comparable.should.equal(4);

    node = tree.get(0);
    tree.getMinimum(node).comparable.should.equal(-1);

    tree.clear();
    expect(tree.getMinimum()).to.be.null;
  });

  it('getMaximum', () => {
    tree.getMaximum().should.equal(19);
    let node = tree.get(-3);
    tree.getMaximum(node).comparable.should.equal(2);

    node = tree.get(11);
    tree.getMaximum(node).comparable.should.equal(19);

    tree.clear();
    expect(tree.getMaximum()).to.be.null;
  });

  it('isEmpty', () => {
    tree.isEmpty().should.equal(false);
    tree.clear();
    tree.isEmpty().should.equal(true);

    const newTree = new BinarySearchTree();
    newTree.isEmpty().should.equal(true);
  });

  it('clear', () => {
    tree.isEmpty().should.equal(false);
    tree.getSize().should.equal(13);
    tree.clear();
    tree.isEmpty().should.equal(true);
    tree.getSize().should.equal(0);
    tree.getHeight().should.equal(0);
    expect(tree.getRoot()).to.be.null;
  });

  it('contains', () => {
    tree.contains(9).should.equal(true);
    tree.contains(14).should.equal(false);
    tree.contains(null).should.equal(false);

    tree.clear();
    tree.contains(9).should.equal(false);

    const newTree = new BinarySearchTree();
    newTree.insert(new Number(0));
    newTree.insert(new Number(2));
    newTree.insert(new Number(10));
    newTree.insert(new Number(7));
    newTree.insert(new Number(1));
    newTree.contains(new Number(7)).should.equal(false);
  });

  it('get', () => {

  });

  it('size', () => {
    tree.getSize().should.equal(13);
    const node = tree.get(-3);
    tree.getSize(node).should.equal(6);
  });

  it('iterator', () => {
    let it = tree.inOrderIterator();
    let last = Number.MIN_SAFE_INTEGER;
    while (it.hasNext()) {
      const i = it.next();
      if (i < last) {
        throw new Error('The next item was not greater than the last. In order traversal failed.');
      }
      last = i;
    }
    it = tree.reverseOrderIterator();
    last = Number.MAX_SAFE_INTEGER;
    while (it.hasNext()) {
      const i = it.next();
      if (i > last) {
        throw new Error('The next item was not less than the last. Reverse order traversal failed.');
      }
      last = i;
    }
  });

  it('iteratorWithoutCheckingHasNext', () => {
    const newTree = new BinarySearchTree();
    newTree.insert(10);
    newTree.insert(3);

    const it = newTree.inOrderIterator();
    try {
      it.next();
      it.next();
      it.next();
    } catch (e) {
      e.message.should.equal('BinarySearchTreeIterator.next: No such element');
    }
  });

  it('iteratorWithNoElements', () => {
    const newTree = new BinarySearchTree();
    const it = newTree.inOrderIterator();
    it.hasNext().should.equal(false);
    try {
      it.next();
    } catch (e) {
      e.message.should.equal('BinarySearchTreeIterator.next: No such element');
    }
  });

  it('balance', () => {
    tree.isSelfBalancing().should.equal(false);
    tree.getHeight().should.equal(6);
    tree.setSelfBalancing(true);
    tree.getHeight().should.equal(4);
    tree.isSelfBalancing().should.equal(true);
    expect(tree.balance()).to.be.null;
    tree.clear();
    tree.insert(1);
    tree.root.should.equal(tree.balance(tree.root));
  });
});