export default {
  id: 'model-and-view',
  title: '371. ModelAndView',
  explanation: `**\`ModelAndView\`** bundles the two things a handler produces — the **model** (data) and the **view name** — into a single returned object. It is an alternative to the common pattern of accepting a \`Model\` parameter and returning the view name as a separate \`String\` (see [[model-object]]).

**Building and returning one:**
\`\`\`java
@RequestMapping("/home")
public ModelAndView home() {
    ModelAndView mv = new ModelAndView();
    mv.setViewName("home");              // the view
    mv.addObject("name", "Navin");       // model data
    mv.addObject("age", 30);
    return mv;
}
\`\`\`

**Constructor shortcuts:**
\`\`\`java
ModelAndView mv = new ModelAndView("home");            // view only
ModelAndView mv2 = new ModelAndView("home", "name", "Navin"); // + one attribute
\`\`\`

**Key methods:**
- \`setViewName(String)\` — set the logical view name.
- \`addObject(key, value)\` — add a model attribute (like \`model.addAttribute\`).
- \`addObject(value)\` — add with an auto-generated name from the type.

**Model + Model parameter vs ModelAndView — which to use?**
- **\`Model\` param + return \`String\`** — the mainstream, most readable style today.
- **\`ModelAndView\`** — handy when the view name is decided dynamically alongside the data, or when you like packaging both together; also common in older codebases.

Both end the same way: the view resolver (see [[setting-prefix-and-suffix]]) maps the view name to a JSP, which renders using the model attributes. Choose one style and stay consistent.`,
  code: `@Controller
public class HomeController {

    @RequestMapping("/home")
    public ModelAndView home() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("home");        // -> /WEB-INF/jsp/home.jsp
        mv.addObject("name", "Navin"); // model data for \${name}
        mv.addObject("age", 30);
        return mv;
    }

    // Equivalent using the constructor shortcut
    @RequestMapping("/about")
    public ModelAndView about() {
        return new ModelAndView("about", "title", "About Us");
    }
}`,
  codeTitle: 'Returning a ModelAndView',
  points: [
    'ModelAndView packages the model data and the view name in one returned object.',
    'setViewName sets the logical view; addObject adds model attributes.',
    'Constructors offer shortcuts: new ModelAndView("home", "key", value).',
    'It is an alternative to the Model-parameter + return-String style.',
    'Either way, the view resolver maps the view name to a JSP that renders the model.',
  ],
  callouts: [
    { type: 'tip', content: 'Pick one convention per project. Modern Spring code usually favors a Model parameter and returning the view name String; ModelAndView shines when the view is chosen dynamically together with its data.' },
    { type: 'interview', content: 'Q: What two things does a ModelAndView hold?\nA: The model (the data attributes for the view) and the view name (which view should render). It lets a handler return both in a single object.' },
  ],
}
