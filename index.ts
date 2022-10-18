import { ApolloClient, ApolloQueryResult, gql, InMemoryCache } from "@apollo/client";

export class PromptZero {
    client: ApolloClient<any>;
    
    constructor(apiKey: string, uri: string = "https://www.promptzero.com/api/graphql") {
        this.client = new ApolloClient({
            cache: new InMemoryCache(),
            headers: {
                authorization: apiKey,
            },
            uri
            });
    }
    async getPrompts(): Promise<ApolloQueryResult<any>> {
        return await this.client
            .query({
                query: gql`
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

    async getPrompt(promptId: string): Promise<ApolloQueryResult<any>> {
        return await this.client
            .query({
                query: gql`
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

    async getPromptResult(promptId: string): Promise<ApolloQueryResult<any>> {
        const res = await this.client
            .query({
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
                }`,
                variables: {uuid: promptId} 
            });

        return res;
    }

    async getPromptStatus(promptId: string): Promise<string> {
        const res = await this.client
            .query({
                query: gql`
                query Prompt($uuid: String!) {
                    requestedPrompt(uuid: $uuid) {
                    status
                    }
                }`,
                variables: {uuid: promptId},
                fetchPolicy: "no-cache" 
            });

        return res.data.requestedPrompt.status;
    }

    async requestNewPrompt(prompt: string): Promise<any> {
        return await this.client
            .mutate({
                mutation: gql`
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
                variables: {prompt}
            });    
    }

    
}