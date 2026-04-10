export const MODELS = {
  openai: {
    label: 'OpenAI',
    color: '#10a37f',
    bgClass: 'border-green-600',
    headerBg: 'bg-green-900/30',
    dot: 'bg-green-400',
    models: [
      { id: 'gpt-5.4', label: 'GPT-5.4' },
      { id: 'gpt-5.4-mini', label: 'GPT-5.4 Mini' },
      { id: 'gpt-5.4-nano', label: 'GPT-5.4 Nano' },
    ],
  },
  anthropic: {
    label: 'Claude',
    color: '#7c3aed',
    bgClass: 'border-purple-600',
    headerBg: 'bg-purple-900/30',
    dot: 'bg-purple-400',
    models: [
      { id: 'claude-opus-4-5', label: 'Claude Opus 4.5' },
      { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
      { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
    ],
  },
  google: {
    label: 'Gemini',
    color: '#2563eb',
    bgClass: 'border-blue-600',
    headerBg: 'bg-blue-900/30',
    dot: 'bg-blue-400',
    models: [
      { id: 'gemini-3.1-pro-preview', label: 'Gemini 3 Pro' },
      { id: 'gemini-3-flash-preview', label: 'Gemini 3 Flash' },
      { id: 'gemini-3.1-flash-preview', label: 'Gemini 3 Thinking', thinking: true },
    ],
  },
  seed: {
    label: 'Seed',
    color: '#059669',
    bgClass: 'border-emerald-600',
    headerBg: 'bg-emerald-900/30',
    dot: 'bg-emerald-400',
    models: [
      { id: 'seed-2-0-pro-260328', label: 'Seed 2.0 Pro' },
      { id: 'seed-2-0-lite-260228', label: 'Seed 2.0 Lite' },
      { id: 'seed-1-8-251228', label: 'Seed 1.8' },
    ],
  },
}

export const ALL_MODELS = Object.entries(MODELS).flatMap(([provider, data]) =>
  data.models.map((m) => ({ ...m, provider, providerLabel: data.label }))
)

export function getProvider(modelId) {
  for (const [provider, data] of Object.entries(MODELS)) {
    if (data.models.some((m) => m.id === modelId)) return provider
  }
  return 'anthropic'
}

export function getModelMeta(modelId) {
  const provider = getProvider(modelId)
  const meta = MODELS[provider]
  const model = meta.models.find((m) => m.id === modelId)
  return { provider, ...meta, modelLabel: model?.label ?? modelId, thinking: model?.thinking ?? false }
}

export const DEFAULT_MEMBER = {
  name: '',
  model: 'claude-sonnet-4-5',
  systemPrompt: '',
}

export const DEFAULT_CONSOLIDATOR = {
  model: 'claude-sonnet-4-5',
  systemPrompt:
    "You are a neutral analyst. Below are responses from multiple AI models to the same prompt. Identify:\n1. **Agreements** – Points all or most models agree on\n2. **Disagreements** – Points where models diverge or contradict\n3. **Notable Nuances** – Interesting differences in emphasis, framing, or detail\n\nBe concise and structured.",
}

export const MEMBER_NAMES = [
  'The Empath',
  'The Visionary',
  'The Implementation Lead',
  'The Financialist',
  'The Devils Advocate',
]
