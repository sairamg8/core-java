export default {
  id: 'image-options',
  title: '561. Image Options',
  explanation: `\`new ImagePrompt("description")\` from the previous topic (see [[image-prompt-and-response]]) uses every default setting — default model, default size, default quality. This topic covers \`OpenAiImageOptions\`, the equivalent of the \`OpenAiChatOptions\` builder already used to configure temperature and model for text chat (see [[chatclient-builder]]) — same idea, now for image generation.

**The knobs that actually matter, and why each one exists.**
- \`.withModel("dall-e-3")\` — DALL-E has multiple model versions; dall-e-3 produces noticeably higher-quality, more prompt-accurate images than the older dall-e-2, at higher cost per image.
- \`.withWidth(1024).withHeight(1024)\` — the pixel dimensions of the generated image. Not every combination is valid for every model; DALL-E-3 supports specific fixed sizes (square, portrait, landscape), not arbitrary dimensions.
- \`.withQuality("hd")\` — DALL-E-3 specifically offers a "standard" vs "hd" quality setting, trading cost for finer detail.
- \`.withStyle("natural")\` — DALL-E-3 also offers "vivid" (hyper-real, dramatic) vs "natural" (more true-to-life) style, a genuinely different artistic direction, not just a quality difference.
- \`.withN(1)\` — how many image variations to generate from the same prompt in one call, letting a user pick their favorite instead of settling for a single result.

**Passing options alongside the prompt.** \`ImagePrompt\` takes the options object as its second constructor argument: \`new ImagePrompt("description", options)\` — the model then uses those specific settings for that one request, instead of the auto-configured defaults.`,
  code: `import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.openai.OpenAiImageOptions;

public String generateCompanyLogo(String companyDescription) {
    OpenAiImageOptions options = OpenAiImageOptions.builder()
        .withModel("dall-e-3")
        .withWidth(1024)
        .withHeight(1024)
        .withQuality("standard")   // "hd" costs more, higher detail
        .withStyle("natural")      // vs "vivid" for a more dramatic look
        .withN(1)                  // one logo variation per request
        .build();

    ImagePrompt prompt = new ImagePrompt(
        "A simple, modern flat-icon logo for a company: " + companyDescription,
        options
    );

    return imageModel.call(prompt).getResult().getOutput().getUrl();
}`,
  codeTitle: 'Configuring model, size, quality, style, and count with OpenAiImageOptions',
  points: [
    'OpenAiImageOptions configures per-request image generation settings, the same role OpenAiChatOptions plays for text chat.',
    'model selects between DALL-E versions (e.g. dall-e-3 vs dall-e-2) - newer versions cost more but produce noticeably better prompt-following and detail.',
    'width/height set pixel dimensions - not every size is valid for every model, so check the current provider documentation for supported combinations.',
    'quality ("standard" vs "hd") and style ("natural" vs "vivid") are DALL-E-3-specific settings trading cost and artistic direction respectively - style is a different look, not just more/less detail.',
    'n controls how many separate image variations are generated from one prompt in a single call, useful for letting an end user pick a favorite.',
  ],
  callouts: [
    { type: 'analogy', content: 'OpenAiImageOptions is like the order form at a print shop - same base request ("print this photo"), but the form is where you specify paper size, glossy vs matte finish, and how many copies you want.' },
    { type: 'gotcha', content: 'Requesting an unsupported width/height combination for the chosen model results in a runtime error from the provider, not a build-time or compile-time catch - always check the current DALL-E documentation for exactly which sizes each model version accepts before hardcoding dimensions.' },
    { type: 'interview', content: 'Q: What is the difference between the "quality" and "style" options on OpenAiImageOptions for DALL-E-3, and why are they separate settings?\nA: quality ("standard" vs "hd") controls the level of visual detail and fidelity, trading cost for sharper output. style ("natural" vs "vivid") controls artistic direction - natural aims for true-to-life images, vivid produces more hyper-real, dramatic results. They are kept separate because they represent genuinely different trade-offs: one is about fidelity/cost, the other is about aesthetic choice, and a developer may want either combination independently.' },
  ],
}
