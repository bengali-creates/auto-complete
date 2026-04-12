import { ApiConfig, ApiProvider } from '@/types';

export const API_CONFIGS: Record<ApiProvider, ApiConfig> = {
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash',
    keyPlaceholder: 'AIza...',
    helpUrl: 'https://aistudio.google.com/app/apikey',
  },
  groq: {
    name: 'Groq (Llama 3.1)',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-70b-versatile',
    keyPlaceholder: 'gsk_...',
    helpUrl: 'https://console.groq.com/keys',
  },
  together: {
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1/chat/completions',
    model: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo',
    keyPlaceholder: 'sk-...',
    helpUrl: 'https://api.together.xyz/settings/api-keys',
  },
};
