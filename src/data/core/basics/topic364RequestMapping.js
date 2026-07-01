export default {
  id: 'requestmapping',
  title: '364. RequestMapping',
  explanation: `**\`@RequestMapping\`** binds a URL (and optionally an HTTP method) to a handler method or a whole controller. It is the general-purpose mapping annotation; the method-specific ones (\`@GetMapping\`, \`@PostMapping\`, etc.) are shortcuts for it.

**At method level:**
\`\`\`java
@RequestMapping(value = "/home", method = RequestMethod.GET)
public String home() { return "home"; }
\`\`\`

**Shortcut equivalents** (preferred, more readable):
- \`@GetMapping("/home")\` = \`@RequestMapping(value="/home", method=GET)\`
- \`@PostMapping\`, \`@PutMapping\`, \`@DeleteMapping\`, \`@PatchMapping\`.

**At class level** \`@RequestMapping\` sets a **base path** for every handler in the controller — the method paths are appended:
\`\`\`java
@Controller
@RequestMapping("/jobs")
public class JobController {
    @GetMapping("/all")   // -> /jobs/all
    public String all() { return "list"; }
}
\`\`\`

**Useful attributes:**
- \`value\` / \`path\` — the URL pattern(s); accepts multiple: \`{"/", "/home"}\`.
- \`method\` — restrict to GET/POST/etc.
- \`params\` and \`headers\` — match only when a given request param or header is present.
- \`consumes\` / \`produces\` — restrict by \`Content-Type\` / \`Accept\` (mostly for REST).

Choosing the right method matters: use **GET** to fetch/display and **POST** to submit data (see [[sending-data-to-controller]]).`,
  code: `@Controller
@RequestMapping("/jobs")          // base path for the whole controller
public class JobController {

    @GetMapping("/all")           // GET /jobs/all
    public String all() { return "list"; }

    @PostMapping("/add")          // POST /jobs/add
    public String add() { return "redirect:/jobs/all"; }

    // Long form equivalent of @GetMapping("/one")
    @RequestMapping(value = "/one", method = RequestMethod.GET)
    public String one() { return "detail"; }
}`,
  codeTitle: '@RequestMapping and its shortcuts',
  points: [
    '@RequestMapping binds a URL (and optional method) to a controller or handler method.',
    '@GetMapping/@PostMapping/etc. are method-specific shortcuts for @RequestMapping.',
    'At class level it sets a base path that is prepended to every handler path.',
    'Attributes include value/path, method, params, headers, consumes, produces.',
    'Use GET to display data and POST to submit data.',
  ],
  callouts: [
    { type: 'gotcha', content: 'If two handlers map to the same URL and method, Spring throws an ambiguous mapping error at startup. Each URL+method combination must map to exactly one handler.' },
    { type: 'tip', content: 'Prefer @GetMapping/@PostMapping over @RequestMapping(method=...) — they read better and make the intended HTTP verb obvious at a glance.' },
    { type: 'interview', content: 'Q: What happens if you put @RequestMapping on both the class and the method?\nA: The paths are combined — the class-level path is the prefix and the method-level path is appended to it.' },
  ],
}
