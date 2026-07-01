export default {
  id: 'audio-models-introduction',
  title: '564. Audio Models Introduction',
  explanation: `This chapter has now covered two model types beyond plain text: image generation (see [[image-options]]) and image understanding (see [[implementing-describe-image]]). This topic opens a third category: **audio** — and specifically, the two directions audio can go, each with its own dedicated Spring AI interface.

**Speech-to-Text (transcription): \`AudioTranscriptionModel\`.** Audio comes in, text comes out. Concretely: a recruiter records a 30-second voice memo describing a job opening instead of typing it, and the app transcribes that recording into text automatically.

**Text-to-Speech (TTS): \`AudioSpeechModel\`.** Text comes in, audio comes out — the reverse direction. Concretely: a job posting's description gets read aloud, so a candidate can listen to it while commuting instead of reading.

**Why this maps onto two separate interfaces, not one.** This mirrors exactly the same split already seen with images: \`ImageModel\` (text → image) and multimodal \`ChatModel\` (image → text) were two distinct capabilities, not one interface handling both directions. Audio follows the identical pattern — because the input and output shapes are completely different (bytes vs. text) in each direction, keeping them as separate interfaces keeps each one's contract simple and specific.

**Both are OpenAI-backed, same as everything else in this chapter** — \`OpenAiAudioTranscriptionModel\` uses OpenAI's Whisper model under the hood; \`OpenAiAudioSpeechModel\` uses OpenAI's TTS models. Both are auto-configured the same way \`ImageModel\` was — the OpenAI starter dependency plus an API key is all that's needed (see [[openai-image-model]]).`,
  code: `// Two separate audio interfaces, mirroring the image-generation vs.
// image-understanding split already seen earlier in this chapter:

// AudioTranscriptionModel  ->  audio bytes IN,  text OUT   (speech-to-text)
// AudioSpeechModel         ->  text IN,         audio OUT  (text-to-speech)

// Both auto-configured by the OpenAI starter, same as ImageModel and ChatModel.`,
  codeTitle: 'The two audio directions, at a glance',
  points: [
    'Spring AI covers two distinct audio directions, each with its own interface: AudioTranscriptionModel (speech-to-text) and AudioSpeechModel (text-to-speech).',
    'AudioTranscriptionModel takes audio input and returns text - useful for turning a recorded voice memo into a typed job description.',
    'AudioSpeechModel takes text input and returns audio - useful for reading a job posting description aloud for a candidate.',
    'This two-interface split mirrors the earlier image pattern: ImageModel and multimodal ChatModel were also two separate capabilities for two separate directions, not one interface for both.',
    'Both audio interfaces are OpenAI-backed (Whisper for transcription, OpenAI TTS for speech) and auto-configured the same way as ImageModel - just the starter dependency and API key.',
  ],
  callouts: [
    { type: 'analogy', content: 'Think of a person who can both write down what they hear (transcription) and read a document aloud (speech). Those are two different skills performed by the same person, but you would never confuse "please write down what I just said" with "please read this out loud" - they are opposite directions, and Spring AI keeps them as two separate interfaces for exactly that reason.' },
    { type: 'note', content: 'This topic is intentionally conceptual - the next topics implement AudioTranscriptionModel first (speech-to-text), and AudioSpeechModel later (text-to-speech), each with working code.' },
    { type: 'interview', content: 'Q: Why does Spring AI provide two separate interfaces for audio (AudioTranscriptionModel and AudioSpeechModel) instead of one combined audio interface?\nA: The two directions have completely different input/output shapes - transcription takes audio bytes in and produces text, while speech synthesis takes text in and produces audio bytes. Keeping them as separate interfaces keeps each contract simple and specific, mirroring the same design decision already made for images, where ImageModel (text-to-image) and multimodal ChatModel (image-to-text) are also two distinct interfaces rather than one that tries to handle both directions.' },
  ],
}
