export default {
  id: 'openai-image-model',
  title: '559. OpenAI Image Model',
  explanation: `So far, every Spring AI topic in this course has been about **text in, text out** — you send a question, the model sends back words (see [[spring-ai-introduction]]). This topic introduces something different: sending a **description in text, and getting an actual image back**. Think of it like commissioning an artist over email — you describe what you want ("a friendly cartoon robot holding a résumé"), and instead of writing back, the artist sends you a picture.

**The Spring AI interface for this is \`ImageModel\`** — deliberately parallel to \`ChatModel\`, the interface already used for every text conversation so far. Spring AI's whole design philosophy is: once you understand one model type, the others feel familiar, because they all follow the same request → model → response shape.

**Getting it autowired needs almost nothing new.** With the \`spring-ai-openai-spring-boot-starter\` dependency already on the classpath (see [[creating-a-spring-ai-project]]) and your OpenAI API key already configured (see [[create-openai-api-key]]), Spring Boot auto-configures an \`ImageModel\` bean for you — specifically an \`OpenAiImageModel\`, OpenAI's implementation of that interface, backed by their DALL-E models. You just \`@Autowired\` it like any other bean.

**Where this fits into the Job app used throughout this course.** Imagine a "generate a placeholder company logo" feature when a recruiter creates a new company profile with no logo uploaded yet — that's a genuine, realistic use for an \`ImageModel\`, and exactly the kind of feature the next two topics build.`,
  code: `import org.springframework.ai.image.ImageModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LogoGeneratorService {

    private final ImageModel imageModel;

    // Spring Boot auto-configures this bean once the OpenAI starter
    // and API key are on the classpath - no manual bean setup needed.
    @Autowired
    public LogoGeneratorService(ImageModel imageModel) {
        this.imageModel = imageModel;
    }
}`,
  codeTitle: 'Autowiring the auto-configured ImageModel bean',
  points: [
    'ImageModel is the Spring AI interface for text-to-image generation - it mirrors ChatModel on purpose, so the same mental model (request in, response out) applies.',
    'OpenAiImageModel is the OpenAI implementation, auto-configured by Spring Boot once the OpenAI starter dependency and API key are present - no manual @Bean needed.',
    'Nothing about ImageModel replaces ChatModel - an application typically uses both, for different jobs (conversation vs. image generation).',
    'The underlying provider is DALL-E, the same OpenAI image-generation model used behind the ChatGPT image feature.',
    'This topic only covers getting the bean wired up - actually sending a prompt and reading back a generated image is the next topic.',
  ],
  callouts: [
    { type: 'analogy', content: 'Think of ImageModel like ordering a custom cake instead of chatting with a baker. With ChatModel, you have a back-and-forth conversation. With ImageModel, you place one order (a text description) and get back one finished result (an image) - no conversation, just a request and a delivery.' },
    { type: 'gotcha', content: 'Having both a ChatModel bean and an ImageModel bean auto-configured at the same time is normal and expected - they are separate beans for separate jobs, not alternatives to choose between.' },
    { type: 'interview', content: 'Q: What is ImageModel in Spring AI, and how does its design relate to ChatModel?\nA: ImageModel is the Spring AI interface for text-to-image generation, deliberately designed to parallel the ChatModel request-in/response-out shape. Once a developer understands ChatModel for text conversations, ImageModel feels familiar for image generation - same pattern, different media type. OpenAiImageModel is the OpenAI-backed implementation, auto-configured by Spring Boot when the OpenAI starter and API key are present.' },
  ],
}
