export default {
  id: 'creating-a-controller',
  title: '363. Creating a Controller',
  explanation: `A **controller** is the class in Spring MVC that receives web requests and decides what happens next (see [[introduction-to-mvc]]). You mark it with **\`@Controller\`** so Spring registers it as a bean and scans its methods for request mappings.

**Handler methods** are annotated with a mapping like \`@GetMapping("/home")\` (or \`@RequestMapping\`, see [[requestmapping]]). When a request matches, Spring calls that method.

**What a handler returns** in a JSP/view app is a **view name** — a \`String\` that the view resolver turns into an actual page:
\`\`\`java
@Controller
public class HomeController {

    @GetMapping("/home")
    public String home() {
        return "home";   // -> resolves to /WEB-INF/jsp/home.jsp
    }
}
\`\`\`
Here \`"home"\` is not HTML — it is a **logical view name**. The view resolver (see [[setting-prefix-and-suffix]]) adds the prefix/suffix to find \`home.jsp\`.

**\`@Controller\` vs \`@RestController\`:** \`@Controller\` returns view names (for server-rendered pages). \`@RestController\` (= \`@Controller\` + \`@ResponseBody\`) returns the data itself as the response body (JSON), used for REST APIs. For JSP pages you want plain \`@Controller\`.

Controllers stay thin: they take input, call services for the real work, put results in the model (see [[model-object]]), and pick a view.`,
  code: `@Controller
public class HomeController {

    // GET http://localhost:8080/home
    @GetMapping("/home")
    public String home() {
        return "home";          // logical view name -> home.jsp
    }

    @GetMapping("/about")
    public String about() {
        return "about";
    }
}`,
  codeTitle: 'A basic @Controller',
  points: [
    '@Controller marks a class as a web controller so Spring registers it and scans for mappings.',
    'Handler methods use @GetMapping/@PostMapping/@RequestMapping to bind to URLs.',
    'In a view app a handler returns a logical view name (a String), not HTML.',
    'The view resolver turns that name into an actual page (home -> /WEB-INF/jsp/home.jsp).',
    '@RestController returns the data as the body (JSON); @Controller returns view names.',
  ],
  callouts: [
    { type: 'gotcha', content: 'With plain @Controller, returning "home" renders the home view. If you accidentally add @ResponseBody (or use @RestController), Spring writes the literal string "home" to the browser instead of rendering a page.' },
    { type: 'tip', content: 'Keep controllers thin: parse the request, delegate to a @Service, populate the model, choose a view. Business logic does not belong in the controller.' },
    { type: 'interview', content: 'Q: Difference between @Controller and @RestController?\nA: @RestController = @Controller + @ResponseBody. @Controller returns view names for server-side rendering; @RestController serializes return values directly into the response body (typically JSON).' },
  ],
}
