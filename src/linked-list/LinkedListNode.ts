
import { Option, none } from 'fp-ts/lib/Option';

export default class LinkedListNode<A> {
  constructor(public value: A, public next: Option<LinkedListNode<A>> = none) {
  }
  toString(callback?: (a: A) => string) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
