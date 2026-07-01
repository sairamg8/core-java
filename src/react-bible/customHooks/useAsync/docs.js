/**
 * useAsync — Documentation Object
 *
 * This file is the "living spec" for the useAsync hook.
 * It contains: problem analysis, real-world scenarios, scale analysis,
 * limitations, production improvements, and interview Q&A.
 *
 * This data is consumed by the React Bible UI to render the hook's detail page.
 * It is a pure data file — no React, no JSX, no side effects.
 */

export const useAsyncDocs = {
  name: 'useAsync',
  slug: 'use-async',
  tagline: 'Declarative lifecycle management for any async operation.',
  version: '1.0.0',
  category: 'async',
  complexity: 'intermediate',

  // ─── THE REAL PROBLEM ──────────────────────────────────────────────────────

  problemStatement: {
    summary: `
      Every async UI operation — fetching a user profile, submitting a form,
      uploading a file — requires the exact same ceremony: a loading boolean,
      a data slot, an error slot, and careful sequencing of state updates.
      Developers write this boilerplate hundreds of times across a codebase,
      and they get it slightly wrong every single time in different ways.
    `,

    details: `
      The naive implementation has at least three hidden bugs that only surface in
      production under real usage conditions:

      1. RACE CONDITIONS: User clicks "Search". Request A fires. User types more,
         clicks "Search" again. Request B fires. Request B resolves in 200ms.
         Request A resolves in 800ms (slow server). The component now shows
         stale results from Request A even though Request B was the last intent.

      2. STALE STATE UPDATES: Component unmounts (user navigates away) while
         a request is in-flight. The promise resolves and calls setState on an
         unmounted component. React 18+ makes this a no-op, but it still means
         code keeps running unnecessarily, and it can mask real memory leaks.

      3. LOADING STATE DESYNC: The loading boolean is set to false BEFORE
         data is set (two separate setState calls in older code), causing a
         render where loading=false and data=null simultaneously — triggering
         a flash of the "no data" state.
    `,

    antiPatternCode: `
// ❌ NAIVE — has all 3 bugs described above
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchUser(userId)
      .then(data => {
        // BUG 1: If userId changed and a newer request is in-flight,
        // this older response overwrites the newer data (race condition).
        setUser(data)
        // BUG 3: Two separate updates — React may batch them in React 18
        // but this is undefined behavior you're relying on.
        setLoading(false)
      })
      .catch(err => {
        // BUG 2: Component may have unmounted. 
        // This setState fires on a ghost.
        setError(err)
        setLoading(false)
      })
  }, [userId])

  // Also: no way to trigger this manually, no reset, no status enum.
}
    `,
  },

  // ─── REAL-WORLD USE CASES ──────────────────────────────────────────────────

  realWorldUseCases: [
    {
      id: 'button-triggered-fetch',
      scenario: 'Button-Triggered Fetch',
      description: `
        A "Load More Comments" button. User can click repeatedly. Without the
        generation counter, clicking 3 times in 500ms fires 3 requests — the
        first one to resolve (not necessarily the last) wins and sets data.
      `,
      whenToUse: `
        Any one-shot action the user explicitly triggers: load details,
        refresh data, export report, run a search.
      `,
      code: `
import { useAsync } from '../customHooks/useAsync'

function CommentsSection({ postId }) {
  const {
    data: comments,
    error,
    isPending,
    isSuccess,
    execute: loadComments,
    reset,
  } = useAsync(() => fetchComments(postId))

  return (
    <div>
      {isSuccess && comments.map(c => <Comment key={c.id} {...c} />)}

      {error && (
        <p className="text-red-500">
          Failed to load: {error.message}
          <button onClick={reset}>Try again</button>
        </p>
      )}

      <button
        onClick={() => loadComments()}
        disabled={isPending}
      >
        {isPending ? 'Loading...' : 'Load Comments'}
      </button>
    </div>
  )
}
      `,
    },
    {
      id: 'immediate-load-on-mount',
      scenario: 'Load on Mount (with AbortController)',
      description: `
        A user profile page that fetches data immediately on mount.
        The key difference from a naive useEffect: if the user navigates
        away before the response arrives, the request is actually cancelled
        at the network level — not just ignored.
      `,
      whenToUse: `
        Data required immediately when a page/component appears.
        Use immediate:true only when the fetch has no dynamic args.
        For data that depends on props, call execute() inside a useEffect
        that watches those props.
      `,
      code: `
// The async function receives AbortSignal when you construct it this way.
// useAsync passes through all arguments to asyncFn.
function fetchUserProfile(userId, signal) {
  return fetch(\`/api/users/\${userId}\`, { signal }).then(r => r.json())
}

function UserProfilePage({ userId }) {
  // We want to cancel the request if userId changes or component unmounts.
  const abortRef = useRef(null)

  const { data: user, error, isPending, execute } = useAsync(
    (id) => {
      // Cancel any previous request before starting a new one.
      abortRef.current?.abort()
      abortRef.current = new AbortController()
      return fetchUserProfile(id, abortRef.current.signal)
    }
  )

  // Re-execute when userId changes.
  useEffect(() => {
    execute(userId)
    return () => { abortRef.current?.abort() }
  }, [userId, execute])

  if (isPending) return <Skeleton />
  if (error) return <ErrorState message={error.message} />
  if (!user) return null

  return <UserCard user={user} />
}
      `,
    },
    {
      id: 'form-submission',
      scenario: 'Form Submission with Server Response',
      description: `
        A mutation that returns data. Classic: submit a form, get back a
        created resource. The isPending state drives button disabling and
        spinner rendering without any extra useState.
      `,
      whenToUse: `
        Any create/update/delete action. Note: in 2026 with Server Actions,
        useActionState is often the better primitive for form submissions.
        useAsync shines for programmatic mutations (not form submissions).
      `,
      code: `
function CreateInvoiceForm() {
  const {
    data: createdInvoice,
    error,
    isPending,
    isSuccess,
    execute: createInvoice,
  } = useAsync(invoiceService.create)

  function handleSubmit(formData) {
    createInvoice({
      amount: formData.get('amount'),
      recipient: formData.get('recipient'),
    })
  }

  if (isSuccess) {
    return <SuccessBanner invoiceId={createdInvoice.id} />
  }

  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit(new FormData(e.target)) }}>
      <input name="amount" type="number" />
      <input name="recipient" />
      {error && <p className="text-red-500">{error.message}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Invoice'}
      </button>
    </form>
  )
}
      `,
    },
  ],

  // ─── SCALE & CONDITIONS ANALYSIS ──────────────────────────────────────────

  workingConditions: {
    worksWellWhen: [
      {
        condition: 'Single async operation per component instance',
        why: 'No deduplication concern. One component, one in-flight request at a time.',
        example: 'Profile page, detail view, file export button.',
      },
      {
        condition: 'User explicitly triggers the operation',
        why: 'Manual triggering avoids the "auto-execute when deps change" complexity.',
        example: 'Search button, load more, refresh button.',
      },
      {
        condition: 'No shared state between sibling components',
        why: 'Each component instance has its own state. No cross-component coordination.',
        example: 'Multiple independent file upload components on the same page.',
      },
      {
        condition: 'Short-lived operations (< 30s)',
        why: 'Very long operations need heartbeat/progress tracking, not just a pending state.',
        example: 'API calls, database queries, form submissions.',
      },
    ],

    doesNotWorkWellWhen: [
      {
        condition: 'Same data is needed in multiple components simultaneously',
        problem: `
          Each component instance gets its own state. If ProfileCard and
          ProfileSidebar both use useAsync(fetchUser, { immediate: true }),
          two network requests fire for the same data. There's no shared cache.
        `,
        betterAlternative: 'TanStack Query, SWR, or a React Context-based cache.',
      },
      {
        condition: 'Dependent/sequential queries',
        problem: `
          "Fetch user, then fetch their orders." The second fetch depends on
          the first. Chaining execute() calls with useEffect gets complicated
          and error-prone very quickly.
        `,
        betterAlternative: 'TanStack Query\'s "enabled" option, or a dedicated useAsyncSequence hook.',
      },
      {
        condition: 'Background refresh / stale-while-revalidate',
        problem: `
          "Show cached data immediately, refresh in background, update when done."
          This hook resets to loading=true on every execute() — there's no
          concept of keeping previous data visible while refreshing.
        `,
        betterAlternative: 'TanStack Query (keepPreviousData), SWR (stale-while-revalidate).',
      },
      {
        condition: 'High-frequency execution (> once per second)',
        problem: `
          If execute() can fire 10 times per second (e.g., tied to scroll),
          the generation counter prevents stale data but 10 network requests
          still fire. The hook has no built-in rate limiting.
        `,
        betterAlternative: 'Pair with useDebounce or useThrottle at the call site.',
      },
      {
        condition: 'Optimistic updates',
        problem: `
          This hook has no concept of "show expected result before server confirms."
          It only tracks what the server actually returned.
        `,
        betterAlternative: 'React 19\'s useOptimistic hook + Server Actions, or TanStack Query mutations with onMutate.',
      },
    ],
  },

  // ─── LIMITATIONS ───────────────────────────────────────────────────────────

  limitations: [
    {
      id: 'no-deduplication',
      title: 'No Request Deduplication',
      severity: 'medium',
      description: `
        If execute() is called twice simultaneously with identical arguments,
        two network requests are made. There is no shared request registry to
        detect "this exact request is already in-flight."
      `,
      realWorldImpact: `
        React StrictMode deliberately mounts/unmounts/remounts components in
        development. If you use { immediate: true }, you'll see two requests
        fire in dev. This is harmless in dev but illustrates that the hook
        trusts the caller to not duplicate requests.
      `,
      workaround: `
        1. Wrap asyncFn with a simple in-memory deduplication wrapper (keyed by args).
        2. Move to TanStack Query, which deduplicates by queryKey.
      `,
      exampleWorkaround: `
// Minimal deduplication wrapper (external to the hook)
const inFlight = new Map()

function deduplicated(key, fn) {
  if (inFlight.has(key)) return inFlight.get(key)
  const promise = fn().finally(() => inFlight.delete(key))
  inFlight.set(key, promise)
  return promise
}

// Usage
useAsync(() => deduplicated(\`user-\${userId}\`, () => fetchUser(userId)))
      `,
    },
    {
      id: 'no-cache',
      title: 'No Result Caching',
      severity: 'medium',
      description: `
        Every call to execute() produces a fresh network request regardless
        of whether we already have a result for those arguments. There's no
        "has the answer changed?" check.
      `,
      realWorldImpact: `
        A paginated list where the user navigates back to Page 1 after visiting
        Page 5 triggers a fresh API call for Page 1 data — even if it was
        fetched 3 seconds ago and certainly hasn't changed.
      `,
      workaround: `
        Maintain a Map-based cache at the module level, keyed by the stringified
        arguments. Invalidate by clearing the Map on mutations.
        OR: switch to TanStack Query.
      `,
    },
    {
      id: 'no-retry',
      title: 'No Automatic Retry',
      severity: 'low',
      description: `
        On network failure, execute() sets status to 'error' and stops.
        It does not retry with exponential backoff. This is fine for explicit
        user-triggered actions (the user can retry) but problematic for
        background data loading.
      `,
      workaround: `
        Wrap asyncFn with a retry utility, or use the reset() + execute()
        pattern in an error boundary / error state UI.
      `,
      exampleWorkaround: `
// Simple exponential backoff wrapper
async function withRetry(fn, maxAttempts = 3) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxAttempts - 1) throw err
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
    }
  }
}

useAsync(() => withRetry(() => fetchUser(userId)))
      `,
    },
    {
      id: 'no-network-cancel',
      title: 'No Network-Level Cancellation',
      severity: 'low',
      description: `
        The race condition guard (generation counter) prevents stale data from
        setting state — but the network request itself still completes.
        On a mobile device with metered data, a superseded request wastes
        bandwidth even though React discards the result.
      `,
      realWorldImpact: `
        Rapid-fire search: user types 10 characters, triggering 10 requests.
        9 are superseded by the generation counter. But all 10 still hit
        the server and consume bandwidth. On high-traffic servers, this
        contributes to unnecessary load.
      `,
      workaround: `
        Pass an AbortSignal into asyncFn and call abort() on the previous
        controller before calling execute() again. See the usage example above.
        For convenience, consider using useAsyncWithAbort (a wrapper hook).
      `,
    },
    {
      id: 'no-previous-data',
      title: 'No "Previous Data" Preservation',
      severity: 'low',
      description: `
        When execute() is called again, state resets to { data: null, status: 'loading' }.
        Previous data is lost. This causes the UI to show an empty loading state
        instead of the previous result while refreshing — a visible flicker.
      `,
      workaround: `
        Track previousData in a ref before calling execute(), and use it as
        a fallback during the loading phase. Or use TanStack Query's
        placeholderData / keepPreviousData options.
      `,
      exampleWorkaround: `
function useAsyncWithPreviousData(asyncFn, options) {
  const async = useAsync(asyncFn, options)
  const previousData = useRef(null)

  if (async.data !== null) {
    previousData.current = async.data
  }

  return {
    ...async,
    // During loading, fall back to last known good data
    displayData: async.data ?? previousData.current,
  }
}
      `,
    },
  ],

  // ─── PRODUCTION IMPROVEMENTS ───────────────────────────────────────────────

  productionImprovements: [
    {
      id: 'abort-controller-support',
      title: 'Built-in AbortController Lifecycle',
      priority: 'high',
      description: `
        Instead of asking callers to manage AbortController externally, the hook
        should create a new AbortController on each execute() call, pass its signal
        to asyncFn, and call abort() on cleanup (unmount or new execute()).
      `,
      tradeoff: `
        This requires changing asyncFn's signature to accept (signal, ...args),
        which is a breaking change. Alternatively, asyncFn can be a factory:
        (abortController) => (...args) => Promise<T>.
      `,
      code: `
// Production version with AbortController
function useAsyncWithAbort(asyncFn, options) {
  const controllerRef = useRef(null)

  const wrappedFn = useCallback((...args) => {
    controllerRef.current?.abort('superseded')
    controllerRef.current = new AbortController()
    return asyncFn(controllerRef.current.signal, ...args)
  }, [asyncFn])

  useEffect(() => {
    return () => controllerRef.current?.abort('unmount')
  }, [])

  return useAsync(wrappedFn, options)
}
      `,
    },
    {
      id: 'error-normalization',
      title: 'Error Normalization',
      priority: 'medium',
      description: `
        In production, errors come from many sources: fetch failures (TypeError),
        HTTP errors (Response not ok), API errors (structured JSON error bodies),
        and unexpected exceptions. Each has a different shape. The hook should
        normalize these into a consistent Error shape with code, message, and status.
      `,
      code: `
async function normalizedFetch(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const err = new Error(body.message || \`HTTP \${response.status}\`)
    err.code = body.code || 'HTTP_ERROR'
    err.status = response.status
    err.body = body
    throw err
  }
  return response.json()
}
      `,
    },
    {
      id: 'request-tracing',
      title: 'Correlation ID / Request Tracing',
      priority: 'medium',
      description: `
        In production, you want to correlate UI errors with backend traces.
        The hook can generate a UUID for each execute() call and attach it
        as a request header. When the user reports an error, you have the
        correlation ID to look up the exact server trace.
      `,
    },
    {
      id: 'loading-delay-threshold',
      title: 'Loading Spinner Delay Threshold',
      priority: 'low',
      description: `
        Showing a spinner immediately on every click causes "spinner flashing"
        for fast operations (< 100ms). In production, delay showing the loading
        state by 150-200ms. If the operation completes before the delay, the
        user never sees a spinner at all.
      `,
      code: `
// Add a minimum loading display time
const [showLoading, setShowLoading] = useState(false)
const LOADING_THRESHOLD_MS = 150

useEffect(() => {
  if (!isPending) { setShowLoading(false); return }
  const t = setTimeout(() => setShowLoading(true), LOADING_THRESHOLD_MS)
  return () => clearTimeout(t)
}, [isPending])

// Use showLoading instead of isPending to drive spinner visibility
      `,
    },
  ],

  // ─── WHEN TO USE SOMETHING ELSE ───────────────────────────────────────────

  alternatives: [
    {
      name: 'TanStack Query (React Query)',
      when: 'You need caching, background refresh, deduplication, pagination, and prefetching.',
      tradeoffs: 'Larger dependency (~45KB), more configuration, learning curve. Worth it at scale.',
      threshold: 'Use when you have 3+ async data sources or need stale-while-revalidate.',
    },
    {
      name: 'SWR',
      when: 'Simpler alternative to TanStack Query, great for GET requests with cache.',
      tradeoffs: 'Less feature-rich than TanStack Query but smaller bundle.',
      threshold: 'Use when TanStack Query feels like overkill but useAsync feels too basic.',
    },
    {
      name: "React 19's useActionState",
      when: 'The async operation is triggered by a form submission and you want progressive enhancement.',
      tradeoffs: 'Coupled to forms. Not suitable for programmatic mutations.',
      threshold: 'Use for any <form action={...}> pattern in React 19+.',
    },
    {
      name: "React 19's use() + Suspense",
      when: 'Data must be ready before the component renders (blocking fetch).',
      tradeoffs: 'Promise must be created outside the component. Requires Suspense boundary.',
      threshold: 'Use when you want "show nothing until data is ready" semantics.',
    },
  ],

  // ─── INTERVIEW Q&A ────────────────────────────────────────────────────────

  interviewQA: [
    {
      question: 'What is a race condition in the context of React async operations, and how do you prevent it?',
      answer: `
        A race condition occurs when multiple async operations are in-flight simultaneously
        and the results arrive in a different order than they were initiated.

        Example: User types "apple", request A fires. User types "apples", request B fires.
        Request B resolves in 100ms (cache hit). Request A resolves in 500ms (slow network).
        Without a guard, request A's stale results overwrite request B's correct results.

        Prevention: Use a monotonically increasing "generation" counter. Each execute() call
        increments the counter and captures its value. When the promise resolves, it checks
        if its captured generation equals the current counter. If not, a newer request
        has superseded it — the result is silently discarded.

        This is the pattern used in useAsync above. Libraries like TanStack Query use
        a similar mechanism internally.
      `,
      followUp: 'Does aborting the request help with race conditions?',
      followUpAnswer: `
        Aborting helps at the NETWORK level — it tells the browser to cancel the TCP
        connection, saving bandwidth. But aborting is not required to fix the race condition
        at the STATE level. The generation counter approach fixes the state race without
        aborting the network request. They solve different problems.
        In production, you want both: abort for efficiency, generation counter for correctness.
      `,
    },
    {
      question: 'Why do we use a ref for the generation counter instead of state?',
      answer: `
        Because incrementing state triggers a re-render, which is not what we want.
        The generation counter is purely an internal coordination mechanism — the UI
        should never directly render based on its value. Refs are exactly the right
        tool for values that need to persist across renders but don't drive UI.

        If we used state: const [gen, setGen] = useState(0)
        Then each execute() call would trigger two re-renders: one for gen changing,
        one for status changing. With a ref, only the state change (status) triggers
        the re-render.
      `,
    },
    {
      question: `
        Why does useAsync use an empty dependency array for the execute callback,
        but still picks up the latest version of asyncFn?
      `,
      answer: `
        This is the "ref trick" for stable callbacks with fresh values.

        If execute depended on asyncFn directly, its identity would change every time
        asyncFn's identity changes — which could cause infinite loops in useEffect
        dependency arrays that include execute.

        Instead, we store asyncFn in a ref (asyncFnRef) and keep execute's deps empty.
        Inside execute, we call asyncFnRef.current() — which always points to the latest
        asyncFn even though execute's identity never changes.

        This is the same pattern used by React's useEvent proposal (now built into the
        React compiler's automatic memoization).
      `,
    },
    {
      question: 'What is the difference between this hook and TanStack Query?',
      answer: `
        useAsync is a low-level lifecycle primitive. TanStack Query is a full
        server-state management library. Key differences:

        useAsync:
        • Manages ONE operation's lifecycle (loading/data/error)
        • No cache — every execute() hits the network
        • No deduplication — multiple callers = multiple requests
        • No background refresh
        • ~80 lines of code, zero dependencies

        TanStack Query:
        • Shared cache across all components using the same queryKey
        • Request deduplication — 10 components, 1 network request
        • Background refetch when window refocuses
        • Stale-while-revalidate semantics
        • Pagination, infinite queries, prefetching
        • ~45KB dependency

        Use useAsync when: one-off operations, mutations, or when you explicitly
        don't want caching.
        Use TanStack Query when: shared data, background refresh, or stale-while-revalidate.
      `,
    },
    {
      question: 'What happens if the component unmounts while an async operation is in flight?',
      answer: `
        In useAsync, an isMounted ref is set to false in the cleanup function
        of a useEffect that runs once on mount. When the promise resolves or rejects,
        it checks isMounted.current before calling setState. If false, it returns early.

        In React 18+, calling setState on an unmounted component is a no-op
        (it used to throw a warning). So the isMounted check is not strictly
        necessary for correctness, but it IS still valuable because:

        1. It makes the intent explicit — future developers reading the code
           understand that unmount-after-inflight is a considered case.
        2. It prevents unnecessary work — the setState + re-render cycle
           doesn't happen at all, not just "runs but has no effect."
        3. It guards against future React versions changing this behavior.

        The network request still completes (uses bandwidth). For true cancellation,
        you need AbortController passed into asyncFn.
      `,
    },
  ],

  // ─── CHAPTER SUMMARY ──────────────────────────────────────────────────────

  summary: `
    useAsync solves the "async ceremony" problem — the repetitive loading/data/error
    state that every async UI operation requires. It correctly handles race conditions
    via a generation counter and prevents stale state updates after unmount.

    It is NOT a replacement for TanStack Query or SWR. It fills the gap between
    "three useState calls in a component" and "full server-state management."

    Use it for: explicit user-triggered operations, one-off mutations, and any
    async operation where you don't need caching or deduplication.

    Before shipping to production: add AbortController support, error normalization,
    and consider whether a loading delay threshold improves perceived performance.
  `,
}
