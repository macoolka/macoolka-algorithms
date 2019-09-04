export interface Graph<A extends GraphVertex> {
    getNeighbors: (a: A) => A[];
    getAllVertices: () => A[];
}
export interface GraphVertex {
    getKey: () => string|number;
}
