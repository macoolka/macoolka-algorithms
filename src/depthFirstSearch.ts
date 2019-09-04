import { Graph, GraphVertex } from './Graph';
import * as O from 'fp-ts/lib/Option';
import { pipe} from 'fp-ts/lib/pipeable';
import { Optional } from 'monocle-ts';

/**
 *  Determines whether DFS should traverse from the vertex to its neighbor
 *  (along the edge). By default prohibits visiting the same vertex again.
 */
type allowTraversal<A> = (a: { previousVertex: O.Option<A>, currentVertex: A, nextVertex: A }) => boolean;
/**
 * Called when DFS enters the vertex
 */
type enterVertex<A> = (vertices: { currentVertex: A, previousVertex: O.Option<A> }) => void;
/**
 * Called when DFS leaves the vertex.
 */
type leaveVertex<A> = (vertices: { currentVertex: A, previousVertex: O.Option<A> }) => void;
/**
 * DFS Callbacks
 */
export interface DFSCallbacks<A> {
  allowTraversal?: allowTraversal<A>;
  enterVertex?: enterVertex<A>;
  leaveVertex?: leaveVertex<A>;
}
export const lensDFSCallback = <A>() => ({
  allowTraversal: Optional.fromNullableProp<DFSCallbacks<A>>()('allowTraversal'),
  enterVertex: Optional.fromNullableProp<DFSCallbacks<A>>()('enterVertex'),
  leaveVertex: Optional.fromNullableProp<DFSCallbacks<A>>()('leaveVertex'),
});

/**
 * @param {Graph} graph
 * @param {GraphVertex} currentVertex
 * @param {GraphVertex} previousVertex
 * @param {Callbacks} callbacks
 */
function depthFirstSearchRecursive<A extends GraphVertex>(
  graph: Graph<A>,
  currentVertex: A,
  previousVertex: O.Option<A>,
  callbacks: {
    allowTraversal: allowTraversal<A>,
    enterVertex?: enterVertex<A>
    leaveVertex?: leaveVertex<A>
  }) {
  const lens = lensDFSCallback<A>();
  pipe(
    lens.enterVertex.getOption(callbacks),
    O.map(a => a({ currentVertex, previousVertex }))
  );
  graph.getNeighbors(currentVertex).map(nextVertex => {
    if (callbacks.allowTraversal({ previousVertex, currentVertex, nextVertex })) {
      depthFirstSearchRecursive(graph, nextVertex, O.some(currentVertex), callbacks);
    }
  });

  pipe(
    lens.leaveVertex.getOption(callbacks),
    O.map(a => a({ currentVertex, previousVertex }))
  );
/*   array.map(graph.getNeighbors(currentVertex), nextVertex=> {
    if (callbacks.allowTraversal({ previousVertex, currentVertex, nextVertex })) {
      depthFirstSearchRecursive(graph, nextVertex, some(currentVertex), callbacks);
    }
  }) */
 // lens.leaveVertex.getOption(callbacks).map(a => a({ currentVertex, previousVertex }))
}

/**
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @param {Callbacks} [callbacks]
 */
export default function depthFirstSearch<A extends GraphVertex>(graph: Graph<A>, startVertex: A,
                                                                callbacks: DFSCallbacks<A>= {}) {
  const previousVertex: O.Option<A> = O.none;
  const seen: Record<string|number, boolean> = {};

  const defaultAllowTravsal: allowTraversal<A> =  ({ nextVertex }) => {

      if (!seen[nextVertex.getKey()]) {
        seen[nextVertex.getKey()] = true;
        return true;
      }
      return false;
    };
  const lens = lensDFSCallback<A>();
  depthFirstSearchRecursive(graph, startVertex, previousVertex, {
    allowTraversal: pipe(
      lens.allowTraversal.getOption(callbacks),
      O.getOrElse(() => defaultAllowTravsal)
    ) ,
    ...callbacks,
  });
}
