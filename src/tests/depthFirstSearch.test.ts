import Graph from '../graph/Graph';
import GraphVertex from '../graph/GraphVertex';
import GraphEdge from '../graph/GraphEdge';
import depthFirstSearch from '../depthFirstSearch';
import {some,none} from 'fp-ts/lib/Option';
describe('depthFirstSearch', () => {
  it('should perform DFS operation on graph', () => {
    const graph = new Graph<string>(true);

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');
    const vertexE = new GraphVertex('E');
    const vertexF = new GraphVertex('F');
    const vertexG = new GraphVertex('G');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeCG = new GraphEdge(vertexC, vertexG);
    const edgeAD = new GraphEdge(vertexA, vertexD);
    const edgeAE = new GraphEdge(vertexA, vertexE);
    const edgeEF = new GraphEdge(vertexE, vertexF);
    const edgeFD = new GraphEdge(vertexF, vertexD);
    const edgeDG = new GraphEdge(vertexD, vertexG);

    graph
      .addEdge(edgeAB)
      .addEdge(edgeBC)
      .addEdge(edgeCG)
      .addEdge(edgeAD)
      .addEdge(edgeAE)
      .addEdge(edgeEF)
      .addEdge(edgeFD)
      .addEdge(edgeDG);

    expect(graph.toString()).toBe('A,B,C,G,D,E,F');

    const enterVertexCallback = jest.fn();
    const leaveVertexCallback = jest.fn();

    // Traverse graphs without callbacks first to check default ones.
    depthFirstSearch(graph, vertexA);

    // Traverse graph with enterVertex and leaveVertex callbacks.
    depthFirstSearch(graph, vertexA, {
      enterVertex: enterVertexCallback,
      leaveVertex: leaveVertexCallback,
    });

    expect(enterVertexCallback).toHaveBeenCalledTimes(graph.getAllVertices().length);
    expect(leaveVertexCallback).toHaveBeenCalledTimes(graph.getAllVertices().length);

    const enterVertexParamsMap = [
      { currentVertex: vertexA, previousVertex: none },
      { currentVertex: vertexB, previousVertex: some(vertexA) },
      { currentVertex: vertexC, previousVertex: some(vertexB) },
      { currentVertex: vertexG, previousVertex: some(vertexC) },
      { currentVertex: vertexD, previousVertex: some(vertexA) },
      { currentVertex: vertexE, previousVertex: some(vertexA) },
      { currentVertex: vertexF, previousVertex: some(vertexE) },
    ];

    for (let callIndex = 0; callIndex < graph.getAllVertices().length; callIndex += 1) {
      const params = enterVertexCallback.mock.calls[callIndex][0];
      expect(params.currentVertex).toEqual(enterVertexParamsMap[callIndex].currentVertex);
      expect(params.previousVertex).toEqual(enterVertexParamsMap[callIndex].previousVertex);
    }

    const leaveVertexParamsMap = [
      { currentVertex: vertexG, previousVertex: some(vertexC) },
      { currentVertex: vertexC, previousVertex: some(vertexB) },
      { currentVertex: vertexB, previousVertex: some(vertexA) },
      { currentVertex: vertexD, previousVertex: some(vertexA) },
      { currentVertex: vertexF, previousVertex: some(vertexE) },
      { currentVertex: vertexE, previousVertex: some(vertexA) },
      { currentVertex: vertexA, previousVertex: none },
    ];

    for (let callIndex = 0; callIndex < graph.getAllVertices().length; callIndex += 1) {
      const params = leaveVertexCallback.mock.calls[callIndex][0];
      expect(params.currentVertex).toEqual(leaveVertexParamsMap[callIndex].currentVertex);
      expect(params.previousVertex).toEqual(leaveVertexParamsMap[callIndex].previousVertex);
    }
  });

  it('allow users to redefine vertex visiting logic', () => {
    const graph = new Graph(true);

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');
    const vertexE = new GraphVertex('E');
    const vertexF = new GraphVertex('F');
    const vertexG = new GraphVertex('G');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeCG = new GraphEdge(vertexC, vertexG);
    const edgeAD = new GraphEdge(vertexA, vertexD);
    const edgeAE = new GraphEdge(vertexA, vertexE);
    const edgeEF = new GraphEdge(vertexE, vertexF);
    const edgeFD = new GraphEdge(vertexF, vertexD);
    const edgeDG = new GraphEdge(vertexD, vertexG);

    graph
      .addEdge(edgeAB)
      .addEdge(edgeBC)
      .addEdge(edgeCG)
      .addEdge(edgeAD)
      .addEdge(edgeAE)
      .addEdge(edgeEF)
      .addEdge(edgeFD)
      .addEdge(edgeDG);

    expect(graph.toString()).toBe('A,B,C,G,D,E,F');

    const enterVertexCallback = jest.fn();
    const leaveVertexCallback = jest.fn();

    depthFirstSearch(graph, vertexA, {
      enterVertex: enterVertexCallback,
      leaveVertex: leaveVertexCallback,
      allowTraversal: ({ currentVertex, nextVertex }) => {
        return !(currentVertex === vertexA && nextVertex === vertexB);
      },
    });

    expect(enterVertexCallback).toHaveBeenCalledTimes(7);
    expect(leaveVertexCallback).toHaveBeenCalledTimes(7);

    const enterVertexParamsMap = [
      { currentVertex: vertexA, previousVertex: none },
      { currentVertex: vertexD, previousVertex: some(vertexA) },
      { currentVertex: vertexG, previousVertex: some(vertexD) },
      { currentVertex: vertexE, previousVertex: some(vertexA) },
      { currentVertex: vertexF, previousVertex: some(vertexE) },
      { currentVertex: vertexD, previousVertex: some(vertexF) },
      { currentVertex: vertexG, previousVertex: some(vertexD) },
    ];

    for (let callIndex = 0; callIndex < graph.getAllVertices().length; callIndex += 1) {
      const params = enterVertexCallback.mock.calls[callIndex][0];
      expect(params.currentVertex).toEqual(enterVertexParamsMap[callIndex].currentVertex);
      expect(params.previousVertex).toEqual(enterVertexParamsMap[callIndex].previousVertex);
    }

    const leaveVertexParamsMap = [
      { currentVertex: vertexG, previousVertex: some(vertexD) },
      { currentVertex: vertexD, previousVertex: some(vertexA) },
      { currentVertex: vertexG, previousVertex: some(vertexD) },
      { currentVertex: vertexD, previousVertex: some(vertexF) },
      { currentVertex: vertexF, previousVertex: some(vertexE) },
      { currentVertex: vertexE, previousVertex: some(vertexA) },
      { currentVertex: vertexA, previousVertex: none },
    ];

    for (let callIndex = 0; callIndex < graph.getAllVertices().length; callIndex += 1) {
      const params = leaveVertexCallback.mock.calls[callIndex][0];
      expect(params.currentVertex).toEqual(leaveVertexParamsMap[callIndex].currentVertex);
      expect(params.previousVertex).toEqual(leaveVertexParamsMap[callIndex].previousVertex);
    }
  });
});
