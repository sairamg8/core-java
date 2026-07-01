export default {
  id: 'audio-transcription-model-stt-part-1',
  title: '565. Audio Transcription Model Speech To Text Part 1',
  explanation: `With the concept introduced (see [[audio-models-introduction]]), this topic wires up \`AudioTranscriptionModel\` for real — the auto-configured, OpenAI-backed implementation is \`OpenAiAudioTranscriptionModel\`, autowired exactly like \`ChatModel\` and \`ImageModel\` before it.

**The request/response pair here follows the exact same naming pattern already seen twice** — \`AudioTranscriptionPrompt\` wraps the input, \`AudioTranscriptionResponse\` holds the result. By now this should feel entirely predictable: every Spring AI model type follows \`SomethingPrompt\` in, \`SomethingResponse\` out.

**What goes into the prompt.** Not text this time — an audio \`Resource\`, the same Spring abstraction used for the image file in the describe-image topic (see [[implementing-describe-image]]): a \`ClassPathResource\` for a bundled test recording, or the bytes of an uploaded audio file in the real Job app (a recruiter's recorded voice memo describing a job opening).

**What comes back.** \`response.getResult().getOutput()\` returns the transcribed text directly as a \`String\` — genuinely the simplest response shape of any model type covered in this course so far, since there's no nested \`Generation\`/\`Message\` wrapping to unpack, just the plain transcribed sentence.`,
  code: `import org.springframework.ai.audio.transcription.AudioTranscriptionPrompt;
import org.springframework.ai.audio.transcription.AudioTranscriptionResponse;
import org.springframework.core.io.ClassPathResource;

public String transcribeJobDescriptionVoiceMemo() {
    var audioResource = new ClassPathResource("job-description-memo.mp3");

    AudioTranscriptionPrompt prompt = new AudioTranscriptionPrompt(audioResource);

    AudioTranscriptionResponse response = audioTranscriptionModel.call(prompt);

    return response.getResult().getOutput(); // plain transcribed text
}`,
  codeTitle: 'Transcribing an audio recording to text',
  points: [
    'OpenAiAudioTranscriptionModel is the auto-configured, Whisper-backed implementation of AudioTranscriptionModel, autowired the same way as ChatModel and ImageModel.',
    'AudioTranscriptionPrompt wraps an audio Resource as input - not text - continuing the same "SomethingPrompt in, SomethingResponse out" pattern used by every Spring AI model type so far.',
    'The audio Resource can be a bundled ClassPathResource for testing, or bytes from a real uploaded audio file (e.g. a recruiter recording of a job description) in production.',
    'response.getResult().getOutput() returns the transcribed text as a plain String - the simplest response shape encountered in this course so far.',
    'This is Part 1 - the next topic continues with more of the transcription flow and its response details.',
  ],
  callouts: [
    { type: 'analogy', content: 'This is exactly like handing a recorded voicemail to a professional transcriptionist and getting back a typed document - the recording goes in, the words come back, with no need to know anything about how they actually listened to it.' },
    { type: 'tip', content: 'Because the underlying model is OpenAI Whisper, transcription quality benefits from the same things that help any speech-recognition system: clear audio, minimal background noise, and a reasonably common language/accent - worth keeping in mind when testing with real recordings rather than a clean sample file.' },
    { type: 'interview', content: 'Q: What does AudioTranscriptionResponse.getResult().getOutput() return, and how does that compare to the response shape of ChatModel or ImageModel?\nA: It returns the transcribed text as a plain String directly. This is simpler than ChatResponse (which wraps a Generation containing an AssistantMessage) or ImageResponse (which wraps an ImageGeneration containing an Image with a URL) - transcription has no need for that extra structure, since there is only ever one plain piece of text to return per audio input.' },
  ],
}
