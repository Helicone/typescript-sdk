"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetUserLazyQuery = exports.useGetUserQuery = exports.GetUserDocument = exports.PromptsOrderBy = exports.PromptRequestStatus = exports.Params_StableDiffusionV1_4_Sampler = exports.Params_StableDiffusionV1_4_Action = exports.OrderByDirection = exports.ModelType = void 0;
const client_1 = require("@apollo/client");
const Apollo = __importStar(require("@apollo/client"));
const defaultOptions = {};
var ModelType;
(function (ModelType) {
    ModelType["Custom"] = "Custom";
    ModelType["StableDiffusionV1_4"] = "StableDiffusionV1_4";
    ModelType["UnknownAudioV0"] = "UnknownAudioV0";
})(ModelType = exports.ModelType || (exports.ModelType = {}));
var OrderByDirection;
(function (OrderByDirection) {
    OrderByDirection["Asc"] = "Asc";
    OrderByDirection["Dsc"] = "Dsc";
})(OrderByDirection = exports.OrderByDirection || (exports.OrderByDirection = {}));
var Params_StableDiffusionV1_4_Action;
(function (Params_StableDiffusionV1_4_Action) {
    Params_StableDiffusionV1_4_Action["Img2img"] = "img2img";
    Params_StableDiffusionV1_4_Action["InPaint"] = "inPaint";
    Params_StableDiffusionV1_4_Action["Txt2img"] = "txt2img";
})(Params_StableDiffusionV1_4_Action = exports.Params_StableDiffusionV1_4_Action || (exports.Params_StableDiffusionV1_4_Action = {}));
var Params_StableDiffusionV1_4_Sampler;
(function (Params_StableDiffusionV1_4_Sampler) {
    Params_StableDiffusionV1_4_Sampler["Ddim"] = "ddim";
    Params_StableDiffusionV1_4_Sampler["KDpm_2"] = "k_dpm_2";
    Params_StableDiffusionV1_4_Sampler["KDpm_2Ancestral"] = "k_dpm_2_ancestral";
    Params_StableDiffusionV1_4_Sampler["KEuler"] = "k_euler";
    Params_StableDiffusionV1_4_Sampler["KEulerAncestral"] = "k_euler_ancestral";
    Params_StableDiffusionV1_4_Sampler["KHuen"] = "k_huen";
    Params_StableDiffusionV1_4_Sampler["KLms"] = "k_lms";
    Params_StableDiffusionV1_4_Sampler["Plms"] = "plms";
})(Params_StableDiffusionV1_4_Sampler = exports.Params_StableDiffusionV1_4_Sampler || (exports.Params_StableDiffusionV1_4_Sampler = {}));
var PromptRequestStatus;
(function (PromptRequestStatus) {
    PromptRequestStatus["Completed"] = "Completed";
    PromptRequestStatus["Failed"] = "Failed";
    PromptRequestStatus["NotStarted"] = "NotStarted";
    PromptRequestStatus["Started"] = "Started";
})(PromptRequestStatus = exports.PromptRequestStatus || (exports.PromptRequestStatus = {}));
var PromptsOrderBy;
(function (PromptsOrderBy) {
    PromptsOrderBy["CreatedAt"] = "CreatedAt";
    PromptsOrderBy["Id"] = "Id";
    PromptsOrderBy["Status"] = "Status";
})(PromptsOrderBy = exports.PromptsOrderBy || (exports.PromptsOrderBy = {}));
exports.GetUserDocument = (0, client_1.gql) `
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
function useGetUserQuery(baseOptions) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery(exports.GetUserDocument, options);
}
exports.useGetUserQuery = useGetUserQuery;
function useGetUserLazyQuery(baseOptions) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery(exports.GetUserDocument, options);
}
exports.useGetUserLazyQuery = useGetUserLazyQuery;
