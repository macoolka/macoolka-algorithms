import Stack from './stack/Stack';
import depthFirstSearch, { DFSCallbacks } from './depthFirstSearch';
import { Graph, GraphVertex } from './Graph';
/**
 * @param {Graph} graph
 */
export default function topologicalSort<A extends GraphVertex>(graph: Graph<A>) {
  // Create a set of all vertices we want to visit.
  const unvisitedSet: Record<string | number, A> =
    graph.getAllVertices().reduce((a, b) => ({ ...a, [b.getKey()]: b }), {});

  // Create a set for all vertices that we've already visited.
  const visitedSet: Record<string | number, boolean> = {};
  // Create a stack of already ordered vertices.
  const sortedStack = new Stack<A>();

  const dfsCallbacks: DFSCallbacks<A> = {
    enterVertex: ({ currentVertex }) => {
      // Add vertex to visited set in case if all its children has been explored.
      visitedSet[currentVertex.getKey()] = true;
     // console.log(`enterVertex:${currentVertex.toString()}`)
      // Remove this vertex from unvisited set.
      delete unvisitedSet[currentVertex.getKey()];
    },
    leaveVertex: ({ currentVertex }) => {
      // If the vertex has been totally explored then we may push it to stack.
      sortedStack.push(currentVertex);
      // console.log(`leaveVertex:${currentVertex.toString()}`)
    },
    allowTraversal: ({ nextVertex }) => !visitedSet[nextVertex.getKey()],

  };

  // Let's go and do DFS for all unvisited nodes.
  while (Object.keys(unvisitedSet).length) {
    const currentVertexKey = Object.keys(unvisitedSet)[0];
    const currentVertex = unvisitedSet[currentVertexKey];
   // console.log(`site:${currentVertex.toString()}`)
    // Do DFS for current node.
    depthFirstSearch(graph, currentVertex, dfsCallbacks);
  }

  return sortedStack.toArray();
}
