import LinkedListNode from './LinkedListNode';
import {Option, none, some} from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import {Eq} from 'fp-ts/lib/Eq';
import * as O from 'fp-ts/lib/Option';
import {Predicate} from 'macoolka-predicate';

export default class LinkedList<A> {
  // @var LinkedListNode
  head: Option<LinkedListNode<A>> = none;
  tail: Option<LinkedListNode<A>> = none;
  /**
   * @param {Function} [comparatorFunction]
   */
  constructor(readonly ord: Eq<A>) {
  }

  /**
   * @param {*} value
   * @return {LinkedList}
   */
  prepend(value: A) {
    // Make new node to be a head.
    const newNode = new LinkedListNode(value, this.head);
    this.head = some(newNode);

    // If there is no tail yet let's make new node a tail.
    if (O.isNone(this.tail)) {
      this.tail = some(newNode);
    }

    return this;
  }

  /**
   * @param {*} value
   * @return {LinkedList}
   */
  append(value: A) {
    const newNode = new LinkedListNode(value);

    // If there is no head yet let's make new node a head.

    if (O.isNone(this.head)) {
      this.head = some(newNode);
      this.tail = some(newNode);

      return this;
    }

    // Attach new node to the end of linked list.
    pipe(
      this.tail,
      O.map(a => a.next = some(newNode))
    );

    this.tail = some(newNode);
    return this;
  }

  /**
   * @param {*} value
   * @return {LinkedListNode}
   */
  delete(value: A): Option<LinkedListNode<A>> {
    if (!this.head) {
      return none;
    }

    let deletedNode: Option<LinkedListNode<A>> = none ;

    // If the head must be deleted then make next node that is differ
    // from the head to be a new head.
    while (O.isSome(this.head) && this.ord.equals(this.head.value.value, value)) {
      deletedNode = this.head;
      this.head = this.head.value.next;
    }

    let currentNode = this.head;

    if (O.isSome(currentNode)) {
        // If next node must be deleted then make next node to be a next next one.
      while ( O.isSome(currentNode.value.next)) {

        if (this.ord.equals(currentNode.value.next.value.value, value)) {
          deletedNode = currentNode.value.next;
          currentNode.value.next = currentNode.value.next.value.next;
        } else {
          currentNode = currentNode.value.next;
        }
      }
    }

    // Check if tail must be deleted.
    if (O.isSome(this.tail) && this.ord.equals(this.tail.value.value, value)) {
      this.tail = currentNode;
    }

    return deletedNode;
  }

  /**
   * @param {Object} findParams
   * @param {*} findParams.value
   * @param {function} [findParams.callback]
   * @return {LinkedListNode}
   */
  find({ value , callback  }: {value?: A, callback?: Predicate<A>}): Option<LinkedListNode<A>> {
    if (!this.head) {
      return none;
    }

    let currentNode = this.head;

    while (O.isSome(currentNode)) {
      // If callback is specified then try to find node by callback.
      if (callback && callback(currentNode.value.value)) {
        return currentNode;
      }

      // If value is specified then try to compare by value..
      if (value !== undefined && this.ord.equals(currentNode.value.value, value)) {
        return currentNode;
      }

      currentNode = currentNode.value.next;
    }

    return none;
  }

  /**
   * @return {LinkedListNode}
   */
  deleteTail(): Option<LinkedListNode<A>> {
    const deletedTail = this.tail;

    if (this.head === this.tail) {
      // There is only one node in linked list.
      this.head = none;
      this.tail = none;

      return deletedTail;
    }

    // If there are many nodes in linked list...

    // Rewind to the last node and delete "next" link for the node before the last one.
    let currentNode = this.head;
    while (O.isSome(currentNode) && O.isSome(currentNode.value.next)) {
      if (O.isNone(currentNode.value.next.value.next)) {
        currentNode.value.next = none;
      } else {
        currentNode = currentNode.value.next;
      }
    }

    this.tail = currentNode;

    return deletedTail;
  }

  /**
   * @return {LinkedListNode}
   */
  deleteHead(): Option<LinkedListNode<A>> {
    if (O.isNone(this.head)) {
      return none;
    }

    const deletedHead = this.head;

    if (O.isSome(this.head.value.next)) {
      this.head = this.head.value.next;
    } else {
      this.head = none;
      this.tail = none;
    }

    return deletedHead;
  }

  /**
   * @param {*[]} values - Array of values that need to be converted to linked list.
   * @return {LinkedList}
   */
  fromArray(values: Array<A>) {
    values.forEach(value => this.append(value));

    return this;
  }

  /**
   * @return {LinkedListNode[]}
   */
  toArray(): LinkedListNode<A>[] {
    const nodes: LinkedListNode<A>[] = [];

    let currentNode = this.head;
    while (O.isSome(currentNode)) {
      nodes.push(currentNode.value);
      currentNode = currentNode.value.next;
    }

    return nodes;
  }

  /**
   * @param {function} [callback]
   * @return {string}
   */
  toString(callback?: (a: A) => string) {
    return this.toArray().map(node => callback ? callback(node.value) : node.toString()).join(',');
  }

  /**
   * Reverse a linked list.
   * @returns {LinkedList}
   */
  reverse(): LinkedList<A> {
    let currNode = this.head;
    let prevNode: Option<LinkedListNode<A>> = none;
    let nextNode: Option<LinkedListNode<A>> = none;

    while (O.isSome(currNode)) {
      // Store next node.
      nextNode = currNode.value.next;

      // Change next node of the current node so it would link to previous node.
      currNode.value.next = prevNode;

      // Move prevNode and currNode nodes one step forward.
      prevNode = currNode;
      currNode = nextNode;
    }

    // Reset head and tail.
    this.tail = this.head;
    this.head = prevNode;

    return this;
  }
}
