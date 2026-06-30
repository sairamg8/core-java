export default {
  id: 'servlet-life-cycle',
  title: '250. Servlet Life Cycle',
  explanation: `The Servlet lifecycle defines how Tomcat creates, uses, and destroys a Servlet. Understanding it is fundamental to Servlet programming.

**The three phases:**

**1. Initialization — \`init()\`:**
Called **once** when the Servlet is first loaded. Tomcat instantiates the Servlet class and calls \`init()\`. Use this for one-time setup: opening a database connection pool, loading configuration, caching data.

\`\`\`java
@Override
public void init() throws ServletException {
    // runs once — good for setup
}
\`\`\`

**2. Service — \`service()\` → \`doGet()\` / \`doPost()\`:**
Called **for every request**. Tomcat calls \`service()\` which inspects the HTTP method and dispatches to \`doGet()\`, \`doPost()\`, etc. This phase is multithreaded — multiple requests can be in \`doGet()\` simultaneously.

\`\`\`java
@Override
protected void doGet(HttpServletRequest req, HttpServletResponse res) {
    // runs per request — can be concurrent
}
\`\`\`

**3. Destruction — \`destroy()\`:**
Called **once** when Tomcat shuts down or un-deploys the web app. Use this for cleanup: closing connection pools, flushing caches, releasing resources.

\`\`\`java
@Override
public void destroy() {
    // runs once — good for cleanup
}
\`\`\`

**Lifecycle sequence:**
\`\`\`
Tomcat starts
  → new HelloServlet()         // constructor
  → init()                     // one-time setup
  → [requests arrive]
      → service() → doGet()    // per request (may be concurrent)
      → service() → doPost()   // per request
  → destroy()                  // one-time cleanup
Tomcat stops
\`\`\`

**Critical insight — Servlet is a singleton:**
Tomcat creates **ONE** Servlet instance, then calls \`doGet()\` on it from multiple threads simultaneously. Never store user-specific data in instance variables.`,
  code: `// ===== Servlet Lifecycle Demo =====
package com.example;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.concurrent.atomic.*;

@WebServlet("/lifecycle-demo")
public class LifecycleDemoServlet extends HttpServlet {

    // Instance variable — shared across ALL requests (thread-safe with AtomicInteger)
    private AtomicInteger requestCount;
    private String initTime;
    private String appName;

    // ===== PHASE 1: init() — runs ONCE when Tomcat loads this Servlet =====
    @Override
    public void init() throws ServletException {
        System.out.println("=== init() called — Servlet is loading ===");

        // Safe: instance variables are set ONCE in init(), only read in doGet()
        requestCount = new AtomicInteger(0);
        initTime     = java.time.LocalDateTime.now().toString();
        appName      = getServletContext().getServletContextName();

        // Simulate loading config
        String dbUrl = getServletConfig().getInitParameter("dbUrl");
        System.out.println("Config dbUrl: " + dbUrl);
        System.out.println("Servlet initialized at: " + initTime);
    }

    // ===== PHASE 2: doGet() — runs for EVERY GET request, possibly concurrently =====
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        // incrementAndGet() is thread-safe
        int count = requestCount.incrementAndGet();

        // !! NEVER do this: username = req.getParameter("user") — instance var = thread hazard !!
        // Instead, use LOCAL variables — each thread has its own stack:
        String visitor = req.getParameter("visitor");
        if (visitor == null) visitor = "Anonymous";

        res.setContentType("text/html");
        PrintWriter out = res.getWriter();

        out.println("<html><body>");
        out.println("<h2>Servlet Lifecycle Demo</h2>");
        out.println("<p>Request number: <b>" + count + "</b></p>");
        out.println("<p>Current visitor: <b>" + visitor + "</b></p>");
        out.println("<p>Servlet initialized at: " + initTime + "</p>");
        out.println("<p>App name: " + appName + "</p>");
        out.println("</body></html>");
    }

    // ===== PHASE 3: destroy() — runs ONCE when Tomcat stops or un-deploys =====
    @Override
    public void destroy() {
        System.out.println("=== destroy() called — Servlet is unloading ===");
        System.out.println("Total requests served: " + requestCount.get());
        // Close DB pools, flush caches, release resources here
    }
}

// ===== web.xml: load-on-startup (eager init) =====
/*
<servlet>
  <servlet-name>LifecycleDemoServlet</servlet-name>
  <servlet-class>com.example.LifecycleDemoServlet</servlet-class>
  <load-on-startup>1</load-on-startup>  <!-- init() called at Tomcat start, not first request -->
</servlet>
*/`,
  codeTitle: 'Servlet Lifecycle — init, doGet, destroy with Thread Safety',
  points: [
    'init() is called exactly once when the Servlet is first loaded — use it for one-time setup (connection pools, config loading)',
    'service() is called for every request — it dispatches to doGet(), doPost(), etc. based on the HTTP method',
    'destroy() is called exactly once when Tomcat shuts down or un-deploys the app — use it for resource cleanup',
    'Tomcat creates ONE Servlet instance shared by all threads — instance variables are shared across concurrent requests',
    'Use local variables (method parameters, local declarations) for request-scoped data — each thread has its own stack',
    'Thread-safe classes (AtomicInteger, ConcurrentHashMap) are needed for instance variables that are mutated by doGet/doPost',
    'load-on-startup in web.xml causes init() to be called at Tomcat startup instead of on the first request',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "The most dangerous Servlet mistake: storing user-specific data in an instance variable. Example: private String loggedInUser = req.getParameter('user'). Two threads serving two different users will overwrite each other's data. NEVER use instance variables for anything that changes per request. Use local variables, HttpServletRequest attributes, or HttpSession.",
    },
    {
      type: 'interview',
      content: "Q: Is a Servlet thread-safe? How many Servlet instances does Tomcat create?\nA: Tomcat creates ONE instance of each Servlet class (singleton) and serves all concurrent requests using multiple threads from a thread pool. Servlets are NOT inherently thread-safe. You make them safe by using only local variables and method parameters for per-request data, using thread-safe data structures for shared state, and avoiding instance variable mutation in service methods.",
    },
    {
      type: 'tip',
      content: "Use init(ServletConfig config) (with parameter) if you need access to init parameters from web.xml or @WebInitParam. Call super.init(config) as the first line, then getServletConfig().getInitParameter('key') to read them. Alternatively, override the no-arg init() — it is called after the container sets up the config, so getServletConfig() and getServletContext() are available.",
    },
  ],
}
