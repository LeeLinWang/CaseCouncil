import { useRef, useState } from 'react'
import { MODELS } from '../constants'

function IconAttach() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function IconStop() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <rect x="1" y="1" width="10" height="10" rx="2" />
    </svg>
  )
}

export default function ChatInput({
  onSubmit, disabled, onStop,
  docName, docLoading, onFileSelect, onFileClear,
  webSearch, onWebSearchToggle,
  canToggleMode, mode, onModeChange,
  soloModel, onSoloModelChange,
  onOpenSettings,
  onOpenConsolidatorSettings,
  consolidatorEnabled, onConsolidatorToggle,
}) {
  const [prompt, setPrompt] = useState('')
  const fileRef = useRef()
  const textareaRef = useRef()

  function handleSubmit() {
    if (!prompt.trim() || disabled) return
    onSubmit(prompt.trim())
    setPrompt('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKey(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit()
  }

  function handleInput(e) {
    setPrompt(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  const placeholder = mode === 'solo' ? 'Ask the AI anything...' : 'Ask the council anything...'

  return (
    <div className="flex-shrink-0 px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">

        {/* Mode toggle — appears after first council run */}
        {canToggleMode && (
          <div className="mb-2 flex items-center gap-2">
            <div
              className="flex items-center rounded-lg p-0.5 gap-0.5"
              style={{ backgroundColor: 'var(--cc-subtle)', border: '1px solid var(--cc-border)' }}
            >
              {['council', 'solo'].map((m) => (
                <button
                  key={m}
                  onClick={() => onModeChange(m)}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-colors"
                  style={
                    mode === m
                      ? { backgroundColor: 'var(--cc-tx1)', color: 'var(--cc-bg)' }
                      : { color: 'var(--cc-tx2)' }
                  }
                >
                  {m === 'council' ? 'Council' : 'Solo AI'}
                </button>
              ))}
            </div>

            {/* Customize + Consolidator buttons — visible only in council mode */}
            {mode === 'council' && (
              <>
                <button
                  onClick={onOpenSettings}
                  className="h-7 px-2.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: 'var(--cc-subtle)',
                    border: '1px solid var(--cc-border)',
                    color: 'var(--cc-tx2)',
                  }}
                >
                  Customize
                </button>
                <div className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ backgroundColor: 'var(--cc-subtle)', border: '1px solid var(--cc-border)', color: 'var(--cc-tx2)' }}
                >
                  <span
                    onClick={onConsolidatorToggle}
                    className="relative inline-flex items-center w-7 h-4 rounded-full transition-colors flex-shrink-0 cursor-pointer"
                    style={{ backgroundColor: consolidatorEnabled ? 'var(--cc-tx1)' : 'var(--cc-border)' }}
                  >
                    <span
                      className="absolute w-3 h-3 bg-white rounded-full shadow transition-transform"
                      style={{ transform: consolidatorEnabled ? 'translateX(14px)' : 'translateX(2px)' }}
                    />
                  </span>
                  <span onClick={onOpenConsolidatorSettings} className="cursor-pointer hover:text-[var(--cc-tx1)] transition-colors">
                    Consolidator
                  </span>
                </div>
              </>
            )}

            {/* Solo model dropdown — visible only in solo mode */}
            {mode === 'solo' && (
              <select
                value={soloModel}
                onChange={(e) => onSoloModelChange(e.target.value)}
                className="h-7 rounded-lg px-2 text-xs focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--cc-subtle)',
                  border: '1px solid var(--cc-border)',
                  color: 'var(--cc-tx1)',
                }}
              >
                {Object.entries(MODELS).map(([, data]) => (
                  <optgroup key={data.label} label={data.label}>
                    {data.models.map((m) => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Doc attachment chip */}
        {docName && (
          <div className="mb-2 flex items-center gap-2 bg-[var(--cc-card)] border border-[var(--cc-border)] rounded-full px-3 py-1.5 text-sm text-[var(--cc-tx2)] w-fit shadow-sm">
            <IconAttach />
            <span className="truncate max-w-xs text-xs">{docName}</span>
            <button onClick={onFileClear} className="text-[var(--cc-tx3)] hover:text-[var(--cc-tx1)] transition-colors ml-1">
              <IconX />
            </button>
          </div>
        )}

        {/* Input box */}
        <div className="bg-[var(--cc-input)] border border-[var(--cc-border)] rounded-2xl shadow-sm overflow-hidden focus-within:border-[var(--cc-focus)] transition-colors">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={handleInput}
            onKeyDown={handleKey}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            className="w-full px-4 pt-3.5 pb-2 text-sm text-[var(--cc-tx1)] placeholder-[var(--cc-tx3)] focus:outline-none resize-none bg-transparent disabled:opacity-50 leading-relaxed"
            style={{ maxHeight: '200px', overflowY: 'auto' }}
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
            <div className="flex items-center gap-1">
              {/* Attach */}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={docLoading}
                title="Attach document (PDF, TXT, MD)"
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors disabled:opacity-40 ${
                  docName
                    ? 'text-[var(--cc-tx1)] bg-[var(--cc-subtle)]'
                    : 'text-[var(--cc-tx2)] hover:text-[var(--cc-tx1)] hover:bg-[var(--cc-subtle)]'
                }`}
              >
                {docLoading ? (
                  <span className="w-4 h-4 border-2 border-[var(--cc-border)] border-t-[var(--cc-tx1)] rounded-full animate-spin" />
                ) : (
                  <IconAttach />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.pdf,.md"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) onFileSelect(e.target.files[0]); e.target.value = '' }}
              />

              {/* Web search toggle */}
              <button
                onClick={onWebSearchToggle}
                title={webSearch ? 'Web search on — click to disable' : 'Enable web search'}
                className={`flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs font-medium transition-colors ${
                  webSearch
                    ? 'bg-[var(--cc-tx1)] text-[var(--cc-bg)]'
                    : 'text-[var(--cc-tx2)] hover:text-[var(--cc-tx1)] hover:bg-[var(--cc-subtle)]'
                }`}
              >
                <IconGlobe />
                <span>Search</span>
              </button>
            </div>

            {/* Stop / Send button */}
            {disabled ? (
              <button
                onClick={onStop}
                title="Stop generation"
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--cc-tx1)', color: 'var(--cc-bg)' }}
              >
                <IconStop />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                title="Send (Ctrl+Enter)"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--cc-tx1)] text-[var(--cc-bg)] disabled:bg-[var(--cc-border)] disabled:text-[var(--cc-tx3)] transition-colors"
              >
                <IconSend />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[var(--cc-tx3)] mt-2">
          Press Ctrl+Enter to send
        </p>
      </div>
    </div>
  )
}
