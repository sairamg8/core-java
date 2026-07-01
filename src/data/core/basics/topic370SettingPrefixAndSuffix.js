export default {
  id: 'setting-prefix-and-suffix',
  title: '370. Setting Prefix and Suffix',
  explanation: `When a controller returns a **logical view name** like \`"home"\`, something has to turn that into an actual file such as \`/WEB-INF/jsp/home.jsp\`. That job belongs to the **view resolver**, and you configure it with a **prefix** and **suffix**.

**The idea:**
\`\`\`
resolved path = prefix + viewName + suffix
\`\`\`
So with prefix \`/WEB-INF/jsp/\` and suffix \`.jsp\`, returning \`"home"\` resolves to \`/WEB-INF/jsp/home.jsp\`.

**In Spring Boot** the easiest way is two properties in \`application.properties\`:
\`\`\`
spring.mvc.view.prefix=/WEB-INF/jsp/
spring.mvc.view.suffix=.jsp
\`\`\`
Spring Boot auto-configures an \`InternalResourceViewResolver\` from them (see [[internal-resource-view-resolver]]).

**In classic Spring MVC** you declare the resolver bean yourself:
\`\`\`java
@Bean
public InternalResourceViewResolver viewResolver() {
    InternalResourceViewResolver r = new InternalResourceViewResolver();
    r.setPrefix("/WEB-INF/jsp/");
    r.setSuffix(".jsp");
    return r;
}
\`\`\`

**Why \`/WEB-INF/\`?** Files under \`WEB-INF\` cannot be requested directly by the browser — they are only reachable via a server-side forward from a controller. That protects your JSPs from being opened out of context.

**Result:** controllers stay clean — they return short names like \`"home"\`, \`"result"\`, \`"list"\`, and the resolver consistently maps each to its JSP. Change the folder or extension in one place and every mapping updates.`,
  code: `# application.properties (Spring Boot)
spring.mvc.view.prefix=/WEB-INF/jsp/
spring.mvc.view.suffix=.jsp

// Now a controller only returns the short name:
@GetMapping("/home")
public String home() {
    return "home";   // -> /WEB-INF/jsp/home.jsp
}`,
  codeTitle: 'Configuring view prefix and suffix',
  points: [
    'The view resolver turns a logical view name into a real file: prefix + viewName + suffix.',
    'In Spring Boot set spring.mvc.view.prefix and spring.mvc.view.suffix in application.properties.',
    'In classic Spring MVC declare an InternalResourceViewResolver bean with setPrefix/setSuffix.',
    'Placing JSPs under /WEB-INF prevents direct browser access — only server-side forwards reach them.',
    'Controllers return short names (home, result); the resolver maps each to its JSP consistently.',
  ],
  callouts: [
    { type: 'gotcha', content: 'The prefix needs its trailing slash and the suffix its leading dot: /WEB-INF/jsp/ and .jsp. Missing either produces paths like /WEB-INF/jsphome or homejsp and a view-not-found error.' },
    { type: 'tip', content: 'Keep JSPs under WEB-INF so users cannot browse to them directly; they should only be rendered through a controller that has populated the model.' },
    { type: 'interview', content: 'Q: What does an InternalResourceViewResolver do?\nA: It resolves a logical view name to a physical resource (typically a JSP) by adding a configured prefix and suffix, then forwards the request to that resource for rendering.' },
  ],
}
