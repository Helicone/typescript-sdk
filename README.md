# Install

```
yarn add promptzero
```

# Example

Here is an example

```typescript
import { PromptZero } from "promptzero";

const promptZero = new PromptZero("<KEY>");

const newPrompt = await promptZero.requestNewPrompt("cheese");
const promptId = newPrompt.data.requestNewPrompt.id;
const { error, data } = await promptZero.waitOnResult(promptId);
if (error !== null) {
  console.error("error:", error);
} else {
  if (data.result?.__typename === "Result_StableDiffusionV1_4") {
    console.log(data.result.images);
  }
}
```
