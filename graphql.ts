import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ApiKey = {
  __typename?: "ApiKey";
  associatedUser: User;
  id: Scalars["ID"];
};

export type Asset = {
  bytes?: InputMaybe<Scalars["String"]>;
  url?: InputMaybe<Scalars["String"]>;
};

export type Audio = {
  __typename?: "Audio";
  url?: Maybe<Scalars["String"]>;
};

export type Image = {
  __typename?: "Image";
  url: Scalars["String"];
};

export enum ModelType {
  Custom = "Custom",
  StableDiffusionV1_4 = "StableDiffusionV1_4",
  UnknownAudioV0 = "UnknownAudioV0",
}

export type Mutation = {
  __typename?: "Mutation";
  requestNewPrompt?: Maybe<PromptRequest>;
};

export type MutationRequestNewPromptArgs = {
  body: PromptRequestBody;
};

export enum OrderByDirection {
  Asc = "Asc",
  Dsc = "Dsc",
}

export type Params_Custom = {
  jsonb?: InputMaybe<Scalars["String"]>;
};

export type Params_StableDiffusionV1_4 = {
  action?: Params_StableDiffusionV1_4_Action;
  cfgScale?: InputMaybe<Scalars["Int"]>;
  height?: Scalars["Int"];
  inputImage?: InputMaybe<Asset>;
  nSamples?: InputMaybe<Scalars["Int"]>;
  prompt: Scalars["String"];
  sampler?: InputMaybe<Params_StableDiffusionV1_4_Sampler>;
  seed?: InputMaybe<Scalars["Int"]>;
  steps?: InputMaybe<Scalars["Int"]>;
  width?: Scalars["Int"];
};

export enum Params_StableDiffusionV1_4_Action {
  Img2img = "img2img",
  InPaint = "inPaint",
  Txt2img = "txt2img",
}

export enum Params_StableDiffusionV1_4_Sampler {
  Ddim = "ddim",
  KDpm_2 = "k_dpm_2",
  KDpm_2Ancestral = "k_dpm_2_ancestral",
  KEuler = "k_euler",
  KEulerAncestral = "k_euler_ancestral",
  KHuen = "k_huen",
  KLms = "k_lms",
  Plms = "plms",
}

export type Params_UnknownAudioV0 = {
  dimSteps?: InputMaybe<Scalars["Int"]>;
  nSamples?: InputMaybe<Scalars["Int"]>;
  prompt: Scalars["String"];
};

export type PromptRequest = {
  __typename?: "PromptRequest";
  _userId: Scalars["ID"];
  createdAt?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  modelType: ModelType;
  params?: Maybe<RequestModelParams>;
  prompt: Scalars["String"];
  result?: Maybe<PromptResult>;
  status: PromptRequestStatus;
  user?: Maybe<User>;
};

export type PromptRequestBody = {
  custom?: InputMaybe<Params_Custom>;
  name?: InputMaybe<Scalars["String"]>;
  stableDiffusionV1_4?: InputMaybe<Params_StableDiffusionV1_4>;
  unknownAudioV0?: InputMaybe<Params_UnknownAudioV0>;
};

export enum PromptRequestStatus {
  Completed = "Completed",
  Failed = "Failed",
  NotStarted = "NotStarted",
  Started = "Started",
}

export type PromptResult = Result_StableDiffusionV1_4 | Result_UnknownAudioV0;

export enum PromptsOrderBy {
  CreatedAt = "CreatedAt",
  Id = "Id",
  Status = "Status",
}

export type Query = {
  __typename?: "Query";
  apiKey?: Maybe<ApiKey>;
  requestedPrompt?: Maybe<PromptRequest>;
  requestedPrompts?: Maybe<Array<Maybe<PromptRequest>>>;
  user?: Maybe<User>;
};

export type QueryRequestedPromptArgs = {
  uuid: Scalars["String"];
};

export type QueryRequestedPromptsArgs = {
  after?: InputMaybe<Scalars["Int"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<RequestedPromptsOrderBy>;
};

export type RequestModelParams =
  | ResultParams_Custom
  | ResultParams_StableDiffusionV1_4
  | ResultParams_UnknownAudioV0;

export type RequestedPromptsOrderBy = {
  direction?: InputMaybe<OrderByDirection>;
  orderBy?: InputMaybe<PromptsOrderBy>;
};

export type ResultAsset = {
  __typename?: "ResultAsset";
  url?: Maybe<Scalars["String"]>;
};

export type ResultParams_Custom = {
  __typename?: "ResultParams_Custom";
  jsonb?: Maybe<Scalars["String"]>;
};

export type ResultParams_StableDiffusionV1_4 = {
  __typename?: "ResultParams_StableDiffusionV1_4";
  action: Params_StableDiffusionV1_4_Action;
  cfgScale: Scalars["Int"];
  height: Scalars["Int"];
  inputImage?: Maybe<ResultAsset>;
  nSamples: Scalars["Int"];
  prompt: Scalars["String"];
  sampler: Params_StableDiffusionV1_4_Sampler;
  seed: Scalars["Int"];
  steps: Scalars["Int"];
  width: Scalars["Int"];
};

export type ResultParams_UnknownAudioV0 = {
  __typename?: "ResultParams_UnknownAudioV0";
  nSamples: Scalars["Int"];
};

export type Result_StableDiffusionV1_4 = {
  __typename?: "Result_StableDiffusionV1_4";
  id: Scalars["ID"];
  images: Array<Image>;
  request: PromptRequest;
};

export type Result_UnknownAudioV0 = {
  __typename?: "Result_UnknownAudioV0";
  audioFiles: Array<Audio>;
  id: Scalars["ID"];
  request: PromptRequest;
};

export type User = {
  __typename?: "User";
  apiKeys?: Maybe<Array<ApiKey>>;
  id: Scalars["ID"];
  requestedPrompts?: Maybe<Array<PromptRequest>>;
};

export type GetUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserQuery = {
  __typename?: "Query";
  user?: { __typename?: "User"; id: string } | null;
};

export const GetUserDocument = gql`
  query getUser {
    user {
      id
    }
  }
`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(
  baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(
    GetUserDocument,
    options
  );
}
export function useGetUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(
    GetUserDocument,
    options
  );
}
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<
  GetUserQuery,
  GetUserQueryVariables
>;
