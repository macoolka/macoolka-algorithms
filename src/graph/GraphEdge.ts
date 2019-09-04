import GraphVertex from './GraphVertex';
import {eqString, contramap} from 'fp-ts/lib/Eq';
export const setoidGraphEdge = <A>() => contramap((p: GraphEdge<A>) => p.getKey())(eqString);
export default class GraphEdge<A> {
  /**
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @param {number} [weight=1]
   */
  constructor(public startVertex: GraphVertex<A>, public endVertex: GraphVertex<A>, public weight: number = 0) {

  }

  /**
   * @return {string}
   */
  getKey() {
    const startVertexKey = this.startVertex.getKey();
    const endVertexKey = this.endVertex.getKey();

    return `${startVertexKey}_${endVertexKey}`;
  }

  /**
   * @return {GraphEdge}
   */
  reverse() {
    const tmp = this.startVertex;
    this.startVertex = this.endVertex;
    this.endVertex = tmp;

    return this;
  }

  /**
   * @return {string}
   */
  toString() {
    return this.getKey();
  }
}
