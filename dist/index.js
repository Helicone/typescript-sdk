"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptZero = exports.initPromptZero = exports.DEFAULT_URI = void 0;
const client_1 = require("@apollo/client");
const pusher_js_1 = __importDefault(require("pusher-js"));
exports.DEFAULT_URI = "https://www.promptzero.com/api/graphql";
async function initPromptZero(apiKey, uri = exports.DEFAULT_URI, realTime = true) {
    const p = new PromptZero({ apiKey, uri, realTime });
    await p.init();
    return p;
}
exports.initPromptZero = initPromptZero;
function apolloToCacheResult(result) {
    const error = result.error;
    if (error === undefined) {
        return {
            error: null,
            data: result.data.requestedPrompt,
        };
    }
    else {
        return {
            error: error.message,
            data: null,
        };
    }
}
class PromptZero {
    constructor({ apiKey, uri, realTime }) {
        this.userId = "";
        this.updateCache = { statusChanges: {} };
        this.pusher = new pusher_js_1.default("8499475eff3faa817087", {
            cluster: "us3",
        });
        this.pusher.signin();
        this.client = new client_1.ApolloClient({
            cache: new client_1.InMemoryCache(),
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
        channel.bind("status-change", (promptId) => this.getPromptResult(promptId)
            .then((result) => {
            this.updateCache.statusChanges[promptId] =
                apolloToCacheResult(result);
        })
            .catch((e) => {
            this.updateCache.statusChanges[promptId] = {
                error: e.message,
                data: null,
            };
        }));
    }
    async getUser() {
        return await this.client.query({
            query: (0, client_1.gql) `
        query {
          user {
            id
          }
        }
      `,
        });
    }
    async getPrompts() {
        return await this.client.query({
            query: (0, client_1.gql) `
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
    async getPrompt(promptId) {
        return await this.client.query({
            query: (0, client_1.gql) `
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
    async getPromptResult(promptId) {
        const res = await this.client.query({
            query: (0, client_1.gql) `
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
    async getPromptStatus(promptId) {
        const res = await this.client.query({
            query: (0, client_1.gql) `
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
    async waitOnResult(promptId, timeout = 45000, delay = 100) {
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
    async requestNewPrompt(prompt) {
        return await this.client.mutate({
            mutation: (0, client_1.gql) `
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
exports.PromptZero = PromptZero;
