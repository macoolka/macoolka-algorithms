import LinkedList from '../linked-list/LinkedList';
import LinkedListNode from '../linked-list/LinkedListNode';
import GraphEdge, { setoidGraphEdge } from './GraphEdge';
import * as O from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import {toString} from 'macoolka-object';
export default class GraphVertex<A> {
  edges = new LinkedList(setoidGraphEdge<A>());
  /**
   * @param {*} value
   */
  constructor(public value: A) {

    // Normally you would store string value like vertex name.
    // But generally it may be any object as well
  }

  /**
   * @param {GraphEdge} edge
   * @returns {GraphVertex}
   */
  addEdge(edge: GraphEdge<A>) {
    this.edges.append(edge);

    return this;
  }

  /**
   * @param {GraphEdge} edge
   */
  deleteEdge(edge: GraphEdge<A>) {
    this.edges.delete(edge);
  }

  /**
   * @returns {GraphVertex[]}
   */
  getNeighbors(): GraphVertex<A>[] {
    const edges = this.edges.toArray();

    /** @param {LinkedListNode} node */
    const neighborsConverter = (node: LinkedListNode<GraphEdge<A>>) => {
      return node.value.startVertex === this ? node.value.endVertex : node.value.startVertex;
    };

    // Return either start or end vertex.
    // For undirected graphs it is possible that current vertex will be the end one.
    return edges.map(neighborsConverter);
  }

  /**
   * @return {GraphEdge[]}
   */
  getEdges(): GraphEdge<A>[] {
    return this.edges.toArray().map(linkedListNode => linkedListNode.value);
  }

  /**
   * @return {number}
   */
  getDegree(): number {
    return this.edges.toArray().length;
  }

  /**
   * @param {GraphEdge} requiredEdge
   * @returns {boolean}
   */
  hasEdge(requiredEdge: GraphEdge<A>): boolean {
    const edgeNode = this.edges.find({
      callback: edge => edge === requiredEdge,
    });

    return O.isSome(edgeNode);
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {boolean}
   */
  hasNeighbor(vertex: GraphVertex<A>): boolean {
    const vertexNode = this.edges.find({
      callback: edge => edge.startVertex === vertex || edge.endVertex === vertex,
    });

    return O.isSome(vertexNode);
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {(GraphEdge|null)}
   */
  findEdge(vertex: GraphVertex<A>): O.Option<GraphEdge<A>> {
    const edgeFinder = (edgeNode: GraphEdge<A>) => {
      return edgeNode.startVertex === vertex || edgeNode.endVertex === vertex;
    };

    const edge = this.edges.find({ callback: edgeFinder });

    return pipe(
      edge,
      O.map(a => a.value)
    );
  }

  /**
   * @returns {string}
   */
  getKey(): string {
    return toString(this.value);
  }

  /**
   * @return {GraphVertex}
   */
  deleteAllEdges() {
    this.getEdges().forEach(edge => this.deleteEdge(edge));

    return this;
  }

  /**
   * @param {function} [callback]
   * @returns {string}
   */
  toString(callback?: (a: A) => string) {
    return callback ? callback(this.value) : toString(this.value);
  }
}
