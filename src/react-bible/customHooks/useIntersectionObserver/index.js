/**
 * useIntersectionObserver
 *
 * Tracks whether a DOM element is intersecting with the viewport
 * (or a specified root element). Wraps the browser's IntersectionObserver API
 * in a React-friendly interface.
 *
 * ─── THE PROBLEM ─────────────────────────────────────────────────────────────
 *
 * The Intersection Observer API is powerful but has a non-trivial setup:
 * creating an observer, attaching it to an element (via ref), and cleaning
 * up on unmount. Without a hook, this results in useEffect boilerplate
 * spread across many components — each with slightly different cleanup logic.
 *
 * More importantly, most hand-rolled implementations have subtle bugs:
 * 1. Observer not disconnected on unmount → memory leak.
 * 2. Observer recreated on every render (not memoized) → performance issue.
 * 3. Not handling element changes (ref pointing to different element after render).
 * 4. No fallback for environments where IntersectionObserver doesn't exist
 *    (old browsers, certain SSR environments, jsdom in tests).
 *
 * ─── DESIGN DECISIONS ────────────────────────────────────────────────────────
 *
 * 1. Returns [ref, entry, isIntersecting] — not just isIntersecting.
 *    The full IntersectionObserverEntry contains: intersectionRatio, boundingClientRect,
 *    isIntersecting, rootBounds, target, time. Exposing only isIntersecting would
 *    make it impossible to implement features that need intersectionRatio.
 *
 * 2. The ref is RETURNED by the hook (not passed in).
 *    This is called the "callback ref" pattern. We need to know when the element
 *    is attached to the DOM, and the cleanest way is to control the ref ourselves.
 *    The alternative (accepting an external ref) creates extra complexity for
 *    the caller and doesn't help if the element is conditional (not always rendered).
 *
 * 3. Options are memoized by the hook if passed as a static object.
 *    PROBLEM: If the caller writes:
 *      useIntersectionObserver({ threshold: 0.5 })  // ← new object every render!
 *    The effect would re-run on every render (new object = new reference).
 *    We serialize the options to a stable key to prevent this.
 *
 * 4. disconnect() on cleanup, not unobserve().
 *    Since each hook instance creates its own observer (not a shared one),
 *    disconnect() is correct and more explicit about releasing all resources.
 *
 * ─── WHAT THIS HOOK DOES NOT DO ──────────────────────────────────────────────
 *
 *  ✗ It does NOT share a single IntersectionObserver across elements.
 *    Creating one observer per hook instance is simpler but less efficient.
 *    For 100+ observed elements on the same page, a shared observer is better.
 *    See: https://developer.chrome.com/blog/intersectionobserver-v2/
 *
 *  ✗ It does NOT debounce intersection events.
 *    For lazy loading, each intersection is significant.
 *    For analytics (track when element was 50% visible for > 1s), you need
 *    a more specialized hook that adds a timer.
 *
 *  ✗ It does NOT support IntersectionObserver v2 (isVisible, delay).
 *    v2 adds visibility tracking (is the element actually visible to the user,
 *    not just in the viewport but covered by another element?).
 *    Support for this requires additional options and more complex entry handling.
 *
 * @param {IntersectionObserverInit} [options]
 * @param {{ triggerOnce?: boolean }} [hookOptions]
 *   triggerOnce: if true, the observer disconnects after the first intersection.
 *                Useful for lazy loading: once the image loads, stop observing.
 * @returns {[
 *   (node: Element | null) => void,  // ref callback — attach to DOM element
 *   IntersectionObserverEntry | null, // latest entry
 *   boolean                           // isIntersecting (convenience)
 * ]}
 */

import { useCallback, useEffect, useRef, useState } from 'react'

export function useIntersectionObserver(options = {}, { triggerOnce = false } = {}) {
  const [entry, setEntry] = useState(null)
  const observerRef = useRef(null)
  const nodeRef = useRef(null)

  // Serialize options to detect changes without deep comparison on every render.
  // JSON.stringify is used because IntersectionObserverInit is a plain object.
  // This prevents the observer from being recreated when the caller passes a
  // new object literal with the same values on every render.
  const { root = null, rootMargin = '0px', threshold = 0 } = options
  const thresholdKey = Array.isArray(threshold) ? threshold.join(',') : threshold

  // The ref callback: called by React when the element mounts, changes, or unmounts.
  // When called with null, the element is being unmounted.
  const ref = useCallback((node) => {
    // Disconnect previous observer (element changed or unmounted)
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    nodeRef.current = node

    if (node === null) return

    // Browser support check — jsdom in tests doesn't implement IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('[useIntersectionObserver] IntersectionObserver is not available in this environment.')
      return
    }

    observerRef.current = new IntersectionObserver(
      ([latestEntry]) => {
        setEntry(latestEntry)

        // triggerOnce: disconnect after first intersection
        if (triggerOnce && latestEntry.isIntersecting) {
          observerRef.current?.disconnect()
          observerRef.current = null
        }
      },
      { root, rootMargin, threshold }
    )

    observerRef.current.observe(node)
  }, [root, rootMargin, thresholdKey, triggerOnce]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount (ref callback handles element changes, but not component unmount)
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
    }
  }, [])

  return [ref, entry, entry?.isIntersecting ?? false]
}
