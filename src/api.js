import { getProvider, getModelMeta } from './constants'

// ── OpenAI ────────────────────────────────────────────────────────────────────
// Docs: https://developers.openai.com/api/reference/resources/responses/methods/create
// Auth: Authorization: Bearer <api_key>
// Endpoint: /v1/responses  (Responses API — not Chat Completions)
// Web search: built-in tool type "web_search_preview"
// Response: data.output[] — filter type='message', content[].type='output_text'
async function callOpenAI({ model, systemPrompt, userMessage, messages, apiKey, webSearch, signal }) {
  // Multi-turn: use Chat Completions so we can pass conversation history
  if (messages) {
    const body = {
      model,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...messages,
      ],
      max_completion_tokens: 4096,
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message ?? `OpenAI ${res.status}: ${res.statusText}`)
    }
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() ?? '(no response)'
  }

  // Single-turn: Responses API
  const tools = webSearch
    ? [{ type: 'web_search_preview' }]
    : undefined

  const body = {
    model,
    input: userMessage,
    ...(systemPrompt ? { instructions: systemPrompt } : {}),
    max_output_tokens: 4096,
    ...(tools ? { tools } : {}),
  }

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `OpenAI ${res.status}: ${res.statusText}`)
  }

  const data = await res.json()

  if (data.status === 'failed') {
    throw new Error(`OpenAI error: ${data.error?.message ?? 'Unknown error'}`)
  }

  const text = (data.output ?? [])
    .filter((item) => item.type === 'message')
    .flatMap((item) => item.content ?? [])
    .filter((c) => c.type === 'output_text')
    .map((c) => c.text)
    .join('\n')
    .trim()

  return text || '(no response)'
}

// ── Anthropic ─────────────────────────────────────────────────────────────────
// Docs: https://docs.anthropic.com/en/api/messages
// useCache: when true, marks the system prompt with cache_control so the large
// council context is billed once and reused across solo conversation turns.
async function callAnthropic({ model, systemPrompt, userMessage, messages, apiKey, webSearch, useCache, signal }) {
  const tools = webSearch
    ? [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }]
    : undefined

  // Cache the system prompt block when requested — Anthropic stores it server-side
  // for the duration of the session so subsequent turns don't re-bill that prefix.
  const systemField = systemPrompt
    ? useCache
      ? [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }]
      : systemPrompt
    : undefined

  const body = {
    model,
    max_tokens: 8096,
    ...(systemField !== undefined ? { system: systemField } : {}),
    messages: messages ?? [{ role: 'user', content: userMessage }],
    ...(tools ? { tools } : {}),
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      ...(useCache ? { 'anthropic-beta': 'prompt-caching-2024-07-31' } : {}),
    },
    body: JSON.stringify(body),
    signal,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Anthropic ${res.status}`)
  }

  const data = await res.json()
  // Content blocks: type='text' is the response, type='tool_use' is web search — skip tool_use
  return data.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim()
}

// ── Google Gemini ─────────────────────────────────────────────────────────────
// Docs: https://ai.google.dev/api/generate-content
// Models : gemini-3.1-pro-preview | gemini-3-flash-preview | gemini-3.1-flash-preview
// Thinking (Gemini 3): thinkingConfig.thinkingLevel = "high" | "minimal"
//   — do NOT use thinkingBudget with Gemini 3 (that was Gemini 2.5 only)
// Grounding: tools: [{ google_search: {} }]
// Thought parts: parts where part.thought === true — must be filtered from output
// Temperature: 1.0 recommended for Gemini 3
async function callGemini({ model, systemPrompt, userMessage, messages, apiKey, webSearch, signal }) {
  const meta = getModelMeta(model)
  const isThinking = meta.thinking

  // Grounding with Google Search
  const tools = webSearch ? [{ google_search: {} }] : undefined

  // thinkingConfig is only supported on Gemini 2.5+ models.
  // Sending it to 2.0 Flash causes an API error, so gate on model ID.
  const supportsThinking = model.startsWith('gemini-2.5') || model.startsWith('gemini-3')
  const thinkingConfig = supportsThinking
    ? isThinking
      ? { thinkingLevel: 'high', includeThoughts: true }
      : { thinkingLevel: 'minimal' }
    : undefined

  const generationConfig = {
    maxOutputTokens: isThinking ? 16000 : 8192,
    temperature: 1.0,
    ...(thinkingConfig ? { thinkingConfig } : {}),
  }

  // Gemini uses 'model' instead of 'assistant' for the AI role
  const contents = messages
    ? messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))
    : [{ role: 'user', parts: [{ text: userMessage }] }]

  const body = {
    contents,
    ...(systemPrompt
      ? { systemInstruction: { parts: [{ text: systemPrompt }] } }
      : {}),
    ...(tools ? { tools } : {}),
    generationConfig,
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Gemini ${res.status}: ${res.statusText}`)
  }

  const data = await res.json()

  // Check for prompt blocking
  if (data.promptFeedback?.blockReason) {
    throw new Error(`Gemini blocked: ${data.promptFeedback.blockReason}`)
  }

  const parts = data.candidates?.[0]?.content?.parts ?? []
  const finishReason = data.candidates?.[0]?.finishReason

  if (finishReason === 'SAFETY') {
    throw new Error('Gemini response blocked by safety filters')
  }

  // Filter out thinking parts (thought === true) — only return the final answer
  const text = parts
    .filter((p) => typeof p.text === 'string' && !p.thought)
    .map((p) => p.text)
    .join('\n')
    .trim()

  return text || '(no response)'
}

