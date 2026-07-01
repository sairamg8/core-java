export default {
  id: 'image-prompt-and-response',
  title: '560. Image Prompt and Response',
  explanation: `With the \`ImageModel\` bean autowired (see [[openai-image-model]]), this topic actually generates an image — the two objects involved are named to mirror \`Prompt\` and \`ChatResponse\`, the exact pair already familiar from text chat (see [[working-with-chatclient]]): here they are \`ImagePrompt\` and \`ImageResponse\`.

**Building the request.** \`new ImagePrompt("your description here")\` wraps the plain-text description — the same description a human would type into any AI image generator. Calling \`imageModel.call(imagePrompt)\` sends it and blocks until the image is ready (image generation genuinely takes a few seconds, unlike a fast text reply).

**Reading the result back.** \`ImageResponse\` holds one or more \`ImageGeneration\` results (usually one, unless you asked for several — covered in the next topic). Each \`ImageGeneration\` has a \`getOutput()\` method returning an \`Image\` object, and that \`Image\` has \`getUrl()\` — a URL where OpenAI is temporarily hosting the generated picture. Note what is *not* returned: the raw image bytes. You get a link to download or display, not the file itself, directly in the response.

**Why a URL, not raw bytes, matters practically.** DALL-E-hosted URLs expire after a period of time (OpenAI's docs specify this) — if the Job app needs the logo to persist (e.g. show up again tomorrow on the company profile), the application must download the image from that URL and save it somewhere durable, such as a database or cloud storage, immediately after generation, not defer it.`,
  code: `import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;

public String generateCompanyLogo(String companyDescription) {
    ImagePrompt prompt = new ImagePrompt(
        "A simple, modern flat-icon logo for a company: " + companyDescription
    );

    ImageResponse response = imageModel.call(prompt);

    // getResult() returns the first (and usually only) ImageGeneration
    String imageUrl = response.getResult().getOutput().getUrl();

    return imageUrl; // temporary URL - download and store it if it needs to persist
}`,
  codeTitle: 'Generating an image and reading back its URL',
  points: [
    'ImagePrompt wraps the text description of the desired image - the same plain-language description a human would type into any image generator.',
    'imageModel.call(imagePrompt) sends the request and returns an ImageResponse once the image has been generated - this takes noticeably longer than a text ChatResponse.',
    'ImageResponse.getResult().getOutput().getUrl() retrieves a URL to the generated image, not the raw image bytes.',
    'That URL is temporary - OpenAI expires hosted generated images after a period of time, so any application that needs the image to persist must download and store it right after generation.',
    'The overall shape - build a request object, call the model, read a typed response object - is identical to the ChatModel/ChatResponse pattern used throughout the earlier Spring AI topics.',
  ],
  callouts: [
    { type: 'analogy', content: 'Getting back a URL instead of the image itself is like a photo booth handing you a claim ticket instead of the printed photo - the photo exists and is ready, but you need to go pick it up (download it) before the booth throws it away.' },
    { type: 'gotcha', content: 'Treating the returned URL as permanent storage is a common early mistake - if the Job app displays a "company logo" days later using a URL saved straight from the ImageResponse, it will likely be broken by then. Download and store the image (e.g. to a database blob, or cloud storage like S3) immediately after generation if it needs to last.' },
    { type: 'interview', content: 'Q: After calling imageModel.call(imagePrompt), what does the ImageResponse actually contain, and what must a developer do if the generated image needs to persist long-term?\nA: ImageResponse.getResult().getOutput().getUrl() returns a temporary URL to the generated image, not the raw image bytes. Because OpenAI expires these hosted URLs after a period of time, an application that needs the image to persist must download it from that URL and save it to durable storage (a database, cloud storage, etc.) immediately after generation, rather than relying on the URL staying valid.' },
  ],
}
