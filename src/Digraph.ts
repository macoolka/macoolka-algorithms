export type BasicType= string | number ;

export type Vertex= {
    id: BasicType,
    afters: Array<BasicType>
};

export type Digraph = { [key in BasicType]: Vertex };

/** topological sort */
export const tsort = (graph: Digraph): { sorted: Array<BasicType>; recursive: { [key in BasicType]: true } } => {
    const sorted: BasicType[] = [];
    const visited: { [key in BasicType]: true } = {};
    const recursive: { [key in BasicType]: true } = {};
    const visit = (id: BasicType, ancestors: Array<BasicType>= []) => {

        if (visited[id]) {
            return;
        }
        const vertex = graph[id];

        ancestors.push(id);
        visited[id] = true;

        vertex.afters.forEach(afterId => {
            if (ancestors.indexOf(afterId) >= 0) {
                recursive[id] = true;
                recursive[afterId] = true;
            } else {
                visit(afterId, ancestors.slice());
            }
        });

        sorted.unshift(id);
    };
    Object.keys(graph).forEach(a => visit(a));

    return {
        sorted: sorted.filter(id => !recursive.hasOwnProperty(id)),
        recursive,
    };
};
