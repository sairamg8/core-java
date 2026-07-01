import { useEffect, useRef, useState } from 'react'

/**
 * useDebounce
 *
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of inactivity. Designed for "trailing edge" debounce — the most common case.
 *
 * ─── THE SUBTLETIES MOST IMPLEMENTATIONS MISS ─────────────────────────────
 *
 * 1. TIMER REFERENCE ON UNMOUNT
 *    Most implementations return a cleanup from the useEffect, but don't
 *    account for the case where the component is hot-reloaded or fast-refreshed
 *    mid-timer. This implementation uses a ref to hold the timer ID so that
 *    the cleanup in the effect always cancels the most recent timer — not a
 *    stale closure copy of the ID.
 *
 * 2. DEBOUNCED VALUE INITIAL STATE
 *    The debounced value is initialized to the SAME value as the input, not null.
 *    This prevents the UI from flickering from an "empty" state to the initial
 *    value on the very first render.
 *
 * 3. DELAY CHANGE HANDLING
 *    If delay changes (e.g., user toggles a "slow mode"), the effect re-runs
 *    correctly because delay is in the dependency array. The pending timer is
 *    cleared and a new one starts with the updated delay.
 *
 * 4. WHAT THIS DOES NOT DO (BY DESIGN)
 *    ✗ No "leading edge" debounce (fire immediately, then suppress).
 *       → See useThrottle for leading-edge or maxWait behavior.
 *    ✗ No explicit "cancel" function returned.
 *       → Cleanup happens automatically on unmount or value/delay change.
 *    ✗ No "pending" state (is a timer currently running?).
 *       → You can derive this: debouncedValue !== value means a timer is pending.
 *
 * ─── WHEN TO USE THIS vs. useThrottle ─────────────────────────────────────
 *
 * useDebounce (trailing edge):
 *   "Wait until the user STOPS doing something, then act."
 *   Best for: search input, auto-save, resize-end, form validation.
 *
 * useThrottle (time-bucket rate limiting):
 *   "Act at most once per N milliseconds, even while they're still doing it."
 *   Best for: scroll event handlers, mouse tracking, live character count.
 *
 * @param {T} value - The value to debounce
 * @param {number} delay - Milliseconds to wait after the last change
 * @returns {T} The debounced value
 */
export function useDebounce(value, delay) {
  // Initialize debounced state to the same value — no initial flicker.
  const [debouncedValue, setDebouncedValue] = useState(value)

  // Store timer ID in a ref so cleanup always cancels the right timer,
  // even across hot-reloads and strict-mode double-invocations.
  const timerRef = useRef(null)

  useEffect(() => {
    // Clear any pending timer from the previous effect invocation.
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }

    // Schedule the state update.
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setDebouncedValue(value)
    }, delay)

    // Cleanup: fires when value or delay changes, or on unmount.
    // Ensures no stale timer fires after this effect is cleaned up.
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [value, delay])

  return debouncedValue
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useThrottle
 *
 * Returns a throttled copy of `value` that updates at most once per `limit` ms.
 * Uses "leading edge with cooldown" strategy:
 *   • First update within a window fires IMMEDIATELY.
 *   • Subsequent updates within the same window are suppressed.
 *   • After the window expires, the next update fires immediately again.
 *
 * This feels more responsive than trailing-edge throttle for continuous input.
 *
 * ─── THE SUBTLETY: lastRan vs lastValue ───────────────────────────────────
 *
 * A naive throttle stores lastRan and checks (now - lastRan > limit).
 * The problem: the "last value during the suppressed window" is lost.
 * Example: scroll position goes 100 → 150 → 200 during a 100ms window.
 * Naive: fires at 100, suppresses 150, suppresses 200. Ends at 100.
 * Better: fires at 100 immediately, then 200 fires when the window expires.
 *
 * This is the "trailing call preservation" pattern: always ensure the final
 * value in a burst is eventually applied after the throttle window.
 *
 * @param {T} value
 * @param {number} limit - Minimum ms between updates
 * @returns {T}
 */
export function useThrottle(value, limit) {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastRan = useRef(Date.now())
  const pendingTimer = useRef(null)

  useEffect(() => {
    const now = Date.now()
    const elapsed = now - lastRan.current

    if (elapsed >= limit) {
      // Window has expired — fire immediately.
      if (pendingTimer.current !== null) {
        clearTimeout(pendingTimer.current)
        pendingTimer.current = null
      }
      lastRan.current = now
      setThrottledValue(value)
    } else {
      // Still within window — schedule trailing call to capture the latest value.
      // If another value comes in before this timer fires, we cancel and reschedule.
      if (pendingTimer.current !== null) {
        clearTimeout(pendingTimer.current)
      }
      const remaining = limit - elapsed
      pendingTimer.current = setTimeout(() => {
        lastRan.current = Date.now()
        pendingTimer.current = null
        setThrottledValue(value)
      }, remaining)
    }

    return () => {
      if (pendingTimer.current !== null) {
        clearTimeout(pendingTimer.current)
      }
    }
  }, [value, limit])

  return throttledValue
}
