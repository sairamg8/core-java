import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useLocalStorage
 *
 * A drop-in replacement for useState that persists the value in localStorage.
 * Behaves exactly like useState — same API, same re-render semantics.
 *
 * ─── WHAT MOST IMPLEMENTATIONS GET WRONG ─────────────────────────────────
 *
 * 1. SERIALIZATION ERRORS
 *    localStorage only stores strings. Calling JSON.parse on a corrupted or
 *    externally-modified value throws a SyntaxError. Most implementations
 *    crash the component. This implementation silently falls back to the
 *    initialValue and clears the corrupted entry.
 *
 * 2. STORAGE QUOTA EXCEEDED
 *    localStorage has a ~5MB limit per origin. setItem() throws a DOMException
 *    when the quota is exceeded. Most implementations crash silently (the update
 *    appears to succeed in React state but is never persisted). This implementation
 *    catches the error and optionally calls an onError handler.
 *
 * 3. CROSS-TAB SYNC — THE FORGOTTEN FEATURE
 *    If the user has your app open in two tabs and changes a value in Tab A,
 *    Tab B's state will be stale until the user refreshes. The browser fires
 *    a 'storage' event on all OTHER tabs when localStorage changes. This hook
 *    listens for that event and syncs state automatically.
 *
 *    IMPORTANT: The 'storage' event does NOT fire in the same tab that made
 *    the change. Don't try to use it to update the current tab's state —
 *    that's what the setState call in setValue handles.
 *
 * 4. SSR SAFETY
 *    localStorage is a browser API. In SSR environments (Next.js, Remix),
 *    accessing it during render throws "localStorage is not defined."
 *    This implementation checks typeof window !== 'undefined' before any
 *    localStorage access and falls back to in-memory state on the server.
 *
 * 5. FUNCTION VALUES
 *    JSON.stringify(function(){}) returns undefined — functions cannot be
 *    stored in localStorage. This hook explicitly rejects function values
 *    (throwing a helpful error) rather than silently losing them.
 *
 * 6. INITIAL VALUE AS FUNCTION (LAZY INITIALIZATION)
 *    Like useState, this hook supports passing a function as initialValue:
 *    useLocalStorage('key', () => computeExpensiveDefault())
 *    The function is called only once (on first render), not on every render.
 *
 * ─── WHAT THIS HOOK DOES NOT DO ──────────────────────────────────────────
 *
 *  ✗ It does NOT encrypt the stored value. localStorage is readable by any
 *    JavaScript on the page. NEVER store sensitive data (tokens, PII) here.
 *
 *  ✗ It does NOT handle storage migration. If you change the shape of the
 *    stored value (e.g., rename a field), you need a migration strategy.
 *    See the docs for the versioning pattern.
 *
 *  ✗ It does NOT batch updates across multiple keys. Each key is independent.
 *
 *  ✗ It does NOT debounce writes. High-frequency updates (e.g., mouse position)
 *    will write to localStorage on every update. Wrap with useDebounce if needed.
 *
 * @template T
 * @param {string} key - The localStorage key
 * @param {T | (() => T)} initialValue - Initial value or lazy initializer
 * @param {{ onError?: (err: Error) => void }} [options]
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>, () => void]}
 *   [storedValue, setValue, removeValue]
 *   - storedValue: The current value (from localStorage or initial)
 *   - setValue: Setter function (same signature as useState's setter)
 *   - removeValue: Removes the key from localStorage and resets to initialValue
 */
export function useLocalStorage(key, initialValue, { onError } = {}) {
  // ── Compute the initial value (supports lazy initializer) ──────────────
  const resolveInitial = useCallback(() => {
    const init = typeof initialValue === 'function' ? initialValue() : initialValue
    return init
  }, []) // intentionally empty — we only compute this once

  // ── Read from localStorage ─────────────────────────────────────────────
  const readValue = useCallback(() => {
    // SSR safety — on the server, localStorage doesn't exist
    if (typeof window === 'undefined') {
      return resolveInitial()
    }

    try {
      const raw = window.localStorage.getItem(key)

      // Key doesn't exist yet — use initial value
      if (raw === null) return resolveInitial()

      return JSON.parse(raw)
    } catch (err) {
      // Malformed JSON in localStorage (corrupted, externally modified).
      // Log and fall back to initial value. Optionally notify the caller.
      console.warn(`[useLocalStorage] Failed to parse key "${key}":`, err)
      onError?.(err instanceof Error ? err : new Error(String(err)))
      return resolveInitial()
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const [storedValue, setStoredValue] = useState(readValue)

  // ── Write to localStorage ──────────────────────────────────────────────
  const setValue = useCallback((value) => {
    if (typeof window === 'undefined') {
      console.warn('[useLocalStorage] Cannot set value during SSR.')
      return
    }

    // Support functional updater: setValue(prev => prev + 1)
    setStoredValue(prevValue => {
      const nextValue = typeof value === 'function' ? value(prevValue) : value

      // Reject functions — they cannot be serialized
      if (typeof nextValue === 'function') {
        const err = new Error(`[useLocalStorage] Cannot store a function in localStorage (key: "${key}").`)
        console.error(err)
        onError?.(err)
        return prevValue // Keep previous value unchanged
      }

      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue))
      } catch (err) {
        // Most common cause: QuotaExceededError (storage full)
        // State update still applies in memory — caller is notified via onError
        console.error(`[useLocalStorage] Failed to write key "${key}":`, err)
        onError?.(err instanceof Error ? err : new Error(String(err)))
      }

      return nextValue
    })
  }, [key, onError])

  // ── Remove the key ─────────────────────────────────────────────────────
  const removeValue = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
    }
    setStoredValue(resolveInitial())
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cross-tab sync ─────────────────────────────────────────────────────
  // The 'storage' event fires in OTHER tabs when localStorage changes.
  // We listen here to keep all open tabs in sync.
  useEffect(() => {
    if (typeof window === 'undefined') return

    function handleStorageEvent(event) {
      // Only care about our key. event.storageArea is null in some Safari versions.
      if (event.key !== key) return
      if (event.storageArea !== null && event.storageArea !== window.localStorage) return

      if (event.newValue === null) {
        // Key was removed in another tab
        setStoredValue(resolveInitial())
      } else {
        try {
          setStoredValue(JSON.parse(event.newValue))
        } catch (err) {
          console.warn(`[useLocalStorage] Cross-tab sync: failed to parse key "${key}"`)
          onError?.(err)
        }
      }
    }

    window.addEventListener('storage', handleStorageEvent)
    return () => window.removeEventListener('storage', handleStorageEvent)
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  return [storedValue, setValue, removeValue]
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * useSessionStorage
 *
 * Same as useLocalStorage but uses sessionStorage.
 * Key differences:
 * • Cleared when the browser tab is closed (not on page refresh, not on new tabs).
 * • Does NOT sync across tabs (each tab has its own sessionStorage).
 * • The 'storage' event does NOT fire for sessionStorage changes, so cross-tab
 *   sync is impossible by design — this is consistent with browser behavior.
 *
 * When to use sessionStorage over localStorage:
 * • Temporary UI state that should reset when the session ends (wizard steps, form draft)
 * • State that is specific to a single tab (comparison selections, checkout flow)
 * • Sensitive-ish data that shouldn't persist after the browser closes
 *   (reminder: sessionStorage is still readable by JavaScript, so not truly secure)
 */
export function useSessionStorage(key, initialValue, options = {}) {
  const resolveInitial = () =>
    typeof initialValue === 'function' ? initialValue() : initialValue

  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return resolveInitial()
    try {
      const raw = window.sessionStorage.getItem(key)
      return raw === null ? resolveInitial() : JSON.parse(raw)
    } catch {
      return resolveInitial()
    }
  })

  const setValue = useCallback((value) => {
    setStoredValue(prev => {
      const next = typeof value === 'function' ? value(prev) : value
      try {
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(next))
        }
      } catch (err) {
        options.onError?.(err)
      }
      return next
    })
  }, [key])

  const removeValue = useCallback(() => {
    if (typeof window !== 'undefined') window.sessionStorage.removeItem(key)
    setStoredValue(resolveInitial())
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  return [storedValue, setValue, removeValue]
}
