# Install

```
yarn add promptzero
```

# Example

Here is an example

```typescript
import { initPromptZero } from "promptzero";

const promptZero = await initPromptZero("ROJKSLA-NG4EIAA-RE4P2QA-HFXMG5Y");

const newPrompt = await promptZero.requestNewPrompt("cheese");
const promptId = newPrompt.data.requestNewPrompt.id;
const { error, data } = await promptZero.waitOnResult(promptId);
if (error !== null) {
  console.error("error:", error);
} else {
  if (data.result?.__typename === "Result_StableDiffusionV1_4") {
    console.log(data.result.images.map((i) => i.url));
  }
}
```
