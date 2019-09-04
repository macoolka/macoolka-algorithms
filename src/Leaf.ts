import { Option, none, some } from 'fp-ts/lib/Option';
import * as O from 'fp-ts/lib/Option';
import * as array from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';
import { TraversalCallbacks, lens, DefaultTraversalCallbacks, defaultCallbacks } from './Traversal';
export type Leaf<T> = {
  getNode: () => T,
  getLeaf: () => Leaf<T>[]
  getKey: () => string | number,
};

function depthFirstSearchRecursive<A>(
  currentVertex: Leaf<A>,
  previousVertex: Option<Leaf<A>>,
  callbacks: DefaultTraversalCallbacks<Leaf<A>>) {
  const lensCallBack = lens<Leaf<A>>();
  pipe(
    lensCallBack.enter.getOption(callbacks),
    O.map(a => a({ currentVertex, previousVertex }))
  );
  // .map(a => a({ currentVertex, previousVertex }));
  pipe(
    currentVertex.getLeaf(),
    array.map(nextVertex => {
      if (callbacks.allow({ previousVertex, currentVertex, nextVertex })) {
        depthFirstSearchRecursive(nextVertex, some(currentVertex), callbacks);
      }
    })
  );
  pipe(
    lensCallBack.leave.getOption(callbacks),
    O.map(a => a({ currentVertex, previousVertex }))
  );

}

export function depthFirstSearch<A>(startVertex: Leaf<A>,
                                    callbacks: TraversalCallbacks<Leaf<A>> = {}) {
  const seen: Record<string | number, boolean> = {};
  const inner = defaultCallbacks<Leaf<A>>(({ nextVertex }) => {

    if (!seen[nextVertex.getKey()]) {
      seen[nextVertex.getKey()] = true;
      return true;
    }
    return false;
  })(callbacks);
  depthFirstSearchRecursive(startVertex, none, inner);
}
