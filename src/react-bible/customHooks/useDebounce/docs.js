/**
 * useDebounce & useThrottle — Documentation Object
 *
 * These two hooks are bundled together because they solve the same family
 * of problem (rate-limiting side effects to user input) but with fundamentally
 * different semantics. Understanding when to use each is as important as
 * knowing how to implement them.
 */

export const useDebounceDocs = {
  name: 'useDebounce',
  slug: 'use-debounce',
  tagline: 'Silence rapid-fire value changes until the user pauses.',
  version: '1.0.0',
  category: 'performance',
  complexity: 'beginner-intermediate',

  // ─── THE REAL PROBLEM ────────────────────────────────────────────────────

  problemStatement: {
    summary: `
      Input events fire fast. A user typing "product search" at 60wpm produces
      roughly 14 keystrokes in under one second. If each keystroke triggers an
      API call, you've fired 14 network requests to show results for a query
      the user never finished typing.

      At scale: 10,000 concurrent users searching = 140,000 unnecessary requests
      per second from search inputs alone. This is a common reason search APIs
      fall over under load — not because queries are expensive, but because
      keystroke rate isn't controlled.
    `,

    details: `
      The problem has two layers:

      Layer 1 — Network: Too many API calls. Even if the server handles them,
      each round-trip adds latency. Results for "p", "pr", "pro"... arrive
      asynchronously. Without careful handling, they overwrite each other (race
      condition — see useAsync docs).

      Layer 2 — CPU: Each keystroke triggers a state update and re-render.
      If the component does heavy computation on the input value (filtering a
      10,000-row local list, for example), 14 re-renders per second will cause
      visible jank on mid-tier devices.

      The fix for both: don't process the value on every keystroke. Wait until
      the user pauses — that's debouncing.
    `,

    antiPatternCode: `
// ❌ NAIVE — fires API call on every single keystroke
function SearchBox() {
  const [query, setQuery] = useState('')

  function handleChange(e) {
    setQuery(e.target.value)
    // This fires on EVERY keystroke. "apple" = 5 API calls.
    searchAPI(e.target.value).then(results => setResults(results))
  }

  return <input value={query} onChange={handleChange} />
}

// ❌ ALSO NAIVE — useEffect + setTimeout without proper cleanup
// Has stale timer issues in strict mode and fast-refresh:
function SearchBox() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer) // OK but...
    // BUG: In React StrictMode, this effect runs twice. The cleanup
    // from the first run cancels the first timer. The second timer fires.
    // This is actually fine — StrictMode is testing that cleanup works.
    // But if you're storing the timer ID in a local variable inside the effect
    // (not a ref), and the component hot-reloads, the reference is lost.
  }, [query])
}
    `,
  },

  // ─── REAL-WORLD SCENARIOS ────────────────────────────────────────────────

  realWorldUseCases: [
    {
      id: 'search-as-you-type',
      scenario: 'Search as You Type (the canonical case)',
      description: `
        The most common use. User types in a search box. We want to show results
        as they type, but not hammer the API with every keystroke.

        The right delay depends on product UX:
        • 150ms: Feels instant, good for local/in-memory filtering
        • 300ms: The sweet spot for most API-backed searches
        • 500ms: For expensive queries (full-text search, ML ranking)

        Longer than 500ms feels sluggish. Shorter than 150ms for API calls
        usually defeats the purpose (fast typists outrun the debounce).
      `,
      scaleAnalysis: `
        At 10,000 concurrent users typing at 60wpm:
        • Without debounce: ~140,000 API calls/second
        • With 300ms debounce: ~500 API calls/second (only on "pause")
        • Reduction: 99.6%

        This is why search debouncing is not optional — it's infrastructure.
      `,
      code: `
import { useState } from 'react'
import { useAsync } from '../useAsync'
import { useDebounce } from '../useDebounce'

function ProductSearch() {
  const [query, setQuery] = useState('')
  // debouncedQuery only updates after user stops typing for 300ms
  const debouncedQuery = useDebounce(query, 300)

  const { data: results, isPending } = useAsync(
    () => searchProducts(debouncedQuery),
    // Execute automatically when debouncedQuery changes.
    // Note: useAsync doesn't natively support this — we use a useEffect below.
  )

  // Use a separate useEffect to trigger the async operation.
  // This pattern keeps useAsync and useDebounce each doing one thing.
  useEffect(() => {
    if (debouncedQuery.length > 1) {
      execute(debouncedQuery)
    }
  }, [debouncedQuery])

  return (
    <div>
      {/* Controlled input uses raw query for instant visual feedback */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products..."
      />

      {/* Pending indicator: true while debouncedQuery !== query OR while loading */}
      {(query !== debouncedQuery || isPending) && (
        <Spinner />
      )}

      {results?.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
      `,
    },
    {
      id: 'autosave',
      scenario: 'Auto-Save in an Editor',
      description: `
        A document editor that saves automatically. Without debounce, every
        character change triggers a save request. With debounce set to 1000–2000ms,
        saves happen only when the user pauses typing.

        Critical difference from search: here, we also want to save when the
        user navigates away (page hide/beforeunload). The debounce timer might
        be pending — we need to flush it immediately on these events.
      `,
      code: `
function DocumentEditor({ docId }) {
  const [content, setContent] = useState('')
  const debouncedContent = useDebounce(content, 1500)
  const { execute: save } = useAsync(saveDocument)

  // Save when debounced content changes (i.e., after user pauses)
  useEffect(() => {
    if (debouncedContent) save(docId, debouncedContent)
  }, [debouncedContent, docId])

  // IMPORTANT: Force-save immediately when user navigates away.
  // The debounce timer may be pending — we don't want to lose data.
  useEffect(() => {
    function handleBeforeUnload() {
      // Bypass debounce — save immediately with current content.
      // Note: this must be synchronous (fetch + keepalive or navigator.sendBeacon)
      navigator.sendBeacon('/api/save', JSON.stringify({ docId, content }))
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [docId, content]) // content, not debouncedContent — we want the latest

  return <textarea value={content} onChange={e => setContent(e.target.value)} />
}
      `,
      gotcha: `
        This is a limitation of useDebounce: there's no "flush" API.
        When you need to flush the pending value (e.g., on navigation), you have
        to maintain a separate reference to the raw value and call the action
        with it directly. A more complete implementation would return a flush()
        function alongside the debounced value.
      `,
    },
    {
      id: 'window-resize',
      scenario: 'Window Resize Handler (use Throttle, not Debounce)',
      description: `
        Resize events fire dozens of times per second. For layout updates that
        depend on window size (responsive charts, dynamic grid calculations),
        you want updates while resizing is happening — not just after it stops.
        This is a throttle use case, not debounce.

        With 100ms throttle: at 60 resize events/sec, you process 10 instead of 60.
        The chart stays responsive without being redrawn 60 times per second.
      `,
      code: `
import { useThrottle } from '../useDebounce'

function ResponsiveChart({ data }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const throttledWidth = useThrottle(windowWidth, 100)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Chart only re-renders at most 10 times/second instead of 60
  // The trailing call preservation in useThrottle ensures the final
  // size is always applied — no "stuck at wrong size" bugs.
  return <Chart data={data} width={throttledWidth} />
}
      `,
    },
  ],

  // ─── SCALE & CONDITIONS ──────────────────────────────────────────────────

  workingConditions: {
    worksWellWhen: [
      {
        condition: 'Single input → single derived action',
        why: 'One debounced value, one effect. Clean, predictable.',
        example: 'Search query → API call. Form field → validation.',
      },
      {
        condition: 'Delay is relatively stable',
        why: 'Changing delay cancels and restarts the timer, which is correct but intentional.',
        example: 'Static 300ms delay set at component definition time.',
      },
      {
        condition: 'You can tolerate the maximum delay before action',
        why: 'Debounce always adds latency equal to the delay. Fast-typing users wait 300ms after their last character.',
        example: 'Background operations where perceived speed is not critical.',
      },
    ],

    doesNotWorkWellWhen: [
      {
        condition: 'You need to flush the pending value imperatively',
        problem: `
          On form submit, you want the latest value immediately — not after 300ms.
          useDebounce has no flush() API. You'd need to track the raw value
          separately and bypass the debounced value on submit.
        `,
        betterAlternative: `
          Use a library like lodash.debounce which has a .flush() method,
          or implement a useDebounceWithFlush variant.
        `,
      },
      {
        condition: 'You need leading-edge debounce (fire immediately, then suppress)',
        problem: `
          Sometimes you want instant response on the FIRST keystroke, then suppress
          until the user stops. Useful for "click to toggle with rapid clicking protection."
          useDebounce is purely trailing-edge.
        `,
        betterAlternative: `
          Implement a useDebounce with a leading option:
          useDebounce(value, delay, { leading: true })
        `,
      },
      {
        condition: 'Input value changes for reasons other than user typing',
        problem: `
          If the value prop is driven by external state (e.g., a reset button sets it
          to empty), the debounce timer will fire with the new value after the delay —
          which might trigger an unnecessary API call with an empty string.
        `,
        betterAlternative: `
          Check the value before acting: if (debouncedQuery.trim()) execute(debouncedQuery)
        `,
      },
    ],
  },

  // ─── LIMITATIONS ─────────────────────────────────────────────────────────

  limitations: [
    {
      id: 'no-flush',
      title: 'No Flush / Cancel API',
      severity: 'medium',
      description: `
        The hook returns only the debounced value. You cannot imperatively
        flush the pending timer (force the debounced value to update immediately)
        or cancel it (discard the pending timer without applying the value).

        This matters for:
        • Form submit: user submits while timer is pending → stale debounced value used
        • Navigation: user navigates away → pending action might fire on the next page
        • Test environments: tests run synchronously and debounce timers may not fire
      `,
      workaround: `
        In forms: track the raw input value separately. On submit, use the raw value.
        In tests: use jest.useFakeTimers() and jest.runAllTimers() to flush debounce.
        For cancel: the effect cleanup handles it automatically on unmount.
      `,
    },
    {
      id: 'adds-latency',
      title: 'Guaranteed Minimum Latency',
      severity: 'low-medium',
      description: `
        Every debounce adds a minimum of delay milliseconds to the perceived
        response time. For a 300ms debounce, even after the user finishes typing,
        they wait up to 300ms more before results appear.

        This is the fundamental tradeoff: fewer API calls vs. more perceived latency.
        At 200ms+, users can notice the wait. Under 150ms, it feels instant.
      `,
      workaround: `
        1. Use useTransition + useDeferredValue for LOCAL computation (not API calls).
           These let React work on the update concurrently without blocking the UI.
        2. Show a loading indicator as soon as query !== debouncedQuery.
           This tells the user "we got your input, results coming."
        3. Combine with optimistic results: show previous results while waiting.
      `,
    },
    {
      id: 'delay-granularity',
      title: 'Fixed Delay — No Adaptive Behavior',
      severity: 'low',
      description: `
        The hook uses a single fixed delay. In reality, optimal debounce delay
        depends on:
        • Network speed: slow 3G might need 500ms (requests are slow anyway)
        • Input type: mobile keyboard users type slower → shorter delay ok
        • Query complexity: autocomplete needs 150ms, full-text search needs 300ms

        useDebounce has no knowledge of these factors.
      `,
      workaround: `
        Dynamically compute the delay based on network conditions:
        const delay = navigator.connection?.effectiveType === '4g' ? 200 : 500

        Or use the Network Information API to adapt in real-time.
      `,
    },
  ],

  // ─── PRODUCTION IMPROVEMENTS ─────────────────────────────────────────────

  productionImprovements: [
    {
      id: 'flush-cancel',
      title: 'Return flush() and cancel() Functions',
      priority: 'high',
      description: `
        The production version should return { debouncedValue, flush, cancel }.
        flush() immediately applies the pending value and clears the timer.
        cancel() clears the timer without applying the pending value.
      `,
      code: `
// Enhanced version with flush/cancel
function useDebounceWithControl(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timerRef = useRef(null)
  const pendingValue = useRef(value)

  // Track the latest value to flush
  useEffect(() => { pendingValue.current = value })

  const flush = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setDebouncedValue(pendingValue.current)
  }, [])

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setDebouncedValue(value)
    }, delay)
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [value, delay])

  return { debouncedValue, flush, cancel }
}
      `,
    },
    {
      id: 'pending-indicator',
      title: 'Expose isPending',
      priority: 'medium',
      description: `
        isPending = (rawValue !== debouncedValue) tells the caller that
        a timer is active. This is useful for showing a spinner or typing indicator
        BEFORE the debounce fires — giving immediate feedback to users.
      `,
      code: `
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  // ... (same implementation)
  const isPending = value !== debouncedValue
  return { debouncedValue, isPending }
}
      `,
    },
  ],

  // ─── DEBOUNCE vs THROTTLE DECISION GUIDE ─────────────────────────────────

  decisionGuide: {
    title: 'When to Use useDebounce vs useThrottle',
    table: [
      {
        question: 'When should the action fire?',
        debounce: 'After the user STOPS for delay ms',
        throttle: 'At most once per limit ms, WHILE user is active',
      },
      {
        question: 'What if the user keeps going?',
        debounce: 'Keep waiting. Timer resets on every change.',
        throttle: 'Fire periodically regardless.',
      },
      {
        question: 'Best for',
        debounce: 'Search, auto-save, form validation, address lookup',
        throttle: 'Scroll handlers, resize, mouse tracking, game input',
      },
      {
        question: 'User experience',
        debounce: 'No results until they pause. Can feel slow.',
        throttle: 'Live updates while interacting. Always responsive.',
      },
      {
        question: 'Final value guaranteed?',
        debounce: 'Yes — last value is always applied (when user stops)',
        throttle: 'Only with trailing call preservation (our implementation)',
      },
    ],
  },

  // ─── INTERVIEW Q&A ───────────────────────────────────────────────────────

  interviewQA: [
    {
      question: `
        What is the difference between debouncing and throttling?
        Give a real-world scenario where you'd choose each.
      `,
      answer: `
        Debouncing: "Wait until the user stops, then act once."
        The timer resets on every change. Only the final state after a pause matters.

        Throttling: "Act at most once per N milliseconds, even while user is active."
        The timer doesn't reset — it fires on a fixed cadence.

        Real scenarios:
        • Search as you type → DEBOUNCE. We want results for the finished query,
          not every intermediate character. 
        • Scroll-based analytics → THROTTLE. We want to track scroll position
          continuously but don't need 60 events per second.
        • Auto-save editor → DEBOUNCE. Save after the user pauses, not mid-sentence.
        • Infinite scroll trigger → THROTTLE. Check "am I near the bottom?" 
          at most 5 times per second while scrolling.
      `,
    },
    {
      question: `
        A common useDebounce implementation stores the timer ID in a local variable
        inside useEffect. Why is storing it in a ref safer?
      `,
      answer: `
        A local variable inside a useEffect creates a new variable scope per
        effect invocation. If React's strict mode runs the effect twice (for
        development mount/unmount testing), or if the component hot-reloads
        during development, the first invocation's cleanup function has a closure
        over the OLD timer ID — not the new one created by the second invocation.

        A ref persists across effect invocations and component renders. The cleanup
        function always reads timerRef.current, which is guaranteed to be the LATEST
        timer ID regardless of how many times the effect has run. This makes the
        cleanup reliably cancel the right timer every time.
      `,
    },
    {
      question: `
        How would you implement a search component that shows previous results
        while waiting for new ones (instead of showing a loading spinner)?
      `,
      answer: `
        This is the "stale-while-revalidate" pattern for search. The approach:

        1. Keep the PREVIOUS successful results in state even when a new query fires.
        2. Show a subtle "refreshing" indicator instead of hiding results.
        3. When new results arrive, replace the stale ones.

        Implementation:
        const { data: freshResults, isPending } = useAsync(search)
        const [displayResults, setDisplayResults] = useState([])

        useEffect(() => {
          if (freshResults) setDisplayResults(freshResults)
        }, [freshResults])

        // displayResults shows previous data during loading.
        // isPending drives a subtle spinner, not a full loading state.

        Alternatively: use TanStack Query with placeholderData: keepPreviousData,
        which handles this pattern natively.
      `,
    },
    {
      question: `
        What happens to a pending debounce timer if the user submits a form?
        How do you ensure the latest value is used?
      `,
      answer: `
        The pending debounce timer fires delay ms AFTER the submit, by which
        point the component may have already submitted stale data.

        The solution is to NOT use debouncedValue on submit. Instead:
        1. Track the raw input value in state (for display).
        2. Use debouncedValue only for triggering the async search operation.
        3. On form submit, read the raw input value directly.

        This way, the debounce only drives the search — not the actual form data.
        The form always submits whatever the user has actually typed.

        For imperative flush: the enhanced useDebounceWithControl hook returns
        flush(), which immediately applies the pending value and cancels the timer.
        Call flush() in the form's onSubmit handler before reading debouncedValue.
      `,
    },
  ],

  summary: `
    useDebounce is deceptively simple. The naive version (setTimeout in useEffect)
    works in most cases but has subtle failures in StrictMode, hot-reload scenarios,
    and whenever you need to flush the pending value imperatively.

    The production version should:
    1. Store timer ID in a ref (not local variable) for reliable cleanup.
    2. Return flush() and cancel() for imperative control.
    3. Expose isPending (rawValue !== debouncedValue) for immediate user feedback.
    4. Initialize debouncedValue to the same as value to prevent initial flicker.

    Critical design insight: debounce and throttle are different tools for the
    same family of problem. Choosing the wrong one produces a UI that either
    feels sluggish (wrong debounce) or fires too many operations (wrong throttle).
  `,
}
