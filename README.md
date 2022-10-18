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
console.log(newPrompt.data.requestNewPrompt.id);

// Right now you will have to poll for the
// result until we implement webhooks. (coming soon!)
for (let i = 0; i < 10; i++) {
  const status = await promptZero.getPromptStatus(promptId);
  console.log(status);
  if (status.toLowerCase() === "completed") {
    break;
  }
  await new Promise((f) => setTimeout(f, 3000));
}

const result = await promptZero.getPromptResult(promptId);
console.log(result.data.requestedPrompt.result.images);
```
