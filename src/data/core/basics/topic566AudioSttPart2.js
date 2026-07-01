export default {
  id: 'audio-stt-part-2',
  title: '566. Audio STT Part 2 (Speech-to-Text)',
  explanation: `Part 1 (see [[audio-transcription-model-stt-part-1]]) transcribed a bundled test file — this topic wires the same \`AudioTranscriptionModel\` call into an actual REST endpoint, so a recruiter can upload a real voice memo through the Job app's UI, the same way file uploads have been handled elsewhere in this course.

**The only genuinely new piece is \`MultipartFile\`**, Spring's standard abstraction for an uploaded file in a web request — already familiar if resume or logo uploads were covered elsewhere in this course; the only new detail here is that \`MultipartFile\` itself is not a \`Resource\`, so it needs one line of adapting: \`multipartFile.getResource()\`, which Spring provides for exactly this purpose.

**Why the controller method should be \`@PostMapping\`, not \`@GetMapping\`.** Uploading a file is a state-changing-adjacent request carrying a payload (the audio bytes), which is squarely what POST is for — this is the same REST convention already established for any endpoint accepting a request body (see [[what-is-rest]]), just with a file payload instead of JSON.

**End-to-end, this closes the loop opened in the very first audio topic** (see [[audio-models-introduction]]): a recruiter records a voice memo describing a job opening, uploads it through the Job app UI, and the transcribed text comes back ready to prefill a new job posting form — a complete, realistic feature, not just an isolated code snippet.`,
  code: `import org.springframework.ai.audio.transcription.AudioTranscriptionPrompt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class JobDescriptionAudioController {

    private final AudioTranscriptionModel audioTranscriptionModel;

    public JobDescriptionAudioController(AudioTranscriptionModel audioTranscriptionModel) {
        this.audioTranscriptionModel = audioTranscriptionModel;
    }

    @PostMapping("/api/jobs/transcribe-description")
    public String transcribeUploadedMemo(@RequestParam("audio") MultipartFile audioFile) {
        // MultipartFile isn't a Resource itself - adapt it with getResource()
        var prompt = new AudioTranscriptionPrompt(audioFile.getResource());

        return audioTranscriptionModel.call(prompt).getResult().getOutput();
    }
}`,
  codeTitle: 'A real upload-and-transcribe REST endpoint',
  points: [
    'MultipartFile is the standard Spring representation of an uploaded file in a web request - the same abstraction used for any file upload feature, not something audio-specific.',
    'MultipartFile.getResource() adapts it into a Resource, which is what AudioTranscriptionPrompt actually needs - this is the one new piece of wiring beyond Part 1.',
    'The endpoint is @PostMapping because it carries a payload (the audio file) - the same REST convention used for any request body, not a special rule for audio.',
    'This closes the loop from the introduction topic: recruiter records a memo, uploads it, gets back transcribed text ready to prefill a job posting form.',
    'Nothing about calling the model itself changes from Part 1 - only the source of the audio (an uploaded file vs. a bundled test file) is different.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Forgetting @RequestParam("audio") to match the actual form field/part name the client sends is a common source of a confusing 400 error on file upload endpoints - the parameter name in the annotation must match the name used on the client side exactly.' },
    { type: 'tip', content: 'Returning the raw transcribed String directly from the controller, as shown here, is fine for a quick working example - a production version would more likely wrap it in a small response DTO (e.g. { "transcribedText": "..." }) for consistency with the rest of the JSON API shape used elsewhere in the app.' },
    { type: 'interview', content: 'Q: Why does a file-upload endpoint that accepts a MultipartFile need an extra adapting step before it can be used with AudioTranscriptionPrompt?\nA: AudioTranscriptionPrompt expects a Spring Resource, and MultipartFile is not itself a Resource - it is a separate abstraction representing an uploaded file within a web request. Spring provides MultipartFile.getResource() specifically to bridge the two, converting the uploaded file into the Resource type the transcription model actually requires.' },
  ],
}
