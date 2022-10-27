"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptZero = void 0;
const client_1 = require("@apollo/client");
class PromptZero {
    constructor(apiKey, uri = "https://www.promptzero.com/api/graphql") {
        this.client = new client_1.ApolloClient({
            cache: new client_1.InMemoryCache(),
            headers: {
                authorization: apiKey,
            },
            uri
        });
    }
    async getPrompts() {
        return await this.client
            .query({
            query: (0, client_1.gql) `
                query {
                    requestedPrompts(limit: 100, orderBy:{orderBy:CreatedAt, direction: Dsc}) {
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
        return await this.client
            .query({
            query: (0, client_1.gql) `
                query {
                    requestedPrompts(limit: 100, orderBy:{orderBy:CreatedAt, direction: Dsc}) {
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
        const res = await this.client
            .query({
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
                }`,
            variables: { uuid: promptId }
        });
        return res;
    }
    async getPromptStatus(promptId) {
        const res = await this.client
            .query({
            query: (0, client_1.gql) `
                query Prompt($uuid: String!) {
                    requestedPrompt(uuid: $uuid) {
                    status
                    }
                }`,
            variables: { uuid: promptId },
            fetchPolicy: "no-cache"
        });
        return res.data.requestedPrompt.status;
    }
    async requestNewPrompt(prompt) {
        return await this.client
            .mutate({
            mutation: (0, client_1.gql) `
                mutation Prompt($prompt: String!) {
                    requestNewPrompt(
                        body: {
                        stableDiffusionV1_4: {
                            action: txt2img
                            prompt: $prompt
                        }
                        }
                    ) {
                        id
                        prompt
                    }
                    }
                `,
            variables: { prompt }
        });
    }
}
exports.PromptZero = PromptZero;
