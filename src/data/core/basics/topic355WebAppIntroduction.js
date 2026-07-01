export default {
  id: 'web-app-introduction',
  title: '355. Web App Introduction',
  explanation: `Until now the focus has been standalone Java programs. A **web application** is different: it runs on a **server**, and users interact with it through a **browser** over **HTTP** instead of a \`main\` method on their own machine.

**The request/response cycle:**
1. The browser (the **client**) sends an **HTTP request** to a URL.
2. A **web server / servlet container** (like Tomcat) receives it.
3. Server-side Java code runs, builds a **response** (usually HTML, or JSON for APIs).
4. The response travels back and the browser renders it.

**Key vocabulary:**
- **Client** — the browser or app making the request.
- **Server** — the machine/process that hosts your app and answers requests.
- **HTTP** — the protocol; methods include \`GET\` (fetch) and \`POST\` (submit data).
- **Servlet container / web server** — Tomcat, Jetty; it manages the lifecycle of your server-side components.
- **Static vs dynamic content** — a plain \`.html\` file is static (same for everyone); a page built per-request from data (your marks, your cart) is dynamic.

**Where Java fits:** the classic building block is the **Servlet** — a Java class the container runs to handle requests. Frameworks like **Spring MVC** and **Spring Boot** sit on top of servlets so you write controllers instead of raw servlets. Understanding the servlet foundation first makes the frameworks make sense (see [[introduction-to-mvc]]).`,
  points: [
    'A web app runs on a server and is used through a browser over HTTP, not via a local main method.',
    'The cycle is: browser sends request to a URL, server runs code, server returns a response, browser renders it.',
    'Client = browser; server = Tomcat/host; HTTP = the protocol (GET fetches, POST submits).',
    'Static content is the same for everyone; dynamic content is built per request from data.',
    'The Servlet is the core Java building block; Spring MVC/Boot layer on top of servlets.',
  ],
  callouts: [
    { type: 'tip', content: 'Think in terms of request in, response out. Every web feature you build is ultimately a function that takes an HTTP request and returns an HTTP response.' },
    { type: 'interview', content: 'Q: What is a servlet container?\nA: A runtime like Tomcat that manages server-side components (servlets) — creating them, routing HTTP requests to them, and managing their lifecycle and threads.' },
  ],
}
