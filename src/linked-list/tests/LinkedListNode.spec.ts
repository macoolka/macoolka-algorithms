import LinkedListNode from '../LinkedListNode';
import {some,isNone,isSome,getOrElse} from 'fp-ts/lib/Option';
describe('LinkedListNode', () => {
  it('should create list node with value', () => {
    const node = new LinkedListNode(1);

    expect(node.value).toBe(1);
    expect(isNone(node.next)).toEqual(true);
  });

  it('should create list node with object as a value', () => {
    const nodeValue = { value: 1, key: 'test' };
    const node = new LinkedListNode(nodeValue);

    expect(node.value.value).toBe(1);
    expect(node.value.key).toBe('test');
    expect(isNone(node.next)).toEqual(true);
  });

  it('should link nodes together', () => {
    const node2 = new LinkedListNode(2);
    const node1 = new LinkedListNode(1, some(node2));

    expect(isSome(node1.next)).toBeTruthy();
    expect(isNone(node2.next)).toBeTruthy()
    expect(node1.value).toBe(1);
    expect(isSome(node1.next)).toEqual(true);
    expect(getOrElse(()=>new LinkedListNode(5))(node1.next).value).toEqual(2);
  });

  it('should convert node to string', () => {
    const node = new LinkedListNode('1');

    expect(node.toString()).toBe('1');

    node.value = 'string value';
    expect(node.toString()).toBe('string value');
  });

  it('should convert node to string with custom stringifier', () => {
    const nodeValue :{value:number,key:string}= { value: 1, key: 'test' };
    const node = new LinkedListNode(nodeValue);
    const toStringCallback = (value:{value:number,key:string}) => `value: ${value.value}, key: ${value.key}`;

    expect(node.toString(toStringCallback)).toBe('value: 1, key: test');
  });
});
