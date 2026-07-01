/**
 * useLocalStorage — Documentation Object
 *
 * The hook that looks trivially simple on the surface and has the most
 * production bugs of any common custom hook. This document provides a complete
 * failure mode analysis and production hardening guide.
 */

export const useLocalStorageDocs = {
  name: 'useLocalStorage',
  slug: 'use-local-storage',
  tagline: 'Persistent state that survives page refreshes — and gets the edge cases right.',
  version: '1.0.0',
  category: 'state',
  complexity: 'intermediate',

  problemStatement: {
    summary: `
      State in React is ephemeral — it resets on every page refresh. For many
      pieces of UI state (theme preference, sidebar collapsed, last visited tab,
      user settings), you want the state to persist. localStorage is the browser's
      simple persistence layer for this. But the gap between "works in dev on my
      machine" and "works reliably in production for all users" is significant.
    `,

    details: `
      The naive useLocalStorage implementation (store in useEffect, read in useState)
      has at least 5 categories of failure that only surface in production:

      1. MALFORMED DATA: Another extension, another tab, or a previous version of
         your app may have written something to the same localStorage key. JSON.parse
         of a non-JSON string throws a SyntaxError. Naive implementations either crash
         (unhandled exception) or silently show nothing.

      2. QUOTA EXCEEDED: localStorage has a ~5MB limit. setItem() throws DOMException
         with name "QuotaExceededError". Without catching this, the write silently
         fails in localStorage, but the React state is updated — a split-brain state.
         The user sees one thing; persistence shows another.

      3. CROSS-TAB STALE STATE: User opens your app in two tabs. Changes dark mode
         in Tab A. Tab B still shows light mode. The browser fires a 'storage' event
         for this — but most implementations don't listen for it.

      4. SSR CRASH: In Next.js, Remix, or any SSR framework, localStorage is not
         defined on the server. Accessing it during render throws a ReferenceError
         that crashes the server render with a 500.

      5. HYDRATION MISMATCH: Even if you protect the server from crashing, the
         server renders with the initialValue, and the client reads the persisted
         value — they're different. React throws a hydration warning.
    `,

    antiPatternCode: `
// ❌ NAIVE — at least 5 production bugs in 8 lines
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    // BUG 4 & 5: localStorage doesn't exist in SSR. Throws ReferenceError on server.
    const stored = localStorage.getItem(key)
    // BUG 1: JSON.parse of a corrupted/non-JSON value throws SyntaxError. Unhandled.
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    // BUG 2: setItem throws if quota exceeded. Unhandled — React state and
    // localStorage are now out of sync.
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  // BUG 3: No 'storage' event listener — cross-tab sync doesn't exist.
  return [value, setValue]
}
    `,
  },

  realWorldUseCases: [
    {
      id: 'theme-preference',
      scenario: 'Theme Preference (Dark / Light Mode)',
      description: `
        The canonical use case. The theme toggle should persist across sessions.
        Critical detail: the initial render must use the stored theme, NOT always
        light mode. Without this, users see a "flash of wrong theme" (FOWT) on
        every page load.

        Note: For Next.js, the correct solution is to read the theme from a cookie
        (readable on server) rather than localStorage (client-only). This avoids
        hydration mismatch. useLocalStorage is correct for client-only React apps.
      `,
      code: `
function App() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')

  // Apply theme class to document root (outside React's render tree)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <ThemeContext value={theme}>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      <App />
    </ThemeContext>
  )
}
      `,
    },
    {
      id: 'form-draft',
      scenario: 'Form Draft Persistence',
      description: `
        Long forms (job applications, article drafts) where losing progress due to
        accidental navigation or refresh is catastrophic for UX. Persist the form
        state to localStorage and restore it on mount.

        Key consideration: When should the draft be cleared?
        • After successful submit — yes, always.
        • After the user explicitly cancels — debatable.
        • After N days — may need a timestamp stored alongside the draft.
      `,
      code: `
function JobApplicationForm({ jobId }) {
  const storageKey = \`job-draft-\${jobId}\`
  const [draft, setDraft, clearDraft] = useLocalStorage(storageKey, {
    name: '', email: '', coverLetter: ''
  })

  async function handleSubmit(e) {
    e.preventDefault()
    await submitApplication(jobId, draft)
    // Only clear after confirmed success
    clearDraft()
    navigate('/applications')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={draft.name}
        onChange={e => setDraft(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Full Name"
      />
      {/* Autosave indicator: shows "Draft saved" when draft !== submittedData */}
      <span>Draft auto-saved</span>
      <button type="submit">Submit Application</button>
    </form>
  )
}
      `,
    },
    {
      id: 'user-preferences',
      scenario: 'User Preferences Without Backend Account',
      description: `
        For features that work without authentication — table column visibility,
        results per page, pinned filters, collapsed sections. These preferences
        improve UX significantly but don't warrant a round-trip to the server
        on every page load.

        Risk: If you rename a preference key, the old value persists under the
        old key indefinitely. Build a migration strategy.
      `,
      code: `
const DEFAULT_PREFS = {
  resultsPerPage: 25,
  showPreview: true,
  sortBy: 'date',
  version: 2, // Schema version for migrations
}

function useUserPreferences() {
  const [prefs, setPrefs, resetPrefs] = useLocalStorage(
    'user-prefs',
    DEFAULT_PREFS,
    {
      onError: (err) => {
        // QuotaExceededError or parse error — preferences are non-critical,
        // so we log and continue with defaults rather than crashing.
        analytics.track('localStorage_error', { error: err.message })
      }
    }
  )

  // Schema migration: if stored version is older, upgrade it
  const migratedPrefs = useMemo(() => {
    if (!prefs?.version || prefs.version < DEFAULT_PREFS.version) {
      // v1 → v2: sortBy was 'created_at', rename to 'date'
      return {
        ...DEFAULT_PREFS,
        ...prefs,
        sortBy: prefs?.sortBy === 'created_at' ? 'date' : prefs?.sortBy ?? 'date',
        version: 2,
      }
    }
    return prefs
  }, [prefs])

  const updatePref = useCallback((key, value) => {
    setPrefs(p => ({ ...p, [key]: value }))
  }, [setPrefs])

  return { prefs: migratedPrefs, updatePref, resetPrefs }
}
      `,
    },
  ],

  workingConditions: {
    worksWellWhen: [
      {
        condition: 'Client-only React applications (no SSR)',
        why: 'localStorage is always available. No hydration mismatch risk.',
        example: 'Create React App, Vite SPA, Electron apps.',
      },
      {
        condition: 'Non-sensitive preference data',
        why: 'localStorage is readable by all JavaScript on the page (including third-party scripts).',
        example: 'Theme, language, layout preferences, non-PII settings.',
      },
      {
        condition: 'Data that changes infrequently',
        why: 'High-frequency writes (e.g., tracking cursor position) will hit quota limits and degrade performance. localStorage is synchronous I/O.',
        example: 'Settings toggled by the user occasionally, not every render.',
      },
      {
        condition: 'Data that can tolerate being stale for one browser session',
        why: 'Cross-tab sync is eventual — there is a brief moment where tabs have different values.',
        example: 'Theme preference, language setting.',
      },
    ],

    doesNotWorkWellWhen: [
      {
        condition: 'SSR frameworks (Next.js App Router, Remix)',
        problem: `
          The server doesn't have localStorage. The server renders with initialValue.
          The client rehydrates with the stored value. These can differ — causing a
          React hydration warning or, in strict mode, a hydration error that crashes the app.
        `,
        betterAlternative: `
          Use cookies for SSR-compatible persistence (readable by the server).
          Next.js: use cookies() from next/headers in Server Components.
          Or use next-themes which handles the flash-of-wrong-theme problem.
        `,
      },
      {
        condition: 'Sensitive data (auth tokens, PII, financial data)',
        problem: `
          localStorage is accessible to ANY JavaScript running on your page.
          An XSS vulnerability exposes ALL localStorage data. No exceptions.
          Even if your code is perfect, third-party scripts (analytics, ads,
          support chat widgets) run in the same origin with full localStorage access.
        `,
        betterAlternative: `
          Use HttpOnly cookies for auth tokens — inaccessible to JavaScript.
          Store PII server-side, retrieve it on authenticated API calls.
        `,
      },
      {
        condition: 'Large data blobs (> 100KB per key)',
        problem: `
          localStorage has a ~5MB total limit per origin. Storing large objects
          (base64-encoded images, large JSON datasets) can hit this limit quickly.
          QuotaExceededError is thrown without warning until it happens.
        `,
        betterAlternative: `
          Use IndexedDB for large data (via libraries like localforage or Dexie.js).
          IndexedDB has no practical size limit (limited by disk space).
        `,
      },
      {
        condition: 'High-frequency writes (> 10/second)',
        problem: `
          localStorage.setItem() is a SYNCHRONOUS operation that blocks the main thread.
          At 60 writes/second, you're blocking the JavaScript engine 60 times per second.
          This will cause jank on any device.
        `,
        betterAlternative: `
          Debounce writes using useDebounce before persisting.
          Or use a write-buffer: accumulate changes, write to localStorage at most once every 500ms.
        `,
      },
    ],
  },

  limitations: [
    {
      id: 'no-schema-versioning',
      title: 'No Built-in Schema Versioning or Migration',
      severity: 'high',
      description: `
        When your application evolves, the shape of stored data often changes.
        A user who last visited 6 months ago may have data in the old format.
        The hook reads the old data and returns it — potentially crashing components
        that expect the new shape.

        Example: v1 stored { theme: 'dark' }. v2 stores { theme: 'dark', accentColor: 'blue' }.
        Reading v1 data with v2 code gives accentColor as undefined.
      `,
      workaround: `
        Store a version field alongside your data. On read, check the version.
        If outdated, run a migration function and write back the migrated data.
        See the useUserPreferences example above.
      `,
    },
    {
      id: 'sync-write',
      title: 'Synchronous localStorage API Blocks Main Thread',
      severity: 'medium',
      description: `
        localStorage.getItem() and localStorage.setItem() are synchronous operations.
        They cannot be made async because the Web Storage API was designed this way.
        On slow devices or when storage is nearly full, these operations can take
        2-10ms, causing dropped frames.

        React renders are typically < 16ms (60fps target). A 10ms localStorage write
        during render leaves only 6ms for everything else — frame drop guaranteed.
      `,
      workaround: `
        Move reads outside of the render path where possible (lazy useState initializer
        runs once, not on every render — our implementation already does this).
        Batch writes: don't write on every state update. Debounce the write.
        Or switch to IndexedDB via localforage for non-blocking async storage.
      `,
    },
    {
      id: 'no-expiry',
      title: 'No Automatic Expiry',
      severity: 'low-medium',
      description: `
        localStorage has no built-in TTL. Data persists indefinitely until explicitly
        removed. A form draft from 3 years ago will be restored when the user visits.
        User's device storage slowly fills with orphaned data.
      `,
      workaround: `
        Store a timestamp alongside the data:
        { data: yourData, savedAt: Date.now() }

        On read, check if savedAt is older than your TTL. If so, use initialValue
        and clear the stale entry.
      `,
    },
    {
      id: 'no-complex-types',
      title: 'Cannot Store Non-Serializable Values',
      severity: 'low',
      description: `
        Functions, Dates (become strings), undefined (becomes null), Set, Map,
        RegExp — all lose their type information through JSON.stringify/parse.
        Date.parse(new Date().toJSON()) gives you back a string, not a Date object.
      `,
      workaround: `
        For Dates: store as ISO string, parse back on read.
        For Set/Map: convert to/from Array.
        For complex types: use a custom serializer/deserializer option in the hook.
      `,
    },
  ],

  productionImprovements: [
    {
      id: 'custom-serializer',
      title: 'Custom Serializer / Deserializer',
      priority: 'high',
      description: `
        Accept serialize and deserialize options to handle non-JSON-native types
        (Dates, Sets, Maps) and to add schema versioning logic.
      `,
      code: `
const dateSerializer = {
  serialize: JSON.stringify,
  deserialize: (raw) => {
    const parsed = JSON.parse(raw)
    // Recursively convert ISO date strings back to Date objects
    return reviveDates(parsed)
  }
}

useLocalStorage('events', [], { serializer: dateSerializer })
      `,
    },
    {
      id: 'write-debounce',
      title: 'Debounced Write Option',
      priority: 'medium',
      description: `
        Add a writeDelay option. State updates immediately, but localStorage
        writes are debounced. For form autosave: writeDelay: 500 means the UI
        is always current, but localStorage is written at most twice per second.
      `,
    },
    {
      id: 'storage-quota-management',
      title: 'Storage Quota Awareness',
      priority: 'medium',
      description: `
        Before writing, estimate the size of the serialized value. If it would
        exceed a configurable limit, call onError with a meaningful message
        instead of letting the browser throw DOMException.
        The StorageManager.estimate() API can tell you available storage.
      `,
    },
  ],

  interviewQA: [
    {
      question: `
        Why does useLocalStorage need to handle JSON.parse errors? Didn't you
        write the data, so you know it's valid?
      `,
      answer: `
        Several reasons you may not be the only writer:

        1. BROWSER EXTENSIONS: Some extensions (ad blockers, note-takers, devtools extensions)
           read and modify localStorage. They may write non-JSON strings to the same key
           you're using (collision).

        2. PREVIOUS VERSIONS OF YOUR OWN APP: If you shipped a bug that wrote malformed data,
           or if you changed from localStorage to a different format without clearing old data,
           existing users have the corrupted value in their browser.

        3. MANUAL MANIPULATION: Developers commonly open DevTools and modify localStorage
           directly. In production, sophisticated users do this too.

        4. STORAGE EVENT from another tab: If two tabs are running different versions
           of your app (user hasn't refreshed after a deploy), they may write incompatible
           formats.

        Defensive deserialization is not paranoia — it's engineering.
      `,
    },
    {
      question: `
        What is QuotaExceededError and how do you handle it gracefully?
      `,
      answer: `
        QuotaExceededError is a DOMException thrown by localStorage.setItem()
        when the storage origin has exceeded its ~5MB limit.

        The dangerous behavior: if you don't catch it, setItem() throws synchronously
        inside your setValue function, which means the React state update DOES happen
        (via setStoredValue) but the localStorage write does NOT. Your in-memory state
        and persisted state are now different — a split-brain condition.

        On next page load, the user sees the old value restored from localStorage,
        not the new value they set. This is very confusing and hard to debug.

        Graceful handling:
        1. Wrap setItem in try/catch.
        2. Still allow the React state update (in-memory state is correct).
        3. Notify the caller via onError — they can show a warning.
        4. Optionally: identify the largest items in localStorage and prompt
           the user to clear data they no longer need.

        In practice, QuotaExceededError in production usually means an app has
        been storing way more than it should — the fix is architectural, not just
        error handling.
      `,
    },
    {
      question: `
        How does the 'storage' event enable cross-tab sync, and why doesn't
        it fire in the tab that made the change?
      `,
      answer: `
        The browser fires the 'storage' event on the window of every OTHER document
        in the same origin when localStorage changes. This is by design: the tab
        that made the change doesn't need to be notified — it already updated its
        own state via the direct setState call in setValue.

        If the 'storage' event fired in the same tab too, you'd process every write
        twice: once from setValue (synchronous) and once from the event listener
        (asynchronous, later). This would cause double state updates or race conditions.

        The listener receives an event with:
        • event.key: The key that changed
        • event.oldValue: Previous value (JSON string or null)
        • event.newValue: New value (JSON string or null)
        • event.storageArea: Reference to the Storage object (localStorage)

        Our hook listens for this event, checks event.key === key,
        and calls setStoredValue(JSON.parse(event.newValue)) to sync the tab's state.

        One caveat: Safari ≤ 12 had a bug where event.storageArea is null.
        Our implementation checks for this and handles it.
      `,
    },
    {
      question: `
        What is the hydration mismatch problem with localStorage in SSR,
        and how do you solve it?
      `,
      answer: `
        In SSR (Next.js, Remix), the server renders your component to HTML.
        At this point, localStorage doesn't exist — the server returns initialValue.
        The HTML is sent to the browser.

        The browser then hydrates: React runs your component again on the client.
        This time, localStorage IS available — it reads the stored value (e.g., 'dark').
        But the server-rendered HTML says 'light' (the initial value).

        React compares server HTML vs client render. They don't match.
        React logs a hydration warning. In React 18 strict mode, it may throw an error.

        Solutions:
        1. SUPPRESS: Use suppressHydrationWarning on the element whose content differs.
           Only use this if you're sure the mismatch is intentional and not a bug.

        2. DEFER CLIENT READ: Render with initialValue on the first client render,
           then in a useEffect (which doesn't run on server), read localStorage and
           update state. This gives a brief flash of the initial value.

        3. USE COOKIES INSTEAD: Cookies are readable by the server. Pass them to
           the initial server render so server and client always agree.
           This is the correct solution for SSR apps.

        4. SKIP SSR: For components that are purely client-side preferences with no
           SEO implications, use dynamic import with ssr: false in Next.js.
      `,
    },
    {
      question: `
        Should you store authentication tokens in localStorage?
      `,
      answer: `
        No. Never.

        localStorage is accessible by ALL JavaScript running in the same origin.
        This includes your code, but also:
        • Third-party analytics scripts (Google Analytics, Mixpanel)
        • Third-party chat widgets (Intercom, Zendesk)
        • Ad network scripts
        • Any JavaScript injected via XSS vulnerability

        If any of these are compromised (or your site has an XSS vulnerability),
        an attacker can read your entire localStorage, including auth tokens.

        The correct approach:
        • Use HttpOnly cookies for authentication tokens. HttpOnly cookies cannot
          be read by JavaScript — only sent automatically with requests.
        • The server reads the cookie, validates the token, and responds.
        • Even with full XSS, the attacker cannot steal an HttpOnly cookie via JavaScript.

        This is not a theoretical concern. Stealing auth tokens from localStorage
        is one of the most common XSS attack payloads.
      `,
    },
  ],

  summary: `
    useLocalStorage looks trivial but has more production failure modes than almost
    any other common custom hook. The key issues: JSON parse errors from externally
    modified data, QuotaExceededError creating split-brain state, missing cross-tab
    sync, SSR crashes, and hydration mismatches.

    The production-ready version handles all of these. Beyond the hook itself,
    the architectural decisions matter as much as the implementation:
    • Don't store sensitive data here — ever.
    • Plan for schema evolution from day one with version fields.
    • For SSR apps, use cookies instead.
    • For large data, use IndexedDB.
    • For high-frequency writes, debounce the storage writes.
  `,
}
