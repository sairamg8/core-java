export default {
  id: 'running-model-locally-with-ollama',
  title: '540. Running Model Locally With Ollama',
  explanation: `Every topic so far has called OpenAI's hosted API — real, useful, but with real costs and a dependency on network access and an external provider (see [[create-openai-api-key]]). This topic introduces **Ollama**, a tool for running LLMs entirely **locally**, on the developer's own machine, no API key or internet-dependent billing involved.

**What Ollama actually is: a tool for downloading and running open-source LLMs locally, with a simple CLI and local API.** Models like Llama, Mistral, and others are packaged for Ollama and can be pulled and run with one command, similar in spirit to how Docker pulls and runs container images (see [[what-is-docker]]) — Ollama's model registry plays a directly analogous role to Docker Hub.

**Installing Ollama and running a model — the whole setup:**
\`\`\`bash
# Install Ollama (platform-specific, see ollama.com)

# Pull and run a model
ollama run llama3.2
# >>> Send a message (type /? for help)
\`\`\`
This immediately opens an interactive chat session with the model, running entirely on the local machine — no OpenAI account, no API key, no per-token billing.

**Why running models locally matters, beyond just avoiding API costs — the genuine tradeoffs, stated honestly rather than treating this as a strictly better option.** Local models: run with **zero marginal cost per call** (compute is already owned, not billed per token), work **completely offline**, and keep **all data local** (nothing sent to an external provider — a real advantage for sensitive data). The tradeoff: local models are generally **less capable** than the largest hosted models like GPT-4, and running them requires the local machine to have adequate CPU/GPU/memory resources — a genuinely more demanding hardware requirement than making an API call over the network.

**Where Ollama fits practically, for the rest of this chapter and beyond.** It's genuinely useful for development and testing without incurring API costs, for privacy-sensitive use cases, or for offline scenarios — not necessarily a wholesale replacement for a hosted provider in every situation. The next topic wires Ollama into Spring AI specifically, using the exact same \`ChatClient\` abstraction already established (see [[why-spring-ai]]) — reinforcing, concretely, that switching providers really is just a configuration change, not a rewrite.`,
  code: `# Install Ollama, then pull and run a model
ollama run llama3.2

# Interactive session starts immediately - runs entirely locally
# >>> What is Spring Boot?
# Spring Boot is a framework...

# Ollama also exposes a local REST API by default (http://localhost:11434)
# which is exactly what Spring AI's Ollama integration talks to`,
  codeTitle: 'Installing Ollama and running a model entirely locally',
  points: [
    'Ollama is a tool for downloading and running open-source LLMs locally, playing a role for AI models analogous to what Docker Hub plays for container images.',
    'Running a model locally via Ollama has zero marginal cost per call, works completely offline, and keeps all data on the local machine - no external provider involved.',
    'The tradeoff: local models are generally less capable than the largest hosted models, and running them requires adequate local CPU/GPU/memory resources.',
    'Ollama exposes a local REST API (default port 11434), which is exactly what the Ollama integration in Spring AI, covered next, connects to.',
    'Ollama fits well for development/testing without API costs, privacy-sensitive use cases, or offline scenarios - not necessarily a universal replacement for a hosted provider.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Expecting a small local model run via Ollama to match the quality of a large hosted model like GPT-4 on every task can lead to disappointing results for complex reasoning - local models genuinely vary widely in capability depending on their size, and choosing an appropriately capable model for the task at hand matters.' },
    { type: 'interview', content: 'Q: What is the fundamental tradeoff between calling a hosted LLM API like OpenAI versus running a model locally via Ollama?\nA: A hosted API offers generally more capable models and no local hardware burden, but costs money per token and requires network access, sending data to an external provider. Ollama runs models entirely locally with zero marginal cost per call, complete offline capability, and full data privacy, but is generally limited to less capable models and requires the local machine to have adequate compute resources to run them well.' },
  ],
}
