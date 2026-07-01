export default {
  id: 'chatresponse-and-metadata',
  title: '537. ChatResponse and Metadata',
  explanation: `Every example so far ends with \`.content()\` (see [[working-with-chatclient]]), extracting just the plain text answer and discarding everything else — this topic looks at what \`.content()\` was actually throwing away: the full \`ChatResponse\`, which carries real, useful information beyond the answer text itself.

**Getting the full response instead of just its content:**
\`\`\`java
ChatResponse response = chatClient.prompt()
    .user(question)
    .call()
    .chatResponse();   // not .content() - the full response object

String answer = response.getResult().getOutput().getText();
\`\`\`

**What \`ChatResponse\` actually carries, beyond the answer text — the specific reasons this matters for a real production feature, not just curiosity.**
- **Token usage** (\`response.getMetadata().getUsage()\`) — how many tokens the prompt and response consumed, which matters directly for **cost tracking**, since OpenAI bills per token
- **Finish reason** — why the model stopped generating: \`STOP\` (completed naturally), \`LENGTH\` (hit a token limit mid-response, meaning the answer might be truncated), or others — a genuinely important signal for detecting an incomplete response that \`.content()\` alone would silently hide
- **Model name actually used** — useful when a request could be routed to different model versions

**A concrete, realistic use for finish reason — why "just check the text looks reasonable" isn't a reliable substitute for checking this metadata explicitly.**
\`\`\`java
if (response.getResult().getMetadata().getFinishReason().equals("LENGTH")) {
    log.warn("Response was truncated - consider increasing max tokens");
}
\`\`\`
A response cut off mid-sentence due to a token limit can still look superficially plausible as text — reading \`finishReason\` explicitly is the reliable way to detect this, rather than trying to guess from the text alone whether it was actually cut short.

**Why \`.content()\` remains the right choice for the simple cases covered so far, and this fuller \`ChatResponse\` access is introduced only now, not earlier.** Every topic before this one was deliberately about the simplest possible interaction — introducing metadata inspection earlier would have added a layer of ceremony to examples that didn't need it yet. This topic exists specifically because the next several topics in this chapter (particularly cost-sensitive production use, and anything checking for truncation) genuinely need this fuller access.`,
  code: `ChatResponse response = chatClient.prompt()
    .user(question)
    .call()
    .chatResponse();

String answer = response.getResult().getOutput().getText();
String finishReason = response.getResult().getMetadata().getFinishReason();
Usage usage = response.getMetadata().getUsage();

if ("LENGTH".equals(finishReason)) {
    log.warn("Response was truncated - consider increasing max tokens");
}
log.info("Tokens used: {} prompt + {} completion",
    usage.getPromptTokens(), usage.getCompletionTokens());`,
  codeTitle: 'Reading finish reason and token usage from the full ChatResponse',
  points: [
    '.chatResponse() returns the full ChatResponse object, versus .content() which extracts only the plain answer text and discards everything else.',
    'ChatResponse carries token usage (for cost tracking, since OpenAI bills per token), finish reason (why generation stopped), and which model actually handled the request.',
    'Finish reason LENGTH signals the response may have been truncated mid-generation - a signal .content() alone silently hides, and one that plain text inspection cannot reliably detect on its own.',
    'Token usage metadata is the concrete mechanism for tracking real API cost per request, directly relevant given that leaked or overused API keys were flagged as a real financial risk in an earlier topic.',
    'Metadata inspection is introduced only now, after several simpler topics, since earlier examples were deliberately about the simplest possible interaction and did not yet need this fuller access.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming a response "looks complete" just by reading the text is not a reliable way to detect truncation - a response cut off exactly at a token limit can still end on what looks like a plausible sentence boundary; checking finishReason explicitly is the only reliable signal, not eyeballing the text.' },
    { type: 'interview', content: 'Q: Why would a Spring AI application need to inspect the full ChatResponse rather than just calling .content() to get the answer text?\nA: The full ChatResponse carries metadata .content() discards - token usage (needed for tracking real API cost, since providers bill per token) and finish reason (whether the response completed naturally or was truncated due to a token limit). A truncated response can still look superficially plausible as plain text, so reading finishReason explicitly is the reliable way to detect that, rather than assuming completeness from the text alone.' },
  ],
}
