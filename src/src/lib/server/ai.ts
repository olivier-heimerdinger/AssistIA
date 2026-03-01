import OpenAI from 'openai';
import { env } from '$env/dynamic/private';

const provider = env.AI_PROVIDER || 'lmstudio';

export function getAIClient() {
    if (provider === 'openai') {
        const apiKey = env.AI_KEY_OPENAI;
        if (!apiKey) throw new Error("AI_KEY_OPENAI is missing in environment variables");

        return new OpenAI({
            apiKey: apiKey,
        });
    }

    if (provider === 'lmstudio') {
        const localEndpoint = env.AI_ENDPOINT_LOCAL || 'http://127.0.0.1:1234/v1';

        // LM Studio provides an OpenAI compatible API
        return new OpenAI({
            baseURL: localEndpoint,
            apiKey: 'lm-studio', // API key is not required for local LM Studio, but SDK expects a string
        });
    }

    throw new Error(`Unsupported AI Provider: ${provider}`);
}

export function getAIModel() {
    if (provider === 'openai') return env.AI_MODEL_OPENAI || 'gpt-4o';
    return env.AI_MODEL_LOCAL || 'local-model'; // LM Studio often ignores the model name if one is loaded
}
