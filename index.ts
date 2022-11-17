export type { PromptRequest } from "./graphql";
import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  InMemoryCache,
} from "@apollo/client";
import Pusher from "pusher-js";
import { PromptRequest, User } from "./graphql";

export const DEFAULT_URI = "https://www.promptzero.com/api/graphql";

interface PromptZeroConstructor {
  apiKey: string;
  uri: string;
  realTime: boolean;
}

export async function initPromptZero(
  apiKey: string,
  uri = DEFAULT_URI,
  realTime = true
): Promise<PromptZero> {
  const p = new PromptZero({ apiKey, uri, realTime });
  await p.init();
  return p;
}

export interface CacheResultSuccess {
  data: PromptRequest;
  error: null;
}
export interface CacheResultError {
  data: null;
  error: string;
}

export type CacheResult = CacheResultError | CacheResultSuccess;

interface PromptZeroListenCache {
  statusChanges: Record<string, CacheResult>;
}

function apolloToCacheResult(
  result: ApolloQueryResult<{
    requestedPrompt: PromptRequest;
  }>
) {
  const error = result.error;
  if (error === undefined) {
    return {
      error: null,
      data: result.data.requestedPrompt,
    };
  } else {
    return {
      error: error.message,
      data: null,
    };
  }
}

export class PromptZero {
  client: ApolloClient<any>;
  pusher: Pusher;
  userId: string = "";
  updateCache: PromptZeroListenCache = { statusChanges: {} };

  constructor({ apiKey, uri, realTime }: PromptZeroConstructor) {
    this.pusher = new Pusher("8499475eff3faa817087", {
      cluster: "us3",
    });
    this.pusher.signin();
    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      headers: {
        authorization: apiKey,
      },
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
          nextFetchPolicy: "no-cache",
        },
      },
      uri,
    });
  }

  async init() {
    this.userId = (await this.getUser()).data.user.id;
    const channel = this.pusher.subscribe(this.userId);
    channel.bind("status-change", (promptId: string) =>
      this.getPromptResult(promptId)
        .then((result) => {
          this.updateCache.statusChanges[promptId] =
            apolloToCacheResult(result);
        })
        .catch((e) => {
          this.updateCache.statusChanges[promptId] = {
            error: e.message,
            data: null,
          };
        })
    );
  }

  async getUser(): Promise<ApolloQueryResult<{ user: User }>> {
    return await this.client.query({
      query: gql`
        query {
          user {
            id
          }
        }
      `,
    });
  }

  async getPrompts(): Promise<
    ApolloQueryResult<{ requestedPrompts: PromptRequest[] }>
  > {
    return await this.client.query({
      query: gql`
        query {
          requestedPrompts(
            limit: 100
            orderBy: { orderBy: CreatedAt, direction: Dsc }
          ) {
            status
            createdAt
            prompt
            result {
              ... on Result_StableDiffusionV1_4 {
                __typename
                id
                images {
                  url
                }
              }
            }
          }
        }
      `,
    });
  }

  async getPrompt(promptId: string): Promise<ApolloQueryResult<any>> {
    return await this.client.query({
      query: gql`
        query {
          requestedPrompts(
            limit: 100
            orderBy: { orderBy: CreatedAt, direction: Dsc }
          ) {
            status
            createdAt
            result {
              ... on Result_StableDiffusionV1_4 {
                __typename
                id
                images {
                  url
                }
              }
            }
          }
        }
      `,
    });
  }

  async getPromptResult(
    promptId: string
  ): Promise<ApolloQueryResult<{ requestedPrompt: PromptRequest }>> {
    const res = await this.client.query({
      query: gql`
        query Prompt($uuid: String!) {
          requestedPrompt(uuid: $uuid) {
            status
            result {
              ... on Result_StableDiffusionV1_4 {
                __typename
                images {
                  url
                }
              }
            }
          }
        }
      `,
      variables: { uuid: promptId },
    });

    return res;
  }

  async getPromptStatus(promptId: string): Promise<string> {
    const res = await this.client.query({
      query: gql`
        query Prompt($uuid: String!) {
          requestedPrompt(uuid: $uuid) {
            status
          }
        }
      `,
      variables: { uuid: promptId },
    });

    return res.data.requestedPrompt.status;
  }

  async waitOnResult(
    promptId: string,
    timeout: number = 45_000,
    delay: number = 100
  ): Promise<CacheResult> {
    const promptResult = this.updateCache.statusChanges[promptId];
    if (promptResult !== undefined) {
      return promptResult;
    }
    if ((await this.getPromptStatus(promptId)).toLowerCase() === "completed") {
      return apolloToCacheResult(await this.getPromptResult(promptId));
    }
    while (timeout > 0) {
      const promptResult = this.updateCache.statusChanges[promptId];
      if (promptResult !== undefined) {
        return promptResult;
      }
      await new Promise((f) => setTimeout(f, delay));
      timeout -= delay;
    }
    if ((await this.getPromptStatus(promptId)).toLowerCase() === "completed") {
      return apolloToCacheResult(await this.getPromptResult(promptId));
    }
    return { data: null, error: "timeout" };
  }

  async requestNewPrompt(prompt: string): Promise<any> {
    return await this.client.mutate({
      mutation: gql`
        mutation Prompt($prompt: String!) {
          requestNewPrompt(
            body: { stableDiffusionV1_4: { action: txt2img, prompt: $prompt } }
          ) {
            id
            prompt
          }
        }
      `,
      variables: { prompt },
    });
  }
}
