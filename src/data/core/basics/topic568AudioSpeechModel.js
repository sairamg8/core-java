export default {
  id: 'audio-speech-model',
  title: '568. Audio Speech Model (TTS)',
  explanation: `This chapter's audio pair is now complete on one side — transcription (speech-to-text) covered fully across the previous three topics (see [[audio-transcription-options]]). This topic covers the other direction introduced back in the audio overview (see [[audio-models-introduction]]): \`AudioSpeechModel\`, **text-to-speech (TTS)** — converting a job posting's written description into an actual spoken audio clip.

**Same request/response naming pattern as every model type in this chapter** — \`SpeechPrompt\` wraps the input text, \`SpeechResponse\` holds the result. By this point in the chapter, that pattern should need no further explanation.

**What actually comes back is genuinely different from every previous response type.** Not a URL (like \`ImageResponse\`), not a String (like \`AudioTranscriptionResponse\`) — \`response.getResult().getOutput()\` returns a raw \`byte[]\`: actual audio file bytes, ready to be written straight to disk, streamed back over HTTP, or played directly, depending on where the feature lives.

**A concrete, realistic Job app feature this enables.** A candidate browsing job listings on their phone during a commute taps "listen to this posting" instead of reading it — the job description text goes to \`AudioSpeechModel\`, and the returned audio bytes get streamed back to the browser or app as playable audio, no separate text-to-speech service or library needed beyond what Spring AI already provides.`,
  code: `import org.springframework.ai.audio.speech.SpeechPrompt;
import org.springframework.ai.audio.speech.SpeechResponse;

public byte[] readJobPostingAloud(String jobDescriptionText) {
    SpeechPrompt speechPrompt = new SpeechPrompt(jobDescriptionText);

    SpeechResponse response = audioSpeechModel.call(speechPrompt);

    return response.getResult().getOutput(); // raw audio bytes, e.g. MP3
}`,
  codeTitle: 'Converting job posting text into playable audio bytes',
  points: [
    'AudioSpeechModel is the text-to-speech counterpart to AudioTranscriptionModel - text goes in, audio comes out, the reverse direction of transcription.',
    'SpeechPrompt and SpeechResponse follow the same naming pattern as every other model type covered in this chapter - by now, a genuinely predictable convention.',
    'response.getResult().getOutput() returns a raw byte[] of actual audio data - unlike a URL (images) or a String (transcription), this is the audio file content itself.',
    'Those bytes can be written to a file, streamed over an HTTP response, or played back directly, depending on where the feature is used.',
    'A realistic use case: converting a job posting text description into a "listen to this posting" audio feature for candidates browsing on the go.',
  ],
  callouts: [
    { type: 'analogy', content: 'This is the mirror image of the transcription feature from earlier in this chapter - instead of "turn what someone said into text," it is "turn this text into someone (an AI voice) saying it." Same two ingredients, text and audio, just flowing in opposite directions.' },
    { type: 'gotcha', content: 'Because the response is raw bytes rather than a String, forgetting to set the correct audio content type (e.g. audio/mpeg) when streaming it back over an HTTP response is an easy mistake - the browser or client needs that header to know how to play the bytes it receives.' },
    { type: 'interview', content: 'Q: What does AudioSpeechModel return, and how does that response shape differ from both AudioTranscriptionModel and ImageModel?\nA: AudioSpeechModel.call() returns a SpeechResponse whose getResult().getOutput() is a raw byte[] of actual audio data. This differs from AudioTranscriptionModel, whose output is a plain String of transcribed text, and from ImageModel, whose output is a URL pointing to a hosted generated image rather than actual image bytes. Each model type response shape reflects what it most naturally produces: text, a link, or raw binary audio, respectively.' },
  ],
}