// ── Seed / ByteDance (BytePlus ModelArk) ─────────────────────────────────────
// Docs: https://docs.byteplus.com/en/docs/ModelArk/1399009
// Endpoint : ark.ap-southeast.bytepluses.com  (SE-Asia region)
// Auth     : Authorization: Bearer <api_key>
// Models   : seed-2-0-pro-260328 | seed-2-0-lite-260228 | seed-1-8-251228
// Thinking : thinking object  { type: "enabled", budget_tokens: N }
//            or               { type: "disabled" }
// Content  : user message content is an array of typed parts
//            documents are passed as a dedicated text part before the question

// Sentinel prefix App.jsx uses when a file is attached
const DOC_PREFIX = '[Document: '

function buildSeedUserContent(userMessage) {
  // If App.jsx prepended a document, split it into two separate content parts
  // so the model clearly distinguishes file content from the user question.
  if (userMessage.startsWith(DOC_PREFIX)) {
    const headerEnd = userMessage.indexOf(']\n\n')
    const sepIdx = userMessage.indexOf('\n\n---\n\n')

    if (headerEnd !== -1 && sepIdx !== -1) {
      const docHeader = userMessage.slice(0, headerEnd + 1)    // "[Document: filename]"
      const docBody   = userMessage.slice(headerEnd + 3, sepIdx) // extracted file text
      const question  = userMessage.slice(sepIdx + 7)            // user question

      return [
        { type: 'text', text: `${docHeader}\n\n${docBody}` },
        { type: 'text', text: question },
      ]
    }
  }

  // No document — single text part
  return [{ type: 'text', text: userMessage }]
}

async function callSeed({ model, systemPrompt, userMessage, messages: incomingMessages, apiKey, webSearch, signal }) {
  const meta = getModelMeta(model)
  const isThinking = meta.thinking

  const messages = []

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }

  if (incomingMessages) {
    // Multi-turn: messages already have plain string content
    messages.push(...incomingMessages)
  } else {
    // Single-turn: use typed content parts (handles document splitting)
    messages.push({
      role: 'user',
      content: buildSeedUserContent(userMessage),
    })
  }

  // Web search via function calling — Seed has no built-in search tool
  const tools = webSearch
    ? [{
        type: 'function',
        function: {
          name: 'web_search',
          description: 'Search the web for up-to-date information on a topic.',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'The search query.' },
            },
            required: ['query'],
          },
        },
      }]
    : undefined

  // thinking object format (Seed 2.0 API — NOT a boolean)
  const thinkingParam = isThinking
    ? { thinking: { type: 'enabled', budget_tokens: 6000 } }
    : { thinking: { type: 'disabled' } }

  const body = {
    model,
    messages,
    max_tokens: 4096,
    temperature: 0.7,
    ...thinkingParam,
    ...(tools ? { tools, tool_choice: 'auto' } : {}),
  }

  const res = await fetch(
    'https://ark.ap-southeast.bytepluses.com/api/v3/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Seed ${res.status}: ${res.statusText}`)
  }

  const data = await res.json()
  const choice = data.choices?.[0]

  // Model triggered a function call — surface the call arguments as readable text
  if (choice?.finish_reason === 'tool_calls') {
    const calls = choice.message?.tool_calls ?? []
    const callText = calls
      .map((c) => {
        try {
          const args = JSON.parse(c.function?.arguments ?? '{}')
          return `**${c.function?.name}**: ${JSON.stringify(args)}`
        } catch {
          return `**${c.function?.name}**: ${c.function?.arguments}`
        }
      })
      .join('\n')
    const partial = choice.message?.content ? `${choice.message.content}\n\n` : ''
    return `${partial}_[Tool invoked]_\n${callText}`
  }

  return choice?.message?.content?.trim() ?? '(no response)'
}

// ── Dispatcher ────────────────────────────────────────────────────────────────
export async function callModel({ model, systemPrompt, userMessage, messages, apiKeys, webSearch, useCache, signal }) {
  const provider = getProvider(model)

  const map = {
    openai: callOpenAI,
    anthropic: callAnthropic,
    google: callGemini,
    seed: callSeed,
  }

  const fn = map[provider]
  if (!fn) throw new Error(`Unknown provider: ${provider}`)

  const apiKey = apiKeys[provider]
  if (!apiKey) throw new Error(`No API key set for ${provider}`)

  return fn({ model, systemPrompt, userMessage, messages, apiKey, webSearch, useCache, signal })
}
