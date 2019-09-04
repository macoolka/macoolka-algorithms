import GraphEdge from './GraphEdge';
import GraphVertex from './GraphVertex';
import {Graph as _Graph} from '../Graph';
import {fromNullable, Option} from 'fp-ts/lib/Option';
import * as O from 'fp-ts/lib/Option';
import {Eq} from 'fp-ts/lib/Eq';
import { pipe } from 'fp-ts/lib/pipeable';

export default class Graph<A= string> implements _Graph<GraphVertex<A>> {
  vertices: {[key: string]: GraphVertex<A>} = {};
  setoid: Eq<GraphVertex<A>> = {
    equals: (a, b) => {
       return a.getKey() === b.getKey();
    },
  };
  edges: {[key: string]: GraphEdge<A>} = {};

  constructor(readonly isDirected: boolean = false) {

  }

  /**
   * @param {GraphVertex} newVertex
   * @returns {Graph}
   */
  addVertex(newVertex: GraphVertex<A>): Graph<A> {
    this.vertices[newVertex.getKey()] = newVertex;

    return this;
  }

  /**
   * @param {string} vertexKey
   * @returns GraphVertex
   */
  getVertexByKey(vertexKey: string): Option<GraphVertex<A>> {
   return fromNullable(this.vertices[vertexKey]) ;
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {GraphVertex[]}
   */
  getNeighbors(vertex: GraphVertex<A>): GraphVertex<A>[] {
    return vertex.getNeighbors();
  }

  /**
   * @return {GraphVertex[]}
   */
  getAllVertices(): GraphVertex<A>[] {
    return Object.values(this.vertices);
  }

  /**
   * @return {GraphEdge[]}
   */
  getAllEdges(): GraphEdge<A>[] {
    return Object.values(this.edges);
  }

  /**
   * @param {GraphEdge} edge
   * @returns {Graph}
   */
  addEdge(edge: GraphEdge<A>): Graph<A> {
    // Try to find and end start vertices.
    let startVertex = this.getVertexByKey(edge.startVertex.getKey());
    let endVertex = this.getVertexByKey(edge.endVertex.getKey());

    // Insert start vertex if it wasn't inserted.
    if (O.isNone(startVertex)) {
      this.addVertex(edge.startVertex);
      startVertex = this.getVertexByKey(edge.startVertex.getKey());
    }

    // Insert end vertex if it wasn't inserted.
    if (O.isNone(endVertex)) {
      this.addVertex(edge.endVertex);
      endVertex = this.getVertexByKey(edge.endVertex.getKey());
    }

    // Check if edge has been already added.
    if (this.edges[edge.getKey()]) {
      throw new Error(`Edge has already been added before.${edge.getKey()}`);
    } else {
      this.edges[edge.getKey()] = edge;
    }

    // Add edge to the vertices.
    if (this.isDirected) {
      // If graph IS directed then add the edge only to start vertex.
      pipe(
        startVertex,
        O.map(a => a.addEdge(edge))
      );

    } else {
      // If graph ISN'T directed then add the edge to both vertices.
      pipe(
        startVertex,
        O.map(a => a.addEdge(edge))
      );
      pipe(
        endVertex,
        O.map(a => a.addEdge(edge))
      );
     }

    return this;
  }

  /**
   * @param {GraphEdge} edge
   */
  deleteEdge(edge: GraphEdge<A>) {
    // Delete edge from the list of edges.
    if (this.edges[edge.getKey()]) {
      delete this.edges[edge.getKey()];
    } else {
      throw new Error('Edge not found in graph');
    }

    // Try to find and end start vertices and delete edge from them.
    const startVertex = this.getVertexByKey(edge.startVertex.getKey());
    const endVertex = this.getVertexByKey(edge.endVertex.getKey());

    pipe(
      startVertex,
      O.map(a => a.deleteEdge(edge))
    );
    pipe(
      endVertex,
      O.map(a => a.deleteEdge(edge))
    );
   }

  /**
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @return {(GraphEdge|null)}
   */
  findEdge(startVertex: GraphVertex<A>, endVertex: GraphVertex<A>): Option<GraphEdge<A>> {
    const vertex = this.getVertexByKey(startVertex.getKey());
    return pipe(
      vertex,
      O.chain(a => a.findEdge(endVertex))
    );

  }

  /**
   * @param {string} vertexKey
   * @returns {GraphVertex}
   */
  findVertexByKey(vertexKey: string): Option<GraphVertex<A>> {

    return fromNullable(this.vertices[vertexKey]);
  }

  /**
   * @return {number}
   */
  getWeight(): number {
    return this.getAllEdges().reduce((weight, graphEdge) => {
      return weight + graphEdge.weight;
    }, 0);
  }

  /**
   * Reverse all the edges in directed graph.
   * @return {Graph}
   */
  reverse(): Graph<A> {
    /** @param {GraphEdge} edge */
    this.getAllEdges().forEach((edge) => {
      // Delete straight edge from graph and from vertices.
      this.deleteEdge(edge);

      // Reverse the edge.
      edge.reverse();

      // Add reversed edge back to the graph and its vertices.
      this.addEdge(edge);
    });

    return this;
  }

  /**
   * @return {object}
   */
  getVerticesIndices(): {[key: string]: number}  {
    const verticesIndices: {[key: string]: number} = {};
    this.getAllVertices().forEach((vertex, index) => {
      verticesIndices[vertex.getKey()] = index;
    });

    return verticesIndices;
  }

  /**
   * @return {*[][]}
   */
  getAdjacencyMatrix(): number[][] {
    const vertices = this.getAllVertices();
    const verticesIndices = this.getVerticesIndices();

    // Init matrix with infinities meaning that there is no ways of
    // getting from one vertex to another yet.
    const adjacencyMatrix = Array(vertices.length).fill(null).map(() => {
      return Array(vertices.length).fill(Infinity);
    });

    // Fill the columns.
    vertices.forEach((vertex, vertexIndex) => {
      vertex.getNeighbors().forEach((neighbor) => {
        const neighborIndex = verticesIndices[neighbor.getKey()];
        adjacencyMatrix[vertexIndex][neighborIndex] = pipe(
          this.findEdge(vertex, neighbor),
          O.map(a => a.weight),
          O.getOrElse(() => 0)
        );
      });
    });

    return adjacencyMatrix;
  }

  /**
   * @return {string}
   */
  toString(): string {
    return Object.keys(this.vertices).toString();
  }
}
