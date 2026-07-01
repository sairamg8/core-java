export default {
  id: 'implementing-prompt-template',
  title: '543. Implementing Prompt Template',
  explanation: `With \`PromptTemplate\` understood conceptually (see [[prompt-template-concept]]), this topic builds a complete, realistic feature with it — applied directly to the Job app, tying prompt templates into a genuine \`ChatClient\` call rather than just constructing a \`Prompt\` object in isolation.

**A realistic Job app feature: generating a tailored cover letter blurb, using a template with several variables:**
\`\`\`java
@Service
public class CoverLetterService {

    private final ChatClient chatClient;

    private static final String TEMPLATE = """
        Write a 2-sentence cover letter opening for a candidate applying to
        the "{jobTitle}" position at {companyName}. The candidate's key
        skill to highlight is: {keySkill}.
        """;

    public CoverLetterService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String generateOpening(String jobTitle, String companyName, String keySkill) {
        PromptTemplate template = new PromptTemplate(TEMPLATE);
        Prompt prompt = template.create(Map.of(
            "jobTitle", jobTitle,
            "companyName", companyName,
            "keySkill", keySkill
        ));

        return chatClient.prompt(prompt)
            .call()
            .content();
    }
}
\`\`\`

**Reading the key connection point: \`chatClient.prompt(prompt)\`.** Every earlier example used \`chatClient.prompt().user(question)\` — building the prompt inline through the fluent chain. Passing a pre-built \`Prompt\` object (created by \`template.create(...)\`) directly into \`.prompt(prompt)\` instead is how a \`PromptTemplate\`-built prompt actually gets sent — the fluent \`.user(...)\` builder and this direct \`Prompt\`-object approach are two different entry points into the same underlying \`ChatClient\` call.

**Why defining \`TEMPLATE\` as a \`static final\` constant (a Java text block, using \`"""\`) rather than inline in the method matters, connecting back to the previous topic's point about reuse and separation.** The template text is now readable at a glance, separate from the method logic that supplies its variables — and if this template needs adjusting later, the change is isolated to one clearly-named constant, not buried inside a method's control flow.

**Why every variable here comes from application data (\`jobTitle\`, \`companyName\`, \`keySkill\`), not directly from unvalidated user input.** This specific method controls exactly what gets substituted into the template — a well-known LLM-specific risk called **prompt injection** (a user crafting input designed to override the template's intended instructions) becomes a real concern the moment raw, unvalidated user text gets substituted directly into a template controlling model behavior — a risk worth flagging here even though this specific example's inputs are already application-controlled data, not raw free-text user input.`,
  code: `@Service
public class CoverLetterService {

    private final ChatClient chatClient;

    private static final String TEMPLATE = """
        Write a 2-sentence cover letter opening for a candidate applying to
        the "{jobTitle}" position at {companyName}. The candidate's key
        skill to highlight is: {keySkill}.
        """;

    public CoverLetterService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String generateOpening(String jobTitle, String companyName, String keySkill) {
        PromptTemplate template = new PromptTemplate(TEMPLATE);
        Prompt prompt = template.create(Map.of(
            "jobTitle", jobTitle, "companyName", companyName, "keySkill", keySkill
        ));
        return chatClient.prompt(prompt).call().content();
    }
}`,
  codeTitle: 'A complete cover-letter feature built with PromptTemplate and ChatClient',
  points: [
    'chatClient.prompt(prompt) accepts a pre-built Prompt object (from template.create(...)), a second entry point into ChatClient distinct from the fluent .prompt().user(...) chain used in earlier topics.',
    'Defining the template as a static final text block constant keeps the prompt text readable and isolated from the method logic that supplies its variable values.',
    'This mirrors the reuse/separation argument from the previous topic concretely - the template can be adjusted in one place without touching the surrounding service logic.',
    'Prompt injection - a user crafting input designed to override the intended instructions of a template - becomes a real risk the moment raw, unvalidated user text gets substituted directly into a template controlling model behavior.',
    'This example deliberately uses application-controlled data as template variables, not raw free-text user input, sidestepping that specific risk for this particular feature.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Substituting raw, unvalidated user-submitted text directly into a prompt template that also contains system-level instructions creates a prompt injection risk - a crafted user input could contain text designed to override or confuse the intended instructions of the template; sanitizing or clearly delimiting user-supplied content becomes important once free-text user input is involved.' },
    { type: 'interview', content: 'Q: What is the difference between chatClient.prompt().user(question) and chatClient.prompt(prompt), and when would each be used?\nA: chatClient.prompt().user(question) builds a prompt inline through the fluent chain, suitable for simple, one-off prompts. chatClient.prompt(prompt) accepts an already-constructed Prompt object, typically built via PromptTemplate.create(...) - the right choice when the prompt has multiple variables, a reusable structure, or benefits from being defined and inspected separately from the specific ChatClient call that sends it.' },
  ],
}
