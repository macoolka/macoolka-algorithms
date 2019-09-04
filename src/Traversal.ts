import { Option, getOrElse } from 'fp-ts/lib/Option';
import { Optional } from 'monocle-ts';
import { pipe } from 'fp-ts/lib/pipeable';
/**
 *  Determines whether Traversal should traverse from the vertex to its neighbor or child
 *  By default prohibits visiting the same vertex again.
 */
export type Allow<A> = (a: { previousVertex: Option<A>, currentVertex: A, nextVertex: A }) => boolean;
/**
 * Called when Traversal enters the vertex
 */
export type Enter<A> = (vertices: { currentVertex: A, previousVertex: Option<A> }) => void;
/**
 * Called when Traversal leaves the vertex.
 */
export type Leave<A> = (vertices: { currentVertex: A, previousVertex: Option<A> }) => void;
/**
 * Traversal Callbacks
 */
export interface TraversalCallbacks<A> {
    allow?: Allow<A>;
    enter?: Enter<A>;
    leave?: Leave<A>;
}
export interface DefaultTraversalCallbacks<A> {
    allow: Allow<A>;
    enter?: Enter<A>;
    leave?: Leave<A>;
}

export const lens = <A>() => ({
    allow: Optional.fromNullableProp<TraversalCallbacks<A>>()('allow'),
    enter: Optional.fromNullableProp<TraversalCallbacks<A>>()('enter'),
    leave: Optional.fromNullableProp<TraversalCallbacks<A>>()('leave'),
});

export const defaultCallbacks = <A>(a: Allow<A>) => (callbacks: TraversalCallbacks<A>) => ({
    allow: pipe(
        lens<A>().allow.getOption(callbacks),
        getOrElse(() => a)

    ),
    ...callbacks,
});
