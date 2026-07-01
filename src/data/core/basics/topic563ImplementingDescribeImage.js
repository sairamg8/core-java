export default {
  id: 'implementing-describe-image',
  title: '563. Implementing Describe Image',
  explanation: `The previous topic explained *what* image understanding is and *why* it is useful (see [[describe-image]]) — this topic writes the actual working code, using \`ChatClient\`, the same builder-style API already used throughout this course (see [[chatclient-builder]]).

**The key new piece is \`Media\`.** Spring AI's \`Media\` class wraps binary image data together with its MIME type (e.g. \`image/png\`), so the model knows both what bytes it's looking at and what format they're in. It gets attached to the user message via \`.media(...)\`, alongside the text instruction, using the same fluent \`.user(u -> ...)\` builder pattern already familiar from plain text prompts.

**Reading the image bytes themselves is nothing Spring-AI-specific** — a \`Resource\` (Spring's own general-purpose file/byte-source abstraction, e.g. \`ClassPathResource\` for a bundled test image, or a \`MultipartFile\`'s bytes for an uploaded screenshot in the real Job app) is all \`Media\` needs to wrap.

**Why this is genuinely useful for the Job app, not just a demo.** A recruiter uploads a job posting screenshot from another site; the model reads the image and returns a structured description in one round trip — no OCR library, no separate image-processing pipeline needed, because the multimodal model handles both "seeing" and "understanding" together.`,
  code: `import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.content.Media;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.MimeTypeUtils;

public String describeJobPostingScreenshot(ChatClient chatClient) {
    var imageResource = new ClassPathResource("job-posting-screenshot.png");

    Media imageMedia = new Media(MimeTypeUtils.IMAGE_PNG, imageResource);

    String description = chatClient.prompt()
        .user(u -> u
            .text("Extract the job title, company name, and a short summary "
                + "of the description from this job posting screenshot.")
            .media(imageMedia))
        .call()
        .content();

    return description;
}`,
  codeTitle: 'Describing an uploaded image with ChatClient and Media',
  points: [
    'Media wraps binary image data together with its MIME type (e.g. image/png), so the model knows what format the bytes are in.',
    '.media(...) attaches the Media to a ChatClient user message, alongside the .text(...) instruction, using the same fluent builder pattern already used for plain-text prompts.',
    'The image source is just a Spring Resource - a ClassPathResource for a bundled/test image, or bytes from an uploaded MultipartFile in a real web endpoint.',
    'One call to the model handles both "seeing" the image and "understanding" it in context of the instruction - no separate OCR step or image-processing library needed.',
    'The result comes back as a plain String, exactly like every other .call().content() used throughout this course.',
  ],
  callouts: [
    { type: 'gotcha', content: 'The MIME type passed to Media must actually match the image format - passing MimeTypeUtils.IMAGE_PNG for what is actually a JPEG file can cause the model call to fail or misbehave, since it is told to expect bytes in a format that does not match what is actually sent.' },
    { type: 'tip', content: 'Because the instruction text is fully custom, the same describe-image mechanism can do far more than plain description - asking specifically for structured fields ("respond with title, company, location as JSON") turns this into a lightweight image-based data-extraction feature, not just free-text description.' },
    { type: 'interview', content: 'Q: What role does the Media class play when sending an image to a multimodal ChatModel, and where does the image data itself typically come from in a real Spring Boot application?\nA: Media wraps the raw image bytes together with their MIME type, so the model can correctly interpret what format it is receiving. It is attached to a ChatClient user message via .media(...), alongside a text instruction, in the same fluent builder used for plain-text prompts. In a real application, the image bytes usually come from a Spring Resource - most commonly the bytes of an uploaded MultipartFile from a web form, rather than a bundled ClassPathResource used only for local testing.' },
  ],
}
