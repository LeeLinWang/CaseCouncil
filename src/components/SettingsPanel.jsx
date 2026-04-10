import { useState } from 'react'
import ModelSelect from './ModelSelect'
import { MEMBER_NAMES } from '../constants'

function ApiKeyInput({ label, value, onChange }) {
  const [show, setShow] = useState(false)
  const isSet = value && value.length > 0
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSet ? 'bg-green-500' : 'bg-red-400'}`} />
        <label className="text-sm font-medium text-[var(--cc-tx1)]">{label}</label>
      </div>
      <div className="flex gap-2">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label} API key`}
          className="flex-1 bg-[var(--cc-bg)] border border-[var(--cc-border)] rounded-lg px-3 py-2 text-sm text-[var(--cc-tx1)] placeholder-[var(--cc-tx3)] focus:outline-none focus:border-[var(--cc-focus)] font-mono transition-colors"
        />
        <button
          onClick={() => setShow((s) => !s)}
          className="px-3 py-2 bg-[var(--cc-subtle)] hover:bg-[var(--cc-hover)] border border-[var(--cc-border)] rounded-lg text-sm text-[var(--cc-tx1)] transition-colors"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  )
}

function MemberConfig({ member, index, onChange }) {
  return (
    <div className="bg-[var(--cc-bg)] rounded-xl p-4 space-y-3 border border-[var(--cc-border)]">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-[var(--cc-tx1)] text-[var(--cc-bg)] text-xs flex items-center justify-center font-semibold flex-shrink-0">
          {index + 1}
        </span>
        <input
          type="text"
          value={member.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={MEMBER_NAMES[index] ?? `Member ${index + 1}`}
          className="flex-1 bg-[var(--cc-card)] border border-[var(--cc-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--cc-tx1)] placeholder-[var(--cc-tx3)] focus:outline-none focus:border-[var(--cc-focus)] transition-colors"
        />
      </div>
      <ModelSelect
        value={member.model}
        onChange={(model) => onChange({ model })}
        className="w-full"
      />
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[var(--cc-tx3)]">Persona</span>
          {member.systemPrompt && (
            <button
              onClick={() => onChange({ systemPrompt: '' })}
              className="text-xs text-[var(--cc-tx3)] hover:text-[var(--cc-tx1)] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={member.systemPrompt}
          onChange={(e) => onChange({ systemPrompt: e.target.value })}
          placeholder="System prompt / persona for this member..."
          rows={3}
          className="w-full bg-[var(--cc-card)] border border-[var(--cc-border)] rounded-lg px-3 py-2 text-sm text-[var(--cc-tx1)] placeholder-[var(--cc-tx3)] focus:outline-none focus:border-[var(--cc-focus)] resize-none transition-colors"
        />
      </div>
    </div>
  )
}

export default function SettingsPanel({ store, onClose, initialSection = 'customize' }) {
  const { members, setCouncilSize, updateMember, consolidator, setConsolidator, consolidatorEnabled, setConsolidatorEnabled, apiKeys, setApiKeys } = store
  const [section, setSection] = useState(initialSection)

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-lg bg-[var(--cc-card)] border-l border-[var(--cc-border)] h-full overflow-y-auto flex flex-col shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--cc-card)] border-b border-[var(--cc-border)] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-1">
            {['customize', 'apikeys'].map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  section === s
                    ? 'bg-[var(--cc-tx1)] text-[var(--cc-bg)]'
                    : 'text-[var(--cc-tx2)] hover:text-[var(--cc-tx1)] hover:bg-[var(--cc-subtle)]'
                }`}
              >
                {s === 'customize' ? 'Customize' : 'API Keys'}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--cc-tx2)] hover:text-[var(--cc-tx1)] hover:bg-[var(--cc-subtle)] transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {section === 'apikeys' && (
            <section className="space-y-5">
              <div>
                <h3 className="text-base font-semibold text-[var(--cc-tx1)] mb-1">API Keys</h3>
                <p className="text-sm text-[var(--cc-tx2)]">Keys are stored locally in your browser and never sent to any server.</p>
              </div>
              <ApiKeyInput label="OpenAI" value={apiKeys.openai} onChange={(v) => setApiKeys({ ...apiKeys, openai: v })} />
              <ApiKeyInput label="Anthropic" value={apiKeys.anthropic} onChange={(v) => setApiKeys({ ...apiKeys, anthropic: v })} />
              <ApiKeyInput label="Google" value={apiKeys.google} onChange={(v) => setApiKeys({ ...apiKeys, google: v })} />
              <ApiKeyInput label="Seed (ByteDance)" value={apiKeys.seed} onChange={(v) => setApiKeys({ ...apiKeys, seed: v })} />
            </section>
          )}

          {section === 'customize' && (
            <>
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[var(--cc-tx1)]">Council Members</h3>
                    <p className="text-sm text-[var(--cc-tx2)] mt-0.5">Configure each AI model and their persona.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--cc-tx2)]">Size</span>
                    <select
                      value={members.length}
                      onChange={(e) => setCouncilSize(Number(e.target.value))}
                      className="bg-[var(--cc-bg)] border border-[var(--cc-border)] rounded-lg px-2 py-1 text-sm text-[var(--cc-tx1)] focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  {members.map((member, i) => (
                    <MemberConfig key={member.id} member={member} index={i} onChange={(patch) => updateMember(i, patch)} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[var(--cc-tx1)]">Consolidator</h3>
                    <p className="text-sm text-[var(--cc-tx2)] mt-0.5">Synthesises all council responses into a final analysis.</p>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => setConsolidatorEnabled(!consolidatorEnabled)}
                    title={consolidatorEnabled ? 'Disable consolidator' : 'Enable consolidator'}
                    className="relative flex-shrink-0 w-10 h-5 rounded-full focus:outline-none transition-colors duration-200"
                    style={{ backgroundColor: consolidatorEnabled ? 'var(--cc-tx1)' : 'var(--cc-hover)' }}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow-sm transition-transform duration-200"
                      style={{
                        backgroundColor: 'var(--cc-card)',
                        transform: consolidatorEnabled ? 'translateX(20px)' : 'translateX(0px)',
                      }}
                    />
                  </button>
                </div>
                <div
                  className="bg-[var(--cc-bg)] rounded-xl p-4 space-y-3 border border-[var(--cc-border)] transition-opacity"
                  style={{ opacity: consolidatorEnabled ? 1 : 0.4, pointerEvents: consolidatorEnabled ? 'auto' : 'none' }}
                >
                  <ModelSelect
                    value={consolidator.model}
                    onChange={(model) => setConsolidator({ ...consolidator, model })}
                    className="w-full"
                  />
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[var(--cc-tx3)]">Persona</span>
                      {consolidator.systemPrompt && (
                        <button
                          onClick={() => setConsolidator({ ...consolidator, systemPrompt: '' })}
                          className="text-xs text-[var(--cc-tx3)] hover:text-[var(--cc-tx1)] transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <textarea
                      value={consolidator.systemPrompt}
                      onChange={(e) => setConsolidator({ ...consolidator, systemPrompt: e.target.value })}
                      rows={5}
                      placeholder="System prompt for the consolidator..."
                      className="w-full bg-[var(--cc-card)] border border-[var(--cc-border)] rounded-lg px-3 py-2 text-sm text-[var(--cc-tx1)] placeholder-[var(--cc-tx3)] focus:outline-none focus:border-[var(--cc-focus)] resize-none transition-colors"
                    />
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
