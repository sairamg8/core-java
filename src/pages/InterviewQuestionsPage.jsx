import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Home, ChevronRight } from 'lucide-react'
import { renderInline } from '../utils/renderText'

const PLACEHOLDER = {
  core: [
    { q: 'What is the difference between JDK, JRE, and JVM?', a: 'JVM (Java Virtual Machine) executes bytecode and provides platform independence. JRE (Java Runtime Environment) = JVM + standard library classes (rt.jar). JDK (Java Development Kit) = JRE + development tools (javac, javadoc, jdb). You need the JDK to compile; JRE is enough to run.' },
    { q: 'What is the difference between == and equals() in Java?', a: '== compares object references (memory addresses) for objects, and values for primitives. equals() compares object content — its default implementation in Object is the same as ==, but classes like String, Integer, etc. override it for value comparison. Always use equals() when comparing String content.' },
    { q: 'Why is String immutable in Java?', a: 'String immutability enables the String Pool (multiple references share one object), thread safety (no synchronization needed), and safe use as HashMap keys (hashCode never changes). Internally, String stores chars in a final char[] (or byte[] since Java 9) and provides no mutation methods.' },
    { q: 'What is the String Pool?', a: 'The String Pool (interned string pool) is a special region in heap memory where Java stores one copy of each unique string literal. When you write String s = "hello", Java checks the pool first. If "hello" exists, it returns that reference. new String("hello") bypasses the pool and always creates a new heap object.' },
    { q: 'What is autoboxing and unboxing?', a: 'Autoboxing is automatic conversion from a primitive (int) to its wrapper class (Integer). Unboxing is the reverse. Java does this implicitly when mixing primitives with their wrappers. Gotcha: unboxing a null Integer throws NullPointerException. Integer cache: Java caches Integer values from -128 to 127, so Integer a = 127; Integer b = 127; a == b is true, but a = 128; b = 128; a == b is false.' },
    { q: 'What is the difference between ArrayList and LinkedList?', a: 'ArrayList is backed by a resizable array — O(1) random access, O(n) insert/delete in the middle. LinkedList is a doubly linked list — O(n) access by index, O(1) insert/delete at head/tail. Use ArrayList for most cases (better cache performance). Use LinkedList only as a Deque (addFirst/removeFirst).' },
    { q: 'How does HashMap work internally?', a: 'HashMap uses an array of buckets. put(key, value): computes hashCode, maps to bucket via (n-1) & hash, and stores in a linked list (or Red-Black Tree if chain > 8 in Java 8+). get(key): same bucket lookup, then equals() to find exact entry. Default load factor 0.75 — rehashes when 75% full. Worst case O(n) with all keys hashing same bucket; O(log n) with treeification.' },
    { q: 'What is the difference between HashMap and Hashtable?', a: 'Hashtable is synchronized (thread-safe) and legacy (Java 1.0). HashMap is not synchronized and faster for single-threaded use. Neither allows null keys in Hashtable; HashMap allows one null key and multiple null values. Prefer ConcurrentHashMap for thread-safe operations — it uses segment-level locking, not a single global lock.' },
    { q: 'What is the difference between Comparable and Comparator?', a: 'Comparable defines the natural ordering of a class by implementing compareTo() inside the class — it is intrinsic. Comparator is an external comparison strategy — compare(o1, o2) — that can be passed to sort() or TreeSet/TreeMap. Use Comparable for default sort order, Comparator for alternate orderings or when you cannot modify the class.' },
    { q: 'What are checked vs unchecked exceptions?', a: 'Checked exceptions extend Exception (not RuntimeException) — the compiler forces you to catch or declare them (throws). Examples: IOException, SQLException. Unchecked exceptions extend RuntimeException — no compile-time requirement. Examples: NullPointerException, ArrayIndexOutOfBoundsException. Errors (OutOfMemoryError, StackOverflowError) are neither — they signal JVM-level failures you generally cannot recover from.' },
  ],
  advanced: [
    { q: 'What is the difference between process and thread?', a: 'A process is an independent program execution with its own memory space (heap, stack, code, data segments). Threads are lightweight units within a process that share the process\'s heap and static memory, but each has its own stack and program counter. Context switching between threads is cheaper than between processes because no memory map switch is needed.' },
    { q: 'What is the Java Memory Model (JMM)?', a: 'The JMM defines how threads see each other\'s writes to shared variables. Without synchronization, CPU caches and compiler reordering can make writes invisible to other threads. The JMM guarantees: (1) volatile writes are visible to all threads immediately, (2) synchronized blocks establish happens-before relationships, (3) final fields are safely visible after the constructor completes.' },
    { q: 'What is the difference between synchronized and volatile?', a: 'volatile guarantees visibility (all threads see the latest write) but NOT atomicity. synchronized guarantees both visibility and atomicity (only one thread executes the block at a time). Use volatile for simple flags (boolean stop = true). Use synchronized or Atomic classes for compound operations (check-then-act, read-modify-write).' },
    { q: 'What is a deadlock and how do you prevent it?', a: 'Deadlock occurs when two or more threads are each waiting for a lock held by the other, creating a cycle. Prevention strategies: (1) always acquire locks in a consistent global order, (2) use tryLock() with timeout (ReentrantLock), (3) reduce lock granularity, (4) use higher-level concurrency utilities (ConcurrentHashMap, BlockingQueue) that avoid manual locking.' },
    { q: 'What is the difference between wait() and sleep()?', a: 'Thread.sleep(ms) pauses the current thread for a fixed time — it does NOT release any locks. Object.wait() pauses the thread and RELEASES the intrinsic lock, allowing other threads to enter synchronized blocks. wait() must be called inside a synchronized block and is used with notify()/notifyAll() for inter-thread communication.' },
  ],
}

function QCard({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
      >
        <span className="text-xs font-mono text-gray-400 dark:text-gray-600 mt-0.5 min-w-[2rem]">
          Q{index + 1}
        </span>
        <span className="flex-1 font-medium text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          {item.q}
        </span>
        <span className="flex-shrink-0 mt-0.5">
          {open
            ? <ChevronUp size={16} className="text-gray-400" />
            : <ChevronDown size={16} className="text-gray-400" />}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 pl-[3.25rem] border-t border-gray-100 dark:border-gray-800">
          <div className="pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {item.a.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>{renderInline(line)}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function InterviewQuestionsPage() {
  const { type } = useParams()
  const items = PLACEHOLDER[type] || []
  const label = type === 'core' ? 'Core Java' : 'Advanced Java'

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 mb-6">
        <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span>Interview Questions</span>
        <ChevronRight size={12} />
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          {label} — Interview Q&A
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {items.length} questions so far — expanding to 100. Click any question to reveal the answer.
        </p>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => <QCard key={i} item={item} index={i} />)}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 text-gray-400 dark:text-gray-600 text-sm">
          Coming soon — questions for {label} are being added.
        </div>
      )}
    </div>
  )
}
