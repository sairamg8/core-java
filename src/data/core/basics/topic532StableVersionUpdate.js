export default {
  id: 'stable-version-update',
  title: '532. Stable Version Update',
  explanation: `The previous topic flagged that Spring AI has changed meaningfully across versions (see [[spring-ai-docs]]) — this topic covers specifically what changed with the move to **Spring AI 1.0**, since this is exactly the kind of version-boundary detail that trips people up when following older tutorials.

**Before 1.0, Spring AI shipped as a series of milestone (\`M1\`, \`M2\`...) and release candidate (\`RC1\`...) versions — meaning breaking API changes between them were expected and normal, not a sign of instability.** Milestone versions are explicitly not meant for production use precisely because their APIs are still being actively finalized; this is standard practice across the Spring ecosystem for any module still under active design, not unique to Spring AI.

**What actually changed at the 1.0 boundary, concretely — the specific things worth knowing if cross-referencing older examples.** Several core APIs were renamed or restructured during the milestone period — for instance, some early builder method names and configuration property prefixes differ from their final 1.0 form. The *concepts* (\`ChatClient\`, \`Prompt\`, \`ChatResponse\`) remained stable throughout — it's specific method signatures and property names that shifted as the API was refined toward its final shape.

**The practical takeaway, extending directly from the previous topic's advice.** Any Spring AI dependency version string should explicitly target \`1.0\` or later (never a bare \`M\`/\`RC\` version) for anything beyond experimentation, and any code example — including every example in the remaining topics of this chapter — should be understood as targeting the stable 1.0+ API shape specifically.

**Declaring the Spring AI Bill of Materials (BOM) — the mechanism that keeps every Spring AI dependency's version consistent, avoiding a subtle class of version-mismatch bugs:**
\`\`\`xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-bom</artifactId>
            <version>1.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
\`\`\`
Declaring the BOM once means every individual Spring AI starter dependency (\`spring-ai-openai-spring-boot-starter\`, and others used later in this chapter) can be added *without* specifying its own version — the BOM guarantees they're all mutually compatible, exactly the same problem Maven's dependency management already solves elsewhere in this course, applied here specifically to Spring AI's multiple interrelated modules.`,
  code: `<!-- pom.xml - the Spring AI BOM, declared once -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-bom</artifactId>
            <version>1.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<!-- Individual starters can now omit their own <version> -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
</dependency>`,
  codeTitle: 'Declaring the Spring AI BOM to keep every module version mutually compatible',
  points: [
    'Before 1.0, Spring AI shipped milestone (M1, M2) and release candidate (RC) versions, where breaking API changes between versions were expected and normal - standard practice for any actively-developed Spring module.',
    'Core concepts (ChatClient, Prompt, ChatResponse) stayed stable throughout the milestone period - specific method names and configuration property prefixes are what shifted before reaching their final 1.0 shape.',
    'Any Spring AI dependency should target 1.0 or later explicitly, never a bare milestone/RC version, for anything beyond pure experimentation.',
    'The Spring AI BOM (Bill of Materials), declared once in dependencyManagement, lets individual Spring AI starter dependencies omit their own version, guaranteeing mutual compatibility across modules.',
    'This BOM pattern solves the same version-consistency problem Maven dependency management addresses elsewhere in this course, applied specifically to the multiple interrelated Spring AI modules.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Mixing a Spring AI BOM version with an individually-specified, mismatched version for one specific starter dependency defeats the purpose of declaring the BOM at all - it can silently reintroduce the exact cross-module version incompatibility the BOM exists to prevent; let the BOM manage every Spring AI module version consistently.' },
    { type: 'interview', content: 'Q: What is the practical purpose of declaring the Spring AI BOM in dependencyManagement, rather than specifying a version on each individual Spring AI starter dependency?\nA: The BOM guarantees that every Spring AI module (chat starters, vector store integrations, and others used later in this chapter) resolves to mutually compatible versions automatically, since they are all managed together under one BOM version. Specifying individual versions per dependency risks accidentally mixing incompatible module versions, which the BOM is specifically designed to prevent.' },
  ],
}
