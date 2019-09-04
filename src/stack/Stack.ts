import LinkedList from '../linked-list/LinkedList';
import {strictEqual, Eq} from 'fp-ts/lib/Eq';
import * as O from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
const setoidAny: Eq<any> = {
  equals: strictEqual,
};
export default class Stack<A= string> {
    // We're going to implement Stack based on LinkedList since these
    // structures are quite similar. Compare push/pop operations of the Stack
    // with prepend/deleteHead operations of LinkedList.
  linkedList = new LinkedList<A>(setoidAny);

  /**
   * @return {boolean}
   * The stack is empty if its linked list doesn't have a head.
   */
  isEmpty = () => O.isNone(this.linkedList.head);

  /**
   * @return {*}
   * Just read the value from the start of linked list without deleting it.
   */
  peek = (): O.Option<A> => pipe(
    this.linkedList.head,
    O.map(a => a.value)
  )

  /**
   * @param {*} value
   */
  push = (value: A): Stack<A> => {
    // Pushing means to lay the value on top of the stack. Therefore let's just add
    // the new value at the start of the linked list.
    this.linkedList.prepend(value);
    return this;
  }

  /**
   * Let's try to delete the first node (the head) from the linked list.
   * If there is no head (the linked list is empty) just return none.
   */
  pop = (): O.Option<A> => pipe(
    this.linkedList.deleteHead(),
    O.map(a => a.value)
  )
  /**
   * @return {*[]}
   */
  toArray(): A[] {
    return this.linkedList
      .toArray()
      .map(linkedListNode => linkedListNode.value);
  }

  /**
   * @param {function} [callback]
   * @return {string}
   */
  toString(callback?: (a: A) => string) {
    return this.linkedList.toString(callback);
  }
}
