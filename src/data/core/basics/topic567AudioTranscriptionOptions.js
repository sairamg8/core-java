export default {
  id: 'audio-transcription-options',
  title: '567. Audio Transcription Options',
  explanation: `Both transcription topics so far used every default setting (see [[audio-stt-part-2]]). This topic covers \`OpenAiAudioTranscriptionOptions\` — the same configuration pattern already seen for chat (\`OpenAiChatOptions\`) and images (\`OpenAiImageOptions\`), now for transcription.

**The settings that actually matter in practice.**
- \`.withModel("whisper-1")\` — OpenAI's speech-to-text model name; unlike chat and image, there's currently just the one model to choose here, but it's still passed explicitly rather than assumed.
- \`.withLanguage("en")\` — telling Whisper the spoken language in advance measurably improves accuracy and speed versus letting it auto-detect, especially for shorter recordings where there isn't much audio for auto-detection to work with.
- \`.withPrompt(...)\` — an optional hint about expected vocabulary, genuinely useful for domain-specific terms. For the Job app, something like \`"Job titles, tech stack names like Spring Boot and Kubernetes, salary ranges"\` measurably improves accuracy on words Whisper might otherwise mishear as something more common.
- \`.withResponseFormat(...)\` — plain text is the default and simplest, but formats like \`verbose_json\` return per-segment timestamps too, useful if a feature ever needs to sync transcribed text to specific moments in the audio (e.g. a "jump to where they said this" feature) - not needed for a simple transcribe-and-prefill feature, but good to know it exists.
- \`.withTemperature(0.0)\` — lower values make the transcription more deterministic and literal; for transcribing spoken facts (a job title, a company name) rather than generating creative text, keeping this low or at its default is almost always the right choice.

**Passing options works exactly like the earlier examples** — as a second argument to the prompt constructor: \`new AudioTranscriptionPrompt(resource, options)\`.`,
  code: `import org.springframework.ai.audio.transcription.AudioTranscriptionPrompt;
import org.springframework.ai.openai.OpenAiAudioTranscriptionOptions;
import org.springframework.ai.openai.api.OpenAiAudioApi;

public String transcribeWithOptions(Resource audioResource) {
    var options = OpenAiAudioTranscriptionOptions.builder()
        .withModel("whisper-1")
        .withLanguage("en")
        .withPrompt("Job titles, tech stack names like Spring Boot and Kubernetes, salary ranges")
        .withResponseFormat(OpenAiAudioApi.TranscriptResponseFormat.TEXT)
        .withTemperature(0f)
        .build();

    var prompt = new AudioTranscriptionPrompt(audioResource, options);

    return audioTranscriptionModel.call(prompt).getResult().getOutput();
}`,
  codeTitle: 'Configuring transcription with language hints and a domain vocabulary prompt',
  points: [
    'OpenAiAudioTranscriptionOptions follows the same configuration pattern already used for OpenAiChatOptions and OpenAiImageOptions - a builder passed alongside the actual request.',
    'Specifying the spoken language ahead of time (e.g. "en") measurably improves both accuracy and speed compared to letting Whisper auto-detect it, especially on short recordings.',
    'The optional prompt setting hints at expected vocabulary - genuinely useful for domain-specific terms like technical job titles or company names that a general model might otherwise mishear.',
    'responseFormat defaults to plain text but can return richer output like per-segment timestamps (verbose_json), useful for features that need to sync text back to a moment in the audio.',
    'Keeping temperature low (or at its default) suits transcription, since the goal is an accurate literal transcript of spoken facts, not creative or varied text generation.',
  ],
  callouts: [
    { type: 'tip', content: 'The prompt option for domain vocabulary is one of the most underused settings for real applications - a short list of expected proper nouns/jargon can noticeably reduce mistranscriptions of exactly the words that matter most for a specific use case, like technical job titles.' },
    { type: 'gotcha', content: 'Leaving the language unset does still work (Whisper attempts auto-detection), but for short recordings especially, explicitly setting it produces measurably better results - do not assume auto-detect is "good enough by default" once transcription accuracy actually matters for a feature.' },
    { type: 'interview', content: 'Q: Why would a developer set the language and prompt options on OpenAiAudioTranscriptionOptions rather than relying on the Whisper defaults?\nA: Explicitly setting the spoken language improves both accuracy and speed versus auto-detection, which is especially unreliable on short audio clips with limited signal to work from. The prompt option hints at expected vocabulary - domain-specific terms like technical job titles or company names - which reduces the chance the model mishears them as more common, unrelated words. Both are low-cost settings that measurably improve real-world transcription quality for a specific application content.' },
  ],
}
