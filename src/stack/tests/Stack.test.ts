import Stack from '../Stack';
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
describe('Stack', () => {
  it('should create empty stack', () => {
    const stack = new Stack();
    expect(stack).not.toBeNull();
    expect(stack.linkedList).not.toBeNull();
  });

  it('should stack data to stack', () => {
    const stack = new Stack<number>();

    stack.push(1);
    stack.push(2);

    expect(stack.toString()).toBe('2,1');
  });

  it('should peek data from stack', () => {
    const stack = new Stack<number>();

    expect(stack.peek()).toEqual(O.none)

    stack.push(1);
    stack.push(2);

    expect(stack.peek()).toEqual(O.some(2))
    expect(stack.peek()).toEqual(O.some(2))
  });

  it('should check if stack is empty', () => {
    const stack = new Stack<number>();

    expect(stack.isEmpty()).toBe(true);

    stack.push(1);

    expect(stack.isEmpty()).toBe(false);
  });

  it('should pop data from stack', () => {
    const stack = new Stack<number>();

    stack.push(1);
    stack.push(2);

    expect(stack.pop()).toEqual(O.some(2));
    expect(stack.pop()).toEqual(O.some(1));
    expect(stack.pop()).toEqual(O.none);
    expect(stack.isEmpty()).toBe(true);
  });

  it('should be possible to push/pop objects', () => {
    const stack = new Stack<{ value: string, key: string }>();

    stack.push({ value: 'test1', key: 'key1' });
    stack.push({ value: 'test2', key: 'key2' });

    const stringifier = (value: { value: string, key: string }) => `${value.key}:${value.value}`;

    expect(stack.toString(stringifier)).toBe('key2:test2,key1:test1');
    expect(pipe(
      stack.pop(),
      O.map(a => a.value)))
      .toEqual(O.some('test2'));
    expect(pipe(
      stack.pop(),
      O.map(a => a.value))
    ).toEqual(O.some('test1'));
  });

  it('should be possible to convert stack to array', () => {
    const stack = new Stack<number>();

    expect(O.isNone(stack.peek())).toBeTruthy();

    stack.push(1);
    stack.push(2);
    stack.push(3);

    expect(stack.toArray()).toEqual([3, 2, 1]);
  });
});
