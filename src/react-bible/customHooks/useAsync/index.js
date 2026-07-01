import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useAsync
 *
 * Manages the full lifecycle of an async operation: idle → loading → success/error.
 * Handles the most common correctness issues developers hit when doing this manually:
 *   • Stale responses setting state after the component unmounts
 *   • Race conditions when the same operation is triggered multiple times rapidly
 *   • No way to cancel in-flight requests when the component unmounts
 *
 * ─── WHAT THIS HOOK DOES ──────────────────────────────────────────────────────
 *
 *  Returns { data, error, status, execute, reset }
 *
 *    status: 'idle' | 'loading' | 'success' | 'error'
 *    data:   The resolved value (null until success)
 *    error:  The caught error (null until failure)
 *    execute: Function that triggers the async operation.
 *             Accepts the same arguments as the original asyncFn.
 *    reset:  Resets state back to idle (useful before re-triggering)
 *
 * ─── WHAT THIS HOOK DOES NOT DO (BY DESIGN) ──────────────────────────────────
 *
 *  ✗ It does NOT cache results. Every call to execute() hits the network.
 *    → For caching + background refresh, use TanStack Query or SWR.
 *
 *  ✗ It does NOT deduplicate in-flight requests.
 *    → If execute() is called twice simultaneously, two network requests fire.
 *    → For deduplication, you need a shared cache layer above this hook.
 *
 *  ✗ It does NOT retry on failure automatically.
 *    → See useAsyncWithRetry (a separate hook) for retry logic.
 *
 *  ✗ It does NOT support pagination or cursor-based fetching.
 *    → usePaginatedAsync is the hook for that.
 *
 *  ✗ It does NOT accept a dependency array for auto-execution.
 *    → That's intentional. Auto-execution is useAsyncEffect's responsibility.
 *    → Mixing triggering logic into this hook violates single responsibility.
 *
 * ─── RACE CONDITION HANDLING ─────────────────────────────────────────────────
 *
 *  Problem: User clicks a button, a request fires. Before it resolves, they click
 *  again. The first response may arrive AFTER the second. Without guard, stale
 *  data from the first response overwrites fresh data from the second.
 *
 *  Solution: Each execute() call gets a monotonically increasing "generation"
 *  counter. When a promise resolves, it checks if its generation matches the
 *  current one. If not, it was superseded — result is silently discarded.
 *
 * ─── UNMOUNT SAFETY ──────────────────────────────────────────────────────────
 *
 *  Problem: Component unmounts while a request is in-flight. The promise
 *  resolves and tries to call setState on an unmounted component. In React 18+
 *  this is a no-op and no longer throws, but it's still wasted work and can mask
 *  actual bugs.
 *
 *  Solution: An `isMounted` ref gates all state updates. If the component
 *  unmounts, the ref is set to false and no state updates occur.
 *
 *  Note: This does NOT cancel the underlying network request. The request still
 *  completes in the network layer — we just discard the result. For true
 *  cancellation, pass an AbortSignal into your asyncFn and use AbortController.
 *  See the usage example in docs.js.
 */

/**
 * @template T - The resolved type of the async operation
 * @param {(...args: any[]) => Promise<T>} asyncFn - The async function to manage
 * @param {{ immediate?: boolean }} [options]
 *   immediate: if true, execute() is called once on mount with no arguments.
 *              Defaults to false. Use for "load on mount" scenarios.
 * @returns {{
 *   data: T | null,
 *   error: Error | null,
 *   status: 'idle' | 'loading' | 'success' | 'error',
 *   isPending: boolean,
 *   isSuccess: boolean,
 *   isError: boolean,
 *   execute: (...args: any[]) => Promise<void>,
 *   reset: () => void
 * }}
 */
export function useAsync(asyncFn, { immediate = false } = {}) {
  const [state, setState] = useState({
    data: null,
    error: null,
    status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  })

  // Tracks whether the component is still mounted.
  // We use a ref (not state) because changing this should never trigger a re-render.
  const isMounted = useRef(true)

  // Monotonic generation counter: increments on every execute() call.
  // This is the guard against race conditions.
  const generation = useRef(0)

  // Keep asyncFn stable so it can be referenced inside execute without
  // making execute itself change identity on every render.
  const asyncFnRef = useRef(asyncFn)
  useEffect(() => { asyncFnRef.current = asyncFn })

  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  const execute = useCallback(async (...args) => {
    // Increment and capture this call's generation.
    const thisGeneration = ++generation.current

    setState({ data: null, error: null, status: 'loading' })

    try {
      const result = await asyncFnRef.current(...args)

      // Discard if: component unmounted OR a newer execute() has been called.
      if (!isMounted.current || thisGeneration !== generation.current) return

      setState({ data: result, error: null, status: 'success' })
    } catch (err) {
      // Don't overwrite state if we've been superseded.
      if (!isMounted.current || thisGeneration !== generation.current) return

      setState({ data: null, error: err instanceof Error ? err : new Error(String(err)), status: 'error' })
    }
  }, []) // Empty deps: execute identity is stable. asyncFnRef handles updates.

  const reset = useCallback(() => {
    // Increment generation so any in-flight request is silently discarded.
    generation.current++
    setState({ data: null, error: null, status: 'idle' })
  }, [])

  // "Immediate" mode: run once on mount, no args.
  // We deliberately run this only once — the empty dep array is intentional.
  // The caller controls re-execution by calling execute() themselves.
  useEffect(() => {
    if (immediate) execute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    ...state,
    // Derived booleans for ergonomic usage
    isPending: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError:   state.status === 'error',
    isIdle:    state.status === 'idle',
    execute,
    reset,
  }
}
