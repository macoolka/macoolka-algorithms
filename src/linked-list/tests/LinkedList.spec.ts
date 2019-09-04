import LinkedList from '../LinkedList';
import {eqString,eqNumber,contramap} from 'fp-ts/lib/Eq';
import {some,none,isNone,isSome,option,exists} from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable'
describe('LinkedList', () => {
  it('should create empty linked list', () => {
    const linkedList = new LinkedList(eqString);
    expect(linkedList.toString()).toBe('');
  });

  it('should append node to linked list', () => {
    const linkedList = new LinkedList(eqNumber);

    expect(isNone(linkedList.head)).toEqual(true);
    expect(isNone(linkedList.tail)).toEqual(true);

    linkedList.append(1);
    linkedList.append(2);

    expect(linkedList.toString()).toBe('1,2');
    expect(isSome(linkedList.tail)).toEqual(true);
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(2))
    expect(option.map(linkedList.tail,a=>a.next)).toEqual(some(none))


  });

  it('should prepend node to linked list', () => {
    const linkedList = new LinkedList(eqNumber);

    linkedList.prepend(2);
    expect(option.map(linkedList.head,a=>a.value)).toEqual(some(2));
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(2));

    linkedList.append(1);
    linkedList.prepend(3);

    expect(linkedList.toString()).toBe('3,2,1');
  });

  it('should delete node by value from linked list', () => {
    const linkedList = new LinkedList(eqNumber);

    expect(isNone(linkedList.delete(5))).toBeTruthy();

    linkedList.append(1);
    linkedList.append(1);
    linkedList.append(2);
    linkedList.append(3);
    linkedList.append(3);
    linkedList.append(3);
    linkedList.append(4);
    linkedList.append(5);

    expect(option.map(linkedList.head,a=>a.value)).toEqual(some(1));
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(5));

    const deletedNode = linkedList.delete(3);
    expect(option.map(deletedNode,a=>a.value)).toEqual(some(3));
    expect(linkedList.toString()).toBe('1,1,2,4,5');

    linkedList.delete(3);
    expect(linkedList.toString()).toBe('1,1,2,4,5');

    linkedList.delete(1);
    expect(linkedList.toString()).toBe('2,4,5');
    expect(option.map(linkedList.head,a=>a.value)).toEqual(some(2));
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(5));

    linkedList.delete(5);
    expect(linkedList.toString()).toBe('2,4');

    expect(option.map(linkedList.head,a=>a.value)).toEqual(some(2));
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(4));
    linkedList.delete(4);
    expect(linkedList.toString()).toBe('2');

    expect(option.map(linkedList.head,a=>a.value)).toEqual(some(2));
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(2));

    linkedList.delete(2);
    expect(linkedList.toString()).toBe('');
  });

  it('should delete linked list tail', () => {
    const linkedList = new LinkedList(eqNumber);

    linkedList.append(1);
    linkedList.append(2);
    linkedList.append(3);
    expect(option.map(linkedList.head,a=>a.value)).toEqual(some(1));
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(3));

    const deletedNode1 = linkedList.deleteTail();

    expect(option.map(deletedNode1,a=>a.value)).toEqual(some(3));
    expect(linkedList.toString()).toBe('1,2');
    expect(option.map(linkedList.head,a=>a.value)).toEqual(some(1));
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(2));

    const deletedNode2 = linkedList.deleteTail();

    expect(option.map(deletedNode2,a=>a.value)).toEqual(some(2));
    expect(linkedList.toString()).toBe('1');
    expect(option.map(linkedList.head,a=>a.value)).toEqual(some(1));
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(1));

    const deletedNode3 = linkedList.deleteTail();

    expect(option.map(deletedNode3,a=>a.value)).toEqual(some(1));
    expect(linkedList.toString()).toBe('');
    expect(linkedList.head).toEqual(none);
    expect(linkedList.tail).toEqual(none);
  });

  it('should delete linked list head', () => {
    const linkedList = new LinkedList(eqNumber);

    expect(isNone(linkedList.deleteHead())).toBeTruthy();

    linkedList.append(1);
    linkedList.append(2);

    expect(option.map(linkedList.head,a=>a.value)).toEqual(some(1));
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(2));

    const deletedNode1 = linkedList.deleteHead();

    expect(option.map(deletedNode1,a=>a.value)).toEqual(some(1));
    expect(linkedList.toString()).toBe('2');
    expect(option.map(linkedList.head,a=>a.value)).toEqual(some(2));
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(2));

    const deletedNode2 = linkedList.deleteHead();

    expect(option.map(deletedNode2,a=>a.value)).toEqual(some(2));
    expect(linkedList.toString()).toBe('');
    expect(linkedList.head).toEqual(none);
    expect(linkedList.tail).toEqual(none);
  });

  it('should be possible to store objects in the list and to print them out', () => {
    
    type A={
      value:number,
      key:string,
    }
    const S = contramap((p: A) => p.key)(eqString)
    const linkedList = new LinkedList(S);
    const nodeValue1 = { value: 1, key: 'key1' };
    const nodeValue2 = { value: 2, key: 'key2' };

    linkedList
      .append(nodeValue1)
      .prepend(nodeValue2);

    const nodeStringifier = (value:A) => `${value.key}:${value.value}`;

    expect(linkedList.toString(nodeStringifier)).toBe('key2:2,key1:1');
  });

  it('should find node by value', () => {
    const linkedList = new LinkedList(eqNumber);

    expect(linkedList.find({ value: 5 })).toEqual(none);

    linkedList.append(1);
    expect(isSome(linkedList.find({ value: 1 }))).toBeTruthy();

    linkedList
      .append(2)
      .append(3);

    const node = linkedList.find({ value: 2 });

    expect(option.map(node,a=>a.value)).toEqual(some(2));
    expect(isNone(linkedList.find({ value: 5 }))).toBeTruthy();
  });

  it('should find node by callback', () => {
    type A={
      value:number,
      key:string,
    }
    const S = contramap((p: A) => p.key)(eqString)
    const linkedList = new LinkedList(S);

    linkedList
      .append({ value: 1, key: 'test1' })
      .append({ value: 2, key: 'test2' })
      .append({ value: 3, key: 'test3' });

    const node = linkedList.find({ callback: value => value.key === 'test2' });

    expect(isSome(node)).toBeTruthy();
    expect(option.map(node,a=>a.value)).toEqual(some({ value: 2, key: 'test2' }));
    expect(isNone(linkedList.find({ callback: value => value.key === 'test5' }))).toBeTruthy();
  });

  it('should create linked list from array', () => {
    const linkedList = new LinkedList(eqNumber);
    linkedList.fromArray([1, 1, 2, 3, 3, 3, 4, 5]);

    expect(linkedList.toString()).toBe('1,1,2,3,3,3,4,5');
  });

 
  it('should reverse linked list', () => {
    const linkedList = new LinkedList(eqNumber);

    // Add test values to linked list.
    linkedList
      .append(1)
      .append(2)
      .append(3);
    expect(linkedList.toString()).toBe('1,2,3');
    expect(pipe(
      linkedList.head,
      exists(a=>a.value===1)
    )).toBeTruthy();
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(3));

    // Reverse linked list.
    linkedList.reverse();
    expect(linkedList.toString()).toBe('3,2,1');
    expect(pipe(
      linkedList.head,
      exists(a=>a.value===3)
    )).toBeTruthy();
  
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(1));

    // Reverse linked list back to initial state.
    linkedList.reverse();
    expect(linkedList.toString()).toBe('1,2,3');
    expect(pipe(
      linkedList.head,
      exists(a=>a.value===1)
    )).toBeTruthy();
  
    expect(option.map(linkedList.tail,a=>a.value)).toEqual(some(3));
  });
});
