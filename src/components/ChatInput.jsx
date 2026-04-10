import { useRef, useState } from 'react'

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

export default function ChatInput({ onSubmit, disabled, docName, docLoading, onFileSelect, onFileClear, webSearch, onWebSearchToggle }) {
  const [prompt, setPrompt] = useState('')
  const fileRef = useRef()
  const textareaRef = useRef()

  function handleSubmit() {
    if (!prompt.trim() || disabled) return
    onSubmit(prompt.trim())
    setPrompt('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
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

  return (
    <div className="flex-shrink-0 px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
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
            placeholder="Ask the council anything..."
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

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || disabled}
              title="Send (Ctrl+Enter)"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--cc-tx1)] text-[var(--cc-bg)] disabled:bg-[var(--cc-border)] disabled:text-[var(--cc-tx3)] transition-colors"
            >
              {disabled ? (
                <span className="w-3.5 h-3.5 border-2 border-[var(--cc-tx3)] border-t-[var(--cc-bg)] rounded-full animate-spin" />
              ) : (
                <IconSend />
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--cc-tx3)] mt-2">
          Press Ctrl+Enter to send
        </p>
      </div>
    </div>
  )
}
