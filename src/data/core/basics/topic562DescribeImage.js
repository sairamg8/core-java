export default {
  id: 'describe-image',
  title: '562. Describe Image',
  explanation: `Every topic so far in this chapter has gone one direction: text in, image out (see [[image-options]]). This topic flips it around entirely: **image in, text out** — asking a model to look at a picture and describe or answer questions about it. This is not the \`ImageModel\` used previously; this is the same \`ChatModel\`/\`ChatClient\` already used for ordinary conversation (see [[working-with-chatclient]]), because modern chat models like GPT-4o are **multimodal** — they can accept images as part of the input message, not just text.

**A concrete Job app use case, to make this less abstract.** A recruiter uploads a screenshot of a job posting from another site to quickly create a matching listing in the Job app. Instead of the recruiter manually retyping the title, company, and description, the app sends the screenshot to a multimodal chat model and asks it to extract and describe that information — a genuinely time-saving feature, not a toy demo.

**The mechanism, at a conceptual level before the next topic's actual code.** A regular \`UserMessage\` normally just carries text. A multimodal message additionally carries \`Media\` — the image data, alongside the instruction telling the model what to do with it (e.g. "describe what job posting details are in this image"). The model processes both together in one call and responds in plain text, exactly like any other chat response.`,
  code: `// Conceptual shape - the previous "text in, image out" flow reversed:

// Before (image generation):
//   ImagePrompt("a robot holding a resume") -> ImageModel -> image URL

// Now (image understanding):
//   UserMessage("what job details are in this image?") + image data
//     -> ChatModel -> text description

// The actual Media + ChatClient wiring is covered in the next topic,
// once this conceptual shift - same ChatModel, new kind of input - is clear.`,
  codeTitle: 'The conceptual shift: image generation vs. image understanding',
  points: [
    'Describing an image uses the same ChatModel/ChatClient as ordinary text conversation - not ImageModel, which is only for generating new images from text.',
    'This works because modern chat models (like GPT-4o) are multimodal - they accept images as part of the input message, alongside or instead of text.',
    'A realistic use case: a recruiter uploads a screenshot of a job posting, and the model extracts/describes the title, company, and description automatically.',
    'The mechanism is a chat message that carries both an instruction ("describe what is in this image") and image data (Media), processed together in a single model call.',
    'The response comes back as ordinary text, exactly like any other ChatResponse - there is nothing special about how the output is read.',
  ],
  callouts: [
    { type: 'analogy', content: 'Think of it like showing a photo to a knowledgeable friend and asking "what does this say?" - the ask is not to draw something new (that is image generation); the ask is to look at something that already exists and describe it in words.' },
    { type: 'gotcha', content: 'Reaching for ImageModel to "read" an image is a common mix-up - ImageModel only generates new images from text descriptions. Understanding or describing an existing image is a ChatModel capability, using a multimodal-capable model.' },
    { type: 'interview', content: 'Q: Why does describing an existing image use ChatModel instead of ImageModel, even though both deal with images?\nA: ImageModel is specifically for text-to-image generation - text description in, new image out. Describing an existing image is the reverse direction: an image goes in as part of the input, and text comes out - which is exactly what a multimodal ChatModel does, since models like GPT-4o can accept images as part of a chat message alongside text instructions. ImageModel has no capability to accept an image as input at all.' },
  ],
}
